/* ─────────────────────────────────────────────────────────────
   Recadreur — outil de recadrage photo de l'admin
   Usage : Recadreur.open(source, { ratio:'boutique', nom:'miel.jpg' })
     source  : File (photo choisie) ou chemin/URL d'une photo déjà en ligne
     renvoie : Promise<File|null>  (null = annulé, rien ne change)
   Ce qui est dans le cadre = ce qui sera visible sur le site.
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var RATIOS = [
    { id: 'boutique', label: 'Boutique (4:3)',   r: 4 / 3 },
    { id: 'carre',    label: 'Carré',            r: 1 },
    { id: 'portrait', label: 'Portrait (3:4)',   r: 3 / 4 },
    { id: 'large',    label: 'Large (16:9)',     r: 16 / 9 },
    { id: 'origine',  label: 'Format d\'origine', r: 0 }
  ];
  var MAX_OUT = 1600;   // plus grand côté de la photo enregistrée (px)
  var ZOOM_MAX = 5;     // zoom maximum par rapport au cadrage « plein cadre »

  var CSS =
    '.rc-overlay{position:fixed;inset:0;z-index:10000;background:rgba(30,18,10,.72);display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:1.25rem .75rem;opacity:0;transition:opacity .2s ease-out}' +
    '.rc-overlay.rc-in{opacity:1}' +
    '.rc-box{background:var(--surface,#fff);color:var(--text,#2c1810);border-radius:12px;width:100%;max-width:600px;margin:auto;padding:1.25rem;box-shadow:0 24px 64px rgba(0,0,0,.35);transform:translateY(14px);transition:transform .45s cubic-bezier(.16,1,.3,1)}' +
    '.rc-in .rc-box{transform:none}' +
    '.rc-box h2{font-size:1.05rem;font-weight:600;margin:0 0 .35rem}' +
    '.rc-help{font-size:.82rem;color:var(--muted,#8b6e5a);margin:0 0 .85rem;line-height:1.45}' +
    '.rc-ratios{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.85rem}' +
    '.rc-ratio{padding:.38rem .7rem;border:1.5px solid var(--border,#e5ddd4);border-radius:50px;background:#fff;color:inherit;font:inherit;font-size:.8rem;cursor:pointer;transition:background .15s,border-color .15s,color .15s}' +
    '.rc-ratio:hover{border-color:var(--primary,#c4913a)}' +
    '.rc-ratio[aria-pressed="true"]{background:var(--primary,#c4913a);border-color:var(--primary,#c4913a);color:#fff}' +
    '.rc-stagewrap{display:flex;justify-content:center;background:#efe9e1;border-radius:8px;padding:.6rem}' +
    '.rc-stage{position:relative;overflow:hidden;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;border-radius:4px;box-shadow:0 0 0 2px var(--primary,#c4913a);' +
      'background-color:#fff;background-image:linear-gradient(45deg,#e9e4dc 25%,transparent 25%,transparent 75%,#e9e4dc 75%),linear-gradient(45deg,#e9e4dc 25%,transparent 25%,transparent 75%,#e9e4dc 75%);background-size:16px 16px;background-position:0 0,8px 8px}' +
    '.rc-stage.rc-drag{cursor:grabbing}' +
    '.rc-stage img{position:absolute;top:0;left:0;max-width:none;transform-origin:0 0;will-change:transform;pointer-events:none;-webkit-user-drag:none}' +
    '.rc-grid{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .2s;' +
      'background-image:linear-gradient(to right,transparent calc(33.33% - 1px),rgba(255,255,255,.75) 33.33%,transparent calc(33.33% + 1px),transparent calc(66.66% - 1px),rgba(255,255,255,.75) 66.66%,transparent calc(66.66% + 1px)),' +
      'linear-gradient(to bottom,transparent calc(33.33% - 1px),rgba(255,255,255,.75) 33.33%,transparent calc(33.33% + 1px),transparent calc(66.66% - 1px),rgba(255,255,255,.75) 66.66%,transparent calc(66.66% + 1px))}' +
    '.rc-drag .rc-grid{opacity:1}' +
    '.rc-zoom{display:flex;align-items:center;gap:.6rem;margin:.85rem 0 0}' +
    '.rc-zoom input{flex:1;accent-color:var(--primary,#c4913a);height:28px}' +
    '.rc-zbtn{width:32px;height:32px;border-radius:50%;border:1.5px solid var(--border,#e5ddd4);background:#fff;font-size:1.1rem;line-height:1;cursor:pointer;color:inherit}' +
    '.rc-zbtn:hover{border-color:var(--primary,#c4913a)}' +
    '.rc-footer{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:flex-end;margin-top:1rem;padding-top:.9rem;border-top:1px solid var(--border,#e5ddd4)}' +
    '.rc-btn{padding:.5rem .95rem;border-radius:8px;border:1.5px solid var(--border,#e5ddd4);background:transparent;color:inherit;font:inherit;font-size:.85rem;font-weight:500;cursor:pointer;transition:opacity .15s}' +
    '.rc-btn:hover{opacity:.8}' +
    '.rc-btn:disabled{opacity:.5;cursor:default}' +
    '.rc-btn--primary{background:var(--primary,#c4913a);border-color:var(--primary,#c4913a);color:#fff}' +
    '.rc-spacer{flex:1}' +
    '.rc-overlay :focus-visible{outline:2px solid var(--text,#2c1810);outline-offset:2px}' +
    '@media (max-width:520px){.rc-box{padding:1rem}.rc-spacer{display:none}.rc-footer .rc-btn{flex:1 1 45%;min-height:44px}.rc-ratio{min-height:40px}.rc-zbtn{width:40px;height:40px}}' +
    '@media (prefers-reduced-motion:reduce){.rc-overlay,.rc-box,.rc-grid{transition:none}.rc-box{transform:none}}';

  function injectCss() {
    if (document.getElementById('rc-css')) return;
    var s = document.createElement('style');
    s.id = 'rc-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt) e.textContent = txt;
    return e;
  }

  function open(source, opts) {
    opts = opts || {};
    injectCss();

    return new Promise(function (resolve) {
      var isFile   = typeof source !== 'string';
      var url      = isFile ? URL.createObjectURL(source) : source;
      var srcName  = opts.nom || (isFile ? source.name : String(source).split('/').pop()) || 'photo';
      var isPng    = /\.png$/i.test(srcName) || (isFile && source.type === 'image/png');
      var lastFocus = document.activeElement;

      var img = new Image();
      img.alt = '';
      img.draggable = false;
      img.onerror = function () {
        if (isFile) URL.revokeObjectURL(url);
        alert('Impossible d\'ouvrir cette photo. Essayez avec un fichier JPG ou PNG.');
        resolve(null);
      };
      img.onload = build;
      img.src = url;

      function build() {
        var nw = img.naturalWidth, nh = img.naturalHeight;
        var ratioId = opts.ratio || 'boutique';
        var fw = 0, fh = 0;            // taille du cadre à l'écran
        var s = 1, tx = 0, ty = 0;     // échelle + position de la photo dans le cadre
        var minS = 1, maxS = 1, coverS = 1;

        // ── DOM ──────────────────────────────────────────
        var overlay = el('div', 'rc-overlay');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Recadrer la photo');

        var box = el('div', 'rc-box');
        box.appendChild(el('h2', '', 'Recadrer la photo'));
        box.appendChild(el('p', 'rc-help',
          'Faites glisser la photo pour la placer et utilisez le curseur pour zoomer. ' +
          'Ce qui est dans le cadre doré est ce qui sera visible sur le site. ' +
          'Dézoomez à fond pour faire rentrer un produit en entier.'));

        var ratiosEl = el('div', 'rc-ratios');
        ratiosEl.setAttribute('role', 'group');
        ratiosEl.setAttribute('aria-label', 'Format du cadre');
        RATIOS.forEach(function (r) {
          var b = el('button', 'rc-ratio', r.label);
          b.type = 'button';
          b.setAttribute('data-ratio', r.id);
          b.addEventListener('click', function () { ratioId = r.id; layout(); });
          ratiosEl.appendChild(b);
        });
        box.appendChild(ratiosEl);

        var wrap  = el('div', 'rc-stagewrap');
        var stage = el('div', 'rc-stage');
        stage.tabIndex = 0;
        stage.setAttribute('aria-label', 'Zone de cadrage : flèches pour déplacer, + et − pour zoomer');
        stage.appendChild(img);
        stage.appendChild(el('div', 'rc-grid'));
        wrap.appendChild(stage);
        box.appendChild(wrap);

        var zoomRow = el('div', 'rc-zoom');
        var zOut = el('button', 'rc-zbtn', '−'); zOut.type = 'button'; zOut.setAttribute('aria-label', 'Dézoomer');
        var zIn  = el('button', 'rc-zbtn', '+'); zIn.type  = 'button'; zIn.setAttribute('aria-label', 'Zoomer');
        var slider = el('input');
        slider.type = 'range'; slider.min = 0; slider.max = 1000; slider.step = 1;
        slider.setAttribute('aria-label', 'Zoom');
        zoomRow.appendChild(zOut); zoomRow.appendChild(slider); zoomRow.appendChild(zIn);
        box.appendChild(zoomRow);

        var footer = el('div', 'rc-footer');
        var bReset  = el('button', 'rc-btn', 'Recentrer');            bReset.type = 'button';
        var bKeep   = el('button', 'rc-btn', 'Garder telle quelle');  bKeep.type = 'button';
        var bCancel = el('button', 'rc-btn', 'Annuler');              bCancel.type = 'button';
        var bOk     = el('button', 'rc-btn rc-btn--primary', 'Valider le recadrage'); bOk.type = 'button';
        footer.appendChild(bReset);
        footer.appendChild(el('span', 'rc-spacer'));
        if (isFile) footer.appendChild(bKeep);
        footer.appendChild(bCancel);
        footer.appendChild(bOk);
        box.appendChild(footer);

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // ── Géométrie ────────────────────────────────────
        function currentRatio() {
          var def = RATIOS.filter(function (r) { return r.id === ratioId; })[0] || RATIOS[0];
          return def.r || (nw / nh);
        }

        function layout() {
          var r = currentRatio();
          var availW = Math.max(200, wrap.clientWidth - 20);
          var availH = Math.max(200, Math.min(window.innerHeight * 0.52, 460));
          fw = Math.min(availW, availH * r);
          fh = fw / r;
          fw = Math.round(fw); fh = Math.round(fh);
          stage.style.width = fw + 'px';
          stage.style.height = fh + 'px';

          coverS = Math.max(fw / nw, fh / nh);
          minS   = Math.min(fw / nw, fh / nh);
          maxS   = coverS * ZOOM_MAX;
          Array.prototype.forEach.call(ratiosEl.children, function (b) {
            b.setAttribute('aria-pressed', b.getAttribute('data-ratio') === ratioId ? 'true' : 'false');
          });
          reset();
        }

        function reset() {
          s = coverS;
          tx = (fw - nw * s) / 2;
          ty = (fh - nh * s) / 2;
          render();
        }

        function clamp() {
          var iw = nw * s, ih = nh * s;
          tx = iw >= fw ? Math.min(0, Math.max(fw - iw, tx)) : (fw - iw) / 2;
          ty = ih >= fh ? Math.min(0, Math.max(fh - ih, ty)) : (fh - ih) / 2;
        }

        function render() {
          clamp();
          img.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0) scale(' + s + ')';
          slider.value = maxS > minS ? Math.round(1000 * Math.log(s / minS) / Math.log(maxS / minS)) : 0;
        }

        function setScale(ns, cx, cy) {
          ns = Math.min(maxS, Math.max(minS, ns));
          if (cx == null) { cx = fw / 2; cy = fh / 2; }
          tx = cx - (cx - tx) * ns / s;
          ty = cy - (cy - ty) * ns / s;
          s = ns;
          render();
        }

        // ── Souris / doigt (glisser + pincer) ────────────
        var pts = {}, lastDist = 0;
        function ptList() { return Object.keys(pts).map(function (k) { return pts[k]; }); }

        stage.addEventListener('pointerdown', function (e) {
          stage.setPointerCapture(e.pointerId);
          pts[e.pointerId] = { x: e.clientX, y: e.clientY };
          stage.classList.add('rc-drag');
          lastDist = 0;
        });
        stage.addEventListener('pointermove', function (e) {
          var p = pts[e.pointerId];
          if (!p) return;
          var list = ptList();
          if (list.length === 1) {
            tx += e.clientX - p.x;
            ty += e.clientY - p.y;
            p.x = e.clientX; p.y = e.clientY;
            render();
          } else if (list.length === 2) {
            p.x = e.clientX; p.y = e.clientY;
            var a = list[0], b = list[1];
            var d = Math.hypot(a.x - b.x, a.y - b.y);
            if (lastDist) {
              var rect = stage.getBoundingClientRect();
              setScale(s * d / lastDist, (a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top);
            }
            lastDist = d;
          }
        });
        function pointerEnd(e) {
          delete pts[e.pointerId];
          lastDist = 0;
          if (!ptList().length) stage.classList.remove('rc-drag');
        }
        stage.addEventListener('pointerup', pointerEnd);
        stage.addEventListener('pointercancel', pointerEnd);

        stage.addEventListener('wheel', function (e) {
          e.preventDefault();
          var rect = stage.getBoundingClientRect();
          setScale(s * (e.deltaY < 0 ? 1.08 : 1 / 1.08), e.clientX - rect.left, e.clientY - rect.top);
        }, { passive: false });

        slider.addEventListener('input', function () {
          setScale(minS * Math.pow(maxS / minS, slider.value / 1000));
        });
        zIn.addEventListener('click',  function () { setScale(s * 1.15); });
        zOut.addEventListener('click', function () { setScale(s / 1.15); });
        bReset.addEventListener('click', reset);

        // ── Clavier ──────────────────────────────────────
        stage.addEventListener('keydown', function (e) {
          var step = e.shiftKey ? 40 : 10, used = true;
          if      (e.key === 'ArrowLeft')  tx += step;
          else if (e.key === 'ArrowRight') tx -= step;
          else if (e.key === 'ArrowUp')    ty += step;
          else if (e.key === 'ArrowDown')  ty -= step;
          else if (e.key === '+' || e.key === '=') { setScale(s * 1.1); }
          else if (e.key === '-' || e.key === '_') { setScale(s / 1.1); }
          else used = false;
          if (used) { e.preventDefault(); render(); }
        });

        function onDocKey(e) {
          if (e.key === 'Escape') {
            e.stopPropagation();   // ne ferme pas la fiche produit ouverte derrière
            e.preventDefault();
            close(null);
          } else if (e.key === 'Tab') {
            var f = overlay.querySelectorAll('button,input,[tabindex="0"]');
            var first = f[0], last = f[f.length - 1];
            if (!overlay.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
            else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
          }
        }
        document.addEventListener('keydown', onDocKey, true);

        var resizeT;
        function onResize() { clearTimeout(resizeT); resizeT = setTimeout(layout, 120); }
        window.addEventListener('resize', onResize);

        // ── Sortie ───────────────────────────────────────
        function close(result) {
          document.removeEventListener('keydown', onDocKey, true);
          window.removeEventListener('resize', onResize);
          overlay.parentNode.removeChild(overlay);
          if (isFile) URL.revokeObjectURL(url);
          if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (err) {} }
          resolve(result);
        }

        function exportCrop() {
          bOk.disabled = true;
          bOk.textContent = 'Préparation…';
          var r = fw / fh;
          var srcW = fw / s, srcH = fh / s;                 // zone visible, en pixels de la photo
          var big  = Math.min(MAX_OUT, Math.max(srcW, srcH));
          var outW = Math.max(1, Math.round(r >= 1 ? big : big * r));
          var outH = Math.max(1, Math.round(r >= 1 ? big / r : big));
          var q = outW / fw;

          var canvas = document.createElement('canvas');
          canvas.width = outW; canvas.height = outH;
          var ctx = canvas.getContext('2d');
          if (!isPng) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, outW, outH); }
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, tx * q, ty * q, nw * s * q, nh * s * q);

          var type = isPng ? 'image/png' : 'image/jpeg';
          var base = srcName.replace(/\.[a-z0-9]+$/i, '').replace(/^\d{10,}_/, '') || 'photo';
          try {
            canvas.toBlob(function (blob) {
              if (!blob) { fail(); return; }
              close(new File([blob], base + '-recadre.' + (isPng ? 'png' : 'jpg'), { type: type }));
            }, type, 0.9);
          } catch (err) { fail(); }
        }
        function fail() {
          alert('Le recadrage a échoué. Réessayez, ou choisissez « Garder telle quelle ».');
          bOk.disabled = false;
          bOk.textContent = 'Valider le recadrage';
        }

        bOk.addEventListener('click', exportCrop);
        bCancel.addEventListener('click', function () { close(null); });
        bKeep.addEventListener('click', function () { close(source); });

        layout();
        requestAnimationFrame(function () { overlay.classList.add('rc-in'); stage.focus(); });
      }
    });
  }

  window.Recadreur = { open: open };
})();
