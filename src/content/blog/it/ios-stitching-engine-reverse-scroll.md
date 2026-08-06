---
title: "Gli utenti hanno insistito per scorrere verso l'alto per catturare — e ho evitato di riscrivere tutto il motore con una sola riga"
description: "Quando gli utenti vogliono catturare uno screenshot lungo iPhone scorrendo verso l'alto, il mio primo istinto è stato costruire un separato « motore ascendente ». Alla fine, è bastata una sola riga di codice. Questo articolo scompone la progettazione dello stitching a scorrimento inverso di ScrollShot, la tecnica dietro uno screenshot che scorre fluido in app come Messages e WhatsApp, e mostra come rileviamo la direzione di scorrimento, invertiamo l'ordine dei frame e riutilizziamo la pipeline discendente esistente. Vedrai perché il rilevamento della direzione è quasi gratuito, perché invertiamo l'ordine dei frame invece di aggiungere un flag isReversed, e come restituiamo la decisione all'utente quando la confidenza è bassa, per catturare senza che il motore sbagli."
date: "2026-07-12"
category: "Tecnica"
author: "Team ScrollShot"
tags: ["Screenshot lungo iPhone", "Screenshot a scorrimento iPhone", "Screenshot lungo iOS", "Algoritmo di cucitura screenshot", "Scorrimento inverso", "Rilevamento direzione di scorrimento", "Motore ScrollShot", "Unione registrazione schermo"]
readingTime: "6 min di lettura"
cover: "/ios_stitching_engine_reverse_scroll_framework_en.webp"
coverAlt: "Diagramma di matching di template inverso di ScrollShot per uno screenshot che scorre iPhone: prendi il template dall'alto del nuovo frame, cerca l'offset in basso nel frame vecchio"
translationKey: "ios-stitching-engine-reverse-scroll"
---

# Gli utenti hanno insistito per scorrere verso l'alto per catturare — e ho evitato di riscrivere tutto il motore con una sola riga

La maggior parte di chi vuole uno screenshot lungo iPhone — o comunque uno screenshot a scorrimento iPhone dentro un'app — presuppone che l'utente scorra dall'alto verso il basso. Anche il motore di stitching di ScrollShot era stato progettato così all'inizio — ho raccontato tutta la storia in <a href="/it/blog/ios-stitching-engine-v2/">« Quanto è difficile unire due screenshot? Un motore di stitching iOS che mi ha fatto ricominciare — ancora e ancora »</a>: registra → campiona i frame a intervalli regolari → matching di template per frame per calcolare l'offset → trova la migliore cucitura → ritaglia e unisci. Questa pipeline è già solida per il caso dall'alto verso il basso.

Ma il mondo reale ama contraddire. Gli utenti vogliono catturare uno screenshot a scorrimento iPhone di una chat — Messages, WhatsApp o WeChat — o salvare la parte di una pagina web che hanno scorso verso l'alto per vedere, esattamente il caso di « screenshot di pagina intera dentro un'app iPhone » che tutti continuano a chiedere — e durante la registrazione, il dito scivola verso l'alto. Il contenuto scorre al contrario nella registrazione: inizia in fondo alla pagina e la « fine » è in realtà il contenuto precedente. Passalo direttamente nel motore dall'alto verso il basso e ottieni un'immagine capovolta: la parte superiore visiva è il vecchio contenuto della fine della registrazione, e il basso è l'inizio.

Questo articolo riguarda come ScrollShot supporta l'assemblaggio dal basso verso l'alto. Il punto non è un algoritmo profondo — è un compromesso di progettazione estremo sulla poca quantità di codice necessaria.

Per prima cosa, una demo standard di stitching dall'alto verso il basso — lo stitching inverso di cui parleremo si costruisce direttamente sopra di essa:

<div class="blog-demo">
	<video src="/ScrollShot_Preview_En_0509.mp4" poster="/ScrollShot_Preview_En_0509_cover.jpg" controls playsinline preload="metadata"></video>
	<p>Demo di stitching a scorrimento dall'alto verso il basso: registra una volta, scorri una volta, e ScrollShot campiona automaticamente i frame, abbina la sovrapposizione e cuce uno screenshot lungo iPhone completo.</p>
</div>

---

## Primo istinto: costruire un separato « motore ascendente »?

La prima volta che ho incontrato questo requisito, il mio istinto è stato: abbiamo già un motore di stitching discendente, quindi perché non scriverne anche uno ascendente?

Mi sono dissuaso rapidamente. Il cuore del motore discendente è il matching di template inverso: prendi il template dall'alto del nuovo frame (img2) e cerchi in basso nel frame vecchio (img1) per calcolare l'offset. Girarlo in ascendente significa invertire quasi ogni coordinata — da dove viene il template, verso dove scansiona la ricerca, come sono definiti gli offset positivo/negativo, come viene calcolata la regione di cucitura sovrapposta… Un motore di 3.000 righe significherebbe allevare un fratello parallelo, ciascuno con i propri bug e la propria manutenzione. Peggio ancora, ogni correzione al motore discendente dovrebbe essere rispecchiata in quello ascendente, o i due divergerebbero in silenzio.

