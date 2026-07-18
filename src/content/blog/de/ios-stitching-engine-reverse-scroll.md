---
title: "Nutzer bestanden auf Rückwärts-Scrollen — und ich rettete mich mit einer einzigen Zeile vor dem Umschreiben der ganzen Engine"
description: "Wenn Nutzer auf dem iPhone einen langen Screenshot machen wollen, indem sie nach oben scrollen, war mein erster Instinkt, eine separate „Aufwärts-Engine” zu bauen. Am Ende reichte eine einzige Codezeile. Dieser Artikel zerlegt ScrollShots Reverse-Scroll-Stitching-Design, die Technik hinter einem nahtlosen iPhone long screenshot in Apps wie Messages und WhatsApp, und zeigt, wie wir die Scrollrichtung erkennen, die Frame-Reihenfolge umkehren und die bestehende Abwärts-Pipeline wiederverwenden — damit du take scrolling screenshot in iPhone problemlos hinbekommst, inklusive iPhone scrolling screenshot in Chats."
date: "2026-07-12"
category: "Technik"
author: "ScrollShot Team"
tags: ["iPhone langer Screenshot", "iPhone Scroll-Screenshot", "iOS langer Screenshot", "Screenshot-Stitching-Algorithmus", "Rückwärtsscrollen", "Scroll-Richtungserkennung", "ScrollShot Engine", "Bildschirmaufnahme Stitching"]
readingTime: "6 Min. Lesezeit"
cover: "/ios_stitching_engine_reverse_scroll_framework_de.webp"
coverAlt: "ScrollShot Reverse-Template-Matching-Diagramm für einen iPhone scrolling screenshot: Template vom oberen Rand des neuen Frames nehmen, Offset im unteren Rand des alten Frames suchen"
translationKey: "ios-stitching-engine-reverse-scroll"
---

# Nutzer bestanden auf Rückwärts-Scrollen — und ich rettete mich mit einer einzigen Zeile vor dem Umschreiben der ganzen Engine

Die meisten, die einen iPhone langer Screenshot wollen — oder irgendeinen iPhone Scroll-Screenshot innerhalb einer App —, gehen davon aus, dass der Nutzer von oben nach unten scrollt. Auch ScrollShots Stitching-Engine war ursprünglich so gebaut — ich habe die ganze Geschichte in <a href="/de/blog/ios-stitching-engine-v2/">„Wie schwer kann es sein, zwei Screenshots zusammenzufügen? Eine iOS-Stitching-Engine, die mich immer wieder von vorne anfangen ließ”</a> aufgeschrieben: aufnehmen → Frames in gleichen Abständen sampeln → pro Frame Template-Matching, um den Offset zu berechnen → beste Naht finden → zuschneiden und zusammenfügen. Diese Pipeline ist für den Fall von oben nach unten bereits solide.

Aber die echte Welt widerspricht gern. Nutzer wollen einen iPhone Scroll-Screenshot eines Chats festhalten — Messages, WhatsApp oder WeChat — oder den Teil einer Webseite sichern, zu dem sie zum Anschauen nach oben gescrollt sind, genau das iphone screenshot full page in app-Szenario, nach dem alle immer wieder fragen — und beim Aufnehmen gleitet der Finger nach oben. Der Inhalt fließt rückwärts durch die Aufnahme: Er beginnt am unteren Seitenrand, und das „Ende” ist eigentlich der frühere Inhalt. Speist man das direkt in die Engine von oben nach unten, bekommt man ein kopfstehendes Bild: Oben im Bild ist der alte Inhalt vom Ende der Aufnahme, unten der Anfang.

Dieser Artikel handelt davon, wie ScrollShot das Stitching von unten nach oben unterstützt. Es geht nicht um einen tiefen Algorithmus — sondern um einen extremen Design-Trade-off: wie wenig Code das überhaupt braucht.

Zuerst hier eine Standard-Demo für Stitching von oben nach unten — das umgekehrte Stitching, das wir besprechen, baut direkt darauf auf:

