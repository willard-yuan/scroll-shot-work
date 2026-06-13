---
title: "À quel point est-ce difficile d'assembler deux captures d'écran ? Un moteur de stitching iOS qui m'a fait tout recommencer — encore et encore"
description: "Plongée dans le moteur d'assemblage de ScrollShot : sélectionner 30 images clés parmi 1 800, template matching inversé, recherche pyramidale NCC, stratégie de fallback à trois niveaux, et les astuces d'ingénierie qu'aucun manuel n'enseigne."
date: "2026-06-10"
category: "Technique"
author: "Équipe ScrollShot"
tags: ["capture d'écran longue iOS", "algorithme d'assemblage", "template matching", "NCC", "moteur ScrollShot", "assemblage enregistrement écran"]
readingTime: "15 min de lecture"
featured: true
cover: "/scrollshot_video_to_long_screenshot_workflow.webp"
coverAlt: "Pipeline du moteur d'assemblage ScrollShot en six étapes : de l'enregistrement d'écran à l'image longue"
translationKey: "ios-stitching-engine-v2"
---

# À quel point est-ce difficile d'assembler deux captures d'écran ? Un moteur de stitching iOS qui m'a fait tout recommencer — encore et encore

J'ai passé plusieurs mois à faire une seule chose : faire en sorte que l'assemblage de captures longues sur mobile soit « parfaitement aligné ».

Ça paraît simple, non ? Deux captures adjacentes, trouver le chevauchement, couper, coller. Mais quand on s'y met vraiment, on découvre vite que « parfaitement aligné » est un gouffre d'ingénierie sans fond.

Cet article démonte le moteur d'assemblage de ScrollShot. Pas de pitch produit, pas de promesses en l'air — juste des algorithmes et les détails d'ingénierie qui m'ont fait refondre la conception encore et encore. Si vous êtes curieux du positionnement global de ScrollShot, commencez par la <a href="/fr/blog/pourquoi-choisir-scrollshot-captures-longues-ios/">vue d'ensemble produit : pourquoi choisir ScrollShot pour les captures longues iOS</a>.

---

## Pourquoi ne pas utiliser le stitching panorama d'OpenCV ?

Intuitivement, l'assemblage d'images est un vieux problème. La classe `Stitcher` d'OpenCV produit des panoramas en quelques lignes de code.

Mais les captures longues et les panoramas sont deux bêtes complètement différentes. Un panorama est capturé par rotation horizontale avec transformation en perspective, et un chevauchement généralement faible. Une capture longue est un **défilement vertical unidirectionnel** — les images consécutives partagent 5 % à 80 % de contenu identique, et — c'est crucial — **un décalage de 2 pixels se voit immédiatement** car vous assemblez peut-être du texte.

Quiconque a essayé OpenCV partage la même expérience : le feature matching s'effondre sur les écrans de chat. Certains utilisateurs ont une image de fond dans leur messagerie, si bien que la majorité du frame se ressemble. Au lieu que la fin d'un frame chevauche le début du suivant, les points SIFT produisent des nuages de paires « similaires mais différentes ».

J'ai donc pris un autre chemin : j'ai écrit la première ligne d'un moteur de template matching de zéro, optimisé spécifiquement pour le scénario « captures d'écran à défilement vertical ».

Le pipeline global ressemble à ceci :

