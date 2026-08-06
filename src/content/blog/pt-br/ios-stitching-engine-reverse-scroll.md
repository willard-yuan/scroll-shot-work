---
title: "Os usuários insistiram em rolar para cima para capturar — e eu evitei reescrever todo o motor com uma única linha"
description: "Quando os usuários querem capturar um long screenshot iPhone rolando para cima, meu primeiro instinto foi construir um « motor ascendente » separado. No fim, uma única linha de código foi suficiente. Este post detalha o design de stitching com rolagem reversa do ScrollShot, a técnica por trás de uma captura de tela que rola perfeitamente em apps como Messages e WhatsApp, e mostra como detectamos a direção da rolagem, invertemos a ordem dos frames e reutilizamos o pipeline descendente existente. Você verá por que a detecção de direção é quase de graça, por que invertemos a ordem dos frames em vez de adicionar uma flag isReversed, e como devolvemos a decisão ao usuário quando a confiança é baixa, para capturar sem o motor errar."
date: "2026-07-12"
category: "Técnica"
author: "Equipe ScrollShot"
tags: ["Captura longa iPhone", "Captura de rolagem iPhone", "Captura longa iOS", "Algoritmo de costura de capturas", "Rolagem inversa", "Detecção de direção de rolagem", "Motor ScrollShot", "Costura de gravação de tela"]
readingTime: "6 min de leitura"
cover: "/ios_stitching_engine_reverse_scroll_framework_en.webp"
coverAlt: "Diagrama de matching de template reverso do ScrollShot para uma captura de tela que rola iPhone: pegue o template do topo do novo frame, procure o deslocamento na parte inferior do frame antigo"
translationKey: "ios-stitching-engine-reverse-scroll"
---

# Os usuários insistiram em rolar para cima para capturar — e eu evitei reescrever todo o motor com uma única linha

A maioria de quem quer um long screenshot iPhone — ou qualquer captura de rolagem iPhone dentro de um app — assume que o usuário rola de cima para baixo. O motor de stitching do ScrollShot também foi desenhado assim no começo — escrevi a história completa em <a href="/pt-br/blog/ios-stitching-engine-v2/">« Quão difícil é juntar duas capturas de tela? Um motor de stitching para iOS que me fez recomeçar — de novo e de novo »</a>: gravar → amostrar frames em intervalos iguais → matching de template por frame para calcular o deslocamento → achar a melhor costura → recortar e costurar. Esse pipeline já é sólido para o caso de cima para baixo.

Mas o mundo real adora contestar. Os usuários querem capturar uma captura de rolagem iPhone de um chat — Messages, WhatsApp ou WeChat — ou salvar a parte de uma página web que rolaram para cima para ver, exatamente o caso de « captura de página inteira em app iPhone » que todo mundo pergunta — e ao gravar, o dedo desliza para cima. O conteúdo flui de trás para frente na gravação: começa no final da página e o « fim » é na verdade o conteúdo mais antigo. Jogue isso direto no motor de cima para baixo e você obtém uma imagem de cabeça para baixo: o topo visual é o conteúdo antigo do fim da gravação, e a base é o começo.

Este post é sobre como o ScrollShot suporta a costura de baixo para cima. O ponto não é um algoritmo profundo — é um trade-off de design extremo na pouca quantidade de código necessária.

Primeiro, uma demo padrão de stitching de cima para baixo — o stitching reverso que vamos discutir se constrói diretamente sobre ela:

<div class="blog-demo">
	<video src="/ScrollShot_Preview_En_0509.mp4" poster="/ScrollShot_Preview_En_0509_cover.jpg" controls playsinline preload="metadata"></video>
	<p>Demo de stitching de rolagem de cima para baixo: grave uma vez, role uma vez, e o ScrollShot amostra os frames automaticamente, casa a sobreposição e costura um long screenshot iPhone completo.</p>
</div>

---

## Primeiro instinto: construir um « motor ascendente » separado?

A primeira vez que encarei esse requisito, meu instinto foi: já temos um motor de stitching descendente, então por que não escrever um ascendente também?

Eu me dissuadi rapidamente. O núcleo do motor descendente é o matching de template reverso: pega o template do topo do novo frame (img2) e procura na base do frame antigo (img1) para calcular o deslocamento. Virar para ascendente faz quase toda coordenada inverter — de onde vem o template, para onde varre a busca, como deslocamentos positivo/negativo são definidos, como a região de costura sobreposta é calculada… Um motor de 3.000 linhas significaria criar um irmão paralelo, cada um com seus próprios bugs e sua própria manutenção. Pior, qualquer correção no motor descendente teria de ser espelhada no ascendente, ou os dois divergiriam silenciosamente.

