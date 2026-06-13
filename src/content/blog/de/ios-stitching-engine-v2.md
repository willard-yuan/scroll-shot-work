---
title: "Wie schwer kann es sein, zwei Screenshots zusammenzufügen? Eine iOS-Stitching-Engine, die mich immer wieder von vorne anfangen ließ"
description: "Ein tiefer Blick in die Stitching-Engine von ScrollShot: 30 Frames aus 1.800 auswählen, Reverse Template Matching, Pyramid-NCC-Suche, dreistufige Fallback-Strategie und Engineering-Tricks, die in keinem Lehrbuch stehen."
date: "2026-06-10"
category: "Technik"
author: "ScrollShot Team"
tags: ["iOS langer Screenshot", "Screenshot-Stitching-Algorithmus", "Template Matching", "NCC", "ScrollShot Engine", "Bildschirmaufnahme Stitching"]
readingTime: "15 Min. Lesezeit"
featured: true
cover: "/scrollshot_video_to_long_screenshot_workflow_de.webp"
coverAlt: "ScrollShot Stitching-Engine Sechs-Schritte-Pipeline: von der Bildschirmaufnahme zum langen Bild"
translationKey: "ios-stitching-engine-v2"
---

# Wie schwer kann es sein, zwei Screenshots zusammenzufügen? Eine iOS-Stitching-Engine, die mich immer wieder von vorne anfangen ließ

Ich habe mehrere Monate lang nur eine Sache gemacht: Das Stitching von langen Screenshots auf dem Smartphone „genau richtig" auszurichten.

Klingt einfach, oder? Zwei benachbarte Screenshots, Überlappung finden, schneiden, zusammenkleben. Aber wenn man wirklich anfängt zu programmieren, merkt man schnell: „Genau richtig" ist ein bodenloses Engineering-Loch.

Dieser Artikel zerlegt die Stitching-Engine von ScrollShot. Kein Produkt-Pitch, keine leeren Versprechen — nur Algorithmen und die Engineering-Details, die mich das Design immer wieder überdenken ließen. Wenn du dich für die Gesamtpositionierung und Anwendungsfälle von ScrollShot interessierst, lies zuerst die <a href="/de/blog/warum-scrollshot-ios-lange-screenshots/">Produktübersicht: Warum ScrollShot für iOS lange Screenshots</a>.

---

## Warum nicht einfach die Panorama-Funktion von OpenCV?

Intuitiv ist Bild-Stitching ein altes Problem. Die `Stitcher`-Klasse von OpenCV erstellt mit wenigen Zeilen Code Panoramafotos.

Aber lange Screenshots und Panoramafotos sind zwei völlig verschiedene Dinge. Ein Panorama wird durch horizontale Drehung mit Perspektivtransformation aufgenommen, die Überlappung ist meist klein. Ein langer Screenshot ist **vertikales Scrollen in eine Richtung** — aufeinanderfolgende Frames teilen 5 %–80 % identischen Inhalt, und — das ist entscheidend — **schon 2 Pixel Versatz sind sofort sichtbar**, weil du möglicherweise Text zusammenfügst.

Wer OpenCV dafür ausprobiert hat, kennt die Erfahrung: Feature Matching versagt auf Chat-Seiten komplett. Manche Nutzer haben Hintergrundbilder in ihrer Messaging-App, sodass der Großteil des Frames gleich aussieht. Statt dass das Ende des einen Frames mit dem Anfang des nächsten überlappt, liefert SIFT lauter „ähnliche, aber nicht gleiche" Matching-Paare.

Also wählte ich einen anderen Weg: Ich schrieb die erste Zeile einer Template-Matching-Engine von Grund auf, speziell optimiert für das Szenario „vertikal scrollende Screenshots".

Die gesamte Pipeline sieht so aus:

![ScrollShot Stitching-Engine Pipeline](/scrollshot_video_to_long_screenshot_workflow_de.webp)

