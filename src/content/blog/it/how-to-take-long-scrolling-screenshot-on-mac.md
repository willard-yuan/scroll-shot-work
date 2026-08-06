---
title: "Come Fare uno Screenshot Lungo (a Scorrimento) su Mac nel 2026: Guida Completa"
description: "macOS non ha uno screenshot a scorrimento nativo. Questa guida 2026 spiega il perché, confronta GoFullPage, Shottr, CleanShot X, Xnapper, screensnap e ScrollShot, e mostra come catturare qualsiasi finestra gratis con ScrollShot per Mac."
date: "2026-08-05"
category: "Guida"
author: "Team ScrollShot"
tags: ["screenshot lungo su Mac", "screenshot a scorrimento Mac", "cattura schermo scorrevole Mac", "ScrollShot per Mac", "strumento screenshot macOS", "scroll and stitch"]
readingTime: "10 min di lettura"
cover: "/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp"
coverAlt: "Un normale screenshot a schermo intero del Mac accanto a una cattura a scorrimento ScrollShot di 765 × 4091 px dello stesso contenuto"
translationKey: "how-to-take-long-scrolling-screenshot-on-mac-2026"
faq:
  - question: "Posso fare uno screenshot a scorrimento con l'app Screenshot integrata su Mac?"
    answer: "No. Cmd + Shift + 4 e l'app Screenshot catturano solo lo schermo visibile. Ti serve una funzione del browser, un'esportazione PDF o un'app di terze parti come ScrollShot, Shottr o CleanShot X."
  - question: "Qual è il modo più veloce e gratuito per fare uno screenshot lungo su Mac?"
    answer: "Solo per le pagine web: GoFullPage (meno di 30 secondi). Per tutto ciò che è fuori dal browser — Slack, PDF, app — sia ScrollShot per Mac che Shottr funzionano ed entrambi sono gratuiti."
  - question: "Esiste uno strumento di screenshot a scorrimento gratuito che traduca e oscuri anche i dati?"
    answer: "Sì — ScrollShot per Mac. È gratuito e unisce in modo unico la cattura a scorrimento con OCR, traduzione in oltre 30 lingue, oltre 19 strumenti di annotazione e oscuramento automatico di dati personali/volti in un'unica app."
  - question: "Gli screenshot a scorrimento funzionano con PDF e documenti?"
    answer: "Sì, se usi un'app di cattura a scorrimento nativa (ScrollShot, Shottr, CleanShot X) sul PDF aperto in Anteprima o in un lettore. Il 'Salva come PDF' integrato produce un documento, non un'immagine."
  - question: "Perché il mio screenshot a scorrimento ha intestazioni duplicate?"
    answer: "La pagina ha un elemento fisso — bollicina di chat, barra di navigazione o banner dei cookie — che resta fermo mentre il contenuto scorre. Chiudilo o nascondilo prima di catturare."
  - question: "In che formato salvare gli screenshot a scorrimento?"
    answer: "PNG per qualità e trasparenza; JPG se conta la dimensione del file e non ti serve trasparenza; PDF solo se ti serve testo ricercabile."
---

# Come Fare uno Screenshot Lungo (a Scorrimento) su Mac nel 2026: Guida Completa

Lasciami risparmiare i 20 minuti che ho perso la prima volta che mi è servito.

Avevo un thread Slack di 4.000 pixel da mandare a uno sviluppatore. Ho premuto `Cmd + Shift + 4`, trascinato un rettangolo e... ho ottenuto una sola schermata. Il resto della conversazione era sotto la piega, e macOS l'ha ignorato volentieri. **Non esiste un modo nativo per fare uno screenshot a scorrimento su Mac** — non con `Cmd + Shift + 4`, non con l'app Screenshot, non con Anteprima. Se sei qui sperando in una scorciatoia nascosta di Apple, te lo dico chiaro: non esiste. Windows ce l'ha in Strumento di ritaglio. iPhone ce l'ha. Android ce l'ha. macOS, nel 2026, non lo include ancora di fabbrica.

La buona notizia: è completamente risolvibile, e hai più opzioni di quante ammettano la maggior parte dei blog "classifica dei 10 migliori". Questa guida va oltre la superficie. Spiego *perché* il Mac non può farlo in modo nativo, cosa succede davvero quando un'app "scorre e cucisce", e quale strumento è adatto a quale lavoro — incluso quello che uso ogni giorno, **[ScrollShot per Mac](/it/blog/perche-scegliere-scrollshot-screenshot-lunghi-ios/)** (gratuito, e l'unica opzione che fa tutto il lavoro in un'unica app).