## A virada: inverter, depois reutilizar

O que de fato me fez parar foi uma observação simples: o motor de stitching não se importa com como o conteúdo « flui » — só se importa com qual de dois frames adjacentes está em cima e qual está embaixo. Desde que a sequência de frames seja ordenada pela linha do tempo real do conteúdo, o mesmo algoritmo funciona perfeitamente. Imagens de baixo para cima estão apenas « fora de ordem ».

Então a abordagem do ScrollShot é: detectar primeiro a direção da rolagem; se for ascendente, inverter toda a sequência de frames e então jogá-la no pipeline descendente existente.

```
Amostragem de frames (rolagem ascendente, conteúdo flui de trás para frente):
  [F1 base da página] → [F2] → [F3] → … → [Fn topo da página]
                                 │
             ScrollDirectionDetector decide: ascendente
                                 │
              reversedForStitching() inverte a ordem dos frames
                                 ▼
  [Fn topo da página] → … → [F3] → [F2] → [F1 base da página]
                                 │
              no mesmo motor de stitching descendente (zero mudanças)
                                 ▼
                   imagem longa correta (topo → base)
```

O diagrama abaixo desenha toda a cadeia « inverter + reutilizar » — amostragem de frames, detecção de direção, inversão da ordem dos frames, reutilização do motor descendente, até a imagem longa correta:

![Diagrama do algoritmo de stitching de rolagem de baixo para cima](/ios_stitching_engine_reverse_scroll_framework_en.webp)

O código central é apenas uma linha:

```swift
let normalizedBatch = reverseFrames ? batch.reversedForStitching() : batch
```

`reversedForStitching()` inverte as referências dos frames extraídos e renumera; todo o resto fica intocado. Após a inversão, o conteúdo « fluindo de trás » volta a « fluir para frente », e o matching de template, o NCC e a lógica de costura a jusante não precisam de uma única linha alterada. Zero novo código de stitching.

> ⚠️ Armadilha: por que « inverter a ordem dos frames » e não « adicionar uma flag `isReversed` dentro do motor »? Porque o segundo transforma cada sistema de coordenadas em duas cópias de lógica — « frente / verso » — dobrando a superfície de bugs. Ao mover a transformação para antes de alimentar os dados, o motor sempre encara um único mundo.

## Detecção de direção: o único código novo — e é quase de graça

Como invertemos, a pré-condição é reconhecer que o usuário rolou para cima. Se essa etapa for pesada, toda a economia acima é desperdiçada. A abordagem do ScrollShot é leve, e esperta a ponto de ser quase « de graça » — reutilizar o motor de matching de template existente, só trocando os parâmetros e rodando duas vezes.

`ScrollDirectionDetector` amostra uniformemente umas 7 duplas de frames adjacentes do meio da gravação (evitando a contagem regressiva no início e o botão de parar no fim), e para cada dupla executa o mesmo matcher duas vezes:

```swift
let down = directionalScore(previous: prev, current: cur)  // prev→cur significa «rolagem para baixo»?
let up   = directionalScore(previous: cur, current: prev)  // cur→prev significa «rolagem para baixo»?
```

A chave está na linha `guard outcome.offset > 0` dentro de `directionalScore`. O matching reverso desse motor só retorna um deslocamento positivo quando « o template do topo do novo frame cai mais abaixo no frame antigo ». Então:

- Se a rolagem real é descendente, a chamada direta `down` acerta (offset > 0, válido), enquanto a chamada reversa `up` não encontra conteúdo antigo mais abaixo no topo do novo frame, então offset ≤ 0, marcado inválido, pontuação 0;
- Se a rolagem real é ascendente, é o oposto: `down` é inválido, `up` é válido.

O critério de direção é na verdade « **qual chamada é válida** », não que as duas pontuações sejam simétricas. Na minha primeira versão escrevi distraidamente « perfeitamente simétrico », até um colega apontar e perguntar « como válido e inválido podem ser simétricos? » — esse é o mal-entendido que mais quero corrigir neste post.

Após obter a pontuação `down` / `up` de cada dupla, a pontuação por dupla funciona assim:

```
score = probability×0.55 + nccBoost×0.20 + overlapRatio×0.15 + consensusBoost×0.10
score ×= sadPenalty          // quanto mais borrada a sobreposição, mais a pontuação é descontada
pontuação válida deve ser ≥ 0.26
```