## Svolta: invertire, poi riutilizzare

Quello che mi ha davvero fermato è stata una semplice osservazione: il motore di stitching non gli importa come « scorre » il contenuto — gli importa solo quale di due frame adiacenti è sopra e quale sotto. Finché la sequenza dei frame è ordinata dalla linea temporale reale del contenuto, lo stesso algoritmo funziona senza soluzione di continuità. Le immagini dal basso verso l'alto sono solo « fuori ordine ».

Quindi l'approccio di ScrollShot è: rileva prima la direzione di scorrimento; se è ascendente, inverti l'intera sequenza dei frame, poi passala alla pipeline discendente esistente.

```
Campionamento frame (scorrimento ascendente, contenuto scorre al contrario):
  [F1 fondo pagina] → [F2] → [F3] → … → [Fn cima pagina]
                                 │
             ScrollDirectionDetector decide: ascendente
                                 │
              reversedForStitching() inverte l'ordine dei frame
                                 ▼
  [Fn cima pagina] → … → [F3] → [F2] → [F1 fondo pagina]
                                 │
              nello stesso motore di stitching discendente (zero modifiche)
                                 ▼
                   immagine lunga corretta (cima → fondo)
```

Il diagramma sotto disegna l'intera catena « invertire + riutilizzare » — campionamento frame, rilevamento direzione, inversione dell'ordine dei frame, riutilizzo del motore discendente, fino all'immagine lunga corretta:

![Diagramma dell'algoritmo di stitching a scorrimento dal basso verso l'alto](/ios_stitching_engine_reverse_scroll_framework_en.webp)

Il codice centrale è solo una riga:

```swift
let normalizedBatch = reverseFrames ? batch.reversedForStitching() : batch
```

`reversedForStitching()` inverte i riferimenti ai frame estratti e li rinumera; tutto il resto resta intatto. Dopo l'inversione, il contenuto « che scorre al contrario » torna a « scorrere in avanti », e il matching di template, il NCC e la logica di cucitura a valle non hanno bisogno di una sola riga modificata. Zero nuovo codice di stitching.

> ⚠️ Trappola: perché « invertire l'ordine dei frame » e non « aggiungere un flag `isReversed` dentro il motore »? Perché quest'ultimo trasforma ogni sistema di coordinate in due copie di logica — « avanti / indietro » — raddoppiando la superficie dei bug. Spostando la trasformazione prima di alimentare i dati, il motore affronta sempre un solo mondo.

## Rilevamento della direzione: l'unico codice nuovo — ed è quasi gratis

Poiché invertiamo, la precondizione è riconoscere che l'utente ha scorso verso l'alto. Se questo passaggio è pesante, tutti i risparmi sopra vanno sprecati. L'approccio di ScrollShot è leggero, e abbastanza furbo da essere quasi « gratis » — riutilizzare il motore di matching di template esistente, semplicemente scambiando i parametri ed eseguendolo due volte.

`ScrollDirectionDetector` campiona uniformemente circa 7 coppie di frame adiacenti dalla metà della registrazione (evitando il conto alla rovescia iniziale e il pulsante di stop alla fine), e per ogni coppia esegue due volte lo stesso matcher:

```swift
let down = directionalScore(previous: prev, current: cur)  // prev→cur significa «scorrimento verso il basso»?
let up   = directionalScore(previous: cur, current: prev)  // cur→prev significa «scorrimento verso il basso»?
```

La chiave è la riga `guard outcome.offset > 0` dentro `directionalScore`. Il matching inverso di questo motore restituisce un offset positivo solo quando « il template dall'alto del nuovo frame atterra più in basso nel frame vecchio ». Quindi:

- Se lo scorrimento reale è discendente, la chiamata diretta `down` colpisce (offset > 0, valido), mentre la chiamata inversa `up` non trova contenuto vecchio più in basso in cima al nuovo frame, quindi offset ≤ 0, marcata non valida, punteggio 0;
- Se lo scorrimento reale è ascendente, è il contrario: `down` non è valido, `up` è valido.

Il criterio di direzione è in realtà « **quale chiamata è valida** », non che i due punteggi siano simmetrici. Nella mia prima bozza ho scritto distrattamente « perfettamente simmetrico », finché un collega ha indicato e chiesto « come possono essere simmetrici valido e non valido? » — questo è l'equivoco che più voglio correggere in questo articolo.

Dopo aver ottenuto il punteggio `down` / `up` di ogni coppia, il punteggio per coppia funziona così:

```
score = probability×0.55 + nccBoost×0.20 + overlapRatio×0.15 + consensusBoost×0.10
score ×= sadPenalty          // più la sovrapposizione è sfocata, più il punteggio è scontato
punteggio valido deve essere ≥ 0.26
```

