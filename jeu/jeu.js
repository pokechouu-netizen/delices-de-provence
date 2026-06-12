/* ============================================================
   MONSTRES EN DUEL
   Duel de cartes — mélange UNO × Hearthstone, façon monstres
   cartoon à collectionner. Vanilla JS, sans dépendance.
   Conçu pour le tactile (iPhone). Moteur indépendant de l'habillage.
   ============================================================ */
'use strict';

/* ------------------------------------------------------------
   1) BIBLIOTHÈQUE D'ILLUSTRATIONS SVG (monstres cartoon originaux)
   ------------------------------------------------------------ */
const ART = {
  flammeche:`<svg viewBox="0 0 100 100"><path d="M50 16 Q66 36 64 56 Q64 80 50 84 Q36 80 36 56 Q34 40 50 16Z" fill="#ff9f1c"/><path d="M50 40 Q58 52 56 64 Q56 76 50 80 Q44 76 44 64 Q43 54 50 40Z" fill="#ffd23f"/><circle cx="44" cy="56" r="6" fill="#fff"/><circle cx="56" cy="56" r="6" fill="#fff"/><circle cx="45" cy="57" r="3" fill="#3a1c00"/><circle cx="57" cy="57" r="3" fill="#3a1c00"/><path d="M44 68 Q50 72 56 68" stroke="#3a1c00" stroke-width="2" fill="none"/></svg>`,

  bondi:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="22" ry="20" fill="#6abf4b"/><path d="M50 38 Q40 18 30 22 Q34 36 50 40Z" fill="#4a9e2f"/><path d="M50 38 Q60 18 70 22 Q66 36 50 40Z" fill="#7fd65f"/><circle cx="42" cy="54" r="7" fill="#fff"/><circle cx="58" cy="54" r="7" fill="#fff"/><circle cx="43" cy="55" r="3.4" fill="#16321a"/><circle cx="59" cy="55" r="3.4" fill="#16321a"/><path d="M44 66 Q50 70 56 66" stroke="#16321a" stroke-width="2" fill="none"/><rect x="40" y="76" width="6" height="10" rx="3" fill="#4a9e2f"/><rect x="54" y="76" width="6" height="10" rx="3" fill="#4a9e2f"/></svg>`,

  piko:`<svg viewBox="0 0 100 100"><ellipse cx="48" cy="54" rx="18" ry="15" fill="#ffd23f"/><path d="M40 44a18 15 0 0 0 0 20M52 42a18 15 0 0 0 0 24" stroke="#3a1c00" stroke-width="4" fill="none"/><path d="M64 60 L80 72 L66 66Z" fill="#3a1c00"/><ellipse cx="50" cy="34" rx="13" ry="7" fill="#fff" opacity=".75"/><circle cx="40" cy="50" r="6" fill="#fff"/><circle cx="52" cy="50" r="6" fill="#fff"/><circle cx="41" cy="51" r="3" fill="#3a1c00"/><circle cx="53" cy="51" r="3" fill="#3a1c00"/></svg>`,

  moutou:`<svg viewBox="0 0 100 100"><circle cx="36" cy="50" r="12" fill="#eafbe2"/><circle cx="64" cy="50" r="12" fill="#eafbe2"/><circle cx="50" cy="40" r="13" fill="#eafbe2"/><circle cx="42" cy="62" r="12" fill="#eafbe2"/><circle cx="60" cy="62" r="12" fill="#eafbe2"/><circle cx="50" cy="54" r="15" fill="#fff"/><circle cx="44" cy="52" r="5" fill="#16321a"/><circle cx="58" cy="52" r="5" fill="#16321a"/><circle cx="45" cy="51" r="1.6" fill="#fff"/><circle cx="59" cy="51" r="1.6" fill="#fff"/><path d="M46 62 Q50 65 54 62" stroke="#16321a" stroke-width="2" fill="none"/><circle cx="34" cy="46" r="3" fill="#6abf4b"/><circle cx="66" cy="46" r="3" fill="#6abf4b"/></svg>`,

  champimo:`<svg viewBox="0 0 100 100"><rect x="42" y="54" width="16" height="26" rx="7" fill="#efe6d0"/><path d="M24 56 Q24 30 50 30 Q76 30 76 56 Q50 64 24 56Z" fill="#9b5de5"/><circle cx="38" cy="44" r="5" fill="#f1d6ff"/><circle cx="60" cy="42" r="6" fill="#f1d6ff"/><circle cx="50" cy="52" r="4" fill="#f1d6ff"/><circle cx="44" cy="64" r="4.5" fill="#1a1030"/><circle cx="56" cy="64" r="4.5" fill="#1a1030"/><circle cx="45" cy="63" r="1.5" fill="#fff"/><circle cx="57" cy="63" r="1.5" fill="#fff"/><path d="M45 72 Q50 75 55 72" stroke="#1a1030" stroke-width="2" fill="none"/></svg>`,

  venimo:`<svg viewBox="0 0 100 100"><path d="M70 28 Q40 24 38 46 Q36 66 58 66 Q74 66 70 50 Q66 40 52 44" fill="none" stroke="#9b5de5" stroke-width="10" stroke-linecap="round"/><circle cx="72" cy="28" r="9" fill="#9b5de5"/><circle cx="69" cy="26" r="2.4" fill="#fff"/><circle cx="69" cy="26" r="1.1" fill="#1a1030"/><path d="M80 30 L90 28 M90 28 L85 25 M90 28 L85 31" stroke="#c0392b" stroke-width="2"/><circle cx="50" cy="56" r="2.5" fill="#d6a5ff"/><circle cx="44" cy="50" r="2.5" fill="#d6a5ff"/></svg>`,

  roctou:`<svg viewBox="0 0 100 100"><path d="M28 70 L24 44 L40 28 L62 28 L78 46 L72 72 Z" fill="#6abf4b"/><path d="M28 70 L24 44 L40 28 L50 40 L40 56 L36 72Z" fill="#5aa83f" opacity=".6"/><circle cx="42" cy="50" r="7" fill="#fff"/><circle cx="60" cy="50" r="7" fill="#fff"/><circle cx="43" cy="51" r="3.4" fill="#16321a"/><circle cx="61" cy="51" r="3.4" fill="#16321a"/><path d="M40 62 L46 62 L44 66 L50 66 L48 70" stroke="#16321a" stroke-width="2" fill="none"/><path d="M50 28 L54 20 L58 28" fill="#4a9e2f"/></svg>`,

  aquajet:`<svg viewBox="0 0 100 100"><path d="M50 18 Q72 48 70 62 Q70 84 50 84 Q30 84 30 62 Q28 48 50 18Z" fill="#3aa0e0"/><path d="M40 40 Q34 52 38 64" stroke="#bfe8ff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="43" cy="58" r="7" fill="#fff"/><circle cx="59" cy="58" r="7" fill="#fff"/><circle cx="44" cy="59" r="3.4" fill="#0a2540"/><circle cx="60" cy="59" r="3.4" fill="#0a2540"/><path d="M44 70 Q51 75 58 70" stroke="#0a2540" stroke-width="2" fill="none"/></svg>`,

  bullard:`<svg viewBox="0 0 100 100"><circle cx="50" cy="54" r="28" fill="#3aa0e0"/><circle cx="50" cy="54" r="28" fill="none" stroke="#bfe8ff" stroke-width="3"/><circle cx="40" cy="44" r="8" fill="#bfe8ff" opacity=".6"/><circle cx="42" cy="54" r="8" fill="#fff"/><circle cx="58" cy="54" r="8" fill="#fff"/><circle cx="43" cy="55" r="4" fill="#0a2540"/><circle cx="59" cy="55" r="4" fill="#0a2540"/><path d="M42 66 Q50 72 58 66" stroke="#0a2540" stroke-width="2.4" fill="none"/></svg>`,

  cornus:`<svg viewBox="0 0 100 100"><path d="M30 44 Q20 28 16 36 Q22 44 30 50Z" fill="#efe6d0"/><path d="M70 44 Q80 28 84 36 Q78 44 70 50Z" fill="#efe6d0"/><ellipse cx="50" cy="58" rx="24" ry="22" fill="#6abf4b"/><circle cx="42" cy="54" r="8" fill="#fff"/><circle cx="58" cy="54" r="8" fill="#fff"/><circle cx="43" cy="55" r="4" fill="#16321a"/><circle cx="59" cy="55" r="4" fill="#16321a"/><path d="M40 68 Q50 76 60 68 Q56 72 50 72 Q44 72 40 68Z" fill="#16321a"/><path d="M44 70 L46 76 M56 70 L54 76" stroke="#fff" stroke-width="2"/></svg>`,

  soignelin:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="56" rx="22" ry="22" fill="#c79bf0"/><path d="M28 50 Q28 30 50 30 Q72 30 72 50" fill="#9b5de5"/><rect x="46" y="20" width="8" height="20" rx="2" fill="#fff"/><rect x="40" y="26" width="20" height="8" rx="2" fill="#fff"/><circle cx="42" cy="56" r="7" fill="#fff"/><circle cx="58" cy="56" r="7" fill="#fff"/><circle cx="43" cy="57" r="3.2" fill="#1a1030"/><circle cx="59" cy="57" r="3.2" fill="#1a1030"/><path d="M44 68 Q50 72 56 68" stroke="#1a1030" stroke-width="2" fill="none"/></svg>`,

  brasero:`<svg viewBox="0 0 100 100"><path d="M50 12 Q60 30 58 40 Q70 34 72 24 Q80 46 74 60 Q80 60 84 54 Q84 78 50 86 Q16 78 16 54 Q20 60 26 60 Q20 46 28 24 Q30 34 42 40 Q40 30 50 12Z" fill="#ff7b00"/><path d="M50 40 Q58 56 54 68 Q66 64 64 52 Q72 70 50 78 Q28 70 36 52 Q34 64 46 68 Q42 56 50 40Z" fill="#ffd23f"/><circle cx="42" cy="60" r="6" fill="#fff"/><circle cx="58" cy="60" r="6" fill="#fff"/><circle cx="43" cy="61" r="3" fill="#3a1c00"/><circle cx="59" cy="61" r="3" fill="#3a1c00"/></svg>`,

  arbrux:`<svg viewBox="0 0 100 100"><rect x="40" y="50" width="20" height="34" rx="6" fill="#7a5230"/><circle cx="36" cy="38" r="16" fill="#6abf4b"/><circle cx="62" cy="36" r="17" fill="#7fd65f"/><circle cx="50" cy="28" r="15" fill="#5aa83f"/><circle cx="44" cy="64" r="6" fill="#fff"/><circle cx="58" cy="64" r="6" fill="#fff"/><circle cx="45" cy="65" r="3" fill="#3a2410"/><circle cx="59" cy="65" r="3" fill="#3a2410"/><path d="M45 74 Q51 78 57 74" stroke="#3a2410" stroke-width="2" fill="none"/></svg>`,

  ombrak:`<svg viewBox="0 0 100 100"><path d="M22 58 Q22 40 46 38 Q70 36 80 50 Q86 58 78 64 Q60 68 42 68 Q24 68 22 58Z" fill="#7b3fd1"/><path d="M44 38 L40 22 L52 36M58 36 L60 20 L70 36" fill="#5a2ba0"/><path d="M22 58 Q8 56 8 66 Q18 66 24 62" fill="#7b3fd1"/><ellipse cx="74" cy="54" rx="9" ry="7" fill="#5a2ba0"/><circle cx="74" cy="52" r="3" fill="#ffd23f"/><circle cx="75" cy="51" r="1.2" fill="#3a1c00"/><path d="M68 60 L64 66 M74 60 L76 66 M60 60 L56 64" stroke="#fff" stroke-width="2"/><path d="M40 50 q3 8 11 6" stroke="#5a2ba0" stroke-width="2.5" fill="none"/></svg>`,

  /* --- SORTS --- */
  bouleFeu:`<svg viewBox="0 0 100 100"><circle cx="50" cy="54" r="22" fill="#ff7b00"/><circle cx="50" cy="54" r="13" fill="#ffd23f"/><path d="M50 32 Q44 22 50 14 Q56 22 50 32M30 40 Q22 34 22 26 Q32 30 30 40M70 40 Q78 34 78 26 Q68 30 70 40" fill="#ff9f1c"/><path d="M40 72 Q34 82 28 84 M60 72 Q66 82 72 84" stroke="#ff9f1c" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,

  potion:`<svg viewBox="0 0 100 100"><path d="M40 30 H60 V42 L70 70 Q72 82 60 84 H40 Q28 82 30 70 L40 42Z" fill="#c79bf0" opacity=".85"/><path d="M34 60 L66 60 L70 70 Q72 82 60 84 H40 Q28 82 30 70Z" fill="#9b5de5"/><rect x="38" y="22" width="24" height="10" rx="3" fill="#7a5230"/><rect x="46" y="66" width="8" height="14" rx="2" fill="#fff"/><rect x="42" y="70" width="16" height="6" rx="2" fill="#fff"/></svg>`,

  blizzard:`<svg viewBox="0 0 100 100"><g stroke="#3aa0e0" stroke-width="5" stroke-linecap="round"><path d="M50 16V84M20 32L80 68M80 32L20 68"/></g><g stroke="#bfe8ff" stroke-width="3" stroke-linecap="round"><path d="M50 28l-8 8M50 28l8 8M50 72l-8-8M50 72l8-8M32 40l-2 11M68 40l2 11M32 60l-2-11M68 60l2-11"/></g><circle cx="50" cy="50" r="6" fill="#bfe8ff"/></svg>`,

  energieNature:`<svg viewBox="0 0 100 100"><path d="M50 80 Q30 66 30 44 Q30 26 50 22 Q70 26 70 44 Q70 66 50 80Z" fill="#6abf4b"/><path d="M50 30 V76" stroke="#3a6e24" stroke-width="3"/><path d="M50 44 L38 36M50 54 L62 46M50 64 L40 58" stroke="#3a6e24" stroke-width="2.5"/><path d="M50 16 l3 6 6 1 -4 5 1 6 -6 -3 -6 3 1 -6 -4 -5 6 -1Z" fill="#ffd23f"/></svg>`,

  inversion:`<svg viewBox="0 0 100 100"><path d="M28 36 H66 L60 28 L74 40 L60 52 L66 44 H28Z" fill="#3aa0e0"/><path d="M72 64 H34 L40 72 L26 60 L40 48 L34 56 H72Z" fill="#9b5de5"/></svg>`,

  megaChoc:`<svg viewBox="0 0 100 100"><path d="M54 12 L42 48 L62 46 L38 88 L52 52 L32 54Z" fill="#ffd23f" stroke="#ff7b00" stroke-width="3" stroke-linejoin="round"/><circle cx="24" cy="30" r="3.5" fill="#3aa0e0"/><circle cx="78" cy="38" r="3.5" fill="#9b5de5"/><circle cx="70" cy="74" r="3.5" fill="#6abf4b"/><circle cx="26" cy="70" r="3.5" fill="#ff7b00"/></svg>`,

  /* --- HÉROS --- */
  heroJoueur:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#2bb3a3"/><circle cx="50" cy="54" r="30" fill="#3fd0bd"/><circle cx="40" cy="48" r="9" fill="#fff"/><circle cx="60" cy="48" r="9" fill="#fff"/><circle cx="41" cy="50" r="4.5" fill="#10302c"/><circle cx="61" cy="50" r="4.5" fill="#10302c"/><path d="M40 64 Q50 72 60 64" stroke="#10302c" stroke-width="3" fill="none"/><path d="M30 30 L40 40M70 30 L60 40" stroke="#1c7d72" stroke-width="4" stroke-linecap="round"/></svg>`,
  heroIA:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#3a1c5e"/><path d="M26 40 Q26 24 50 24 Q74 24 74 40 L74 60 Q74 78 50 78 Q26 78 26 60Z" fill="#7b3fd1"/><path d="M34 26 L30 14 L42 24M66 26 L70 14 L58 24" fill="#5a2ba0"/><path d="M38 46 L48 50 L38 54Z" fill="#ffd23f"/><path d="M62 46 L52 50 L62 54Z" fill="#ffd23f"/><path d="M38 66 Q50 60 62 66 Q56 70 50 70 Q44 70 38 66Z" fill="#1a0a30"/><path d="M42 67 L44 72 M58 67 L56 72" stroke="#fff" stroke-width="2"/></svg>`,
};
function svgArt(key){ return ART[key] || ART.flammeche; }

