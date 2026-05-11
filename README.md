# 18340_Gsm_Fond_Hd_29G

Collection organisée de **18 340 fonds d'écran HD au format GSM (vertical mobile)**, répartis sur **29 Go** et classés en **37 tiroirs** de 500 images chacun (numérotés `Gsm_Fond_0000` → `Gsm_Fond_0036`).

> Ce dépôt ne contient que la **structure des tiroirs** et les **scripts utilitaires**. Les médias (images, audio, vidéo, PDF, archives) sont volontairement exclus du versionnage — voir [`.gitignore`](.gitignore).

---

## Sommaire

- [Structure du dépôt](#structure-du-dépôt)
- [Convention de nommage](#convention-de-nommage)
- [Script de classement automatique](#script-de-classement-automatique)
- [Fichiers exclus du dépôt](#fichiers-exclus-du-dépôt)
- [Utilisation locale](#utilisation-locale)
- [Statistiques](#statistiques)
- [Licence](#licence)

---

## Structure du dépôt

```
18340_Gsm_Fond_Hd_29G/
├── Gsm_Fond_0000/          ← Tiroir 0  : images 00001 → 00500
├── Gsm_Fond_0001/          ← Tiroir 1  : images 00501 → 01000
├── Gsm_Fond_0002/          ← Tiroir 2  : images 01001 → 01500
│   ...
├── Gsm_Fond_0035/          ← Tiroir 35 : images 17501 → 18000
├── Gsm_Fond_0036/          ← Tiroir 36 : images 18001 → 18340
│   └── rangement -par 250 UNIVERSELLE .bat   (script de classement)
│
├── .gitignore              ← règles d'exclusion (médias)
└── README.md               ← ce fichier
```

- **37 tiroirs** au total (`Gsm_Fond_0000` à `Gsm_Fond_0036`).
- **500 fichiers** par tiroir (le dernier tiroir en contient 340).
- Chaque tiroir contient un `.gitkeep` pour préserver la structure dans Git.

---

## Convention de nommage

| Élément  | Format                  | Exemple                 |
| -------- | ----------------------- | ----------------------- |
| Tiroir   | `Gsm_Fond_XXXX`         | `Gsm_Fond_0017`         |
| Image    | `NNNNN_Gsm_Fond_Hd.jpg` | `08743_Gsm_Fond_Hd.jpg` |
| Format   | JPG, orientation GSM    | 1080 × 1920 (portrait)  |

L'index `NNNNN` est continu de `00001` à `18340` à travers tous les tiroirs.

---

## Script de classement automatique

Le fichier `rangement -par 250 UNIVERSELLE .bat` est un script Windows (`cmd`) générique permettant de :

- parcourir un dossier de fichiers en vrac ;
- créer automatiquement des tiroirs numérotés (`0000`, `0001`, …) ;
- déplacer les fichiers par lots configurables (`NB_PAR_TIROIR`, `MAX_TIROIRS`).

### Paramètres principaux

```bat
set "NB_PAR_TIROIR=500"      :: nombre de fichiers par tiroir
set "MAX_TIROIRS=19000"      :: nombre maximum de tiroirs
```

### Utilisation

1. Copier le `.bat` à côté des fichiers à classer.
2. Double-cliquer ou exécuter `cmd /c "rangement -par 250 UNIVERSELLE .bat"`.
3. Les tiroirs sont créés et remplis automatiquement.

---

## Fichiers exclus du dépôt

Pour garder le dépôt léger et focalisé sur la structure, les types suivants sont ignorés :

| Catégorie | Extensions                                                        |
| --------- | ----------------------------------------------------------------- |
| Images    | `jpg`, `jpeg`, `png`, `gif`, `bmp`, `tif`, `webp`, `svg`, `psd`, … |
| PDF       | `pdf`                                                             |
| Vidéos    | `mp4`, `mkv`, `avi`, `mov`, `webm`, `m4v`, …                      |
| Audio     | `mp3`, `wav`, `flac`, `ogg`, `aac`, `m4a`, …                      |
| Archives  | `zip`, `rar`, `7z`, `tar`, `gz`, `iso`, …                         |
| Dossiers  | `Musique/`                                                        |

Voir [`.gitignore`](.gitignore) pour la liste complète.

---

## Utilisation locale

### Cloner le dépôt

```bash
git clone https://github.com/Delfosse-Pascal/18340_Gsm_Fond_Hd_29G.git
cd 18340_Gsm_Fond_Hd_29G
```

Vous obtenez la structure vide des 37 tiroirs.

### Remplir les tiroirs

1. Placer toutes les images en vrac à la racine.
2. Exécuter le `.bat` de classement (ou trier manuellement).
3. Les 18 340 fichiers se répartissent dans les tiroirs `Gsm_Fond_0000` → `0036`.

---

## Statistiques

| Métrique             | Valeur     |
| -------------------- | ---------- |
| Nombre d'images      | **18 340** |
| Nombre de tiroirs    | **37**     |
| Images par tiroir    | 500        |
| Volume total estimé  | **~29 Go** |
| Format               | JPG HD GSM |

---

## Licence

Dépôt personnel — © Pascal Delfosse. Tous droits réservés sauf mention contraire.