Poi la votazione: all'interno di una coppia, se `up ≥ down × 1.25` (o lo supera di 0,08 in valore assoluto), emette un voto ascendente; altrimenti emette un voto discendente. Decisione finale:

- `upwardVotes ≥ downwardVotes + 2`, e
- `upwardScore ≥ downwardScore × 1.25`

solo allora viene trattato come scorrimento ascendente. Tutto gira su miniature a bassa risoluzione limitate a 320 px in un thread in background, con un impatto quasi impercettibile sul tempo totale.

## In caso di dubbio, lascialo all'utente

Il rilevamento non è affidabile al 100 %. Una registrazione quasi statica che si è spostata solo di due o tre pixel ha un segnale di direzione molto debole; invertire avventatamente è peggio che non invertire. Quindi c'è una barriera: `shouldAskForReverseConfirmation` scatta solo quando la confidenza ≥ 0,72 e i campioni validi ≥ 3 coppie, mostrando una conferma leggera: « Abbiamo rilevato che hai registrato scorrendo verso l'alto — invertire lo stitching? » Se l'utente tocca inverti, `reverseFrames: true`; se non è sicuro, cuce nell'ordine originale. Il motore non produce mai silenziosamente un'immagine errata perché ha indovinato male la direzione.

## I due modi affiancati

| | Dall'alto verso il basso | Dal basso verso l'alto |
|---|---|---|
| Gesto di registrazione | dito scivola verso il basso | dito scivola verso l'alto |
| Ordine di campionamento frame | linea temporale naturale | linea temporale naturale (il contenuto scorre al contrario) |
| Rilevamento direzione | non necessario | campiona 7 coppie a metà, matcher esegue due volte |
| Motore di stitching | originale | originale (riutilizzato dopo inversione ordine frame) |
| Nuovo codice | — | solo rilevamento direzione + inversione in una riga |
| Fallback | — | chiede conferma quando la confidenza è bassa |

## Per concludere

Guardando indietro, lo stitching dal basso verso l'alto non ha quasi « codice proprio » in ScrollShot — è totalmente parassita del motore discendente. L'idea di « normalizzare l'ordine prima, poi riutilizzare lo stesso motore » è poi diventata il nostro pattern di partenza predefinito nell'aggiungere nuovi modi di stitching: la prossima volta che faremo stitching orizzontale o a zigzag, molto probabilmente cercheremo prima come torcere il problema di nuovo in « discendente unidimensionale » invece di ricominciare da zero.

---

## FAQ: catturare uno screenshot a scorrimento nelle app iPhone

**ScrollShot può fare screenshot a scorrimento in app iPhone come Messages e WhatsApp?**
Sì. Che tu voglia uno screenshot lungo iPhone di una pagina web o uno screenshot a scorrimento iPhone dei thread di Messages e WhatsApp, ScrollShot registra il tuo schermo e cuce i frame automaticamente. Poiché cattura tramite registrazione dello schermo invece di fare affidamento su un pulsante di sistema « pagina intera », funziona dentro qualsiasi app — il caso di screenshot di pagina intera dentro un'app iPhone che tutti continuano a chiedere.

**Cosa succede se scorre verso l'alto mentre registro una chat?**
Questo è tutto il punto di questo articolo. Uno screenshot a scorrimento iPhone Messages che gli utenti amano, o uno screenshot iPhone WhatsApp che i fan catturano scorrendo indietro, entrambi significano che il contenuto scorre al contrario. ScrollShot rileva la direzione di scorrimento ascendente, inverte l'ordine dei frame e riutilizza lo stesso motore di stitching discendente — così ottieni comunque uno screenshot a scorrimento iPhone corretto senza che noi dobbiamo riscrivere nulla.

**In cosa è diverso dallo screenshot integrato di iOS?**
Lo screenshot integrato non può sempre catturare una pagina intera dentro le app. ScrollShot è fatto per il caso dello screenshot lungo e a scorrimento iPhone: registra una volta, scorri come vuoi (su o giù), e ottieni una sola immagine lunga e fluida.

---

## Letture complementari

- <a href="/it/blog/ios-stitching-engine-v2/">Quanto è difficile unire due screenshot? Un motore di stitching iOS che mi ha fatto ricominciare — ancora e ancora</a> — scegliere 30 keyframe da 1.800 frame, matching di template inverso, ricerca NCC piramidale fino a una strategia di fallback a tre livelli — un teardown completo del motore di stitching di ScrollShot.
- <a href="/it/blog/perche-scegliere-scrollshot-screenshot-lunghi-ios/">Perché scegliere ScrollShot? La soluzione definitiva per screenshot lunghi e fluidi su iOS</a> — una prospettiva di prodotto su come ScrollShot risolve i punti dolenti degli screenshot lunghi iOS, incluse l'unione automatica per registrazione schermo, lo stitching manuale, la protezione della privacy e l'export HD.
