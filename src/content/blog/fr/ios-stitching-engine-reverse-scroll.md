---
title: "Les utilisateurs ont exigé de défiler vers le haut pour capturer — et j'ai évité de réécrire tout le moteur avec une seule ligne"
description: "Quand les utilisateurs veulent capturer un long screenshot iPhone en faisant défiler vers le haut, mon premier réflexe a été de construire un « moteur ascendant » séparé. Au final, une seule ligne de code a suffi. Cet article décortique la conception du stitching à défilement inverse de ScrollShot, la technique derrière une capture défilante iPhone fluide dans des apps comme Messages et WhatsApp, et montre comment nous détectons le sens de défilement, inversons l'ordre des frames et réutilisons le pipeline descendant existant. Vous verrez pourquoi la détection de direction est quasi gratuite, pourquoi nous inversons l'ordre des frames plutôt que d'ajouter un drapeau isReversed, et comment nous rendons la décision à l'utilisateur quand la confiance est faible, pour capturer sans que le moteur ne se trompe."
date: "2026-07-12"
category: "Technique"
author: "Équipe ScrollShot"
tags: ["Capture longue iPhone", "Capture défilante iPhone", "Capture longue iOS", "Algorithme de fusion de captures", "Défilement inverse", "Détection du sens de défilement", "Moteur ScrollShot", "Assemblage d'enregistrement d'écran"]
readingTime: "6 min de lecture"
cover: "/ios_stitching_engine_reverse_scroll_framework_en.webp"
coverAlt: "Diagramme de matching de template inverse ScrollShot pour une capture défilante iPhone : prenez le template du haut de la nouvelle frame, cherchez le décalage en bas de l'ancienne frame"
translationKey: "ios-stitching-engine-reverse-scroll"
---

# Les utilisateurs ont exigé de défiler vers le haut pour capturer — et j'ai évité de réécrire tout le moteur avec une seule ligne

La plupart de ceux qui veulent un long screenshot iPhone — ou n'importe quelle capture défilante iPhone dans une app — partent du principe que l'utilisateur fait défiler de haut en bas. Le moteur de stitching de ScrollShot a été conçu ainsi à l'origine — j'ai raconté toute l'histoire dans <a href="/fr/blog/ios-stitching-engine-v2/">« À quel point est-ce difficile d'assembler deux captures d'écran ? Un moteur de stitching iOS qui m'a fait tout recommencer — encore et encore »</a> : enregistrer → échantillonner les frames à intervalles réguliers → matching de template par frame pour calculer le décalage → trouver la meilleure couture → recadrer et assembler. Ce pipeline est déjà solide pour le cas haut-en-bas.

Mais le monde réel aime contredire. Les utilisateurs veulent capturer une capture défilante iPhone d'une conversation — Messages, WhatsApp ou WeChat — ou sauvegarder la partie d'une page web qu'ils ont fait défiler vers le haut pour voir, exactement le cas de « capture de page entière dans une app iPhone » que tout le monde réclame — et pendant l'enregistrement, leur doigt glisse vers le haut. Le contenu s'écoule à l'envers dans l'enregistrement : il commence en bas de la page et la « fin » est en fait le contenu plus ancien. Envoyez cela tel quel dans le moteur haut-en-bas et vous obtenez une image à l'envers : le haut visuel est l'ancien contenu de la fin de l'enregistrement, et le bas est le début.

Cet article explique comment ScrollShot prend en charge l'assemblage bas-en-haut. Le point n'est pas un algorithme complexe — c'est un compromis de conception extrême sur la quantité de code nécessaire.

Voici d'abord une démo de stitching standard haut-en-bas — le stitching inverse dont nous parlerons se construit directement dessus :

<div class="blog-demo">
	<video src="/ScrollShot_Preview_En_0509.mp4" poster="/ScrollShot_Preview_En_0509_cover.jpg" controls playsinline preload="metadata"></video>
	<p>Démo de stitching défilant haut-en-bas : enregistrez une fois, faites défiler une fois, et ScrollShot échantillonne automatiquement les frames, correspond les chevauchements et assemble un long screenshot iPhone complet.</p>
</div>

---

## Premier réflexe : construire un « moteur ascendant » séparé ?

La première fois que j'ai eu ce besoin, mon instinct a été : nous avons déjà un moteur de stitching descendant, alors pourquoi ne pas en écrire un ascendant aussi ?

Je me suis vite dissuadé. Le cœur du moteur descendant est le matching de template inverse : on prend le template du haut de la nouvelle frame (img2) et on cherche dans le bas de l'ancienne frame (img1) pour calculer le décalage. Le passer en ascendant, c'est presque inverser chaque coordonnée — d'où vient le template, dans quel sens balaie la recherche, comment les décalages positif/négatif sont définis, comment la région de couture chevauchante est calculée… Un moteur de 3 000 lignes signifierait élever un jumeau parallèle, chacun avec ses propres bugs et sa propre maintenance. Pire, toute correction du moteur descendant devrait être reflétée dans le moteur ascendant, sinon les deux divergeraient en silence.

