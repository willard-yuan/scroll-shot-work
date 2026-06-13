---
title: "Quão difícil é juntar duas capturas de tela? Um motor de stitching para iOS que me fez recomeçar — de novo e de novo"
description: "Desmontamos o motor de stitching do ScrollShot: selecionar 30 frames-chave de 1.800, template matching reverso, busca piramidal NCC, estratégia de fallback em três níveis e os truques de engenharia que nenhum livro ensina."
date: "2026-06-10"
category: "Técnica"
author: "Equipe ScrollShot"
tags: ["print longo iOS", "algoritmo de stitching", "template matching", "NCC", "motor ScrollShot", "stitching de gravação de tela"]
readingTime: "15 min de leitura"
featured: true
cover: "/scrollshot_video_to_long_screenshot_workflow_pt_br.webp"
coverAlt: "Pipeline do motor de stitching do ScrollShot em seis etapas: da gravação de tela à imagem longa"
translationKey: "ios-stitching-engine-v2"
---

# Quão difícil é juntar duas capturas de tela? Um motor de stitching para iOS que me fez recomeçar — de novo e de novo

Passei vários meses fazendo uma coisa só: fazer o stitching de prints longos no celular ficar «perfeitamente alinhado».

Parece fácil, né? Duas capturas adjacentes, achar a sobreposição, cortar e colar. Mas quando você senta para programar, descobre que «perfeitamente alinhado» é um buraco de engenharia sem fundo.

Este artigo desmonta o motor de stitching do ScrollShot. Sem pitch de produto nem promessas vazias — só algoritmos e os detalhes de engenharia que me fizeram refatorar o design várias vezes. Se você tem curiosidade sobre o posicionamento geral do ScrollShot, comece pela <a href="/pt-br/blog/por-que-escolher-scrollshot-prints-longos-ios/">visão geral do produto: por que escolher o ScrollShot para prints longos no iOS</a>.

---

## Por que não usar o stitching panorâmico do OpenCV?

Intuitivamente, montagem de imagens é um problema antigo. A classe `Stitcher` do OpenCV cria panoramas em poucas linhas de código.

Mas prints longos e fotos panorâmicas são coisas completamente diferentes. Panorama é captura por rotação horizontal com transformação de perspectiva e sobreposição geralmente pequena. Print longo é **rolagem vertical unidirecional** — frames consecutivos compartilham de 5 % a 80 % de conteúdo idêntico, e — isso é crucial — **2 pixels de desalinhamento são visíveis na hora**, porque você pode estar juntando texto.

Quem já tentou OpenCV conhece a experiência: feature matching se perde totalmente em telas de chat. Alguns usuários colocam imagem de fundo no app de mensagens, fazendo a maior parte do frame parecer igual. Em vez do final de um frame se sobrepor ao início do próximo, os pontos SIFT geram nuvens de pares «parecidos mas diferentes».

Então escolhi outro caminho: escrevi a primeira linha de um motor de template matching do zero, otimizado para o cenário de «prints de tela com rolagem vertical».

O pipeline geral é assim:

![Pipeline do motor de stitching do ScrollShot](/scrollshot_video_to_long_screenshot_workflow_pt_br.webp)

O motor também suporta Apple Vision Framework para matching (rápido mas grosseiro), mas este artigo foca no template matching próprio — é onde o trabalho pesado acontece. Para ver como esse algoritmo se traduz em uma experiência de <a href="/pt-br/blog/por-que-escolher-scrollshot-prints-longos-ios/">grave uma vez e tenha um print longo</a>, confira a apresentação do produto.

---

## Desafio 1: escolher 30 frames úteis entre 1.800

Uma gravação de 30 segundos a 60 fps = 1.800 frames. Processar todos? A memória explode primeiro, o tempo logo depois.

A abordagem mais intuitiva é **amostragem por intervalo de tempo**: 3 frames por segundo. Mas tem um defeito fatal — a velocidade de rolagem do usuário não é uniforme. Num swipe rápido, dois frames consecutivos diferem em meia tela, e o stitching inevitavelmente perde conteúdo. Em navegação lenta, frames adjacentes são quase idênticos — puro desperdício.

O ScrollShot usa **amostragem por distância**: em vez de olhar o tempo, olha «quanto a tela rolou». Um frame só vale a pena capturar quando o deslocamento acumulado ultrapassa um limiar.

### Qual é o limiar de deslocamento ideal?

Esse número me atormentou por semanas. Muito pequeno, rolagem lenta dispara extração frenética cheia de duplicatas. Muito grande, rolagem rápida perde conteúdo.

