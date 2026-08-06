---
title: "Como Tirar Screenshot Longo (Captura Rolável) no Mac em 2026: Guia Completo"
description: "O macOS não tem captura de tela rolável nativa. Este guia de 2026 explica o porquê, compara GoFullPage, Shottr, CleanShot X, Xnapper, screensnap e ScrollShot, e mostra como capturar qualquer janela de graça com o ScrollShot para Mac."
date: "2026-08-05"
category: "Guia"
author: "Equipe ScrollShot"
tags: ["screenshot longo no Mac", "captura de tela rolável Mac", "screenshot rolável Mac", "ScrollShot para Mac", "ferramenta de captura macOS", "scroll and stitch"]
readingTime: "10 min de leitura"
cover: "/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp"
coverAlt: "Uma captura de tela comum de uma tela do Mac ao lado de uma captura rolável do ScrollShot de 765 × 4091 px do mesmo conteúdo"
translationKey: "how-to-take-long-scrolling-screenshot-on-mac-2026"
faq:
  - question: "Posso tirar um screenshot rolável com o app nativo de Screenshot do Mac?"
    answer: "Não. Cmd + Shift + 4 e o app Screenshot capturam apenas a tela visível. Você precisa de um recurso de navegador, de uma exportação em PDF ou de um app de terceiros como ScrollShot, Shottr ou CleanShot X."
  - question: "Qual é o jeito mais rápido e grátis de tirar um screenshot rolável no Mac?"
    answer: "Só para páginas web: GoFullPage (em menos de 30 segundos). Para qualquer coisa fora do navegador — Slack, PDFs, apps — tanto o ScrollShot para Mac quanto o Shottr funcionam e são grátis."
  - question: "Existe uma ferramenta de screenshot rolável grátis que também traduz e oculta dados?"
    answer: "Sim — o ScrollShot para Mac. É grátis e combina, de forma única, a captura por rolagem com OCR, tradução para 30+ idiomas, mais de 19 ferramentas de anotação e ocultação automática de dados pessoais/rostos em um único app."
  - question: "Screenshots roláveis funcionam para PDFs e documentos?"
    answer: "Sim, se você usar um app nativo de captura por rolagem (ScrollShot, Shottr, CleanShot X) no PDF aberto no Preview ou em um leitor. O 'Salvar como PDF' nativo gera um documento, não uma imagem."
  - question: "Por que meu screenshot rolável tem cabeçalhos duplicados?"
    answer: "A página tem um elemento fixo — bolha de chat, barra de navegação ou banner de cookies — que permanece parado enquanto o conteúdo rola. Feche ou esconda-o antes de capturar."
  - question: "Em qual formato devo salvar screenshots roláveis?"
    answer: "PNG para qualidade e transparência; JPG se o tamanho do arquivo importa e você não precisa de transparência; PDF apenas se precisar de texto pesquisável."
---

# Como Tirar Screenshot Longo (Captura Rolável) no Mac em 2026: Guia Completo

Deixa eu te poupar os 20 minutos que eu perdi na primeira vez que precisei disso.

Eu tinha um thread de 4.000 pixels no Slack para enviar a um desenvolvedor. Apertei `Cmd + Shift + 4`, arrastei uma caixa e... peguei uma tela só. O resto da conversa estava abaixo da dobra, e o macOS ignorou feliz. **Não existe forma nativa de tirar um screenshot rolável no Mac** — nem no `Cmd + Shift + 4`, nem no app Screenshot, nem no Preview. Se você veio aqui esperando um atalho escondido da Apple, vou ser direto: ele não existe. O Windows tem no Snipping Tool. O iPhone tem. O Android tem. O macOS, em 2026, ainda não traz isso de fábrica.

A boa notícia: é totalmente solucionável, e você tem mais opções do que a maioria dos blogs "lista dos 8 melhores" admite. Este guia vai além da superfície. Vou explicar *por que* o Mac não consegue fazer isso nativamente, o que acontece de verdade quando um app "rola e costura", e qual ferramenta serve para qual tarefa — incluindo a que eu uso todo dia, o **[ScrollShot para Mac](/pt-br/blog/por-que-escolher-scrollshot-prints-longos-ios/)** (grátis, e a única opção que faz o trabalho inteiro em um só app).