<div class="blog-demo">
	<video src="/ScrollShot_Preview_En_0509.mp4" poster="/ScrollShot_Preview_En_0509_cover.jpg" controls playsinline preload="metadata"></video>
	<p>Demo: Stitching von oben nach unten. Einmal aufnehmen, einmal scrollen, und ScrollShot sampelt automatisch Frames, gleicht die Überlappung ab und fügt einen kompletten iPhone langer Screenshot zusammen.</p>
</div>

---

## Erster Instinkt: Eine separate „Aufwärts-Engine” bauen?

Als ich dieses Anforderung das erste Mal traf, war mein Instinkt: Wir haben bereits eine Abwärts-Stitching-Engine, also bauen wir doch einfach auch eine Aufwärts-Engine?

Ich habe mich schnell selbst davon abgebracht. Der Kern der Abwärts-Engine ist Reverse-Template-Matching: Template vom oberen Rand des neuen Frames (img2) nehmen und im unteren Rand des alten Frames (img1) nach dem Offset suchen. Dreht man das auf „aufwärts”, muss fast jede Koordinate invertiert werden — woher das Template kommt, in welche Richtung die Suche scannt, wie positive/negative Offsets definiert sind, wie der überlappende Nahtbereich berechnet wird … Eine 3.000-Zeilen-Engine hieße, ein paralleles Geschwister aufzuziehen, jedes mit eigenen Bugs und eigener Wartung. Schlimmer noch: Jeder Fix an der Abwärts-Engine müsste in der Aufwärts-Engine gespiegelt werden, sonst driften beide still auseinander.

## Der Durchbruch: Umkehren, dann wiederverwenden

Was mich tatsächlich stoppte, war eine schlichte Beobachtung: Die Stitching-Engine ist es egal, wie der Inhalt „fließt” — sie kümmert sich nur darum, welcher von zwei benachbarten Frames oben und welcher unten liegt. Solange die Frame-Sequenz nach der wahren Timeline des Inhalts geordnet ist, funktioniert derselbe Algorithmus nahtlos. Footage von unten nach oben ist einfach „in falscher Reihenfolge”.

Also ist ScrollShots Vorgehen: Zuerst die Scrollrichtung erkennen; ist sie aufwärts, die gesamte Frame-Sequenz umkehren und dann in die bestehende Abwärts-Pipeline einspeisen.

```
Aufnahme-Frame-Sampling (Aufwärts-Scrollen, Inhalt fließt rückwärts):
  [F1 Seitenende] → [F2] → [F3] → … → [Fn Seitenanfang]
                                 │
             ScrollDirectionDetector entscheidet: aufwärts
                                 │
              reversedForStitching() kehrt Frame-Reihenfolge um
                                 ▼
  [Fn Seitenanfang] → … → [F3] → [F2] → [F1 Seitenende]
                                 │
              in dieselbe Abwärts-Stitching-Engine (null Änderungen)
                                 ▼
                   korrektes langes Bild (oben → unten)
```

Das Diagramm unten zeichnet die ganze „Umkehren + Wiederverwenden”-Kette — Frame-Sampling, Richtungserkennung, Frame-Reihenfolge-Umkehrung, Wiederverwendung der Abwärts-Engine, bis zum korrekten langen Bild:

![Diagramm: Algorithmus für Stitching von unten nach oben](/ios_stitching_engine_reverse_scroll_framework_de.webp)

Der Kern-Code ist nur eine einzige Zeile:

```swift
let normalizedBatch = reverseFrames ? batch.reversedForStitching() : batch
```

`reversedForStitching()` kehrt die extrahierten Frame-Referenzen um und nummeriert sie neu; alles andere bleibt unangetastet. Nach der Umkehrung fließt der „rückwärts fließende” Inhalt wieder „vorwärts”, und das Template-Matching, NCC und die Nahtlogik flussabwärts brauchen keine einzige Zeile geändert zu werden. Null neuer Stitching-Code.

> ⚠️ Falle: Warum „Frame-Reihenfolge umkehren” und nicht „ein `isReversed`-Flag innerhalb der Engine setzen”? Weil Letzteres jedes Koordinatensystem in zwei Logik-Kopien — „vorwärts / rückwärts” — spaltet und die Bug-Oberfläche verdoppelt. Indem wir die Transformation vor dem Einspeisen der Daten verschieben, steht die Engine immer nur einer einzigen Welt gegenüber.