A fórmula final:

```
displacementThreshold = dsHeight × 0,60 × presetScale
```

Onde `dsHeight` é a altura do frame após redução de resolução (1080p reduzido 3× ≈ 360p, ou seja `dsHeight ≈ 640`), `0,60` é a razão base e `presetScale` é um ajuste selecionável (agressivo/equilibrado/conservador).

No modo equilibrado, um frame é capturado a cada **384 pixels** (640 × 0,60) de rolagem — aproximadamente metade da altura da tela.

Tem também um filtro de ruído fácil de ignorar: **um deslocamento individual deve ser ≥ 3 pixels para contar no acumulado**. Sem isso, o ruído subpixel do template matching se acumula devagar, causando «extração fantasma» mesmo numa tela parada. Levei uma tarde inteira para encontrar esse bug.

### Duas passadas na prática

**Passada 1 — análise de movimento em baixa resolução.** Frames são reduzidos 3× (1080p → 360p, uma ordem de grandeza de velocidade), e template matching leve rastreia o deslocamento vertical frame a frame. Vários detalhes de engenharia se escondem aqui:

- **Passo adaptativo**: quando o deslocamento é grande, saltos grandes (`nativeFPS / 6`, a cada ~10 frames). Quando é pequeno, volta para scan frame a frame (`nativeFPS / 30`). Quando a distância restante cai abaixo de 25 % do limiar, passo mínimo forçado — senão você literalmente pula um frame
- **Detecção de mudança de cena**: SAD por pixel entre frames adjacentes acima de 40,0? Provavelmente o usuário trocou de app. Captura imediatamente
- **Truncamento por rebote**: usa o fluxo óptico do Vision para detectar direção do movimento. Se o deslocamento acumulado cai abaixo de -50 px (o usuário está voltando para cima), chegou ao topo — descarta todos os frames seguintes. Mas esse limiar não pode ser muito apertado: inicialmente coloquei -10, e tremores leves do dedo disparavam o truncamento, cortando a gravação pela metade

**Passada 1,5 — refinamento de nitidez.** Para cada frame candidato, buscar o mais nítido numa janela de ±2 frames ao redor.

Como quantificar nitidez? Uso **energia laplaciana** — convolução da imagem em tons de cinza com kernel 3×3, e depois a média das respostas ao quadrado:

```
kernel = [-1, -1, -1,
          -1,  8, -1,
          -1, -1, -1]

sharpness = mean((convolve(gray, kernel) - 128)²)
```

Subtrair 128 é porque a saída da convolução tem um bias de 128 (requisito do vImage). O quadrado e a média dão a energia de alta frequência. Valor maior = frame mais nítido.

Por que energia laplaciana em vez de variância? Para prints de tela, os dois métodos selecionam frames quase idênticos, mas o primeiro é computacionalmente mais simples — `vDSP_vsq` + `vDSP_meanv` do vImage, duas linhas.

O limite de resolução é 720×1280, suficiente. A razão é prática: o frame mais nítido é o instante em que o usuário levanta o dedo; frames durante o swipe tendem a ter blur de movimento. A energia laplaciana é muito sensível a isso — a diferença costuma ser de 2–3×.

---

## O algoritmo central: motor de template matching

É a maior parte do motor em volume de código (mais de 3.000 linhas num único arquivo), e a que mais me torturou com bugs.

### Matching reverso: por que buscar o antigo a partir do novo?

Minha primeira versão usava «matching direto» — template da parte inferior do frame antigo, busca no novo. Fracassou em telas de WhatsApp: a parte inferior do antigo mostrava um «OK», o novo tinha três «OK». O matching pegou o de cima, e o offset errou por 200 pixels.

Depois inverti a abordagem: **Reverse Matching**. Pegar o template do **topo** do frame novo (img2) e buscar na **parte inferior** do frame antigo (img1).

Por que o reverso é melhor? O topo do frame novo é «conteúdo recém-rolado» — esse conteúdo com certeza existe no frame antigo, e **existe exatamente uma vez** (na parte média-inferior). Ao contrário, o «conteúdo antigo prestes a desaparecer» na parte inferior do antigo pode aparecer só um pouquinho no novo, ou já ter sido empurrado para fora da tela.

![Diagrama de matching reverso](/scrollshot_video_to_long_screenshot_algo_pt_br.webp)

A busca pula automaticamente a barra de status (~250 px no topo) e a tab bar inferior (~350 px). Mas aqui tem outra armadilha — alguns apps têm barras de navegação de alturas variáveis, algumas páginas têm teclado, outras têm botões flutuantes.