![Pipeline du moteur d'assemblage ScrollShot](/scrollshot_video_to_long_screenshot_workflow.webp)

Le moteur supporte aussi Apple Vision Framework pour le matching (rapide mais grossier), mais cet article se concentre sur le template matching maison — c'est là que le vrai travail se fait. Pour voir comment cet algorithme se traduit en une expérience <a href="/fr/blog/pourquoi-choisir-scrollshot-captures-longues-ios/">enregistrez une fois, obtenez une capture longue</a>, consultez la présentation produit.

---

## Défi 1 : choisir 30 images utiles parmi 1 800

Un enregistrement de 30 secondes à 60 fps = 1 800 images. Les traiter toutes ? La mémoire explose la première, le temps juste après.

L'approche la plus intuitive est l'**échantillonnage temporel** : 3 images par seconde. Mais elle a un défaut fatal — la vitesse de défilement de l'utilisateur n'est pas constante. Lors d'un swipe rapide, deux images consécutives diffèrent d'un demi-écran, et l'assemblage saute inévitablement du contenu. En navigation lente, les images adjacentes sont quasi identiques — que du gaspillage.

ScrollShot utilise l'**échantillonnage par distance** : au lieu de regarder le temps, on regarde « de combien l'écran a défilé ». Une image ne mérite d'être capturée que lorsque le déplacement cumulé dépasse un seuil.

### Quel seuil de déplacement ?

Ce chiffre m'a hanté pendant des semaines. Trop petit, un défilement lent déclenche une extraction frénétique pleine de doublons. Trop grand, un défilement rapide saute du contenu.

La formule finale :

```
displacementThreshold = dsHeight × 0,60 × presetScale
```

Où `dsHeight` est la hauteur de frame après sous-échantillonnage (1080p réduit 3× ≈ 360p, soit `dsHeight ≈ 640`), `0,60` le ratio de base, et `presetScale` un préréglage sélectionnable (agressif/équilibré/conservateur).

En mode équilibré, cela signifie une image capturée tous les **384 pixels** (640 × 0,60) de défilement — environ la moitié de la hauteur d'écran.

Il y a aussi un filtre de bruit facile à négliger : **un déplacement unitaire doit être ≥ 3 pixels pour compter dans le cumul**. Sans cela, le bruit sub-pixel du template matching s'accumule lentement, provoquant une « extraction fantôme » même sur un écran immobile. J'ai passé un après-midi entier à traquer ce bug.

### Deux passes en pratique

**Passe 1 — analyse de mouvement basse résolution.** Les frames sont sous-échantillonnés 3× (1080p → 360p, un ordre de grandeur de vitesse en plus), et un template matching léger suit le déplacement vertical frame par frame. Plusieurs détails d'ingénierie se cachent ici :

- **Pas adaptatif** : quand le déplacement est grand, grands sauts (`nativeFPS / 6`, environ toutes les 10 images). Quand il est petit, retour au scan frame par frame (`nativeFPS / 30`). Quand la distance restante passe sous 25 % du seuil, pas minimum forcé — sinon on enjambe littéralement un frame
- **Détection de changement de scène** : le SAD par pixel entre images adjacentes dépasse 40,0 ? L'utilisateur a probablement changé d'app. Capturer immédiatement
- **Troncature par rebond** : utiliser le flux optique de Vision pour détecter la direction du mouvement. Si le déplacement cumulé tombe sous -50 px (l'utilisateur remonte), il a atteint le haut — jeter tous les frames suivants. Mais ce seuil ne peut pas être trop serré : j'avais mis -10 au départ, et de légers tremblements de doigt déclenchaient la troncature, coupant l'enregistrement en deux

**Passe 1,5 — raffinement de netteté.** Pour chaque frame candidat, chercher le plus net dans une fenêtre de ±2 images autour.

Comment quantifier la netteté ? J'utilise l'**énergie laplacienne** — convolution de l'image en niveaux de gris avec un noyau 3×3, puis moyenne des réponses au carré :

```
kernel = [-1, -1, -1,
          -1,  8, -1,
          -1, -1, -1]

sharpness = mean((convolve(gray, kernel) - 128)²)
```

Le décalage de 128 vient du biais de sortie de convolution (exigence vImage). Le carré et la moyenne donnent l'énergie haute fréquence. Valeur plus élevée = frame plus net.

Pourquoi l'énergie laplacienne plutôt que la variance ? Pour les captures d'écran, les deux méthodes sélectionnent des images quasi identiques, mais la première est computationnellement plus simple — `vDSP_vsq` + `vDSP_meanv` de vImage, deux lignes.

La limite de résolution est 720×1280, ce qui suffit. La raison est pratique : le frame le plus net est l'instant où l'utilisateur lève le doigt ; les frames pendant le swipe ont souvent du flou de mouvement. L'énergie laplacienne y est très sensible — la différence est généralement de 2–3×.

---

## L'algorithme central : moteur de template matching

C'est la plus grosse partie de l'engine en volume de code (plus de 3 000 lignes dans un seul fichier), et celle qui m'a torturé le plus longtemps avec des bugs.

### Matching inversé : pourquoi chercher l'ancien depuis le nouveau ?

Ma première version utilisait le « matching direct » — template en bas de l'ancien frame, recherche dans le nouveau. Ça a planté sur les écrans WhatsApp : le bas de l'ancien montrait un « OK », le nouveau en avait trois. Le matching s'est accroché au plus haut, et l'offset était faux de 200 pixels.

Puis j'ai inversé l'approche : **Reverse Matching**. Prendre le template en **haut** du nouveau frame (img2) et chercher en **bas** de l'ancien frame (img1).

Pourquoi l'inverse est meilleur ? Le haut du nouveau frame est du « contenu fraîchement scrollé » — ce contenu existe forcément dans l'ancien frame, et **une seule fois** (dans la partie médio-inférieure). À l'inverse, le « contenu ancien en voie de disparition » en bas de l'ancien frame peut à peine apparaître dans le nouveau, ou avoir déjà été poussé hors écran.

![Diagramme de matching inversé](/scrollshot_video_to_long_screenshot_algo.webp)

La recherche saute automatiquement la zone de barre d'état (environ 250 px en haut) et la zone de tab bar (environ 350 px en bas). Mais voilà un autre piège — certaines apps ont des barres de navigation de hauteurs variables, certaines pages ont un clavier, d'autres des boutons flottants.

J'ai donc ajouté une **détection dynamique de footer**. Voici comment : scanner du bas vers le haut ligne par ligne, prendre les 80 % centraux de chaque ligne (rogner 10 % de chaque côté pour éviter les boutons flottants), échantillonner tous les 16 pixels, calculer la MAD (différence absolue moyenne) entre la même ligne des deux frames. MAD ≤ 3,2 signifie que la ligne est quasi identique — probablement un élément UI statique. Arrêter après 4+ lignes consécutives non-statiques (`maxGapTolerance = 4`). Moins de 24 lignes statiques au total → pas de barre fixe, retourner 0.

Le seuil 3,2 est empirique. Une zone statique à fond blanc a une MAD de 0–1,5. Le bruit de compression JPEG fluctue entre 2–4. Les lignes avec un vrai changement de contenu sont à au moins 8. 3,2 se situe pile dans l'interstice — tolère le bruit de compression mais rejette les changements de contenu.

### 6 templates votent contre « ils se ressemblent tous »

Un seul bloc de template est facile à mal matcher. Imaginez une page de liste produits e-commerce — chaque carte produit a quasiment le même layout, un template peut matcher le produit précédent ou suivant.

Le moteur extrait **6 blocs de template** simultanément (chacun 100 px de haut, espacés depuis le haut du nouveau frame), cherche indépendamment la meilleure position dans l'ancien frame, et produit 6 valeurs d'offset. Puis il **clusterise** ces 6 offsets (tolérance : 5 px) et prend la médiane du plus gros cluster.

Si 5 templates sur 6 pointent vers offset ≈ 320 et 1 vers 800, ce 800 est presque certainement un faux match — jeter.

Il y a aussi une optimisation d'arrêt précoce : si les 3 premiers templates sont déjà d'accord (tolérance : 4 px) et que l'offset n'est pas proche de 0 (exclusion du cas « l'utilisateur n'a pas scrollé »), les 3 restants sont inutiles.

Un détail qui m'a longtemps tourmenté : quelle tolérance ? J'avais mis 2 px, mais à cause de l'erreur de quantification du NCC (voir plus loin), les offsets de différents templates différaient souvent de 2–3 px, et l'arrêt précoce ne se déclenchait presque jamais. En passant à 4 px, environ 60 % des paires déclenchaient l'arrêt précoce en tests réels, sans perte de précision observable.

### NCC pyramidale : recherche du grossier au fin

Chaque matching utilise la **NCC (Normalized Cross-Correlation)** pour mesurer la similarité. La formule NCC :

$$\text{NCC}(T, I) = \frac{\sum(T_i - \bar{T})(I_i - \bar{I})}{\sqrt{\sum(T_i - \bar{T})^2 \cdot \sum(I_i - \bar{I})^2}}$$

L'avantage de la NCC est son insensibilité aux changements de luminosité (un enregistrement de jour et la même page en mode sombre matchent quand même). Plage [-1, 1], où 1 = correspondance parfaite. Intuitivement : la NCC ne compare pas les valeurs absolues des pixels mais si le « motif de variation clair-foncé » est le même.

Mais glisser pixel par pixel sur tout l'ancien frame est trop lent. Le moteur utilise une **recherche pyramidale à trois niveaux** :

| Niveau | Pas | Fenêtre | Candidats | Rôle |
|--------|-----|---------|-----------|------|
| Level 1 (Pre) | 12 px | Pleine plage | ~125 | Positionnement grossier |
| Level 2 (Coarse) | 4 px | ±32 px | ~16 | Précision à la ligne |
| Level 3 (Fine) | 1 px | ±4 px | 9 | Raffinement pixel |

Un chiffre à partager : le pas de 12 du Level 1 ne cherche que 1/12 des positions candidates, soit environ **12× plus rapide** par template. Le calcul total sur trois niveaux est environ 1/8 d'une recherche exhaustive.

Au-delà de 64 candidats (typique au Level 1), le calcul parallèle GCD s'active automatiquement (`DispatchQueue.concurrentPerform`), distribuant la recherche sur plusieurs cœurs CPU. J'ai rencontré un écueil : j'utilisais `NSLock` pour protéger une variable `bestScore` partagée, mais la contention sur 6 cœurs ralentissait tout. Passer à des meilleurs locaux par thread avec fusion finale a réduit la contention de O(n) à O(1).

### Fenêtre de recherche : laissez l'historique vous guider

Chercher dans toute la zone utilisable de l'ancien frame est à la fois lent et sujet aux faux matchs (le haut et le bas d'une page peuvent avoir des layouts similaires).

Le moteur utilise deux « priors » pour rétrécir la fenêtre :

- **Prior temporel** : si l'offset de la paire précédente était de 300 px, celle-ci est probablement similaire. Fenêtre réduite à 300 ± 120 px
- **Prior Vision** : pour la première paire sans historique, l'API de recalage d'Apple Vision donne une estimation grossière. Fenêtre à estimation ± 180 px

Si la fenêtre étroite ne trouve pas au moins 3 matchs cohérents (le prior était faux), retour automatique à la recherche pleine plage.

La condition « au moins 3 cohérents » a aussi été durement apprise. J'avais mis « au moins 1 », mais quand le prior Vision était fortement faux (parfois 500 px d'erreur), un faux match dans la fenêtre étroite passait par hasard comme valide. Avec 3, un faux match doit tromper 3 templates indépendants simultanément — statistiquement quasi impossible.