## Richtungserkennung: Der einzige neue Code — und er ist fast umsonst

Weil wir umkehren, ist die Vorbedingung, zu erkennen, dass der Nutzer nach oben gescrollt hat. Ist dieser Schritt schwer, ist die ganze Ersparnis oben umsonst. ScrollShots Ansatz ist leicht und clever genug, um fast „umsonst” zu sein — wir verwenden die bestehende Template-Matching-Engine wieder, tauschen nur die Parameter und lassen sie zweimal laufen.

`ScrollDirectionDetector` sampelt einheitlich etwa 7 Paare benachbarter Frames aus der Mitte der Aufnahme (vermeidet den Aufnahme-Countdown am Anfang und den Stopp-Button am Ende), und für jedes Paar lässt er denselben Matcher zweimal laufen:

```swift
let down = directionalScore(previous: prev, current: cur)  // bedeutet prev→cur „nach unten scrollen”?
let up   = directionalScore(previous: cur, current: prev)  // bedeutet cur→prev „nach unten scrollen”?
```

Der Schlüssel ist die Zeile `guard outcome.offset > 0` innerhalb von `directionalScore`. Das Reverse-Matching dieser Engine liefert nur dann einen positiven Offset, wenn „das Template vom oberen Rand des neuen Frames tiefer im alten Frame landet”. Also:

- Ist das echte Scrollen abwärts, trifft der Vorwärts-Aufruf `down` (offset > 0, gültig), während der Rückwärts-Aufruf `up` keinen älteren Inhalt tiefer im oberen Bereich des neuen Frames findet, also offset ≤ 0, als ungültig markiert, Punktzahl 0;
- Ist das echte Scrollen aufwärts, ist es umgekehrt: `down` ist ungültig, `up` ist gültig.

Das Kriterium für die Richtung ist eigentlich „**welcher Aufruf gültig ist**”, nicht dass die beiden Punktzahlen symmetrisch sind. In meinem ersten Entwurf schrieb ich leichtfertig „vollkommen symmetrisch”, bis ein Kollege drauf zeigte und fragte „wie können gültig und ungültig symmetrisch sein?” — das ist das Missverständnis, das ich in diesem Artikel am meisten richtigstellen will.

Nachdem man pro Paar die `down` / `up`-Punktzahl hat, funktioniert die Paar-bezogene Bewertung selbst so:

```
score = probability×0,55 + nccBoost×0,20 + overlapRatio×0,15 + consensusBoost×0,10
score ×= sadPenalty          // je unschärfer die Überlappung, desto stärker wird die Punktzahl abgewertet
gültige Punktzahl muss ≥ 0,26 sein
```

Dann die Abstimmung: Innerhalb eines Paars, wenn `up ≥ down × 1,25` (oder ihn absolut um 0,08 übertrifft), eine Stimme aufwärts; sonst eine Stimme abwärts. Endgültige Entscheidung:

- `upwardVotes ≥ downwardVotes + 2`, und
- `upwardScore ≥ downwardScore × 1,25`

erst dann wird es als Aufwärts-Scrollen behandelt. Das Ganze läuft auf auf 320 px begrenzten Niedrigauflösungs-Thumbnails in einem Hintergrund-Thread, mit fast keinem spürbaren Einfluss auf die Gesamtzeit.

## Bei Zweifel: An den Nutzer abgeben

Die Erkennung ist nicht 100 % zuverlässig. Eine fast statische Aufnahme, die nur zwei, drei Pixel bewegt hat, hat ein sehr schwaches Richtungssignal; blind umzukehren ist schlimmer als nicht umzukehren. Also gibt es ein Gate: `shouldAskForReverseConfirmation` wird nur ausgelöst, wenn confidence ≥ 0,72 und gültige Samples ≥ 3 Paare sind, und poppt eine leichtgewichtige Bestätigung: „Wir haben erkannt, dass du nach oben scrollend aufgenommen hast — das Stitching umkehren?” Tippt der Nutzer auf umkehren, `reverseFrames: true`; ist er unsicher, wird in der ursprünglichen Reihenfolge gestitcht. Die Engine erzeugt nie still ein falsches Bild, nur weil sie die Richtung falsch geraten hat.

