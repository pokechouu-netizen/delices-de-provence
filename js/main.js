/*
  ============================================
  Délices de Provence — main.js
  Interactions, animations, easter eggs
  Données depuis data/catalogue.json et data/infos.json (GitHub)
  ============================================
*/

(function () {
  'use strict';

  // ========== NAV: SCROLL EFFECT ==========
  const nav = document.querySelector('.nav');
  const navBurger = document.querySelector('.nav__burger');
  const navMenu = document.querySelector('.nav__menu');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  navBurger.addEventListener('click', function () {
    this.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.nav__link, .nav__cta').forEach(function (link) {
    link.addEventListener('click', function () {
      navBurger.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navBurger.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ========== SCROLL REVEAL (IntersectionObserver) ==========
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  function observeRevealList(elements) {
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    const obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    elements.forEach(function (el) { obs.observe(el); });
  }

  observeRevealList(revealElements);

  // ========== AVIS STAMP ANIMATION ==========
  const avisStamp = document.getElementById('avisStamp');
  if (avisStamp && 'IntersectionObserver' in window) {
    const stampObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            stampObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    stampObserver.observe(avisStamp);
  }

  // ========== CTA OVERLAY ==========
  const ctaOverlay = document.getElementById('ctaOverlay');
  const ctaBtns = document.querySelectorAll('[data-cta="phone"]');
  const ctaClose = ctaOverlay ? ctaOverlay.querySelector('.cta-overlay__close') : null;
  const copyBtns = ctaOverlay ? ctaOverlay.querySelectorAll('.cta-overlay__copy') : [];

  function openCTA() {
    if (!ctaOverlay) return;
    ctaOverlay.classList.add('active');
    ctaOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCTA() {
    if (!ctaOverlay) return;
    ctaOverlay.classList.remove('active');
    ctaOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  ctaBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openCTA();
    });
  });

  if (ctaClose) ctaClose.addEventListener('click', closeCTA);

  if (ctaOverlay) {
    ctaOverlay.addEventListener('click', function (e) {
      if (e.target === ctaOverlay) closeCTA();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ctaOverlay && ctaOverlay.classList.contains('active')) {
      closeCTA();
    }
  });

  copyBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var number = this.getAttribute('data-number');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(number).then(function () {
          btn.classList.add('copied');
          var originalText = btn.innerHTML;
          btn.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copié !';
          setTimeout(function () {
            btn.classList.remove('copied');
            btn.innerHTML = originalText;
          }, 2000);
        });
      }
    });
  });

  // ========== PANIER MAGIQUE ==========
  var panierSelected = [];
  var panierItems = document.querySelectorAll('.panier__item');
  var panierBtn = document.getElementById('panierBtn');
  var panierResult = document.getElementById('panierResult');
  var panierResultTitle = document.getElementById('panierResultTitle');
  var panierResultStory = document.getElementById('panierResultStory');

  if (panierBtn) {
    var panierStories = {
      'confiture,olive,terrine': {
        title: 'Le Panier du Terroir',
        story: "L'huile d'olive en filet doré, la terrine qui sent le thym sauvage, la confiture pour le dessert. Fermez les yeux : vous êtes dans un mas provençal, quelque part entre Valréas et le Ventoux.",
      },
      'confiture,miel,the': {
        title: 'Le Panier Douceur',
        story: "Un après-midi de pluie, un fauteuil, une tasse fumante. Le thé libère ses arômes, le miel coule sur une tartine, la confiture attend sagement sur un bout de brioche. Un instant suspendu.",
      },
      'epices,olive,terrine': {
        title: "Le Panier de l'Aventurier",
        story: "Vous aimez les goûts francs, les saveurs qui voyagent. Les épices relèvent la terrine, l'huile d'olive apporte sa rondeur méditerranéenne. Votre table est un carrefour du monde — un pied planté en Provence.",
      },
      'olive,riz,sel': {
        title: 'Le Panier Camarguais',
        story: "Le riz de Camargue cuit doucement avec une pincée de sel aux herbes, un filet d'huile d'olive lie le tout. Un repas simple et noble, comme la Camargue elle-même.",
      },
      'alcools,chocolat,confiture': {
        title: 'Le Panier Festif',
        story: "Le champagne pétille, le chocolat fond, la confiture accompagne un toast de brioche. Un panier qui transforme n'importe quel soir en fête — il ne manque que les étoiles.",
      },
      'biscuits-sucres,chocolat,the': {
        title: 'Le Panier Gourmand',
        story: "Une tasse de thé fumante, des biscuits croustillants, du chocolat artisanal. Le goûter parfait, celui qui vous ramène aux dimanches d'enfance en Provence.",
      },
      'bieres,biscuits-sales,terrine': {
        title: "Le Panier de l'Apéro",
        story: "Une bière artisanale bien fraîche, des biscuits salés pour le croquant, une terrine généreuse à tartiner. L'apéritif provençal par excellence, entre amis sous les platanes.",
      },
      'confiture,jus,sirops': {
        title: 'Le Panier Fruité',
        story: "Les fruits de Provence sous toutes leurs formes : en confiture sur les tartines, en jus pour se rafraîchir, en sirop pour les cocktails. Le soleil en bouteille, à savourer toute l'année.",
      },
      'plats,sel,vins': {
        title: 'Le Panier du Dîner',
        story: "Un plat cuisiné mijoté à la provençale, relevé d'une pointe de sel de Camargue, accompagné d'un vin du terroir. Le dîner est prêt — il ne reste qu'à allumer les bougies.",
      },
      'epices,miel,sel': {
        title: 'Le Panier des Saveurs',
        story: "Trois essentiels pour transformer n'importe quel plat. Le sel de Camargue pour la base, les épices pour le caractère, le miel pour l'équilibre. La Provence dans vos placards.",
      },
    };

    var defaultStory = {
      title: 'Votre Panier Unique',
      story: "Votre sélection est unique — comme les goûts de chacun. Ces trois trésors composent un voyage personnel à travers les saveurs de Provence. Venez les découvrir au 27 rue Saint-Antoine à Valréas, on vous racontera leur histoire.",
    };

    var productToCategoryMap = {
      'alcools': 'alcools', 'olive': 'autour-olive', 'bieres': 'bieres',
      'biscuits-sales': 'biscuits-sales', 'biscuits-sucres': 'biscuits-sucres',
      'the': 'cafe-the', 'chocolat': 'chocolat', 'confiture': 'confitures',
      'epices': 'epices', 'jus': 'jus', 'miel': 'miel', 'riz': 'pates-riz',
      'plats': 'plats-cuisines', 'sel': 'sel-camargue', 'sirops': 'sirops',
      'terrine': 'terrines', 'vins': 'vins'
    };

    function getRandomPhotoForCategory(category) {
      var cards = document.querySelectorAll('.photo-card[data-category="' + category + '"]:not(.photo-card--placeholder)');
      if (cards.length === 0) return null;
      var randomCard = cards[Math.floor(Math.random() * cards.length)];
      var img = randomCard.querySelector('img');
      return img ? { src: img.src, alt: img.alt } : null;
    }

    var panierResultPhotos = document.getElementById('panierResultPhotos');

    panierItems.forEach(function (item) {
      item.addEventListener('click', function () { togglePanierItem(this); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanierItem(this); }
      });
    });

    function togglePanierItem(item) {
      var product = item.getAttribute('data-product');
      if (item.classList.contains('selected')) {
        item.classList.remove('selected');
        item.setAttribute('aria-pressed', 'false');
        panierSelected = panierSelected.filter(function (p) { return p !== product; });
      } else {
        if (panierSelected.length >= 3) return;
        item.classList.add('selected');
        item.setAttribute('aria-pressed', 'true');
        panierSelected.push(product);
      }
      updatePanierBtn();
    }

    function updatePanierBtn() {
      if (panierSelected.length === 3) {
        panierBtn.classList.add('active');
        panierBtn.disabled = false;
      } else {
        panierBtn.classList.remove('active');
        panierBtn.disabled = true;
        panierResult.classList.remove('show');
      }
    }

    panierBtn.addEventListener('click', function () {
      if (panierSelected.length !== 3) return;
      var key = panierSelected.slice().sort().join(',');
      var story = panierStories[key] || defaultStory;
      panierResultTitle.textContent = story.title;
      panierResultStory.textContent = story.story;

      panierResultPhotos.innerHTML = '';
      panierSelected.forEach(function (product) {
        var category = productToCategoryMap[product] || product;
        var photo = getRandomPhotoForCategory(category);
        var photoEl = document.createElement('div');
        photoEl.className = 'panier__result-photo';
        if (photo) {
          photoEl.innerHTML = '<img src="' + photo.src + '" alt="' + photo.alt + '" loading="lazy"><span class="panier__result-photo-label">' + (document.querySelector('.panier__item[data-product="' + product + '"] .panier__item-name')?.textContent || product) + '</span>';
        } else {
          var item = document.querySelector('.panier__item[data-product="' + product + '"]');
          var icon = item ? item.querySelector('.panier__item-icon').innerHTML : '';
          var name = item ? item.querySelector('.panier__item-name').textContent : product;
          photoEl.innerHTML = '<div class="panier__result-photo-placeholder"><span class="panier__result-photo-emoji">' + icon + '</span></div><span class="panier__result-photo-label">' + name + '</span>';
        }
        panierResultPhotos.appendChild(photoEl);
      });

      panierResult.classList.add('show');
      setTimeout(function () {
        panierResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    });
  }

  // ========== EASTER EGG: SCEAU 3 CLICS ==========
  var easterSceau = document.getElementById('easterSceau');
  var easterOverlay = document.getElementById('easterOverlay');
  var easterClose = document.getElementById('easterClose');
  var easterClicks = 0;
  var easterTimeout;

  if (easterSceau) {
    easterSceau.addEventListener('click', function () {
      easterClicks++;
      this.classList.add('pulse');
      setTimeout(function () { easterSceau.classList.remove('pulse'); }, 400);
      clearTimeout(easterTimeout);
      easterTimeout = setTimeout(function () { easterClicks = 0; }, 2000);
      if (easterClicks >= 3) {
        easterClicks = 0;
        easterOverlay.classList.add('active');
        easterOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  function closeEaster() {
    if (!easterOverlay) return;
    easterOverlay.classList.remove('active');
    easterOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (easterClose) easterClose.addEventListener('click', closeEaster);
  if (easterOverlay) {
    easterOverlay.addEventListener('click', function (e) { if (e.target === easterOverlay) closeEaster(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && easterOverlay && easterOverlay.classList.contains('active')) closeEaster();
  });

  // ========== EASTER EGG: KEYBOARD "PAPES" ==========
  var keyboardEaster = document.getElementById('keyboardEaster');
  var keySequence = '';
  var targetSequence = 'papes';

  document.addEventListener('keydown', function (e) {
    if (
      (ctaOverlay && ctaOverlay.classList.contains('active')) ||
      (easterOverlay && easterOverlay.classList.contains('active')) ||
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA'
    ) return;

    keySequence += e.key.toLowerCase();
    if (keySequence.length > targetSequence.length) keySequence = keySequence.slice(-targetSequence.length);
    if (keySequence === targetSequence) {
      keySequence = '';
      if (keyboardEaster) {
        keyboardEaster.classList.add('flash');
        setTimeout(function () { keyboardEaster.classList.remove('flash'); }, 2500);
      }
    }
  });

  // ========== STICKY MAP ==========
  var mapSticky = document.getElementById('mapSticky');
  function handleMapVisibility() {
    if (!mapSticky) return;
    if (window.scrollY > window.innerHeight * 0.8) {
      mapSticky.classList.add('visible');
    } else {
      mapSticky.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', handleMapVisibility, { passive: true });

  // ========== PARALLAX ==========
  var parallaxOlive1 = document.getElementById('parallaxOlive1');
  var parallaxOlive2 = document.getElementById('parallaxOlive2');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function handleParallax() {
    if (prefersReducedMotion) return;
    var scrollY = window.scrollY;
    if (parallaxOlive1) parallaxOlive1.style.transform = 'translateY(' + scrollY * 0.08 + 'px)';
    if (parallaxOlive2) parallaxOlive2.style.transform = 'translateY(' + scrollY * -0.05 + 'px)';
  }
  window.addEventListener('scroll', handleParallax, { passive: true });

  // ========== MAGNETIC BUTTON EFFECT ==========
  document.querySelectorAll('.magnetic').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      if (prefersReducedMotion) return;
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = 'translate(' + x * 0.15 + 'px, ' + y * 0.15 + 'px)';
    });
    btn.addEventListener('mouseleave', function () { this.style.transform = ''; });
  });

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ========== SCROLL PROGRESS BAR ==========
  var scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.transform = 'scaleX(' + (docHeight > 0 ? scrollTop / docHeight : 0) + ')';
    }, { passive: true });
  }

  // ========== HIGHLIGHT TODAY IN HORAIRES ==========
  var days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var today = days[new Date().getDay()];
  document.querySelectorAll('.horaire-row').forEach(function (row) {
    var dayText = row.querySelector('.horaire-row__day');
    if (dayText && dayText.textContent.trim().toLowerCase().indexOf(today) !== -1) {
      row.classList.add('horaire-row--today');
    }
  });

  // ========== STAGGERED CHILDREN REVEAL ==========
  document.querySelectorAll('.stagger-children').forEach(function (container) {
    var children = container.querySelectorAll('.reveal, .tresor-card, .geste, .avis-card');
    children.forEach(function (child, index) {
      child.style.transitionDelay = (index * 0.12 + 0.05) + 's';
    });
  });

  // ========== PAIN H2 UNDERLINE REVEAL ==========
  var painTitle = document.querySelector('.pain__text h2');
  if (painTitle && 'IntersectionObserver' in window) {
    var painObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); painObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    painObserver.observe(painTitle);
  }

  // ========== TILT EFFECT ON TRESOR / AVIS CARDS ==========
  if (!prefersReducedMotion) {
    document.querySelectorAll('.tresor-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = this.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        this.style.transform = 'translateY(-10px) perspective(600px) rotateX(' + (y * -6) + 'deg) rotateY(' + (x * 6) + 'deg)';
      });
      card.addEventListener('mouseleave', function () { this.style.transform = ''; });
    });

    document.querySelectorAll('.avis-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = this.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        this.style.transform = 'translateY(-6px) perspective(600px) rotateX(' + (y * -4) + 'deg) rotateY(' + (x * 4) + 'deg)';
      });
      card.addEventListener('mouseleave', function () { this.style.transform = ''; });
    });
  }

  // ========== SECTION LABELS ANIMATED ==========
  document.querySelectorAll('.rue__label, .tresors__label, .panier__label, .avis__label, .enclave__label, .on-parle__badge').forEach(function (label) {
    label.classList.add('section__label-animated');
    if ('IntersectionObserver' in window) {
      var labelObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); labelObserver.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      labelObserver.observe(label);
    }
  });

  // ========== CURSOR GLOW EFFECT ON HERO ==========
  var heroSection = document.querySelector('.hero');
  if (heroSection && !prefersReducedMotion) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = this.getBoundingClientRect();
      this.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
      this.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
    });
  }

  // ========== BEST-SELLERS (depuis data/catalogue.json) ==========
  (function () {
    var CATALOGUE_URL = 'data/catalogue.json';
    var grid      = document.getElementById('bestSellersGrid');
    var clickable = document.getElementById('bestSellersClickable');

    if (!grid) return;

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

    function esc(str) { return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function escA(str) { return String(str || '').replace(/"/g,'&quot;'); }

    function buildCard(p) {
      var cat  = p.categorie || '';
      var disp = CATEGORY_DISPLAY[cat] || { name: cat, icon: cat };
      var card = document.createElement('a');
      card.href = 'boutique.html';
      card.className = 'photo-card photo-card--bestseller reveal';
      card.setAttribute('data-category', cat);
      card.setAttribute('data-nom', p.nom || '');
      card.setAttribute('aria-label', esc(p.nom || disp.name) + ' — voir dans la boutique');

      var prixHtml = '';
      if (p.prix)           prixHtml += '<span class="photo-card__prix">'        + esc(p.prix) + '</span>';
      if (p.contenance)     prixHtml += '<span class="photo-card__contenance">'  + esc(p.contenance) + '</span>';
      if (p.prix_unitaire)  prixHtml += '<span class="photo-card__prix-unit">'   + esc(p.prix_unitaire) + '</span>';

      card.innerHTML =
        '<div class="photo-card__img-wrap">' +
          '<img src="' + escA(p.image) + '" alt="' + escA((p.nom || disp.name) + ' — Délices de Provence') + '" loading="lazy">' +
          '<div class="photo-card__overlay"><span class="photo-card__zoom best-sellers__icon-boutique">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>' +
            '<span>Voir en boutique</span>' +
          '</span></div>' +
        '</div>' +
        (p.nom ? '<span class="photo-card__nom">' + esc(p.nom) + '</span>' : '') +
        '<span class="photo-card__category"><img src="assets/icons/' + escA(disp.icon) + '.svg" alt="" class="icon-svg"> ' + esc(disp.name) + '</span>' +
        (prixHtml ? '<div class="photo-card__prix-wrap">' + prixHtml + '</div>' : '');

      return card;
    }

    fetch(CATALOGUE_URL + '?v=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('catalogue.json introuvable');
        return res.json();
      })
      .then(function (data) {
        var sellers = (data.produits || []).filter(function (p) { return p.best_seller && p.visible !== false; });
        grid.innerHTML = '';

        if (sellers.length === 0) return;

        sellers.forEach(function (p) {
          var card = buildCard(p);
          grid.appendChild(card);
        });

        // Reveal animation on new cards
        observeRevealList(grid.querySelectorAll('.reveal'));

        // Magnetic effect on new cards
        if (!prefersReducedMotion) {
          grid.querySelectorAll('.photo-card--bestseller').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
              var rect = this.getBoundingClientRect();
              var x = (e.clientX - rect.left) / rect.width - 0.5;
              var y = (e.clientY - rect.top) / rect.height - 0.5;
              this.querySelector('.photo-card__img-wrap img').style.transform =
                'scale(1.06) perspective(600px) rotateX(' + (y * -3) + 'deg) rotateY(' + (x * 3) + 'deg)';
            });
            card.addEventListener('mouseleave', function () {
              var img = this.querySelector('.photo-card__img-wrap img');
              if (img) img.style.transform = '';
            });
          });
        }
      })
      .catch(function (err) {
        console.warn('Best-sellers:', err);
        grid.innerHTML = '';
      });
  })();

  // ========== INFOS BOUTIQUE (depuis data/infos.json) ==========
  (function () {
    fetch('data/infos.json?v=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('infos.json introuvable');
        return res.json();
      })
      .then(function (infos) {
        // Contact values
        var contactValues = document.querySelectorAll('.infos__contact-value');
        contactValues.forEach(function (el) {
          var text = el.textContent.toLowerCase();
          if (text.indexOf('rue') !== -1 || text.indexOf('84600') !== -1) {
            if (infos.adresse) el.innerHTML = infos.adresse + '<br>' + (infos.code_postal || '84600') + ' ' + (infos.ville || 'Valréas') + ', France';
          }
          if (text.indexOf('09') !== -1) {
            if (infos.telephone_fixe) el.textContent = infos.telephone_fixe;
          }
          if (text.indexOf('@') !== -1 && infos.email) el.textContent = infos.email;
        });

        // CTA overlay numbers
        var ctaNumber = document.querySelector('.cta-overlay__number');
        if (ctaNumber && infos.telephone_fixe) ctaNumber.textContent = infos.telephone_fixe;

        var copyBtnsAll = document.querySelectorAll('.cta-overlay__copy');
        if (copyBtnsAll[0] && infos.telephone_fixe) copyBtnsAll[0].setAttribute('data-number', infos.telephone_fixe.replace(/\s/g, ''));

        // Mailto links
        if (infos.email) {
          document.querySelectorAll('a[href*="mailto:"]').forEach(function (a) {
            a.setAttribute('href', a.getAttribute('href').replace(/mailto:[^?]+/, 'mailto:' + infos.email));
          });
        }

        // Horaires
        var dayMap = {
          'lundi': 'horaire_lundi', 'mardi': 'horaire_mardi', 'mercredi': 'horaire_mercredi',
          'jeudi': 'horaire_jeudi', 'vendredi': 'horaire_vendredi', 'samedi': 'horaire_samedi', 'dimanche': 'horaire_dimanche'
        };
        document.querySelectorAll('.horaire-row').forEach(function (row) {
          var dayEl  = row.querySelector('.horaire-row__day');
          var timeEl = row.querySelector('.horaire-row__time');
          if (!dayEl || !timeEl) return;
          var key = dayMap[dayEl.textContent.trim().toLowerCase()];
          if (key && infos[key] !== undefined) {
            timeEl.textContent = infos[key];
            var ferme = infos[key].toLowerCase() === 'fermé' || infos[key].toLowerCase() === 'ferme';
            row.classList.toggle('closed', ferme);
          }
        });

        // Popup promo
        var popup = infos.popup;
        if (popup && popup.actif === true) {
          var popupEl   = document.getElementById('popupPromo');
          var msgEl     = document.getElementById('popupPromoMessage');
          var ctaEl     = document.getElementById('popupPromoCta');
          var closeEl   = document.getElementById('popupPromoClose');
          var backdropEl= document.getElementById('popupPromoBackdrop');
          if (popupEl) {
            if (msgEl && popup.message) msgEl.textContent = popup.message;
            if (ctaEl) {
              if (popup.cta_label) ctaEl.textContent = popup.cta_label;
              if (popup.cta_url)   ctaEl.setAttribute('href', popup.cta_url);
            }
            var delay = (popup.delai_secondes || 5) * 1000;
            var shown = sessionStorage.getItem('popup_promo_shown');
            if (!shown) {
              setTimeout(function () {
                popupEl.removeAttribute('aria-hidden');
                popupEl.classList.add('show');
                sessionStorage.setItem('popup_promo_shown', '1');
              }, delay);
            }
            function closePopup() {
              popupEl.classList.remove('show');
              popupEl.setAttribute('aria-hidden', 'true');
            }
            if (closeEl)    closeEl.addEventListener('click', closePopup);
            if (backdropEl) backdropEl.addEventListener('click', closePopup);
            document.addEventListener('keydown', function (e) {
              if (e.key === 'Escape') closePopup();
            });
          }
        }
      })
      .catch(function (err) {
        console.warn('infos.json non disponible, valeurs statiques conservées.', err);
      });
  })();

})();
