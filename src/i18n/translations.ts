import type { CategoryCode, Language, UniversityCode } from '../types';

export interface Translations {
  brandSuffix: string;
  allUniversities: string;
  verifiedStudentsBadge: string;
  bishkekLabel: string;
  allCampuses: string;
  searchPlaceholder: string;
  freshTitle: string;
  freshCountLabel: string;
  freshSubtitle: string;
  sortNewest: string;
  sortCheapest: string;
  sortPopular: string;
  emptyFeedTitle: string;
  emptyFeedDesc: string;
  resetFilters: string;
  safetyBannerTitle: string;
  safetyBannerBody: string;
  navHome: string;
  navSell: string;
  navProfile: string;
  slides: {
    badge: string;
    title: string;
    subtitle: string;
  }[];
  categories: Record<CategoryCode, string>;
  universities: Record<UniversityCode, string>;
  universityShort: Record<UniversityCode, string>;
  safeZones: {
    id: string;
    ru: string;
    en: string;
    university: Exclude<UniversityCode, 'ALL'>;
  }[];
  // Product Detail
  listingHeader: string;
  verifiedTag: string;
  verifiedStudentOf: string;
  photosCounter: string;
  savePrefix: string;
  saveMiddle: string;
  saveQuestion: string;
  discountBadge: string;
  retailSuffix: string;
  viewingNowPrefix: string;
  viewingNowSuffix: string;
  studentIdActive: string;
  mannerTempTitle: string;
  mannerTempNote: string;
  handoffsLabel: string;
  lateLabel: string;
  replyTimeLabel: string;
  peaceTitle: string;
  peace1Title: string;
  peace1Desc: string;
  peace2Title: string;
  peace2Desc: string;
  peace3Title: string;
  peace3Desc: string;
  meetupSpotLabel: string;
  underCameras: string;
  meetupHoursLabel: string;
  meetupHoursValue: string;
  meetupTip: string;
  whySellingTitle: string;
  totalLabel: string;
  proposeMeetupBtn: string;
  shareCopied: string;
  // Sell View
  sellHeaderTitle: string;
  sellHeaderSubtitle: string;
  saveDraft: string;
  draftSaved: string;
  sellHeroTitle: string;
  sellHeroSubtitle: string;
  addPhotosLabel: string;
  requiredBadge: string;
  photoBoxTitle: string;
  photoBoxDesc: string;
  photoTip1Title: string;
  photoTip1Sub: string;
  photoTip2Title: string;
  photoTip2Sub: string;
  changePhoto: string;
  titleLabel: string;
  titleLimit: string;
  titlePlaceholder: string;
  categoryLabel: string;
  priceLabel: string;
  pricePlaceholder: string;
  retailOptionalLabel: string;
  retailPlaceholder: string;
  priceHint: string;
  safeZoneLabel: string;
  safeZoneVerifiedTag: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  commitmentText: string;
  publishBtn: string;
  publishingBtn: string;
  zeroFeeFooter: string;
  authRequiredToSellTitle: string;
  authRequiredToSellDesc: string;
  goToProfileAuth: string;
  // Meetup Modal
  meetupModalTitle: string;
  meetupModalSubtitle: string;
  selectSafeZone: string;
  selectTimeSlot: string;
  customTimePlaceholder: string;
  messageSellerLabel: string;
  messageSellerPlaceholder: string;
  meetupSafetyNote: string;
  confirmMeetupBtn: string;
  sendingMeetupBtn: string;
  meetupSuccessTitle: string;
  meetupSuccessDesc: string;
  closeModal: string;
  timeSlots: string[];
  // Profile & Auth
  profileTitle: string;
  loginTab: string;
  signupTab: string;
  emailLabel: string;
  passwordLabel: string;
  nicknameLabel: string;
  universityLabel: string;
  majorLabel: string;
  majorPlaceholder: string;
  loginBtn: string;
  signupBtn: string;
  authLoading: string;
  logoutBtn: string;
  myListingsTab: string;
  myMeetupsTab: string;
  noListingsYet: string;
  noMeetupsYet: string;
  postFirstItem: string;
  deleteItem: string;
  statusPending: string;
  statusAccepted: string;
  statusCompleted: string;
  supabaseNoticeTitle: string;
  supabaseNoticeDesc: string;
  signupSuccessCheckEmail: string;
}