![Antes vs Depois: uma captura comum de uma tela do Mac ao lado de uma captura rolável do ScrollShot de 765 × 4091 px do mesmo conteúdo](/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp)

*Uma captura comum só registra a viewport visível. O ScrollShot captura a área rolável completa de 765 × 4091 px em uma imagem — e depois permite anotar, fazer OCR, traduzir e ocultar dados sem sair do app.*

---

## Por que o macOS não consegue tirar um screenshot rolável nativamente

Não é preguiça da Apple — é assim que a tela funciona.

Quando você aperta `Cmd + Shift + 4`, o macOS captura o *framebuffer* atual: um retrato pixel a pixel do que está fisicamente na tela agora. Uma janela rolável (Slack, uma página web, um PDF) renderiza apenas a parte visível. O conteúdo fora da tela não está "lá" para ser capturado — ele é desenhado sob demanda conforme você rola. Não existe um "buffer de rolagem" como num terminal. Então uma ferramenta de captura tem duas opções:

1. **Pedir o conteúdo completo ao app** (só funciona se o app o expõe — navegadores podem, a maioria dos apps não).
2. **Rolar um pouco, capturar um pouco, repetir e então costurar as partes** em uma imagem alta.

Toda ferramenta de "screenshot rolável" no Mac faz a opção #2 por baixo dos panos (ou a #1 só para páginas web). Essa distinção importa, porque explica por que algumas ferramentas só funcionam no Chrome e outras funcionam *em qualquer lugar*.

![Viewport visível vs conteúdo rolável completo — o macOS só captura o que está na tela, não o que está abaixo da dobra](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-viewport-vs-full.webp)

---

## As três famílias de soluções

Antes das recomendações, conheça as categorias. Elas não são intercambiáveis.

| Família | Como funciona | Melhor para | Não faz |
| --- | --- | --- | --- |
| **Só navegador** (GoFullPage, recurso nativo do Firefox, DevTools, Safari Web Inspector) | Pede à página o DOM/conteúdo completo | Páginas web *abertas naquele navegador* | Slack, PDFs no Preview, janelas de apps, quadros do Figma |
| **Apps nativos de captura por rolagem** (Shottr, CleanShot X, Xnapper, **ScrollShot**, screensnap*) | Rola + costura a tela real | *Qualquer* área rolável, incluindo apps fora do navegador | — (limitado apenas pela qualidade do app) |
| **Exportação em PDF** (`Cmd + P` → Salvar como PDF) | Renderiza o layout em um documento | Arquivos pesquisáveis, impressão | Não é imagem; não cola em linha |

\* *screensnap (ScreenSnap Pro) é uma exceção notável — veja a nota abaixo. É uma ferramenta de anotação, não de captura por rolagem.*

---

## Recomendação rápida (leia isto se você tem pressa)

- **Você só tira screenshot de páginas web** → uma extensão de navegador como o GoFullPage serve e é grátis.
- **Você precisa capturar Slack, PDFs, janelas de apps ou documentos** → precisa de um app nativo.
- **Você quer uma ferramenta grátis que captura *e* permite OCR, tradução, anotação, borrão de informações sensíveis e até gravação de vídeo — sem pagar ou assinar** → **ScrollShot para Mac**. É a única opção deste guia que faz todo o fluxo nativamente e de graça.

![Três ferramentas comparadas: GoFullPage (só web), CleanShot X ($29/ano) e ScrollShot (grátis, tudo-em-um)](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-3up-comparison-cards.webp)

---

## A comparação completa (Shottr, CleanShot X, Xnapper, screensnap, ScrollShot)

Testei os concorrentes comuns no macOS 15/26. Veja como eles se comportam de verdade, não como o marketing descreve. Para manter legível, dividi em duas tabelas focadas — o que cada ferramenta consegue **capturar** e o que consegue fazer com o **resultado**.

### Captura e escopo

| Ferramenta | Preço | Captura rolável | Além do navegador? |
| --- | --- | --- | --- |
| **ScrollShot para Mac** | **Grátis** | ✅ Costura automática via Apple Vision | ✅ Qualquer área rolável |
| **Shottr** | Grátis ($12 pagos uma vez para remover avisos) | ✅ Rolar manual + costurar | ✅ |
| **CleanShot X** | $29/ano (ou $59 pagos uma vez) | ✅ Automática ou manual | ✅ |
| **Xnapper** | $24 pagos uma vez | ✅ | ✅ |
| **screensnap (ScreenSnap Pro)** | $39 pagos uma vez | ❌ **Sem captura rolável** | ❌ |
| **GoFullPage** | Grátis (plano pago) | ✅ (só navegador) | ❌ Só web |

