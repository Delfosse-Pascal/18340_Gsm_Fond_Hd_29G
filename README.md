# 18340_Gsm_Fond_Hd_29G

> Collection privée de **18 340 fonds d'écran HD au format GSM (vertical mobile)**,
> classés en **37 tiroirs** de 500 images, accompagnés d'une **ambiance sonore**
> de 7 pistes et d'un **site local** prêt à parcourir hors-ligne.

---

## Table des matières

- [1. Présentation](#1-présentation)
- [2. Structure du dépôt](#2-structure-du-dépôt)
- [3. Convention de nommage des fichiers](#3-convention-de-nommage-des-fichiers)
- [4. Le site local (`index.html`)](#4-le-site-local-indexhtml)
  - [4.1 Page d'accueil (racine)](#41-page-daccueil-racine)
  - [4.2 Pages de tiroirs](#42-pages-de-tiroirs)
  - [4.3 Page musique](#43-page-musique)
  - [4.4 Lecteur audio persistant](#44-lecteur-audio-persistant)
- [5. Fichiers exclus du dépôt](#5-fichiers-exclus-du-dépôt)
- [6. Utilisation](#6-utilisation)
- [7. Script de classement (`.bat`)](#7-script-de-classement-bat)
- [8. Statistiques](#8-statistiques)
- [9. Crédits & licence](#9-crédits--licence)

---

## 1. Présentation

Ce dépôt contient **uniquement la structure et la couche de présentation**
(HTML, CSS, JavaScript, scripts utilitaires) — les médias eux-mêmes
(JPG, MP3, etc.) sont **conservés sur le disque local** mais **exclus de Git**
afin de garder le dépôt léger (~quelques centaines de Ko au lieu de ~29 Go).

Le site local fonctionne **100 % hors-ligne** :
les liens externes (favicon, CSS partagés, menus sociaux distants) sont
inclus comme **enrichissement optionnel** ; si Internet est absent, le site
reste pleinement fonctionnel grâce aux fichiers locaux (`assets/style.css`
et `assets/app.js`).

---

## 2. Structure du dépôt

Profondeur maximale versionnée : **1 niveau** dans chaque tiroir.

```
18340_Gsm_Fond_Hd_29G/
│
├── index.html                   ← page d'accueil (hub)
├── README.md                    ← ce fichier
├── .gitignore                   ← règles d'exclusion
│
├── assets/                      ← ressources partagées
│   ├── style.css                ← thème + palette + motifs
│   ├── app.js                   ← logique commune (lightbox, thème, audio)
│   └── gen-pages.sh             ← générateur des pages tiroirs
│
├── Gsm_Fond_0000/               ← tiroir 0 (indices 00001 → 00500)
│   ├── index.html               ← galerie paginée du tiroir
│   └── .gitkeep                 ← maintient le dossier dans Git
│
├── Gsm_Fond_0001/               ← tiroir 1 (indices 00501 → 01000)
│   ├── index.html
│   └── .gitkeep
│
│   ... (35 autres tiroirs)
│
├── Gsm_Fond_0036/               ← tiroir 36 (indices 18001 → 18340, 340 img)
│   ├── index.html
│   ├── .gitkeep
│   ├── *.js                     ← jQuery cookie (issu d'un viewer hérité)
│   └── rangement -par 250 UNIVERSELLE .bat   ← script de classement
│
└── Musique/                     ← ambiance sonore
    ├── index.html               ← playlist (les MP3 ne sont pas versionnés)
    └── .gitkeep                 (implicite — index.html suffit)
```

> **Note importante** : les fichiers `.jpg` (images des tiroirs) et `.mp3`
> (pistes audio) existent **uniquement sur le disque local d'origine**.
> Lors d'un `git clone`, on récupère le **squelette HTML/CSS/JS** ;
> les médias sont à fournir séparément (sauvegarde externe, NAS, etc.).

---

## 3. Convention de nommage des fichiers

| Élément  | Format                  | Exemple                 |
| -------- | ----------------------- | ----------------------- |
| Tiroir   | `Gsm_Fond_XXXX`         | `Gsm_Fond_0017`         |
| Image    | `NNNNN_Gsm_Fond_Hd.jpg` | `08743_Gsm_Fond_Hd.jpg` |
| Format   | JPG portrait            | proche de 1080 × 1920   |
| Audio    | `NN.mp3`                | `03.mp3`                |

- **`XXXX`** : index du tiroir, sur 4 chiffres (`0000` → `0036`).
- **`NNNNN`** : index continu de l'image, sur 5 chiffres (`00001` → `18340`).
- Répartition : `tiroir N = images N*500+1 → (N+1)*500`. Le tiroir 36 s'arrête à 18 340 (340 images).

---

## 4. Le site local (`index.html`)

### 4.1 Page d'accueil (racine)

Fichier : [`index.html`](index.html)

C'est le **hub** : point d'entrée unique du site.

- **Menus en haut, centrés** : menu social (Pinterest, Flickr, Tumblr, X, YouTube) puis en-tête calligraphique.
- **Grille de tuiles** vers chacun des 37 tiroirs + la playlist musique.
  - Formes **variées** par rotation : ronde, carrée, pilule, feuille, losange, rectangulaire.
  - Numéro + plage d'indices affichés sur chaque tuile.
- **Bouton musique rouge** flottant en bas à gauche (pas d'auto-play — il faut cliquer).
- **Overlay iframe** : un clic sur une tuile ouvre la page du tiroir **par-dessus** la page d'accueil → la musique continue de jouer.
- Bascule **clair / sombre** en haut à droite (persistance via `localStorage`).
- **Touche Échap** ferme l'overlay et la lightbox.

### 4.2 Pages de tiroirs

Fichier : `Gsm_Fond_XXXX/index.html` (37 occurrences)

- **Galerie paginée côté JS** : 50 miniatures par page, navigation `‹ préc.` / page / `suiv. ›`.
- **Sous chaque miniature** : nom du fichier + dimensions (`largeur × hauteur`) + taille en octets/Ko/Mo *(quand le navigateur l'autorise sur `file://`)*.
- **Clic miniature → lightbox** plein écran avec :
  - flèches `←` / `→` pour image précédente / suivante,
  - `Échap` pour fermer,
  - dimensions + taille affichées en bas.
- **Bouton « ⌂ Accueil »** intelligent :
  - depuis l'iframe du hub → ferme simplement l'overlay (la musique continue),
  - depuis un accès direct → revient vers `../index.html`.
- **Navigation entre tiroirs voisins** (boutons `‹ Tiroir précédent` / `Tiroir suivant ›`).
- **6 variantes de mise en page** (`layout-fan`, `layout-stripes`, `layout-geo`, `layout-diamond`, `layout-leaf`, `layout-square`) → chaque tiroir a un rendu visuel légèrement différent.

### 4.3 Page musique

Fichier : [`Musique/index.html`](Musique/index.html)

- Liste des 7 pistes (`00.mp3` → `06.mp3`).
- Chaque piste a son propre lecteur HTML5 (`<audio controls>`).
- Cette page n'a **pas** de musique persistante : c'est le hub racine qui
  porte le lecteur global. Cette page sert d'archive et de prévisualisation.

### 4.4 Lecteur audio persistant

Le **bouton rouge** en bas à gauche de la page d'accueil :

- Pas de lecture automatique au chargement (respect des navigateurs).
- Clic → ouverture du panneau avec sélecteur de piste + lecteur `<audio>`.
- Une fois lancée, la lecture **continue** tant que la page d'accueil
  reste ouverte, **même en parcourant les tiroirs** (qui s'affichent
  dans une couche `iframe` sans recharger le hub).
- Enchaînement automatique : à la fin d'une piste, la suivante démarre.

---

## 5. Fichiers exclus du dépôt

Le fichier [`.gitignore`](.gitignore) ignore les types suivants :

| Catégorie         | Extensions concernées                                              |
| ----------------- | ------------------------------------------------------------------ |
| **Images**        | `.jpg .jpeg .png .gif .bmp .tif .webp .svg .ico .heic .psd` …      |
| **PDF**           | `.pdf`                                                             |
| **Vidéos**        | `.mp4 .mkv .avi .mov .wmv .webm .m4v .mpg .ts` …                   |
| **Audio**         | `.mp3 .wav .flac .ogg .aac .m4a .wma .opus .aiff`                  |
| **Archives**      | `.zip .rar .7z .tar .gz .tgz .bz2 .xz .iso .cab .arj`              |
| **Ebooks**        | `.epub .mobi .azw .azw3 .kfx .fb2 .lit .djvu .cbz .cbr .ibooks`    |
| **Système**       | `Thumbs.db Desktop.ini .DS_Store $RECYCLE.BIN/ *.lnk`              |
| **Éditeurs**      | `.vscode/ .idea/ *.swp *~`                                         |
| **Dossier audio** | `Musique/*` *(sauf `Musique/index.html`)*                          |

Le résultat : **seul le squelette du site** (HTML, CSS, JS, scripts utilitaires) est versionné. Les médias restent en local.

---

## 6. Utilisation

### 6.1 Cloner le dépôt

```bash
git clone https://github.com/Delfosse-Pascal/18340_Gsm_Fond_Hd_29G.git
cd 18340_Gsm_Fond_Hd_29G
```

Le dépôt cloné contient **uniquement le site** (~37 dossiers vides + HTML).

### 6.2 Restaurer les médias

Placer manuellement les fichiers sur le disque :

- les **18 340 JPG** dans leur tiroir respectif (`Gsm_Fond_XXXX/`),
- les **7 MP3** dans `Musique/`.

Si les médias sont en vrac, utiliser le script `.bat` (voir §7).

### 6.3 Ouvrir le site

Double-cliquer sur `index.html` à la racine. Le site s'ouvre dans le
navigateur par défaut. **Aucun serveur Web n'est requis** — le protocole
`file://` suffit.

> ⚠️ Certains navigateurs (Chrome notamment) restreignent l'accès aux
> métadonnées de fichiers locaux : la taille en octets peut alors
> s'afficher comme indisponible. Les dimensions des images, elles,
> sont toujours détectées.

### 6.4 Régénérer les pages

Si les contenus changent, relancer le générateur :

```bash
bash assets/gen-pages.sh
```

Cela réécrit tous les `Gsm_Fond_XXXX/index.html` et `Musique/index.html`
à partir des paramètres internes du script.

---

## 7. Script de classement (`.bat`)

Fichier : `Gsm_Fond_0036/rangement -par 250 UNIVERSELLE .bat`

Script Windows (`cmd`) **autonome** qui range automatiquement des
fichiers en vrac dans des sous-dossiers numérotés.

### Paramètres principaux

```bat
set "NB_PAR_TIROIR=500"      :: nombre de fichiers par tiroir
set "MAX_TIROIRS=19000"      :: nombre maximum de tiroirs
```

### Mode d'emploi

1. Copier le `.bat` à côté des fichiers à classer.
2. Double-cliquer dessus (ou `cmd /c "rangement -par 250 UNIVERSELLE .bat"`).
3. Les sous-dossiers `0000`, `0001`, … se créent automatiquement et reçoivent les fichiers par lots.

---

## 8. Statistiques

| Métrique                  | Valeur            |
| ------------------------- | ----------------- |
| Nombre total d'images     | **18 340**        |
| Nombre de tiroirs         | **37**            |
| Capacité par tiroir       | 500 (dernier 340) |
| Volume total des médias   | **~29 Go**        |
| Pistes audio              | **7**             |
| Pages HTML générées       | 1 (racine) + 37 (tiroirs) + 1 (musique) = **39** |
| Taille du dépôt (sans médias) | ~quelques centaines de Ko |

---

## 9. Crédits & licence

- **Auteur** : Pascal Delfosse — [github.com/Delfosse-Pascal](https://github.com/Delfosse-Pascal)
- **Présence en ligne** :
  - [Pinterest](https://fr.pinterest.com/pascal509/mes-tableaux-tous-genre/)
  - [Flickr](https://www.flickr.com/photos/delfossepascal)
  - [Tumblr](https://www.tumblr.com/lestoilesdepascal)
  - [X](https://x.com/PascalDelfossee)
  - [YouTube](https://www.youtube.com/c/DelfossePascal)
- **Statut** : dépôt personnel — © Pascal Delfosse, tous droits réservés sauf mention contraire.
