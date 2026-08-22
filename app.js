const STORAGE_KEY = "anime-tap-clicker:v1";
const MAX_TAPS = 1_000_000_000_000;
const MATCH3_UNLOCK_THRESHOLD = 100_000_000;
const TETRIS_UNLOCK_THRESHOLD = 1_000_000_000;
const BOARD_SIZE = 6;
const CHEST_COST = 1_200;
const COMPANION_DROP_CHANCE = 0.35;
const COMPANION_PITY_CHESTS = 3;
const COMPANION_SLEEP_DELAY = 22_000;
const MATCH3_SWAP_DURATION = 285;
const MATCH3_CLEAR_DURATION = 205;
const MATCH3_CLEAR_STAGGER = 16;
const MATCH3_FALL_MIN_DURATION = 260;
const MATCH3_FALL_MAX_DURATION = 470;
const MATCH3_MAX_ACTIVE_PARTICLES = 84;
const COMBO_WINDOW = 900;

// Companion is fully implemented but temporarily hidden from play until its
// role in the game is decided. Flip this back on to bring Aliya back.
const COMPANION_ENABLED = false;

const DECAY_TICK_MS = 1_000;
const DECAY_MIN_TICK_MS = 220;
const DECAY_IDLE_MS = 1_000;
const DECAY_MAX_HEAT = 15;

const TETRIS_COLS = 8;
const TETRIS_ROWS = 14;
const TETRIS_DROP_MS = 700;
const TETRIS_SOFT_DROP_MS = 60;
const TETRIS_LINE_TAPS = 4_000;