### Edição pós-captura

| Ferramenta | Anotação | OCR + Tradução | Gravar/editar vídeo | Ocultação automática de dados |
| --- | --- | --- | --- | --- |
| **ScrollShot para Mac** | ✅ 19+ ferramentas | ✅ 30+ idiomas | ✅ MP4/GIF + cortar | ✅ E-mails, telefones, chaves de API, rostos |
| **Shottr** | ✅ Básica | ⚠️ Só OCR, sem tradução | ❌ | ❌ |
| **CleanShot X** | ✅ Forte | ❌ | ✅ (separado) | ⚠️ Só borrão manual |
| **Xnapper** | ✅ + embelezar | ❌ | ❌ | ⚠️ Borrão automático de privacidade |
| **screensnap (ScreenSnap Pro)** | ✅ 15 ferramentas + fundos | ❌ | ✅ GIF | ⚠️ Borrão manual |
| **GoFullPage** | ⚠️ Recorte básico | ❌ | ❌ | ❌ |

**O balanço real sobre o screensnap.** O próprio blog do screensnap ("8 Métodos Ranqueados por Velocidade") é uma lista ranqueada genuinamente útil — mas repare no que ele recomenda para a captura de verdade: GoFullPage e Shottr. O ScreenSnap Pro em si *não consegue tirar um screenshot rolável*. Ele foi feito para o *próximo* passo (embelezar + anotar + compartilhar uma captura que você já fez em outro lugar). Então, se o seu problema é "preciso do screenshot longo em primeiro lugar", o screensnap não é solução de captura; é pós-captura. O ScrollShot, em contraste, faz tanto a captura *quanto* o passo de anotar/borrar/compartilhar no mesmo app grátis.

---

## Como o "rolar e costurar" funciona de verdade (e por que quebra)

Quando o ScrollShot (ou Shottr, ou CleanShot) tira um screenshot longo, o processo de rolar e costurar é:

1. Captura a região visível.
2. Simula uma rolagem (ou espera você rolar).
3. Captura a próxima região.
4. **Combina os pixels sobrepostos** entre os dois quadros para achar a costura.
5. Costura tudo e repete até você parar.

A etapa de combinação é onde as ferramentas vivem ou morrem em qualquer fluxo de rolar e costurar. O [motor de costura](/pt-br/blog/ios-stitching-engine-v2/) do ScrollShot usa o framework Vision da Apple para combinar quadros, e é por isso que lida melhor com velocidades de rolagem variáveis e pequenas mudanças de layout do que abordagens ingênuas de diferença de pixels. Três coisas ainda quebram qualquer costurador:

- **Cabeçalhos/rodapés fixos** que não se movem enquanto o conteúdo rola → barras duplicadas. (Feche widgets de chat e banners de cookies antes.)
- **Conteúdo carregado sob demanda** que só aparece depois de rolar → lacunas em branco. (Role uma vez, depois capture.)
- **Suposição de largura fixa** → se você redimensionar a janela, a largura de saída muda. Decida a largura antes de capturar.

![Como rolar e costurar funciona: a ferramenta combina a faixa sobreposta para achar onde o quadro 2 se liga ao quadro 1](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-stitch-overlap.webp)

---

## Passo a passo: tirar um screenshot longo com o ScrollShot para Mac

Este é o fluxo que eu uso para tudo agora.

