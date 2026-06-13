---
title: "Quanto è difficile unire due screenshot? Un motore di stitching iOS che mi ha fatto ricominciare — ancora e ancora"
description: "Smontiamo il motore di stitching di ScrollShot: selezionare 30 frame chiave da 1.800, template matching inverso, ricerca piramidale NCC, strategia di fallback a tre livelli e i trucchi di ingegneria che nessun manuale insegna."
date: "2026-06-10"
category: "Tecnica"
author: "Team ScrollShot"
tags: ["screenshot lunghi iOS", "algoritmo di stitching", "template matching", "NCC", "motore ScrollShot", "stitching registrazione schermo"]
readingTime: "15 min di lettura"
featured: true
cover: "/scrollshot_video_to_long_screenshot_workflow_it.webp"
coverAlt: "Pipeline del motore di stitching di ScrollShot in sei fasi: dalla registrazione schermo all'immagine lunga"
translationKey: "ios-stitching-engine-v2"
---

# Quanto è difficile unire due screenshot? Un motore di stitching iOS che mi ha fatto ricominciare — ancora e ancora

Ho passato diversi mesi a fare una sola cosa: far sì che lo stitching di screenshot lunghi su mobile fosse «perfettamente allineato».

Sembra facile, no? Due screenshot adiacenti, trovare la sovrapposizione, tagliare e incollare. Ma quando ti metti a programmare, scopri che «perfettamente allineato» è un abisso di ingegneria senza fondo.

Questo articolo smonta il motore di stitching di ScrollShot. Nessun pitch di prodotto, nessuna promessa vuota — solo algoritmi e i dettagli di ingegneria che mi hanno fatto ridisegnare tutto più e più volte. Se sei curioso del posizionamento complessivo di ScrollShot, inizia dalla <a href="/it/blog/perche-scegliere-scrollshot-screenshot-lunghi-ios/">panoramica del prodotto: perché scegliere ScrollShot per screenshot lunghi su iOS</a>.

---

## Perché non usare lo stitching panoramico di OpenCV?

Intuitivamente, l'assemblaggio di immagini è un problema vecchio. La classe `Stitcher` di OpenCV produce panorami in poche righe di codice.

Ma gli screenshot lunghi e le foto panoramiche sono bestie completamente diverse. Un panorama è catturato con rotazione orizzontale e trasformazione prospettica, con sovrapposizione generalmente piccola. Uno screenshot lungo è **scorrimento verticale unidirezionale** — frame consecutivi condividono dal 5 % all'80 % di contenuto identico, e — questo è cruciale — **2 pixel di disallineamento si vedono subito** perché potresti unire del testo.

Chiunque abbia provato OpenCV condivide la stessa esperienza: il feature matching si perde sugli schermi di chat. Alcuni utenti mettono un'immagine di sfondo nell'app di messaggistica, così la maggior parte del frame sembra uguale. Invece che la fine di un frame si sovrapponga all'inizio del successivo, i punti SIFT generano nuvole di coppie «simili ma diverse».

Così ho scelto un'altra strada: ho scritto la prima riga di un motore di template matching da zero, ottimizzato per lo scenario «screenshot a scorrimento verticale».

La pipeline complessiva è così:

![Pipeline del motore di stitching ScrollShot](/scrollshot_video_to_long_screenshot_workflow_it.webp)

Il motore supporta anche Apple Vision Framework per il matching (veloce ma grossolano), ma questo articolo si concentra sul template matching proprietario — è lì che avviene il vero lavoro. Per vedere come questo algoritmo si traduce in un'esperienza di <a href="/it/blog/perche-scegliere-scrollshot-screenshot-lunghi-ios/">registra una volta, ottieni uno screenshot lungo</a>, consulta la presentazione del prodotto.

---

## Sfida 1: scegliere 30 frame utili da 1.800

Una registrazione di 30 secondi a 60 fps = 1.800 frame. Elaborarli tutti? La memoria esplode per prima, il tempo subito dopo.