export const translations: Record<Language, Translations> = {
  ru: {
    brandSuffix: 'KG',
    allUniversities: 'Все вузы Бишкека',
    verifiedStudentsBadge: '100% Студенты',
    bishkekLabel: 'Бишкек:',
    allCampuses: 'Все кампусы',
    searchPlaceholder: 'Поиск учебников, гаджетов, вещей...',
    freshTitle: 'Свежие лоты в кампусе',
    freshCountLabel: 'добавлено сегодня',
    freshSubtitle: 'Такие вещи разбирают за пару часов. Забирай выгодные лоты прямо сейчас!',
    sortNewest: 'Свежие',
    sortCheapest: 'Дешевле',
    sortPopular: 'Популярные',
    emptyFeedTitle: 'Пока ничего не найдено',
    emptyFeedDesc: 'Попробуйте сбросить фильтры или выбрать другой кампус в Бишкеке.',
    resetFilters: 'Сбросить фильтры',
    safetyBannerTitle: 'Безопасные встречи только в кампусе:',
    safetyBannerBody: 'атриум АУЦА, библиотека КНУ или столовая Манаса между парами — без лишней суеты!',
    navHome: 'Главная',
    navSell: 'Продать',
    navProfile: 'Профиль',
    slides: [
      {
        badge: 'СКИДКИ СЕМЕСТРА',
        title: 'Сэкономь до 50% на учебниках к сессии!',
        subtitle: 'Безопасная передача в кампусе между парами',
      },
      {
        badge: '0% КОМИССИИ',
        title: 'Преврати ненужные конспекты и гаджеты в сом!',
        subtitle: '100% оплаты на руки наличными или через MBank',
      },
      {
        badge: 'SAFE-ZONE БИШКЕК',
        title: 'Встречайся только с проверенными студентами!',
        subtitle: 'КНУ, АУЦА, Манас и КРСУ — передача под камерами кампуса',
      },
    ],
    categories: {
      All: 'Все находки',
      Textbooks: 'Учебники',
      Electronics: 'Гаджеты',
      'Dorm/Living': 'Для общаги',
      Clothing: 'Одежда',
    },
    universities: {
      ALL: 'Все вузы (Бишкек)',
      KNU: 'КНУ (Кыргыз нац. унив.)',
      AUCA: 'АУЦА (Amer. Univ.)',
      'Manas University': 'Унив. Манас',
      KRSU: 'КРСУ им. Ельцина',
    },
    universityShort: {
      ALL: 'Все вузы',
      KNU: 'КНУ Главный',
      AUCA: 'АУЦА Кампус',
      'Manas University': 'Унив. Манас',
      KRSU: 'КРСУ',
    },
    safeZones: [
      {
        id: 'knu-library',
        ru: 'Главный холл библиотеки КНУ (под камерами)',
        en: 'KNU Main Library Hall (CCTV Safe-Zone)',
        university: 'KNU',
      },
      {
        id: 'auca-atrium',
        ru: 'Атриум АУЦА (1 этаж у входа)',
        en: 'AUCA Atrium (1st Floor Entrance)',
        university: 'AUCA',
      },
      {
        id: 'manas-fountain',
        ru: 'У фонтана кампуса Манас / Столовая',
        en: 'Manas Campus Fountain / Cafeteria',
        university: 'Manas University',
      },
      {
        id: 'krsu-building2',
        ru: 'Столовая 2 корпуса КРСУ',
        en: 'KRSU Building 2 Cafeteria',
        university: 'KRSU',
      },
    ],
    listingHeader: 'Объявление',
    verifiedTag: 'ПРОВЕРЕНО',
    verifiedStudentOf: 'Проверенный студент',
    photosCounter: 'фото',
    savePrefix: 'Сэкономь',
    saveMiddle: 'по сравнению с магазином!',
    saveQuestion: 'Зачем переплачивать, если можно взять у однокурсника?',
    discountBadge: 'СКИДКА',
    retailSuffix: 'в магазине',
    viewingNowPrefix: '4 однокурсника смотрят сейчас ·',
    viewingNowSuffix: 'сохранили — забирай быстрее!',
    studentIdActive: 'Студенческий билет подтвержден (активен до 2026 г.)',
    mannerTempTitle: 'Индекс доверия в кампусе: (Супер надежный студент!)',
    mannerTempNote: 'Высокий рейтинг доверия среди однокурсников',
    handoffsLabel: 'успешные передачи из рук в руки',
    lateLabel: 'опозданий',
    replyTimeLabel: 'Отвечает за ~8 минут (обычно на перемене между парами)',
    peaceTitle: 'Кампусная гарантия спокойствия',
    peace1Title: 'Только реальные студенты',
    peace1Desc: 'Проверяем студенческие билеты кампуса, никаких посторонних.',
    peace2Title: 'Осмотр перед оплатой',
    peace2Desc: 'Спокойно проверь вещь лично, оплата наличными или MBank только если всё устроило.',
    peace3Title: 'Встречи под камерами наблюдения',
    peace3Desc: 'Безопасная передача в освещенном холле библиотеки или атриуме.',
    meetupSpotLabel: 'Место встречи:',
    underCameras: 'ПОД КАМЕРАМИ',
    meetupHoursLabel: 'Время:',
    meetupHoursValue: 'Пн–Пт: 11:30 – 16:00 (удобно забежать на большой перемене)',
    meetupTip: 'Возьми кофе и спокойно проверь товар перед покупкой!',
    whySellingTitle: 'Почему отдаю',
    totalLabel: 'Итого',
    proposeMeetupBtn: 'Назначить встречу',
    shareCopied: 'Ссылка скопирована!',
    sellHeaderTitle: 'Выставить лот в кампусе',
    sellHeaderSubtitle: 'Сеть кампусов: АУЦА · КНУ · Манас · КРСУ',
    saveDraft: 'Сохранить черновик',
    draftSaved: 'Черновик сохранен',
    sellHeroTitle: 'Преврати учебник с полки в 1 500 сом всего за пару часов!',
    sellHeroSubtitle: 'В среднем студенты КНУ и АУЦА поднимают 4 200 сом за семестр, продавая ненужные материалы.',
    addPhotosLabel: 'Сделай фото лота',
    requiredBadge: 'ОБЯЗАТЕЛЬНО',
    photoBoxTitle: 'Загрузи фото товара',
    photoBoxDesc: 'Снимки прямо на телефон продаются в 3 раза быстрее! Покажи обложку или состояние.',
    photoTip1Title: '1. Лицевая сторона',
    photoTip1Sub: 'Обязательно',
    photoTip2Title: '2. Чистое состояние',
    photoTip2Sub: 'Хороший свет',
    changePhoto: 'Выбрать другое фото',
    titleLabel: 'Что отдаёшь или продаёшь?',
    titleLimit: 'До 80 симв.',
    titlePlaceholder: 'Напр., Мат. анализ Стюарт 8 изд. (для курса)',
    categoryLabel: 'Выбери категорию',
    priceLabel: 'Твоя студенческая цена (сом)',
    pricePlaceholder: 'Честная цена',
    retailOptionalLabel: 'Цена в магазине (необязательно)',
    retailPlaceholder: 'Напр., 3500',
    priceHint: 'Рекомендуем: 1 000 – 1 500 сом для моментальной сделки сегодня!',
    safeZoneLabel: 'Где передашь однокурснику в руки?',
    safeZoneVerifiedTag: 'Проверенный спот',
    descriptionLabel: 'Расскажи детали лота',
    descriptionPlaceholder: 'Укажи состояние книги или вещи, для какого курса пригодится, и когда удобно пересечься на перемене...',
    commitmentText: 'Обязуюсь встретиться на территории кампуса и брать оплату только после личной проверки покупателем.',
    publishBtn: 'Опубликовать лот и получить деньги!',
    publishingBtn: 'Публикуем лот...',
    zeroFeeFooter: '0% комиссии · 100% денег студенту на руки',
    authRequiredToSellTitle: 'Войди как студент, чтобы публиковать лоты',
    authRequiredToSellDesc: 'Загрузка фото и публикация объявлений доступны подтверждённым студентам кампусов Бишкека.',
    goToProfileAuth: 'Войти / Регистрация',
    meetupModalTitle: 'Назначить встречу в кампусе',
    meetupModalSubtitle: 'Договорись о передаче между парами в безопасной зоне',
    selectSafeZone: 'Безопасная зона кампуса',
    selectTimeSlot: 'Удобное время (перемена)',
    customTimePlaceholder: 'Или напиши свое время (напр. Чт 14:15)',
    messageSellerLabel: 'Сообщение продавцу',
    messageSellerPlaceholder: 'Привет! Хочу посмотреть и забрать на перемене, оплачу наличными или MBank.',
    meetupSafetyNote: 'Оплата наличными или MBank только после личного осмотра товара.',
    confirmMeetupBtn: 'Отправить запрос на встречу',
    sendingMeetupBtn: 'Отправка запроса...',
    meetupSuccessTitle: 'Запрос на встречу отправлен!',
    meetupSuccessDesc: 'Продавец увидит твое предложение и безопасную точку встречи в кампусе.',
    closeModal: 'Отлично, закрыть',
    timeSlots: [
      'Сегодня · 12:00 – 12:30 (Большая перемена)',
      'Сегодня · 15:30 – 16:00 (После пар)',
      'Завтра · 10:00 – 10:30 (Утро)',
      'Завтра · 13:30 – 14:00 (Обед)',
    ],
    profileTitle: 'Мой профиль',
    loginTab: 'Вход',
    signupTab: 'Регистрация',
    emailLabel: 'Студенческий Email',
    passwordLabel: 'Пароль',
    nicknameLabel: 'Имя / Никнейм (напр., Айбек)',
    universityLabel: 'Университет',
    majorLabel: 'Факультет и курс',
    majorPlaceholder: 'Напр., 3 курс CS',
    loginBtn: 'Войти в аккаунт',
    signupBtn: 'Создать профиль студента',
    authLoading: 'Подождите...',
    logoutBtn: 'Выйти',
    myListingsTab: 'Мои лоты',
    myMeetupsTab: 'Встречи',
    noListingsYet: 'У тебя пока нет активных лотов',
    noMeetupsYet: 'Запросов на встречу пока нет',
    postFirstItem: 'Выставить первый лот',
    deleteItem: 'Удалить',
    statusPending: 'Ожидает',
    statusAccepted: 'Подтверждено',
    statusCompleted: 'Передано',
    supabaseNoticeTitle: 'Подключите проект Supabase',
    supabaseNoticeDesc: 'Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в переменные окружения и выполните supabase-schema.sql для живой авторизации, БД и Storage.',
    signupSuccessCheckEmail: 'Аккаунт создан! Если включено подтверждение почты в Supabase, проверьте email, либо войдите прямо сейчас.',
  },
  en: {
    brandSuffix: 'KG',
    allUniversities: 'All Universities',
    verifiedStudentsBadge: '100% Student Verified',
    bishkekLabel: 'Bishkek:',
    allCampuses: 'All Campuses',
    searchPlaceholder: 'Search textbooks, gadgets, dorm gear...',
    freshTitle: 'Fresh Campus Drops',
    freshCountLabel: 'added today',
    freshSubtitle: 'Campus deals go within hours. Grab student prices between classes!',
    sortNewest: 'Newest',
    sortCheapest: 'Lowest Price',
    sortPopular: 'Popular',
    emptyFeedTitle: 'No matching items found',
    emptyFeedDesc: 'Try clearing your search or switching to All Universities in Bishkek.',
    resetFilters: 'Reset Filters',
    safetyBannerTitle: 'Safe campus-only meetups:',
    safetyBannerBody: 'AUCA Atrium, KNU Library, or Manas Cafeteria between classes — zero hassle!',
    navHome: 'Home',
    navSell: 'Sell',
    navProfile: 'My Page',
    slides: [
      {
        badge: 'SEMESTER DEALS',
        title: 'Save up to 50% on semester textbooks!',
        subtitle: 'Safe handoffs on campus between classes',
      },
      {
        badge: '0% PLATFORM FEE',
        title: 'Turn shelf textbooks & gadgets into cash fast!',
        subtitle: 'Keep 100% of every sale via cash or MBank',
      },
      {
        badge: 'BISHKEK SAFE-ZONES',
        title: 'Trade only with verified campus students!',
        subtitle: 'KNU, AUCA, Manas & KRSU — CCTV-covered campus lobbies',
      },
    ],
    categories: {
      All: 'All',
      Textbooks: 'Textbooks',
      Electronics: 'Electronics',
      'Dorm/Living': 'Dorm/Living',
      Clothing: 'Clothing',
    },
    universities: {
      ALL: 'All Universities',
      KNU: 'KNU (Kyrgyz National)',
      AUCA: 'AUCA Campus',
      'Manas University': 'Manas Univ.',
      KRSU: 'KRSU',
    },
    universityShort: {
      ALL: 'All Campuses',
      KNU: 'KNU Main',
      AUCA: 'AUCA',
      'Manas University': 'Manas Univ.',
      KRSU: 'KRSU',
    },
    safeZones: [
      {
        id: 'knu-library',
        ru: 'Главный холл библиотеки КНУ (под камерами)',
        en: 'KNU Main Library Hall (CCTV Safe-Zone)',
        university: 'KNU',
      },
      {
        id: 'auca-atrium',
        ru: 'Атриум АУЦА (1 этаж у входа)',
        en: 'AUCA Atrium (1st Floor Entrance)',
        university: 'AUCA',
      },
      {
        id: 'manas-fountain',
        ru: 'У фонтана кампуса Манас / Столовая',
        en: 'Manas Campus Fountain / Cafeteria',
        university: 'Manas University',
      },
      {
        id: 'krsu-building2',
        ru: 'Столовая 2 корпуса КРСУ',
        en: 'KRSU Building 2 Cafeteria',
        university: 'KRSU',
      },
    ],
    listingHeader: 'Listing',
    verifiedTag: 'VERIFIED',
    verifiedStudentOf: 'Verified Student',
    photosCounter: 'photos',
    savePrefix: 'Save',
    saveMiddle: 'vs. Retail!',
    saveQuestion: 'Why pay full store markup when a classmate has it ready on campus?',
    discountBadge: 'OFF',
    retailSuffix: 'retail price',
    viewingNowPrefix: '4 classmates viewing now ·',
    viewingNowSuffix: 'saved — claim before finals!',
    studentIdActive: 'University Student ID verified (active through 2026)',
    mannerTempTitle: 'Campus Trust Index: (Super Reliable Student!)',
    mannerTempNote: 'Top-tier reputation across Bishkek campuses',
    handoffsLabel: 'successful campus handoffs',
    lateLabel: 'no-shows',
    replyTimeLabel: 'Usually replies in ~8 mins (between lectures)',
    peaceTitle: 'Campus Peace of Mind',
    peace1Title: 'Verified Students Only',
    peace1Desc: 'Every seller belongs to KNU, AUCA, Manas, or KRSU — no random strangers.',
    peace2Title: 'Inspect Before Paying',
    peace2Desc: 'Flip through pages or test electronics in person, then pay via cash or MBank.',
    peace3Title: 'CCTV-Covered Safe Zones',
    peace3Desc: 'Meet in well-lit campus library halls, atriums, or cafeterias.',
    meetupSpotLabel: 'Meetup Spot:',
    underCameras: 'CCTV SAFE-ZONE',
    meetupHoursLabel: 'Best Hours:',
    meetupHoursValue: 'Mon–Fri: 11:30 – 16:00 (easy between classes)',
    meetupTip: 'Grab a coffee and inspect the item comfortably before paying!',
    whySellingTitle: 'Why I’m selling',
    totalLabel: 'Total',
    proposeMeetupBtn: 'Propose Meetup',
    shareCopied: 'Listing link copied!',
    sellHeaderTitle: 'List New Item',
    sellHeaderSubtitle: 'Campus Network: AUCA · KNU · Manas · KRSU',
    saveDraft: 'Save Draft',
    draftSaved: 'Draft saved',
    sellHeroTitle: 'Turn an unused textbook into 1,500 сом in just a few hours!',
    sellHeroSubtitle: 'KNU and AUCA students earn an average of 4,200 сом per semester selling course gear.',
    addPhotosLabel: 'Add real photo',
    requiredBadge: 'REQUIRED',
    photoBoxTitle: 'Upload item photo',
    photoBoxDesc: 'Real phone photos sell 3x faster! Show the cover, screen, or condition clearly.',
    photoTip1Title: '1. Front View',
    photoTip1Sub: 'Required',
    photoTip2Title: '2. Clean Condition',
    photoTip2Sub: 'Daylight works best',
    changePhoto: 'Choose another photo',
    titleLabel: 'What are you selling?',
    titleLimit: 'Max 80 chars',
    titlePlaceholder: 'e.g., Calculus Stewart 8th Ed. (for Math 101)',
    categoryLabel: 'Select Category',
    priceLabel: 'Your student price (сом)',
    pricePlaceholder: 'Fair price',
    retailOptionalLabel: 'Retail price (optional)',
    retailPlaceholder: 'e.g., 3500',
    priceHint: 'Recommended: 1,000 – 1,500 сом for a same-day campus deal!',
    safeZoneLabel: 'Where will you hand it off on campus?',
    safeZoneVerifiedTag: 'Verified Safe-Zone',
    descriptionLabel: 'Tell classmates about the item',
    descriptionPlaceholder: 'Share condition, which course/professor uses it, and which break times work best for a quick handoff...',
    commitmentText: 'I agree to meet on campus and accept payment only after the buyer inspects the item in person.',
    publishBtn: 'Publish Item & Get Paid!',
    publishingBtn: 'Publishing item...',
    zeroFeeFooter: '0% fee · 100% goes directly to the student',
    authRequiredToSellTitle: 'Sign in as a student to post items',
    authRequiredToSellDesc: 'Photo uploads to Supabase Storage and campus listings require a verified student account.',
    goToProfileAuth: 'Sign In / Sign Up',
    meetupModalTitle: 'Propose Campus Meetup',
    meetupModalSubtitle: 'Pick a CCTV-covered Safe-Zone between classes',
    selectSafeZone: 'Campus Safe-Zone',
    selectTimeSlot: 'Preferred Time Slot',
    customTimePlaceholder: 'Or enter custom time (e.g. Thu 14:15)',
    messageSellerLabel: 'Note to Seller',
    messageSellerPlaceholder: 'Hi! Can I inspect and pick this up between classes? Will pay cash or MBank.',
    meetupSafetyNote: 'Pay via cash or MBank only after inspecting the item in person.',
    confirmMeetupBtn: 'Send Meetup Request',
    sendingMeetupBtn: 'Sending request...',
    meetupSuccessTitle: 'Meetup Request Sent!',
    meetupSuccessDesc: 'Your proposed Safe-Zone and break time have been saved to campus requests.',
    closeModal: 'Done',
    timeSlots: [
      'Today · 12:00 – 12:30 (Lunch Break)',
      'Today · 15:30 – 16:00 (After Class)',
      'Tomorrow · 10:00 – 10:30 (Morning)',
      'Tomorrow · 13:30 – 14:00 (Midday)',
    ],
    profileTitle: 'My Page',
    loginTab: 'Login',
    signupTab: 'Sign Up',
    emailLabel: 'Student Email',
    passwordLabel: 'Password',
    nicknameLabel: 'Nickname (e.g., Aibek)',
    universityLabel: 'University',
    majorLabel: 'Major / Year',
    majorPlaceholder: 'e.g., Junior CS',
    loginBtn: 'Sign In',
    signupBtn: 'Create Student Account',
    authLoading: 'Please wait...',
    logoutBtn: 'Sign Out',
    myListingsTab: 'My Listings',
    myMeetupsTab: 'Meetups',
    noListingsYet: 'You have not listed any items yet',
    noMeetupsYet: 'No meetup requests yet',
    postFirstItem: 'List Your First Item',
    deleteItem: 'Delete',
    statusPending: 'Pending',
    statusAccepted: 'Accepted',
    statusCompleted: 'Completed',
    supabaseNoticeTitle: 'Connect Your Supabase Project',
    supabaseNoticeDesc: 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables and run supabase-schema.sql for live auth, DB, and Storage.',
    signupSuccessCheckEmail: 'Account created! Check your inbox if email confirmation is enabled in Supabase, or sign in right away.',
  },
};