**1. Instalar (30 segundos).**  
Baixe em [`mac.scrollshot.work/ScrollShot.dmg`](https://mac.scrollshot.work/ScrollShot.dmg), abra o DMG, arraste para Aplicativos. Sem conta, sem chave de licença.

![Instalar o ScrollShot: abra o DMG e arraste o app para Aplicativos](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-dmg-install.webp)

**2. Acionar a captura por rolagem.**  
Aperte o atalho de captura por rolagem (ou escolha no menu da barra). Arraste uma caixa ao redor da área rolável — uma página web, um painel do Slack, uma coluna de PDF, o que for.

**3. Rolar.**  
Role com o trackpad ou a roda do mouse. O ScrollShot costura automaticamente ao vivo; você vê a imagem alta crescer na pré-visualização. Pare quando tiver capturado tudo.

![Pré-visualização ao vivo: o ScrollShot costura automaticamente enquanto você rola e você vê a imagem alta crescer](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-live-preview.webp)

**4. Uma imagem, já editável.**  
Quando terminar, você não cai em um editor separado. A mesma janela permite: adicionar setas/números, **fazer OCR do texto e traduzi-lo para 30+ idiomas em linha**, borrar ou ocultar automaticamente e-mails/telefones/chaves de API/rostos, depois exportar como PNG ou salvar em um fundo em gradiente embelezado.

![Anotar o screenshot longo finalizado: seta, número, borrão e tradução — sem sair do app](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-annotation-toolbar.webp)

**5. Compartilhar.**  
Copie para a área de transferência, envie para seu S3/Cloud ou exporte. Pronto — sem sair do app.

Esse último ponto é o motivo real pelo qual eu troquei. Com o Shottr eu capturava e depois abria outro app para anotar. Com o CleanShot X eu pagava $29/ano pelo privilégio. Depois da captura por rolar e costurar, o ScrollShot faz captura → edição → tradução → ocultar → exportar em uma só passada, de graça.

---

## Quando você *não* deve usar um app de captura por rolagem

Seja honesto sobre a tarefa:

- **Você precisa de texto pesquisável e copiável** (arquivo jurídico, PDF de pesquisa) → `Cmd + P` → Salvar como PDF. Um PNG de 12.000 pixels não é pesquisável.
- **Você só tira screenshot de um navegador** e nunca sai dele → GoFullPage ou o "Tirar Screenshot → Salvar página inteira" nativo do Firefox é mais leve.
- **Você precisa de layout de impressão pixel a pixel** → PDF de novo.

Para tudo o mais — threads de chat, documentos, painéis de configurações, páginas web longas que você vai anotar — um app nativo de rolagem ganha.

---

## Problemas comuns (e a solução)

- **Cabeçalho duplicado na saída** → elemento fixo. Dispese-o ou use uma ferramenta com bom tratamento de fixos antes de capturar.
- **Seção do meio faltando** → rolagem infinita / carregamento sob demanda. Role até o fim uma vez, depois capture do topo.
- **Texto embaçado** → capturado em DPI baixo. Deixe a janela maior (ou dê zoom) antes de capturar.
- **Arquivo enorme** → um PNG de 10.000px de altura pode ter vários MB. Comprima antes de compartilhar, ou divida em seções para legibilidade.

---

## FAQ

**Posso tirar um screenshot rolável com o app nativo de Screenshot do Mac?**  
Não. `Cmd + Shift + 4` e o app Screenshot capturam apenas a tela visível. Você precisa de um recurso de navegador, de uma exportação em PDF ou de um app de terceiros como ScrollShot, Shottr ou CleanShot X.

**Qual é o jeito mais rápido e grátis de tirar um screenshot rolável no Mac?**  
Só para páginas web: GoFullPage (em menos de 30 segundos). Para qualquer coisa fora do navegador (Slack, PDFs, apps): ScrollShot para Mac ou Shottr — ambos grátis, ambos funcionam em qualquer área rolável.

**Existe uma ferramenta de screenshot rolável grátis que também traduz e oculta dados?**  
Sim — [ScrollShot para Mac](/pt-br/blog/por-que-escolher-scrollshot-prints-longos-ios/). É grátis e combina, de forma única, a captura por rolagem com OCR, tradução para 30+ idiomas, mais de 19 ferramentas de anotação e ocultação automática de dados pessoais/rostos em um único app.

**Screenshots roláveis funcionam para PDFs e documentos?**  
Sim, se você usar um app nativo de captura por rolagem (ScrollShot, Shottr, CleanShot X) no PDF aberto no Preview ou em um leitor. O "Salvar como PDF" nativo gera um documento, não uma imagem.

**Por que meu screenshot rolável tem cabeçalhos duplicados?**  
A página tem um elemento fixo (bolha de chat, barra de navegação, banner de cookies) que permanece parado enquanto o conteúdo rola. Feche ou esconda-o antes de capturar.

**Em qual formato devo salvar screenshots roláveis?**  
PNG para qualidade e transparência; JPG se o tamanho do arquivo importa e você não precisa de transparência; PDF apenas se precisar de texto pesquisável.