### Quand le matching normal échoue : fallback à trois niveaux

Les scénarios réels sont bien plus rudes qu'en labo. Boutons flottants, overlays semi-transparents, vidéos en lecture, curseurs clignotants — tout cela tire les scores NCC vers le bas.

Le moteur implémente une stratégie de fallback à trois niveaux, avec données réelles de fréquence :

> **Niveau 1 : Match fort (~80 % des paires).** La majorité des templates ont NCC ≥ 0,6 et convergent sur le même offset. Le cas le plus fréquent.
>
> **Niveau 2 : Match doux (~12 % des paires).** Le meilleur template n'a que 0,45–0,6 de NCC — peut-être un élément UI flottant a partiellement masqué la zone. Le SAD de toute la zone de chevauchement sert de vérification secondaire. SAD par pixel ≤ 26,0 → accepté ; sinon rejeté.
>
> **Niveau 3 : NCC profil 1D (~5 % des paires).** « Aplatir » l'image 2D en une courbe de moyennes par ligne — un tableau 1D. Intercorréler les deux courbes 1D. Environ 100× plus rapide, mais risque de faux positifs plus élevé.
>
> **Tout échoué (~3 % des paires) ?** Ce frame est probablement un changement de scène ou sans chevauchement. L'ajouter à la fin sans assemblage.