## Percée : inverser, puis réutiliser

Ce qui m'a vraiment arrêté, c'est une observation simple : le moteur de stitching se moque de la façon dont le contenu « s'écoule » — il ne s'inquiète que de quelle frame est au-dessus et laquelle est en dessous parmi deux frames adjacentes. Tant que la séquence de frames est ordonnée par la chronologie réelle du contenu, le même algorithme fonctionne de façon transparente. Des images bas-en-haut ne sont que « hors ordre ».

Donc l'approche de ScrollShot est : détecter d'abord le sens de défilement ; s'il est ascendant, inverser toute la séquence de frames, puis l'envoyer dans le pipeline descendant existant.

```
Échantillonnage des frames (défilement ascendant, contenu s'écoule à l'envers) :
  [F1 bas de page] → [F2] → [F3] → … → [Fn haut de page]
                                 │
          ScrollDirectionDetector décide : ascendant
                                 │
           reversedForStitching() inverse l'ordre des frames
                                 ▼
  [Fn haut de page] → … → [F3] → [F2] → [F1 bas de page]
                                 │
           dans le même moteur de stitching descendant (zéro changement)
                                 ▼
                    longue image correcte (haut → bas)
```

Le schéma ci-dessous dessine toute la chaîne « inverser + réutiliser » — échantillonnage des frames, détection de direction, inversion de l'ordre des frames, réutilisation du moteur descendant, jusqu'à la longue image correcte :

![Schéma de l'algorithme de stitching défilant bas-en-haut](/ios_stitching_engine_reverse_scroll_framework_en.webp)

Le cœur du code tient en une ligne :

```swift
let normalizedBatch = reverseFrames ? batch.reversedForStitching() : batch
```

`reversedForStitching()` inverse les références de frames extraites et les renumérote ; tout le reste reste intact. Après l'inversion, le contenu « à l'envers » redevient « à l'endroit », et le matching de template, le NCC et la logique de couture en aval n'ont pas besoin d'une seule ligne modifiée. Zéro nouveau code de stitching.

> ⚠️ Piège : pourquoi « inverser l'ordre des frames » et non « ajouter un drapeau `isReversed` dans le moteur » ? Parce que ce dernier transforme chaque système de coordonnées en deux copies de logique — « avant / arrière » — doublant la surface de bugs. En déplaçant la transformation avant l'alimentation des données, le moteur fait toujours face à un seul monde.

## Détection de direction : le seul nouveau code — et il est quasi gratuit

Puisque nous inversons, la condition préalable est de reconnaître que l'utilisateur a défilé vers le haut. Si cette étape est lourde, toutes les économies ci-dessus sont gaspillées. L'approche de ScrollShot est légère, et assez astucieuse pour être presque « gratuite » — réutiliser le moteur de matching de template existant, en échangeant simplement les paramètres et en l'exécutant deux fois.

`ScrollDirectionDetector` échantillonne uniformément environ 7 paires de frames adjacentes à partir du milieu de l'enregistrement (évitant le compte à rebours au début et le bouton d'arrêt à la fin), et pour chaque paire il exécute le même matcher deux fois :

```swift
let down = directionalScore(previous: prev, current: cur)  // prev→cur signifie-t-il « défilement vers le bas » ?
let up   = directionalScore(previous: cur, current: prev)  // cur→prev signifie-t-il « défilement vers le bas » ?
```

La clé est la ligne `guard outcome.offset > 0` à l'intérieur de `directionalScore`. Le matching inverse de ce moteur ne renvoie un décalage positif que lorsque « le template du haut de la nouvelle frame atterrit plus bas dans l'ancienne frame ». Donc :

- Si le défilement réel est descendant, l'appel direct `down` touche (offset > 0, valide), tandis que l'appel inverse `up` ne trouve pas de contenu plus ancien plus bas dans le haut de la nouvelle frame, donc offset ≤ 0, marqué invalide, score 0 ;
- Si le défilement réel est ascendant, c'est l'inverse : `down` est invalide, `up` est valide.

Le critère de direction est en fait « **quel appel est valide** », et non que les deux scores soient symétriques. Dans ma première ébauche j'avais écrit distraitement « parfaitement symétrique », jusqu'à ce qu'un collègue pointe du doigt et demande « comment valide et invalide peuvent-ils être symétriques ? » — c'est le malentendu que je veux le plus corriger dans cet article.

Après avoir obtenu le score `down` / `up` de chaque paire, le score par paire fonctionne comme suit :

```
score = probability×0.55 + nccBoost×0.20 + overlapRatio×0.15 + consensusBoost×0.10
score ×= sadPenalty          // plus le chevauchement est flou, plus le score est réduit
score valide doit être ≥ 0.26
```