/* ------------------------------------------------------------
   2) DÉFINITION DES CARTES
   type: 'unit' (monstre) ou 'spell' (sort)
   color (type élémentaire) : olive=Nature, soleil=Feu, mistral=Eau, lavande=Psy, joker=Multi
   kw : garde, charge, venin
   ------------------------------------------------------------ */
const CARDS = {
  flammeche: {nom:"Flammèche",  type:'unit', color:'soleil',  cost:1, atk:1, hp:2, art:'flammeche', texte:"Une étincelle vivante."},
  bondi:     {nom:"Bondi",      type:'unit', color:'olive',   cost:1, atk:2, hp:1, art:'bondi',     kw:['charge'], texte:"Charge"},
  piko:      {nom:"Piko",       type:'unit', color:'soleil',  cost:2, atk:2, hp:2, art:'piko',      cri:'dmgHero1', texte:"Cri : 1 dégât au héros adverse"},
  moutou:    {nom:"Moutou",     type:'unit', color:'olive',   cost:2, atk:1, hp:4, art:'moutou',    kw:['garde'], texte:"Garde"},
  champimo:  {nom:"Champimo",   type:'unit', color:'lavande', cost:2, atk:2, hp:3, art:'champimo',  cri:'draw1', texte:"Cri : piochez 1 carte"},
  venimo:    {nom:"Venimo",     type:'unit', color:'lavande', cost:2, atk:2, hp:2, art:'venimo',    kw:['venin'], texte:"Venin"},
  roctou:    {nom:"Roctou",     type:'unit', color:'olive',   cost:3, atk:3, hp:3, art:'roctou',    texte:"Solide comme un roc."},
  aquajet:   {nom:"Aquajet",    type:'unit', color:'mistral', cost:3, atk:3, hp:2, art:'aquajet',   kw:['charge'], texte:"Charge"},
  bullard:   {nom:"Bullard",    type:'unit', color:'mistral', cost:3, atk:2, hp:4, art:'bullard',   kw:['garde'], texte:"Garde"},
  cornus:    {nom:"Cornus",     type:'unit', color:'olive',   cost:4, atk:4, hp:4, art:'cornus',    texte:"Un coup de corne assuré."},
  soignelin: {nom:"Soignelin",  type:'unit', color:'lavande', cost:4, atk:3, hp:5, art:'soignelin', cri:'heal3', texte:"Cri : soigne 3 PV à votre héros"},
  brasero:   {nom:"Brasero",    type:'unit', color:'soleil',  cost:5, atk:5, hp:5, art:'brasero',   cri:'dmg2rand', texte:"Cri : 2 dégâts à un ennemi"},
  arbrux:    {nom:"Arbrux",     type:'unit', color:'olive',   cost:5, atk:0, hp:8, art:'arbrux',    kw:['garde'], texte:"Garde — un mur vivant"},
  ombrak:    {nom:"Ombrak",     type:'unit', color:'lavande', cost:6, atk:6, hp:6, art:'ombrak',    kw:['charge'], texte:"Charge — le dragon d'ombre"},

  // SORTS
  bouleFeu:  {nom:"Boule de Feu",  type:'spell', color:'soleil', cost:3, art:'bouleFeu', target:'enemyAny',  texte:"3 dégâts à une cible ennemie", spell:'fireball3'},
  potionSoin:{nom:"Potion de Soin",type:'spell', color:'lavande',cost:2, art:'potion',   target:'none',      texte:"Soigne 6 PV à votre héros", spell:'heal6'},
  blizzard:  {nom:"Blizzard",      type:'spell', color:'mistral',cost:1, art:'blizzard', target:'enemyUnit', texte:"Gèle un monstre ennemi", spell:'freeze'},
  energie:   {nom:"Énergie Nature",type:'spell', color:'olive',  cost:2, art:'energieNature',target:'none',  texte:"Piochez 2 cartes", spell:'draw2'},
  inversion: {nom:"Inversion",     type:'spell', color:'mistral',cost:2, art:'inversion',target:'anyUnit',   texte:"Échange Attaque/Vie d'un monstre", spell:'swap'},
  megaChoc:  {nom:"Méga Choc",     type:'spell', color:'joker',  cost:4, art:'megaChoc', target:'none',      texte:"2 dégâts à tous les monstres ennemis", spell:'aoe2'},
};