La vérification SAD du niveau 2 est nuancée. Le seuil de base est **25,0 par pixel**, mais quand le ratio de chevauchement dépasse 80 %, le seuil se resserre adaptativement :

```
if overlapRatio > 0,8:
    scale = max(minScale, 1,0 - (overlapRatio - 0,8) × 4,0)
    threshold = 25,0 × scale
```

Pourquoi resserrer ? Plus la zone de chevauchement est grande, plus le SAD a d'échantillons statistiques, le bruit aléatoire se moyenne — un faux match peut aussi avoir un SAD bas. Sans resserrement, les faux positifs augmentent en cas de fort chevauchement.

Quel que soit le chemin, il y a toujours un **raffinement d'offset** final : calculer le SAD pixel par pixel dans ±6 px autour de l'offset candidat et prendre le minimum.

Pourquoi l'offset NCC a-t-il encore besoin de raffinement ? Cela m'a pris trois jours pour comprendre. La NCC est très « plate » près de son optimum — 2 px de différence d'offset ne changent la NCC que de 0,003. Mais le SAD est extrêmement sensible aux déplacements de ±1 px — 1 px de différence fait varier le SAD de 3–5 unités. Les deux se complètent : NCC pour le positionnement grossier, SAD pour la calibration au pixel. Quand on assemble du texte, 2 px de différence, c'est « une ligne de texte coupée en deux » versus « parfaitement alignée ».