Então adicionei **detecção dinâmica de footer**. Funciona assim: escanear de baixo para cima linha por linha, pegar os 80 % centrais de cada linha (cortar 10 % de cada lado para evitar botões flutuantes), amostrar a cada 16 pixels e calcular a MAD (diferença absoluta média) da mesma linha nos dois frames. MAD ≤ 3,2 indica que a linha é quase idêntica — provavelmente elemento UI estático. Parar após 4+ linhas consecutivas não estáticas (`maxGapTolerance = 4`). Menos de 24 linhas estáticas no total → sem barra fixa, retornar 0.

O limiar 3,2 é empírico. Zona estática com fundo branco tem MAD de 0–1,5. Ruído de compressão JPEG flutua entre 2–4. Linhas com mudança real de conteúdo ficam em pelo menos 8. 3,2 está bem na brecha — tolera ruído de compressão mas rejeita mudanças de conteúdo.

### 6 templates votam contra «todos parecem iguais»

Um único bloco de template é fácil de dar match errado. Imagine uma página de lista de produtos de e-commerce — cada card de produto tem layout quase idêntico, um template pode casar com o produto anterior ou seguinte.

O motor extrai **6 blocos de template** simultaneamente (cada um com 100 px de altura, espaçados a partir do topo do frame novo), busca independentemente a melhor posição no frame antigo e obtém 6 valores de offset. Depois **clusteriza** esses 6 offsets (tolerância: 5 px) e pega a mediana do maior cluster.

Se 5 de 6 templates apontam para offset ≈ 320 e 1 para 800, esse 800 é quase certamente um match falso — descarta.

Tem também uma otimização de saída antecipada: se os 3 primeiros templates já concordam (tolerância: 4 px) e o offset não é perto de 0 (excluindo «o usuário nem rolou»), os 3 restantes não precisam ser calculados.

Um detalhe que me deixou em dúvida: qual tolerância usar? Inicialmente coloquei 2 px, mas por causa do erro de quantização do NCC (ver adiante), offsets de templates diferentes no mesmo par frequentemente diferiam 2–3 px, e a saída antecipada quase nunca disparava. Ao aumentar para 4 px, cerca de 60 % dos pares dispararam a saída antecipada em testes reais, sem perda de precisão observável.

### NCC piramidal: busca de grosso a fino

Cada matching usa **NCC (Normalized Cross-Correlation)** para medir similaridade. A fórmula NCC:

$$\text{NCC}(T, I) = \frac{\sum(T_i - \bar{T})(I_i - \bar{I})}{\sqrt{\sum(T_i - \bar{T})^2 \cdot \sum(I_i - \bar{I})^2}}$$

A vantagem do NCC é ser insensível a mudanças de brilho (gravação de dia e a mesma página em modo escuro também casam). Faixa [-1, 1], onde 1 = correspondência perfeita. Intuitivamente: NCC não compara valores absolutos de pixels mas se o «padrão de variação claro-escuro» é o mesmo.

Mas deslizar pixel a pixel pelo frame antigo inteiro é lento demais. O motor usa **busca piramidal de três níveis**:

| Nível | Passo | Janela | Candidatos | Propósito |
|-------|-------|--------|-----------|-----------|
| Level 1 (Pre) | 12 px | Faixa completa | ~125 | Posicionamento grosseiro |
| Level 2 (Coarse) | 4 px | ±32 px | ~16 | Precisão por linha |
| Level 3 (Fine) | 1 px | ±4 px | 9 | Refinamento pixel a pixel |

Um dado que vale compartilhar: o passo de 12 do Level 1 busca apenas 1/12 das posições candidatas, resultando em aproximadamente **12× de aceleração** por template. O cálculo total nos três níveis é cerca de 1/8 de uma busca exaustiva.

Quando os candidatos passam de 64 (típico no Level 1), o cálculo paralelo GCD é ativado automaticamente (`DispatchQueue.concurrentPerform`), distribuindo a busca em múltiplos núcleos CPU. Aqui encontrei um problema: inicialmente usei `NSLock` para proteger uma variável `bestScore` compartilhada, mas a contenção em 6 núcleos na verdade deixava tudo mais lento. Mudar para melhores locais por thread com fusão final reduziu a contenção de O(n) para O(1).

### Janela de busca: deixe o histórico te guiar

Buscar na área total utilizável do frame antigo toda vez é lento e propenso a falsos matches (topo e fundo da página podem ter layouts parecidos).