Die Engine unterstützt auch Apple Vision Framework für das Matching (schnell, aber grob). Der Schwerpunkt dieses Artikels liegt aber auf der selbstentwickelten Template-Matching-Methode — dort passiert die eigentliche Arbeit. Wie dieser Algorithmus schließlich in das <a href="/de/blog/warum-scrollshot-ios-lange-screenshots/">Einmal aufnehmen, langen Screenshot erhalten</a>-Erlebnis übersetzt wird, erfährst du in der Produktvorstellung.

---

## Herausforderung 1: 30 brauchbare Frames aus 1.800 auswählen

30 Sekunden Bildschirmaufnahme bei 60 fps = 1.800 Frames. Alle verarbeiten? Der Arbeitsspeicher explodiert zuerst, die Zeit gleich danach.

Der intuitivste Ansatz ist **zeitbasierte Frame-Extraktion**: 3 Frames pro Sekunde. Aber das hat einen fatalen Fehler — die Scrollgeschwindigkeit des Nutzers ist ungleichmäßig. Beim schnellen Wischen unterscheiden sich zwei Frames um einen halben Bildschirm, das Stitching verliert zwangsläufig Inhalt. Beim langsamen Betrachten sind benachbarte Frames fast identisch — alles Verschwendung.

ScrollShot nutzt **abstandsbasierte Frame-Extraktion**: Es schaut nicht auf die Zeit, sondern darauf, „wie weit der Bildschirm gescrollt wurde". Ein Frame wird nur dann erfasst, wenn die kumulierte Verschiebung einen Schwellenwert überschreitet.

### Welcher Verschiebungsschwellenwert ist richtig?

Diese Zahl hat mich wochenlang beschäftigt. Zu klein eingestellt, löst langsames Scrollen rasende Frame-Extraktion voller Duplikate aus. Zu groß, verliert schnelles Scrollen Inhalt.

Die finale Formel:

```
displacementThreshold = dsHeight × 0,60 × presetScale
```

Dabei ist `dsHeight` die heruntergerechnete Frame-Höhe (1080p um den Faktor 3 reduziert ≈ 360p, also `dsHeight ≈ 640`), `0,60` das Basisverhältnis und `presetScale` eine wählbare Voreinstellung (aggressiv/ausgewogen/konservativ).

Im ausgewogenen Modus wird also alle **384 Pixel** (640 × 0,60) Scrollweg ein Frame erfasst — etwa die halbe Bildschirmhöhe.

Dazu kommt ein leicht übersehbarer Rauschfilter: **Eine einzelne Verschiebung muss ≥ 3 Pixel betragen, um zur Summe zu zählen.** Ohne das akkumulieren sich die Subpixel-Fehler des Template Matching langsam und verursachen „Phantom-Frame-Extraktion" selbst auf einem ruhenden Bildschirm. Ich brauchte einen ganzen Nachmittag, um diesen Bug zu finden.

### Zwei Durchläufe in der Praxis

**Durchlauf 1 — Niedrigauflösende Bewegungsanalyse.** Frames werden um den Faktor 3 herunterskaliert (1080p → 360p, eine Größenordnung schneller), und leichtgewichtiges Template Matching verfolgt die vertikale Verschiebung Frame für Frame. Hier verbergen sich einige Engineering-Details:

- **Adaptive Schrittweite**: Bei großer Verschiebung große Sprünge (`nativeFPS / 6`, etwa alle 10 Frames), bei kleiner Verschiebung zurück zu Frame-für-Frame-Scan (`nativeFPS / 30`). Wenn die Restdistanz unter 25 % des Schwellenwerts fällt, wird der kleinste Schritt erzwungen — sonst überspringt man buchstäblich einen Frame
- **Szenenwechsel-Erkennung**: SAD pro Pixel zwischen benachbarten Frames über 40,0? Wahrscheinlich hat der Nutzer die App gewechselt. Sofort einen Frame erfassen
- **Rücksprung-Erkennung**: Mit Visions optischem Fluss die Bewegungsrichtung erkennen. Fällt die kumulierte Verschiebung unter -50 px (der Nutzer scrollt zurück), ist das Ende erreicht — alle folgenden Frames verwerfen. Dieser Schwellenwert darf aber nicht zu eng sein: Ich hatte zuerst -10 eingestellt, und leichtes Fingerzittern löste die Erkennung aus, wodurch die halbe Aufnahme fehlte

