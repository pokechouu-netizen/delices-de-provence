/*
  catalogue.js — Délices de Provence
  Chargement JSON GitHub · Filtres · Lightbox
  Utilisé par boutique.html
*/

(function () {
  'use strict';

  var CATALOGUE_URL = 'data/catalogue.json';

  var CATEGORY_DISPLAY = {
    'alcools':         { name: 'Alcools & Champagnes',   icon: 'alcools' },
    'autour-olive':    { name: "Autour de l'Olive",      icon: 'autour-olive' },
    'bieres':          { name: 'Bières',                 icon: 'bieres' },
    'biscuits-sales':  { name: 'Biscuits Salés',         icon: 'biscuits-sales' },
    'biscuits-sucres': { name: 'Biscuits Sucrés',        icon: 'biscuits-sucres' },
    'cafe-the':        { name: 'Café, Thé & Infusions',  icon: 'cafe-the' },
    'chocolat':        { name: 'Chocolat & Confiseries', icon: 'chocolat' },
    'confitures':      { name: 'Confitures',             icon: 'confitures' },
    'epices':          { name: 'Épices & Lavande',       icon: 'epices' },
    'jus':             { name: 'Jus de Fruits',          icon: 'jus' },
    'miel':            { name: 'Miel',                   icon: 'miel' },
    'pates-riz':       { name: 'Pâtes, Riz & Ravioles',  icon: 'pates-riz' },
    'plats-cuisines':  { name: 'Plats Cuisinés',         icon: 'plats-cuisines' },
    'sel-camargue':    { name: 'Sel de Camargue',        icon: 'sel-camargue' },
    'sirops':          { name: 'Sirops',                 icon: 'sirops' },
    'terrines':        { name: 'Terrines & Charcuteries',icon: 'terrines' },
    'vins':            { name: 'Vins',                   icon: 'vins' }
  };

  var filtersContainer = document.getElementById('catalogueFilters');
  var photoGrid        = document.getElementById('catalogueGridPhotos');
  var countEl          = document.getElementById('catalogueCount');

  if (!filtersContainer || !photoGrid) return;

  // ── Build one product card ──
  function buildCard(product) {
    var cat  = product.categorie || '';
    var disp = CATEGORY_DISPLAY[cat] || { name: cat, icon: cat };
    var nom  = product.nom         || '';
    var desc = product.description || '';
    var leg  = product.legende     || '';
    var prix = product.prix        || '';
    var cont = product.contenance  || '';
    var prixU = product.prix_unitaire || '';

    var card = document.createElement('div');
    card.className = 'photo-card reveal';
    card.setAttribute('data-category', cat);
    card.setAttribute('data-nom',         nom);
    card.setAttribute('data-description', desc);
    card.setAttribute('data-legende',     leg);
    card.setAttribute('data-prix',        prix);
    card.setAttribute('data-contenance',  cont);
    card.setAttribute('data-prix-unitaire', prixU);

    var prixHtml = '';
    if (prix) {
      prixHtml += '<span class="photo-card__prix">' + escHtml(prix) + '</span>';
    }
    if (cont) {
      prixHtml += '<span class="photo-card__contenance">' + escHtml(cont) + '</span>';
    }
    if (prixU) {
      prixHtml += '<span class="photo-card__prix-unit">' + escHtml(prixU) + '</span>';
    }

    card.innerHTML =
      '<div class="photo-card__img-wrap">' +
        '<img src="' + escAttr(product.image) + '" alt="' + escAttr(nom + ' — Délices de Provence Valréas') + '" loading="lazy">' +
        '<div class="photo-card__overlay">' +
          '<span class="photo-card__zoom">' + zoomSvg() + '</span>' +
        '</div>' +
      '</div>' +
      (nom ? '<span class="photo-card__nom">' + escHtml(nom) + '</span>' : '') +
      '<span class="photo-card__category"><img src="assets/icons/' + escAttr(disp.icon) + '.svg" alt="' + escAttr(disp.name) + '" class="icon-svg"> ' + escHtml(disp.name) + '</span>' +
      (prixHtml ? '<div class="photo-card__prix-wrap">' + prixHtml + '</div>' : '');

    return card;
  }

  function zoomSvg() {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>';
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function escAttr(str) {
    return String(str).replace(/"/g,'&quot;');
  }

  // ── Texte multi-lignes → vrais paragraphes ──
  // Le CMS enregistre les retours à la ligne (\n) tapés par la boutique ;
  // le HTML les ignore. On reconstruit un bloc par paragraphe
  // (ligne vide = nouveau paragraphe, retour simple = <br>).
  function setMultiline(el, text) {
    if (!el) return;
    el.textContent = '';
    var blocks = String(text || '').replace(/\r\n?/g, '\n').split(/\n[ \t]*\n+/);
    blocks.forEach(function (block) {
      if (!block.trim()) return;
      var para = document.createElement('span');
      para.className = 'lightbox__desc-para';
      block.split('\n').forEach(function (line, i) {
        if (i) para.appendChild(document.createElement('br'));
        para.appendChild(document.createTextNode(line.trim()));
      });
      el.appendChild(para);
    });
  }

  // ── Price parser : "4,50 €" → 4.5  (null if no price) ──
  function parsePrix(str) {
    if (!str) return null;
    var n = parseFloat(str.replace(/\s/g, '').replace(',', '.').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? null : n;
  }

  function prixInRange(card, range) {
    if (range === 'all') return true;
    var p = parsePrix(card.getAttribute('data-prix'));
    if (p === null) return true; // produit sans prix visible partout
    if (range === '0-5')   return p < 5;
    if (range === '5-10')  return p >= 5  && p < 10;
    if (range === '10-20') return p >= 10 && p < 20;
    if (range === '20+')   return p >= 20;
    return true;
  }

  // ── Filters logic ──
  function initFilters(allCards) {
    var filterBtns  = filtersContainer.querySelectorAll('.catalogue__filter');
    var inputMin    = document.getElementById('prixInputMin');
    var inputMax    = document.getElementById('prixInputMax');
    var labelMin    = document.getElementById('prixLabelMin');
    var labelMax    = document.getElementById('prixLabelMax');
    var fill        = document.getElementById('prixFill');
    var MAX         = 150;

    var activeCat   = 'all';
    var activeMin   = 0;
    var activeMax   = MAX;

    function updateFill() {
      if (!fill || !inputMin || !inputMax) return;
      var pctMin = activeMin / MAX * 100;
      var pctMax = activeMax / MAX * 100;
      fill.style.left  = pctMin + '%';
      fill.style.width = (pctMax - pctMin) + '%';
    }

    function applyFilters() {
      var visible = 0;
      allCards.forEach(function (card) {
        var catOk  = activeCat === 'all' || card.getAttribute('data-category') === activeCat;
        var p      = parsePrix(card.getAttribute('data-prix'));
        var prixOk = p === null || (p >= activeMin && (activeMax === MAX || p <= activeMax));
        if (catOk && prixOk) {
          card.classList.remove('hidden');
          card.classList.add('fade-in');
          setTimeout(function () { card.classList.remove('fade-in'); }, 400);
          visible++;
        } else {
          card.classList.add('hidden');
          card.classList.remove('fade-in');
        }
      });
      if (countEl) countEl.textContent = visible + ' produit' + (visible > 1 ? 's' : '');
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeCat = btn.getAttribute('data-filter');
        applyFilters();
      });
    });

    if (inputMin && inputMax) {
      inputMin.addEventListener('input', function () {
        var v = parseInt(inputMin.value);
        if (v > activeMax) { inputMin.value = activeMax; v = activeMax; }
        activeMin = v;
        if (labelMin) labelMin.textContent = v + ' €';
        updateFill();
        applyFilters();
      });
      inputMax.addEventListener('input', function () {
        var v = parseInt(inputMax.value);
        if (v < activeMin) { inputMax.value = activeMin; v = activeMin; }
        activeMax = v;
        if (labelMax) labelMax.textContent = v === MAX ? v + ' €+' : v + ' €';
        updateFill();
        applyFilters();
      });
      updateFill();
    }

    applyFilters();
  }

  // ── Lightbox ──
  function initLightbox(allCards) {
    var lightbox      = document.getElementById('lightbox');
    var lightboxImg   = document.getElementById('lightboxImg');
    var lightboxInfo  = document.getElementById('lightboxInfo');
    var lightboxTitle = document.getElementById('lightboxTitle');
    var lightboxDesc  = document.getElementById('lightboxDesc');
    var lightboxPrice = document.getElementById('lightboxPrice');
    var lightboxCont  = document.getElementById('lightboxContenance');
    var lightboxPrixU = document.getElementById('lightboxPrixUnitaire');
    var lightboxCat   = document.getElementById('lightboxCategory');
    var lightboxLeg   = document.getElementById('lightboxLegende');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev  = document.getElementById('lightboxPrev');
    var lightboxNext  = document.getElementById('lightboxNext');

    if (!lightbox) return;

    var currentIndex = 0;
    var visibleCards = [];

    function getVisible() {
      return allCards.filter(function (c) { return !c.classList.contains('hidden'); });
    }

    function populate(card) {
      var img     = card.querySelector('img');
      var catEl   = card.querySelector('.photo-card__category');
      var nom     = card.getAttribute('data-nom')           || '';
      var desc    = card.getAttribute('data-description')   || '';
      var leg     = card.getAttribute('data-legende')       || '';
      var prix    = card.getAttribute('data-prix')          || '';
      var cont    = card.getAttribute('data-contenance')    || '';
      var prixU   = card.getAttribute('data-prix-unitaire') || '';

      var imgSrc = img ? (img.getAttribute('src') || '') : '';
      var hasImg = imgSrc.trim() !== '';
      lightboxImg.src = hasImg ? imgSrc : '';
      lightboxImg.alt = img ? img.alt : '';
      lightboxImg.style.display = hasImg ? '' : 'none';
      var noImgEl = document.getElementById('lightboxNoImg');
      if (noImgEl) noImgEl.style.display = hasImg ? 'none' : '';
      lightboxTitle.textContent = nom;
      setMultiline(lightboxDesc, desc);

      if (lightboxPrice) lightboxPrice.textContent = prix;
      if (lightboxCont)  lightboxCont.textContent  = cont;
      if (lightboxPrixU) lightboxPrixU.textContent  = prixU;
      if (lightboxLeg)   lightboxLeg.textContent   = leg;
      if (lightboxCat)   lightboxCat.innerHTML = catEl ? catEl.innerHTML : '';

      var hasInfo = nom || desc || prix || cont || prixU || leg;
      lightboxInfo.classList.toggle('lightbox__info--empty', !hasInfo);
    }

    function open(index) {
      visibleCards = getVisible();
      if (index < 0 || index >= visibleCards.length) return;
      currentIndex = index;
      populate(visibleCards[currentIndex]);
      lightbox.classList.add('active');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('active');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    function navigate(dir) {
      visibleCards = getVisible();
      currentIndex = (currentIndex + dir + visibleCards.length) % visibleCards.length;
      populate(visibleCards[currentIndex]);
    }

    allCards.forEach(function (card) {
      card.addEventListener('click', function () {
        visibleCards = getVisible();
        var idx = visibleCards.indexOf(card);
        if (idx !== -1) open(idx);
      });
    });

    lightboxClose.addEventListener('click', close);
    lightboxPrev.addEventListener('click', function () { navigate(-1); });
    lightboxNext.addEventListener('click', function () { navigate(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      var diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) navigate(diff > 0 ? -1 : 1);
    }, { passive: true });
  }

  // ── Scroll reveal for dynamically added cards ──
  function observeCards(cards) {
    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(function (c) { obs.observe(c); });
  }

  // ── Fetch helper : Netlify (no-cache) en priorité, GitHub raw en fallback ──
  // Note : raw.githubusercontent.com a un cache CDN de 5 min qui ignore ?v=
  // Les fichiers Netlify ont Cache-Control: no-store → toujours frais après déploiement
  var GH_BASE = 'https://raw.githubusercontent.com/pokechouu-netizen/delices-de-provence/main/';
  function fetchGH(path) {
    return fetch(path + '?v=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('local'); return r.json(); })
      .catch(function () {
        return fetch(GH_BASE + path + '?v=' + Date.now())
          .then(function (r) { if (!r.ok) throw new Error(path + ' non disponible'); return r.json(); });
      });
  }

  // ── Main loader ──
  fetchGH(CATALOGUE_URL)
    .then(function (data) {
      var produits = (data.produits || []).filter(function (p) { return p.visible !== false; });
      if (produits.length === 0) throw new Error('Aucun produit');

      photoGrid.innerHTML = '';
      var allCards = [];

      produits.forEach(function (p) {
        var card = buildCard(p);
        photoGrid.appendChild(card);
        allCards.push(card);
      });

      if (countEl) countEl.textContent = allCards.length + ' produits';

      observeCards(allCards);
      initFilters(allCards);
      initLightbox(allCards);
    })
    .catch(function (err) {
      console.warn('catalogue.js :', err);
      photoGrid.innerHTML =
        '<div class="catalogue__fallback">' +
          '<div class="catalogue__fallback-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12"/><path d="M5 3s.55 7 7 9c6.45-2 7-9 7-9"/><path d="M5 12s1 5 7 7c6-2 7-7 7-7"/></svg></div>' +
          '<h3>Catalogue temporairement indisponible</h3>' +
          '<p>Revenez dans quelques instants ou contactez-nous directement.</p>' +
        '</div>';
    });

})();
