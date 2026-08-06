---
title: "Lange Bildschirmfotos auf dem Mac aufnehmen: Die komplette 2026-Anleitung für Scroll-Screenshots"
description: "macOS kann keine scrollenden Bildschirmfotos nativ. Diese 2026-Anleitung erklärt warum, vergleicht GoFullPage, Shottr, CleanShot X, Xnapper, screensnap und ScrollShot und zeigt, wie du mit ScrollShot für Mac jedes Fenster kostenlos einfängst."
date: "2026-08-05"
category: "Anleitung"
author: "ScrollShot Team"
tags: ["Langes Bildschirmfoto Mac", "Scroll-Screenshot Mac", "Bildschirmfoto scrollen Mac", "ScrollShot für Mac", "macOS Screenshot-Tool", "Scrollen und Zusammensetzen"]
readingTime: "10 Min. Lesezeit"
cover: "/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp"
coverAlt: "Ein normales Mac-Einzelbild neben einer ScrollShot-Aufnahme (765 × 4091 px) desselben Inhalts"
translationKey: "how-to-take-long-scrolling-screenshot-on-mac-2026"
faq:
  - question: "Kann ich mit der integrierten Mac-Screenshot-App ein scrollendes Bildschirmfoto machen?"
    answer: "Nein. Cmd + Shift + 4 und die Screenshot-App erfassen nur den sichtbaren Bildschirm. Du brauchst eine Browser-Funktion, einen PDF-Export oder eine Drittanbieter-App wie ScrollShot, Shottr oder CleanShot X."
  - question: "Was ist der schnellste kostenlose Weg für ein scrollendes Bildschirmfoto auf dem Mac?"
    answer: "Nur für Webseiten: GoFullPage (unter 30 Sekunden). Für alles außerhalb eines Browsers — Slack, PDFs, Apps — funktionieren ScrollShot für Mac oder Shottr, beide kostenlos."
  - question: "Gibt es ein kostenloses Scroll-Screenshot-Tool, das auch übersetzt und schwärzt?"
    answer: "Ja — ScrollShot für Mac. Es ist kostenlos und kombiniert als einzige App Bildlauf-Erfassung mit OCR, Übersetzung in über 30 Sprachen, mehr als 19 Annotationswerkzeugen und automatischer Schwärzung von personenbezogenen Daten/Gesichtern."
  - question: "Funktionieren scrollende Bildschirmfotos auch für PDFs und Dokumente?"
    answer: "Ja, wenn du eine native Scroll-Erfassungs-App (ScrollShot, Shottr, CleanShot X) auf dem in der Vorschau oder einem Reader geöffneten PDF verwendest. „Als PDF sichern\" liefert ein Dokument, kein Bild."
  - question: "Warum hat mein scrollendes Bildschirmfoto doppelte Kopfzeilen?"
    answer: "Die Seite hat ein sticky Element — eine Chat-Blase, Navigationsleiste oder Cookie-Banner — das beim Scrollen fix bleibt. Schließe oder blenden es vor der Aufnahme aus."
  - question: "In welchem Format sollte ich scrollende Bildschirmfotos speichern?"
    answer: "PNG für Qualität und Transparenz; JPG wenn die Dateigröße wichtig ist und du keine Transparenz brauchst; PDF nur wenn du durchsuchbaren Text benötigst."
---

# Lange Bildschirmfotos auf dem Mac aufnehmen: Die komplette 2026-Anleitung für Scroll-Screenshots

Lass mich dir die 20 Minuten ersparen, die ich beim ersten Mal vergeudet habe.

Ich hatte einen 4.000 Pixel langen Slack-Thread, den ich an einen Entwickler senden wollte. Ich drückte `Cmd + Shift + 4`, zog ein Rechteck auf — und bekam … einen Bildschirm. Der Rest der Unterhaltung war unterhalb des sichtbaren Bereichs, und macOS hat ihn fröhlich ignoriert. Es gibt **keine native Möglichkeit, auf dem Mac ein scrollendes Bildschirmfoto zu machen** — weder in `Cmd + Shift + 4`, noch in der Screenshot-App, noch in der Vorschau. Wenn du hier hoffst, einen versteckten Apple-Shortcut zu finden: ich sage es dir direkt — es gibt ihn nicht. Windows hat ihn im Snipping Tool. iPhone hat ihn. Android hat ihn. macOS, im Jahr 2026, bringt ihn immer noch nicht mit.