Depois a votação: dentro de uma dupla, se `up ≥ down × 1.25` (ou excede em 0,08 em valor absoluto), emite um voto ascendente; senão emite um voto descendente. Decisão final:

- `upwardVotes ≥ downwardVotes + 2`, e
- `upwardScore ≥ downwardScore × 1.25`

só então é tratado como rolagem ascendente. Tudo roda em miniaturas de baixa resolução limitadas a 320 px em uma thread em segundo plano, com impacto quase imperceptível no tempo total.

## Na dúvida, passe ao usuário

A detecção não é 100 % confiável. Uma gravação quase estática que se moveu só dois ou três pixels tem um sinal de direção muito fraco; inverter à toa é pior do que não inverter. Por isso há uma barreira: `shouldAskForReverseConfirmation` só dispara quando a confiança ≥ 0,72 e as amostras válidas ≥ 3 duplas, mostrando uma confirmação leve: « Detectamos que você gravou rolando para cima — inverter o stitching? » Se o usuário toca inverter, `reverseFrames: true`; se não tem certeza, costura na ordem original. O motor nunca produz silenciosamente uma imagem errada por ter adivinhado a direção errada.

## Os dois modos lado a lado

| | De cima para baixo | De baixo para cima |
|---|---|---|
| Gesto de gravação | dedo desliza para baixo | dedo desliza para cima |
| Ordem de amostragem de frames | linha do tempo natural | linha do tempo natural (conteúdo flui de trás para frente) |
| Detecção de direção | não necessária | amostra 7 duplas no meio, matcher roda duas vezes |
| Motor de stitching | original | original (reutilizado após inversão da ordem dos frames) |
| Código novo | — | só detecção de direção + inversão em uma linha |
| Fallback | — | pede confirmação quando a confiança é baixa |

## Encerrando

Olhando para trás, o stitching de baixo para cima quase não tem « código próprio » no ScrollShot — é totalmente parasita do motor descendente. A ideia de « normalizar a ordem primeiro, depois reutilizar o mesmo motor » virou depois nosso padrão de partida padrão ao adicionar novos modos de stitching: da próxima vez que fizermos stitching horizontal ou em zigue-zague, muito provavelmente vamos primeiro descobrir como torcer o problema de volta para « descendente unidimensional » em vez de começar do zero.

---

## FAQ: capturar uma captura de rolagem em apps iPhone

**O ScrollShot consegue fazer captura de rolagem em apps iPhone como Messages e WhatsApp?**
Sim. Quer você queira um long screenshot iPhone de uma página web ou uma captura de rolagem iPhone das conversas de Messages e WhatsApp, o ScrollShot grava sua tela e costura os frames automaticamente. Como captura por gravação de tela em vez de depender de um botão de « página inteira » do sistema, funciona dentro de qualquer app — o caso de captura de página inteira em app iPhone que todo mundo pergunta.

**E se eu rolar para cima enquanto gravo um chat?**
Esse é todo o ponto deste post. Uma captura de rolagem iPhone Messages que os usuários amam, ou uma captura iPhone WhatsApp que os fãs capturam rolando para trás, ambas significam que o conteúdo flui de trás para frente. O ScrollShot detecta a direção de rolagem ascendente, inverte a ordem dos frames e reutiliza o mesmo motor de stitching descendente — assim você ainda obtém uma captura de rolagem iPhone correta sem termos de reescrever nada.

**Como isso é diferente da captura integrada do iOS?**
A captura integrada nem sempre consegue capturar uma página inteira dentro dos apps. O ScrollShot é feito para o caso do long screenshot e da captura de rolagem iPhone: grave uma vez, role como quiser (para cima ou para baixo), e obtenha uma única imagem longa perfeita.

---

## Leitura adicional

- <a href="/pt-br/blog/ios-stitching-engine-v2/">Quão difícil é juntar duas capturas de tela? Um motor de stitching para iOS que me fez recomeçar — de novo e de novo</a> — escolher 30 keyframes de 1.800 frames, matching de template reverso, busca NCC piramidal até uma estratégia de fallback de três níveis — um desmonte completo do motor de stitching do ScrollShot.
- <a href="/pt-br/blog/por-que-escolher-scrollshot-prints-longos-ios/">Por que escolher o ScrollShot? A solução definitiva para prints longos no iOS</a> — uma perspectiva de produto sobre como o ScrollShot resolve as dores dos long screenshots iOS, incluindo costura automática por gravação de tela, stitching manual, proteção de privacidade e exportação HD.