## Die zwei Modi nebeneinander

| | Oben nach unten | Unten nach oben |
|---|---|---|
| Aufnahme-Geste | Finger gleitet nach unten | Finger gleitet nach oben |
| Frame-Sampling-Reihenfolge | natürliche Timeline | natürliche Timeline (Inhalt fließt rückwärts) |
| Richtungserkennung | nicht nötig | 7 Paare aus Aufnahmemitte sampeln, Matcher läuft zweimal |
| Stitching-Engine | original | original (nach Frame-Reihenfolge-Umkehr wiederverwendet) |
| Neuer Code | — | nur Richtungserkennung + Ein-Zeilen-Umkehr |
| Fallback | — | Bestätigung abfragen, wenn confidence niedrig ist |

## Zusammenfassung

Rückblickend hat das Stitching von unten nach oben in ScrollShot fast keinen „eigenen Code” — es schmarotzt vollständig an der Abwärts-Engine. Die Idee „erst die Reihenfolge normalisieren, dann dieselbe Engine wiederverwenden” wurde später unser Standard-Startmuster beim Hinzufügen neuer Stitching-Modi: Beim nächsten Mal machen wir horizontales oder Zick-Zack-Stitching, werden wir höchstwahrscheinlich zuerst herausfinden, wie wir das Problem zurück in „eindimensional abwärts” verdrehen, statt von vorne anzufangen.

---

## FAQ: Einen Scroll-Screenshot in iPhone-Apps machen

**Kann ScrollShot take scrolling screenshot in iPhone Apps wie Messages und WhatsApp?**
Ja. Ob du einen iPhone langer Screenshot einer Webseite willst oder einen iPhone Scroll-Screenshot von Messages- und WhatsApp-Threads, ScrollShot nimmt deinen Bildschirm auf und fügt die Frames automatisch zusammen. Weil es per Bildschirmaufnahme erfasst statt über einen systemeigenen „volle Seite”-Knopf, funktioniert es in jeder App — genau der iphone screenshot full page in app-Fall, nach dem alle immer wieder fragen.

**Was, wenn ich beim Aufnehmen eines Chats nach oben scrolle?**
Das ist der Kernpunkt dieses Artikels. Ein iPhone scrolling screenshot messages-Fans lieben, oder ein Scrolling screenshot iPhone WhatsApp-Fans beim Zurück-Scrollen aufnehmen, beide bedeuten, dass der Inhalt rückwärts fließt. ScrollShot erkennt die Aufwärts-Scrollrichtung, kehrt die Frame-Reihenfolge um und verwendet dieselbe Abwärts-Stitching-Engine wieder — also bekommst du trotzdem einen korrekten iPhone scrolling screenshot, ohne dass wir etwas umschreiben.

**Wie unterscheidet sich das vom eingebauten iOS-Screenshot?**
Der eingebaute Screenshot kann nicht immer eine volle Seite innerhalb von Apps erfassen. ScrollShot ist fürs iPhone langer Screenshot- und Scroll-Screenshot-Szenario gebaut: Einmal aufnehmen, beliebig scrollen (hoch oder runter), und ein nahtloses langes Bild erhalten.

---

## Weiterlesen

- <a href="/de/blog/ios-stitching-engine-v2/">Wie schwer kann es sein, zwei Screenshots zusammenzufügen? Eine iOS-Stitching-Engine, die mich immer wieder von vorne anfangen ließ</a> — 30 Keyframes aus 1.800 wählen, Reverse-Template-Matching, Pyramid-NCC-Suche bis zur dreistufigen Fallback-Strategie — ein kompletter Teardown von ScrollShots Stitching-Engine.
- <a href="/de/blog/warum-scrollshot-ios-lange-screenshots/">Warum ScrollShot? Die ultimative Lösung für nahtlose iPhone lange Screenshots auf iOS</a> — eine Produktperspektive darauf, wie ScrollShot die Pain Points von iOS langen Screenshots löst, inklusive automatischem Bildschirmaufnahme-Stitching, manuellem Stitching, Datenschutz und HD-Export.
