---
title: "Comment faire une longue capture d'écran défilante sur Mac en 2026 (Guide complet)"
description: "macOS ne permet pas de capture d'écran défilante nativement. Ce guide 2026 explique pourquoi, compare GoFullPage, Shottr, CleanShot X, Xnapper, screensnap et ScrollShot, et montre comment capturer gratuitement n'importe quelle fenêtre avec ScrollShot pour Mac."
date: "2026-08-05"
category: "Guide"
author: "Équipe ScrollShot"
tags: ["Capture d'écran longue Mac", "Capture défilante Mac", "Capture d'écran scroll Mac", "ScrollShot pour Mac", "Outil capture macOS", "Défilement et assemblage"]
readingTime: "10 min de lecture"
cover: "/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp"
coverAlt: "Une capture Mac classique (un écran) à côté d'une capture ScrollShot de 765 × 4091 px du même contenu"
translationKey: "how-to-take-long-scrolling-screenshot-on-mac-2026"
faq:
  - question: "Puis-je faire une capture d'écran défilante avec l'app Capture intégrée de Mac ?"
    answer: "Non. Cmd + Shift + 4 et l'app Capture ne captent que l'écran visible. Tu as besoin d'une fonction de navigateur, d'un export PDF, ou d'une app tierce comme ScrollShot, Shottr ou CleanShot X."
  - question: "Quel est le moyen gratuit le plus rapide de faire une capture défilante sur Mac ?"
    answer: "Pour les pages web uniquement : GoFullPage (moins de 30 secondes). Pour tout ce qui est hors navigateur (Slack, PDF, apps) : ScrollShot pour Mac ou Shottr — tous deux gratuits, tous deux fonctionnent sur toute zone défilante."
  - question: "Existe-t-il un outil de capture défilante gratuit qui traduit et masque aussi ?"
    answer: "Oui — ScrollShot pour Mac. Il est gratuit et combine de façon unique la capture défilante avec OCR, traduction en 30+ langues, plus de 19 outils d'annotation et le masquage automatique des données personnelles/visages dans une seule app."
  - question: "Les captures défilantes fonctionnent-elles pour les PDF et documents ?"
    answer: "Oui, si tu utilises une app de capture native (ScrollShot, Shottr, CleanShot X) sur le PDF ouvert dans Aperçu ou un lecteur. L'« Enregistrer en PDF » intégré donne un document, pas une image."
  - question: "Pourquoi ma capture défilante a-t-elle des en-têtes en double ?"
    answer: "La page a un élément collant (bulle de chat, barre de navigation, bannière de cookies) qui reste fixe alors que le contenu défile. Ferme-le ou masque-le avant de capturer."
  - question: "Dans quel format enregistrer les captures défilantes ?"
    answer: "PNG pour la qualité et la transparence ; JPG si la taille compte et que tu n'as pas besoin de transparence ; PDF uniquement si tu as besoin de texte consultable."
---

# Comment faire une longue capture d'écran défilante sur Mac en 2026 (Guide complet)

Laisse-moi t'épargner les 20 minutes que j'ai perdues la première fois.

J'avais un fil Slack de 4 000 pixels à envoyer à un développeur. J'ai appuyé sur `Cmd + Shift + 4`, tracé une zone — et j'ai obtenu… un écran. Le reste de la conversation était en dessous, et macOS l'a gentiment ignoré. Il **n'existe aucun moyen natif de faire une capture d'écran défilante sur Mac** — ni dans `Cmd + Shift + 4`, ni dans l'app Capture, ni dans Aperçu. Si tu es venu chercher un raccourci Apple caché, je te le dis tout net : il n'existe pas. Windows l'a dans l'Outil Recapture. L'iPhone l'a. Android l'a. macOS, en 2026, ne l'intègre toujours pas.

La bonne nouvelle : c'est tout à fait résolvable, et tu as plus d'options que la plupart des blogs « Top 8 » ne l'avouent. Ce guide va au-delà de la surface. Je t'explique *pourquoi* le Mac ne peut pas le faire nativement, ce qui se passe réellement quand une app « fait défiler et assemble », et quel outil convient à quel usage — y compris celui que j'utilise tous les jours, **[ScrollShot pour Mac](/fr/blog/pourquoi-choisir-scrollshot-captures-longues-ios/)** (gratuit, et la seule option qui fait tout le travail dans une seule app).