// Composition du deck (mêmes cartes pour les deux joueurs, mélangées)
const DECK_LIST = [
  ['flammeche',2],['bondi',2],['piko',2],['moutou',2],['champimo',1],['venimo',2],
  ['roctou',2],['aquajet',2],['bullard',1],['cornus',2],['soignelin',1],
  ['brasero',1],['arbrux',1],['ombrak',1],
  ['bouleFeu',2],['potionSoin',1],['blizzard',2],['energie',1],['inversion',1],['megaChoc',1],
];

const NOMS_KW = {garde:'Garde', charge:'Charge', venin:'Venin'};
const NOMS_COULEUR = {olive:'Nature', lavande:'Psy', soleil:'Feu', mistral:'Eau', joker:'Multi'};
const EMOJI_COULEUR = {olive:'🌿', lavande:'🔮', soleil:'🔥', mistral:'💧', joker:'✨'};

/* ------------------------------------------------------------
   3) ÉTAT DU JEU
   ------------------------------------------------------------ */
const MAX_BOARD = 6, MAX_HAND = 8, HERO_HP = 30, MAX_MANA = 10;
let G = null;
let uidSeq = 1;
const $ = id => document.getElementById(id);

function nouveauJoueur(nom, heroArt){
  return {nom, heroArt, hp:HERO_HP, maxHp:HERO_HP, mana:0, maxMana:0,
          deck:[], hand:[], board:[], fatigue:0, comboColor:null, comboCount:0};
}