O motor usa dois tipos de «priors» para estreitar a janela:

- **Prior temporal**: se o offset do par anterior foi 300 px, este par provavelmente é parecido. Janela reduzida para 300 ± 120 px
- **Prior Vision**: para o primeiro par sem histórico, a API de registro do Apple Vision dá uma estimativa grosseira. Janela para estimativa ± 180 px

Se a janela estreita não encontra pelo menos 3 matches consistentes (o prior estava errado), volta automaticamente para busca de faixa completa.

A condição «pelo menos 3 consistentes» também foi aprendida com erros. Inicialmente usei «pelo menos 1», mas quando o prior do Vision errava muito (às vezes 500 px), um falso match na janela estreita passava como válido por acaso. Com 3, um falso match precisaria enganar 3 templates independentes simultaneamente — estatisticamente quase impossível.

### Quando o matching normal falha: fallback de três níveis

Cenários reais são muito mais duros que o laboratório. Botões flutuantes, overlays semitransparentes, vídeos em reprodução, cursores piscando — tudo isso puxa os scores NCC para baixo.

O motor implementa uma estratégia de fallback de três níveis. Com dados reais de frequência:

> **Nível 1: Match forte (~80 % dos pares).** A maioria dos templates tem NCC ≥ 0,6 e aponta para o mesmo offset. O caso mais comum.
>
> **Nível 2: Match suave (~12 % dos pares).** O melhor template tem NCC de apenas 0,45–0,6 — talvez um elemento UI flutuante tenha coberto parcialmente a área. Usa-se o SAD de toda a zona de sobreposição como verificação secundária. SAD por pixel ≤ 26,0 → aceito; senão, rejeitado.
>
> **Nível 3: NCC de perfil 1D (~5 % dos pares).** «Achatar» a imagem 2D numa curva de médias por linha — um array 1D. Intercorrelacionar as duas curvas 1D. ~100× mais rápido, mas com maior risco de falsos positivos.
>
> **Tudo falhou (~3 % dos pares)?** Este frame provavelmente é uma mudança de cena ou sem sobreposição. Adicionar ao final sem stitching.

A verificação SAD do nível 2 é matizada. O limiar base é **25,0 por pixel**, mas quando a proporção de sobreposição passa de 80 %, é ajustado adaptativamente:

```
if overlapRatio > 0,8:
    scale = max(minScale, 1,0 - (overlapRatio - 0,8) × 4,0)
    threshold = 25,0 × scale
```

Por que apertar? Quanto maior a zona de sobreposição, mais amostras estatísticas o SAD tem, ruído aleatório se anula na média — um falso match pode também ter SAD baixo. Sem apertar, os falsos positivos aumentam em cenários de alta sobreposição.

Não importa o caminho, sempre tem um **refinamento de offset** final: calcular SAD pixel a pixel em ±6 px do offset candidato e pegar o mínimo.

Por que o offset do NCC ainda precisa de refinamento? Levei três dias para entender. O NCC é muito «plano» perto do ótimo — 2 px de diferença podem mudar o NCC só 0,003. Mas o SAD é extremamente sensível a deslocamentos de ±1 px — 1 px de diferença pode mudar o SAD em 3–5 unidades. Os dois se complementam: NCC cuida do posicionamento grosso, SAD cuida da calibração a nível de pixel. Quando você junta texto, 2 px de erro é a diferença entre «uma linha de texto cortada ao meio» e «perfeitamente alinhada».

### Linha de costura: não corte o texto ao meio

Achou o offset. Os dois frames têm uma zona de sobreposição. Onde «cortar»?

O intuitivo é cortar no meio. Mas se o meio tem justo uma linha de texto grande, a metade de cima e a de baixo não se alinham — o olho percebe na hora.

A abordagem do motor: calcular a diferença de pixels de **cada linha** na zona de sobreposição, e usar uma janela deslizante para achar a posição com diferença total mínima. A altura da janela é adaptativa — `min(overlapH, max(100, adaptiveCutHeight))`. Essa posição é onde o conteúdo dos dois frames é mais parecido — a costura aqui é visualmente mais natural.

---

## Benchmarks de desempenho

Testei com uma gravação típica de 30 segundos de chat no WhatsApp (iPhone 15 Pro, 1080×2400, 60 fps). Métricas-chave:

| Métrica | Valor |
|---------|-------|
| Total de frames | 1.800 |
| Tempo de análise Passada 1 | 3,2 s |
| Frames-chave extraídos | 26 |
| Refinamento Passada 1,5 | 0,8 s |
| Template matching total | 4,1 s (25 pares) |
| Matching médio por par | 164 ms |
| Taxa de saída antecipada | 58 % (15/25) |
| Taxa de match forte | 84 % (21/25) |
| Match suave ativado | 3 pares |
| Fallback perfil 1D | 1 par |
| Tudo falhou (adicionado) | 0 pares |
| Tamanho final | 1.170 × 18.600 |
| Tempo end-to-end | ~8,5 s |

A aceleração piramidal é impressionante: o passo de 12 do Level 1 pula 92 % dos candidatos, o Level 2 calcula só ~16 pontos numa janela de ±32 px, e o Level 3 refina só ±4 px. O cálculo efetivo nos três níveis é aproximadamente **1/8** de uma busca exaustiva.

---

## Detalhes de engenharia que você não pode ignorar

### Não dá para carregar uma imagem de 20.000 pixels de uma vez

Uma imagem longa de 30 frames pode ter 1.170 × 24.000 pixels. RGBA em resolução completa na memória ocupa **112 MB** (1.170 × 24.000 × 4 bytes) — demais para um iPhone.

`StreamingStitchingPlanner` é projetado como pipeline em fluxo: durante o matching, só «frame atual + anterior» residem na memória. Os resultados são gravados como objetos `Piece` (índice da imagem fonte + região de corte + posição destino). A renderização final decodifica e desenha por blocos.

### Algoritmo de remoção de barra de rolagem

A imagem longa montada quase sempre tem uma barra de rolagem residual no lado direito. O motor usa **projeção de gradiente** para eliminá-la:

Extrair uma faixa de 3 % da largura na borda direita → calcular gradiente horizontal acumulado → as bordas esquerda e direita da barra formam dois **picos de gradiente** (separados por 3–20 px) → confirmar posição real linha por linha → sobrescrever com os pixels adjacentes à esquerda. Mesmo procedimento para barras horizontais na parte inferior.

### UI de fallback quando o algoritmo falha

Até o melhor algoritmo tropeça às vezes. O ScrollShot oferece **ajuste interativo fino** em cada linha de costura — o usuário pode arrastar para cima ou para baixo para ajustar a posição de stitching com prévia em tempo real. O `FineTuneGeometryEngine` garante que as restrições geométricas sejam sempre válidas. A prévia renderiza em baixa resolução para velocidade; a exportação volta automaticamente para resolução completa. Essa controlabilidade é também uma das interações-chave do <a href="/pt-br/blog/por-que-escolher-scrollshot-prints-longos-ios/">modo Manual Stitch</a>.

---

## Uma última reflexão

A maior lição ao construir este motor: **o algoritmo de stitching em si não é difícil. O difícil é fazê-lo funcionar em todas as páginas «sem sentido» do mundo real.**

Fundos de chat do WhatsApp parecem todos iguais, listas de produtos da Amazon se repetem infinitamente, o app de Ajustes do iOS tem vastas áreas brancas, as thumbnails do YouTube se movem… cada um é um caso limite que nenhum livro ensina nem nenhum paper descreve.

Um bug que lembro vividamente: ao gravar os Ajustes do iOS, o offset NCC ficava consistentemente errado em cerca de 40 px. Depois de muito debugging, descobri que o topo da página tinha uma grande área branca. Quando o template caía em branco puro, o NCC dava perto de 1,0 em qualquer posição branca — impossível distinguir. Solução: detectar quando a variância do template é baixa demais e pulá-lo automaticamente — template branco puro não carrega informação, melhor não usar.

Outra vez, ainda mais absurdo: gravando a página inicial do YouTube, uma thumbnail de vídeo mostrava um gato se movendo. A área da thumbnail era completamente diferente entre dois frames, derrubando o NCC para 0,3. Nenhum algoritmo sozinho podia salvar isso. Foi o mecanismo de votação com 6 templates que salvou — os outros 5 templates amostraram áreas estáticas, e a votação continuou correta.

Resolver esses problemas não vem de matemática mais elegante. Vem de um truque de engenharia de «vamos improvisar por enquanto» atrás do outro. Se você está trabalhando em algo parecido, espero que este artigo te ajude a evitar alguns desses buracos.

---

## Leitura complementar

- <a href="/pt-br/blog/por-que-escolher-scrollshot-prints-longos-ios/">Por que escolher o ScrollShot? A solução definitiva para prints longos no iOS</a> — Uma visão de produto sobre como o ScrollShot resolve as dores dos prints longos no iOS: stitching automático, manual, privacidade e exportação em alta qualidade.