L'approccio più intuitivo è il **campionamento a intervalli di tempo**: 3 frame al secondo. Ma ha un difetto fatale — la velocità di scorrimento dell'utente non è uniforme. Con uno swipe veloce, due frame consecutivi differiscono di mezzo schermo, e lo stitching perde inevitabilmente contenuto. In navigazione lenta, i frame adiacenti sono quasi identici — puro spreco.

ScrollShot usa il **campionamento a distanza**: invece di guardare il tempo, guarda «quanto lo schermo è scrollato». Un frame vale la pena catturarlo solo quando lo spostamento cumulativo supera una soglia.

### Qual è la soglia di spostamento giusta?

Questo numero mi ha tormentato per settimane. Troppo piccolo, lo scorrimento lento scatena un'estrazione frenetica piena di duplicati. Troppo grande, lo scorrimento veloce perde contenuto.

La formula finale:

```
displacementThreshold = dsHeight × 0,60 × presetScale
```

Dove `dsHeight` è l'altezza del frame dopo il downsampling (1080p ridotto 3× ≈ 360p, ovvero `dsHeight ≈ 640`), `0,60` è il rapporto base e `presetScale` è un preset selezionabile (aggressivo/bilanciato/conservativo).

In modalità bilanciata, un frame viene catturato ogni **384 pixel** (640 × 0,60) di scorrimento — circa metà dell'altezza dello schermo.

C'è anche un filtro del rumore facile da trascurare: **uno spostamento singolo deve essere ≥ 3 pixel per contare nel cumulativo**. Senza questo, il rumore sub-pixel del template matching si accumula lentamente, causando «estrazione fantasma» anche su uno schermo fermo. Mi ci è voluto un intero pomeriggio per trovare questo bug.

### Due passate in pratica

**Passata 1 — analisi del movimento a bassa risoluzione.** I frame vengono ridotti 3× (1080p → 360p, un ordine di grandezza di velocità in più), e il template matching leggero traccia lo spostamento verticale frame per frame. Qui si nascondono diversi dettagli di ingegneria:

- **Passo adattivo**: quando lo spostamento è grande, salti grandi (`nativeFPS / 6`, circa ogni 10 frame). Quando è piccolo, scansione frame per frame (`nativeFPS / 30`). Quando la distanza rimanente scende sotto il 25 % della soglia, passo minimo forzato — altrimenti salti letteralmente un frame
- **Rilevamento cambio scena**: il SAD per pixel tra frame adiacenti supera 40,0? Probabilmente l'utente ha cambiato app. Cattura immediatamente
- **Troncamento da rimbalzo**: usa il flusso ottico di Vision per rilevare la direzione del movimento. Se lo spostamento cumulativo scende sotto -50 px (l'utente sta scrollando verso l'alto), ha raggiunto la cima — scarta tutti i frame successivi. Ma questa soglia non può essere troppo stretta: inizialmente ho messo -10, e lievi tremori del dito attivavano il troncamento, tagliando la registrazione a metà

**Passata 1,5 — raffinamento della nitidezza.** Per ogni frame candidato, cercare il più nitido in una finestra di ±2 frame intorno.

Come quantificare la nitidezza? Uso l'**energia laplaciana** — convoluzione dell'immagine in scala di grigi con un kernel 3×3, poi la media delle risposte al quadrato:

```
kernel = [-1, -1, -1,
          -1,  8, -1,
          -1, -1, -1]

sharpness = mean((convolve(gray, kernel) - 128)²)
```

Sottrarre 128 perché l'output della convoluzione ha un bias di 128 (requisito di vImage). Il quadrato e la media danno l'energia ad alta frequenza. Valore più alto = frame più nitido.

Perché energia laplaciana invece di varianza? Per gli screenshot, entrambi i metodi selezionano frame quasi identici, ma il primo è computazionalmente più semplice — `vDSP_vsq` + `vDSP_meanv` di vImage, due righe.

Il limite di risoluzione è 720×1280, sufficiente. Il motivo è pratico: il frame più nitido è l'istante in cui l'utente alza il dito; i frame durante lo swipe tendono ad avere motion blur. L'energia laplaciana è molto sensibile — la differenza è solitamente 2–3×.