function construireDeck(){
  const d = [];
  DECK_LIST.forEach(([id,n])=>{ for(let i=0;i<n;i++) d.push(id); });
  return melanger(d);
}
function melanger(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function nouvellePartie(){
  G = {
    joueur: nouveauJoueur('Vous','heroJoueur'),
    ia: nouveauJoueur('Le Rival','heroIA'),
    tour:'joueur', actif:true, busy:false,
    selUid:null, pending:null,
  };
  G.joueur.deck = construireDeck();
  G.ia.deck = construireDeck();
  piocher(G.joueur, 4);
  piocher(G.ia, 4);
  piocher(G.ia, 1); // petit bonus au second joueur
  debutTour(G.joueur, true);
}

/* ------------------------------------------------------------
   4) MÉCANIQUES DE BASE
   ------------------------------------------------------------ */
function piocher(j, n=1){
  for(let i=0;i<n;i++){
    if(j.deck.length===0){
      j.fatigue++;
      degatsHero(j, j.fatigue, true);
    } else {
      const c = j.deck.pop();
      if(j.hand.length < MAX_HAND) j.hand.push(c);
    }
  }
}

function instancierUnite(cardId){
  const c = CARDS[cardId];
  return {
    uid: uidSeq++, cardId, color:c.color,
    atk:c.atk, hp:c.hp, maxHp:c.hp,
    kw:new Set(c.kw||[]),
    canAttack:false, frozen:false, shield:false,
    invoqueeCeTour:true,
  };
}

function debutTour(j, premier=false){
  if(j.maxMana < MAX_MANA) j.maxMana++;
  j.mana = j.maxMana;
  j.comboColor = null; j.comboCount = 0;
  j.board.forEach(u=>{
    u.invoqueeCeTour = false;
    if(u.frozen){ u.frozen = false; u.canAttack = false; }
    else u.canAttack = (u.atk > 0);
  });
  if(!premier) piocher(j, 1);
}

function autreJoueur(j){ return j===G.joueur ? G.ia : G.joueur; }

function degatsHero(j, n){
  j.hp -= n;
  flotteDegat(`hero-${j===G.joueur?'joueur':'ia'}`, n);
  if(j.hp <= 0) finPartie(j);
}

function appliquerDegats(unite, n){
  if(unite.shield && n>0){ unite.shield=false; return; }
  unite.hp -= n;
}

function nettoyerMorts(){
  [G.joueur,G.ia].forEach(j=>{ j.board = j.board.filter(u=>u.hp>0); });
}

/* ------------------------------------------------------------
   5) JOUER UNE CARTE
   ------------------------------------------------------------ */
function jouerCarte(j, handIndex, cible){
  const cardId = j.hand[handIndex];
  const c = CARDS[cardId];
  if(c.cost > j.mana) return false;
  if(c.type === 'unit' && j.board.length >= MAX_BOARD){ toast("Plateau plein !"); return false; }

  suiviCombo(j, c.color);
  j.mana -= c.cost;
  j.hand.splice(handIndex,1);

  if(c.type === 'unit'){
    const u = instancierUnite(cardId);
    if(u.kw.has('charge')) u.canAttack = (u.atk>0);
    j.board.push(u);
    if(c.cri) lancerCri(j, c.cri, u);
  } else {
    lancerSort(j, c.spell, cible);
  }
  nettoyerMorts();
  verifierFin();
  return true;
}

// combo couleur (esprit UNO) : 2 cartes de même type dans le tour -> pioche bonus
function suiviCombo(j, color){
  if(color==='joker') return;
  if(j.comboColor === color){
    j.comboCount++;
    if(j.comboCount===2){
      piocher(j,1);
      if(j===G.joueur) toast(EMOJI_COULEUR[color]+" Combo "+NOMS_COULEUR[color]+" ! +1 carte");
    }
  } else { j.comboColor = color; j.comboCount = 1; }
}

function lancerCri(j, cri){
  const adv = autreJoueur(j);
  switch(cri){
    case 'dmgHero1': degatsHero(adv,1); break;
    case 'draw1': piocher(j,1); break;
    case 'heal3': j.hp = Math.min(j.maxHp, j.hp+3); break;
    case 'dmg2rand':
      if(adv.board.length){
        const t = adv.board[Math.floor(Math.random()*adv.board.length)];
        appliquerDegats(t,2);
      } else degatsHero(adv,2);
      break;
  }
}

function lancerSort(j, spell, cible){
  const adv = autreJoueur(j);
  switch(spell){
    case 'fireball3':
      if(cible && cible.type==='unit') appliquerDegats(cible.unite,3);
      else degatsHero(adv,3);
      break;
    case 'heal6': j.hp = Math.min(j.maxHp, j.hp+6); break;
    case 'freeze': if(cible && cible.unite){ cible.unite.frozen=true; cible.unite.canAttack=false; } break;
    case 'draw2': piocher(j,2); break;
    case 'swap': if(cible && cible.unite){ const u=cible.unite; const a=u.atk; u.atk=u.hp; u.hp=Math.max(1,a); u.maxHp=Math.max(u.maxHp,u.hp);} break;
    case 'aoe2': adv.board.forEach(u=>appliquerDegats(u,2)); break;
  }
}

/* ------------------------------------------------------------
   6) ATTAQUE
   ------------------------------------------------------------ */
function aGarde(j){ return j.board.some(u=>u.kw.has('garde')); }

function peutAttaquerCible(attaquant, defenseurJoueur, cibleUnite){
  if(!attaquant.canAttack || attaquant.atk<=0) return false;
  if(aGarde(defenseurJoueur)){
    if(!cibleUnite || !cibleUnite.kw.has('garde')) return false;
  }
  return true;
}

function attaquer(attaquant, defenseurJoueur, cibleUnite){
  attaquant.canAttack = false;
  if(cibleUnite){
    const dA = attaquant.atk, dD = cibleUnite.atk;
    appliquerDegats(cibleUnite, dA);
    appliquerDegats(attaquant, dD);
    if(attaquant.kw.has('venin') && dA>0) cibleUnite.hp = 0;
    if(cibleUnite.kw.has('venin') && dD>0) attaquant.hp = 0;
  } else {
    degatsHero(defenseurJoueur, attaquant.atk);
  }
  nettoyerMorts();
  verifierFin();
}

/* ------------------------------------------------------------
   7) FIN DE TOUR / FIN DE PARTIE
   ------------------------------------------------------------ */
function finTour(){
  if(G.tour!=='joueur' || G.busy || !G.actif) return;
  annulerCible();
  G.selUid = null;
  G.tour = 'ia';
  rendu();
  setTimeout(tourIA, 600);
}

function verifierFin(){
  if(G.ia.hp<=0) finPartie(G.ia);
  else if(G.joueur.hp<=0) finPartie(G.joueur);
}

function finPartie(perdant){
  if(!G.actif) return;
  G.actif = false;
  const victoire = (perdant===G.ia);
  const el = $('fin-partie');
  el.className = 'fin-partie ' + (victoire?'victoire':'defaite');
  $('fin-titre').textContent = victoire ? '🏆 Victoire !' : '💀 Défaite';
  $('fin-sous').textContent = victoire
    ? "Tu as battu le Rival ! Champion incontesté du duel."
    : "Le Rival t'a vaincu... Retente ta chance !";
  rendu();
}

/* ------------------------------------------------------------
   8) IA — heuristique
   ------------------------------------------------------------ */
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function tourIA(){
  if(!G.actif) return;
  G.busy = true;
  const ia = G.ia, j = G.joueur;
  debutTour(ia);
  rendu();
  await sleep(500);

  // a) Phase de jeu de cartes
  let action = true, garde = 0;
  while(action && garde<24 && G.actif){
    action = false; garde++;
    const idxHeal = ia.hand.findIndex(id=>CARDS[id].spell==='heal6' && CARDS[id].cost<=ia.mana);
    if(ia.hp<=12 && idxHeal>=0){ jouerCarte(ia, idxHeal); action=true; rendu(); await sleep(450); continue; }

    const menace = plusGrosseMenace(j.board);
    const idxFire = ia.hand.findIndex(id=>CARDS[id].spell==='fireball3' && CARDS[id].cost<=ia.mana);
    if(menace && menace.hp<=3 && menace.atk>=3 && idxFire>=0){
      jouerCarte(ia, idxFire, {type:'unit', unite:menace}); action=true; rendu(); await sleep(450); continue;
    }
    const idxAoe = ia.hand.findIndex(id=>CARDS[id].spell==='aoe2' && CARDS[id].cost<=ia.mana);
    if(idxAoe>=0 && j.board.filter(u=>u.hp<=2).length>=2){
      jouerCarte(ia, idxAoe); action=true; rendu(); await sleep(450); continue;
    }
    const idxFreeze = ia.hand.findIndex(id=>CARDS[id].spell==='freeze' && CARDS[id].cost<=ia.mana);
    if(idxFreeze>=0 && menace && menace.atk>=4 && !menace.frozen){
      jouerCarte(ia, idxFreeze, {type:'unit', unite:menace}); action=true; rendu(); await sleep(450); continue;
    }
    const idxUnit = meilleureCreature(ia);
    if(idxUnit>=0 && ia.board.length<MAX_BOARD){
      jouerCarte(ia, idxUnit); action=true; rendu(); await sleep(450); continue;
    }
    const idxDraw = ia.hand.findIndex(id=>CARDS[id].spell==='draw2' && CARDS[id].cost<=ia.mana);
    if(idxDraw>=0 && ia.hand.length<=4){ jouerCarte(ia, idxDraw); action=true; rendu(); await sleep(400); continue; }
  }

  // b) Phase d'attaque
  await sleep(300);
  const attaquants = ia.board.filter(u=>u.canAttack && u.atk>0);
  for(const u of attaquants){
    if(!G.actif) break;
    if(u.hp<=0) continue;
    decideAttaque(u, j);
    rendu();
    await sleep(450);
    nettoyerMorts();
  }

  await sleep(300);
  if(G.actif){
    G.tour = 'joueur';
    G.busy = false;
    debutTour(G.joueur);
    rendu();
    toast("À toi de jouer");
  }
}

function plusGrosseMenace(board){
  let best=null;
  board.forEach(u=>{ if(!best || u.atk>best.atk) best=u; });
  return best;
}
function meilleureCreature(ia){
  let bi=-1, bc=-1;
  ia.hand.forEach((id,i)=>{
    const c=CARDS[id];
    if(c.type==='unit' && c.cost<=ia.mana){
      const val = c.cost*10 + c.atk + c.hp + (c.cri?3:0) + (c.kw?c.kw.length*2:0);
      if(val>bc){ bc=val; bi=i; }
    }
  });
  return bi;
}
function decideAttaque(u, j){
  const gardes = j.board.filter(x=>x.kw.has('garde'));
  if(gardes.length===0 && u.atk >= j.hp){ attaquer(u, j, null); return; }
  const cibles = gardes.length ? gardes : j.board;
  let kill=null;
  cibles.forEach(c=>{
    if(u.atk>=c.hp && c.atk<u.hp){ if(!kill || c.atk>kill.atk) kill=c; }
  });
  if(kill){ attaquer(u, j, kill); return; }
  if(gardes.length===0){ attaquer(u, j, null); return; }
  let faible=cibles[0];
  cibles.forEach(c=>{ if(c.hp<faible.hp) faible=c; });
  attaquer(u, j, faible);
}

/* ------------------------------------------------------------
   9) INTERACTIONS JOUEUR
   ------------------------------------------------------------ */
function clicCarteMain(index){
  if(G.tour!=='joueur' || G.busy || !G.actif) return;
  const j=G.joueur, cardId=j.hand[index], c=CARDS[cardId];
  if(c.cost > j.mana){ toast("Pas assez d'énergie"); return; }
  G.selUid=null;

  if(c.type==='spell' && c.target!=='none'){
    G.pending = {handIndex:index, target:c.target, color:c.color};
    rendu();
    montrerBandeauCible(c.nom);
  } else {
    annulerCible();
    jouerCarte(j, index);
    rendu();
    sonOk();
  }
}

function clicUniteJoueur(uid){
  if(G.tour!=='joueur' || G.busy || !G.actif) return;
  const j=G.joueur;
  const u=j.board.find(x=>x.uid===uid);
  if(!u) return;
  if(G.pending){ tenterCibleSort({type:'unit', unite:u, camp:'joueur'}); return; }
  if(!u.canAttack || u.atk<=0){ toast("Ce monstre ne peut pas attaquer"); return; }
  G.selUid = (G.selUid===uid)?null:uid;
  rendu();
}

function clicUniteIA(uid){
  if(G.tour!=='joueur' || G.busy || !G.actif) return;
  const u=G.ia.board.find(x=>x.uid===uid);
  if(!u) return;
  if(G.pending){ tenterCibleSort({type:'unit', unite:u, camp:'ia'}); return; }
  if(G.selUid){
    const att = G.joueur.board.find(x=>x.uid===G.selUid);
    if(att && peutAttaquerCible(att, G.ia, u)){
      attaquer(att, G.ia, u);
      G.selUid=null; rendu(); sonOk();
    } else { toast("Une Garde protège l'adversaire"); }
  }
}

function clicHeroIA(){
  if(G.tour!=='joueur' || G.busy || !G.actif) return;
  if(G.pending){ tenterCibleSort({type:'hero', camp:'ia'}); return; }
  if(G.selUid){
    const att=G.joueur.board.find(x=>x.uid===G.selUid);
    if(att && peutAttaquerCible(att, G.ia, null)){
      attaquer(att, G.ia, null);
      G.selUid=null; rendu(); sonOk();
    } else { toast("Une Garde protège l'adversaire"); }
  }
}
function clicHeroJoueur(){
  if(G.pending){ tenterCibleSort({type:'hero', camp:'joueur'}); }
}

function tenterCibleSort(cible){
  const p=G.pending; if(!p) return;
  const t=p.target;
  let ok=false;
  if(t==='enemyAny') ok = (cible.camp==='ia');
  else if(t==='enemyUnit') ok = (cible.camp==='ia' && cible.type==='unit');
  else if(t==='anyUnit') ok = (cible.type==='unit');
  if(!ok){ toast("Cible invalide"); return; }
  const cibleSort = cible.type==='unit' ? {type:'unit', unite:cible.unite} : {type:'hero'};
  jouerCarte(G.joueur, p.handIndex, cibleSort);
  annulerCible();
  rendu();
  sonOk();
}

function annulerCible(){ G.pending=null; $('bandeau-cible').classList.add('cache'); }
function montrerBandeauCible(nom){
  $('bandeau-cible-txt').textContent = "« "+nom+" » : choisis une cible";
  $('bandeau-cible').classList.remove('cache');
}

/* ------------------------------------------------------------
   10) RENDU
   ------------------------------------------------------------ */
function rendu(){
  if(!G) return;
  renduHero('hero-ia', G.ia, true);
  renduHero('hero-joueur', G.joueur, false);
  renduBoard('board-ia', G.ia, true);
  renduBoard('board-joueur', G.joueur, false);
  renduMain();
  $('indicateur-tour').textContent = !G.actif ? '' :
    (G.tour==='joueur' ? '⚔ Ton tour' : '✦ Tour du Rival…');
  const btn=$('btn-fin-tour');
  const monTour = G.tour==='joueur' && G.actif && !G.busy;
  btn.classList.toggle('inactif', !monTour);
  btn.classList.toggle('lumiere', monTour && !aActionsPossibles());
}

function aActionsPossibles(){
  const j=G.joueur;
  if(j.hand.some(id=>CARDS[id].cost<=j.mana)) return true;
  if(j.board.some(u=>u.canAttack && u.atk>0)) return true;
  return false;
}

function renduHero(elId, j, estIA){
  const el=$(elId);
  const ciblable = G.pending && estIA && (G.pending.target==='enemyAny');
  el.innerHTML = `
    <div class="hero ${ciblable?'cible-valide':''}" data-hero="${estIA?'ia':'joueur'}">
      <div class="hero-avatar">${svgArt(j.heroArt)}</div>
      <div class="hero-infos">
        <span class="hero-nom">${j.nom}</span>
        <div class="hero-stats">
          <span class="pv"><span class="coeur">♥</span>${j.hp}</span>
          ${renduMana(j)}
        </div>
      </div>
    </div>`;
}
function renduMana(j){
  let p='';
  for(let i=0;i<j.maxMana;i++) p+=`<span class="cristal ${i<j.mana?'plein':''}"></span>`;
  return `<span class="mana-pastilles">${p}</span><span class="mana-txt">${j.mana}/${j.maxMana}</span>`;
}

function renduBoard(elId, j, estIA){
  const el=$(elId);
  el.innerHTML = j.board.map(u=>renduUnite(u, estIA)).join('') || '';
}

function renduUnite(u, estIA){
  const c=CARDS[u.cardId];
  const sel = (!estIA && u.uid===G.selUid);
  let cls='unite c-'+u.color;
  if(sel) cls+=' selectionnee';
  if(u.frozen) cls+=' gelee';
  if(u.shield) cls+=' bouclier';
  let ciblable=false;
  if(G.pending){
    const t=G.pending.target;
    if(t==='anyUnit') ciblable=true;
    else if(estIA && (t==='enemyUnit'||t==='enemyAny')) ciblable=true;
  } else if(estIA && G.selUid){
    const att=G.joueur.board.find(x=>x.uid===G.selUid);
    if(att && peutAttaquerCible(att, G.ia, u)) ciblable=true;
  } else if(!estIA && G.tour==='joueur' && !G.busy && u.canAttack && u.atk>0){
    cls+=' peut-attaquer';
  }
  if(ciblable) cls+=' cible-valide';

  const garde = u.kw.has('garde')?'<div class="taunt-bord"></div>':'';
  const kwTxt = [...u.kw].map(k=>NOMS_KW[k]).join(' · ');
  return `
    <div class="${cls}" data-unite="${estIA?'ia':'joueur'}" data-uid="${u.uid}">
      ${garde}
      <div class="carte-couleur"></div>
      <div class="unite-art">${svgArt(c.art)}</div>
      <div class="unite-nom">${c.nom}</div>
      ${kwTxt?`<div class="unite-kw">${kwTxt}</div>`:''}
      <div class="carte-atk">${u.atk}</div>
      <div class="carte-vie">${u.hp}</div>
    </div>`;
}

function renduMain(){
  const el=$('main-joueur');
  const j=G.joueur;
  el.innerHTML = j.hand.map((id,i)=>{
    const c=CARDS[id];
    const jouable = G.tour==='joueur' && G.actif && !G.busy && c.cost<=j.mana;
    const sel = G.pending && G.pending.handIndex===i;
    const cls='carte c-'+c.color+(jouable?' jouable':' injouable')+(sel?' selectionnee':'');
    const stats = c.type==='unit'
      ? `<div class="carte-atk">${c.atk}</div><div class="carte-vie">${c.hp}</div>` : '';
    const type = c.type==='unit' ? (NOMS_COULEUR[c.color]||'Monstre') : 'Sort';
    return `
      <div class="${cls}" data-main="${i}">
        <div class="carte-couleur"></div>
        <div class="carte-cout">${c.cost}</div>
        <div class="carte-nom">${c.nom}</div>
        <div class="carte-art">${svgArt(c.art)}</div>
        <div class="carte-type">${type}</div>
        <div class="carte-texte">${c.texte}</div>
        ${stats}
      </div>`;
  }).join('');
}

/* effets visuels */
function flotteDegat(elId, n){
  const host=$(elId); if(!host) return;
  const d=document.createElement('div');
  d.className='flotte-degat'; d.textContent='-'+n;
  d.style.left='50%'; d.style.top='30%';
  host.style.position='relative';
  host.appendChild(d);
  host.classList.add('degat');
  setTimeout(()=>{host.classList.remove('degat'); d.remove();},800);
}
let toastT=null;
function toast(msg){
  const t=$('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),1400);
}
function sonOk(){ if(navigator.vibrate) navigator.vibrate(8); }

/* ------------------------------------------------------------
   11) NAVIGATION D'ÉCRANS + ÉVÉNEMENTS
   ------------------------------------------------------------ */
function montrer(ecran){
  ['ecran-titre','ecran-regles','ecran-jeu'].forEach(id=>$(id).classList.add('cache'));
  $(ecran).classList.remove('cache');
}

function demarrerJeu(){
  $('fin-partie').classList.add('cache');
  nouvellePartie();
  montrer('ecran-jeu');
  rendu();
  toast("⚔️ Que le duel commence !");
}

function construireRegles(){
  const cartesHtml = Object.keys(CARDS).map(id=>{
    const c=CARDS[id];
    const stats = c.type==='unit'?`<div class="carte-atk">${c.atk}</div><div class="carte-vie">${c.hp}</div>`:'';
    const type = c.type==='unit' ? (NOMS_COULEUR[c.color]||'Monstre') : 'Sort';
    return `<div class="carte c-${c.color} mini-carte" style="margin-left:0">
      <div class="carte-couleur"></div>
      <div class="carte-cout">${c.cost}</div>
      <div class="carte-nom">${c.nom}</div>
      <div class="carte-art">${svgArt(c.art)}</div>
      <div class="carte-type">${type}</div>
      <div class="carte-texte">${c.texte}</div>
      ${stats}
    </div>`;
  }).join('');
  $('regles-contenu').innerHTML = `
    <h2>📜 Règles du duel</h2>
    <p>Affronte <b>le Rival</b> (l'IA). Chaque héros démarre à <b>30 PV</b>.
       Réduis les siens à 0 pour gagner.</p>
    <h3>🔷 L'énergie (mana)</h3>
    <p>Chaque tour, ta jauge d'énergie augmente de 1 (jusqu'à 10) et se remplit.
       Le coût d'une carte est le rond bleu en haut à gauche.</p>
    <h3>🃏 Les cartes</h3>
    <ul>
      <li><b>Monstres</b> : se posent sur le terrain. Ils attaquent <i>au tour suivant</i> (sauf <b>Charge</b>). Touche un monstre, puis une cible ennemie.</li>
      <li><b>Sorts</b> : effet immédiat. Certains demandent une cible.</li>
    </ul>
    <h3>✨ Pouvoirs (mots-clés)</h3>
    <ul>
      <li><b>Garde</b> : l'adversaire doit l'attaquer en premier.</li>
      <li><b>Charge</b> : peut attaquer dès qu'il est posé.</li>
      <li><b>Venin</b> : détruit tout monstre qu'il blesse.</li>
      <li><b>Cri</b> : effet déclenché à l'apparition du monstre.</li>
    </ul>
    <h3>🎨 Combo de type (clin d'œil au UNO)</h3>
    <p>Joue <b>2 cartes du même type</b> dans le même tour : tu pioches 1 carte bonus !
       Les types : 🌿 Nature, 🔥 Feu, 💧 Eau, 🔮 Psy.</p>
    <h3>🗂️ Toutes les cartes</h3>
    <div class="regles-grille" style="grid-template-columns:repeat(auto-fill,minmax(96px,1fr))">${cartesHtml}</div>
  `;
}

document.addEventListener('click', e=>{
  const a = e.target.closest('[data-action]');
  if(a){
    const act=a.dataset.action;
    if(act==='jouer') return demarrerJeu();
    if(act==='regles'){ construireRegles(); return montrer('ecran-regles'); }
    if(act==='fermer-regles') return montrer('ecran-titre');
    if(act==='fin-tour') return finTour();
    if(act==='quitter'){ if(confirm('Quitter la partie en cours ?')){ G=null; montrer('ecran-titre'); } return; }
    if(act==='annuler-cible'){ annulerCible(); rendu(); return; }
    if(act==='rejouer') return demarrerJeu();
    if(act==='menu'){ $('fin-partie').classList.add('cache'); return montrer('ecran-titre'); }
    return;
  }
  if(!G) return;
  const carteMain = e.target.closest('[data-main]');
  if(carteMain) return clicCarteMain(+carteMain.dataset.main);
  const uniteIA = e.target.closest('[data-unite="ia"]');
  if(uniteIA) return clicUniteIA(+uniteIA.dataset.uid);
  const uniteJ = e.target.closest('[data-unite="joueur"]');
  if(uniteJ) return clicUniteJoueur(+uniteJ.dataset.uid);
  const heroEl = e.target.closest('[data-hero]');
  if(heroEl){ return heroEl.dataset.hero==='ia' ? clicHeroIA() : clicHeroJoueur(); }
}, false);

document.addEventListener('dblclick', e=>e.preventDefault(), {passive:false});

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

montrer('ecran-titre');