**Durchlauf 1,5 — Schärfe-Verfeinerung.** Für jeden Kandidaten-Frame im ±2-Frame-Fenster drumherum den schärfsten Frame suchen.

Wie quantifiziert man Schärfe? Ich verwende **Laplacian-Energie** — Faltung des Graustufenbildes mit einem 3×3-Laplacian-Kernel, dann den Mittelwert der quadrierten Antwort:

```
kernel = [-1, -1, -1,
          -1,  8, -1,
          -1, -1, -1]

sharpness = mean((convolve(gray, kernel) - 128)²)
```

Der Offset von 128 kommt vom Bias der Faltungsausgabe (vImage-Anforderung). Quadrieren und Mitteln ergibt die Hochfrequenzenergie. Höherer Wert = schärferer Frame.

Warum Laplacian-Energie statt Laplacian-Varianz? Für Screenshots liefern beide Methoden fast identische Ergebnisse, aber erstere ist rechnerisch einfacher — vImages `vDSP_vsq` + `vDSP_meanv`, zwei Zeilen.

Die Auflösungsgrenze liegt bei 720×1280, was ausreicht. Der Grund ist praktisch: Der schärfste Frame ist der Moment, in dem der Nutzer den Finger hebt; Frames während des Wischens haben oft Bewegungsunschärfe. Laplacian-Energie reagiert darauf sehr empfindlich — der Unterschied beträgt meist das 2–3-Fache.

---

## Der Kern-Algorithmus: Template-Matching-Engine

Dies ist der größte Teil der Engine nach Code-Umfang (über 3.000 Zeilen in einer Datei) und der Teil, der mich am längsten mit Bugs gequält hat.

### Reverse Matching: Warum vom neuen Frame im alten suchen?

Meine erste Version nutzte „Forward Matching" — Template vom unteren Rand des alten Frames, Suche im neuen Frame. Das scheiterte auf WhatsApp-Chatseiten: Am unteren Rand des alten Frames stand ein „OK", im neuen Frame waren drei „OK" zu sehen. Das Matching griff das oberste, und der Offset war um 200 Pixel falsch.

Dann drehte ich den Ansatz um: **Reverse Matching**. Template vom **oberen** Rand des neuen Frames (img2), Suche im **unteren** Bereich des alten Frames (img1).

Warum ist Reverse besser? Der obere Bereich des neuen Frames ist „frisch hereingescrollter Inhalt" — dieser existiert garantiert im alten Frame, und **genau einmal** (im mittleren bis unteren Teil). Umgekehrt ist der „verschwindende alte Inhalt" am unteren Rand des alten Frames im neuen Frame vielleicht nur noch minimal sichtbar oder schon ganz verschwunden.

![Reverse-Matching-Diagramm](/scrollshot_video_to_long_screenshot_algo_de.webp)

Die Suche überspringt automatisch die Statusleiste (oberste ~250 px) und den unteren Tab-Bar-Bereich (~350 px). Aber hier lauert eine weitere Falle — manche Apps haben unterschiedlich hohe Navigationsleisten, manche Seiten haben eine Tastatur, andere schwebende Buttons.

Also ergänzte ich eine **dynamische Footer-Erkennung**. So funktioniert sie: Von unten nach oben zeilenweise scannen, die mittleren 80 % der Pixel jeder Zeile nehmen (je 10 % Rand abschneiden, um schwebende Buttons zu meiden), alle 16 Pixel sampling und die MAD (mittlere absolute Differenz) zwischen derselben Zeile in beiden Frames berechnen. MAD ≤ 3,2 bedeutet, die Zeile ist in beiden Frames nahezu identisch — wahrscheinlich ein statisches UI-Element. Nach 4+ aufeinanderfolgenden nicht-statischen Zeilen stoppen (`maxGapTolerance = 4`). Weniger als 24 statische Zeilen insgesamt → kein fester Footer, Rückgabe 0.