---

## L'algoritmo centrale: motore di template matching

È la parte più grande del motore per volume di codice (oltre 3.000 righe in un singolo file), e quella che mi ha torturato più a lungo con i bug.

### Matching inverso: perché cercare il vecchio dal nuovo?

La mia prima versione usava il «matching diretto» — template dal fondo del frame vecchio, ricerca nel nuovo. Ha fallito sulle schermate WhatsApp: il fondo del vecchio mostrava un «OK», il nuovo ne aveva tre. Il matching ha agganciato quello più in alto, e l'offset era sbagliato di 200 pixel.

Poi ho invertito l'approccio: **Reverse Matching**. Prendere il template dalla **parte superiore** del frame nuovo (img2) e cercare nella **parte inferiore** del frame vecchio (img1).

Perché l'inverso è meglio? La parte superiore del nuovo è «contenuto appena scrollato» — questo contenuto esiste sicuramente nel frame vecchio, e **esiste esattamente una volta** (nella parte medio-bassa). Al contrario, il «contenuto vecchio in via di sparizione» in fondo al frame vecchio potrebbe apparire appena nel nuovo, o essere già stato spinto fuori dallo schermo.

![Diagramma di matching inverso](/scrollshot_video_to_long_screenshot_algo_it.webp)

La ricerca salta automaticamente la barra di stato (~250 px in alto) e la tab bar inferiore (~350 px). Ma qui c'è un'altra insidia — alcune app hanno barre di navigazione di altezze variabili, alcune pagine hanno la tastiera, altre hanno pulsanti flottanti.

Così ho aggiunto il **rilevamento dinamico del footer**. Funziona così: scansionare dal basso verso l'alto riga per riga, prendere l'80 % centrale di ogni riga (tagliare 10 % da ogni lato per evitare pulsanti flottanti), campionare ogni 16 pixel e calcolare la MAD (differenza assoluta media) della stessa riga in entrambi i frame. MAD ≤ 3,2 indica che la riga è quasi identica — probabilmente un elemento UI statico. Fermarsi dopo 4+ righe consecutive non statiche (`maxGapTolerance = 4`). Meno di 24 righe statiche in totale → nessuna barra fissa, restituire 0.

La soglia 3,2 è empirica. Una zona statica con sfondo bianco ha MAD di 0–1,5. Il rumore di compressione JPEG fluttua tra 2–4. Le righe con cambiamento reale di contenuto sono almeno a 8. 3,2 si colloca proprio nella fessura — tollera il rumore di compressione ma rifiuta i cambiamenti di contenuto.

### 6 template votano contro «sembrano tutti uguali»

Un singolo blocco di template è facile da abbinare male. Immagina una pagina di elenco prodotti e-commerce — ogni scheda prodotto ha un layout quasi identico, un template potrebbe abbinarsi al prodotto precedente o successivo.

Il motore estrae **6 blocchi di template** contemporaneamente (ciascuno alto 100 px, spaziati dalla parte superiore del nuovo), cerca indipendentemente la migliore posizione nel vecchio e ottiene 6 valori di offset. Poi **clusterizza** questi 6 offset (tolleranza: 5 px) e prende la mediana del cluster più grande.

Se 5 template su 6 puntano a offset ≈ 320 e 1 a 800, quell'800 è quasi certamente un falso match — scartare.

