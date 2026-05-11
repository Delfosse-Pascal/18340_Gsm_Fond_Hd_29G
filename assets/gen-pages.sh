#!/usr/bin/env bash
# Génère un index.html dans chaque tiroir + dans Musique/
# Usage : bash assets/gen-pages.sh
set -euo pipefail
cd "$(dirname "$0")/.."

LAYOUTS=("layout-fan" "layout-stripes" "layout-geo" "layout-diamond" "layout-leaf" "layout-square")

drawer_page() {
  local idx=$1
  local n
  n=$(printf "%04d" "$idx")
  local start end count
  start=$((idx * 500 + 1))
  if [ "$idx" -eq 36 ]; then
    end=18340
  else
    end=$(((idx + 1) * 500))
  fi
  count=$((end - start + 1))
  local layout="${LAYOUTS[$((idx % 6))]}"
  local file="Gsm_Fond_${n}/index.html"

  # liste JSON des images
  local items=""
  for ((k=start; k<=end; k++)); do
    local kk
    kk=$(printf "%05d" "$k")
    items+="{src:'${kk}_Gsm_Fond_Hd.jpg',name:'${kk}'},"
  done

  cat > "$file" <<HTML
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tiroir ${n} — Fonds GSM</title>

  <link rel="canonical" href="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/">
  <link rel="icon" href="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/favicondepascal.png" type="image/png">
  <link rel="icon" href="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/favicondepascal.ico" type="image/x-icon">
  <link rel="stylesheet" type="text/css" href="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/style.css">
  <script src="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/script.js"></script>
  <script src="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/menu.js" defer></script>
  <link rel="stylesheet" href="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/basedusite.css">

  <link rel="stylesheet" href="../assets/style.css">
  <script src="../assets/app.js" defer></script>
</head>
<body class="${layout}">

  <div class="controls">
    <button class="btn btn-home" data-home="../index.html">⌂ Accueil</button>
    <button class="btn" data-theme-toggle>☾ sombre</button>
  </div>

  <div class="page-top">
    <nav class="social-menu">
      <ul>
        <li><a href="https://fr.pinterest.com/pascal509/mes-tableaux-tous-genre/" target="_blank" rel="noopener">Pinterest</a></li>
        <li><a href="https://www.flickr.com/photos/delfossepascal" target="_blank" rel="noopener">Flickr</a></li>
        <li><a href="https://www.tumblr.com/lestoilesdepascal" target="_blank" rel="noopener">Tumblr</a></li>
        <li><a href="https://x.com/PascalDelfossee" target="_blank" rel="noopener">X</a></li>
        <li><a href="https://www.youtube.com/c/DelfossePascal" target="_blank" rel="noopener">YouTube</a></li>
      </ul>
    </nav>
    <header>
      <div class="fan" aria-hidden="true"></div>
      <h1 class="calli">Tiroir ${n}</h1>
      <div class="gilded-line"></div>
    </header>
  </div>

  <main class="wrap fade-up">
    <section class="context">
      <p>Tiroir n°<strong>${idx}</strong> de la collection — il contient
      <strong>${count} images</strong> au format GSM HD (vertical mobile),
      indexées de <strong>${start}</strong> à <strong>${end}</strong>.
      Cliquez sur une miniature pour l'agrandir ; utilisez <kbd>←</kbd> / <kbd>→</kbd>
      pour naviguer, <kbd>Échap</kbd> pour fermer.</p>
    </section>

    <nav class="pager" id="navTopDrawers" aria-label="Tiroirs voisins">
      $( if [ "$idx" -gt 0 ]; then prev=$(printf "%04d" $((idx-1))); echo "<a class='btn' href='../Gsm_Fond_${prev}/index.html'>‹ Tiroir ${prev}</a>"; fi )
      <span class="btn" style="background:var(--accent); color:var(--c-ivoire);">Tiroir ${n}</span>
      $( if [ "$idx" -lt 36 ]; then next=$(printf "%04d" $((idx+1))); echo "<a class='btn' href='../Gsm_Fond_${next}/index.html'>Tiroir ${next} ›</a>"; fi )
    </nav>

    <div id="galleryMount"></div>
  </main>

  <footer>
    <span class="calli">✦</span>
    Tiroir ${n} · ${count} images · indices ${start}–${end}
  </footer>

  <script>
    (function () {
      const items = [${items}];
      function go() {
        if (typeof window.renderGallery === 'function') {
          window.renderGallery({ mountId: 'galleryMount', items: items, perPage: 50 });
        } else {
          setTimeout(go, 50);
        }
      }
      document.addEventListener('DOMContentLoaded', go);
    })();
  </script>
</body>
</html>
HTML
  echo "  $file ($count images)"
}