![Avant/Après : une capture Mac classique (un écran) à côté d'une capture ScrollShot de 765 × 4091 px du même contenu](/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp)

*Une capture classique ne capte que le viewport visible. ScrollShot capture la zone défilante complète de 765 × 4091 px en une seule image — puis te laisse annoter, faire de l'OCR, traduire et masquer sans quitter l'app.*

---

## Pourquoi macOS ne peut pas faire de capture défilante nativement

Ce n'est pas de la paresse d'Apple — c'est ainsi que l'écran fonctionne.

Quand tu appuies sur `Cmd + Shift + 4`, macOS capture le *framebuffer* actuel : une image pixel pour pixel de ce qui est physiquement à l'écran maintenant. Une fenêtre défilante (Slack, une page web, un PDF) ne rend que la partie visible. Le contenu hors écran n'est pas « là » à capturer — il est dessiné à la demande quand tu fais défiler. Il n'y a pas de « tampon de défilement » comme dans un terminal. Une app de capture a donc deux choix :

1. **Demander à l'app son contenu complet** (ne fonctionne que si l'app le expose — les navigateurs oui, la plupart des apps non).
2. **Faire défiler un peu, capturer un peu, répéter, puis assembler les morceaux en une seule grande image.**

Chaque outil de « capture d'écran défilante » sur Mac fait en réalité le #2 sous le capot (ou le #1, mais uniquement pour les pages web). Cette distinction compte, car elle explique pourquoi certains outils ne fonctionnent que dans Chrome et d'autres *partout*.