Der Schwellenwert 3,2 ist empirisch. Statische Bereiche mit weißem Hintergrund haben MAD 0–1,5. JPEG-Kompressionsrauschen schwankt zwischen 2–4. Zeilen mit echten Inhaltsänderungen liegen bei mindestens 8. 3,2 sitzt genau in der Lücke — toleriert Kompressionsrauschen, lehnt aber Inhaltsänderungen ab.

### 6 Templates stimmen ab gegen „sie sehen alle gleich aus"

Ein einzelner Template-Block ist leicht fehlzumatchen. Stell dir eine E-Commerce-Produktliste vor — jede Produktkarte hat fast das gleiche Layout, ein Template matcht das vorherige oder nächste Produkt.

Die Engine extrahiert **6 Template-Blöcke** gleichzeitig (je 100 px hoch, im oberen Bereich des neuen Frames verteilt), sucht jeweils unabhängig die beste Position im alten Frame und erhält 6 Offset-Werte. Dann werden diese 6 Offsets **geclustert** (Toleranz: 5 px) und der Median des größten Clusters genommen.

Wenn 5 von 6 Templates auf Offset ≈ 320 zeigen und einer auf 800, ist 800 fast sicher ein Fehl-Match — verwerfen.

Dazu gibt es eine Early-Exit-Optimierung: Wenn die ersten 3 Templates bereits übereinstimmen (Toleranz: 4 px) und der Offset nicht nahe 0 ist (Ausschluss: „der Nutzer hat gar nicht gescrollt"), die restlichen 3 überspringen.

Ein Detail, das mich lange beschäftigt hat: Welche Toleranz? Anfangs 2 px, aber durch NCCs Quantisierungsfehler (dazu später mehr) unterschieden sich Offsets verschiedener Templates oft um 2–3 px, sodass der Early Exit fast nie auslöste. Nach Erhöhung auf 4 px löste er in Tests bei etwa 60 % der Frame-Paare aus, ohne erkennbaren Genauigkeitsverlust.

### Pyramid-NCC: Von grob nach fein suchen

Jedes Template-Matching nutzt **NCC (Normalized Cross-Correlation)** zur Ähnlichkeitsmessung. Die NCC-Formel:

$$\text{NCC}(T, I) = \frac{\sum(T_i - \bar{T})(I_i - \bar{I})}{\sqrt{\sum(T_i - \bar{T})^2 \cdot \sum(I_i - \bar{I})^2}}$$

NCC ist unempfindlich gegenüber Helligkeitsänderungen (Aufnahme bei Tageslicht und dieselbe Seite im Dark Mode matchen trotzdem). Wertebereich [-1, 1], wobei 1 = perfekte Übereinstimmung. Intuitiv: NCC vergleicht nicht absolute Pixelwerte, sondern ob das „Muster von Hell und Dunkel" gleich ist.

Aber pixelgenaues Durchsuchen des gesamten alten Frames ist zu langsam. Die Engine nutzt eine **dreistufige Pyramidensuche**:

| Stufe | Schritt | Suchfenster | Kandidaten | Zweck |
|-------|---------|-------------|-----------|-------|
| Level 1 (Pre) | 12 px | Vollbereich | ~125 | Grobe Positionierung |
| Level 2 (Coarse) | 4 px | ±32 px | ~16 | Zeilengenau |
| Level 3 (Fine) | 1 px | ±4 px | 9 | Pixelgenaue Verfeinerung |

Eine erwähnenswerte Zahl: Level 1 mit Schritt 12 sucht nur 1/12 der Kandidatenpositionen — etwa **12-fache Beschleunigung** pro Template gegenüber pixelweiser Suche. Die Gesamtberechnung über alle drei Stufen beträgt etwa 1/8 einer Vollbereichssuche.

Bei mehr als 64 Kandidaten (typisch bei Level 1) wird automatisch GCD-Parallelberechnung aktiviert (`DispatchQueue.concurrentPerform`), die Suche auf mehrere CPU-Kerne verteilt. Hier trat ein Problem auf: Zunächst nutzte ich `NSLock` für eine gemeinsame `bestScore`-Variable, aber Lock-Contention auf 6 Kernen verlangsamte alles. Wechsel zu thread-lokalen Bestwerten mit abschließendem Merge reduzierte die Lock-Contention von O(n) auf O(1).

### Suchfenster: Lass die Geschichte für dich arbeiten

Jedes Mal den gesamten verfügbaren Bereich des alten Frames zu durchsuchen ist langsam und fehleranfällig (oben und unten der Seite können ähnliche Layouts haben).

Die Engine nutzt zwei Arten von „Vorwissen":

- **Zeitliches Vorwissen**: War der Offset des letzten Frame-Paars 300 px, ist es dieses Mal wahrscheinlich ähnlich — die Scrollgeschwindigkeit ändert sich nicht sprunghaft. Suchfenster auf 300 ± 120 px verkleinern
- **Vision-Vorwissen**: Für das erste Frame-Paar ohne Historie liefert Apples Vision-API eine grobe Schätzung. Fenster auf Schätzung ± 180 px verkleinern

Finden sich im engen Fenster nicht mindestens 3 konsistente Matches (Vorwissen war falsch), automatisch auf Vollbereichssuche zurückfallen.

Die „mindestens 3 konsistent"-Bedingung war auch hart erkämpft. Anfangs „mindestens 1", aber wenn die Vision-Schätzung stark danebenlag (gelegentlich 500 px daneben), passierte ein Fehl-Match im engen Fenster zufällig als gültig. Mit 3 muss ein Fehl-Match gleichzeitig 3 unabhängige Templates täuschen — statistisch fast unmöglich.

### Wenn normales Matching versagt: dreistufiges Fallback

Reale Szenarien sind weit härter als im Labor. Schwebende Buttons, halbtransparente Overlays, laufende Videos, blinkende Cursor — all das drückt die NCC-Werte.

Die Engine implementiert eine dreistufige Fallback-Strategie. Mit echten Daten zur Häufigkeit:

> **Stufe 1: Starkes Matching (~80 % der Frame-Paare).** Die meisten Templates haben NCC ≥ 0,6 und zeigen auf denselben Offset. Der häufigste Fall.
>
> **Stufe 2: Weiches Matching (~12 % der Frame-Paare).** Das beste Template hat NCC nur 0,45–0,6 — vielleicht hat ein schwebendes UI-Element den Bereich teilweise verdeckt. Dann dient die SAD des gesamten Überlappungsbereichs (Summe aller Helligkeitsdifferenzen) als Sekundärprüfung. SAD pro Pixel ≤ 26,0 → akzeptiert, sonst abgelehnt.
>
> **Stufe 3: 1D-Profil-NCC (~5 % der Frame-Paare).** Das 2D-Bild wird zu einer Zeilenmittelwertkurve „plattgedrückt" — ein 1D-Array. Kreuzkorrelation der beiden 1D-Kurven. Etwa 100× schneller, aber höheres Falsch-positiv-Risiko.
>
> **Alles fehlgeschlagen (~3 % der Frame-Paare)?** Dieser Frame ist wahrscheinlich ein Szenenwechsel oder hat null Überlappung. Ohne Stitching anhängen.

Stufe 2s SAD-Prüfung ist nuanciert. Der Baseline-Schwellenwert ist **25,0 pro Pixel**, aber bei Überlappung über 80 % wird er adaptiv verschärft:

```
if overlapRatio > 0,8:
    scale = max(minScale, 1,0 - (overlapRatio - 0,8) × 4,0)
    threshold = 25,0 × scale
```

Warum verschärfen? Je größer die Überlappung, desto mehr statistische Samples hat SAD, Zufallsrauschen mittelt sich heraus — ein Fehl-Match kann ebenfalls niedrige SAD-Werte liefern. Ohne Verschärfung steigen bei hoher Überlappung die Falsch-Positiven.

Egal welcher Pfad, am Ende gibt es immer eine **Offset-Feinjustierung**: SAD pixelweise im Bereich ±6 px um den Kandidaten-Offset berechnen und das Minimum nehmen.

Warum braucht der NCC-Offset noch Feinjustierung? Das hat mich drei Tage gekostet. NCC ist nahe dem Optimum sehr „flach" — 2 px Offset-Unterschied ändern NCC nur um 0,003. Aber SAD reagiert extrem empfindlich auf ±1 px Verschiebung — 1 px Unterschied kann SAD um 3–5 Einheiten ändern. Beide ergänzen sich: NCC für Grobpositionierung, SAD für pixelgenaue Kalibrierung. Bei Text-Stitching sind 2 px der Unterschied zwischen „eine Textzeile in der Mitte durchgeschnitten" und „perfekt ausgerichtet".

### Nahtlinie: Schneide keinen Text durch

Offset gefunden, beide Frames haben einen Überlappungsbereich. Wo „schneiden"?

Intuitiv: in der Mitte schneiden. Aber wenn genau dort eine große Textzeile steht, passen Ober- und Unterhälfte nicht zusammen — das Auge erkennt es sofort.

Die Engine berechnet die Pixel-Differenz **jeder Zeile** im Überlappungsbereich und findet mit einem gleitenden Fenster die Position mit der geringsten Gesamtdifferenz. Die Fensterhöhe ist adaptiv — `min(overlapH, max(100, adaptiveCutHeight))`, wobei `adaptiveCutHeight` dynamisch auf das Verhältnis von Überlappung zu Offset reagiert. Diese Position ist, wo sich die Inhalte beider Frames am ähnlichsten sind — die Nahtlinie sieht hier am natürlichsten aus.

---

## Leistungsdaten

Getestet mit einer typischen 30-Sekunden-WhatsApp-Chat-Aufnahme (iPhone 15 Pro, 1080×2400, 60 fps). Die wichtigsten Kennzahlen:

| Kennzahl | Wert |
|----------|------|
| Gesamt-Frames | 1.800 |
| Durchlauf 1 Analysezeit | 3,2 s |
| Extrahierte Keyframes | 26 Frames |
| Durchlauf 1,5 Schärfekorrektur | 0,8 s |
| Template-Matching Gesamtzeit | 4,1 s (25 Frame-Paare) |
| Ø Matching pro Paar | 164 ms |
| Early-Exit-Rate | 58 % (15/25 Paare) |
| Starkes Matching | 84 % (21/25 Paare) |
| Weiches Matching | 3 Paare |
| 1D-Profil-Fallback | 1 Paar |
| Komplett fehlgeschlagen | 0 Paare |
| Finale Bildgröße | 1.170 × 18.600 |
| End-to-End-Zeit | ~8,5 s |

Die Pyramidensuche beschleunigt deutlich: Level 1 mit Schritt 12 überspringt 92 % der Kandidaten, Level 2 berechnet nur ~16 Punkte im ±32-px-Fenster, Level 3 verfeinert nur ±4 px. Die effektive Berechnung über alle drei Stufen ist etwa **1/8** einer Vollbereichssuche.

---

## Engineering-Details, die man nicht ignorieren darf

### Ein 20.000-Pixel-Bild kann nicht komplett geladen werden

Ein aus 30 Frames gestitchtes Bild kann 1.170 × 24.000 Pixel groß sein. Vollauflösendes RGBA im Speicher: **112 MB** (1.170 × 24.000 × 4 Bytes) — zu viel für ein iPhone.

`StreamingStitchingPlanner` ist als Streaming-Pipeline konzipiert: Während des Matchings sind nur „aktueller + vorheriger Frame" im Speicher. Stichergebnisse werden als `Piece`-Objekte gespeichert (Quellbild-Index + Ausschnitt + Zielposition). Das finale Rendering dekodiert und zeichnet kachelweise.

### Scrollleisten-Entfernung

Das fertige lange Bild hat fast immer eine Scrollleiste am rechten Rand. Die Engine nutzt eine **Gradientenprojektion** zur automatischen Entfernung:

Einen 3 % breiten Streifen am rechten Rand extrahieren → horizontale Gradienten aufsummieren → die linken und rechten Kanten der Scrollleiste bilden zwei **Gradienten-Peaks** (3–20 px Abstand) → zeilenweise die tatsächliche Position bestätigen → mit den benachbarten Pixeln links überschreiben. Horizontale Scrollleisten am unteren Rand werden analog behandelt.

### Fallback-UI, wenn der Algorithmus versagt

Selbst der beste Algorithmus stolpert manchmal. ScrollShot bietet **interaktive Feinjustierung** an jeder Nahtlinie — Nutzer können per Drag & Drop die Stitching-Position anpassen, mit Echtzeitvorschau. Das `FineTuneGeometryEngine` garantiert, dass geometrische Constraints immer gültig bleiben. Die Vorschau rendert in niedriger Auflösung für Geschwindigkeit; der Export wechselt automatisch zur vollen Auflösung. Diese Kontrollierbarkeit ist auch eine der Kerninteraktionen des <a href="/de/blog/warum-scrollshot-ios-lange-screenshots/">Manual-Stitch-Modus</a>.

---

## Ein letztes Wort

Die größte Erkenntnis aus diesem Projekt: **Der Stitching-Algorithmus an sich ist nicht schwer. Schwer ist, ihn auf all den „unvernünftigen" realen Seiten funktionieren zu lassen.**

WhatsApp-Chat-Hintergründe sehen alle gleich aus, Amazon-Produktlisten wiederholen sich endlos, die iOS-Einstellungen haben riesige weiße Flächen, YouTube-Video-Thumbnails bewegen sich … jeder einzelne ist ein Edge Case, den kein Lehrbuch lehrt und kein Paper beschreibt.

Ein Bug ist mir besonders im Gedächtnis geblieben: Bei der Aufnahme der iOS-Einstellungen lag der NCC-Offset jedes Mal um etwa 40 px daneben. Nach langem Debuggen fand ich heraus, dass oben auf der Seite eine große weiße Fläche war. Landet das Template auf reinem Weiß, liefert NCC an jeder weißen Position fast 1,0 — ununterscheidbar. Die Lösung: Templates mit zu niedriger Varianz automatisch überspringen — ein rein weißes Template trägt keine Information, also besser weglassen.

Noch absurder: Bei der Aufnahme der YouTube-Startseite zeigte ein Video-Thumbnail eine sich bewegende Katze. Der Thumbnail-Bereich war zwischen zwei Frames komplett verschieden, NCC fiel auf 0,3. Kein Algorithmus allein kann das retten. Es war das 6-Template-Voting, das es rettete — die anderen 5 Templates sampelten statische Bereiche, und die Abstimmung war trotzdem korrekt.

Diese Probleme löst man nicht mit eleganterer Mathematik, sondern mit einem „Erstmal so workarounds" nach dem anderen. Wenn du an etwas Ähnlichem arbeitest, hoffe ich, dieser Artikel hilft dir, ein paar dieser Stolpersteine zu umgehen.

---

## Weiterlesen

- <a href="/de/blog/warum-scrollshot-ios-lange-screenshots/">Warum ScrollShot? Die bessere Lösung für nahtlose lange Screenshots auf iOS</a> — Ein Produktblick darauf, wie ScrollShot die Pain Points von iOS langen Screenshots löst: automatisches Stitching, manuelles Stitching, Datenschutz und hochwertiger Export.