### Ligne de joint : ne coupez pas le texte en deux

Vous avez trouvé l'offset. Les deux frames ont une zone de chevauchement. Où « couper » ?

L'approche intuitive : couper au milieu. Mais si le milieu contient justement une grande ligne de texte, la moitié supérieure et la moitié inférieure ne s'alignent pas — l'œil le voit tout de suite.

L'approche du moteur : calculer la différence de pixels pour **chaque ligne** de la zone de chevauchement, puis utiliser une fenêtre glissante pour trouver la position de différence totale minimale. La hauteur de fenêtre est adaptative — `min(overlapH, max(100, adaptiveCutHeight))`. Cette position est là où le contenu des deux frames est le plus similaire — le joint y est le plus naturel visuellement.

---

## Benchmarks de performance

Test avec un enregistrement typique de 30 secondes de chat WhatsApp (iPhone 15 Pro, 1080×2400, 60 fps). Métriques clés :

| Métrique | Valeur |
|----------|--------|
| Total d'images | 1 800 |
| Temps d'analyse Passe 1 | 3,2 s |
| Images clés extraites | 26 |
| Raffinement Passe 1,5 | 0,8 s |
| Template matching total | 4,1 s (25 paires) |
| Matching moyen par paire | 164 ms |
| Taux d'arrêt précoce | 58 % (15/25) |
| Taux de match fort | 84 % (21/25) |
| Match doux déclenché | 3 paires |
| Fallback profil 1D | 1 paire |
| Tout échoué (ajouté) | 0 paire |
| Taille finale | 1 170 × 18 600 |
| Temps end-to-end | ~8,5 s |

L'accélération pyramidale est frappante : le pas de 12 du Level 1 saute 92 % des candidats, le Level 2 ne calcule que ~16 points dans une fenêtre de ±32 px, et le Level 3 n'affine que ±4 px. Le calcul effectif sur trois niveaux est environ **1/8** d'une recherche exhaustive.

---

## Les détails d'ingénierie qu'on ne peut pas ignorer