Die gute Nachricht: Es lässt sich vollständig lösen, und du hast mehr Optionen, als die meisten „Top-8-Listen"-Blogs zugeben. Dieser Leitfaden geht über die Oberfläche hinaus. Ich erkläre dir, *warum* der Mac das nativ nicht kann, was tatsächlich passiert, wenn eine App „scrollt und zusammensetzt", und welches Werkzeug für welchen Job passt — inklusive dem, das ich jetzt täglich nutze, **[ScrollShot für Mac](/de/blog/warum-scrollshot-ios-lange-screenshots/)** (kostenlos und die einzige Option, die den ganzen Job in einer App erledigt).

![Vorher/Nachher: ein normales Mac-Bildschirmfoto (ein Bildschirm) neben einer ScrollShot-Aufnahme (765 × 4091 px) desselben Inhalts](/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp)

*Ein normales Bildschirmfoto erfasst nur den sichtbaren Ausschnitt. ScrollShot erfasst den kompletten, 765 × 4091 px großen scrollbaren Bereich in einem Bild — und lässt dich anschließend annotieren, per OCR erfassen, übersetzen und schwärzen, ohne die App zu verlassen.*

---

## Warum macOS nativ kein scrollendes Bildschirmfoto machen kann

Das ist keine Faulheit von Apple — so funktioniert der Bildschirm nun mal.

Wenn du `Cmd + Shift + 4` drückst, greift macOS auf den aktuellen *Framebuffer* zu: ein pixelgenaues Abbild dessen, was gerade physisch auf dem Bildschirm ist. Ein scrollendes Fenster (Slack, eine Webseite, ein PDF) rendert nur den sichtbaren Teil. Der Inhalt außerhalb des Bildschirms ist nicht „da", um ihn zu erfassen — er wird beim Scrollen on Demand gezeichnet. Es gibt keinen „Scrollback-Puffer" wie in einem Terminal. Eine Screenshot-App hat also zwei Möglichkeiten:

1. **Die App um ihren vollständigen Inhalt bitten** (funktioniert nur, wenn die App ihn preisgibt — Browser können es, die meisten Apps nicht).
2. **Etwas scrollen, etwas screenshotten, wiederholen und dann die Teile zu einem hohen Bild scrollen-und-zusammensetzen.**

Jedes „scrollende Bildschirmfoto"-Tool auf dem Mac macht im Hintergrund #2 (oder #1, aber nur für Webseiten). Dieser Unterschied ist wichtig, denn er erklärt, warum manche Tools nur in Chrome und andere *überall* funktionieren.

![Sichtbarer Ausschnitt vs. vollständiger scrollbarer Inhalt — macOS erfasst nur, was auf dem Bildschirm ist, nicht was unterhalb liegt](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-viewport-vs-full.webp)

---

## Die drei Familien von Lösungen

Bevor ich Empfehlungen ausspreche, die Kategorien kennen. Sie sind nicht austauschbar.

| Familie | Funktionsweise | Am besten für | Kann nicht |
| --- | --- | --- | --- |
| **Nur Browser** (GoFullPage, Firefox-Bordmittel, DevTools, Safari Web Inspector) | Fragt die Seite nach vollem DOM/Inhalt | Webseiten *in genau diesem Browser geöffnet* | Slack, PDFs in der Vorschau, App-Fenster, Figma-Boards |
| **Native Scroll-Erfassungs-Apps** (Shottr, CleanShot X, Xnapper, **ScrollShot**, screensnap*) | Scrollt + setzt den echten Bildschirm zusammen | *Jeden* scrollbaren Bereich, inkl. Nicht-Browser-Apps | — (nur durch App-Qualität begrenzt) |
| **PDF-Export** (`Cmd + P` → Als PDF sichern) | Rendert Layout in ein Dokument | Durchsuchbare Archive, Druck | Kein Bild; nicht inline einfügbar |

\* *screensnap (ScreenSnap Pro) ist eine bemerkenswerte Ausnahme — siehe die Anmerkung unten. Es ist ein Annotationstool, kein Scroll-Erfassungs-Tool.*