musique_page() {
  local items=""
  for f in Musique/*.mp3; do
    local b
    b=$(basename "$f")
    items+="{src:'${b}',name:'${b%.*}'},"
  done
  cat > Musique/index.html <<'HTML'
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Musique — Fonds GSM</title>

  <link rel="canonical" href="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/">
  <link rel="icon" href="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/favicondepascal.png" type="image/png">
  <link rel="icon" href="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/favicondepascal.ico" type="image/x-icon">
  <link rel="stylesheet" type="text/css" href="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/style.css">
  <script src="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/script.js"></script>
  <script src="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/menu.js" defer></script>
  <link rel="stylesheet" href="https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/basedusite.css">

  <link rel="stylesheet" href="../assets/style.css">
  <script src="../assets/app.js" defer></script>

  <style>
    .playlist { display:grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 14px; }
    .track {
      background: var(--bg-2);
      border: 1px solid var(--or);
      border-radius: 14px;
      padding: 14px;
      transition: transform .3s ease;
    }
    .track:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(1,106,76,0.25); }
    .track h3 {
      margin: 0 0 8px;
      font-family: var(--font-calli);
      color: var(--accent);
      font-size: 1.5rem;
      text-align: center;
    }
    .track audio { width: 100%; }
  </style>
</head>
<body class="layout-stripes">

  <div class="controls">
    <button class="btn btn-home" data-home="../index.html">⌂ Accueil</button>
    <button class="btn" data-theme-toggle>☾ sombre</button>
  </div>

  <div class="page-top">
    <nav class="social-menu">
      <ul>
        <li><a href="https://fr.pinterest.com/pascal509/mes-tableaux-tous-genre/" target="_blank" rel="noopener">Pinterest</a></li>
        <li><a href="https://www.flickr.com/photos/delfossepascal" target="_blank" rel="noopener">Flickr</a></li>
        <li><a href="https://www.tumblr.com/lestoilesdepascal" target="_blank" rel="noopener">Tumblr</a></li>
        <li><a href="https://x.com/PascalDelfossee" target="_blank" rel="noopener">X</a></li>
        <li><a href="https://www.youtube.com/c/DelfossePascal" target="_blank" rel="noopener">YouTube</a></li>
      </ul>
    </nav>
    <header>
      <div class="fan" aria-hidden="true"></div>
      <h1 class="calli">Ambiance musicale</h1>
      <div class="gilded-line"></div>
    </header>
  </div>

  <main class="wrap fade-up">
    <section class="context">
      <p>Sept pistes d'<strong>ambiance sonore</strong> accompagnent la collection.
      Choisissez-en une pour l'écouter ici, ou utilisez le <em>bouton rouge</em>
      de la page d'accueil pour qu'elle continue de jouer pendant que vous
      parcourez les tiroirs.</p>
    </section>

    <div class="playlist" id="playlist"></div>
  </main>

  <footer><span class="calli">✦</span> 7 pistes · MP3 local</footer>

  <script>
    const tracks = ['00','01','02','03','04','05','06'];
    const mount = document.getElementById('playlist');
    tracks.forEach(t => {
      const div = document.createElement('div');
      div.className = 'track';
      div.innerHTML = `
        <h3>Piste ${t}</h3>
        <audio controls preload="none" src="${t}.mp3"></audio>
      `;
      mount.appendChild(div);
    });
  </script>
</body>
</html>
HTML
  echo "  Musique/index.html"
}

echo "Génération des pages tiroirs..."
for i in $(seq 0 36); do
  drawer_page "$i"
done

echo "Génération de la page Musique..."
musique_page

echo "Terminé."
