/* ============================================================
   18340_Gsm_Fond_Hd_29G — JS partagé
   - bascule clair / sombre (persistance localStorage)
   - bouton retour accueil (gère iframe et autonome)
   - lightbox d'images (ESC ferme, flèches naviguent)
   - audio persistant côté parent (hub)
   - injection du header / favicon de secours
   ============================================================ */

(function () {
  'use strict';

  // -------- thème --------
  const THEME_KEY = 'gsm-theme';
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) btn.textContent = t === 'dark' ? '☀ clair' : '☾ sombre';
  }
  function initTheme() {
    let t = 'light';
    try { t = localStorage.getItem(THEME_KEY) || 'light'; } catch (e) {}
    applyTheme(t);
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      btn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
      });
    }
  }

  // -------- retour accueil (iframe-aware) --------
  function initHomeBtn() {
    document.querySelectorAll('[data-home]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.top !== window.self) {
          try { window.parent.postMessage({ type: 'close-overlay' }, '*'); return; } catch (err) {}
        }
        const href = btn.getAttribute('data-home') || '../index.html';
        window.location.href = href;
      });
    });
  }

  // -------- lightbox d'images --------
  let lbState = { items: [], index: 0 };
  function buildLightbox() {
    if (document.querySelector('.lightbox')) return;
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lb-close" aria-label="Fermer">×</button>
      <button class="lb-nav lb-prev" aria-label="Précédent">‹</button>
      <button class="lb-nav lb-next" aria-label="Suivant">›</button>
      <img alt="" />
      <div class="lb-info"></div>
    `;
    document.body.appendChild(lb);
    lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lb-prev').addEventListener('click', () => navLightbox(-1));
    lb.querySelector('.lb-next').addEventListener('click', () => navLightbox(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  }
  function openLightbox(items, index) {
    buildLightbox();
    lbState.items = items;
    lbState.index = index;
    renderLightbox();
    document.querySelector('.lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    const lb = document.querySelector('.lightbox');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function navLightbox(d) {
    if (!lbState.items.length) return;
    lbState.index = (lbState.index + d + lbState.items.length) % lbState.items.length;
    renderLightbox();
  }
  function renderLightbox() {
    const it = lbState.items[lbState.index];
    if (!it) return;
    const lb = document.querySelector('.lightbox');
    const img = lb.querySelector('img');
    const info = lb.querySelector('.lb-info');
    info.textContent = it.name + ' — ' + (lbState.index + 1) + ' / ' + lbState.items.length;
    img.onload = function () {
      let extra = ` — ${img.naturalWidth}×${img.naturalHeight}px`;
      tryFileSize(it.src).then(sz => {
        info.textContent = it.name + ' — ' + (lbState.index + 1) + ' / ' + lbState.items.length + extra + (sz ? ` — ${sz}` : '');
      }).catch(() => {
        info.textContent = it.name + ' — ' + (lbState.index + 1) + ' / ' + lbState.items.length + extra;
      });
    };
    img.src = it.src;
  }
  document.addEventListener('keydown', (e) => {
    const lb = document.querySelector('.lightbox');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  // -------- récup taille fichier (best-effort, file:// peut bloquer) --------
  function tryFileSize(url) {
    return new Promise((resolve) => {
      try {
        fetch(url, { method: 'HEAD' }).then(r => {
          const cl = r.headers.get('content-length');
          if (cl) return resolve(humanSize(parseInt(cl, 10)));
          return fetch(url).then(r2 => r2.blob()).then(b => resolve(humanSize(b.size)));
        }).catch(() => {
          fetch(url).then(r => r.blob()).then(b => resolve(humanSize(b.size))).catch(() => resolve(null));
        });
      } catch (e) { resolve(null); }
    });
  }
  function humanSize(n) {
    if (!n && n !== 0) return null;
    const u = ['o','Ko','Mo','Go'];
    let i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return n.toFixed(n < 10 ? 1 : 0) + ' ' + u[i];
  }

  // -------- galerie (rend la grille à partir d'une liste) --------
  window.renderGallery = function (config) {
    const { mountId, items, perPage = 50 } = config;
    const mount = document.getElementById(mountId);
    if (!mount) return;
    let page = 0;
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));

    const grid = document.createElement('div');
    grid.className = 'gallery';
    const pager = document.createElement('div');
    pager.className = 'pager';

    function renderPage() {
      grid.innerHTML = '';
      const start = page * perPage;
      const slice = items.slice(start, start + perPage);
      slice.forEach((it, i) => {
        const fig = document.createElement('figure');
        fig.innerHTML = `
          <img loading="lazy" src="${it.src}" alt="${it.name}">
          <figcaption>
            <span class="name">${it.name}</span>
            <span class="meta" data-meta>chargement…</span>
          </figcaption>`;
        const img = fig.querySelector('img');
        const meta = fig.querySelector('[data-meta]');
        img.addEventListener('load', () => {
          let txt = `${img.naturalWidth}×${img.naturalHeight}px`;
          tryFileSize(it.src).then(sz => { meta.textContent = txt + (sz ? ' — ' + sz : ''); })
            .catch(() => { meta.textContent = txt; });
        });
        img.addEventListener('error', () => { meta.textContent = 'fichier introuvable'; img.style.opacity = '0.3'; });
        fig.addEventListener('click', () => openLightbox(slice, i));
        grid.appendChild(fig);
      });
      renderPager();
      window.scrollTo({ top: mount.offsetTop - 20, behavior: 'smooth' });
    }
    function renderPager() {
      pager.innerHTML = '';
      const mkBtn = (label, p, opts={}) => {
        const b = document.createElement('button');
        b.textContent = label;
        if (opts.active) b.classList.add('active');
        if (opts.disabled) b.disabled = true;
        b.addEventListener('click', () => { page = p; renderPage(); });
        return b;
      };
      pager.appendChild(mkBtn('‹ préc.', Math.max(0, page - 1), { disabled: page === 0 }));
      const win = 5;
      let s = Math.max(0, page - win);
      let e = Math.min(totalPages, s + win * 2 + 1);
      s = Math.max(0, e - win * 2 - 1);
      if (s > 0) pager.appendChild(mkBtn('1', 0));
      if (s > 1) { const sp = document.createElement('span'); sp.textContent = '…'; sp.style.padding='6px'; pager.appendChild(sp); }
      for (let i = s; i < e; i++) pager.appendChild(mkBtn(String(i + 1), i, { active: i === page }));
      if (e < totalPages - 1) { const sp = document.createElement('span'); sp.textContent = '…'; sp.style.padding='6px'; pager.appendChild(sp); }
      if (e < totalPages) pager.appendChild(mkBtn(String(totalPages), totalPages - 1));
      pager.appendChild(mkBtn('suiv. ›', Math.min(totalPages - 1, page + 1), { disabled: page === totalPages - 1 }));
    }

    mount.innerHTML = '';
    mount.appendChild(pager.cloneNode(false));
    mount.appendChild(grid);
    mount.appendChild(pager);
    renderPage();
  };

  // -------- header / menu social par défaut (si vide) --------
  function injectHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    if (header.innerHTML.trim() !== '') return;
    header.innerHTML = `
      <div class="fan" aria-hidden="true"></div>
      <h1 class="calli" data-page-title>18 340 Fonds GSM</h1>
      <div class="gilded-line" aria-hidden="true"></div>
    `;
  }

  // -------- audio persistant (hub) + écoute messages iframe --------
  function initHubAudio() {
    const btn = document.getElementById('musicBtn');
    const panel = document.getElementById('musicPanel');
    const audio = document.getElementById('hubAudio');
    const sel = document.getElementById('musicSelect');
    if (!btn || !audio) return;

    btn.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    if (sel) {
      sel.addEventListener('change', () => {
        audio.src = sel.value;
        audio.play().catch(() => {});
      });
    }

    audio.addEventListener('play',  () => btn.classList.add('playing'));
    audio.addEventListener('pause', () => btn.classList.remove('playing'));
    audio.addEventListener('ended', () => {
      if (!sel) return;
      const idx = [...sel.options].findIndex(o => o.value === sel.value);
      const next = sel.options[(idx + 1) % sel.options.length];
      if (next) { sel.value = next.value; audio.src = next.value; audio.play().catch(() => {}); }
    });
  }

  function initOverlay() {
    const overlay = document.getElementById('frameOverlay');
    if (!overlay) return;
    const iframe = overlay.querySelector('iframe');
    const close = overlay.querySelector('.fo-close');
    document.querySelectorAll('[data-frame-src]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        iframe.src = el.getAttribute('data-frame-src');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeIt() {
      overlay.classList.remove('open');
      iframe.src = 'about:blank';
      document.body.style.overflow = '';
    }
    if (close) close.addEventListener('click', closeIt);
    window.addEventListener('message', (ev) => {
      if (ev.data && ev.data.type === 'close-overlay') closeIt();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeIt();
    });
  }

  // -------- init --------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    injectHeader();
    initHomeBtn();
    initHubAudio();
    initOverlay();
    buildLightbox();
  });
})();