const tetrominoes = {
  I: { color: "cyan", matrix: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
  O: { color: "gold", matrix: [[1, 1], [1, 1]] },
  T: { color: "violet", matrix: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
  S: { color: "mint", matrix: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
  Z: { color: "red", matrix: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
  J: { color: "blue", matrix: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
  L: { color: "orange", matrix: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] },
};
const tetrominoKeys = Object.keys(tetrominoes);

const gemTypes = [
  { id: "teal", className: "gem-teal", label: "Аквамарин", image: "assets/gem-skin-teal.png", pixels: ["#9dfbff", "#22b6cb", "#0c536b"] },
  { id: "coral", className: "gem-coral", label: "Рубин", image: "assets/gem-skin-coral.png", pixels: ["#ff9aaa", "#df3152", "#7f1731"] },
  { id: "gold", className: "gem-gold", label: "Цитрин", image: "assets/gem-skin-gold.png", pixels: ["#ffe08a", "#f0a33c", "#865019"] },
  { id: "mint", className: "gem-mint", label: "Изумруд", image: "assets/gem-skin-mint.png", pixels: ["#a3f6bc", "#3fc172", "#145f3d"] },
  { id: "violet", className: "gem-violet", label: "Аметист", image: "assets/gem-skin-violet.png", pixels: ["#d0b5ff", "#8d68df", "#493072"] },
  { id: "ice", className: "gem-ice", label: "Алмаз", image: "assets/gem-skin-ice.png", pixels: ["#f3fdff", "#8fdaf0", "#3b7287"] },
];

const bombTypes = [
  {
    id: "small",
    className: "bomb-small",
    label: "Малый взрыв",
    icon: "1",
    image: "assets/bomb-skin-small.png",
    colors: ["#f05cff", "#5a2fe8"],
    dropWeight: 28,
  },
  {
    id: "medium",
    className: "bomb-medium",
    label: "Средний взрыв",
    icon: "3",
    image: "assets/bomb-skin-medium.png",
    colors: ["#f05cff", "#6e35f2"],
    dropWeight: 16,
  },
  {
    id: "large",
    className: "bomb-large",
    label: "Большой взрыв",
    icon: "6",
    image: "assets/bomb-skin-large.png",
    colors: ["#ffd166", "#e93928"],
    dropWeight: 7,
  },
  {
    id: "horizontal",
    className: "bomb-horizontal",
    label: "Горизонтальный взрыв",
    icon: "=",
    image: "assets/bomb-skin-horizontal.png",
    colors: ["#ffd166", "#ff8d28"],
    dropWeight: 19,
  },
  {
    id: "vertical",
    className: "bomb-vertical",
    label: "Вертикальный взрыв",
    icon: "|",
    image: "assets/bomb-skin-vertical.png",
    colors: ["#8ef7ff", "#2c65e8"],
    dropWeight: 19,
  },
  {
    id: "cross",
    className: "bomb-cross",
    label: "Крестовой взрыв",
    icon: "+",
    image: "assets/bomb-skin-cross.png",
    colors: ["#51ffe0", "#16b8a8"],
    dropWeight: 10,
  },
  {
    id: "diagonal",
    className: "bomb-diagonal",
    label: "Диагональный взрыв",
    icon: "X",
    image: "assets/bomb-skin-diagonal.png",
    colors: ["#b898ff", "#4ce4df"],
    dropWeight: 7,
  },
];

const bombTypeIds = bombTypes.map((bomb) => bomb.id);
const START_BLOCKER_COUNT = 4;
const START_BOMB_TYPES = bombTypeIds;
const MAX_BOMBS_ON_BOARD = 7;
const DROP_BOMB_CHANCE = 0.055;

const companions = [
  {
    id: "aliya",
    title: "Алия",
    image: "assets/companion-aliya-idle.webp",
    cardImage: "assets/card-aliya.webp",
    poses: {
      idle: "assets/companion-aliya-idle.webp",
      lean: "assets/companion-aliya-lean.webp",
      magic: "assets/companion-aliya-magic.webp",
      cute: "assets/companion-aliya-cute.webp",
      sleep: "assets/companion-aliya-sleep.webp",
      focus: "assets/companion-aliya-focus.webp",
    },
  },
];

const companionOutfits = [
  {
    id: "base",
    title: "Официальный",
    description: "Базовый костюм Алиии",
    image: "assets/aliya-outfit-base.png",
    colors: ["#f8efe3", "#0d7287"],
    base: true,
  },
  {
    id: "oracle",
    title: "Ночная орбита",
    description: "Падает из сундука",
    image: "assets/aliya-outfit-oracle.png",
    colors: ["#211723", "#d7b05d"],
  },
  {
    id: "celestial",
    title: "Звездная вуаль",
    description: "Падает из сундука",
    image: "assets/aliya-outfit-celestial.png",
    colors: ["#10131d", "#82e4ef"],
  },
  {
    id: "mirage",
    title: "Миражный ритуал",
    description: "Падает из сундука",
    image: "assets/aliya-outfit-mirage.png",
    colors: ["#211421", "#9fe8df"],
  },
];

const companionStoryboards = {
  idle: ["idle"],
  bored: ["bored-1", "bored-2", "bored-3", "bored-2", "idle"],
  sit: ["sit-1", "sit-2", "sit-3", "sit-2", "idle"],
  sleep: ["sleep-1", "sleep-2", "sleep-3", "sleep-2", "sleep-3"],
  coinHug: ["coin-hug-1", "coin-hug-2", "coin-hug-3", "coin-hug-2", "idle"],
  uiPeek: ["ui-peek-1", "ui-peek-2", "ui-peek-3", "ui-peek-2", "idle"],
  flirt: ["flirt-1", "flirt-2", "flirt-3", "flirt-2", "idle"],
  match3: ["match3-peek-1", "match3-peek-2", "match3-peek-3", "match3-peek-2", "match3-peek-3"],
  scratch: ["bored-1", "bored-2", "bored-3", "bored-2", "idle"],
  touch: ["coin-hug-1", "coin-hug-2", "coin-hug-3", "coin-hug-2", "idle"],
  peek: ["ui-peek-1", "ui-peek-2", "ui-peek-3", "ui-peek-2", "idle"],
};

const companionLines = {
  tap: ["Красава!", "Так держать", "Четко попал", "Еще разок", "Вижу ритм", "Не промахнись"],
  combo: ["Вот это темп", "Комбо горит", "Не сбавляй", "Красиво жмешь", "Ты сегодня опасен"],
  magic: ["Подсвечу цель", "Сейчас усилю", "Магия пошла", "Собираю энергию"],
  cute: ["Мило вышло", "Мне нравится", "Хороший ход", "Я рядом", "Смотри не зазнайся"],
  curious: ["Ты тут?", "Что задумал?", "Я смотрю", "Интересно...", "Не пропадай", "Я все вижу"],
  flirt: ["Ну ты даешь", "Красиво жмешь", "Еще так можешь?", "Ладно, впечатлил", "Не отвлекайся на меня", "Стараешься ради меня?", "Хитрый ход"],
  sleepy: ["Разбудишь на комбо?", "Я на минутку", "Тихий режим"],
  match: ["Есть сбор!", "Фигурки рухнули", "Отличный свап", "Комбо в поле"],
};

const tapComicBursts = ["BOOM!", "TAP-TAP", "POW!", "BAM!", "KLIK!", "HIT!", "BONK!", "TOK!", "WOW!", "ДЫНЬ!"];
const tapComicPalettes = [
  ["#fff9ee", "#ffd166", "#101827"],
  ["#f8fbff", "#8ef7ff", "#101827"],
  ["#fff0f5", "#ff747e", "#101827"],
  ["#f6edff", "#b898ff", "#101827"],
  ["#eefff7", "#51ffe0", "#101827"],
];

const companionAmbientPoses = ["idle", "focus"];
const companionAmbientScenes = [
  { pose: "idle", story: "bored", mood: "скучает в углу", lineSet: "curious" },
  { pose: "idle", story: "sit", mood: "присела рядом", lineSet: "cute" },
  { pose: "magic", story: "coinHug", mood: "обнимает ядро", lineSet: "magic" },
  { pose: "focus", story: "uiPeek", mood: "подглядывает", lineSet: "curious" },
  { pose: "idle", story: "flirt", mood: "подшучивает", lineSet: "flirt" },
];

const achievements = [
  {
    id: "hello",
    title: "Первый резонанс",
    description: "Сделать 10 тапов",
    threshold: 10,
  },
  {
    id: "spark",
    title: "Искристый разгон",
    description: "Сделать 50 тапов",
    threshold: 50,
  },
  {
    id: "flow",
    title: "Плавный поток",
    description: "Сделать 100 тапов",
    threshold: 100,
  },
  {
    id: "collector",
    title: "Коллекционер арок",
    description: "Сделать 1 000 тапов",
    threshold: 1_000,
  },
  {
    id: "starlight",
    title: "Звездный ритм",
    description: "Сделать 10 000 тапов",
    threshold: 10_000,
  },
  {
    id: "legend",
    title: "Легенда ядра",
    description: "Сделать 100 000 тапов",
    threshold: 100_000,
  },
  {
    id: "million",
    title: "Миллионный след",
    description: "Сделать 1 млн тапов",
    threshold: 1_000_000,
  },
  {
    id: "ten-million",
    title: "Неоновая орбита",
    description: "Сделать 10 млн тапов",
    threshold: 10_000_000,
  },
  {
    id: "hundred-million",
    title: "Сверхритм",
    description: "Сделать 100 млн тапов",
    threshold: 100_000_000,
  },
  {
    id: "billion",
    title: "Миллиардная ария",
    description: "Сделать 1 млрд тапов",
    threshold: 1_000_000_000,
  },
  {
    id: "hundred-billion",
    title: "Космический залп",
    description: "Сделать 100 млрд тапов",
    threshold: 100_000_000_000,
  },
  {
    id: "trillion",
    title: "Триллионный климакс",
    description: "Сделать 1 трлн тапов",
    threshold: MAX_TAPS,
  },
];

const cards = [
  {
    id: "dawn",
    title: "Рассветная искра",
    rarity: "Common",
    threshold: 25,
    initials: "RI",
    colors: ["#4ce4df", "#4e7cff"],
  },
  {
    id: "sakura",
    title: "Сакура-пульс",
    rarity: "Rare",
    threshold: 75,
    initials: "SP",
    colors: ["#ff747e", "#ffb0c6"],
  },
  {
    id: "onyx",
    title: "Ониксовая дуга",
    rarity: "Rare",
    threshold: 150,
    initials: "OD",
    colors: ["#6b6ee8", "#1b2038"],
  },
  {
    id: "gold",
    title: "Золотой всплеск",
    rarity: "Epic",
    threshold: 300,
    initials: "ZV",
    colors: ["#ffd166", "#ff8d6e"],
  },
  {
    id: "mint",
    title: "Мятный луч",
    rarity: "Epic",
    threshold: 650,
    initials: "ML",
    colors: ["#95f7b1", "#4ce4df"],
  },
  {
    id: "aurora",
    title: "Аврора-ядро",
    rarity: "Legend",
    threshold: 1_000,
    initials: "AY",
    colors: ["#b898ff", "#ffd166"],
  },
  {
    id: "nebula",
    title: "Туманная печать",
    rarity: "Mythic",
    threshold: 10_000,
    initials: "TP",
    colors: ["#8f7cff", "#37d8ff"],
  },
  {
    id: "comet",
    title: "Кометная лента",
    rarity: "Mythic",
    threshold: 100_000,
    initials: "KL",
    colors: ["#ff747e", "#ffd166"],
  },
  {
    id: "luna",
    title: "Лунный архив",
    rarity: "Relic",
    threshold: 1_000_000,
    initials: "LA",
    colors: ["#d8f6ff", "#4ce4df"],
  },
  {
    id: "nova",
    title: "Нова-карта",
    rarity: "Relic",
    threshold: 100_000_000,
    initials: "NK",
    colors: ["#ffd166", "#ffffff"],
  },
  {
    id: "galaxy",
    title: "Галактический ключ",
    rarity: "Cosmic",
    threshold: 10_000_000_000,
    initials: "GK",
    colors: ["#b898ff", "#ff747e"],
  },
  {
    id: "trillion-card",
    title: "Триллионная корона",
    rarity: "Cosmic",
    threshold: MAX_TAPS,
    initials: "TK",
    colors: ["#ffd166", "#4ce4df"],
  },
  {
    id: "aliya-card",
    title: "Алия",
    rarity: "Companion",
    initials: "AL",
    colors: ["#4ce4df", "#ffd166"],
    image: "assets/card-aliya.webp",
    companionId: "aliya",
    lockedHint: "Сундук в секторе Три в ряд",
  },
];

const skins = [
  {
    id: "crystal",
    title: "Кристалл",
    description: "Базовая тапалка",
    threshold: 0,
    className: "skin-crystal",
    power: 1,
    image: "assets/anime-tap-core.webp",
    colors: ["#4ce4df", "#b898ff"],
  },
  {
    id: "sakura",
    title: "Сакура",
    description: "Разблокируется за 100 тапов",
    threshold: 100,
    className: "skin-sakura",
    power: 10,
    image: "assets/skin-sakura.webp",
    colors: ["#ff747e", "#ffd1dc"],
  },
  {
    id: "gold",
    title: "Золото",
    description: "Разблокируется за 10 000 тапов",
    threshold: 10_000,
    className: "skin-gold",
    power: 1_000,
    image: "assets/skin-gold.webp",
    colors: ["#ffd166", "#ff8d6e"],
  },
  {
    id: "mint",
    title: "Мята",
    description: "Разблокируется за 1 млн тапов",
    threshold: 1_000_000,
    className: "skin-mint",
    power: 100_000,
    image: "assets/skin-mint.webp",
    colors: ["#95f7b1", "#4ce4df"],
    starsPrice: 20,
  },
];

const coinBackdrops = [
  {
    id: "guild",
    title: "Гильдейский зал",
    description: "Anime-средневековье",
    image: "assets/coin-backdrop-guild.webp",
    colors: ["#4ce4df", "#ffd166", "#ff747e"],
  },
  {
    id: "ruins",
    title: "Лунные руины",
    description: "Падает из сундука",
    image: "assets/coin-backdrop-ruins.webp",
    colors: ["#8f7cff", "#d8f6ff", "#4ce4df"],
  },
  {
    id: "forge",
    title: "Драконья кузня",
    description: "Падает из сундука",
    image: "assets/coin-backdrop-forge.webp",
    colors: ["#ffd166", "#ff747e", "#4ce4df"],
  },
];

const tapEffects = [
  {
    id: "stars",
    title: "Звездный всплеск",
    description: "Базовая анимация",
    colors: ["#ffd166", "#4ce4df"],
    count: 18,
  },
  {
    id: "runes",
    title: "Рунный отклик",
    description: "Падает из сундука",
    colors: ["#4ce4df", "#b898ff"],
    count: 16,
  },
  {
    id: "moon",
    title: "Лунный росчерк",
    description: "Падает из сундука",
    colors: ["#d8f6ff", "#b898ff"],
    count: 14,
  },
];

const rewardMilestones = [
    ...new Set([
      ...achievements.map((achievement) => achievement.threshold),
      ...cards.map((card) => card.threshold).filter((threshold) => typeof threshold === "number"),
      ...skins.map((skin) => skin.threshold),
      MAX_TAPS,
    ]),
]
  .filter((threshold) => threshold > 0)
  .sort((a, b) => a - b);

const defaultState = {
  taps: 0,
  activeSkin: "crystal",
  unlockedAchievements: [],
  unlockedCards: [],
  unlockedSkins: ["crystal"],
  lastTapAt: 0,
  combo: 1,
  maxToastShown: false,
  match3Board: [],
  match3Energy: 0,
  chestsOpened: 0,
  companionUnlocked: false,
  activeCompanion: null,
  match3FeaturesSeeded: false,
  unlockedBackdrops: ["guild"],
  activeBackdrop: "guild",
  unlockedTapEffects: ["stars"],
  activeTapEffect: "stars",
  unlockedCompanionOutfits: ["base"],
  activeCompanionOutfit: "base",
  match3EverUnlocked: false,
  tetrisEverUnlocked: false,
};

const els = {
  tapZone: document.querySelector(".tap-zone"),
  tapButton: document.querySelector("#tapButton"),
  tapImage: document.querySelector("#tapButton img"),
  coinBackdrop: document.querySelector("#coinBackdrop"),
  companionCard: document.querySelector("#companionCard"),
  companionPoses: document.querySelector("#companionPoses"),
  aliyaCutout: document.querySelector("#aliyaCutout"),
  companionLine: document.querySelector("#companionLine"),
  companionMood: document.querySelector("#companionMood"),
  resetButton: document.querySelector("#resetButton"),
  pauseButton: document.querySelector("#pauseButton"),
  tapTotal: document.querySelector("#tapTotal"),
  tapCount: document.querySelector("#tapCount"),
  nextRewardLabel: document.querySelector("#nextRewardLabel"),
  rewardProgress: document.querySelector("#rewardProgress"),
  tapFeedback: document.querySelector("#tapFeedback"),
  toastStack: document.querySelector("#toastStack"),
  achievementList: document.querySelector("#achievementList"),
  achievementSummary: document.querySelector("#achievementSummary"),
  cardGrid: document.querySelector("#cardGrid"),
  cardSummary: document.querySelector("#cardSummary"),
  skinGrid: document.querySelector("#skinGrid"),
  skinSummary: document.querySelector("#skinSummary"),
  backdropGrid: document.querySelector("#backdropGrid"),
  backdropSummary: document.querySelector("#backdropSummary"),
  tapEffectGrid: document.querySelector("#tapEffectGrid"),
  tapEffectSummary: document.querySelector("#tapEffectSummary"),
  companionOutfitSection: document.querySelector("#companionOutfitSection"),
  companionOutfitGrid: document.querySelector("#companionOutfitGrid"),
  companionOutfitSummary: document.querySelector("#companionOutfitSummary"),
  match3Tab: document.querySelector("#match3Tab"),
  match3ShuffleButton: document.querySelector("#match3ShuffleButton"),
  match3FocusButton: document.querySelector("#match3FocusButton"),
  match3Summary: document.querySelector("#match3Summary"),
  match3Locked: document.querySelector("#match3Locked"),
  match3Game: document.querySelector("#match3Game"),
  match3Board: document.querySelector("#match3Board"),
  match3Energy: document.querySelector("#match3Energy"),
  tetrisTab: document.querySelector("#tetrisTab"),
  tetrisSummary: document.querySelector("#tetrisSummary"),
  tetrisLocked: document.querySelector("#tetrisLocked"),
  tetrisGame: document.querySelector("#tetrisGame"),
  tetrisBoard: document.querySelector("#tetrisBoard"),
  tetrisBoardCells: document.querySelector("#tetrisBoardCells"),
  tetrisActivePiece: document.querySelector("#tetrisActivePiece"),
  tetrisOverlay: document.querySelector("#tetrisOverlay"),
  tetrisLines: document.querySelector("#tetrisLines"),
  tetrisScore: document.querySelector("#tetrisScore"),
  tetrisRestartButton: document.querySelector("#tetrisRestartButton"),
  tetrisPlayAgainButton: document.querySelector("#tetrisPlayAgainButton"),
  tetrisLeftButton: document.querySelector("#tetrisLeftButton"),
  tetrisRightButton: document.querySelector("#tetrisRightButton"),
  tetrisRotateButton: document.querySelector("#tetrisRotateButton"),
  tetrisSoftDropButton: document.querySelector("#tetrisSoftDropButton"),
  tetrisHardDropButton: document.querySelector("#tetrisHardDropButton"),
  chestCount: document.querySelector("#chestCount"),
  chestStatus: document.querySelector("#chestStatus"),
  chestButton: document.querySelector("#chestButton"),
  chestProgress: document.querySelector("#chestProgress"),
  sparkTemplate: document.querySelector("#sparkTemplate"),
};

let state = loadState();
let selectedGemIndex = null;
let clearingGems = new Set();
let shakingGems = new Set();
let swappingGems = new Map();
let fallingGems = new Map();
let blastCells = new Map();
let damagedBlockers = new Map();
let clearingBlockers = new Set();
let resolvingMatch3 = false;
let shufflingMatch3 = false;
let match3PointerGesture = null;
let suppressNextMatch3Click = false;
let match3DropsSinceBomb = 0;
let companionPose = "idle";
let companionPoseTimer = null;
let companionSpeechTimer = null;
let companionSleepTimer = null;
let companionAmbientTimer = null;
let companionCuriosityTimer = null;
let companionTrackRaf = null;
let companionStoryTimers = [];
let companionLookX = 0;
let companionLookY = 0;
let companionBodyX = 0;
let companionBodyY = 0;
let focusWarpTimer = null;
let lastCompanionReactionAt = 0;
let lastCompanionLineAt = 0;
let lastCompanionPointerAt = 0;
let match3FocusMode = false;
let activeMatch3Particles = 0;
let comboExpireTimer = null;
let companionReactedThisResolve = false;
let decayHeat = 0;
let decayIntervalId = null;
let isPaused = false;
let lastActivityAt = Date.now();

let tetrisBoard = null;
let tetrisPiece = null;
let tetrisNextKey = null;
let tetrisScore = 0;
let tetrisLines = 0;
let tetrisGameOver = false;
let tetrisActive = false;
let tetrisDropTimer = null;
let tetrisSoftDropping = false;
let tetrisResolving = false;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const taps = Math.min(Number(saved?.taps ?? 0), MAX_TAPS);
    const unlockedAchievements = achievements
      .filter((achievement) => taps >= achievement.threshold)
      .map((achievement) => achievement.id);
    const unlockedCards = cards
      .filter((card) => typeof card.threshold === "number" && taps >= card.threshold)
      .map((card) => card.id);
    if (saved?.companionUnlocked) unlockedCards.push("aliya-card");
    const unlockedSkins = skins.filter((skin) => taps >= skin.threshold).map((skin) => skin.id);
    const activeSkin = unlockedSkins.includes(saved?.activeSkin) ? saved.activeSkin : "crystal";
    const savedBoard = Array.isArray(saved?.match3Board) ? saved.match3Board : [];
    const match3Board = isValidBoard(savedBoard) ? normalizeBoard(savedBoard) : createBoard();
    const activeCompanion =
      saved?.companionUnlocked && companions.some((companion) => companion.id === saved?.activeCompanion)
        ? saved.activeCompanion
        : saved?.companionUnlocked
          ? companions[0].id
          : null;
    const savedBackdrops = Array.isArray(saved?.unlockedBackdrops) ? saved.unlockedBackdrops : [];
    const unlockedBackdrops = [
      ...new Set(["guild", ...savedBackdrops.filter((id) => coinBackdrops.some((backdrop) => backdrop.id === id))]),
    ];
    const activeBackdrop = unlockedBackdrops.includes(saved?.activeBackdrop) ? saved.activeBackdrop : "guild";
    const savedTapEffects = Array.isArray(saved?.unlockedTapEffects) ? saved.unlockedTapEffects : [];
    const unlockedTapEffects = [
      ...new Set(["stars", ...savedTapEffects.filter((id) => tapEffects.some((effect) => effect.id === id))]),
    ];
    const activeTapEffect = unlockedTapEffects.includes(saved?.activeTapEffect) ? saved.activeTapEffect : "stars";
    const savedOutfits = Array.isArray(saved?.unlockedCompanionOutfits) ? saved.unlockedCompanionOutfits : [];
    const unlockedCompanionOutfits = [
      ...new Set(["base", ...savedOutfits.filter((id) => companionOutfits.some((outfit) => outfit.id === id))]),
    ];
    const activeCompanionOutfit = unlockedCompanionOutfits.includes(saved?.activeCompanionOutfit)
      ? saved.activeCompanionOutfit
      : "base";

    return {
      ...defaultState,
      ...saved,
      taps,
      activeSkin,
      unlockedAchievements,
      unlockedCards,
      unlockedSkins,
      match3Board,
      match3Energy: Math.max(0, Number(saved?.match3Energy ?? 0)),
      chestsOpened: Math.max(0, Number(saved?.chestsOpened ?? 0)),
      companionUnlocked: Boolean(saved?.companionUnlocked),
      activeCompanion,
      match3FeaturesSeeded: Boolean(saved?.match3FeaturesSeeded),
      unlockedBackdrops,
      activeBackdrop,
      unlockedTapEffects,
      activeTapEffect,
      unlockedCompanionOutfits,
      activeCompanionOutfit,
      match3EverUnlocked: Boolean(saved?.match3EverUnlocked) || taps >= MATCH3_UNLOCK_THRESHOLD,
      tetrisEverUnlocked: Boolean(saved?.tetrisEverUnlocked) || taps >= TETRIS_UNLOCK_THRESHOLD,
      combo: 1,
      lastTapAt: 0,
    };
  } catch {
    return { ...defaultState, match3Board: createBoard() };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatShort(value) {
  if (value < 100_000) return formatNumber(value);

  const units = [
    { value: 1_000_000_000_000, suffix: "трлн" },
    { value: 1_000_000_000, suffix: "млрд" },
    { value: 1_000_000, suffix: "млн" },
    { value: 1_000, suffix: "тыс" },
  ];
  const unit = units.find((item) => value >= item.value);
  const scaled = Math.floor((value / unit.value) * 10) / 10;
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(scaled)} ${unit.suffix}`;
}

function formatTapGoal(value) {
  return `${formatShort(value)} тапов`;
}

function getRewardPercent() {
  const nextReward = rewardMilestones.find((threshold) => threshold > state.taps);
  if (!nextReward) return 100;
  const previousReward = [...rewardMilestones].reverse().find((threshold) => threshold <= state.taps) ?? 0;
  return ((state.taps - previousReward) / (nextReward - previousReward)) * 100;
}

function setStatText(el, statCard, text) {
  if (el.textContent === text) return;
  el.textContent = text;
  if (!statCard || isReducedMotion()) return;
  window.clearTimeout(statCard.__popTimer);
  statCard.classList.remove("is-pop");
  void statCard.offsetWidth;
  statCard.classList.add("is-pop");
  statCard.__popTimer = window.setTimeout(() => statCard.classList.remove("is-pop"), 380);
}

function getActiveSkin() {
  return skins.find((skin) => skin.id === state.activeSkin) ?? skins[0];
}

function getActiveCompanion() {
  return companions.find((companion) => companion.id === state.activeCompanion) ?? companions[0];
}

function getActiveBackdrop() {
  return coinBackdrops.find((backdrop) => backdrop.id === state.activeBackdrop) ?? coinBackdrops[0];
}

function getActiveTapEffect() {
  return tapEffects.find((effect) => effect.id === state.activeTapEffect) ?? tapEffects[0];
}

function getActiveCompanionOutfit() {
  return companionOutfits.find((outfit) => outfit.id === state.activeCompanionOutfit) ?? companionOutfits[0];
}

function isMatch3Unlocked() {
  if (state.match3EverUnlocked) return true;
  if (state.taps >= MATCH3_UNLOCK_THRESHOLD) {
    state.match3EverUnlocked = true;
    return true;
  }
  return false;
}

function isTetrisUnlocked() {
  if (state.tetrisEverUnlocked) return true;
  if (state.taps >= TETRIS_UNLOCK_THRESHOLD) {
    state.tetrisEverUnlocked = true;
    return true;
  }
  return false;
}

function getBombType(typeId) {
  return bombTypes.find((bomb) => bomb.id === typeId) ?? null;
}

function createGemCell(gemId = randomGemId(), bombType = null) {
  const safeGemId = gemTypes.some((gem) => gem.id === gemId) ? gemId : randomGemId();
  return bombTypeIds.includes(bombType) ? `${safeGemId}:bomb-${bombType}` : safeGemId;
}

function createBlockerCell(hp = 2) {
  return `blocker-${Math.max(1, Math.min(2, Number(hp) || 2))}`;
}

function normalizeCell(cell) {
  if (typeof cell === "object" && cell !== null) {
    if (cell.type === "blocker") {
      return { type: "blocker", hp: Math.max(1, Math.min(2, Number(cell.hp) || 2)) };
    }
    if (cell.type === "gem" && gemTypes.some((gem) => gem.id === cell.gemId)) {
      return {
        type: "gem",
        gemId: cell.gemId,
        bombType: bombTypeIds.includes(cell.bombType) ? cell.bombType : null,
      };
    }
  }

  if (typeof cell !== "string") return { type: "empty" };

  const blockerMatch = cell.match(/^blocker-(1|2)$/);
  if (blockerMatch) {
    return { type: "blocker", hp: Number(blockerMatch[1]) };
  }

  const [gemId, bombToken] = cell.split(":");
  if (!gemTypes.some((gem) => gem.id === gemId)) return { type: "empty" };

  const bombType = bombToken?.startsWith("bomb-") ? bombToken.slice(5) : null;
  return {
    type: "gem",
    gemId,
    bombType: bombTypeIds.includes(bombType) ? bombType : null,
  };
}

function serializeCell(cell) {
  const normalized = normalizeCell(cell);
  if (normalized.type === "blocker") return createBlockerCell(normalized.hp);
  if (normalized.type === "gem") return createGemCell(normalized.gemId, normalized.bombType);
  return null;
}

function normalizeBoard(board) {
  return board.map((cell) => serializeCell(cell));
}

function isGemCell(cell) {
  return normalizeCell(cell).type === "gem";
}

function isBlockerCell(cell) {
  return normalizeCell(cell).type === "blocker";
}

function getCellGemId(cell) {
  const normalized = normalizeCell(cell);
  return normalized.type === "gem" ? normalized.gemId : null;
}

function getCellBombType(cell) {
  const normalized = normalizeCell(cell);
  return normalized.type === "gem" ? normalized.bombType : null;
}

function getBlockerHp(cell) {
  const normalized = normalizeCell(cell);
  return normalized.type === "blocker" ? normalized.hp : 0;
}

function updateMatch3FocusButton() {
  const label = match3FocusMode ? "Свернуть поле три в ряд" : "Развернуть поле три в ряд";
  els.match3FocusButton.classList.toggle("is-active", match3FocusMode);
  els.match3FocusButton.setAttribute("aria-label", label);
  els.match3FocusButton.title = label;
  els.match3FocusButton.querySelector("span").textContent = match3FocusMode ? "↙" : "↗";
}

function setMatch3FocusMode(enabled, { animate = true } = {}) {
  const nextMode = Boolean(enabled) && isMatch3Unlocked();
  if (match3FocusMode === nextMode) {
    updateMatch3FocusButton();
    return;
  }

  match3FocusMode = nextMode;
  document.body.classList.toggle("is-match3-focus", match3FocusMode);
  updateMatch3FocusButton();

  if (animate) {
    document.body.classList.add("is-focus-warp");
    els.match3FocusButton.classList.add("is-warping");
    window.clearTimeout(focusWarpTimer);
    focusWarpTimer = window.setTimeout(() => {
      document.body.classList.remove("is-focus-warp");
      els.match3FocusButton.classList.remove("is-warping");
    }, 540);
  }

  if (match3FocusMode) {
    switchTab("match3");
    window.setTimeout(() => setCompanionLookAtElement(els.match3Board, { body: true }), 80);
    if (state.companionUnlocked) {
      setCompanionPose("focus", {
        mood: "следит за полем",
        line: "Смотрю поле",
        story: "match3",
      });
    }
    return;
  }

  if (state.companionUnlocked && companionPose === "focus") {
    setCompanionLook(0, 0, { body: true });
    setCompanionPose("idle", {
      mood: "следит за ритмом",
      line: "Вернулась",
      story: "idle",
    });
  }
}

function isValidBoard(board) {
  return (
    board.length === BOARD_SIZE * BOARD_SIZE &&
    board.every((cell) => {
      const normalized = normalizeCell(cell);
      return normalized.type === "gem" || normalized.type === "blocker";
    })
  );
}

function isResolvableBoard(board) {
  return (
    board.length === BOARD_SIZE * BOARD_SIZE &&
    board.every((cell) => {
      const normalized = normalizeCell(cell);
      return normalized.type === "gem" || normalized.type === "blocker" || normalized.type === "empty";
    })
  );
}

function randomGemId() {
  return gemTypes[Math.floor(Math.random() * gemTypes.length)].id;
}

function createBoard({ features = true } = {}) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const board = features ? seedMatch3Features(createBoardCandidate()) : createBoardCandidate();
    if (hasPossibleMove(board)) return board;
  }

  return createBoardCandidate();
}

function createBoardCandidate() {
  const board = [];

  for (let index = 0; index < BOARD_SIZE * BOARD_SIZE; index += 1) {
    let gemId = randomGemId();
    while (wouldCreateStartMatch(board, index, gemId)) {
      gemId = randomGemId();
    }
    board[index] = createGemCell(gemId);
  }

  return board;
}

function seedMatch3Features(board) {
  const baseBoard = normalizeBoard(board).map((cell) => {
    const gemId = getCellGemId(cell);
    return gemId ? createGemCell(gemId) : createGemCell();
  });

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const candidate = [...baseBoard];
    placeRandomBlockers(candidate, START_BLOCKER_COUNT);
    placeSeedBombs(candidate, START_BOMB_TYPES);
    if (findMatches(candidate).size === 0 && hasPossibleMove(candidate)) return candidate;
  }

  return baseBoard;
}

function placeRandomBlockers(board, count) {
  const candidates = board
    .map((cell, index) => ({ cell, index }))
    .filter(({ cell, index }) => {
      const row = Math.floor(index / BOARD_SIZE);
      const col = index % BOARD_SIZE;
      return isGemCell(cell) && row > 0 && row < BOARD_SIZE - 1 && col > 0 && col < BOARD_SIZE - 1;
    })
    .map(({ index }) => index);

  shuffleItems(candidates)
    .slice(0, count)
    .forEach((index) => {
      board[index] = createBlockerCell(2);
    });
}

function placeSeedBombs(board, bombTypeList) {
  const candidates = shuffleItems(
    board
      .map((cell, index) => ({ cell, index }))
      .filter(({ cell }) => isGemCell(cell) && !getCellBombType(cell))
      .map(({ index }) => index),
  );

  bombTypeList.slice(0, MAX_BOMBS_ON_BOARD).forEach((bombType, position) => {
    const index = candidates[position];
    if (typeof index !== "number") return;
    board[index] = createGemCell(getCellGemId(board[index]), bombType);
  });
}

function countBombs(board) {
  return board.filter((cell) => Boolean(getCellBombType(cell))).length;
}

function pickBombDropType() {
  const totalWeight = bombTypes.reduce((sum, bomb) => sum + bomb.dropWeight, 0);
  let roll = Math.random() * totalWeight;

  for (const bomb of bombTypes) {
    roll -= bomb.dropWeight;
    if (roll <= 0) return bomb.id;
  }

  return bombTypes[0].id;
}

function createDropCell() {
  const gemId = randomGemId();
  const currentBombs = countBombs(state.match3Board);
  const roomFactor = Math.max(0.35, 1 - currentBombs / Math.max(1, MAX_BOMBS_ON_BOARD));
  const pityBonus = Math.min(0.09, match3DropsSinceBomb * 0.009);
  const dropChance = (DROP_BOMB_CHANCE + pityBonus) * roomFactor;

  if (currentBombs < MAX_BOMBS_ON_BOARD && Math.random() < dropChance) {
    match3DropsSinceBomb = 0;
    return createGemCell(gemId, pickBombDropType());
  }
  match3DropsSinceBomb += 1;
  return createGemCell(gemId);
}

function shuffleItems(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function wouldCreateStartMatch(board, index, gemId) {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  const leftMatch =
    col >= 2 && getCellGemId(board[index - 1]) === gemId && getCellGemId(board[index - 2]) === gemId;
  const upMatch =
    row >= 2 &&
    getCellGemId(board[index - BOARD_SIZE]) === gemId &&
    getCellGemId(board[index - BOARD_SIZE * 2]) === gemId;
  return leftMatch || upMatch;
}

function findMatchGroups(board) {
  const groups = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    let runStart = 0;
    for (let col = 1; col <= BOARD_SIZE; col += 1) {
      const current = col < BOARD_SIZE ? getCellGemId(board[row * BOARD_SIZE + col]) : null;
      const previous = getCellGemId(board[row * BOARD_SIZE + col - 1]);
      if (current === previous) continue;

      if (previous && col - runStart >= 3) {
        groups.push({
          gemId: previous,
          orientation: "horizontal",
          indexes: Array.from({ length: col - runStart }, (_, offset) => row * BOARD_SIZE + runStart + offset),
        });
      }
      runStart = col;
    }
  }

  for (let col = 0; col < BOARD_SIZE; col += 1) {
    let runStart = 0;
    for (let row = 1; row <= BOARD_SIZE; row += 1) {
      const current = row < BOARD_SIZE ? getCellGemId(board[row * BOARD_SIZE + col]) : null;
      const previous = getCellGemId(board[(row - 1) * BOARD_SIZE + col]);
      if (current === previous) continue;

      if (previous && row - runStart >= 3) {
        groups.push({
          gemId: previous,
          orientation: "vertical",
          indexes: Array.from({ length: row - runStart }, (_, offset) => (runStart + offset) * BOARD_SIZE + col),
        });
      }
      runStart = row;
    }
  }

  return groups;
}

function findMatches(board) {
  return new Set(findMatchGroups(board).flatMap((group) => group.indexes));
}

function hasPossibleMove(board) {
  for (let index = 0; index < board.length; index += 1) {
    if (!isGemCell(board[index])) continue;

    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const neighborIndexes = [];
    if (col < BOARD_SIZE - 1) neighborIndexes.push(index + 1);
    if (row < BOARD_SIZE - 1) neighborIndexes.push(index + BOARD_SIZE);

    if (getCellBombType(board[index]) && neighborIndexes.some((neighborIndex) => isGemCell(board[neighborIndex]))) {
      return true;
    }

    for (const neighborIndex of neighborIndexes) {
      if (!isGemCell(board[neighborIndex])) continue;
      if (getCellBombType(board[index]) || getCellBombType(board[neighborIndex])) return true;
      if (getCellGemId(board[index]) === getCellGemId(board[neighborIndex])) continue;
      const candidate = [...board];
      [candidate[index], candidate[neighborIndex]] = [candidate[neighborIndex], candidate[index]];
      if (findMatches(candidate).size > 0) return true;
    }
  }

  return false;
}

function createShuffledMatch3Board() {
  const currentBoard = isValidBoard(state.match3Board) ? state.match3Board : createBoard();
  const pool = currentBoard.filter(Boolean);

  for (let attempt = 0; attempt < 160; attempt += 1) {
    const board = shuffleItems(pool);
    if (findMatches(board).size === 0 && hasPossibleMove(board)) return board;
  }

  return createBoard();
}

function swapGems(firstIndex, secondIndex) {
  [state.match3Board[firstIndex], state.match3Board[secondIndex]] = [
    state.match3Board[secondIndex],
    state.match3Board[firstIndex],
  ];
}

function areAdjacent(firstIndex, secondIndex) {
  const firstRow = Math.floor(firstIndex / BOARD_SIZE);
  const firstCol = firstIndex % BOARD_SIZE;
  const secondRow = Math.floor(secondIndex / BOARD_SIZE);
  const secondCol = secondIndex % BOARD_SIZE;
  return Math.abs(firstRow - secondRow) + Math.abs(firstCol - secondCol) === 1;
}

function getSwapMotion(firstIndex, secondIndex) {
  const firstRow = Math.floor(firstIndex / BOARD_SIZE);
  const firstCol = firstIndex % BOARD_SIZE;
  const secondRow = Math.floor(secondIndex / BOARD_SIZE);
  const secondCol = secondIndex % BOARD_SIZE;
  const dx = (secondCol - firstCol) * 112;
  const dy = (secondRow - firstRow) * 112;

  return new Map([
    [firstIndex, { x: dx, y: dy }],
    [secondIndex, { x: -dx, y: -dy }],
  ]);
}

function getOrthogonalNeighbors(index) {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  return [
    row > 0 ? index - BOARD_SIZE : null,
    row < BOARD_SIZE - 1 ? index + BOARD_SIZE : null,
    col > 0 ? index - 1 : null,
    col < BOARD_SIZE - 1 ? index + 1 : null,
  ].filter((neighborIndex) => neighborIndex !== null);
}

function getBombAffectedIndexes(index, bombType) {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  const affected = new Set([index]);

  for (let target = 0; target < BOARD_SIZE * BOARD_SIZE; target += 1) {
    const targetRow = Math.floor(target / BOARD_SIZE);
    const targetCol = target % BOARD_SIZE;
    const dr = Math.abs(targetRow - row);
    const dc = Math.abs(targetCol - col);

    if (bombType === "small" && dr <= 1 && dc <= 1) affected.add(target);
    if (bombType === "medium" && dr + dc <= 2) affected.add(target);
    if (bombType === "large" && dr <= 2 && dc <= 2) affected.add(target);
    if (bombType === "horizontal" && targetRow === row) affected.add(target);
    if (bombType === "vertical" && targetCol === col) affected.add(target);
    if (bombType === "cross" && (targetRow === row || targetCol === col)) affected.add(target);
    if (bombType === "diagonal" && dr === dc) affected.add(target);
  }

  return affected;
}

function addBlockerDamage(plan, index, blastType = "chip") {
  if (!isBlockerCell(state.match3Board[index])) return;
  plan.damagedBlockers.set(index, (plan.damagedBlockers.get(index) ?? 0) + 1);
  if (!plan.blastCells.has(index)) plan.blastCells.set(index, blastType);
}

function addGemClear(plan, index, blastType = null) {
  if (!isGemCell(state.match3Board[index])) return;
  plan.clearGems.add(index);
  if (blastType && !plan.blastCells.has(index)) plan.blastCells.set(index, blastType);

  const bombType = getCellBombType(state.match3Board[index]);
  if (bombType && !plan.triggeredBombs.has(index)) {
    plan.bombQueue.push(index);
  }
}

function createClearPlan(matchIndexes, directBombs = []) {
  const plan = {
    clearGems: new Set(),
    damagedBlockers: new Map(),
    blastCells: new Map(),
    triggeredBombs: new Set(),
    bombQueue: [],
  };

  matchIndexes.forEach((index) => addGemClear(plan, index));
  directBombs.forEach((index) => addGemClear(plan, index, getCellBombType(state.match3Board[index])));

  while (plan.bombQueue.length) {
    const index = plan.bombQueue.shift();
    if (plan.triggeredBombs.has(index)) continue;

    const bombType = getCellBombType(state.match3Board[index]);
    if (!bombType) continue;

    plan.triggeredBombs.add(index);
    plan.blastCells.set(index, bombType);
    getBombAffectedIndexes(index, bombType).forEach((targetIndex) => {
      if (isBlockerCell(state.match3Board[targetIndex])) {
        addBlockerDamage(plan, targetIndex, bombType);
      } else {
        addGemClear(plan, targetIndex, bombType);
      }
    });
  }

  plan.clearGems.forEach((index) => {
    getOrthogonalNeighbors(index).forEach((neighborIndex) => addBlockerDamage(plan, neighborIndex));
  });

  plan.bombQueue = [];
  return plan;
}

function groupsOverlap(firstGroup, secondGroup) {
  return firstGroup.indexes.some((index) => secondGroup.indexes.includes(index));
}

function getSpecialBombType(group, groups) {
  const crossesAnotherGroup = groups.some(
    (otherGroup) => otherGroup !== group && otherGroup.orientation !== group.orientation && groupsOverlap(group, otherGroup),
  );
  const hasSeparateLongGroup = groups.some(
    (otherGroup) => otherGroup !== group && otherGroup.indexes.length >= 4 && !groupsOverlap(group, otherGroup),
  );
  const compactBombGemIds = new Set(["teal", "coral"]);

  if (crossesAnotherGroup) return "cross";
  if (group.indexes.length >= 6) return "large";
  if (group.indexes.length >= 5) return "medium";
  if (hasSeparateLongGroup && group.indexes.length >= 4) return "diagonal";
  if (group.indexes.length === 4 && compactBombGemIds.has(group.gemId)) return "small";
  if (group.indexes.length === 4) return group.orientation === "horizontal" ? "horizontal" : "vertical";
  return null;
}

function createSpecialSpawns(groups, swapIndexes = []) {
  const spawns = new Map();

  groups.forEach((group) => {
    const bombType = getSpecialBombType(group, groups);
    if (!bombType) return;

    const spawnIndex =
      swapIndexes.find((index) => group.indexes.includes(index) && !getCellBombType(state.match3Board[index])) ??
      group.indexes.find((index) => !getCellBombType(state.match3Board[index])) ??
      group.indexes[Math.floor(group.indexes.length / 2)];

    const previousSpawn = spawns.get(spawnIndex);
    const resolvedBombType = previousSpawn && previousSpawn.bombType !== bombType ? "cross" : bombType;
    spawns.set(spawnIndex, {
      index: spawnIndex,
      gemId: group.gemId,
      bombType: resolvedBombType,
    });
  });

  return [...spawns.values()];
}

function countBombsAfterClear(plan) {
  return state.match3Board.reduce((total, cell, index) => {
    if (!getCellBombType(cell) || plan.clearGems.has(index)) return total;
    return total + 1;
  }, 0);
}

function limitSpecialSpawns(spawns, plan) {
  const room = Math.max(0, MAX_BOMBS_ON_BOARD - countBombsAfterClear(plan));
  return spawns.slice(0, room);
}

function applyClearPlan(plan, specialSpawns = []) {
  let destroyedBlockers = 0;

  plan.clearGems.forEach((index) => {
    state.match3Board[index] = null;
  });

  plan.damagedBlockers.forEach((hits, index) => {
    const nextHp = getBlockerHp(state.match3Board[index]) - hits;
    if (nextHp <= 0) {
      destroyedBlockers += 1;
      state.match3Board[index] = null;
    } else {
      state.match3Board[index] = createBlockerCell(nextHp);
    }
  });

  specialSpawns.forEach((spawn) => {
    if (!spawn || typeof spawn.index !== "number") return;
    state.match3Board[spawn.index] = createGemCell(spawn.gemId, spawn.bombType);
  });

  return destroyedBlockers;
}

function collapseBoard() {
  const previousBoard = [...state.match3Board];
  const moved = new Map();
  const cellPitch = getMatch3CellPitch();

  for (let col = 0; col < BOARD_SIZE; col += 1) {
    let segmentBottom = BOARD_SIZE - 1;

    while (segmentBottom >= 0) {
      const bottomIndex = segmentBottom * BOARD_SIZE + col;
      if (isBlockerCell(state.match3Board[bottomIndex])) {
        segmentBottom -= 1;
        continue;
      }

      let segmentTop = segmentBottom;
      while (segmentTop >= 0 && !isBlockerCell(state.match3Board[segmentTop * BOARD_SIZE + col])) {
        segmentTop -= 1;
      }

      const stack = [];
      for (let row = segmentBottom; row > segmentTop; row -= 1) {
        const index = row * BOARD_SIZE + col;
        if (isGemCell(state.match3Board[index])) stack.push({ cell: state.match3Board[index], fromRow: row });
      }

      for (let row = segmentBottom; row > segmentTop; row -= 1) {
        const index = row * BOARD_SIZE + col;
        const nextItem = stack.shift();
        const nextCell = nextItem?.cell ?? createDropCell();
        state.match3Board[index] = nextCell;
        if (previousBoard[index] !== nextCell) {
          const rowsMoved = nextItem ? Math.max(1, row - nextItem.fromRow) : Math.max(1, row - segmentTop);
          moved.set(index, Math.max(cellPitch, rowsMoved * cellPitch));
        }
      }

      segmentBottom = segmentTop - 1;
    }
  }

  return moved;
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function isReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function nextAnimationFrame() {
  return new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
}

function getMatch3Cell(index) {
  return els.match3Board.querySelector(`[data-gem-index="${index}"]`);
}

function getMotionDuration(duration) {
  if (!isReducedMotion()) return duration;
  return Math.max(90, Math.min(duration, Math.round(duration * 0.58)));
}

function animateNode(node, keyframes, options = {}) {
  if (!node) return Promise.resolve();
  const { commitStyles = false, ...animationOptions } = options;
  const duration = getMotionDuration(options.duration ?? 200);
  if (!node.animate || duration <= 1) {
    const finalFrame = Array.isArray(keyframes) ? keyframes[keyframes.length - 1] : keyframes;
    Object.entries(finalFrame ?? {}).forEach(([property, value]) => {
      if (property !== "offset" && property !== "easing") node.style[property] = value;
    });
    return sleep(duration);
  }

  const animation = node.animate(keyframes, {
    fill: animationOptions.fill ?? "both",
    easing: animationOptions.easing ?? "cubic-bezier(0.18, 0.86, 0.24, 1)",
    ...animationOptions,
    duration,
  });

  return animation.finished.catch(() => {}).then(() => {
    if (commitStyles) {
      try {
        animation.commitStyles();
      } catch {}
    }
    animation.cancel();
  });
}

function setStylePropertyIfChanged(node, name, value) {
  if (!node || node.style.getPropertyValue(name) === value) return;
  node.style.setProperty(name, value);
}

function runVisualAnimation(promise) {
  Promise.resolve(promise).catch(() => {});
}

function withAnimationClass(node, className, promise) {
  if (!node) return promise;
  node.classList.add(className);
  return promise.finally(() => node.classList.remove(className));
}

function getRectMap(indexes) {
  const rects = new Map();
  indexes.forEach((index) => {
    const node = getMatch3Cell(index);
    if (node) rects.set(index, node.getBoundingClientRect());
  });
  return rects;
}

function getBoardRect() {
  return els.match3Board.getBoundingClientRect();
}

function getMatch3CellPitch() {
  const firstCell = getMatch3Cell(0);
  const secondCell = getMatch3Cell(1);
  if (firstCell && secondCell) {
    const firstRect = firstCell.getBoundingClientRect();
    const secondRect = secondCell.getBoundingClientRect();
    const pitch = Math.max(Math.abs(secondRect.left - firstRect.left), firstRect.height);
    if (Number.isFinite(pitch) && pitch > 0) return pitch;
  }
  const boardRect = getBoardRect();
  return boardRect.width > 0 ? boardRect.width / BOARD_SIZE : 72;
}

function getCellDelay(index, anchorIndex = null) {
  if (anchorIndex === null) return ((Math.floor(index / BOARD_SIZE) + (index % BOARD_SIZE)) % 4) * MATCH3_CLEAR_STAGGER;
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  const anchorRow = Math.floor(anchorIndex / BOARD_SIZE);
  const anchorCol = anchorIndex % BOARD_SIZE;
  return Math.min(90, (Math.abs(row - anchorRow) + Math.abs(col - anchorCol)) * MATCH3_CLEAR_STAGGER);
}

async function playGemSwap(firstIndex, secondIndex, { invalidReturn = false } = {}) {
  const firstNode = getMatch3Cell(firstIndex);
  const secondNode = getMatch3Cell(secondIndex);
  if (!firstNode || !secondNode) return;

  const firstRect = firstNode.getBoundingClientRect();
  const secondRect = secondNode.getBoundingClientRect();
  const firstDx = secondRect.left - firstRect.left;
  const firstDy = secondRect.top - firstRect.top;
  const secondDx = -firstDx;
  const secondDy = -firstDy;
  const duration = invalidReturn ? 230 : MATCH3_SWAP_DURATION;
  const easing = invalidReturn ? "cubic-bezier(0.22, 0.82, 0.28, 1)" : "cubic-bezier(0.18, 0.72, 0.2, 1)";
  const wiggleX = invalidReturn ? (Math.abs(firstDx) > Math.abs(firstDy) ? 5 : 0) : 0;
  const wiggleY = invalidReturn ? (Math.abs(firstDy) >= Math.abs(firstDx) ? 5 : 0) : 0;

  const buildFrames = (dx, dy, wiggleSign = 1) =>
    invalidReturn
      ? [
          { transform: "translate3d(0, 0, 0) scale(1)", offset: 0 },
          { transform: `translate3d(${dx * 0.55}px, ${dy * 0.55}px, 0) scale(1.06)`, offset: 0.48 },
          {
            transform: `translate3d(${dx + wiggleX * wiggleSign}px, ${dy + wiggleY * wiggleSign}px, 0) scale(0.985)`,
            offset: 0.78,
          },
          { transform: `translate3d(${dx}px, ${dy}px, 0) scale(1)`, offset: 1 },
        ]
      : [
          { transform: "translate3d(0, 0, 0) scale(1)", offset: 0 },
          { transform: `translate3d(${dx * 0.28}px, ${dy * 0.28}px, 0) scale(1.08, 0.96)`, offset: 0.24 },
          { transform: `translate3d(${dx * 0.72}px, ${dy * 0.72}px, 0) scale(1.03, 1.04)`, offset: 0.66 },
          { transform: `translate3d(${dx}px, ${dy}px, 0) scale(1)`, offset: 1 },
        ];

  await Promise.all([
    withAnimationClass(
      firstNode,
      "is-anim-swapping",
      animateNode(firstNode, buildFrames(firstDx, firstDy, 1), { duration, easing, commitStyles: true }),
    ),
    withAnimationClass(
      secondNode,
      "is-anim-swapping",
      animateNode(secondNode, buildFrames(secondDx, secondDy, -1), { duration, easing, commitStyles: true }),
    ),
  ]);
}

function createMatch3FxNode(className, rect, extraClass = "") {
  const node = document.createElement("span");
  node.className = `${className} ${extraClass}`.trim();
  node.style.left = `${rect.left + rect.width / 2}px`;
  node.style.top = `${rect.top + rect.height / 2}px`;
  node.style.setProperty("--cell-size", `${Math.max(rect.width, rect.height)}px`);
  appendMatch3FxNode(node);
  return node;
}

function getMatch3FxLayer() {
  let layer = document.querySelector("#match3FxLayer");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "match3FxLayer";
    layer.className = "match3-fx-layer";
    document.body.append(layer);
  }
  return layer;
}

function appendMatch3FxNode(node) {
  getMatch3FxLayer().append(node);
  return node;
}

function playCellFlash(rect, color, delay = 0, sizeMultiplier = 1) {
  const flash = createMatch3FxNode("match3-cell-flash", rect);
  flash.style.setProperty("--fx-color", color);
  flash.style.width = `${rect.width * sizeMultiplier}px`;
  flash.style.height = `${rect.height * sizeMultiplier}px`;
  return animateNode(
    flash,
    [
      { opacity: 0, transform: "translate(-50%, -50%) scale(0.38)" },
      { opacity: 0.78, transform: "translate(-50%, -50%) scale(0.92)", offset: 0.34 },
      { opacity: 0, transform: "translate(-50%, -50%) scale(1.28)" },
    ],
    { duration: 190, delay, easing: "cubic-bezier(0.16, 0.84, 0.22, 1)" },
  ).finally(() => flash.remove());
}

function playCrystalPop(rect, palette, delay = 0, { strong = false } = {}) {
  const pop = createMatch3FxNode("match3-crystal-pop", rect, strong ? "is-strong" : "");
  pop.style.setProperty("--fx-a", palette[0]);
  pop.style.setProperty("--fx-b", palette[1] ?? palette[0]);
  pop.style.setProperty("--fx-c", palette[2] ?? palette[1] ?? palette[0]);
  pop.style.width = `${rect.width * (strong ? 1.18 : 0.98)}px`;
  pop.style.height = `${rect.height * (strong ? 1.18 : 0.98)}px`;
  return animateNode(
    pop,
    [
      { opacity: 0, transform: "translate(-50%, -50%) scale(0.42) rotate(-8deg)" },
      { opacity: 1, transform: "translate(-50%, -50%) scale(1.08) rotate(4deg)", offset: 0.34 },
      { opacity: 0.78, transform: "translate(-50%, -50%) scale(1.22) rotate(10deg)", offset: 0.62 },
      { opacity: 0, transform: "translate(-50%, -50%) scale(1.44) rotate(18deg)" },
    ],
    { duration: strong ? 230 : 195, delay, easing: "cubic-bezier(0.16, 0.78, 0.2, 1)" },
  ).finally(() => pop.remove());
}

function playBlockerHitFlash(rect, delay = 0, { breaking = false } = {}) {
  const chip = createMatch3FxNode("match3-blocker-hit", rect, breaking ? "is-breaking" : "");
  chip.style.width = `${rect.width * 0.95}px`;
  chip.style.height = `${rect.height * 0.95}px`;
  return animateNode(
    chip,
    [
      { opacity: 0, transform: "translate(-50%, -50%) scale(0.72) rotate(0deg)" },
      { opacity: 0.95, transform: "translate(-50%, -50%) scale(1.03) rotate(-2deg)", offset: 0.28 },
      { opacity: 0, transform: `translate(-50%, -50%) scale(${breaking ? 1.42 : 1.12}) rotate(6deg)` },
    ],
    { duration: breaking ? 220 : 170, delay, easing: "cubic-bezier(0.18, 0.84, 0.22, 1)" },
  ).finally(() => chip.remove());
}

function playBombDetonationCore(rect, color, bombType, delay = 0) {
  const core = createMatch3FxNode("match3-bomb-core", rect, `is-${bombType}`);
  core.style.setProperty("--fx-color", color);
  core.style.width = `${rect.width * (bombType === "large" ? 1.38 : bombType === "small" ? 0.96 : 1.14)}px`;
  core.style.height = `${rect.height * (bombType === "large" ? 1.38 : bombType === "small" ? 0.96 : 1.14)}px`;
  return animateNode(
    core,
    [
      { opacity: 0, transform: "translate(-50%, -50%) scale(0.18) rotate(0deg)" },
      { opacity: 1, transform: "translate(-50%, -50%) scale(0.86) rotate(45deg)", offset: 0.22 },
      { opacity: 0.86, transform: "translate(-50%, -50%) scale(1.08) rotate(110deg)", offset: 0.48 },
      { opacity: 0, transform: "translate(-50%, -50%) scale(1.42) rotate(180deg)" },
    ],
    { duration: bombType === "large" ? 440 : 360, delay, easing: "cubic-bezier(0.12, 0.82, 0.18, 1)" },
  ).finally(() => core.remove());
}

function playBombCharge(rect, color, bombType, delay = 0) {
  const charge = createMatch3FxNode("match3-bomb-charge", rect, `is-${bombType}`);
  charge.style.setProperty("--fx-color", color);
  charge.style.width = `${rect.width * 1.18}px`;
  charge.style.height = `${rect.height * 1.18}px`;
  return animateNode(
    charge,
    [
      { opacity: 0, transform: "translate(-50%, -50%) scale(0.18) rotate(0deg)" },
      { opacity: 0.86, transform: "translate(-50%, -50%) scale(0.72) rotate(45deg)", offset: 0.28 },
      { opacity: 1, transform: "translate(-50%, -50%) scale(1.04) rotate(135deg)", offset: 0.68 },
      { opacity: 0, transform: "translate(-50%, -50%) scale(1.24) rotate(225deg)" },
    ],
    { duration: bombType === "large" ? 300 : 250, delay, easing: "cubic-bezier(0.18, 0.72, 0.18, 1)" },
  ).finally(() => charge.remove());
}

function playBombShockwave(rect, color, bombType, delay = 0) {
  const wave = createMatch3FxNode("match3-bomb-shockwave", rect, `is-${bombType}`);
  const size = bombType === "large" ? 3.15 : bombType === "medium" ? 2.42 : bombType === "small" ? 1.72 : 2.05;
  wave.style.setProperty("--fx-color", color);
  wave.style.width = `${rect.width * size}px`;
  wave.style.height = `${rect.height * size}px`;
  return animateNode(
    wave,
    [
      { opacity: 0, transform: "translate(-50%, -50%) scale(0.12) rotate(0deg)" },
      { opacity: 0.92, transform: "translate(-50%, -50%) scale(0.42) rotate(6deg)", offset: 0.2 },
      { opacity: 0.55, transform: "translate(-50%, -50%) scale(0.82) rotate(-4deg)", offset: 0.58 },
      { opacity: 0, transform: "translate(-50%, -50%) scale(1.16) rotate(0deg)" },
    ],
    { duration: bombType === "large" ? 760 : 620, delay, easing: "cubic-bezier(0.14, 0.72, 0.18, 1)" },
  ).finally(() => wave.remove());
}

function playLineSweepHead(rect, { color, orientation = "horizontal", direction = 1, delay = 0 } = {}) {
  const boardRect = getBoardRect();
  const head = document.createElement("span");
  head.className = `match3-bomb-line-head ${orientation === "vertical" ? "is-vertical" : ""}`.trim();
  head.style.setProperty("--fx-color", color);
  head.style.left = `${rect.left + rect.width / 2}px`;
  head.style.top = `${rect.top + rect.height / 2}px`;
  head.style.width = `${Math.max(18, rect.width * 0.52)}px`;
  head.style.height = `${Math.max(18, rect.height * 0.52)}px`;
  appendMatch3FxNode(head);

  const distance =
    orientation === "vertical"
      ? direction > 0
        ? boardRect.bottom - (rect.top + rect.height / 2)
        : rect.top + rect.height / 2 - boardRect.top
      : direction > 0
        ? boardRect.right - (rect.left + rect.width / 2)
        : rect.left + rect.width / 2 - boardRect.left;
  const axis = orientation === "vertical" ? "Y" : "X";

  return animateNode(
    head,
    [
      { opacity: 0, transform: `translate(-50%, -50%) translate${axis}(0px) scale(0.58)` },
      { opacity: 1, transform: `translate(-50%, -50%) translate${axis}(${direction * distance * 0.2}px) scale(1.06)`, offset: 0.22 },
      { opacity: 1, transform: `translate(-50%, -50%) translate${axis}(${direction * distance * 0.74}px) scale(0.96)`, offset: 0.72 },
      { opacity: 0, transform: `translate(-50%, -50%) translate${axis}(${direction * distance}px) scale(0.66)` },
    ],
    { duration: 560, delay, easing: "cubic-bezier(0.12, 0.72, 0.2, 1)" },
  ).finally(() => head.remove());
}

function getBlastVector(index, anchorIndex, bombType) {
  if (anchorIndex === null || anchorIndex === undefined || !bombType) {
    return { x: Math.random() > 0.5 ? 1 : -1, y: 0.55 + Math.random() * 0.45 };
  }

  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  const anchorRow = Math.floor(anchorIndex / BOARD_SIZE);
  const anchorCol = anchorIndex % BOARD_SIZE;
  const rawX = col - anchorCol;
  const rawY = row - anchorRow;
  const signX = rawX === 0 ? (Math.random() > 0.5 ? 1 : -1) : Math.sign(rawX);
  const signY = rawY === 0 ? (Math.random() > 0.5 ? 1 : -1) : Math.sign(rawY);

  if (bombType === "horizontal") return { x: signX, y: -0.22 + Math.random() * 0.44 };
  if (bombType === "vertical") return { x: -0.22 + Math.random() * 0.44, y: signY };
  if (bombType === "cross") {
    return Math.abs(rawX) >= Math.abs(rawY)
      ? { x: signX, y: -0.2 + Math.random() * 0.4 }
      : { x: -0.2 + Math.random() * 0.4, y: signY };
  }
  if (bombType === "diagonal") {
    return { x: signX, y: signY };
  }
  if (["small", "medium", "large"].includes(bombType)) {
    const length = Math.max(1, Math.hypot(rawX, rawY));
    return { x: rawX / length || signX * 0.7, y: rawY / length || signY * 0.7 };
  }
  return { x: signX * 0.7, y: 0.65 };
}

function spawnMatch3ShatterPieces(indexes, blockerIndexes = new Set(), blastMap = new Map(), anchorIndex = null) {
  const rects = getRectMap([...indexes, ...blockerIndexes]);
  const animations = [];
  const allIndexes = [...new Set([...indexes, ...blockerIndexes])];

  allIndexes.forEach((index) => {
    const rect = rects.get(index);
    if (!rect) return;

    const cell = normalizeCell(state.match3Board[index]);
    const isBlocker = cell.type === "blocker";
    const bombType = blastMap.get(index) || getCellBombType(state.match3Board[index]);
    const blastVector = getBlastVector(index, anchorIndex, bombType);
    const palette = isBlocker ? ["#d6dae2", "#8d96a5", "#3b4350"] : getGemPixelPalette(cell.gemId);
    const delay = bombType ? Math.min(150, 110 + getCellDelay(index, anchorIndex) * 1.15) : Math.min(38, getCellDelay(index, anchorIndex));
    const pieces = bombType ? 7 : isBlocker ? 6 : 5;
    const pieceSize = Math.max(13, Math.min(rect.width, rect.height) * (bombType ? 0.3 : 0.25));

    for (let piece = 0; piece < pieces; piece += 1) {
      if (activeMatch3Particles >= MATCH3_MAX_ACTIVE_PARTICLES) break;
      const node = document.createElement("span");
      const startX = rect.left + rect.width * (0.3 + Math.random() * 0.4);
      const startY = rect.top + rect.height * (0.28 + Math.random() * 0.28);
      const side = piece % 2 === 0 ? -1 : 1;
      const isLineBlast = ["horizontal", "vertical", "cross", "diagonal"].includes(bombType);
      const blastForce = bombType ? (isLineBlast ? 118 : 96) : 38;
      const scatterX = (Math.random() - 0.5) * (bombType ? 42 : 24);
      const scatterY = (Math.random() - 0.5) * (bombType ? 34 : 18);
      const dx = blastVector.x * (blastForce + Math.random() * (bombType ? 96 : 38)) + scatterX;
      const lift = bombType ? 12 + Math.random() * 28 : 10 + Math.random() * 16;
      const lineDy = isLineBlast ? blastVector.y * (74 + Math.random() * 66) + scatterY : 0;
      const fall = rect.height * (bombType ? 1.34 + Math.random() * 1.18 : 0.88 + Math.random() * 0.52);
      const rotate = side * (72 + Math.random() * 210);
      const colorA = palette[piece % palette.length];
      const colorB = palette[(piece + 1) % palette.length] ?? colorA;
      const duration = bombType ? 560 + Math.random() * 140 : 390 + Math.random() * 90;

      node.className = `match3-shatter-piece ${bombType ? "is-bomb-piece" : ""} ${isBlocker ? "is-blocker-piece" : ""}`;
      node.style.left = `${startX}px`;
      node.style.top = `${startY}px`;
      node.style.width = `${pieceSize * (0.82 + Math.random() * 0.42)}px`;
      node.style.height = `${pieceSize * (0.72 + Math.random() * 0.42)}px`;
      node.style.setProperty("--piece-a", colorA);
      node.style.setProperty("--piece-b", colorB);
      node.style.setProperty("--piece-shadow", palette[2] ?? colorB);
      appendMatch3FxNode(node);
      activeMatch3Particles += 1;

      animations.push(
        animateNode(
          node,
          [
            { opacity: 0, transform: "translate3d(0, 0, 0) scale(0.42) rotate(0deg)" },
            {
              opacity: 1,
              transform: `translate3d(${dx * 0.34}px, ${lineDy * 0.22 - lift}px, 0) scale(1.08) rotate(${rotate * 0.32}deg)`,
              offset: 0.2,
            },
            {
              opacity: 1,
              transform: `translate3d(${dx * 0.78}px, ${lineDy * 0.72 + fall * 0.32}px, 0) scale(0.94) rotate(${rotate * 0.74}deg)`,
              offset: 0.58,
            },
            {
              opacity: 0.08,
              transform: `translate3d(${dx * 1.42}px, ${lineDy + fall}px, 0) scale(0.5) rotate(${rotate}deg)`,
            },
          ],
          { duration, delay, easing: "cubic-bezier(0.17, 0.72, 0.22, 1)" },
        ).finally(() => {
          activeMatch3Particles = Math.max(0, activeMatch3Particles - 1);
          node.remove();
        }),
      );
    }
  });

  return Promise.all(animations);
}

function spawnMatch3Debris(gemIndexes, blockerIndexes = new Set(), blastMap = new Map(), anchorIndex = null) {
  const indexes = [...new Set([...gemIndexes, ...blockerIndexes])];
  const rects = getRectMap(indexes);
  const animations = [];

  indexes.forEach((index) => {
    const rect = rects.get(index);
    if (!rect) return;

    const cell = normalizeCell(state.match3Board[index]);
    const isBlocker = cell.type === "blocker";
    const bombType = blastMap.get(index) || getCellBombType(state.match3Board[index]);
    const blastVector = getBlastVector(index, anchorIndex, bombType);
    const palette = isBlocker ? ["#c4c8cf", "#747b88", "#303744"] : getGemPixelPalette(cell.gemId);
    const pieces = bombType ? 7 + Math.floor(Math.random() * 3) : isBlocker ? 5 + Math.floor(Math.random() * 2) : 3 + Math.floor(Math.random() * 3);
    const delay = bombType ? Math.min(165, 118 + getCellDelay(index, anchorIndex) * 1.2) : Math.min(38, getCellDelay(index, anchorIndex));

    for (let piece = 0; piece < pieces; piece += 1) {
      if (activeMatch3Particles >= MATCH3_MAX_ACTIVE_PARTICLES) break;
      const node = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const distance = (bombType ? 76 : isBlocker ? 26 : 20) + Math.random() * (bombType ? 110 : 28);
      const rise = 8 + Math.random() * (bombType ? 26 : 15);
      const size = 4 + Math.random() * (bombType ? 4 : 3);
      const color = palette[piece % palette.length];
      const startX = rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.38;
      const startY = rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height * 0.38;
      const dx = bombType ? blastVector.x * distance + Math.cos(angle) * distance * 0.46 : Math.cos(angle) * distance;
      const dy = bombType ? blastVector.y * distance * 0.92 + Math.sin(angle) * distance * 0.38 - rise : Math.sin(angle) * distance * 0.55 - rise;
      const rotate = Math.round((Math.random() - 0.5) * 620);
      const duration = bombType
        ? 520 + Math.random() * 120
        : isBlocker
          ? 350 + Math.random() * 90
          : 320 + Math.random() * 90;

      node.className = `match3-debris is-controlled ${bombType ? "is-bomb-debris" : ""} ${isBlocker ? "is-blocker-debris" : ""}`;
      node.style.left = `${startX}px`;
      node.style.top = `${startY}px`;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      node.style.background = color;
      node.style.setProperty("--debris-color", color);
      appendMatch3FxNode(node);
      activeMatch3Particles += 1;
      animations.push(
        animateNode(
          node,
          [
            { opacity: 0, transform: "translate3d(0, 0, 0) scale(0.6) rotate(0deg)" },
            {
              opacity: 1,
              transform: `translate3d(${dx * 0.2}px, ${dy * 0.2}px, 0) scale(1.12) rotate(${rotate * 0.2}deg)`,
              offset: 0.18,
            },
            {
              opacity: 1,
              transform: `translate3d(${dx * 0.82}px, ${dy * 0.82}px, 0) scale(1) rotate(${rotate * 0.72}deg)`,
              offset: 0.62,
            },
            {
              opacity: 0,
              transform: `translate3d(${dx}px, ${dy + 70 + Math.random() * 58}px, 0) scale(0.62) rotate(${rotate}deg)`,
            },
          ],
          { duration, delay, easing: "cubic-bezier(0.16, 0.78, 0.2, 1)" },
        ).finally(() => {
          activeMatch3Particles = Math.max(0, activeMatch3Particles - 1);
          node.remove();
        }),
      );
    }
  });

  return Promise.all(animations);
}

async function playMatch3ClearAnimation(clearPlan, clearingBlockerIndexes) {
  const clearIndexes = [...clearPlan.clearGems];
  const blockerIndexes = [...clearPlan.damagedBlockers.keys()];
  const anchorIndex = [...clearPlan.triggeredBombs][0] ?? clearIndexes[0] ?? blockerIndexes[0] ?? null;
  const rects = getRectMap([...clearIndexes, ...blockerIndexes]);
  const animations = [];

  clearIndexes.forEach((index) => {
    const node = getMatch3Cell(index);
    const rect = rects.get(index);
    if (!node || !rect) return;

    const cell = normalizeCell(state.match3Board[index]);
    const bombType = clearPlan.blastCells.get(index) || getCellBombType(state.match3Board[index]);
    const palette = getGemPixelPalette(cell.gemId);
    const delay = bombType ? Math.min(145, 92 + getCellDelay(index, anchorIndex)) : Math.min(38, getCellDelay(index, anchorIndex));
    node.style.setProperty("--anim-clear-delay", `${delay}ms`);
    animations.push(playCellFlash(rect, palette[0], delay, bombType ? 1.24 : 0.98));
    animations.push(playCrystalPop(rect, palette, delay + 18, { strong: Boolean(bombType) }));
    animations.push(
      withAnimationClass(
        node,
        "is-anim-clearing",
        animateNode(
          node,
          [
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
            {
              opacity: 1,
              transform: "translate3d(0, -2px, 0) scale(1.12)",
              filter: "brightness(1.35) saturate(1.18)",
              offset: 0.36,
            },
            {
              opacity: 0,
              transform: "translate3d(0, 8px, 0) scale(0)",
              filter: "brightness(1.55) saturate(0.9)",
            },
          ],
          { duration: MATCH3_CLEAR_DURATION, delay, easing: "cubic-bezier(0.2, 0.84, 0.26, 1)", commitStyles: true },
        ),
      ),
    );
  });

  blockerIndexes.forEach((index) => {
    const node = getMatch3Cell(index);
    if (!node) return;
    const shouldBreak = clearingBlockerIndexes.has(index);
    const delay = Math.min(44, getCellDelay(index, anchorIndex));
    const rect = rects.get(index);
    if (rect) animations.push(playBlockerHitFlash(rect, delay, { breaking: shouldBreak }));
    animations.push(
      withAnimationClass(
        node,
        shouldBreak ? "is-anim-clearing" : "is-anim-cracking",
        animateNode(
          node,
          shouldBreak
            ? [
                { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
                { opacity: 1, transform: "translate3d(-2px, -1px, 0) scale(1.12) rotate(-3deg)", offset: 0.38 },
                { opacity: 0, transform: "translate3d(4px, 10px, 0) scale(0.08) rotate(16deg)" },
              ]
            : [
                { transform: "translate3d(0, 0, 0) rotate(0deg)", filter: "brightness(1)" },
                { transform: "translate3d(-3px, 1px, 0) rotate(-2deg)", filter: "brightness(1.28)", offset: 0.32 },
                { transform: "translate3d(3px, -1px, 0) rotate(2deg)", filter: "brightness(1.12)", offset: 0.68 },
                { transform: "translate3d(0, 0, 0) rotate(0deg)", filter: "brightness(1)" },
              ],
          {
            duration: shouldBreak ? 245 : 220,
            delay,
            easing: "cubic-bezier(0.18, 0.86, 0.22, 1)",
            commitStyles: shouldBreak,
          },
        ),
      ),
    );
  });

  animations.push(spawnMatch3ShatterPieces(clearPlan.clearGems, clearingBlockerIndexes, clearPlan.blastCells, anchorIndex));
  animations.push(spawnMatch3Debris(clearPlan.clearGems, clearingBlockerIndexes, clearPlan.blastCells, anchorIndex));
  await Promise.all(animations);
}

async function playGemFallAnimations(fallMap) {
  if (!fallMap.size) return;
  await nextAnimationFrame();
  const maxDistance = Math.max(...fallMap.values(), 1);
  const animations = [...fallMap.entries()].map(([index, distance]) => {
    const node = getMatch3Cell(index);
    if (!node) return Promise.resolve();
    const normalizedDistance = Math.min(1, distance / maxDistance);
    const duration = MATCH3_FALL_MIN_DURATION + (MATCH3_FALL_MAX_DURATION - MATCH3_FALL_MIN_DURATION) * normalizedDistance;
    const delay = Math.min(48, Math.floor(index / BOARD_SIZE) * 6 + (index % BOARD_SIZE) * 3);
    const sway = Math.sin(index * 1.73) * Math.min(9, 3 + distance * 0.035);

    return withAnimationClass(
      node,
      "is-anim-falling",
      animateNode(
        node,
        [
          { opacity: 0.22, transform: `translate3d(${sway * -0.35}px, ${-distance}px, 0) scale(0.86, 1.13)` },
          { opacity: 0.88, transform: `translate3d(${sway}px, ${-distance * 0.48}px, 0) scale(0.94, 1.08)`, offset: 0.34 },
          { opacity: 1, transform: `translate3d(${sway * -0.28}px, 5px, 0) scale(1.03, 0.97)`, offset: 0.76 },
          { opacity: 1, transform: "translate3d(0, -3px, 0) scale(0.98, 1.04)", offset: 0.88 },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1.05, 0.92)", offset: 0.95 },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
        ],
        { duration, delay, easing: "cubic-bezier(0.18, 0.64, 0.22, 1)" },
      ),
    );
  });
  await Promise.all(animations);
}

function getBombFxColor(bombType) {
  return getBombType(bombType)?.colors[0] ?? "#9dfbff";
}

function playLineArm(rect, { color, orientation = "horizontal", direction = 1, delay = 0 } = {}) {
  const boardRect = getBoardRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distance =
    orientation === "vertical"
      ? direction > 0
        ? boardRect.bottom - centerY
        : centerY - boardRect.top
      : direction > 0
        ? boardRect.right - centerX
        : centerX - boardRect.left;
  const arm = document.createElement("span");
  arm.className = `match3-bomb-line-arm ${orientation === "vertical" ? "is-vertical" : ""} ${direction < 0 ? "is-reverse" : ""}`.trim();
  arm.style.setProperty("--fx-color", color);

  if (orientation === "vertical") {
    arm.style.left = `${centerX}px`;
    arm.style.top = `${centerY + (direction * distance) / 2}px`;
    arm.style.width = `${Math.max(12, rect.width * 0.34)}px`;
    arm.style.height = `${Math.max(1, distance)}px`;
  } else {
    arm.style.left = `${centerX + (direction * distance) / 2}px`;
    arm.style.top = `${centerY}px`;
    arm.style.width = `${Math.max(1, distance)}px`;
    arm.style.height = `${Math.max(12, rect.height * 0.34)}px`;
  }

  appendMatch3FxNode(arm);
  return animateNode(
    arm,
    orientation === "vertical"
      ? [
          { opacity: 0, transform: "translate(-50%, -50%) scaleY(0.02) scaleX(0.78)" },
          { opacity: 1, transform: "translate(-50%, -50%) scaleY(0.42) scaleX(1.08)", offset: 0.28 },
          { opacity: 0.92, transform: "translate(-50%, -50%) scaleY(1) scaleX(0.92)", offset: 0.74 },
          { opacity: 0, transform: "translate(-50%, -50%) scaleY(1.06) scaleX(0.5)" },
        ]
      : [
          { opacity: 0, transform: "translate(-50%, -50%) scaleX(0.02) scaleY(0.78)" },
          { opacity: 1, transform: "translate(-50%, -50%) scaleX(0.42) scaleY(1.08)", offset: 0.28 },
          { opacity: 0.92, transform: "translate(-50%, -50%) scaleX(1) scaleY(0.92)", offset: 0.74 },
          { opacity: 0, transform: "translate(-50%, -50%) scaleX(1.06) scaleY(0.5)" },
        ],
    { duration: 620, delay, easing: "cubic-bezier(0.12, 0.72, 0.2, 1)" },
  ).finally(() => arm.remove());
}

function playLineEffect(rect, { color, orientation = "horizontal", delay = 0, className = "" } = {}) {
  const boardRect = getBoardRect();
  const line = document.createElement("span");
  line.className = `match3-bomb-line ${orientation === "vertical" ? "is-vertical" : ""} ${className}`.trim();
  line.style.setProperty("--fx-color", color);
  if (orientation === "vertical") {
    line.style.left = `${rect.left + rect.width / 2}px`;
    line.style.top = `${boardRect.top + boardRect.height / 2}px`;
    line.style.width = `${Math.max(12, rect.width * 0.34)}px`;
    line.style.height = `${boardRect.height}px`;
  } else {
    line.style.left = `${boardRect.left + boardRect.width / 2}px`;
    line.style.top = `${rect.top + rect.height / 2}px`;
    line.style.width = `${boardRect.width}px`;
    line.style.height = `${Math.max(12, rect.height * 0.34)}px`;
  }
  appendMatch3FxNode(line);
  const armDelay = delay + 90;
  return Promise.all([
    playLineArm(rect, { color, orientation, direction: -1, delay: armDelay }),
    playLineArm(rect, { color, orientation, direction: 1, delay: armDelay }),
    playLineSweepHead(rect, { color, orientation, direction: -1, delay: armDelay + 20 }),
    playLineSweepHead(rect, { color, orientation, direction: 1, delay: armDelay + 20 }),
    animateNode(
      line,
      orientation === "vertical"
        ? [
            { opacity: 0, transform: "translate(-50%, -50%) scaleY(0.02) scaleX(0.82)" },
            { opacity: 0.45, transform: "translate(-50%, -50%) scaleY(0.38) scaleX(0.86)", offset: 0.34 },
            { opacity: 0.72, transform: "translate(-50%, -50%) scaleY(1.04) scaleX(0.88)", offset: 0.72 },
            { opacity: 0, transform: "translate(-50%, -50%) scaleY(1.18) scaleX(0.48)" },
          ]
        : [
            { opacity: 0, transform: "translate(-50%, -50%) scaleX(0.02) scaleY(0.82)" },
            { opacity: 0.45, transform: "translate(-50%, -50%) scaleX(0.38) scaleY(0.86)", offset: 0.34 },
            { opacity: 0.72, transform: "translate(-50%, -50%) scaleX(1.04) scaleY(0.88)", offset: 0.72 },
            { opacity: 0, transform: "translate(-50%, -50%) scaleX(1.18) scaleY(0.48)" },
          ],
      { duration: 660, delay: armDelay, easing: "cubic-bezier(0.14, 0.78, 0.2, 1)" },
    ).finally(() => line.remove()),
  ]);
}

function playRingEffect(rect, { color, delay = 0, size = 1.7, duration = 320, className = "" } = {}) {
  const ring = createMatch3FxNode("match3-bomb-ring", rect, className);
  ring.style.setProperty("--fx-color", color);
  ring.style.width = `${rect.width * size}px`;
  ring.style.height = `${rect.height * size}px`;
  return animateNode(
    ring,
    [
      { opacity: 0, transform: "translate(-50%, -50%) scale(0.28)" },
      { opacity: 0.92, transform: "translate(-50%, -50%) scale(0.72)", offset: 0.28 },
      { opacity: 0, transform: "translate(-50%, -50%) scale(1.15)" },
    ],
    { duration, delay, easing: "cubic-bezier(0.12, 0.82, 0.2, 1)" },
  ).finally(() => ring.remove());
}

function playSmallBombEffect(rect, color, delay = 0) {
  const animations = [playCellFlash(rect, color, delay, 1.05)];
  const vectors = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];

  vectors.forEach(([x, y], index) => {
    const pulse = createMatch3FxNode("match3-bomb-pulse", rect);
    pulse.style.setProperty("--fx-color", color);
    pulse.style.width = `${Math.max(14, rect.width * 0.4)}px`;
    pulse.style.height = `${Math.max(7, rect.height * 0.14)}px`;
    pulse.style.rotate = `${Math.atan2(y, x)}rad`;
    animations.push(
      animateNode(
        pulse,
        [
          { opacity: 0, transform: "translate(-50%, -50%) translate3d(0, 0, 0) scaleX(0.5)" },
          {
            opacity: 0.95,
            transform: `translate(-50%, -50%) translate3d(${x * rect.width * 0.32}px, ${y * rect.height * 0.32}px, 0) scaleX(1.14)`,
            offset: 0.35,
          },
          {
            opacity: 0,
            transform: `translate(-50%, -50%) translate3d(${x * rect.width * 0.72}px, ${y * rect.height * 0.72}px, 0) scaleX(0.3)`,
          },
        ],
        { duration: 340, delay: delay + index * 34, easing: "cubic-bezier(0.14, 0.82, 0.2, 1)" },
      ).finally(() => pulse.remove()),
    );
  });

  return Promise.all(animations);
}

function playDiagonalBombEffect(rect, color, delay = 0) {
  const boardRect = getBoardRect();
  const diagonalLength = Math.hypot(boardRect.width, boardRect.height);
  return Promise.all(
    [45, -45].map((angle, index) => {
      const line = document.createElement("span");
      line.className = "match3-bomb-line is-diagonal";
      line.style.setProperty("--fx-color", color);
      line.style.left = `${boardRect.left + boardRect.width / 2}px`;
      line.style.top = `${boardRect.top + boardRect.height / 2}px`;
      line.style.width = `${diagonalLength}px`;
      line.style.height = `${Math.max(7, rect.height * 0.16)}px`;
      line.style.rotate = `${angle}deg`;
      appendMatch3FxNode(line);
      return animateNode(
        line,
        [
          { opacity: 0, transform: "translate(-50%, -50%) scaleX(0.04)" },
          { opacity: 0.88, transform: "translate(-50%, -50%) scaleX(1.02)", offset: 0.34 },
          { opacity: 0, transform: "translate(-50%, -50%) scaleX(1.18)" },
        ],
        { duration: 520, delay: delay + index * 72, easing: "cubic-bezier(0.12, 0.82, 0.22, 1)" },
      ).finally(() => line.remove());
    }),
  );
}

function playLargeScreenShake() {
  const shell = document.querySelector(".game-shell");
  if (!shell) return Promise.resolve();
  return animateNode(
    shell,
    [
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(-2px, 1px, 0)", offset: 0.2 },
      { transform: "translate3d(2px, -1px, 0)", offset: 0.42 },
      { transform: "translate3d(-1px, 1px, 0)", offset: 0.68 },
      { transform: "translate3d(0, 0, 0)" },
    ],
    { duration: 240, easing: "linear" },
  );
}

function playBombEffect(bombType, index) {
  const node = getMatch3Cell(index);
  if (!node || !bombType) return Promise.resolve();

  const rect = node.getBoundingClientRect();
  const color = getBombFxColor(bombType);
  const animations = [
    playBombCharge(rect, color, bombType),
    playBombDetonationCore(rect, color, bombType, 60),
    playBombShockwave(rect, color, bombType, 155),
    withAnimationClass(
      node,
      "is-anim-bomb",
      animateNode(
        node,
        [
          { transform: "translate3d(0, 0, 0) scale(1)", filter: "brightness(1)" },
          { transform: "translate3d(0, -2px, 0) scale(1.14)", filter: "brightness(1.45)", offset: 0.36 },
          { transform: "translate3d(0, 0, 0) scale(1)", filter: "brightness(1)" },
        ],
        { duration: 370, easing: "cubic-bezier(0.14, 0.84, 0.22, 1)" },
      ),
    ),
  ];

  if (bombType === "small") animations.push(playSmallBombEffect(rect, color, 120));
  if (bombType === "horizontal") animations.push(playLineEffect(rect, { color, orientation: "horizontal", delay: 95 }));
  if (bombType === "vertical") animations.push(playLineEffect(rect, { color, orientation: "vertical", delay: 95 }));
  if (bombType === "cross") {
    animations.push(playLineEffect(rect, { color, orientation: "horizontal", delay: 90 }));
    animations.push(playLineEffect(rect, { color, orientation: "vertical", delay: 155 }));
  }
  if (bombType === "medium") {
    animations.push(playRingEffect(rect, { color, delay: 130, size: 2.05, duration: 520 }));
    animations.push(playCellFlash(rect, color, 100, 1.18));
  }
  if (bombType === "large") {
    animations.push(playCellFlash(rect, color, 90, 1.35));
    animations.push(playRingEffect(rect, { color, delay: 135, size: 2.25, duration: 560 }));
    animations.push(playRingEffect(rect, { color, delay: 245, size: 2.9, duration: 660, className: "is-wide" }));
    animations.push(playLargeScreenShake());
  }
  if (bombType === "diagonal") animations.push(playDiagonalBombEffect(rect, color, 95));

  return Promise.all(animations);
}

function playBombEffects(triggeredBombs) {
  return Promise.all([...triggeredBombs].map((index) => playBombEffect(getCellBombType(state.match3Board[index]), index)));
}

function getClearHoldDuration(clearPlan) {
  if (!clearPlan.triggeredBombs.size) return 150;
  const triggeredTypes = [...clearPlan.triggeredBombs].map((index) => getCellBombType(state.match3Board[index]));
  if (triggeredTypes.some((type) => ["horizontal", "vertical", "cross", "diagonal", "large"].includes(type))) return 610;
  if (triggeredTypes.includes("medium")) return 540;
  return 430;
}

function getDebugGemIndexes() {
  const center = (BOARD_SIZE - 1) / 2;
  const indexes = state.match3Board
    .map((cell, index) => (isGemCell(cell) ? index : null))
    .filter((index) => index !== null)
    .sort((a, b) => {
      const aRow = Math.floor(a / BOARD_SIZE);
      const aCol = a % BOARD_SIZE;
      const bRow = Math.floor(b / BOARD_SIZE);
      const bCol = b % BOARD_SIZE;
      return Math.hypot(aRow - center, aCol - center) - Math.hypot(bRow - center, bCol - center);
    });
  const first = indexes[0] ?? 0;
  const second = indexes.find((index) => areAdjacent(first, index)) ?? indexes[1] ?? first;
  return [first, second];
}

async function runMatch3DebugAnimation(type) {
  if (!isMatch3Unlocked()) {
    state.taps = MATCH3_UNLOCK_THRESHOLD;
    render();
  }
  switchTab("match3");
  selectedGemIndex = null;
  renderMatch3();
  await nextAnimationFrame();
  const [first, second] = getDebugGemIndexes();

  if (type === "swap") return playGemSwap(first, second);
  if (type === "invalid") {
    await playGemSwap(first, second);
    return playGemSwap(first, second, { invalidReturn: true });
  }
  if (type === "clear") {
    const indexes = new Set(state.match3Board.map((cell, index) => (isGemCell(cell) ? index : null)).filter((index) => index !== null).slice(0, 4));
    return playMatch3ClearAnimation(
      { clearGems: indexes, damagedBlockers: new Map(), blastCells: new Map(), triggeredBombs: new Set() },
      new Set(),
    );
  }
  if (type === "fall") {
    const fallMap = new Map(
      state.match3Board
        .map((cell, index) => (isGemCell(cell) ? [index, 70 + Math.floor(index / BOARD_SIZE) * 26] : null))
        .filter(Boolean)
        .slice(0, 8),
    );
    return playGemFallAnimations(fallMap);
  }
  if (type.startsWith("bomb:")) return playBombEffect(type.slice(5), first);
}

function setupMatch3DebugMode() {
  const debugEnabled =
    new URLSearchParams(window.location.search).has("match3debug") || localStorage.getItem("match3-debug") === "1";
  if (!debugEnabled || document.querySelector(".match3-debug-panel")) return;

  document.body.dataset.match3Debug = "true";
  const panel = document.createElement("div");
  panel.className = "match3-debug-panel";
  panel.innerHTML = `
    <strong>Match3 debug</strong>
    <button type="button" data-debug-animation="swap">swap</button>
    <button type="button" data-debug-animation="invalid">invalid</button>
    <button type="button" data-debug-animation="clear">clear</button>
    <button type="button" data-debug-animation="fall">fall</button>
    <button type="button" data-debug-animation="bomb:small">small</button>
    <button type="button" data-debug-animation="bomb:horizontal">horizontal</button>
    <button type="button" data-debug-animation="bomb:vertical">vertical</button>
    <button type="button" data-debug-animation="bomb:medium">medium</button>
    <button type="button" data-debug-animation="bomb:large">large</button>
    <button type="button" data-debug-animation="bomb:diagonal">diagonal</button>
    <button type="button" data-debug-animation="bomb:cross">cross</button>
  `;
  panel.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-debug-animation]");
    if (!button || resolvingMatch3) return;
    button.disabled = true;
    try {
      await runMatch3DebugAnimation(button.dataset.debugAnimation);
    } finally {
      button.disabled = false;
    }
  });
  document.body.append(panel);
  window.match3DebugAnimations = {
    run: runMatch3DebugAnimation,
    swap: () => runMatch3DebugAnimation("swap"),
    invalid: () => runMatch3DebugAnimation("invalid"),
    clear: () => runMatch3DebugAnimation("clear"),
    fall: () => runMatch3DebugAnimation("fall"),
    bomb: (type) => runMatch3DebugAnimation(`bomb:${type}`),
  };
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clearCompanionStoryTimers() {
  companionStoryTimers.forEach((timer) => window.clearTimeout(timer));
  companionStoryTimers = [];
}

function isCoinHugStory(story) {
  return story === "coinHug" || story === "touch";
}

function isCoinHugFrame(frame = "") {
  return frame.startsWith("coin-hug") || frame.startsWith("touch");
}

function syncCoinHugClass(frame = "") {
  els.tapZone?.classList.toggle("is-coin-hug", isCoinHugFrame(frame));
}

function playCompanionStory(story = "idle") {
  if (!els.companionCard || !state.companionUnlocked) return;
  clearCompanionStoryTimers();
  const frames = companionStoryboards[story] ?? companionStoryboards.idle;
  const frameTime = isReducedMotion() ? 900 : 680;
  const firstFrame = frames[0] ?? "idle";
  els.companionCard.dataset.storyFrame = firstFrame;
  syncCoinHugClass(firstFrame);

  if (story === "match3" || match3FocusMode || resolvingMatch3) {
    els.companionCard.dataset.storyFrame = "idle";
    syncCoinHugClass("idle");
    return;
  }

  frames.slice(1).forEach((frame, index) => {
    const timer = window.setTimeout(() => {
      els.companionCard.dataset.storyFrame = frame;
      syncCoinHugClass(frame);
    }, frameTime * (index + 1));
    companionStoryTimers.push(timer);
  });
}

function getStoryForPose(pose) {
  if (match3FocusMode || resolvingMatch3 || pose === "focus") return "idle";
  if (pose === "magic") return "coinHug";
  if (pose === "sleep") return "sleep";
  return "idle";
}


function setCompanionBodyAttention(x = 0, y = 0) {
  if (!els.companionCard) return;
  companionBodyX = 0;
  companionBodyY = 0;
  els.companionCard.style.setProperty("--body-turn", "0deg");
  els.companionCard.style.setProperty("--body-shift-x", "0px");
  els.companionCard.style.setProperty("--body-shift-y", "0px");
}

function setCompanionLook(x = 0, y = 0, { body = false } = {}) {
  if (!els.companionCard) return;
  const lookX = 0;
  const lookY = 0;
  companionLookX = lookX;
  companionLookY = lookY;
  els.companionCard.style.setProperty("--look-x", `${lookX}px`);
  els.companionCard.style.setProperty("--look-y", `${lookY}px`);
  if (body) setCompanionBodyAttention(lookX, lookY);
}

function setCompanionLookAtPoint(clientX, clientY, { body = false } = {}) {
  if (!state.companionUnlocked) return;
  const rect = els.companionCard.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const centerX = rect.left + rect.width * 0.64;
  const centerY = rect.top + rect.height * 0.28;
  setCompanionLook(((clientX - centerX) / rect.width) * 15, ((clientY - centerY) / rect.height) * 14, { body });
}

function setCompanionLookAtElement(element, options = {}) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  setCompanionLookAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, options);
}

function clearCompanionCuriosity() {
  if (!els.companionCard) return;
  els.companionCard.classList.remove("is-curious", "is-tracking");
}

function triggerCompanionCuriosity({ lookAtLastPointer = false, speak = false } = {}) {
  if (!state.companionUnlocked || document.hidden || companionPose === "sleep") return;
  if (Date.now() - lastCompanionReactionAt < 4_000) return;

  if (!els.companionCard.classList.contains("is-speaking")) {
    els.companionMood.textContent = "комментирует";
  }
  if (speak && Date.now() - lastCompanionLineAt > 6_000) {
    speakCompanion(pick(companionLines.curious));
  }
}

function scheduleCompanionCuriosity() {
  window.clearTimeout(companionCuriosityTimer);
}

function handleCompanionPointerMove(event) {
  clearCompanionCuriosity();
}

function setCompanionPose(pose, { duration = 0, mood = null, line = null, story = null, playStory = true } = {}) {
  if (!state.companionUnlocked || (!companionAmbientPoses.includes(pose) && !["magic", "sleep"].includes(pose))) return;

  const planted = match3FocusMode || resolvingMatch3;
  const nextPose = planted ? "focus" : pose;
  const nextStory = planted ? "idle" : (story ?? getStoryForPose(nextPose));
  const samePose = companionPose === nextPose && els.companionCard.dataset.companionPose === nextPose;

  companionPose = nextPose;
  els.companionCard.dataset.companionPose = nextPose;
  if (playStory && !planted && !samePose) {
    playCompanionStory(nextStory);
  } else if (planted) {
    els.companionCard.dataset.storyFrame = "idle";
    syncCoinHugClass("idle");
  }
  const poseSrc = getActiveCompanion().poses?.[nextPose] ?? getActiveCompanion().poses?.idle;
  if (poseSrc) {
    els.companionCard.style.setProperty("--companion-pose-image", `url("${poseSrc}")`);
  }
  els.companionPoses.querySelectorAll(".companion-pose").forEach((image) => {
    image.classList.toggle("is-active", image.dataset.pose === nextPose);
  });

  if (mood) {
    els.companionMood.textContent = mood;
  }
  if (line) {
    speakCompanion(line);
  }

  window.clearTimeout(companionPoseTimer);
  if (duration > 0) {
    companionPoseTimer = window.setTimeout(() => {
      setCompanionPose(match3FocusMode ? "focus" : "idle", {
        mood: match3FocusMode ? "следит за полем" : state.combo >= 8 ? "ловит комбо" : "следит за ритмом",
        story: match3FocusMode ? "match3" : "idle",
      });
    }, duration);
  }
}

function speakCompanion(line) {
  els.companionLine.textContent = line;
  els.companionCard.classList.add("is-speaking");
  lastCompanionLineAt = Date.now();
  window.clearTimeout(companionSpeechTimer);
  companionSpeechTimer = window.setTimeout(() => {
    els.companionCard.classList.remove("is-speaking");
  }, 2_300);
}

function scheduleCompanionSleep() {
  window.clearTimeout(companionSleepTimer);
  if (!state.companionUnlocked) return;
  companionSleepTimer = window.setTimeout(() => {
    if (
      state.companionUnlocked &&
      !document.hidden &&
      !match3FocusMode &&
      !resolvingMatch3 &&
      companionPose !== "sleep"
    ) {
      setCompanionPose("sleep", {
        mood: "задремала у ядра",
        line: pick(companionLines.sleepy),
      });
    }
  }, COMPANION_SLEEP_DELAY);
}

function startCompanionAmbientLoop() {
  window.clearTimeout(companionAmbientTimer);
  companionAmbientTimer = null;
  if (!state.companionUnlocked) return;

  const queueNextScene = (delay = 9_000 + Math.random() * 7_000) => {
    window.clearTimeout(companionAmbientTimer);
    companionAmbientTimer = window.setTimeout(() => {
      if (
        state.companionUnlocked &&
        !document.hidden &&
        !match3FocusMode &&
        !resolvingMatch3 &&
        companionPose !== "sleep" &&
        Date.now() - lastCompanionReactionAt > 3_500
      ) {
        const scene = pick(companionAmbientScenes);
        const lines = companionLines[scene.lineSet] ?? companionLines.cute;
        setCompanionPose(scene.pose, {
          duration: 3_800,
          mood: scene.mood,
          line: pick(lines),
          story: scene.story,
        });
        scheduleCompanionSleep();
      }
      queueNextScene(13_000 + Math.random() * 10_000);
    }, delay);
  };

  queueNextScene(7_000 + Math.random() * 5_000);
}

function spawnCompanionFocus(x, y) {
  const node = document.createElement("span");
  node.className = "companion-focus-dot";
  node.style.setProperty("--x", `${x}px`);
  node.style.setProperty("--y", `${y}px`);
  els.tapFeedback.append(node);
  node.addEventListener("animationend", () => node.remove(), { once: true });
}

function decayIntervalForHeat(heat) {
  const ratio = Math.min(1, heat / DECAY_MAX_HEAT);
  return Math.round(DECAY_TICK_MS - (DECAY_TICK_MS - DECAY_MIN_TICK_MS) * ratio);
}

function updateTapDecayVisual() {
  if (!els.tapCount || !els.tapTotal) return;
  const ratio = decayHeat / DECAY_MAX_HEAT;
  els.tapCount.style.setProperty("--decay", ratio.toFixed(3));
}

function scheduleNextDecayTick() {
  window.clearTimeout(decayIntervalId);
  decayIntervalId = window.setTimeout(runDecayTick, decayIntervalForHeat(decayHeat));
}

function runDecayTick() {
  const isIdle = !isPaused && !document.hidden && Date.now() - lastActivityAt >= DECAY_IDLE_MS;
  if (isIdle) {
    decayHeat = Math.min(DECAY_MAX_HEAT, decayHeat + 1);
    if (state.taps > 0) {
      state.taps = Math.max(0, state.taps - 1);
      saveState();
      els.tapCount.textContent = formatNumber(state.taps);
      els.rewardProgress.style.width = `${Math.max(0, Math.min(100, getRewardPercent()))}%`;
    }
    updateTapDecayVisual();
  }
  scheduleNextDecayTick();
}

function cooldownTapDecay() {
  if (decayHeat <= 0) return;
  decayHeat = Math.max(0, decayHeat - 1);
  updateTapDecayVisual();
  scheduleNextDecayTick();
}

function armComboDecay() {
  window.clearTimeout(comboExpireTimer);

  comboExpireTimer = window.setTimeout(() => {
    if (state.combo > 1) {
      state.combo = 1;
      saveState();
      render();
    }
  }, COMBO_WINDOW);
}

function handleTap(event) {
  if (isPaused) return;
  const now = Date.now();
  const activeSkin = getActiveSkin();

  state.combo = now - state.lastTapAt < COMBO_WINDOW ? Math.min(state.combo + 1, 12) : 1;
  state.lastTapAt = now;
  lastActivityAt = now;
  armComboDecay();
  cooldownTapDecay();
  const tapGain = Math.min(activeSkin.power * state.combo, MAX_TAPS - state.taps);

  if (tapGain <= 0) {
    if (!state.maxToastShown) {
      state.maxToastShown = true;
      showToast("Лимит достигнут", "1 трлн тапов");
      saveState();
    }
    render();
    return;
  }

  state.taps += tapGain;

  const rect = els.tapButton.getBoundingClientRect();
  const zoneRect = els.tapZone.getBoundingClientRect();
  const x = event.clientX || rect.left + rect.width / 2;
  const y = event.clientY || rect.top + rect.height / 2;
  const tapX = x - zoneRect.left;
  const tapY = y - zoneRect.top;

  const statCallout =
    Math.random() < 0.3 ? (state.combo > 1 ? `x${state.combo}!` : `+${formatShort(tapGain)}`) : undefined;

  spawnFloatNumber(tapX, tapY, tapGain);
  spawnSparks(tapX, tapY, activeSkin.colors[0]);
  spawnTapComicBurst(rect, zoneRect, activeSkin.colors[0], statCallout);
  checkUnlocks();
  saveState();
  render();
  pulseTapButton();
  pulseCompanion(tapX, tapY);
  telegramHaptic("light");
}

function pulseTapButton() {
  els.tapButton.classList.remove("is-tapping");
  void els.tapButton.offsetWidth;
  els.tapButton.classList.add("is-tapping");
  window.setTimeout(() => els.tapButton.classList.remove("is-tapping"), 530);
}

function pulseCompanion(x, y) {
  if (!COMPANION_ENABLED || !state.companionUnlocked) return;

  const now = Date.now();

  if (companionPose === "sleep") {
    setCompanionPose("idle", { mood: "очнулась", line: "Ой, задремала" });
    lastCompanionReactionAt = now;
    scheduleCompanionSleep();
    return;
  }

  if (match3FocusMode) {
    if (now - lastCompanionLineAt > 1_800) {
      speakCompanion("Поле под контролем");
    }
    els.companionMood.textContent = "следит за полем";
    return;
  }

  const lines = state.combo >= 10
    ? [...companionLines.combo, ...companionLines.flirt]
    : state.combo >= 6
      ? companionLines.combo
      : companionLines.tap;
  const mood = state.combo >= 9
    ? "комментирует комбо"
    : state.combo >= 4
      ? "следит за ритмом"
      : "говорит";

  if (now - lastCompanionReactionAt < 2_200) {
    if (now - lastCompanionLineAt > 1_600) {
      speakCompanion(pick(lines));
    }
    scheduleCompanionSleep();
    return;
  }

  lastCompanionReactionAt = now;
  clearCompanionCuriosity();
  els.companionMood.textContent = mood;
  speakCompanion(pick(lines));
  scheduleCompanionSleep();
}

function spawnTapComicBurst(tapRect, zoneRect, color, text = pick(tapComicBursts)) {
  const node = document.createElement("span");
  const variants = ["is-spike", "is-bubble", "is-slashed"];
  const palette = pick(tapComicPalettes);
  const placements = [
    { x: 0.18, y: 0.22, r: -12 },
    { x: 0.22, y: 0.76, r: 9 },
    { x: 0.48, y: 0.1, r: -6 },
    { x: 0.5, y: 0.89, r: 7 },
    { x: 0.09, y: 0.48, r: -8 },
  ];
  const placement = pick(placements);
  const coinLeft = tapRect.left - zoneRect.left;
  const coinTop = tapRect.top - zoneRect.top;
  const safeX = coinLeft + tapRect.width * placement.x + (Math.random() - 0.5) * 22;
  const safeY = coinTop + tapRect.height * placement.y + (Math.random() - 0.5) * 22;

  node.className = `tap-comic-burst ${pick(variants)}`;
  node.textContent = text;
  node.style.setProperty("--x", `${safeX}px`);
  node.style.setProperty("--y", `${safeY}px`);
  node.style.setProperty("--comic-rotate", `${placement.r + (Math.random() - 0.5) * 8}deg`);
  node.style.setProperty("--comic-color", color);
  node.style.setProperty("--comic-paper", palette[0]);
  node.style.setProperty("--comic-accent", palette[1]);
  node.style.setProperty("--comic-ink", palette[2]);
  els.tapFeedback.append(node);
  node.addEventListener("animationend", () => node.remove(), { once: true });
}

function spawnFloatNumber(x, y, power) {
  const node = document.createElement("span");
  node.className = "float-number";
  node.textContent = `+${formatShort(power)}`;
  node.style.setProperty("--x", `${x}px`);
  node.style.setProperty("--y", `${y}px`);
  els.tapFeedback.append(node);
  node.addEventListener("animationend", () => node.remove(), { once: true });
}

function spawnSparks(x, y, color) {
  const tapEffect = getActiveTapEffect();
  const palette = [color, ...tapEffect.colors];
  const wave = document.createElement("span");
  wave.className = "tap-wave";
  wave.classList.add(`fx-${tapEffect.id}`);
  wave.style.setProperty("--x", `${x}px`);
  wave.style.setProperty("--y", `${y}px`);
  wave.style.setProperty("--wave-color", tapEffect.colors[0]);
  els.tapFeedback.append(wave);
  wave.addEventListener("animationend", () => wave.remove(), { once: true });

  for (let i = 0; i < tapEffect.count; i += 1) {
    const spark = els.sparkTemplate.content.firstElementChild.cloneNode(true);
    const sparkType = i % 5 === 0 ? "is-star" : i % 3 === 0 ? "is-shard" : "";
    if (sparkType) spark.classList.add(sparkType);
    spark.classList.add(`fx-${tapEffect.id}`);
    spark.style.setProperty("--x", `${x}px`);
    spark.style.setProperty("--y", `${y}px`);
    spark.style.setProperty("--rotate", `${i * 20 + Math.random() * 18}deg`);
    spark.style.setProperty("--distance", `${42 + Math.random() * 86}px`);
    spark.style.setProperty("--spark-size", `${5 + Math.random() * 8}px`);
    spark.style.setProperty("--spark-height", `${sparkType === "is-shard" ? 14 + Math.random() * 10 : 5 + Math.random() * 8}px`);
    spark.style.setProperty("--spark-delay", `${Math.random() * 38}ms`);
    spark.style.setProperty("--spark-time", `${620 + Math.random() * 260}ms`);
    spark.style.setProperty("--spark-color", palette[i % palette.length]);
    els.tapFeedback.append(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  }
}

function getGemPixelPalette(gemId) {
  return gemTypes.find((gem) => gem.id === gemId)?.pixels ?? gemTypes[0].pixels;
}

function checkUnlocks({ silent = false } = {}) {
  achievements.forEach((achievement) => {
    if (state.taps >= achievement.threshold && !state.unlockedAchievements.includes(achievement.id)) {
      state.unlockedAchievements.push(achievement.id);
      if (!silent) showToast("Ачивка открыта", achievement.title);
    }
  });

  cards.forEach((card) => {
    if (
      typeof card.threshold === "number" &&
      state.taps >= card.threshold &&
      !state.unlockedCards.includes(card.id)
    ) {
      state.unlockedCards.push(card.id);
      if (!silent) showToast("Новая карточка", card.title);
    }
  });

  skins.forEach((skin) => {
    if (state.taps >= skin.threshold && !state.unlockedSkins.includes(skin.id)) {
      state.unlockedSkins.push(skin.id);
      if (!silent) showToast("Новый скин", skin.title);
    }
  });
}

async function handleGemClick(event) {
  if (suppressNextMatch3Click) {
    suppressNextMatch3Click = false;
    return;
  }

  const button = event.target.closest("[data-gem-index]");
  if (!button || resolvingMatch3 || shufflingMatch3 || !isMatch3Unlocked()) return;

  const index = Number(button.dataset.gemIndex);
  if (!isGemCell(state.match3Board[index])) return;

  if (selectedGemIndex === null && getCellBombType(state.match3Board[index])) {
    await activateMatch3Bomb(index);
    return;
  }

  if (selectedGemIndex === null) {
    selectedGemIndex = index;
    renderMatch3();
    return;
  }

  if (selectedGemIndex === index) {
    selectedGemIndex = null;
    renderMatch3();
    return;
  }

  if (!areAdjacent(selectedGemIndex, index)) {
    selectedGemIndex = index;
    renderMatch3();
    return;
  }

  await tryMatch3Swap(selectedGemIndex, index);
}

async function activateMatch3Bomb(index) {
  if (resolvingMatch3 || shufflingMatch3 || !isMatch3Unlocked() || !getCellBombType(state.match3Board[index])) return;
  resolvingMatch3 = true;
  selectedGemIndex = null;
  await resolveMatch3(new Set(), { directBombs: [index], swapIndexes: [index] });
}

function getSwipeNeighborIndex(index, dx, dy) {
  if (!Number.isFinite(index) || !isGemCell(state.match3Board[index])) return null;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;

  if (Math.max(absX, absY) < 22) return null;
  if (absX >= absY) {
    if (dx > 0 && col < BOARD_SIZE - 1) return index + 1;
    if (dx < 0 && col > 0) return index - 1;
  } else {
    if (dy > 0 && row < BOARD_SIZE - 1) return index + BOARD_SIZE;
    if (dy < 0 && row > 0) return index - BOARD_SIZE;
  }
  return null;
}

function handleMatch3PointerDown(event) {
  const button = event.target.closest("[data-gem-index]");
  if (!button || resolvingMatch3 || shufflingMatch3 || !isMatch3Unlocked()) return;

  const index = Number(button.dataset.gemIndex);
  if (!isGemCell(state.match3Board[index])) return;

  match3PointerGesture = {
    pointerId: event.pointerId,
    index,
    x: event.clientX,
    y: event.clientY,
  };
}

async function handleMatch3PointerUp(event) {
  if (!match3PointerGesture || match3PointerGesture.pointerId !== event.pointerId) return;

  const gesture = match3PointerGesture;
  match3PointerGesture = null;
  if (resolvingMatch3 || shufflingMatch3 || !isMatch3Unlocked()) return;

  const neighborIndex = getSwipeNeighborIndex(gesture.index, event.clientX - gesture.x, event.clientY - gesture.y);
  if (neighborIndex === null || !isGemCell(state.match3Board[neighborIndex])) return;

  suppressNextMatch3Click = true;
  window.setTimeout(() => {
    suppressNextMatch3Click = false;
  }, 320);
  selectedGemIndex = null;
  await tryMatch3Swap(gesture.index, neighborIndex);
}

function handleMatch3PointerCancel(event) {
  if (match3PointerGesture?.pointerId === event.pointerId) {
    match3PointerGesture = null;
  }
}

async function reshuffleMatch3Board() {
  if (!isMatch3Unlocked() || resolvingMatch3 || shufflingMatch3) return;

  resolvingMatch3 = true;
  shufflingMatch3 = true;
  selectedGemIndex = null;
  clearingGems = new Set();
  shakingGems = new Set();
  swappingGems = new Map();
  fallingGems = new Map();
  blastCells = new Map();
  damagedBlockers = new Map();
  clearingBlockers = new Set();

  if (state.companionUnlocked) {
    setCompanionPose("magic", {
      duration: 2_400,
      mood: "перемешивает поле",
      line: "Сейчас обновлю",
    });
  }

  renderMatch3();
  await sleep(220);
  state.match3Board = createShuffledMatch3Board();
  saveState();
  renderMatch3();
  await sleep(680);
  shufflingMatch3 = false;
  resolvingMatch3 = false;
  render();
  showToast("Поле перемешано", "Новый ход найден");
}

async function tryMatch3Swap(firstIndex, secondIndex) {
  resolvingMatch3 = true;
  selectedGemIndex = null;

  renderMatch3();
  await nextAnimationFrame();
  await playGemSwap(firstIndex, secondIndex);

  swapGems(firstIndex, secondIndex);
  renderMatch3();
  await nextAnimationFrame();

  const matches = findMatches(state.match3Board);
  const directBombs = [firstIndex, secondIndex].filter((index) => Boolean(getCellBombType(state.match3Board[index])));
  if (!matches.size) {
    if (directBombs.length) {
      await resolveMatch3(new Set(), { directBombs, swapIndexes: [firstIndex, secondIndex] });
      return;
    }

    if (state.companionUnlocked) {
      setCompanionPose("magic", { duration: 1200, mood: "оценивает ход", line: "Почти, но нет" });
    }
    await playGemSwap(firstIndex, secondIndex, { invalidReturn: true });
    swapGems(firstIndex, secondIndex);
    resolvingMatch3 = false;
    renderMatch3();
    return;
  }

  await resolveMatch3(matches, { swapIndexes: [firstIndex, secondIndex] });
}

async function resolveMatch3(initialMatches, { directBombs = [], swapIndexes = [] } = {}) {
  let matches = initialMatches;
  let queuedBombs = new Set(directBombs);
  let chain = 1;

  while (matches.size || queuedBombs.size) {
    if (state.companionUnlocked) {
      setCompanionLookAtElement(els.match3Board, { body: true });
      setCompanionPose("magic", {
        duration: 3_200,
        mood: chain > 1 ? "радуется цепочке" : "кастует сбор",
        line: pick(chain > 1 ? companionLines.combo : companionLines.match),
      });
    }

    const groups = findMatchGroups(state.match3Board);
    const specialSpawns = queuedBombs.size ? [] : createSpecialSpawns(groups, swapIndexes);
    const matchIndexes = new Set(matches);
    specialSpawns.forEach((spawn) => matchIndexes.delete(spawn.index));
    const clearPlan = createClearPlan(matchIndexes, [...queuedBombs]);

    const clearingBlockerIndexes = new Set(
      [...clearPlan.damagedBlockers.entries()]
        .filter(([index, hits]) => getBlockerHp(state.match3Board[index]) - hits <= 0)
        .map(([index]) => index),
    );
    runVisualAnimation(playBombEffects(clearPlan.triggeredBombs));
    runVisualAnimation(playMatch3ClearAnimation(clearPlan, clearingBlockerIndexes));

    const destroyedBlockers = applyClearPlan(clearPlan, specialSpawns);
    const energyGain = (clearPlan.clearGems.size * 25 + destroyedBlockers * 75 + clearPlan.triggeredBombs.size * 120) * chain;
    state.match3Energy += energyGain;
    renderMatch3();
    await sleep(getMotionDuration(getClearHoldDuration(clearPlan)));

    const fallMap = collapseBoard();
    renderMatch3();
    runVisualAnimation(playGemFallAnimations(fallMap));
    await sleep(getMotionDuration(fallMap.size ? 170 : 55));

    matches = findMatches(state.match3Board);
    queuedBombs = new Set();
    swapIndexes = [];
    chain += 1;
  }

  resolvingMatch3 = false;
  saveState();
  render();
}

function getLockedCosmeticDrops() {
  return [
    ...coinBackdrops
      .filter((backdrop) => !state.unlockedBackdrops.includes(backdrop.id))
      .map((backdrop) => ({ type: "backdrop", item: backdrop })),
    ...tapEffects
      .filter((effect) => !state.unlockedTapEffects.includes(effect.id))
      .map((effect) => ({ type: "tapEffect", item: effect })),
    ...(state.companionUnlocked
      ? companionOutfits
          .filter((outfit) => !outfit.base && !state.unlockedCompanionOutfits.includes(outfit.id))
          .map((outfit) => ({ type: "companionOutfit", item: outfit }))
      : []),
  ];
}

function awardCosmeticDrop() {
  const drops = getLockedCosmeticDrops();
  if (!drops.length) return null;

  const drop = pick(drops);
  if (drop.type === "backdrop") {
    state.unlockedBackdrops.push(drop.item.id);
    state.activeBackdrop = drop.item.id;
    return {
      title: "Фон выбит",
      detail: drop.item.title,
      pose: "magic",
      line: "О, новый фон",
    };
  }

  if (drop.type === "tapEffect") {
    state.unlockedTapEffects.push(drop.item.id);
    state.activeTapEffect = drop.item.id;
    return {
      title: "Анимация выбита",
      detail: drop.item.title,
      pose: "magic",
      line: "Попробуй это",
    };
  }

  state.unlockedCompanionOutfits.push(drop.item.id);
  state.activeCompanionOutfit = drop.item.id;
  return {
    title: "Костюм Алиии выбит",
    detail: drop.item.title,
    pose: "magic",
    line: "Ну как?",
  };
}

function openChest() {
  if (!isMatch3Unlocked() || resolvingMatch3 || state.match3Energy < CHEST_COST) return;

  state.match3Energy -= CHEST_COST;
  state.chestsOpened += 1;

  const shouldDropCompanion =
    COMPANION_ENABLED &&
    !state.companionUnlocked &&
    (Math.random() < COMPANION_DROP_CHANCE || state.chestsOpened >= COMPANION_PITY_CHESTS);

  if (shouldDropCompanion) {
    const companion = companions[0];
    state.companionUnlocked = true;
    state.activeCompanion = companion.id;
    state.activeCompanionOutfit = "base";
    if (!state.unlockedCompanionOutfits.includes("base")) {
      state.unlockedCompanionOutfits.push("base");
    }
    if (!state.unlockedCards.includes("aliya-card")) {
      state.unlockedCards.push("aliya-card");
    }
    showToast("Персонаж выбит", `${companion.title} теперь на экране тапа`);
  } else {
    const cosmeticDrop = awardCosmeticDrop();
    if (cosmeticDrop) {
      showToast(cosmeticDrop.title, cosmeticDrop.detail);
      if (state.companionUnlocked) {
        setCompanionPose(cosmeticDrop.pose, {
          duration: 3_200,
          mood: "показывает дроп",
          line: cosmeticDrop.line,
        });
      }
    } else {
      const bonus = Math.min(2_000_000, MAX_TAPS - state.taps);
      state.taps += bonus;
      showToast("Сундук открыт", bonus > 0 ? `Бонус +${formatShort(bonus)} тапов` : "Бонус сохранен в коллекции");
    }
  }

  checkUnlocks();
  saveState();
  render();
  if (shouldDropCompanion) {
    setCompanionPose("magic", {
      duration: 2200,
      mood: "вышла из сундука",
      line: "Я с тобой",
    });
  }
}

const TOAST_MAX_VISIBLE = 4;
const toastGlyphRules = [
  [/ачивк/i, "★"],
  [/карточк/i, "◆"],
  [/скин/i, "●"],
  [/перемеш/i, "⇄"],
  [/персонаж/i, "♥"],
  [/фон/i, "▧"],
  [/анимац/i, "✦"],
  [/костюм/i, "◐"],
  [/сундук/i, "▣"],
  [/лимит/i, "⚠"],
  [/сброшен/i, "↺"],
];

function getToastGlyph(title) {
  const rule = toastGlyphRules.find(([pattern]) => pattern.test(title));
  return rule ? rule[1] : "✧";
}

function showToast(title, detail) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.title = `${title}: ${detail}`;
  toast.innerHTML = `
    <span class="toast-glyph" aria-hidden="true">${getToastGlyph(title)}</span>
    <span class="toast-copy">${detail}</span>
  `;
  els.toastStack.append(toast);
  window.setTimeout(() => toast.remove(), 3000);
  while (els.toastStack.children.length > TOAST_MAX_VISIBLE) {
    els.toastStack.firstElementChild.remove();
  }
  telegramHaptic("success");
}

function render() {
  const activeSkin = getActiveSkin();
  const nextReward = rewardMilestones.find((threshold) => threshold > state.taps);

  setStatText(els.tapCount, els.tapTotal, formatNumber(state.taps));
  els.nextRewardLabel.textContent =
    state.taps >= MAX_TAPS ? "1 трлн достигнут" : nextReward ? formatTapGoal(nextReward) : "все открыто";
  els.rewardProgress.style.width = `${Math.max(0, Math.min(100, getRewardPercent()))}%`;

  els.tapButton.className = `tap-button ${activeSkin.className}`;
  els.tapImage.src = activeSkin.image;
  renderCoinCosmetics();
  renderCompanion();
  renderAchievements();
  renderCards();
  renderSkins();
  renderCompanionOutfits();
  renderBackdrops();
  renderTapEffects();
  renderMatch3();
  renderTetris();
}

function renderCoinCosmetics() {
  const activeBackdrop = getActiveBackdrop();
  const activeTapEffect = getActiveTapEffect();

  if (activeBackdrop) {
    if (document.body.dataset.backdrop !== activeBackdrop.id) {
      document.body.dataset.backdrop = activeBackdrop.id;
    }
    setStylePropertyIfChanged(document.body, "--scene-image", `url("${activeBackdrop.image}")`);
    setStylePropertyIfChanged(document.body, "--theme-a", activeBackdrop.colors[0]);
    setStylePropertyIfChanged(document.body, "--theme-b", activeBackdrop.colors[1]);
    setStylePropertyIfChanged(document.body, "--theme-c", activeBackdrop.colors[2] ?? activeBackdrop.colors[1]);
  }
  els.coinBackdrop.hidden = true;
  if (els.tapZone.dataset.tapEffect !== activeTapEffect.id) {
    els.tapZone.dataset.tapEffect = activeTapEffect.id;
  }
}

function renderCompanion() {
  els.companionCard.hidden = !COMPANION_ENABLED || !state.companionUnlocked;
  if (!COMPANION_ENABLED || !state.companionUnlocked) {
    window.clearTimeout(companionPoseTimer);
    window.clearTimeout(companionSpeechTimer);
    window.clearTimeout(companionSleepTimer);
    window.clearTimeout(companionCuriosityTimer);
    window.clearTimeout(companionAmbientTimer);
    companionAmbientTimer = null;
    clearCompanionCuriosity();
    els.companionCard.classList.remove("is-reacting", "is-speaking");
    delete els.companionCard.dataset.ready;
    delete els.companionCard.dataset.storyFrame;
    clearCompanionStoryTimers();
    companionPose = "idle";
    els.companionCard.dataset.companionPose = "idle";
    els.companionCard.style.setProperty("--companion-pose-image", `url("${companions[0].poses.idle}")`);
    setCompanionLook(0, 0, { body: true });
    return;
  }

  const companion = getActiveCompanion();
  const outfit = getActiveCompanionOutfit();
  if (els.aliyaCutout && els.aliyaCutout.getAttribute("src") !== outfit.image) {
    els.aliyaCutout.src = outfit.image;
  }
  els.companionPoses.querySelectorAll(".companion-pose").forEach((image) => {
    const poseSrc = companion.poses?.[image.dataset.pose];
    if (poseSrc && image.getAttribute("src") !== poseSrc) {
      image.src = poseSrc;
    }
  });

  if (!els.companionCard.dataset.ready) {
    els.companionCard.dataset.ready = "true";
    setCompanionPose("idle", { mood: "следит за ритмом" });
    playCompanionStory("idle");
    startCompanionAmbientLoop();
    scheduleCompanionSleep();
  } else if (!els.companionCard.classList.contains("is-speaking") && companionPose !== "sleep") {
    els.companionMood.textContent = match3FocusMode
      ? "следит за полем"
      : state.combo >= 8
        ? "ловит комбо"
        : "следит за ритмом";
  }

  clearCompanionCuriosity();
  els.companionCard.classList.remove("is-reacting", "is-curious", "is-tracking");
  setCompanionLook(0, 0, { body: true });
}

function isCardUnlocked(card) {
  if (card.companionId) return state.companionUnlocked && state.unlockedCards.includes(card.id);
  return state.unlockedCards.includes(card.id);
}

function renderAchievements() {
  const unlockedCount = state.unlockedAchievements.length;
  els.achievementSummary.textContent = `${unlockedCount}/${achievements.length}`;
  els.achievementList.innerHTML = achievements
    .map((achievement, index) => {
      const unlocked = state.unlockedAchievements.includes(achievement.id);
      return `
        <article class="achievement ${unlocked ? "is-unlocked" : "is-locked"}" title="${achievement.description}">
          <span class="achievement-num" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
          <strong>${achievement.title}</strong>
          <span class="status-dot" aria-label="${unlocked ? "Открыта" : "Закрыта"}"></span>
        </article>
      `;
    })
    .join("");
}

function renderCards() {
  const unlockedCount = cards.filter((card) => isCardUnlocked(card)).length;
  els.cardSummary.textContent = `${unlockedCount}/${cards.length}`;
  els.cardGrid.innerHTML = cards
    .map((card) => {
      const unlocked = isCardUnlocked(card);
      const hasImage = unlocked && Boolean(card.image);
      const cardHint = card.companionId
        ? unlocked
          ? "Выбита из сундука персонажа"
          : card.lockedHint
        : unlocked
          ? `Открыта за ${formatTapGoal(card.threshold)}`
          : formatTapGoal(card.threshold);
      const cardArt = hasImage
        ? `<img src="${card.image}" alt="" loading="lazy" />`
        : unlocked
          ? card.initials
          : "??";
      return `
        <article class="collectible ${unlocked ? "is-unlocked" : "is-locked"} ${hasImage ? "has-image-card" : ""}" title="${cardHint}">
          <div class="card-art ${hasImage ? "has-image" : ""}" style="--accent-a: ${card.colors[0]}; --accent-b: ${card.colors[1]}">
            ${cardArt}
            <span class="rarity">${card.rarity}</span>
          </div>
          <strong>${unlocked ? card.title : "Скрытая карта"}</strong>
        </article>
      `;
    })
    .join("");
}

function renderSkins() {
  const unlockedCount = state.unlockedSkins.length;
  els.skinSummary.textContent = `${unlockedCount}/${skins.length}`;
  els.skinGrid.innerHTML = skins
    .map((skin) => {
      const unlocked = state.unlockedSkins.includes(skin.id);
      const active = state.activeSkin === skin.id;
      const canBuyWithStars = !unlocked && Boolean(skin.starsPrice);
      const revealed = unlocked || canBuyWithStars;
      const previewStyle = revealed ? ` style="--accent-a: ${skin.colors[0]}; --accent-b: ${skin.colors[1]}"` : "";
      const tag = canBuyWithStars ? "div" : "button";
      const interactiveAttrs = canBuyWithStars ? "" : `type="button" ${unlocked ? "" : "disabled"}`;
      const stateContent = canBuyWithStars
        ? `<button class="skin-buy-stars" type="button" data-skin-buy="${skin.id}">⭐ ${skin.starsPrice}</button>`
        : active
          ? "выбран"
          : unlocked
            ? `+${formatShort(skin.power)}`
            : formatShort(skin.threshold);
      return `
        <${tag} class="skin-option ${unlocked ? "is-unlocked" : "is-locked"} ${active ? "is-active" : ""} ${canBuyWithStars ? "has-stars-buy" : ""}" data-skin="${skin.id}" ${interactiveAttrs} title="${revealed ? skin.description : "Скрытый скин"}">
          <span class="skin-preview ${revealed ? "" : "is-mystery"}"${previewStyle}>
            ${revealed ? `<img src="${skin.image}" alt="" loading="lazy" />` : "?"}
          </span>
          <strong>${revealed ? skin.title : "???"}</strong>
          <span class="skin-state">${stateContent}</span>
        </${tag}>
      `;
    })
    .join("");
}

function renderCompanionOutfits() {
  if (!els.companionOutfitGrid || !els.companionOutfitSummary) return;
  if (els.companionOutfitSection) els.companionOutfitSection.hidden = !COMPANION_ENABLED;
  if (!COMPANION_ENABLED) return;
  const unlockedCount = state.unlockedCompanionOutfits.length;
  els.companionOutfitSummary.textContent = `${unlockedCount}/${companionOutfits.length}`;
  els.companionOutfitGrid.innerHTML = companionOutfits
    .map((outfit) => {
      const unlocked = state.unlockedCompanionOutfits.includes(outfit.id);
      const active = state.activeCompanionOutfit === outfit.id;
      const disabled = !state.companionUnlocked || !unlocked;
      const reveal = unlocked && state.companionUnlocked;
      const previewStyle = reveal ? ` style="--accent-a: ${outfit.colors[0]}; --accent-b: ${outfit.colors[1]}"` : "";
      return `
        <button class="companion-outfit-option ${unlocked ? "is-unlocked" : "is-locked"} ${active ? "is-active" : ""}" type="button" data-companion-outfit="${outfit.id}" ${disabled ? "disabled" : ""}>
          <span class="companion-outfit-preview ${reveal ? "" : "is-mystery"}"${previewStyle}>
            ${reveal ? `<img src="${outfit.image}" alt="" loading="lazy" />` : "?"}
          </span>
          <span>
            <strong>${reveal ? outfit.title : "???"}</strong>
            <p>${state.companionUnlocked ? (reveal ? outfit.description : "Скрытый костюм") : "Сначала выбей Алию"}</p>
          </span>
          <span class="skin-state">${active ? "надет" : unlocked ? "выбрать" : "сундук"}</span>
        </button>
      `;
    })
    .join("");
}

function renderBackdrops() {
  const unlockedCount = state.unlockedBackdrops.length;
  els.backdropSummary.textContent = `${unlockedCount}/${coinBackdrops.length}`;
  els.backdropGrid.innerHTML = coinBackdrops
    .map((backdrop) => {
      const unlocked = state.unlockedBackdrops.includes(backdrop.id);
      const active = state.activeBackdrop === backdrop.id;
      const previewStyle = unlocked ? ` style="--accent-a: ${backdrop.colors[0]}; --accent-b: ${backdrop.colors[1]}"` : "";
      return `
        <button class="cosmetic-option ${unlocked ? "is-unlocked" : "is-locked"} ${active ? "is-active" : ""}" type="button" data-backdrop="${backdrop.id}" ${unlocked ? "" : "disabled"}>
          <span class="cosmetic-preview ${unlocked ? "" : "is-mystery"}"${previewStyle}>
            ${unlocked ? `<img src="${backdrop.image}" alt="" loading="lazy" />` : "?"}
          </span>
          <span>
            <strong>${unlocked ? backdrop.title : "Скрытый фон"}</strong>
            <p>${unlocked ? backdrop.description : "Выпадет из сундука"}</p>
            <span class="cosmetic-state">${active ? "выбран" : unlocked ? "открыт" : "сундук"}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderTapEffects() {
  const unlockedCount = state.unlockedTapEffects.length;
  els.tapEffectSummary.textContent = `${unlockedCount}/${tapEffects.length}`;
  els.tapEffectGrid.innerHTML = tapEffects
    .map((effect) => {
      const unlocked = state.unlockedTapEffects.includes(effect.id);
      const active = state.activeTapEffect === effect.id;
      const preview = unlocked
        ? `<span class="cosmetic-preview effect-preview" data-effect="${effect.id}" style="--accent-a: ${effect.colors[0]}; --accent-b: ${effect.colors[1]}"><span aria-hidden="true"></span></span>`
        : `<span class="cosmetic-preview is-mystery">?</span>`;
      return `
        <button class="cosmetic-option ${unlocked ? "is-unlocked" : "is-locked"} ${active ? "is-active" : ""}" type="button" data-tap-effect="${effect.id}" ${unlocked ? "" : "disabled"}>
          ${preview}
          <span>
            <strong>${unlocked ? effect.title : "Скрытая анимация"}</strong>
            <p>${unlocked ? effect.description : "Выпадет из сундука"}</p>
            <span class="cosmetic-state">${active ? "выбрана" : unlocked ? "открыта" : "сундук"}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderMatch3() {
  const unlocked = isMatch3Unlocked();
  const chestPercent = Math.min(100, (state.match3Energy / CHEST_COST) * 100);
  const remaining = Math.max(0, MATCH3_UNLOCK_THRESHOLD - state.taps);

  els.match3Tab.classList.toggle("is-locked", !unlocked);
  els.match3ShuffleButton.disabled = !unlocked || resolvingMatch3 || shufflingMatch3;
  els.match3ShuffleButton.classList.toggle("is-shuffling", shufflingMatch3);
  els.match3FocusButton.disabled = !unlocked;
  els.match3Summary.textContent = unlocked ? "открыто" : formatShort(remaining);
  els.match3Locked.hidden = unlocked;
  els.match3Game.hidden = !unlocked;

  if (!unlocked) {
    setMatch3FocusMode(false, { animate: false });
    return;
  }
  updateMatch3FocusButton();
  if (!isValidBoard(state.match3Board) && !(resolvingMatch3 && isResolvableBoard(state.match3Board))) {
    state.match3Board = createBoard();
  }
  if (!state.match3FeaturesSeeded && !resolvingMatch3 && !shufflingMatch3) {
    state.match3Board = seedMatch3Features(state.match3Board);
    state.match3FeaturesSeeded = true;
    saveState();
  }
  const shuffleNeeded = findMatches(state.match3Board).size === 0 && !hasPossibleMove(state.match3Board);
  const shuffleLabel = shuffleNeeded ? "Нет ходов, перемешать поле" : "Перемешать поле";

  els.match3Energy.textContent = formatShort(state.match3Energy);
  els.chestCount.textContent = formatShort(state.chestsOpened);
  els.chestProgress.style.width = `${chestPercent}%`;
  els.chestButton.disabled = state.match3Energy < CHEST_COST || resolvingMatch3;
  els.match3Board.classList.toggle("is-shuffling", shufflingMatch3);
  els.match3ShuffleButton.classList.toggle("is-needed", shuffleNeeded);
  els.match3ShuffleButton.setAttribute("aria-label", shuffleLabel);
  els.match3ShuffleButton.title = shuffleLabel;

  if (state.companionUnlocked) {
    const dropsLeft = getLockedCosmeticDrops().length;
    els.chestStatus.textContent = dropsLeft
      ? `${dropsLeft} косметик, ${formatShort(state.match3Energy)}/${formatShort(CHEST_COST)}`
      : `Алия выбита, ${formatShort(state.match3Energy)}/${formatShort(CHEST_COST)}`;
  } else {
    const pityLeft = Math.max(1, COMPANION_PITY_CHESTS - state.chestsOpened);
    els.chestStatus.textContent = `${formatShort(state.match3Energy)}/${formatShort(CHEST_COST)}, гарант ${pityLeft}`;
  }

  els.match3Board.innerHTML = state.match3Board
    .map((cellValue, index) => {
      const cell = normalizeCell(cellValue);
      const selected = selectedGemIndex === index;
      const clearing = clearingGems.has(index);
      const cracking = damagedBlockers.has(index);
      const clearingBlocker = clearingBlockers.has(index);
      const blastType = blastCells.get(index);
      const shaking = shakingGems.has(index);
      const swapMotion = swappingGems.get(index);
      const fallDistance = fallingGems.get(index);
      const shuffleStep = (index * 7) % 13;
      const gemStyles = [
        swapMotion ? `--swap-x: ${swapMotion.x}%; --swap-y: ${swapMotion.y}%;` : "",
        fallDistance ? `--drop-distance: ${fallDistance}px;` : "",
        shufflingMatch3
          ? `--shuffle-order: ${shuffleStep}; --shuffle-x: ${((index % BOARD_SIZE) - 2.5) * 14}px; --shuffle-y: ${(Math.floor(index / BOARD_SIZE) - 2.5) * 14}px; --shuffle-rotate: ${index % 2 === 0 ? 128 : -128}deg;`
          : "",
      ]
        .filter(Boolean)
        .join(" ");

      if (cell.type === "empty") {
        return `
          <button
            class="gem is-empty ${blastType ? `is-blasted blast-${blastType}` : ""}"
            type="button"
            data-gem-index="${index}"
            data-cell-kind="empty"
            ${gemStyles ? `style="${gemStyles}"` : ""}
            aria-label="Пустая клетка"
            disabled
          ></button>
        `;
      }

      if (cell.type === "blocker") {
        return `
          <button
            class="gem blocker blocker-hp-${cell.hp} ${cracking ? "is-cracking" : ""} ${clearingBlocker ? "is-clearing" : ""} ${blastType ? `is-blasted blast-${blastType}` : ""} ${shufflingMatch3 ? "is-shuffling" : ""}"
            type="button"
            data-gem-index="${index}"
            data-cell-kind="blocker"
            data-hp="${cell.hp}"
            ${gemStyles ? `style="${gemStyles}"` : ""}
            aria-label="Кубик, осталось ударов: ${cell.hp}"
            disabled
          >
            <span class="blocker-mark" aria-hidden="true">${cell.hp}</span>
          </button>
        `;
      }

      const gem = gemTypes.find((item) => item.id === cell.gemId) ?? gemTypes[0];
      const bomb = getBombType(cell.bombType);
      const pixelStyles = `--pixel-a: ${gem.pixels[0]}; --pixel-b: ${gem.pixels[1]}; --pixel-c: ${gem.pixels[2]};`;
      const bombStyles = bomb ? `--bomb-a: ${bomb.colors[0]}; --bomb-b: ${bomb.colors[1]}; --bomb-image: url('${bomb.image}');` : "";
      const crystalStyles = !bomb ? `--gem-image: url('${gem.image}');` : "";
      const fullGemStyles = [gemStyles, pixelStyles, bombStyles, crystalStyles].filter(Boolean).join(" ");
      return `
        <button
          class="gem ${gem.className} ${bomb ? `is-bomb ${bomb.className}` : ""} ${selected ? "is-selected" : ""} ${clearing ? "is-clearing" : ""} ${blastType ? `is-blasted blast-${blastType}` : ""} ${shaking ? "is-shaking" : ""} ${swapMotion ? "is-swapping" : ""} ${fallDistance ? "is-falling" : ""} ${shufflingMatch3 ? "is-shuffling" : ""}"
          type="button"
          data-gem-index="${index}"
          data-cell-kind="gem"
          data-gem-id="${gem.id}"
          ${bomb ? `data-bomb-type="${bomb.id}"` : ""}
          ${fullGemStyles ? `style="${fullGemStyles}"` : ""}
          aria-label="${bomb ? `${gem.label}, ${bomb.label}` : gem.label}"
        >
          ${bomb ? `<span class="bomb-skin" aria-hidden="true"></span><span class="bomb-glyph" aria-hidden="true">${bomb.icon}</span>` : `<span class="gem-crystal" aria-hidden="true"></span>`}
        </button>
      `;
    })
    .join("");
}

function createEmptyTetrisBoard() {
  return Array.from({ length: TETRIS_ROWS }, () => Array(TETRIS_COLS).fill(null));
}

function rotateTetrisMatrix(matrix) {
  const n = matrix.length;
  const result = Array.from({ length: n }, () => Array(n).fill(0));
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      result[x][n - 1 - y] = matrix[y][x];
    }
  }
  return result;
}

function tetrisPieceCollides(matrix, row, col) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (!matrix[y][x]) continue;
      const boardRow = row + y;
      const boardCol = col + x;
      if (boardCol < 0 || boardCol >= TETRIS_COLS || boardRow >= TETRIS_ROWS) return true;
      if (boardRow >= 0 && tetrisBoard[boardRow][boardCol]) return true;
    }
  }
  return false;
}

function spawnTetrisPiece() {
  const key = tetrisNextKey ?? pick(tetrominoKeys);
  tetrisNextKey = pick(tetrominoKeys);
  const def = tetrominoes[key];
  const matrix = def.matrix.map((row) => row.slice());
  const col = Math.floor((TETRIS_COLS - matrix.length) / 2);
  tetrisPiece = { key, matrix, color: def.color, row: 0, col };
  if (tetrisPieceCollides(matrix, 0, col)) {
    tetrisGameOver = true;
    tetrisPiece = null;
  }
}

function ensureTetrisActiveNodes() {
  if (els.tetrisActivePiece.children.length === 4) return;
  els.tetrisActivePiece.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const node = document.createElement("span");
    node.className = "tetris-cell tetris-block is-filled";
    els.tetrisActivePiece.append(node);
  }
}

function renderTetrisActivePiece({ snap = false } = {}) {
  if (!els.tetrisActivePiece) return;
  if (!tetrisPiece) {
    els.tetrisActivePiece.innerHTML = "";
    return;
  }
  ensureTetrisActiveNodes();
  const cellW = 100 / TETRIS_COLS;
  const cellH = 100 / TETRIS_ROWS;
  const { matrix, row, col, color } = tetrisPiece;
  const cells = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x]) cells.push({ row: row + y, col: col + x });
    }
  }
  const nodes = els.tetrisActivePiece.children;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const cell = cells[i];
    if (!cell) {
      node.style.opacity = "0";
      continue;
    }
    if (snap || isReducedMotion()) node.style.transition = "none";
    node.className = `tetris-cell tetris-block is-filled c-${color}`;
    node.style.opacity = cell.row < 0 ? "0" : "1";
    node.style.left = `${(cell.col * cellW).toFixed(3)}%`;
    node.style.top = `${(cell.row * cellH).toFixed(3)}%`;
    node.style.width = `${cellW.toFixed(3)}%`;
    node.style.height = `${cellH.toFixed(3)}%`;
    if (snap) {
      void node.offsetWidth;
      node.style.transition = "";
    }
  }
}

function renderTetrisBoardCells({ settleCells = [], clearingRows = [] } = {}) {
  if (!els.tetrisBoardCells) return;
  const cellW = 100 / TETRIS_COLS;
  const cellH = 100 / TETRIS_ROWS;
  let html = "";
  for (let y = 0; y < TETRIS_ROWS; y++) {
    for (let x = 0; x < TETRIS_COLS; x++) {
      const color = tetrisBoard[y][x];
      if (!color) continue;
      const isSettling = settleCells.some((cell) => cell.row === y && cell.col === x);
      const isClearing = clearingRows.includes(y);
      html += `<span class="tetris-cell tetris-block is-filled c-${color} ${isSettling ? "is-settling" : ""} ${isClearing ? "tetris-row-clearing" : ""}" style="left:${(x * cellW).toFixed(3)}%;top:${(y * cellH).toFixed(3)}%;width:${cellW.toFixed(3)}%;height:${cellH.toFixed(3)}%;"></span>`;
    }
  }
  els.tetrisBoardCells.innerHTML = html;
}

function renderTetrisStats() {
  if (els.tetrisLines) els.tetrisLines.textContent = formatNumber(tetrisLines);
  if (els.tetrisScore) els.tetrisScore.textContent = formatNumber(tetrisScore);
}

function moveTetrisPiece(dx, dy) {
  if (!tetrisPiece || tetrisGameOver || tetrisResolving) return false;
  const nextRow = tetrisPiece.row + dy;
  const nextCol = tetrisPiece.col + dx;
  if (tetrisPieceCollides(tetrisPiece.matrix, nextRow, nextCol)) return false;
  tetrisPiece.row = nextRow;
  tetrisPiece.col = nextCol;
  renderTetrisActivePiece();
  return true;
}

function rotateTetrisPiece() {
  if (!tetrisPiece || tetrisGameOver || tetrisResolving) return;
  const rotated = rotateTetrisMatrix(tetrisPiece.matrix);
  const kicks = [0, -1, 1, -2, 2];
  for (const kick of kicks) {
    const nextCol = tetrisPiece.col + kick;
    if (!tetrisPieceCollides(rotated, tetrisPiece.row, nextCol)) {
      tetrisPiece.matrix = rotated;
      tetrisPiece.col = nextCol;
      renderTetrisActivePiece();
      return;
    }
  }
}

async function lockTetrisPiece() {
  if (!tetrisPiece || tetrisResolving) return;
  tetrisResolving = true;
  const { matrix, row, col, color } = tetrisPiece;
  const settleCells = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (!matrix[y][x]) continue;
      const boardRow = row + y;
      const boardCol = col + x;
      if (boardRow >= 0 && boardRow < TETRIS_ROWS) {
        tetrisBoard[boardRow][boardCol] = color;
        settleCells.push({ row: boardRow, col: boardCol });
      }
    }
  }
  tetrisPiece = null;
  renderTetrisActivePiece();
  renderTetrisBoardCells({ settleCells });

  const fullRows = [];
  for (let y = 0; y < TETRIS_ROWS; y++) {
    if (tetrisBoard[y].every(Boolean)) fullRows.push(y);
  }

  if (fullRows.length) {
    renderTetrisBoardCells({ clearingRows: fullRows });
    await sleep(getMotionDuration(180));
    fullRows.forEach((y) => tetrisBoard.splice(y, 1));
    for (let i = 0; i < fullRows.length; i++) tetrisBoard.unshift(Array(TETRIS_COLS).fill(null));
    tetrisLines += fullRows.length;
    tetrisScore += ([0, 100, 300, 500, 800][fullRows.length] ?? fullRows.length * 200);
    const bonus = Math.min(TETRIS_LINE_TAPS * fullRows.length, Math.max(0, MAX_TAPS - state.taps));
    if (bonus > 0) {
      state.taps += bonus;
      checkUnlocks();
    }
    renderTetrisBoardCells();
    saveState();
    render();
  }

  renderTetrisStats();
  spawnTetrisPiece();
  if (tetrisGameOver) {
    stopTetrisDropTimer();
    if (els.tetrisOverlay) els.tetrisOverlay.hidden = false;
  } else {
    renderTetrisActivePiece({ snap: true });
  }
  tetrisResolving = false;
}

function tetrisTick() {
  if (!tetrisActive || tetrisGameOver || tetrisResolving || !tetrisPiece || isPaused || document.hidden) return;
  if (!moveTetrisPiece(0, 1)) {
    lockTetrisPiece();
  }
}

function startTetrisDropTimer() {
  window.clearInterval(tetrisDropTimer);
  if (tetrisGameOver) return;
  const interval = tetrisSoftDropping ? TETRIS_SOFT_DROP_MS : TETRIS_DROP_MS;
  tetrisDropTimer = window.setInterval(tetrisTick, interval);
}

function stopTetrisDropTimer() {
  window.clearInterval(tetrisDropTimer);
  tetrisDropTimer = null;
}

async function hardDropTetrisPiece() {
  if (!tetrisPiece || tetrisGameOver || tetrisResolving) return;
  while (moveTetrisPiece(0, 1)) {
    // fall through to the floor
  }
  await lockTetrisPiece();
}

function restartTetris() {
  tetrisBoard = createEmptyTetrisBoard();
  tetrisScore = 0;
  tetrisLines = 0;
  tetrisGameOver = false;
  tetrisResolving = false;
  tetrisSoftDropping = false;
  tetrisNextKey = null;
  if (els.tetrisOverlay) els.tetrisOverlay.hidden = true;
  spawnTetrisPiece();
  renderTetrisBoardCells();
  renderTetrisActivePiece({ snap: true });
  renderTetrisStats();
  tetrisActive = true;
  startTetrisDropTimer();
}

function startTetrisIfNeeded() {
  if (!isTetrisUnlocked()) return;
  if (!tetrisBoard) {
    restartTetris();
    return;
  }
  tetrisActive = true;
  if (!tetrisGameOver) startTetrisDropTimer();
}

function pauseTetrisDrop() {
  tetrisActive = false;
  stopTetrisDropTimer();
}

function renderTetris() {
  const unlocked = isTetrisUnlocked();
  const remaining = Math.max(0, TETRIS_UNLOCK_THRESHOLD - state.taps);

  els.tetrisTab.classList.toggle("is-locked", !unlocked);
  els.tetrisSummary.textContent = unlocked ? `${formatNumber(tetrisLines)} линий` : formatShort(remaining);
  els.tetrisLocked.hidden = unlocked;
  els.tetrisGame.hidden = !unlocked;

  if (unlocked && !tetrisBoard && document.querySelector(".tab-panel.is-active")?.id === "tetrisPanel") {
    restartTetris();
  }
}

function switchTab(tabName) {
  if (tabName !== "match3" && match3FocusMode) {
    setMatch3FocusMode(false);
  }

  if (tabName === "tetris") {
    startTetrisIfNeeded();
  } else {
    pauseTetrisDrop();
  }

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === tabName);
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === tabName);
  });
}

function resetProgress() {
  state = {
    ...defaultState,
    unlockedAchievements: [],
    unlockedCards: [],
    unlockedSkins: ["crystal"],
    unlockedBackdrops: ["guild"],
    activeBackdrop: "guild",
    unlockedTapEffects: ["stars"],
    activeTapEffect: "stars",
    unlockedCompanionOutfits: ["base"],
    activeCompanionOutfit: "base",
  };
  decayHeat = 0;
  lastActivityAt = Date.now();
  updateTapDecayVisual();
  pauseTetrisDrop();
  tetrisBoard = null;
  tetrisPiece = null;
  tetrisGameOver = false;
  saveState();
  showToast("Прогресс сброшен", "Можно начать заново");
  render();
}

function togglePause() {
  isPaused = !isPaused;
  els.tapZone.classList.toggle("is-paused", isPaused);
  els.pauseButton.classList.toggle("is-active", isPaused);
  els.pauseButton.setAttribute("aria-label", isPaused ? "Продолжить" : "Пауза");
  els.pauseButton.title = isPaused ? "Продолжить" : "Пауза";
  els.pauseButton.querySelector("span").textContent = isPaused ? "▶" : "⏸";
  els.tapButton.disabled = isPaused;
  if (!isPaused) {
    lastActivityAt = Date.now();
  }
}

function telegramHaptic(style = "light") {
  const tg = window.Telegram?.WebApp;
  if (!tg?.HapticFeedback) return;
  if (style === "success" || style === "error" || style === "warning") {
    tg.HapticFeedback.notificationOccurred(style);
  } else {
    tg.HapticFeedback.impactOccurred(style);
  }
}

function initTelegramWebApp() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;
  tg.ready();
  tg.expand();
  tg.disableVerticalSwipes?.();
  tg.setHeaderColor?.("#111827");
  tg.setBackgroundColor?.("#111827");
  document.body.classList.add("in-telegram");
}

// Telegram Stars checkout needs a server: only a bot-token-holding backend can
// call Bot API `createInvoiceLink` (currency "XTR") and verify `initData`.
// Point this at that endpoint once it exists; POST { skinId, initData } and
// expect JSON back as { invoiceUrl }.
const TELEGRAM_INVOICE_ENDPOINT = "";

async function purchaseSkinWithStars(skinId) {
  const skin = skins.find((item) => item.id === skinId);
  if (!skin || !skin.starsPrice || state.unlockedSkins.includes(skinId)) return;

  const tg = window.Telegram?.WebApp;
  if (!tg?.openInvoice) {
    showToast("Доступно в Telegram", "Открой игру внутри Telegram, чтобы платить звёздами");
    return;
  }
  if (!TELEGRAM_INVOICE_ENDPOINT) {
    showToast("Магазин в разработке", `Нужен бэкенд, который выставит счёт на ${skin.starsPrice}⭐`);
    return;
  }

  try {
    const response = await fetch(TELEGRAM_INVOICE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skinId, initData: tg.initData }),
    });
    const data = await response.json();
    if (!data?.invoiceUrl) throw new Error("no invoice url");
    tg.openInvoice(data.invoiceUrl, (status) => {
      if (status !== "paid") return;
      if (!state.unlockedSkins.includes(skinId)) state.unlockedSkins.push(skinId);
      saveState();
      render();
      showToast("Скин куплен", skin.title);
    });
  } catch {
    showToast("Не получилось", "Магазин временно недоступен");
  }
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

els.skinGrid.addEventListener("click", (event) => {
  const buyButton = event.target.closest(".skin-buy-stars");
  if (buyButton) {
    purchaseSkinWithStars(buyButton.dataset.skinBuy);
    return;
  }
  const button = event.target.closest("[data-skin]");
  if (!button || !state.unlockedSkins.includes(button.dataset.skin)) return;
  state.activeSkin = button.dataset.skin;
  saveState();
  render();
});

els.companionOutfitGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-companion-outfit]");
  if (!button || button.disabled) return;
  state.activeCompanionOutfit = button.dataset.companionOutfit;
  saveState();
  render();
  setCompanionPose("magic", {
    duration: 1_600,
    mood: "примеряет образ",
    line: "Ну как?",
    story: "flirt",
  });
});

els.backdropGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-backdrop]");
  if (!button || button.disabled) return;
  state.activeBackdrop = button.dataset.backdrop;
  saveState();
  render();
});

els.tapEffectGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tap-effect]");
  if (!button || button.disabled) return;
  state.activeTapEffect = button.dataset.tapEffect;
  saveState();
  render();
});

els.tapButton.addEventListener("click", handleTap);
window.addEventListener("pointermove", handleCompanionPointerMove, { passive: true });
els.resetButton.addEventListener("click", resetProgress);
els.pauseButton.addEventListener("click", togglePause);
els.match3ShuffleButton.addEventListener("click", reshuffleMatch3Board);
els.match3FocusButton.addEventListener("click", () => setMatch3FocusMode(!match3FocusMode));
els.match3Board.addEventListener("pointerdown", handleMatch3PointerDown);
els.match3Board.addEventListener("pointerup", handleMatch3PointerUp);
els.match3Board.addEventListener("pointercancel", handleMatch3PointerCancel);
els.match3Board.addEventListener("click", handleGemClick);
els.chestButton.addEventListener("click", openChest);

els.tetrisLeftButton?.addEventListener("click", () => moveTetrisPiece(-1, 0));
els.tetrisRightButton?.addEventListener("click", () => moveTetrisPiece(1, 0));
els.tetrisRotateButton?.addEventListener("click", () => rotateTetrisPiece());
els.tetrisHardDropButton?.addEventListener("click", () => hardDropTetrisPiece());
els.tetrisRestartButton?.addEventListener("click", () => restartTetris());
els.tetrisPlayAgainButton?.addEventListener("click", () => restartTetris());

function setTetrisSoftDrop(enabled) {
  if (tetrisSoftDropping === enabled) return;
  tetrisSoftDropping = enabled;
  startTetrisDropTimer();
}

els.tetrisSoftDropButton?.addEventListener("pointerdown", () => setTetrisSoftDrop(true));
els.tetrisSoftDropButton?.addEventListener("pointerup", () => setTetrisSoftDrop(false));
els.tetrisSoftDropButton?.addEventListener("pointerleave", () => setTetrisSoftDrop(false));
els.tetrisSoftDropButton?.addEventListener("pointercancel", () => setTetrisSoftDrop(false));

window.addEventListener("keydown", (event) => {
  if (!tetrisActive || document.querySelector(".tab-panel.is-active")?.id !== "tetrisPanel") return;
  if (event.key === "ArrowLeft") moveTetrisPiece(-1, 0);
  else if (event.key === "ArrowRight") moveTetrisPiece(1, 0);
  else if (event.key === "ArrowUp") rotateTetrisPiece();
  else if (event.key === "ArrowDown") setTetrisSoftDrop(true);
  else if (event.key === " ") {
    event.preventDefault();
    hardDropTetrisPiece();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowDown") setTetrisSoftDrop(false);
});

checkUnlocks({ silent: true });
saveState();
render();
setupMatch3DebugMode();
scheduleNextDecayTick();
initTelegramWebApp();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
