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

  // ========== SÉLECTION DU MOIS — polaroïds (depuis data/catalogue.json) ==========
  (function () {
    var track = document.getElementById('polaroidTrack');
    var band  = document.getElementById('polaroidBand');
    if (!track || !band) return;

    function esc(str) { return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function escA(str) { return String(str || '').replace(/"/g,'&quot;'); }

    var TILTS = [-3, 2, -1.5, 3, -2.5, 1.5, -1, 2.5];

    function buildPolaroid(p, i) {
      var a = document.createElement('a');
      a.className = 'polaroid';
      a.href = 'boutique.html?cat=' + encodeURIComponent(p.categorie || '');
      a.style.setProperty('--tilt', TILTS[i % TILTS.length] + 'deg');
      a.setAttribute('aria-label', (p.nom || 'Produit') + ' — voir dans la boutique');
      a.innerHTML =
        '<span class="polaroid__photo">' +
          (p.image ? '<img src="' + escA(p.image) + '" alt="" loading="lazy">' : '') +
        '</span>' +
        '<span class="polaroid__caption">' + esc(p.nom) + '</span>' +
        (p.prix ? '<span class="polaroid__prix">' + esc(p.prix) + (p.contenance ? ' · ' + esc(p.contenance) : '') + '</span>' : '');
      return a;
    }

    fetchGH('data/catalogue.json')
      .then(function (data) {
        var sel = (data.produits || []).filter(function (p) { return p.best_seller && p.visible !== false; });
        track.innerHTML = '';
        if (!sel.length) {
          band.classList.add('polaroids--static');
          track.innerHTML = '<p class="selection__empty">La sélection du mois arrive très bientôt.</p>';
          return;
        }
        // Peu de produits : pas de défilement, on les pose simplement
        var scroll = sel.length >= 5 && !prefersReducedMotion;
        var list = scroll ? sel.concat(sel) : sel;
        list.forEach(function (p, i) { track.appendChild(buildPolaroid(p, i)); });
        if (scroll) {
          track.style.setProperty('--duree', Math.max(30, sel.length * 7) + 's');
        } else {
          band.classList.add('polaroids--static');
        }
      })
      .catch(function (err) {
        console.warn('Sélection du mois :', err);
        band.classList.add('polaroids--static');
        track.innerHTML = '<p class="selection__empty">Sélection momentanément indisponible.</p>';
      });
  })();

  // ========== FORMULAIRE PRO : message de confirmation ==========
  (function () {
    var ok = document.getElementById('formOk');
    var form = document.getElementById('contactForm');
    if (!ok || !form) return;
    if (/[?&]envoye=1/.test(window.location.search)) {
      form.hidden = true;
      ok.hidden = false;
      ok.setAttribute('tabindex', '-1');
      ok.focus();
    }
  })();

  // ========== INFOS BOUTIQUE (depuis data/infos.json) ==========
  (function () {
    fetchGH('data/infos.json')
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

        // Overlay contact : e-mail
        var ctaMail = document.querySelector('.cta-overlay__mail');
        if (ctaMail && infos.email) { ctaMail.textContent = infos.email; ctaMail.href = 'mailto:' + infos.email; }

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

        // Réseaux sociaux
        ['Instagram', 'Facebook'].forEach(function (name) {
          var url = infos[name.toLowerCase() + '_url'];
          if (url) {
            document.querySelectorAll('a[aria-label="' + name + '"]').forEach(function (a) {
              a.href = url;
            });
          }
        });
      })
      .catch(function (err) {
        console.warn('infos.json non disponible, valeurs statiques conservées.', err);
      });
  })();

  // ========== CONTENU DU SITE (depuis data/contenu.json) ==========
  (function () {
    fetchGH('data/contenu.json')
      .then(function (c) {

        // ── Textes ─────────────────────────────────────────
        var t = c.textes || {};
        // Les retours à la ligne tapés dans le CMS sont ignorés par le HTML :
        // on les convertit en sauts de ligne réels.
        var nl2br = function (s) {
          return String(s == null ? '' : s).replace(/\r\n?/g, '\n').replace(/\n/g, '<br>');
        };
        var setText = function (sel, val) {
          if (!val) return;
          var el = document.querySelector(sel);
          if (el) el.textContent = val;
        };
        var setHtml = function (sel, val) {
          if (!val) return;
          var el = document.querySelector(sel);
          if (el) el.innerHTML = val;
        };

        // Rue Saint-Antoine
        var rueParagraphs = document.querySelectorAll('.rue__desc');
        if (rueParagraphs[0] && t.rue_p1) rueParagraphs[0].innerHTML = nl2br(t.rue_p1);
        if (rueParagraphs[1] && t.rue_p2) rueParagraphs[1].innerHTML = nl2br(t.rue_p2);

        // Qui sommes-nous
        var qsnParagraphs = document.querySelectorAll('.qsn__text > p');
        if (qsnParagraphs[0] && t.qsn_p1) qsnParagraphs[0].innerHTML = nl2br(t.qsn_p1);
        if (qsnParagraphs[1] && t.qsn_p2) qsnParagraphs[1].innerHTML = nl2br(t.qsn_p2);

        // Dépôt de pain
        var painParagraphs = document.querySelectorAll('.pain__text > p');
        if (painParagraphs[0] && t.pain_p1) painParagraphs[0].innerHTML = nl2br(t.pain_p1);
        if (painParagraphs[1] && t.pain_p2) painParagraphs[1].innerHTML = nl2br(t.pain_p2);

        // Enclave
        setHtml('.enclave__text', nl2br(t.enclave));

        // Textes génériques : data-texte (une ligne / paragraphe) et data-texte-rich (paragraphes, ## titres, - listes)
        var rich = function (txt) {
          return String(txt || '').replace(/\r\n?/g, '\n').split(/\n[ \t]*\n+/).map(function (b) {
            b = b.trim(); if (!b) return '';
            if (b.indexOf('## ') === 0) return '<h2>' + eh(b.slice(3)) + '</h2>';
            var lines = b.split('\n');
            if (lines.every(function (l) { return l.trim().indexOf('- ') === 0; }))
              return '<ul>' + lines.map(function (l) { return '<li>' + eh(l.trim().slice(2)) + '</li>'; }).join('') + '</ul>';
            return '<p>' + lines.map(eh).join('<br>') + '</p>';
          }).join('');
        };
        document.querySelectorAll('[data-texte]').forEach(function (el) {
          var v = t[el.getAttribute('data-texte')];
          if (v !== undefined && v !== null && String(v).trim() !== '') el.innerHTML = nl2br(eh(v));
        });
        document.querySelectorAll('[data-texte-rich]').forEach(function (el) {
          var v = t[el.getAttribute('data-texte-rich')];
          if (v && String(v).trim()) el.innerHTML = rich(v);
        });

        // ── Photos ─────────────────────────────────────────
        var p = c.photos || {};
        var setImg = function (sel, src) {
          if (!src) return;
          var el = document.querySelector(sel);
          if (el) el.setAttribute('src', src);
        };
        setImg('.hero__visual-img',   p.hero);
        setImg('.rue__image',         p.terrasse);
        setImg('.rue__mini-img:nth-child(1)', p.mini_1);
        setImg('.rue__mini-img:nth-child(2)', p.mini_2);
        setImg('.pain__visual-bg',    p.pain);
        setImg('.qsn__image',         p.enseigne);
        setImg('.qsn-story__img',     p.enseigne);
        document.querySelectorAll('[data-photo]').forEach(function (el) {
          var src = p[el.getAttribute('data-photo')];
          if (src) el.setAttribute('src', src);
        });

        // ── Galerie strip ───────────────────────────────────
        var galerie = c.galerie;
        if (galerie && galerie.length) {
          var strip = document.querySelector('.gallery-strip');
          if (strip) {
            var items = strip.querySelectorAll('.gallery-strip__item');
            items.forEach(function (item, i) {
              var g = galerie[i % galerie.length];
              var img = item.querySelector('img');
              if (img && g) { img.src = g.src; img.alt = g.alt || ''; }
            });
          }
        }

        // ── Presse ─────────────────────────────────────────
        var presse = c.presse;
        if (presse && presse.length) {
          var grid = document.querySelector('.on-parle__grid');
          if (grid) {
            grid.innerHTML = '';
            presse.forEach(function (article, i) {
              var badgeClass = 'on-parle__badge';
              if (article.badge_type === 'gold')  badgeClass += ' on-parle__badge--gold';
              if (article.badge_type === 'green') badgeClass += ' on-parle__badge--green';
              var div = document.createElement('div');
              div.className = 'on-parle__bloc reveal visible';
              div.style.transitionDelay = ((i + 1) * 0.1) + 's';
              div.innerHTML =
                '<span class="' + badgeClass + '">' + eh(article.badge) + '</span>' +
                '<h3 class="on-parle__bloc-title">' + eh(article.titre) + '</h3>' +
                '<p class="on-parle__bloc-content">' + nl2br(eh(article.contenu)) + '</p>' +
                '<span class="on-parle__date">' + eh(article.date) + '</span>';
              grid.appendChild(div);
            });
          }
        }

        // ── Avis ───────────────────────────────────────────
        var avis = c.avis;
        if (avis && avis.length) {
          var avisCards = document.querySelector('.avis__cards');
          if (avisCards) {
            avisCards.innerHTML = '';
            var googleSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>';
            var starsSvg = Array(5).fill('<img src="assets/icons/star-filled.svg" alt="étoile" class="icon-star">').join('');
            avis.forEach(function (av, i) {
              var div = document.createElement('div');
              div.className = 'avis-card reveal visible';
              div.style.transitionDelay = ((i + 1) * 0.1) + 's';
              div.innerHTML =
                '<div class="avis-card__stars">' + starsSvg + '</div>' +
                '<p class="avis-card__text">' + nl2br(eh(av.texte)) + '</p>' +
                '<div class="avis-card__author">' + googleSvg + eh(av.auteur) +
                  '<span class="avis-card__source">— ' + eh(av.source) + '</span>' +
                '</div>';
              avisCards.appendChild(div);
            });
          }
        }

      })
      .catch(function (err) {
        console.warn('contenu.json non disponible, contenu statique conservé.', err);
      });

    function eh(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  })();

})();