---

## Schnellempfehlung (lies das, wenn du es eilig hast)

- **Du machst ausschließlich Screenshots von Webseiten** → eine Browser-Erweiterung wie GoFullPage ist okay und kostenlos.
- **Du musst Slack, PDFs, App-Fenster oder Dokumente erfassen** → du brauchst eine native App.
- **Du willst ein kostenloses Tool, das erfasst *und* OCR, Übersetzung, Annotation, sensible Infos schwärzt und sogar Video aufnimmt — ohne zu zahlen oder ein Abo abzuschließen** → **ScrollShot für Mac**. Es ist die einzige Option in diesem Leitfaden, die die gesamte Pipeline nativ und kostenlos abdeckt.

![Drei Tools im Vergleich: GoFullPage (nur Web), CleanShot X (29 $/Jahr) und ScrollShot (kostenlos, alles-in-einem)](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-3up-comparison-cards.webp)

---

## Der vollständige Vergleich (Shottr, CleanShot X, Xnapper, screensnap, ScrollShot)

Ich habe die gängigen Kandidaten unter macOS 15/26 getestet. So verhalten sie sich wirklich, nicht wie ihr Marketing klingt. Damit das lesbar bleibt, habe ich es in zwei fokussierte Tabellen aufgeteilt — was jedes Tool **erfassen** kann und was es mit dem **Ergebnis** anstellen kann.

### Erfassung & Reichweite

| Tool | Preis | Scroll-Erfassung | Auch außerhalb des Browsers? |
| --- | --- | --- | --- |
| **ScrollShot für Mac** | **Kostenlos** | ✅ Auto-Zusammenfügen über Apple Vision | ✅ Jeder scrollbare Bereich |
| **Shottr** | Kostenlos (12 $ Einmalzahlung gegen Hinweise) | ✅ Manuelles Scrollen + Zusammenfügen | ✅ |
| **CleanShot X** | 29 $/Jahr (oder 59 $ Einmalzahlung) | ✅ Auto oder manuell | ✅ |
| **Xnapper** | 24 $ Einmalzahlung | ✅ | ✅ |
| **screensnap (ScreenSnap Pro)** | 39 $ Einmalzahlung | ❌ **Keine Scroll-Erfassung** | ❌ |
| **GoFullPage** | Kostenlos (kostenpflichtige Stufe) | ✅ (nur Browser) | ❌ Nur Web |

### Nach der Erfassung: Bearbeitung

| Tool | Annotation | OCR + Übersetzung | Video aufnehmen/bearbeiten | Auto-Schwärzung (PII) |
| --- | --- | --- | --- | --- |
| **ScrollShot für Mac** | ✅ 19+ Werkzeuge | ✅ 30+ Sprachen | ✅ MP4/GIF + Zuschneiden | ✅ E-Mails, Telefonnummern, API-Schlüssel, Gesichter |
| **Shottr** | ✅ Grundlagen | ⚠️ Nur OCR, keine Übersetzung | ❌ | ❌ |
| **CleanShot X** | ✅ Stark | ❌ | ✅ (separat) | ⚠️ Nur manuelles Schwärzen |
| **Xnapper** | ✅ + Verschönern | ❌ | ❌ | ⚠️ Auto-Datenschutz-Schwärzung |
| **screensnap (ScreenSnap Pro)** | ✅ 15 Werkzeuge + Hintergründe | ❌ | ✅ GIF | ⚠️ Nur manuelles Schwärzen |
| **GoFullPage** | ⚠️ Einfacher Zuschnitt | ❌ | ❌ | ❌ |