![Viewport visible vs contenu défilant complet — macOS ne capture que ce qui est à l'écran, pas ce qui est en dessous](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-viewport-vs-full.webp)

---

## Les trois familles de solutions

Avant les recommandations, connais les catégories. Elles ne sont pas interchangeables.

| Famille | Fonctionnement | Idéal pour | Ne peut pas |
| --- | --- | --- | --- |
| **Navigateur uniquement** (GoFullPage, outil intégré Firefox, DevTools, Inspecteur Web Safari) | Demande à la page son DOM/contenu complet | Pages web *ouvertes dans ce navigateur* | Slack, PDF dans Aperçu, fenêtres d'app, tableaux Figma |
| **Apps de capture natives** (Shottr, CleanShot X, Xnapper, **ScrollShot**, screensnap*) | Fait défiler + assemble l'écran réel | *N'importe quelle* zone défilante, y compris les apps hors navigateur | — (limité seulement par la qualité de l'app) |
| **Export PDF** (`Cmd + P` → Enregistrer en PDF) | Rend la mise en page dans un document | Archives consultables, impression | Pas une image ; pas insérable en ligne |

\* *screensnap (ScreenSnap Pro) est une exception notable — voir la note ci-dessous. C'est un outil d'annotation, pas un outil de capture défilante.*

---

## Recommandation rapide (lis ça si tu es pressé)

- **Tu ne fais des captures que de pages web** → une extension de navigateur comme GoFullPage convient et est gratuite.
- **Tu dois capturer Slack, PDF, fenêtres d'app ou documents** → tu as besoin d'une app native.
- **Tu veux un outil gratuit qui capture *et* permet OCR, traduction, annotation, floutage des infos sensibles, voire enregistrement vidéo — sans payer ni t'abonner** → **ScrollShot pour Mac**. C'est la seule option de ce guide qui fait toute la chaîne nativement et gratuitement.

![Comparaison de trois outils : GoFullPage (web uniquement), CleanShot X (29 $/an) et ScrollShot (gratuit, tout-en-un)](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-3up-comparison-cards.webp)

---

## Le comparatif complet (Shottr, CleanShot X, Xnapper, screensnap, ScrollShot)

J'ai testé les prétendants courants sur macOS 15/26. Voici leur comportement réel, pas leur discours marketing. Pour rester lisible, j'ai divisé en deux tableaux ciblés — ce que chaque outil peut **capturer**, et ce qu'il peut faire du **résultat**.

### Capture et portée

| Outil | Prix | Capture défilante | Au-delà des navigateurs ? |
| --- | --- | --- | --- |
| **ScrollShot pour Mac** | **Gratuit** | ✅ Assemblage auto via Apple Vision | ✅ Toute zone défilante |
| **Shottr** | Gratuit (12 $ en une fois pour retirer les invites) | ✅ Défilement + assemblage manuels | ✅ |
| **CleanShot X** | 29 $/an (ou 59 $ en une fois) | ✅ Auto ou manuel | ✅ |
| **Xnapper** | 24 $ en une fois | ✅ | ✅ |
| **screensnap (ScreenSnap Pro)** | 39 $ en une fois | ❌ **Pas de capture défilante** | ❌ |
| **GoFullPage** | Gratuit (niveau payant) | ✅ (navigateur uniquement) | ❌ Web uniquement |

### Après capture : édition

| Outil | Annotation | OCR + Traduction | Enregistrer/monter vidéo | Masquage auto (PII) |
| --- | --- | --- | --- | --- |
| **ScrollShot pour Mac** | ✅ 19+ outils | ✅ 30+ langues | ✅ MP4/GIF + rogner | ✅ E-mails, tél., clés API, visages |
| **Shottr** | ✅ De base | ⚠️ OCR seul, pas de traduction | ❌ | ❌ |
| **CleanShot X** | ✅ Puissant | ❌ | ✅ (séparé) | ⚠️ Floutage manuel uniquement |
| **Xnapper** | ✅ + embellir | ❌ | ❌ | ⚠️ Floutage automatique vie privée |
| **screensnap (ScreenSnap Pro)** | ✅ 15 outils + fonds | ❌ | ✅ GIF | ⚠️ Floutage manuel |
| **GoFullPage** | ⚠️ Recadrage simple | ❌ | ❌ | ❌ |

**Le réalité-check screensnap.** Le blog de screensnap (« 8 méthodes classées par vitesse ») est une liste classée réellement utile — mais regarde ce qu'il recommande pour la capture à proprement parler : GoFullPage et Shottr. ScreenSnap Pro *ne peut pas* faire de capture d'écran défilante. Il est conçu pour l'*étape suivante* (embellir + annoter + partager une capture que tu as faite ailleurs). Donc si ton problème est « j'ai besoin de la longue capture en premier lieu », screensnap n'est pas une solution de capture ; c'est une solution post-capture. ScrollShot, à l'inverse, fait à la fois la capture *et* l'étape annoter/flouter/partager dans la même app gratuite.

---

## Comment fonctionne réellement le « défilement et assemblage » (et pourquoi ça casse)

Quand ScrollShot (ou Shottr, ou CleanShot) fait une longue capture, le processus de défilement et assemblage est :

1. Capture la zone visible.
2. Simule un défilement (ou attend que tu fasses défiler).
3. Capture la zone suivante.
4. **Met en correspondance les pixels qui se chevauchent** entre les deux images pour trouver la couture.
5. Les assemble, puis répète jusqu'à ce que tu arrêtes.

L'étape de correspondance est là où les outils vivent ou meurent dans tout workflow de défilement et assemblage. Le [moteur d'assemblage](/fr/blog/ios-stitching-engine-v2/) de ScrollShot utilise le framework Vision d'Apple pour la correspondance des images, c'est pourquoi il gère mieux les vitesses de défilement variables et les légers décalages de mise en page que les approches naïves de différence de pixels. Trois choses cassent quand même n'importe quel assembleur :

- **En-têtes/pieds de page collants** qui ne bougent pas alors que le contenu défile → doubles barres. (Ferme d'abord les widgets de chat et les bannières de cookies.)
- **Contenu chargé en lazy** qui n'apparaît qu'après le défilement → trous vides. (Fais défiler une fois, puis capture.)
- **Hypothèse de largeur fixe** → si tu redimensionnes la fenêtre, la largeur de sortie change. Fixe la largeur avant de capturer.

![Comment marche Scroll & Stitch : l'outil met en correspondance la bande qui se chevauche pour trouver où l'image 2 s'attache à l'image 1](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-stitch-overlap.webp)

---

## Étape par étape : faire une longue capture avec ScrollShot pour Mac

C'est le workflow que j'utilise maintenant pour tout.

**1. Installer (30 secondes).**  
Télécharge depuis [`mac.scrollshot.work/ScrollShot.dmg`](https://mac.scrollshot.work/ScrollShot.dmg), ouvre le DMG, glisse l'app dans Applications. Pas de compte, pas de clé de licence.

![Installer ScrollShot : ouvre le DMG et glisse l'app dans Applications](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-dmg-install.webp)

**2. Déclencher la capture défilante.**  
Appuie sur le raccourci de capture défilante (ou choisis-le dans la barre de menu). Trace une zone autour de la partie défilante — une page web, un volet Slack, une colonne PDF, peu importe.

**3. Défiler.**  
Fais défiler avec le trackpad ou la molette. ScrollShot assemble automatiquement en live ; tu vois la grande image grandir dans l'aperçu. Arrête quand tu as tout capturé.

![Aperçu live : ScrollShot assemble automatiquement pendant que tu défiles, et tu vois la grande image grandir](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-live-preview.webp)

**4. Une image, déjà modifiable.**  
Quand tu finis, tu ne te retrouves pas dans un éditeur séparé. La même fenêtre te permet : ajouter flèches/numéros, **faire l'OCR du texte et le traduire en ligne dans 30+ langues**, flouter ou masquer automatiquement e-mails/tél./clés API/visages, puis exporter en PNG ou enregistrer sur un fond dégradé embelli.

![Annoter la longue capture terminée : flèche, numéro, floutage et traduction — sans quitter l'app](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-annotation-toolbar.webp)

**5. Partager.**  
Copie dans le presse-papiers, uploade vers ton S3/Cloud, ou exporte. Terminé — sans quitter l'app.

Ce dernier point est la vraie raison de mon changement. Avec Shottr, je capturais puis ouvrais une autre app pour annoter. Avec CleanShot X, j'aurais payé 29 $/an pour le privilège. Après la capture par défilement et assemblage, ScrollShot fait capture → édition → traduction → masquage → export en un seul passage, gratuitement.

---

## Quand tu ne *devrais pas* utiliser une app de capture défilante

Sois honnête sur le besoin :

- **Tu as besoin de texte consultable et copiable** (archive juridique, PDF de recherche) → `Cmd + P` → Enregistrer en PDF. Un PNG de 12 000 pixels de haut n'est pas consultable.
- **Tu ne fais des captures que dans un seul navigateur** et ne le quittes jamais → GoFullPage ou « Faire une capture → Enregistrer la page entière » intégré à Firefox est plus léger.
- **Tu as besoin d'une mise en page d'impression pixel perfect** → encore PDF.

Pour tout le reste — fils de discussion, documents, panneaux de réglages, longues pages web que tu annoteras — une app de capture native gagne.

---

## Pièges fréquents (et la solution)

- **Double en-tête dans le résultat** → élément collant. Ferme-le ou utilise un outil avec une bonne gestion des éléments collants avant de capturer.
- **Section du milieu manquante** → défilement infini / lazy load. Fais défiler jusqu'en bas une fois, puis capture du haut.
- **Texte flou** → capturé en faible DPI. Agrandis la fenêtre (ou zoome) avant de capturer.
- **Taille de fichier énorme** → un PNG de 10 000 px de haut peut faire plusieurs Mo. Compresse avant de partager, ou découpe en sections pour la lisibilité.

---

## FAQ

**Puis-je faire une capture d'écran défilante avec l'app Capture intégrée de Mac ?**  
Non. `Cmd + Shift + 4` et l'app Capture ne captent que l'écran visible. Tu as besoin d'une fonction de navigateur, d'un export PDF, ou d'une app tierce comme ScrollShot, Shottr ou CleanShot X.

**Quel est le moyen gratuit le plus rapide de faire une capture défilante sur Mac ?**  
Pour les pages web uniquement : GoFullPage (moins de 30 secondes). Pour tout ce qui est hors navigateur (Slack, PDF, apps) : ScrollShot pour Mac ou Shottr — tous deux gratuits, tous deux fonctionnent sur toute zone défilante.

**Existe-t-il un outil de capture défilante gratuit qui traduit et masque aussi ?**  
Oui — [ScrollShot pour Mac](/fr/blog/pourquoi-choisir-scrollshot-captures-longues-ios/). Il est gratuit et combine de façon unique la capture défilante avec OCR, traduction en 30+ langues, plus de 19 outils d'annotation et le masquage automatique des données personnelles/visages dans une seule app.

**Les captures défilantes fonctionnent-elles pour les PDF et documents ?**  
Oui, si tu utilises une app de capture native (ScrollShot, Shottr, CleanShot X) sur le PDF ouvert dans Aperçu ou un lecteur. L'« Enregistrer en PDF » intégré donne un document, pas une image.

**Pourquoi ma capture défilante a-t-elle des en-têtes en double ?**  
La page a un élément collant (bulle de chat, barre de navigation, bannière de cookies) qui reste fixe alors que le contenu défile. Ferme-le ou masque-le avant de capturer.

**Dans quel format enregistrer les captures défilantes ?**  
PNG pour la qualité et la transparence ; JPG si la taille compte et que tu n'as pas besoin de transparence ; PDF uniquement si tu as besoin de texte consultable.