Puis le vote : au sein d'une paire, si `up ≥ down × 1.25` (ou le dépasse de 0,08 en valeur absolue), on émet un vote ascendant ; sinon on émet un vote descendant. Décision finale :

- `upwardVotes ≥ downwardVotes + 2`, et
- `upwardScore ≥ downwardScore × 1.25`

seulement alors est-il traité comme un défilement ascendant. Le tout s'exécute sur des vignettes basse résolution plafonnées à 320 px dans un thread d'arrière-plan, avec un impact quasi imperceptible sur le temps total.

## En cas de doute, laissez-le à l'utilisateur

La détection n'est pas fiable à 100 %. Un enregistrement presque statique qui n'a bougé que de deux ou trois pixels a un signal de direction très faible ; inverser à la légère est pire que de ne pas inverser. Donc il y a une barrière : `shouldAskForReverseConfirmation` ne se déclenche que lorsque la confiance ≥ 0,72 et les échantillons valides ≥ 3 paires, affichant une confirmation légère : « Nous avons détecté un enregistrement en défilement vers le haut — inverser le stitching ? » Si l'utilisateur appuie sur inverser, `reverseFrames: true` ; s'il n'est pas sûr, il assemble dans l'ordre d'origine. Le moteur ne produit jamais silencieusement une image erronée parce qu'il a mal deviné la direction.

## Les deux modes côte à côte

| | Haut en bas | Bas en haut |
|---|---|---|
| Geste d'enregistrement | doigt glisse vers le bas | doigt glisse vers le haut |
| Ordre d'échantillonnage des frames | chronologie naturelle | chronologie naturelle (le contenu s'écoule à l'envers) |
| Détection de direction | non nécessaire | échantillonner 7 paires au milieu, matcher exécute deux fois |
| Moteur de stitching | original | original (réutilisé après inversion de l'ordre des frames) |
| Nouveau code | — | seulement détection de direction + inversion en une ligne |
| Repli | — | invite de confirmation quand la confiance est faible |

## Pour conclure

Rétrospectivement, le stitching bas-en-haut n'a presque pas de « code propre » dans ScrollShot — il est totalement parasite du moteur descendant. L'idée de « normaliser l'ordre d'abord, puis réutiliser le même moteur » est ensuite devenue notre motif de départ par défaut en ajoutant de nouveaux modes de stitching : la prochaine fois que nous ferons du stitching horizontal ou en zigzag, nous nous contenterons très probablement de trouver d'abord comment tordre le problème vers « descendent unidimensionnel » plutôt que de repartir de zéro.

---

## FAQ : capturer une capture défilante dans les apps iPhone

**ScrollShot peut-il faire une capture défilante dans des apps iPhone comme Messages et WhatsApp ?**
Oui. Que vous vouliez un long screenshot iPhone d'une page web ou une capture défilante iPhone des fils Messages et WhatsApp, ScrollShot enregistre votre écran et assemble les frames automatiquement. Parce qu'il capture par enregistrement d'écran plutôt qu'en s'appuyant sur un bouton système « page entière », il fonctionne dans n'importe quelle app — le cas de capture de page entière dans une app iPhone que tout le monde réclame.

**Que se passe-t-il si je défile vers le haut en enregistrant une conversation ?**
C'est tout l'enjeu de cet article. Une capture défilante iPhone Messages que les utilisateurs adorent, ou une capture iPhone WhatsApp que les fans capturent en remontant, signifient toutes deux que le contenu s'écoule à l'envers. ScrollShot détecte la direction de défilement ascendant, inverse l'ordre des frames et réutilise le même moteur de stitching descendant — vous obtenez donc toujours une capture défilante iPhone correcte sans que nous ayons rien à réécrire.

**En quoi est-ce différent de la capture intégrée à iOS ?**
La capture intégrée ne peut pas toujours capturer une page entière dans les apps. ScrollShot est conçu pour le cas du long screenshot et de la capture défilante iPhone : enregistrez une fois, faites défiler comme vous voulez (haut ou bas), et obtenez une seule longue image fluide.

---

## Pour aller plus loin

- <a href="/fr/blog/ios-stitching-engine-v2/">À quel point est-ce difficile d'assembler deux captures d'écran ? Un moteur de stitching iOS qui m'a fait tout recommencer — encore et encore</a> — choisir 30 keyframes parmi 1 800 frames, matching de template inverse, recherche NCC pyramidale jusqu'à une stratégie de repli à trois niveaux — une décomposition complète du moteur de stitching de ScrollShot.
- <a href="/fr/blog/pourquoi-choisir-scrollshot-captures-longues-ios/">Pourquoi choisir ScrollShot ? La solution iOS pour des captures longues nettes</a> — une perspective produit sur la façon dont ScrollShot résout les points de douleur des longs screenshots iOS, incluant l'assemblage automatique par enregistrement d'écran, le stitching manuel, la protection de la vie privée et l'export HD.