**Der screensnap-Realitätscheck.** Der eigene Blog von screensnap („8 Methoden nach Geschwindigkeit gerankt") ist eine wirklich nützliche gerankte Liste — aber achte darauf, was er für die eigentliche Erfassung empfiehlt: GoFullPage und Shottr. ScreenSnap Pro selbst *kann kein scrollendes Bildschirmfoto machen*. Es ist für den *nächsten* Schritt gebaut (verschönern + annotieren + teilen einer Aufnahme, die du woanders gemacht hast). Wenn dein Problem also lautet „Ich brauche das lange Bildschirmfoto überhaupt erst", ist screensnap keine Erfassungslösung; es ist eine Lösung nach der Erfassung. ScrollShot hingegen macht sowohl die Erfassung *als auch* den Annotieren/Schwärzen/Teilen-Schritt in derselben kostenlosen App.

---

## Wie „Scrollen und Zusammensetzen" wirklich funktioniert (und warum es scheitert)

Wenn ScrollShot (oder Shottr oder CleanShot) ein langes Bildschirmfoto macht, läuft der Scroll-und-Zusammensetzen-Prozess so ab:

1. Erfasst den sichtbaren Bereich.
2. Simuliert einen Scroll (oder wartet, bis du scrollst).
3. Erfasst den nächsten Bereich.
4. **Gleicht überlappende Pixel** zwischen den beiden Frames ab, um die Naht zu finden.
5. Setzt sie zusammen und wiederholt das, bis du stoppst.

Der Abgleichschritt ist das, woran Tools in jedem Scroll-und-Zusammensetzen-Workflow scheitern oder bestehen. ScrollShots [Zusammenfüge-Engine](/de/blog/ios-stitching-engine-v2/) nutzt Apples Vision-Framework für den Frame-Abgleich — deshalb kommt sie mit variablen Scroll-Geschwindigkeiten und kleinen Layout-Verschiebungen besser zurecht als naive Pixel-Diff-Ansätze. Drei Dinge bringen trotzdem jeden Zusammensetzer zum Scheitern:

- **Sticky-Header/Footer**, die sich nicht bewegen, während sich der Inhalt bewegt → doppelte Leisten. (Schließe Chat-Widgets und Cookie-Banner zuerst.)
- **Lazy-Loaded Inhalte**, die erst nach dem Scrollen erscheinen → leere Lücken. (Scrolle einmal durch, dann erfasse.)
- **Feste-Breite-Annahme** → wenn du das Fenster vergrößerst, ändert sich die Ausgabe-Breite. Entscheide die Breite vor der Erfassung.

![So funktioniert Scroll & Stitch: Das Tool gleicht den überlappenden Streifen ab, um zu finden, wo Frame 2 an Frame 1 anschließt](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-stitch-overlap.webp)

---

## Schritt für Schritt: Ein langes Bildschirmfoto mit ScrollShot für Mac machen

Das ist der Workflow, den ich jetzt für alles nutze.

**1. Installieren (30 Sekunden).**  
Lade von [`mac.scrollshot.work/ScrollShot.dmg`](https://mac.scrollshot.work/ScrollShot.dmg) herunter, öffne die DMG und ziehe die App in die Programme. Kein Konto, kein Lizenzschlüssel.

![ScrollShot installieren: DMG öffnen und die App in Programme ziehen](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-dmg-install.webp)

**2. Scroll-Erfassung auslösen.**  
Drücke den Scroll-Erfassungs-Hotkey (oder wähle ihn aus der Menüleiste). Ziehe ein Rechteck um den scrollbaren Bereich — eine Webseite, eine Slack-Spalte, eine PDF-Spalte, was auch immer.

**3. Scrollen.**  
Scrolle mit dem Trackpad oder Mausrad. ScrollShot setzt live automatisch zusammen; du siehst das hohe Bild in der Vorschau wachsen. Stoppe, wenn du alles erfasst hast.

![Live-Vorschau: ScrollShot setzt beim Scrollen automatisch zusammen, und du siehst das hohe Bild wachsen](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-live-preview.webp)

**4. Ein Bild, schon bearbeitbar.**  
Wenn du fertig bist, landest du nicht in einem separaten Editor. Dasselbe Fenster lässt dich: Pfeile/Nummern hinzufügen, **den Text per OCR erfassen und inline in über 30 Sprachen übersetzen**, E-Mails/Telefonnummern/API-Schlüssel/Gesichter schwärzen oder automatisch schwärzen, dann als PNG exportieren oder auf einen verschönerten Verlaufs-Hintergrund speichern.

![Das fertige lange Bildschirmfoto annotieren: Pfeil, Nummer, schwärzen und übersetzen — ohne die App zu verlassen](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-annotation-toolbar.webp)

**5. Teilen.**  
In die Zwischenablage kopieren, in dein S3/Cloud hochladen oder exportieren. Fertig — ohne die App zu verlassen.

Dieser letzte Punkt ist der eigentliche Grund, warum ich gewechselt habe. Mit Shottr habe ich erfasst und dann eine andere App zum Annotieren geöffnet. Mit CleanShot X hätte ich 29 $/Jahr für das Privileg bezahlt. Nach der Scroll-und-Zusammensetzen-Erfassung erledigt ScrollShot Erfassung → Bearbeiten → Übersetzen → Schwärzen → Export in einem Durchgang, kostenlos.

---

## Wann du *keine* Scroll-Erfassungs-App nutzen solltest

Sei ehrlich zum Job:

- **Du brauchst durchsuchbaren, kopierbaren Text** (rechtsgültiges Archiv, Forschungs-PDF) → `Cmd + P` → Als PDF sichern. Ein 12.000 Pixel hohes PNG ist nicht durchsuchbar.
- **Du machst Screenshots nur in einem Browser** und verlässt ihn nie → GoFullPage oder Firefox' eingebaute „Screenshot aufnehmen → Ganze Seite speichern" ist leichtgewichtiger.
- **Du brauchst druckfertiges Layout mit Pixel-Genauigkeit** → wieder PDF.

Für alles andere — Chat-Verläufe, Dokumente, Einstellungsbereiche, lange Webseiten, die du annotieren wirst — gewinnt eine native Scroll-App.

---

## Häufige Stolpersteine (und die Lösung)

- **Doppelte Kopfzeile im Ergebnis** → sticky Element. Schließe es oder nutze vor der Erfassung ein Tool mit guter Sticky-Verarbeitung.
- **Fehlender mittlerer Abschnitt** → endloses Scrollen / Lazy Load. Scrolle einmal ganz nach unten, dann von oben erfassen.
- **Verschwommener Text** → mit niedriger DPI erfasst. Vergrößere das Fenster (oder zoom hinein), bevor du erfasst.
- **Riesige Dateigröße** → ein 10.000 px hohes PNG kann mehrere MB sein. Komprimiere vor dem Teilen oder teile in Abschnitte für die Lesbarkeit.

---

## FAQ

**Kann ich mit der integrierten Mac-Screenshot-App ein scrollendes Bildschirmfoto machen?**  
Nein. `Cmd + Shift + 4` und die Screenshot-App erfassen nur den sichtbaren Bildschirm. Du brauchst eine Browser-Funktion, einen PDF-Export oder eine Drittanbieter-App wie ScrollShot, Shottr oder CleanShot X.

**Was ist der schnellste kostenlose Weg für ein scrollendes Bildschirmfoto auf dem Mac?**  
Nur für Webseiten: GoFullPage (unter 30 Sekunden). Für alles außerhalb eines Browsers (Slack, PDFs, Apps): ScrollShot für Mac oder Shottr — beide kostenlos, beide auf jedem scrollbaren Bereich.

**Gibt es ein kostenloses Scroll-Screenshot-Tool, das auch übersetzt und schwärzt?**  
Ja — [ScrollShot für Mac](/de/blog/warum-scrollshot-ios-lange-screenshots/). Es ist kostenlos und kombiniert einzigartig Bildlauf-Erfassung mit OCR, Übersetzung in über 30 Sprachen, mehr als 19 Annotationswerkzeugen und automatischer Schwärzung von personenbezogenen Daten/Gesichtern in einer App.

**Funktionieren scrollende Bildschirmfotos auch für PDFs und Dokumente?**  
Ja, wenn du eine native Scroll-Erfassungs-App (ScrollShot, Shottr, CleanShot X) auf dem in der Vorschau oder einem Reader geöffneten PDF verwendest. Das eingebaute „Als PDF sichern" liefert ein Dokument, kein Bild.

**Warum hat mein scrollendes Bildschirmfoto doppelte Kopfzeilen?**  
Die Seite hat ein sticky Element (Chat-Blase, Navigationsleiste, Cookie-Banner), das fix bleibt, während sich der Inhalt scrollt. Schließe oder blenden es vor der Erfassung aus.

**In welchem Format sollte ich scrollende Bildschirmfotos speichern?**  
PNG für Qualität und Transparenz; JPG wenn die Dateigröße wichtig ist und du keine Transparenz brauchst; PDF nur wenn du durchsuchbaren Text benötigst.