![Prima vs Dopo: una normale schermata del Mac accanto a una cattura a scorrimento ScrollShot di 765 × 4091 px dello stesso contenuto](/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp)

*Uno screenshot normale cattura solo il viewport visibile. ScrollShot cattura l'intera area scorrevole di 765 × 4091 px in un'unica immagine — e poi consente di annotare, fare OCR, tradurre e oscurare i dati senza uscire dall'app.*

---

## Perché macOS non può fare uno screenshot a scorrimento in modo nativo

Non è pigrizia di Apple — è così che funziona lo schermo.

Quando premi `Cmd + Shift + 4`, macOS cattura il *framebuffer* attuale: un'istantanea pixel per pixel di ciò che è fisicamente sullo schermo in questo momento. Una finestra scorrevole (Slack, una pagina web, un PDF) renderizza solo la parte visibile. Il contenuto fuori schermo non è "lì" da catturare — viene disegnato su richiesta mentre scorri. Non c'è un "buffer di scorrimento" come in un terminale. Quindi uno strumento di cattura ha due opzioni:

1. **Chiedere all'app il contenuto completo** (funziona solo se l'app lo espone — i browser sì, la maggior parte delle app no).
2. **Scorrere un po', catturare un po', ripetere e poi cucire i pezzi** in un'unica immagine alta.

Ogni strumento di "screenshot a scorrimento" su Mac fa la #2 sotto il cofano (o la #1 solo per le pagine web). Questa distinzione conta, perché spiega perché alcuni strumenti funzionano solo in Chrome e altri funzionano *ovunque*.

![Viewport visibile vs contenuto scorrevole completo — macOS cattura solo ciò che è sullo schermo, non ciò che è sotto la piega](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-viewport-vs-full.webp)

---

## Le tre famiglie di soluzioni

Prima delle raccomandazioni, conosci le categorie. Non sono intercambiabili.