### Impossible de charger une image de 20 000 pixels d'un coup

Une image longue assemblée à partir de 30 frames peut faire 1 170 × 24 000 pixels. Le RGBA pleine résolution en mémoire prend **112 Mo** (1 170 × 24 000 × 4 octets) — trop pour un iPhone.

`StreamingStitchingPlanner` est conçu comme un pipeline en flux continu : pendant le matching, seules « l'image courante + la précédente » résident en mémoire. Les résultats sont enregistrés comme un ensemble d'objets `Piece` (index source + zone de recadrage + position cible). Le rendu final décode et dessine par tuiles.

### Algorithme de suppression de barre de défilement

L'image longue assemblée a presque toujours une barre de défilement résiduelle à droite. Le moteur utilise une **méthode de projection de gradient** pour l'éliminer :

Extraire une bande de 3 % de la largeur au bord droit → calculer le gradient horizontal cumulé → les bords gauche et droit de la barre forment deux **pics de gradient** (espacés de 3–20 px) → confirmer ligne par ligne la position réelle → écraser avec les pixels adjacents à gauche. Même logique pour les barres horizontales en bas.

### UI de secours quand l'algorithme échoue

Même le meilleur algorithme trébuche parfois. ScrollShot propose un **réglage interactif fin** sur chaque ligne de joint — l'utilisateur peut glisser vers le haut ou le bas pour ajuster la position d'assemblage avec un aperçu en temps réel. Le `FineTuneGeometryEngine` garantit que les contraintes géométriques restent toujours valides. L'aperçu rend en basse résolution pour la vitesse ; l'export repasse automatiquement en pleine résolution. Cette contrôlabilité est aussi l'une des interactions clés du <a href="/fr/blog/pourquoi-choisir-scrollshot-captures-longues-ios/">mode Manual Stitch</a>.

---

## Un dernier mot

Le plus grand enseignement de ce moteur : **l'algorithme d'assemblage n'est pas difficile en soi. Ce qui est difficile, c'est de le faire fonctionner sur toutes les pages « déraisonnables » du monde réel.**

Les fonds de chat WhatsApp se ressemblent tous, les listes de produits Amazon se répètent à l'infini, les Réglages iOS ont de vastes zones blanches, les miniatures YouTube bougent… chacun est un cas limite qu'aucun manuel n'enseigne et qu'aucun article ne décrit.

Un bug m'a particulièrement marqué : lors de l'enregistrement des Réglages iOS, l'offset NCC était systématiquement faux d'environ 40 px. Après un long debugging, j'ai découvert que le haut de la page avait une grande zone blanche. Quand le template tombe sur du blanc pur, la NCC donne près de 1,0 à n'importe quelle position blanche — impossible de les distinguer. Solution : détecter quand la variance du template est trop basse et le sauter automatiquement — un template blanc pur ne porte aucune information, mieux vaut ne pas l'utiliser.

Une autre fois, encore plus absurde : en enregistrant la page d'accueil YouTube, une miniature vidéo montrait un chat qui bougeait. La zone miniature était complètement différente entre deux frames, faisant chuter la NCC à 0,3. Aucun algorithme seul ne pouvait sauver ça. C'est le mécanisme de vote à 6 templates qui a sauvé la mise — les 5 autres templates échantillonnaient des zones statiques, et le vote est resté correct.

Résoudre ces problèmes ne vient pas de mathématiques plus élégantes. Ça vient d'une astuce d'ingénierie « on fait comme ça pour l'instant » après l'autre. Si vous travaillez sur quelque chose de similaire, j'espère que cet article vous aidera à éviter quelques-uns de ces pièges.

---

## Pour aller plus loin

- <a href="/fr/blog/pourquoi-choisir-scrollshot-captures-longues-ios/">Pourquoi choisir ScrollShot ? La solution iOS pour des captures longues nettes</a> — Un regard produit sur la façon dont ScrollShot résout les douleurs des captures longues iOS : assemblage automatique, manuel, confidentialité et export haute qualité.