C'è anche un'ottimizzazione di uscita anticipata: se i primi 3 template sono già d'accordo (tolleranza: 4 px) e l'offset non è vicino a 0 (escludendo «l'utente non ha scrollato affatto»), gli altri 3 non servono.

Un dettaglio su cui ho riflettuto a lungo: quale tolleranza? Inizialmente ho messo 2 px, ma a causa dell'errore di quantizzazione del NCC (ne parlo dopo), gli offset di template diversi nello stesso paio differivano spesso di 2–3 px, e l'uscita anticipata quasi non si attivava. Ampliando a 4 px, circa il 60 % dei coppie l'ha attivata nei test reali, senza perdita di precisione osservabile.

### NCC piramidale: ricerca da grossolano a fine

Ogni matching usa **NCC (Normalized Cross-Correlation)** per misurare la similarità. La formula NCC:

$$\text{NCC}(T, I) = \frac{\sum(T_i - \bar{T})(I_i - \bar{I})}{\sqrt{\sum(T_i - \bar{T})^2 \cdot \sum(I_i - \bar{I})^2}}$$

Il vantaggio del NCC è l'insensibilità ai cambiamenti di luminosità (registrazione di giorno e la stessa pagina in modalità scura combaciano). Intervallo [-1, 1], dove 1 = corrispondenza perfetta. Intuitivamente: il NCC non confronta valori assoluti dei pixel ma se il «pattern di variazione chiaro-scuro» è lo stesso.

Ma scorrere pixel per pixel su tutto il frame vecchio è troppo lento. Il motore usa una **ricerca piramidale a tre livelli**:

| Livello | Passo | Finestra | Candidati | Scopo |
|---------|-------|----------|-----------|-------|
| Level 1 (Pre) | 12 px | Intero intervallo | ~125 | Posizionamento grossolano |
| Level 2 (Coarse) | 4 px | ±32 px | ~16 | Precisione per riga |
| Level 3 (Fine) | 1 px | ±4 px | 9 | Raffinamento pixel per pixel |

Un dato da condividere: il passo di 12 del Level 1 cerca solo 1/12 delle posizioni candidate, ottenendo circa **12× di accelerazione** per template. Il calcolo totale sui tre livelli è circa 1/8 di una ricerca esaustiva.

Quando i candidati superano 64 (tipico al Level 1), si attiva automaticamente il calcolo parallelo GCD (`DispatchQueue.concurrentPerform`), distribuendo la ricerca su più core CPU. Qui ho incontrato un problema: inizialmente usavo `NSLock` per proteggere una variabile `bestScore` condivisa, ma la contesa su 6 core rallentava tutto. Passare a migliori locali per thread con fusione finale ha ridotto la contesa da O(n) a O(1).

### Finestra di ricerca: lascia che la storia ti guidi

Cercare nell'intera area utilizzabile del frame vecchio ogni volta è lento e soggetto a falsi match (la parte superiore e inferiore di una pagina possono avere layout simili).

Il motore usa due tipi di «priori» per restringere la finestra:

- **Priori temporale**: se l'offset della coppia precedente era 300 px, questa coppia è probabilmente simile. Finestra ridotta a 300 ± 120 px
- **Priori Vision**: per la prima coppia senza storico, l'API di registrazione di Apple Vision dà una stima approssimativa. Finestra a stima ± 180 px

Se la finestra stretta non trova almeno 3 match coerenti (il priori era sbagliato), ritorno automatico alla ricerca su intero intervallo.

La condizione «almeno 3 coerenti» è stata anch'essa imparata con errori. Inizialmente usavo «almeno 1», ma quando il priori Vision era molto sbagliato (a volte 500 px di errore), un falso match nella finestra stretta passava per caso come valido. Con 3, un falso match dovrebbe ingannare 3 template indipendenti simultaneamente — statisticamente quasi impossibile.

### Quando il matching normale fallisce: fallback a tre livelli

Gli scenari reali sono molto più duri del laboratorio. Pulsanti flottanti, overlay semitrasparenti, video in riproduzione, cursori lampeggianti — tutto questo abbassa i punteggi NCC.

Il motore implementa una strategia di fallback a tre livelli. Con dati reali di frequenza:

> **Livello 1: Match forte (~80 % delle coppie).** La maggior parte dei template ha NCC ≥ 0,6 e punta allo stesso offset. Il caso più comune.
>
> **Livello 2: Match morbido (~12 % delle coppie).** Il miglior template ha NCC solo 0,45–0,6 — forse un elemento UI flottante ha coperto parzialmente l'area. Si usa il SAD dell'intera zona di sovrapposizione come verifica secondaria. SAD per pixel ≤ 26,0 → accettato; altrimenti rifiutato.
>
> **Livello 3: NCC profilo 1D (~5 % delle coppie).** «Appiattire» l'immagine 2D in una curva di medie per riga — un array 1D. Inter-correlare le due curve 1D. Circa 100× più veloce, ma con maggior rischio di falsi positivi.
>
> **Tutto fallito (~3 % delle coppie)?** Questo frame è probabilmente un cambio scena o senza sovrapposizione. Aggiungere in fondo senza stitching.

La verifica SAD del livello 2 è sfumata. La soglia base è **25,0 per pixel**, ma quando il rapporto di sovrapposizione supera l'80 %, viene stretta adattativamente:

```
if overlapRatio > 0,8:
    scale = max(minScale, 1,0 - (overlapRatio - 0,8) × 4,0)
    threshold = 25,0 × scale
```

Perché stringere? Più grande è la zona di sovrapposizione, più campioni statistici ha il SAD, il rumore casuale si annulla nella media — un falso match può anch'esso avere SAD basso. Senza stringere, i falsi positivi aumentano negli scenari di alta sovrapposizione.

Indipendentemente dal percorso, c'è sempre un **raffinamento dell'offset** finale: calcolare il SAD pixel per pixel in ±6 px dall'offset candidato e prendere il minimo.

Perché l'offset del NCC ha ancora bisogno di raffinamento? Mi ci sono voluti tre giorni per capirlo. Il NCC è molto «piatto» vicino all'ottimo — 2 px di differenza possono cambiare il NCC solo di 0,003. Ma il SAD è estremamente sensibile a spostamenti di ±1 px — 1 px di differenza può cambiare il SAD di 3–5 unità. I due si complementano: NCC per il posizionamento grossolano, SAD per la calibrazione a livello di pixel. Quando unisci testo, 2 px di errore è la differenza tra «una riga di testo tagliata a metà» e «perfettamente allineata».

### Linea di giunzione: non tagliare il testo a metà

Hai trovato l'offset. I due frame hanno una zona di sovrapposizione. Dove «tagliare»?

L'approccio intuitivo è tagliare a metà. Ma se a metà c'è proprio una riga di testo grande, la metà superiore e quella inferiore non si allineano — l'occhio lo nota subito.

L'approccio del motore: calcolare la differenza di pixel di **ogni riga** nella zona di sovrapposizione, poi usare una finestra scorrevole per trovare la posizione con differenza totale minima. L'altezza della finestra è adattiva — `min(overlapH, max(100, adaptiveCutHeight))`. Questa posizione è dove il contenuto dei due frame è più simile — la giunzione qui è visivamente più naturale.

---

## Benchmark di performance

Testato con una tipica registrazione di 30 secondi di chat WhatsApp (iPhone 15 Pro, 1080×2400, 60 fps). Metriche chiave:

| Metrica | Valore |
|---------|--------|
| Frame totali | 1.800 |
| Tempo analisi Passata 1 | 3,2 s |
| Frame chiave estratti | 26 |
| Raffinamento Passata 1,5 | 0,8 s |
| Template matching totale | 4,1 s (25 coppie) |
| Matching medio per coppia | 164 ms |
| Tasso uscita anticipata | 58 % (15/25) |
| Tasso match forte | 84 % (21/25) |
| Match morbido attivato | 3 coppie |
| Fallback profilo 1D | 1 coppia |
| Tutto fallito (aggiunto) | 0 coppie |
| Dimensione finale | 1.170 × 18.600 |
| Tempo end-to-end | ~8,5 s |

L'accelerazione piramidale è notevole: il passo di 12 del Level 1 salta il 92 % dei candidati, il Level 2 calcola solo ~16 punti in una finestra di ±32 px, e il Level 3 raffina solo ±4 px. Il calcolo effettivo sui tre livelli è circa **1/8** di una ricerca esaustiva.

---

## Dettagli di ingegneria che non puoi ignorare

### Non puoi caricare un'immagine di 20.000 pixel tutta in una volta

Un'immagine lunga da 30 frame può essere 1.170 × 24.000 pixel. RGBA a piena risoluzione in memoria occupa **112 MB** (1.170 × 24.000 × 4 byte) — troppo per un iPhone.

`StreamingStitchingPlanner` è progettato come pipeline in streaming: durante il matching, solo «frame corrente + precedente» risiedono in memoria. I risultati sono registrati come oggetti `Piece` (indice immagine sorgente + regione di ritaglio + posizione destinazione). Il rendering finale decodifica e disegna a tasselli.

### Algoritmo di rimozione della barra di scorrimento

L'immagine lunga assemblata ha quasi sempre una barra di scorrimento residua sul lato destro. Il motore usa la **proiezione del gradiente** per eliminarla:

Estrarre una striscia del 3 % della larghezza dal bordo destro → calcolare gradiente orizzontale cumulato → i bordi sinistro e destro della barra formano due **picchi di gradiente** (distanti 3–20 px) → confermare posizione reale riga per riga → sovrascrivere con i pixel adiacenti a sinistra. Stesso procedimento per barre orizzontali in basso.

### UI di riserva quando l'algoritmo fallisce

Anche il miglior algoritmo inciampa a volte. ScrollShot offre una **regolazione interattiva fine** su ogni linea di giunzione — l'utente può trascinare su o giù per regolare la posizione di stitching con anteprima in tempo reale. Il `FineTuneGeometryEngine` garantisce che i vincoli geometrici siano sempre validi. L'anteprima renderizza a bassa risoluzione per velocità; l'esportazione passa automaticamente alla risoluzione completa. Questa controllabilità è anche una delle interazioni chiave della <a href="/it/blog/perche-scegliere-scrollshot-screenshot-lunghi-ios/">modalità Manual Stitch</a>.

---

## Un'ultima parola

La lezione più grande da questo motore: **l'algoritmo di stitching in sé non è difficile. Il difficile è farlo funzionare su tutte le pagine «irragionevoli» del mondo reale.**

Gli sfondi delle chat WhatsApp sembrano tutti uguali, gli elenchi prodotti Amazon si ripetono all'infinito, l'app Impostazioni di iOS ha vaste zone bianche, le miniature dei video YouTube si muovono… ognuno è un caso limite che nessun manuale insegna e nessun paper descrive.

Un bug che ricordo vividamente: registrando l'app Impostazioni di iOS, l'offset NCC era sistematicamente sbagliato di circa 40 px. Dopo un lungo debugging, ho scoperto che la parte superiore aveva una grande zona bianca. Quando il template finiva su bianco puro, il NCC dava quasi 1,0 in qualsiasi posizione bianca — impossibile distinguerle. Soluzione: rilevare quando la varianza del template è troppo bassa e saltarlo automaticamente — un template bianco puro non porta informazione, meglio non usarlo.

Un'altra volta, ancora più assurdo: registrando la homepage di YouTube, una miniatura video mostrava un gatto che si muoveva. L'area della miniatura era completamente diversa tra due frame, facendo crollare il NCC a 0,3. Nessun algoritmo da solo poteva salvarlo. È stato il meccanismo di votazione a 6 template a salvarlo — gli altri 5 template campionavano zone statiche, e la votazione è rimasta corretta.

Risolvere questi problemi non viene da matematica più elegante. Viene da un trucco di ingegneria «per ora facciamo così» dopo l'altro. Se stai lavorando su qualcosa di simile, spero che questo articolo ti aiuti a evitare qualcuna di queste buche.

---

## Letture correlate

- <a href="/it/blog/perche-scegliere-scrollshot-screenshot-lunghi-ios/">Perché scegliere ScrollShot? La soluzione definitiva per screenshot lunghi e fluidi su iOS</a> — Uno sguardo al prodotto su come ScrollShot risolve i dolori degli screenshot lunghi su iOS: stitching automatico, manuale, privacy ed esportazione in alta qualità.