| Famiglia | Come funziona | Ideale per | Non può |
| --- | --- | --- | --- |
| **Solo browser** (GoFullPage, funzione integrata Firefox, DevTools, Safari Web Inspector) | Chiede alla pagina il DOM/contenuto completo | Pagine web *aperte in quel browser* | Slack, PDF in Anteprima, finestre di app, lavagne Figma |
| **App di cattura a scorrimento native** (Shottr, CleanShot X, Xnapper, **ScrollShot**, screensnap*) | Scorre + cuce lo schermo reale | *Qualsiasi* area scorrevole, incluse app fuori dal browser | — (limitato solo dalla qualità dell'app) |
| **Esportazione PDF** (`Cmd + P` → Salva come PDF) | Renderizza il layout in un documento | Archivi ricercabili, stampa | Non è un'immagine; non si incolla in linea |

\* *screensnap (ScreenSnap Pro) è un'eccezione notevole — vedi la nota sotto. È uno strumento di annotazione, non di cattura a scorrimento.*

---

## Raccomandazione rapida (leggi questa se hai fretta)

- **Fai screenshot solo di pagine web** → un'estensione del browser come GoFullPage va bene ed è gratuita.
- **Devi catturare Slack, PDF, finestre di app o documenti** → ti serve un'app nativa.
- **Vuoi un unico strumento gratuito che cattura *e* consente OCR, traduzione, annotazione, offuscare informazioni sensibili e persino registrare video — senza pagare o abbonarti** → **ScrollShot per Mac**. È l'unica opzione di questa guida che esegue l'intera pipeline in modo nativo e gratuito.

![Tre strumenti a confronto: GoFullPage (solo web), CleanShot X ($29/anno) e ScrollShot (gratis, tutto-in-uno)](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-3up-comparison-cards.webp)

---

## Il confronto completo (Shottr, CleanShot X, Xnapper, screensnap, ScrollShot)

Ho testato i concorrenti più comuni su macOS 15/26. Ecco come si comportano davvero, non come dice il marketing. Per renderlo leggibile, l'ho diviso in due tabelle mirate — cosa può **catturare** ciascuno strumento e cosa può fare con il **risultato**.

### Cattura e ambito

| Strumento | Prezzo | Cattura a scorrimento | Oltre il browser? |
| --- | --- | --- | --- |
| **ScrollShot per Mac** | **Gratis** | ✅ Cucitura automatica via Apple Vision | ✅ Qualsiasi area scorrevole |
| **Shottr** | Gratis ($12 una tantum per rimuovere i promemoria) | ✅ Scorrimento manuale + cucitura | ✅ |
| **CleanShot X** | $29/anno (o $59 una tantum) | ✅ Automatica o manuale | ✅ |
| **Xnapper** | $24 una tantum | ✅ | ✅ |
| **screensnap (ScreenSnap Pro)** | $39 una tantum | ❌ **Nessuna cattura a scorrimento** | ❌ |
| **GoFullPage** | Gratis (piano a pagamento) | ✅ (solo browser) | ❌ Solo web |

### Modifica post-cattura

| Strumento | Annotazione | OCR + Traduzione | Registra/modifica video | Oscuramento automatico dati |
| --- | --- | --- | --- | --- |
| **ScrollShot per Mac** | ✅ 19+ strumenti | ✅ 30+ lingue | ✅ MP4/GIF + ritaglia | ✅ Email, telefoni, chiavi API, volti |
| **Shottr** | ✅ Di base | ⚠️ Solo OCR, niente traduzione | ❌ | ❌ |
| **CleanShot X** | ✅ Potente | ❌ | ✅ (separato) | ⚠️ Solo offuscatura manuale |
| **Xnapper** | ✅ + abbellisci | ❌ | ❌ | ⚠️ Offuscatura automatica privacy |
| **screensnap (ScreenSnap Pro)** | ✅ 15 strumenti + sfondi | ❌ | ✅ GIF | ⚠️ Offuscatura manuale |
| **GoFullPage** | ⚠️ Ritaglio di base | ❌ | ❌ | ❌ |

**La verità su screensnap.** Il blog stesso di screensnap ("8 Metodi Classificati per Velocità") è un elenco classificato genuinamente utile — ma nota cosa raccomanda per la cattura vera: GoFullPage e Shottr. ScreenSnap Pro in sé *non può fare uno screenshot a scorrimento*. È pensato per il *passo successivo* (abbellire + annotare + condividere una cattura già fatta altrove). Quindi, se il tuo problema è "ho bisogno dello screenshot lungo in primo luogo", screensnap non è una soluzione di cattura; è post-cattura. ScrollShot, al contrario, fa sia la cattura *sia* il passo di annotare/offuscare/condividere nella stessa app gratuita.

---

## Come funziona davvero "scorri e cuci" (e perché si rompe)

Quando ScrollShot (o Shottr, o CleanShot) fa uno screenshot lungo, il processo di scorrere e cucire è:

1. Cattura la regione visibile.
2. Simula uno scorrimento (o aspetta che scorra tu).
3. Cattura la regione successiva.
4. **Abbina i pixel sovrapposti** tra i due fotogrammi per trovare la cucitura.
5. Cuce il tutto e ripete finché non ti fermi.

La fase di abbinamento è dove gli strumenti vivono o muoiono in qualsiasi flusso di scorri-e-cuci. Il [motore di cucitura](/it/blog/ios-stitching-engine-v2/) di ScrollShot usa il framework Vision di Apple per abbinare i fotogrammi, ed è per questo che gestisce meglio velocità di scorrimento variabili e piccoli cambiamenti di layout rispetto agli approcci ingenui di differenza pixel. Tre cose rompono comunque qualsiasi cucitore:

- **Intestazioni/piè di pagina fissi** che non si muovono mentre il contenuto scorre → barre duplicate. (Chiudi widget di chat e banner dei cookie prima.)
- **Contenuto caricato su richiesta** che appare solo dopo aver scrollato → spazi vuoti. (Scorri una volta, poi cattura.)
- **Ipotesi di larghezza fissa** → se ridimensioni la finestra, la larghezza di output cambia. Decidi la larghezza prima di catturare.

![Come funziona scorri e cuci: lo strumento abbina la striscia sovrapposta per trovare dove il fotogramma 2 si attacca al fotogramma 1](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-stitch-overlap.webp)

---

## Passo dopo passo: fai uno screenshot lungo con ScrollShot per Mac

Questo è il flusso che uso ora per tutto.

**1. Installa (30 secondi).**  
Scarica da [`mac.scrollshot.work/ScrollShot.dmg`](https://mac.scrollshot.work/ScrollShot.dmg), apri il DMG, trascina in Applicazioni. Nessun account, nessuna chiave di licenza.

![Installa ScrollShot: apri il DMG e trascina l'app in Applicazioni](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-dmg-install.webp)

**2. Avvia la cattura a scorrimento.**  
Premi la scorciatoia di cattura a scorrimento (o selezionala dalla barra dei menu). Trascina un rettangolo attorno all'area scorrevole — una pagina web, un pannello Slack, una colonna PDF, quel che è.

**3. Scorri.**  
Scorri con il trackpad o la rotellina del mouse. ScrollShot cuce automaticamente in tempo reale; vedi l'immagine alta crescere nell'anteprima. Fermati quando hai catturato tutto.

![Anteprima live: ScrollShot cuce automaticamente mentre scorri e vedi l'immagine alta crescere](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-live-preview.webp)

**4. Un'unica immagine, già modificabile.**  
Quando finisci, non finisci in un editor separato. La stessa finestra consente di: aggiungere frecce/numeri, **fare OCR al testo e tradurlo in oltre 30 lingue in linea**, offuscare o oscurare automaticamente email/telefoni/chiavi API/volti, poi esportare come PNG o salvare su uno sfondo a gradiente abbellito.

![Annota lo screenshot lungo finito: freccia, numero, offusca e traduci — senza uscire dall'app](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-annotation-toolbar.webp)

**5. Condividi.**  
Copia negli appunti, carica sul tuo S3/Cloud o esporta. Fatto — senza uscire dall'app.

Quest'ultimo punto è il vero motivo per cui ho cambiato. Con Shottr catturavo, poi aprivo un'altra app per annotare. Con CleanShot X pagavo $29/anno per il privilegio. Dopo la cattura scorri-e-cuci, ScrollShot fa cattura → modifica → traduzione → oscuramento → esportazione in un unico passaggio, gratis.

---

## Quando *non* dovresti usare un'app di cattura a scorrimento

Sii onesto sul lavoro:

- **Ti serve testo ricercabile e copiabile** (archivio legale, PDF di ricerca) → `Cmd + P` → Salva come PDF. Un PNG di 12.000 pixel non è ricercabile.
- **Fai screenshot solo di un browser** e non ne esci mai → GoFullPage o il "Scatta screenshot → Salva pagina intera" integrato di Firefox è più leggero.
- **Ti serve un layout di stampa pixel perfetto** → di nuovo il PDF.

Per tutto il resto — thread di chat, documenti, pannelli di impostazioni, pagine web lunghe che annoterai — un'app di scorrimento nativa vince.

---

## Problemi comuni (e la soluzione)

- **Intestazione duplicata nell'output** → elemento fisso. Rimuovilo o usa uno strumento con buona gestione dei fissi prima di catturare.
- **Sezione centrale mancante** → scorrimento infinito / caricamento su richiesta. Scorri fino in fondo una volta, poi cattura dall'alto.
- **Testo sfocato** → catturato a basso DPI. Ingrandisci la finestra (o fai zoom) prima di catturare.
- **File enorme** → un PNG alto 10.000px può essere di diversi MB. Comprimi prima di condividere, o dividilo in sezioni per leggibilità.

---

## FAQ

**Posso fare uno screenshot a scorrimento con l'app Screenshot integrata su Mac?**  
No. `Cmd + Shift + 4` e l'app Screenshot catturano solo lo schermo visibile. Ti serve una funzione del browser, un'esportazione PDF o un'app di terze parti come ScrollShot, Shottr o CleanShot X.

**Qual è il modo più veloce e gratuito per fare uno screenshot lungo su Mac?**  
Solo per le pagine web: GoFullPage (meno di 30 secondi). Per tutto ciò che è fuori dal browser (Slack, PDF, app): ScrollShot per Mac o Shottr — entrambi gratuiti, entrambi funzionano su qualsiasi area scorrevole.

**Esiste uno strumento di screenshot a scorrimento gratuito che traduca e oscuri anche i dati?**  
Sì — [ScrollShot per Mac](/it/blog/perche-scegliere-scrollshot-screenshot-lunghi-ios/). È gratuito e unisce in modo unico la cattura a scorrimento con OCR, traduzione in oltre 30 lingue, oltre 19 strumenti di annotazione e oscuramento automatico di dati personali/volti in un'unica app.

**Gli screenshot a scorrimento funzionano con PDF e documenti?**  
Sì, se usi un'app di cattura a scorrimento nativa (ScrollShot, Shottr, CleanShot X) sul PDF aperto in Anteprima o in un lettore. Il "Salva come PDF" integrato produce un documento, non un'immagine.

**Perché il mio screenshot a scorrimento ha intestazioni duplicate?**  
La pagina ha un elemento fisso (bollicina di chat, barra di navigazione, banner dei cookie) che resta fermo mentre il contenuto scorre. Chiudilo o nascondilo prima di catturare.

**In che formato salvare gli screenshot a scorrimento?**  
PNG per qualità e trasparenza; JPG se conta la dimensione del file e non ti serve trasparenza; PDF solo se ti serve testo ricercabile.
