import type { Locale } from "./config";

/**
 * Sahifadagi barcha matnlar. Yangi bo'lim qo'shilganda shu yerga kalit
 * qo'shiladi — komponentlarda hardcode qilingan matn bo'lmasin.
 */
type Card = { title: string; body: string };

export type Dictionary = {
  nav: {
    home: string;
    products: string;
    about: string;
    certificates: string;
    articles: string;
    contacts: string;
  };
  hero: {
    titleAccent: string;
    titleRest: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    disclaimer: string;
  };
  stats: {
    experience: { value: string; label: string };
    team: { value: string; label: string };
    packages: { value: string; label: string };
    /** Qiymati mahsulotlar bazasidan hisoblanadi — bu yerda faqat yorliq. */
    products: { label: string };
  };
  concerns: {
    label: string;
    title: string;
    titleAccent: string;
    body: string;
    items: [string, string, string, string, string];
  };
  directions: {
    label: string;
    title: string;
    body: string;
    link: string;
    cards: [Card, Card, Card];
  };
  /**
   * Mahsulot pasporti bo'limi — faqat statik matnlar.
   * Mahsulotlarning o'zi `lib/admin/store.ts` dan keladi.
   */
  passport: {
    label: string;
    title: string;
    body: string;
    originTitle: string;
    openProduct: string;
    fields: { raw: string; maker: string; role: string };
    statLabels: { form: string; pack: string; intake: string };
  };
  trust: {
    label: string;
    title: string;
    titleAccent: string;
    body: string;
    cta: string;
    certAlt: string;
    cards: [Card, Card, Card];
  };
  about: {
    label: string;
    title: string;
    /** 2-xatboshida `{count}` mahsulotlar soniga almashadi. */
    paragraphs: [string, string];
    missionLabel: string;
    mission: string;
    missionNote: string;
  };
  journey: {
    label: string;
    title: string;
    body: string;
    steps: [Card, Card, Card, Card];
  };
  video: { play: string; alt: string; caption: string; close: string };
  cta: { label: string; title: string; body: string };
  footer: {
    menu: { products: string; about: string; certificates: string; articles: string };
    tagline: string;
    menuTitle: string;
    warningTitle: string;
    warning: string;
    legalTitle: string;
    legal: string;
    copyright: string;
    slogan: string;
    /** Ijtimoiy tarmoq manzili hali sozlanmaganda ko'rsatiladi. */
    socialSoon: string;
  };
  productsPage: {
    meta: { title: string; description: string };
    searchLabel: string;
    searchPlaceholder: string;
    searchButton: string;
    label: string;
    title: string;
    intro: string;
    notFound: string;
    disclaimer: string;
    passportCta: string;
    docsAria: string;
    statLabels: { form: string; pack: string; intake: string };
    contact: {
      label: string;
      title: string;
      body: string;
      primary: string;
      secondary: string;
      imageAlt: string;
    };
  };
  contactPage: {
    meta: { title: string; description: string };
    hero: {
      label: string;
      title: string;
      titleAccent: string;
      body: string;
      primary: string;
      secondary: string;
      imageAlt: string;
    };
    message: {
      label: string;
      title: string;
      titleAccent: string;
      intro: string;
      channels: Array<[string, string, string]>;
    };
    form: {
      label: string;
      title: string;
      intro: string;
      name: string;
      phone: string;
      email: string;
      topic: string;
      message: string;
      messagePlaceholder: string;
      namePlaceholder: string;
      topics: string[];
      consent: string;
      submit: string;
      sent: string;
    };
    office: {
      label: string;
      title: string;
      body: string;
      mapCta: string;
      mapTitle: string;
      rows: Array<[string, string]>;
      cta: string;
    };
    faq: {
      label: string;
      title: string;
      intro: string;
      items: Array<{ q: string; a: string }>;
    };
  };
  aboutPage: {
    meta: { title: string; description: string };
    hero: {
      label: string; title: string; titleAccent: string; body: string;
      cta: string; tags: [string, string]; imageAlt: string;
    };
    stats: Array<[string, string]>;
    story: { label: string; title: string; body: string; quote: string };
    mission: { label: string; title: string; body: string };
    approach: {
      label: string; title: string; intro: string;
      principles: Array<{ icon: string; title: string; body: string }>;
    };
    chain: {
      label: string; title: string; body: string;
      steps: Array<[string, string, string]>;
    };
    certificates: {
      label: string; title: string; intro: string;
      productLabel: string; note: string; alt: string; open: string;
    };
    responsibility: {
      label: string; title: string; body: string;
      points: string[]; imageAlt: string;
    };
    contact: {
      label: string; title: string; body: string;
      primary: string; secondary: string; imageAlt: string;
    };
  };
  /** Maqolalar — bosh sahifadagi bo'lim, ro'yxat va maqola sahifasi. */
  articles: {
    label: string;
    title: string;
    titleAccent: string;
    intro: string;
    all: string;
    readMore: string;
    back: string;
    empty: string;
    listTitle: string;
    listIntro: string;
    meta: { title: string; description: string };
    /** Admin maqolaga mahsulot bog'lagan bo'lsa, matn oxirida chiqadigan karta. */
    relatedProduct: { label: string; title: string; titleAccent: string; cta: string };
  };
  /**
   * Mahsulot pasporti (`/products/<slug>`) — faqat STATIK matnlar.
   * Mahsulotga xos hamma narsa admin panelda (`lib/admin/store.ts`).
   */
  productPage: {
    back: string;
    hero: { primary: string; secondary: string };
    factLabels: [string, string, string, string];
    composition: {
      label: string; title: string; titleAccent: string;
      intro: string; perCapsule: string; perSachet: string; perApplicator: string;
    };
    usage: { label: string; daily: string };
    /** `defaultItems` — mahsulotda "Qabuldan oldin" to'ldirilmagan bo'lsa ko'rsatiladigan umumiy BAD ogohlantirishlari. */
    before: { label: string; defaultItems: string[] };
    safety: { label: string; title: string; body: string };
    origin: {
      label: string; title: string; titleAccent: string;
      cardRaw: string; cardMake: string; note: string;
      rowLabels: [string, string, string];
      /** «Chet eldan import qilingan» holati uchun. */
      importedTitle: string; importedCardLabel: string;
    };
    documents: {
      label: string; title: string; titleAccent: string; body: string;
      typeLabel: string; typeValue: string;
      formatLabel: string; formatValue: string;
      certificateCta: string; instructionCta: string;
      certificateAlt: string; instructionEmpty: string;
    };
    related: {
      label: string; title: string; titleAccent: string;
      intro: string; cta: string;
    };
  };
  common: {
    viewProducts: string;
    close: string;
  };
  a11y: {
    openMenu: string;
    closeMenu: string;
    language: string;
    /** Til tugmasidagi "tanlangan" holati (faqat ekran o'quvchi uchun). */
    languageActive: string;
  };
  meta: {
    title: string;
    description: string;
  };
  notFound: {
    title: string;
    body: string;
    cta: string;
  };
};

const ru: Dictionary = {
  nav: {
    home: "Главная",
    products: "Продукты",
    about: "О нас",
    certificates: "Сертификаты",
    articles: "Статьи",
    contacts: "Контакты",
  },
  hero: {
    titleAccent: "CureLife —",
    titleRest: "европейское качество для вашей жизни",
    subtitle:
      "Биологически активные добавки на основе немецкого сырья для комплексной заботы о здоровье всей семьи.",
    ctaPrimary: "Посмотреть продукты",
    ctaSecondary: "Проверить сертификаты",
    disclaimer:
      "Перед применением ознакомьтесь с инструкцией и проконсультируйтесь со специалистом.",
  },
  stats: {
    experience: { value: "5 лет", label: "Опыт на рынке" },
    team: { value: "20+", label: "Сотрудников" },
    packages: { value: "100 000+", label: "Доставленных упаковок" },
    products: { label: "Продуктов в ассортименте" },
  },
  concerns: {
    label: "02 / Вопросы при выборе",
    title: "При выборе продукта для здоровья вопросы — это",
    titleAccent: "нормально.",
    body: "Если состав, безопасность и происхождение продукта непонятны, принять правильное решение становится сложнее.",
    items: [
      "Подходит ли мне состав?",
      "Есть ли у продукта сертификат?",
      "Как его принимать?",
      "Есть ли аллергены или ограничения?",
      "Можно ли принимать вместе с другими препаратами?",
    ],
  },
  directions: {
    label: "03 / Направления",
    title: "Выберите продукт, подходящий вашему организму.",
    body: "Выберите нужное направление и ознакомьтесь с основной информацией. Каждое направление оформлено понятно и соответствует конкретным потребностям.",
    link: "Посмотреть продукты",
    cards: [
      {
        title: "Для женщин",
        body: "Для поддержки физиологических потребностей женского организма.",
      },
      {
        title: "Для мужчин",
        body: "Для поддержки ежедневной активности и физиологических функций.",
      },
      {
        title: "Период планирования",
        body: "Для поддержки потребностей организма в период планирования беременности.",
      },
    ],
  },
  passport: {
    label: "04 / Паспорт продукта",
    title: "Выберите продукт.",
    body: "Состав, дозировка, производитель и важные ограничения собраны в одном паспорте. Нужную информацию можно найти за несколько секунд.",
    originTitle: "Происхождение",
    openProduct: "Открыть паспорт продукта",
    fields: {
      raw: "Сырьё",
      maker: "Производитель",
      role: "Роль CureLife",
    },
    statLabels: {
      form: "Форма выпуска",
      pack: "Упаковка",
      intake: "Приём",
    },
  },
  trust: {
    label: "05 / Доверие",
    title: "Соответствует стандартам и",
    titleAccent: "подтверждено сертификатами.",
    body: "Для каждого продукта отдельно представлены сертификат, инструкция и информация о происхождении. Документы доступны пользователю.",
    cta: "Посмотреть документы",
    certAlt: "Сертификат GMP",
    cards: [
      {
        title: "Сертификат продукта",
        body: "Документ и подтверждающая информация для каждого продукта.",
      },
      {
        title: "Инструкция PDF",
        body: "Состав, дозировка, способ применения и противопоказания.",
      },
      {
        title: "Происхождение",
        body: "Информация о производителе, сырье и стране происхождения.",
      },
    ],
  },
  about: {
    label: "06 / О CureLife",
    title: "Качество для здоровой жизни",
    paragraphs: [
      "CureLife более пяти лет занимается дистрибуцией биологически активных добавок. Мы тщательно отбираем продукцию: сегодня в ассортименте {count} на основе качественного сырья из Германии.",
      "CureLife — это команда из более чем 20 специалистов и свыше 100 000 упаковок продукции, доставленных нашим покупателям.",
    ],
    missionLabel: "— НАША МИССИЯ",
    mission: "«Делать заботу о здоровье простой, понятной и доступной каждому»",
    missionNote:
      "Мы стремимся помогать людям поддерживать здоровье и хорошее самочувствие.",
  },
  journey: {
    label: "07 / Путь продукта",
    title: "Каждый этап — от сырья до выхода на рынок — под контролем.",
    body: "Подготовка, производство, проверка и вывод продукта на рынок показаны поэтапно.",
    steps: [
      {
        title: "Сырьё",
        body: "Основное сырьё подготавливается и принимается вместе с необходимыми документами.",
      },
      {
        title: "Производство",
        body: "Продукт производится и упаковывается в соответствии с установленными стандартами.",
      },
      {
        title: "Контроль",
        body: "Проверяются инструкция, маркировка и документы на продукт.",
      },
      {
        title: "Подготовка к рынку",
        body: "Продукт подготавливается к дистрибуции и официальной продаже.",
      },
    ],
  },
  video: {
    play: "Смотреть видео о производстве",
    alt: "Производственная площадка Avitale",
    caption: "Avitale — наш партнёр-производитель в Германии",
    close: "Закрыть видео",
  },
  cta: {
    label: "09 / Финальный призыв",
    title: "Разберитесь в продукте и выбирайте уверенно.",
    body: "Ознакомьтесь с составом, способом применения, ограничениями и документами.",
  },
  footer: {
    menu: {
      products: "Продукты",
      about: "О компании",
      certificates: "Сертификаты",
      articles: "Статьи",
    },
    tagline:
      "Открытая и понятная информация, которая помогает сделать осознанный выбор.",
    menuTitle: "Меню",
    warningTitle: "Предупреждение",
    warning:
      "БАД не является лекарственным средством. Проконсультируйтесь со специалистом.",
    legalTitle: "Правовая информация",
    legal:
      "Информация на сайте не предназначена для постановки диагноза и лечения.",
    copyright: "© 2026 CureLife. Все права защищены.",
    slogan: "Осознанный выбор · Открытая информация",
    socialSoon: "скоро",
  },
  productsPage: {
    meta: {
      title: "Каталог продуктов CureLife",
      description:
        "Биологически активные добавки CureLife: состав, способ применения и паспорта продуктов.",
    },
    searchLabel: "Поиск продукта",
    searchPlaceholder: "Например: NovaLife Plus, Fimbriolok, витамины...",
    searchButton: "Найти",
    label: "ВСЕ ПРОДУКТЫ",
    title: "Найдите подходящий продукт.",
    intro:
      "Используйте поиск или выберите направление. Перед применением изучите инструкцию, противопоказания и проконсультируйтесь со специалистом.",
    notFound: "По вашему запросу продукты не найдены.",
    disclaimer:
      "Биологически активные добавки не являются лекарственными средствами. Информация в каталоге носит ознакомительный характер. Перед применением изучите официальную инструкцию и проконсультируйтесь со специалистом.",
    passportCta: "Паспорт продукта",
    docsAria: "Документы",
    statLabels: { form: "Форма", pack: "Упаковка", intake: "Приём" },
    contact: {
      label: "07 / СВЯЗАТЬСЯ",
      title: "Есть вопрос о компании или продукте?",
      body: "Свяжитесь с CureLife, чтобы уточнить информацию о составе, происхождении, сертификатах или официальных точках продаж.",
      primary: "Связаться с нами",
      secondary: "Перейти к продуктам",
      imageAlt: "Безопасность продукции CureLife",
    },
  },
  contactPage: {
    meta: {
      title: "Связаться с CureLife",
      description:
        "Обратитесь к команде CureLife по вопросам продуктов, сертификатов, сотрудничества и официальных точек продаж.",
    },
    hero: {
      label: "01 / КОНТАКТЫ",
      title: "Мы рядом,",
      titleAccent: "когда есть вопросы.",
      body: "Уточните информацию о продуктах, составе, сертификатах, сотрудничестве или официальных точках продаж. Команда CureLife поможет направить ваш вопрос нужному специалисту.",
      primary: "Написать нам",
      secondary: "Контактная информация",
      imageAlt: "Связаться с CureLife",
    },
    message: {
      label: "03 / ОБРАТНАЯ СВЯЗЬ",
      title: "Выберите тему и",
      titleAccent: "оставьте сообщение.",
      intro:
        "Форма помогает быстрее направить обращение нужному сотруднику. Для быстрого ответа выберите подходящую тему и подробно опишите свой вопрос.",
      channels: [
        ["ТЕЛЕФОН", "", "Для общих вопросов и информации о продуктах."],
        ["ЭЛЕКТРОННАЯ ПОЧТА", "info@curelife.uz", "Корпоративная почта для обращений и сотрудничества."],
        ["РЕЖИМ РАБОТЫ", "Пн–Пт · 09:00–18:00", "Фактический график можно скорректировать."],
      ],
    },
    form: {
      label: "СООБЩЕНИЕ",
      title: "Чем можем помочь?",
      intro:
        "Заполните основные поля — обращение попадёт к нам и мы ответим по указанным контактам.",
      name: "Имя",
      phone: "Телефон",
      email: "E-mail",
      topic: "Тема обращения",
      message: "Сообщение",
      messagePlaceholder: "Опишите ваш вопрос",
      namePlaceholder: "Ваше имя",
      topics: ["Вопрос о продукте", "Сертификаты", "Сотрудничество", "Точки продаж"],
      consent:
        "Я согласен(а) на обработку данных, указанных в форме, для ответа на моё обращение.",
      submit: "Отправить сообщение",
      sent: "Спасибо! Ваше обращение получено — мы свяжемся с вами.",
    },
    office: {
      label: "05 / ОФИС",
      title: "Контактная точка CureLife",
      body: "Свяжитесь с командой CureLife, чтобы уточнить адрес, телефон и актуальный график работы офиса.",
      mapCta: "Открыть на карте",
      mapTitle: "Карта: офис CureLife",
      rows: [
        ["АДРЕС", "Ташкент, Узбекистан"],
        ["РАБОЧЕЕ ВРЕМЯ", "Пн–Пт · 09:00–18:00"],
      ],
      cta: "Связаться с нами",
    },
    faq: {
      label: "06 / ВОПРОСЫ И ОТВЕТЫ",
      title: "Перед обращением.",
      intro:
        "Короткие ответы на частые вопросы помогут быстрее найти нужную информацию.",
      items: [
        {
          q: "Где посмотреть информацию о конкретном продукте?",
          a: "На странице каталога выберите продукт — в его паспорте собраны состав, способ применения, ограничения, происхождение и документы.",
        },
        {
          q: "Где доступны сертификаты?",
          a: "Сертификаты размещены в разделе о компании и в паспортах соответствующих продуктов.",
        },
        {
          q: "Можно ли через форму задать медицинский вопрос?",
          a: "Форма предназначена для общих вопросов. По медицинским вопросам необходимо обратиться к квалифицированному специалисту.",
        },
        {
          q: "Как отправить предложение о сотрудничестве?",
          a: "Выберите в форме тему «Сотрудничество» и подробно опишите предложение.",
        },
      ],
    },
  },
  aboutPage: {
    meta: {
      title: "О CureLife — открытый и ответственный подход",
      description: "О компании CureLife, качестве продукции, принципах производства и сертификатах.",
    },
    hero: {
      label: "01 / О КОМПАНИИ",
      title: "Открытая забота о",
      titleAccent: "здоровье семьи.",
      body: "CureLife — компания в сфере биологически активных добавок. Мы объединяем европейское сырьё, локальное производство и понятную информацию, чтобы человек мог сделать осознанный выбор.",
      cta: "Посмотреть сертификаты",
      tags: ["● Европейское сырьё", "● Производство в Узбекистане"],
      imageAlt: "CureLife — забота о здоровье семьи",
    },
    stats: [
      ["5 лет", "опыта на рынке БАД"],
      ["20+", "специалистов в команде"],
      ["100 000+", "доставленных упаковок"],
      ["6", "продуктов в ассортименте"],
    ],
    story: {
      label: "02 / НАША ИСТОРИЯ",
      title: "Продукты, о которых можно узнать всё важное.",
      body: "CureLife развивает ассортимент биологически активных добавок для женщин, мужчин и всей семьи. Мы стремимся сделать информацию о составе, применении, происхождении и документах доступной и понятной ещё до покупки продукта.",
      quote: "«Осознанный выбор начинается не с обещаний, а с открытой информации».",
    },
    mission: {
      label: "НАША МИССИЯ",
      title: "Помогать людям принимать уверенные и ответственные решения.",
      body: "Мы открыто показываем, из чего состоит продукт, как он производится, какие документы имеет и как его правильно применять.",
    },
    approach: {
      label: "03 / НАШ ПОДХОД",
      title: "Четыре принципа, на которых строится CureLife.",
      intro: "Каждый этап — от выбора сырья до информации на сайте — должен помогать пользователю лучше понимать продукт и принимать решение без лишней неопределённости.",
      principles: [
        { icon: "◇", title: "Прозрачность", body: "Показываем состав, способ применения, ограничения, происхождение и документы продукта." },
        { icon: "▣", title: "Ответственность", body: "Не заменяем профессиональную рекомендацию и напоминаем учитывать индивидуальные особенности." },
        { icon: "△", title: "Контроль", body: "Проверяем документацию, маркировку и соответствие продукта установленным требованиям." },
        { icon: "♧", title: "Забота", body: "Создаём понятный пользовательский опыт для людей с разными потребностями и вопросами." },
      ],
    },
    chain: {
      label: "04 / ОТ СЫРЬЯ ДО ПРОДУКТА",
      title: "Европейская основа. Локальное производство. Единый контроль.",
      body: "Основное сырьё поступает из Германии. Производство и упаковка выполняются в Узбекистане, а CureLife сопровождает продукт как заказчик и дистрибьютор.",
      steps: [
        ["01 / ГЕРМАНИЯ", "Сырьё", "Компоненты и витаминно-минеральные премиксы от европейских поставщиков."],
        ["02 / УЗБЕКИСТАН", "Производство", "Продукт производится и упаковывается локально в соответствии с процедурой контроля."],
        ["03 / CURELIFE", "Дистрибуция", "Компания организует вывод продукта на рынок, продвижение и контроль документов."],
      ],
    },
    certificates: {
      label: "05 / СЕРТИФИКАТЫ",
      title: "Документы, подтверждающие качество и происхождение.",
      intro: "Нажмите на документ, чтобы посмотреть его в увеличенном виде.",
      productLabel: "ПРОДУКТ",
      note: "Документ о соответствии и регистрации продукта.",
      alt: "Сертификат",
      open: "Открыть сертификат",
    },
    responsibility: {
      label: "06 / ОТВЕТСТВЕННОСТЬ",
      title: "Не просто продукт — понятная система информации.",
      body: "CureLife стремится, чтобы пользователь мог быстро найти основные сведения и понимать, какие вопросы стоит обсудить со специалистом.",
      points: ["Состав и дозировка", "Применение и ограничения", "Происхождение и документы"],
      imageAlt: "Открытая система информации CureLife",
    },
    contact: {
      label: "07 / СВЯЗАТЬСЯ",
      title: "Есть вопрос о компании или продукте?",
      body: "Свяжитесь с CureLife, чтобы уточнить информацию о составе, происхождении, сертификатах или официальных точках продаж.",
      primary: "Связаться с нами",
      secondary: "Перейти к продуктам",
      imageAlt: "Безопасность продуктов CureLife",
    },
  },
  articles: {
    label: "08 / Статьи",
    title: "Материалы о",
    titleAccent: "составе и применении.",
    intro: "Короткие статьи о том, как читать состав, хранить продукт и когда стоит обратиться к специалисту.",
    all: "Все статьи",
    readMore: "Читать подробнее",
    back: "Вернуться к статьям",
    empty: "Статьи скоро появятся.",
    listTitle: "Статьи",
    listIntro: "Материалы о составе, применении и хранении продуктов CureLife.",
    meta: {
      title: "Статьи — CureLife",
      description: "Материалы о составе, применении, хранении продуктов и о том, когда стоит обратиться к специалисту.",
    },
    relatedProduct: {
      label: "ПО ЭТОЙ ТЕМЕ",
      title: "Продукт, который",
      titleAccent: "может пригодиться.",
      cta: "Открыть паспорт продукта",
    },
  },
  productPage: {
    back: "Вернуться к продуктам",
    hero: {
      primary: "Посмотреть состав",
      secondary: "Информация о безопасности",
    },
    factLabels: ["ПРИЁМ", "УПАКОВКА", "СЫРЬЁ", "ПРОИЗВОДИТЕЛЬ"],
    composition: {
      label: "СОСТАВ",
      title: "Знайте точное количество",
      titleAccent: "каждого компонента.",
      intro: "Ниже приведены основные компоненты, указанные в инструкции. Полный состав и вспомогательные вещества смотрите в инструкции к продукту.",
      perCapsule: "Количество в одной капсуле",
      perSachet: "Количество в одном саше",
      perApplicator: "Количество в одном аппликаторе",
    },
    usage: { label: "СПОСОБ ПРИМЕНЕНИЯ", daily: "ежедневно" },
    before: {
      label: "ПЕРЕД ПРИЁМОМ",
      defaultItems: [
        "Проверьте целостность упаковки и срок годности.",
        "Учитывайте индивидуальную чувствительность к компонентам.",
        "При беременности, кормлении грудью и приёме препаратов проконсультируйтесь с врачом.",
        "Не превышайте рекомендуемую суточную дозу.",
      ],
    },
    safety: {
      label: "БЕЗОПАСНОСТЬ",
      title: "Когда следует соблюдать осторожность?",
      body: "БАД не является лекарственным средством. Важно получить рекомендацию врача с учётом индивидуального состояния.",
    },
    origin: {
      label: "ПРОИСХОЖДЕНИЕ",
      title: "Немецкое сырьё.",
      titleAccent: "Производится в Узбекистане.",
      cardRaw: "СЫРЬЁ",
      cardMake: "ПРОИЗВОДСТВО",
      note: "Сверяйте окончательные сведения о производителе и происхождении с упаковкой продукта и официальной инструкцией.",
      rowLabels: ["СЫРЬЁ", "ПРОИЗВОДИТЕЛЬ", "РОЛЬ CURELIFE"],
      importedTitle: "Страна производства —",
      importedCardLabel: "СТРАНА ПРОИЗВОДСТВА",
    },
    documents: {
      label: "ДОКУМЕНТЫ",
      title: "Сертификат",
      titleAccent: "и инструкция",
      body: "Документ, подтверждающий качество продукта и соответствие требованиям. Перед покупкой можно ознакомиться с сертификатом и инструкцией по применению.",
      typeLabel: "ТИП ДОКУМЕНТА",
      typeValue: "Сертификат продукта",
      formatLabel: "ФОРМАТ",
      formatValue: "PDF · для просмотра",
      certificateCta: "Открыть сертификат",
      instructionCta: "Открыть инструкцию",
      certificateAlt: "Сертификат продукта",
      instructionEmpty: "Инструкция будет добавлена позже.",
    },
    related: {
      label: "ДРУГИЕ ПРОДУКТЫ",
      title: "Вас может",
      titleAccent: "заинтересовать.",
      intro: "Выбирайте продукты только с учётом потребностей, состава, противопоказаний и рекомендаций специалиста.",
      cta: "Посмотреть паспорт",
    },
  },
  common: {
    viewProducts: "Посмотреть продукты",
    close: "Закрыть",
  },
  a11y: {
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    language: "Выбор языка",
    languageActive: "выбран",
  },
  meta: {
    title: "CureLife — европейское качество для вашей жизни",
    description:
      "Биологически активные добавки на основе немецкого сырья для комплексной заботы о здоровье всей семьи.",
  },
  notFound: {
    title: "Страница не найдена",
    body: "Возможно, ссылка устарела или страница была перемещена. Проверьте адрес или вернитесь на главную.",
    cta: "На главную",
  },
};

const uz: Dictionary = {
  nav: {
    home: "Bosh sahifa",
    products: "Mahsulotlar",
    about: "Biz haqimizda",
    certificates: "Sertifikatlar",
    articles: "Maqolalar",
    contacts: "Aloqa",
  },
  hero: {
    titleAccent: "CureLife —",
    titleRest: "hayotingiz uchun yevropa sifati",
    subtitle:
      "Butun oila salomatligi haqida keng qamrovli g‘amxo‘rlik uchun nemis xomashyosi asosidagi biologik faol qo‘shimchalar.",
    ctaPrimary: "Mahsulotlarni ko‘rish",
    ctaSecondary: "Sertifikatlarni tekshirish",
    disclaimer:
      "Qo‘llashdan oldin yo‘riqnoma bilan tanishing va mutaxassis bilan maslahatlashing.",
  },
  stats: {
    experience: { value: "5 yil", label: "Bozordagi tajriba" },
    team: { value: "20+", label: "Xodimlar" },
    packages: { value: "100 000+", label: "Yetkazilgan qadoqlar" },
    products: { label: "Assortimentdagi mahsulot" },
  },
  concerns: {
    label: "02 / Tanlashdagi savollar",
    title: "Salomatlik uchun mahsulot tanlashda savol berish —",
    titleAccent: "bu normal holat.",
    body: "Tarkib, xavfsizlik va mahsulotning kelib chiqishi tushunarsiz bo‘lsa, to‘g‘ri qaror qabul qilish qiyinlashadi.",
    items: [
      "Tarkib menga to‘g‘ri keladimi?",
      "Mahsulotning sertifikati bormi?",
      "Uni qanday qabul qilinadi?",
      "Allergenlar yoki cheklovlar bormi?",
      "Boshqa preparatlar bilan birga qabul qilsa bo‘ladimi?",
    ],
  },
  directions: {
    label: "03 / Yo‘nalishlar",
    title: "Organizmingizga mos mahsulotni tanlang.",
    body: "Kerakli yo‘nalishni tanlang va asosiy ma’lumot bilan tanishing. Har bir yo‘nalish tushunarli tarzda tayyorlangan va aniq ehtiyojlarga mos keladi.",
    link: "Mahsulotlarni ko‘rish",
    cards: [
      {
        title: "Ayollar uchun",
        body: "Ayol organizmining fiziologik ehtiyojlarini qo‘llab-quvvatlash uchun.",
      },
      {
        title: "Erkaklar uchun",
        body: "Kundalik faollik va fiziologik funksiyalarni qo‘llab-quvvatlash uchun.",
      },
      {
        title: "Rejalashtirish davri",
        body: "Homiladorlikni rejalashtirish davrida organizm ehtiyojlarini qo‘llab-quvvatlash uchun.",
      },
    ],
  },
  passport: {
    label: "04 / Mahsulot pasporti",
    title: "Mahsulotni tanlang.",
    body: "Tarkib, dozalash, ishlab chiqaruvchi va muhim cheklovlar bitta pasportda jamlangan. Kerakli ma’lumotni bir necha soniyada topish mumkin.",
    originTitle: "Kelib chiqishi",
    openProduct: "Mahsulot pasportini ochish",
    fields: {
      raw: "Xomashyo",
      maker: "Ishlab chiqaruvchi",
      role: "CureLife roli",
    },
    statLabels: {
      form: "Chiqarilish shakli",
      pack: "Qadoq",
      intake: "Qabul",
    },
  },
  trust: {
    label: "05 / Ishonch",
    title: "Standartlarga mos va",
    titleAccent: "sertifikatlar bilan tasdiqlangan.",
    body: "Har bir mahsulot uchun alohida sertifikat, yo‘riqnoma va kelib chiqishi haqidagi ma’lumot taqdim etilgan. Hujjatlar foydalanuvchi uchun ochiq.",
    cta: "Hujjatlarni ko‘rish",
    certAlt: "GMP sertifikati",
    cards: [
      {
        title: "Mahsulot sertifikati",
        body: "Har bir mahsulot uchun hujjat va tasdiqlovchi ma’lumot.",
      },
      {
        title: "Yo‘riqnoma PDF",
        body: "Tarkib, dozalash, qo‘llash usuli va qarshi ko‘rsatmalar.",
      },
      {
        title: "Kelib chiqishi",
        body: "Ishlab chiqaruvchi, xomashyo va kelib chiqqan mamlakat haqida ma’lumot.",
      },
    ],
  },
  about: {
    label: "06 / CureLife haqida",
    title: "Sog‘lom hayot uchun sifat",
    paragraphs: [
      "CureLife besh yildan ortiq vaqtdan buyon biologik faol qo‘shimchalar distributsiyasi bilan shug‘ullanadi. Biz mahsulotlarni sinchkovlik bilan tanlaymiz: bugun assortimentda Germaniyadan keltirilgan sifatli xomashyo asosidagi {count} bor.",
      "CureLife — bu 20 dan ortiq mutaxassisdan iborat jamoa va xaridorlarimizga yetkazilgan 100 000 dan ziyod qadoq mahsulot.",
    ],
    missionLabel: "— BIZNING MISSIYAMIZ",
    mission:
      "«Salomatlik haqida g‘amxo‘rlikni sodda, tushunarli va har kimga ochiq qilish»",
    missionNote:
      "Biz odamlarga salomatlik va yaxshi kayfiyatni saqlashda yordam berishga intilamiz.",
  },
  journey: {
    label: "07 / Mahsulot yo‘li",
    title: "Har bir bosqich — xomashyodan bozorga chiqishgacha — nazorat ostida.",
    body: "Tayyorgarlik, ishlab chiqarish, tekshiruv va mahsulotni bozorga chiqarish bosqichma-bosqich ko‘rsatilgan.",
    steps: [
      {
        title: "Xomashyo",
        body: "Asosiy xomashyo tayyorlanadi va zarur hujjatlar bilan birga qabul qilinadi.",
      },
      {
        title: "Ishlab chiqarish",
        body: "Mahsulot belgilangan standartlarga muvofiq ishlab chiqariladi va qadoqlanadi.",
      },
      {
        title: "Nazorat",
        body: "Yo‘riqnoma, markirovka va mahsulot hujjatlari tekshiriladi.",
      },
      {
        title: "Bozorga tayyorgarlik",
        body: "Mahsulot distributsiya va rasmiy savdoga tayyorlanadi.",
      },
    ],
  },
  video: {
    play: "Ishlab chiqarish haqidagi videoni ko‘rish",
    alt: "Avitale ishlab chiqarish maydonchasi",
    caption: "Avitale — Germaniyadagi hamkor ishlab chiqaruvchimiz",
    close: "Videoni yopish",
  },
  cta: {
    label: "09 / Yakuniy chaqiruv",
    title: "Mahsulotni yaxshi o‘rganing va ishonch bilan tanlang.",
    body: "Tarkib, qo‘llash usuli, cheklovlar va hujjatlar bilan tanishing.",
  },
  footer: {
    menu: {
      products: "Mahsulotlar",
      about: "Kompaniya haqida",
      certificates: "Sertifikatlar",
      articles: "Maqolalar",
    },
    tagline:
      "Ongli tanlov qilishga yordam beradigan ochiq va tushunarli ma’lumot.",
    menuTitle: "Menyu",
    warningTitle: "Ogohlantirish",
    warning:
      "BFQ dori vositasi emas. Mutaxassis bilan maslahatlashing.",
    legalTitle: "Huquqiy ma’lumot",
    legal:
      "Saytdagi ma’lumot tashxis qo‘yish va davolash uchun mo‘ljallanmagan.",
    copyright: "© 2026 CureLife. Barcha huquqlar himoyalangan.",
    slogan: "Ongli tanlov · Ochiq ma’lumot",
    socialSoon: "tez orada",
  },
  productsPage: {
    meta: {
      title: "CureLife mahsulotlari katalogi",
      description:
        "CureLife biologik faol qo‘shimchalari: tarkib, qo‘llash tartibi va mahsulot pasportlari.",
    },
    searchLabel: "Mahsulot qidirish",
    searchPlaceholder: "Masalan: NovaLife Plus, Fimbriolok, vitaminlar...",
    searchButton: "Qidirish",
    label: "BARCHA MAHSULOTLAR",
    title: "O‘zingizga mos mahsulotni toping.",
    intro:
      "Qidiruvdan foydalaning yoki yo‘nalishni tanlang. Qo‘llashdan oldin yo‘riqnoma va qarshi ko‘rsatmalarni o‘rganing hamda mutaxassis bilan maslahatlashing.",
    notFound: "So‘rovingiz bo‘yicha mahsulot topilmadi.",
    disclaimer:
      "Biologik faol qo‘shimchalar dori vositasi emas. Katalogdagi ma’lumot tanishtiruv xarakteriga ega. Qo‘llashdan oldin rasmiy yo‘riqnomani o‘qing va mutaxassis bilan maslahatlashing.",
    passportCta: "Mahsulot pasporti",
    docsAria: "Hujjatlar",
    statLabels: { form: "Shakli", pack: "Qadoq", intake: "Qabul" },
    contact: {
      label: "07 / BOG‘LANISH",
      title: "Kompaniya yoki mahsulot haqida savolingiz bormi?",
      body: "Tarkib, kelib chiqishi, sertifikatlar yoki rasmiy savdo nuqtalari haqida aniqlashtirish uchun CureLife bilan bog‘laning.",
      primary: "Biz bilan bog‘lanish",
      secondary: "Mahsulotlarga o‘tish",
      imageAlt: "CureLife mahsulotlari xavfsizligi",
    },
  },
  contactPage: {
    meta: {
      title: "CureLife bilan bog‘lanish",
      description:
        "Mahsulotlar, sertifikatlar, hamkorlik va rasmiy savdo nuqtalari bo‘yicha CureLife jamoasiga murojaat qiling.",
    },
    hero: {
      label: "01 / ALOQA",
      title: "Savol tug‘ilganda",
      titleAccent: "biz yoningizdamiz.",
      body: "Mahsulotlar, tarkib, sertifikatlar, hamkorlik yoki rasmiy savdo nuqtalari haqidagi ma’lumotni aniqlashtiring. CureLife jamoasi savolingizni kerakli mutaxassisga yo‘naltirishga yordam beradi.",
      primary: "Bizga yozish",
      secondary: "Aloqa ma’lumotlari",
      imageAlt: "CureLife bilan bog‘lanish",
    },
    message: {
      label: "03 / QAYTA ALOQA",
      title: "Mavzuni tanlab,",
      titleAccent: "xabar qoldiring.",
      intro:
        "Forma murojaatni kerakli xodimga tezroq yo‘naltirishga yordam beradi. Tez javob olish uchun mos mavzuni tanlang va savolingizni batafsil yozing.",
      channels: [
        ["TELEFON", "", "Umumiy savollar va mahsulot ma’lumotlari uchun."],
        ["ELEKTRON POCHTA", "info@curelife.uz", "Murojaat va hamkorlik uchun korporativ pochta."],
        ["ISH TARTIBI", "Du–Ju · 09:00–18:00", "Amaldagi jadvalni aniqlashtirish mumkin."],
      ],
    },
    form: {
      label: "XABAR",
      title: "Nimada yordam bera olamiz?",
      intro:
        "Asosiy maydonlarni to‘ldiring — murojaat bizga tushadi va ko‘rsatilgan aloqa orqali javob beramiz.",
      name: "Ism",
      phone: "Telefon",
      email: "E-mail",
      topic: "Murojaat mavzusi",
      message: "Xabar",
      messagePlaceholder: "Savolingizni yozing",
      namePlaceholder: "Ismingiz",
      topics: ["Mahsulot haqida savol", "Sertifikatlar", "Hamkorlik", "Savdo nuqtalari"],
      consent:
        "Murojaatimga javob berish uchun formada ko‘rsatilgan ma’lumotlarni qayta ishlashga roziman.",
      submit: "Xabarni yuborish",
      sent: "Rahmat! Murojaatingiz qabul qilindi — tez orada bog‘lanamiz.",
    },
    office: {
      label: "05 / OFIS",
      title: "CureLife aloqa nuqtasi",
      body: "Manzil, telefon va ofisning amaldagi ish jadvalini aniqlashtirish uchun CureLife jamoasi bilan bog‘laning.",
      mapCta: "Xaritada ochish",
      mapTitle: "Xarita: CureLife ofisi",
      rows: [
        ["MANZIL", "Toshkent, O‘zbekiston"],
        ["ISH VAQTI", "Du–Ju · 09:00–18:00"],
      ],
      cta: "Biz bilan bog‘lanish",
    },
    faq: {
      label: "06 / SAVOL-JAVOB",
      title: "Murojaatdan oldin.",
      intro:
        "Ko‘p beriladigan savollarga qisqa javoblar kerakli ma’lumotni tezroq topishga yordam beradi.",
      items: [
        {
          q: "Muayyan mahsulot haqidagi ma’lumotni qayerdan ko‘rish mumkin?",
          a: "Katalog sahifasida mahsulotni tanlang — uning pasportida tarkib, qo‘llash usuli, cheklovlar, kelib chiqishi va hujjatlar jamlangan.",
        },
        {
          q: "Sertifikatlar qayerda mavjud?",
          a: "Sertifikatlar kompaniya haqidagi bo‘limda va tegishli mahsulotlar pasportida joylashtirilgan.",
        },
        {
          q: "Forma orqali tibbiy savol berish mumkinmi?",
          a: "Forma umumiy savollar uchun mo‘ljallangan. Tibbiy savollar bo‘yicha malakali mutaxassisga murojaat qilish kerak.",
        },
        {
          q: "Hamkorlik taklifini qanday yuborish mumkin?",
          a: "Formada «Hamkorlik» mavzusini tanlang va taklifni batafsil yozing.",
        },
      ],
    },
  },
  aboutPage: {
    meta: {
      title: "CureLife haqida — ochiq va mas’uliyatli yondashuv",
      description: "CureLife kompaniyasi, mahsulot sifati, ishlab chiqarish tamoyillari va sertifikatlari haqida.",
    },
    hero: {
      label: "01 / KOMPANIYA HAQIDA",
      title: "Oila salomatligi haqida",
      titleAccent: "ochiq g‘amxo‘rlik.",
      body: "CureLife — biologik faol qo‘shimchalar sohasidagi kompaniya. Inson ongli tanlov qila olishi uchun biz yevropa xomashyosi, mahalliy ishlab chiqarish va tushunarli ma’lumotni birlashtiramiz.",
      cta: "Sertifikatlarni ko‘rish",
      tags: ["● Yevropa xomashyosi", "● O‘zbekistonda ishlab chiqarish"],
      imageAlt: "CureLife — oila salomatligi haqida g‘amxo‘rlik",
    },
    stats: [
      ["5 yil", "BFQ bozoridagi tajriba"],
      ["20+", "jamoadagi mutaxassis"],
      ["100 000+", "yetkazilgan qadoq"],
      ["6", "assortimentdagi mahsulot"],
    ],
    story: {
      label: "02 / BIZNING TARIXIMIZ",
      title: "Barcha muhim ma’lumotini bilish mumkin bo‘lgan mahsulotlar.",
      body: "CureLife ayollar, erkaklar va butun oila uchun biologik faol qo‘shimchalar assortimentini rivojlantiradi. Tarkib, qo‘llash, kelib chiqishi va hujjatlar haqidagi ma’lumotni mahsulot sotib olinishidan oldin ham ochiq va tushunarli qilishga intilamiz.",
      quote: "«Ongli tanlov va’dalardan emas, ochiq ma’lumotdan boshlanadi».",
    },
    mission: {
      label: "BIZNING MISSIYAMIZ",
      title: "Odamlarga ishonchli va mas’uliyatli qaror qabul qilishda yordam berish.",
      body: "Mahsulot nimadan iborat, qanday ishlab chiqariladi, qanday hujjatlari bor va uni qanday to‘g‘ri qo‘llash kerakligini ochiq ko‘rsatamiz.",
    },
    approach: {
      label: "03 / BIZNING YONDASHUVIMIZ",
      title: "CureLife asoslanadigan to‘rtta tamoyil.",
      intro: "Har bir bosqich — xomashyo tanlashdan saytdagi ma’lumotgacha — foydalanuvchiga mahsulotni yaxshiroq tushunishga va ortiqcha noaniqliksiz qaror qabul qilishga yordam berishi kerak.",
      principles: [
        { icon: "◇", title: "Shaffoflik", body: "Mahsulotning tarkibi, qo‘llash usuli, cheklovlari, kelib chiqishi va hujjatlarini ko‘rsatamiz." },
        { icon: "▣", title: "Mas’uliyat", body: "Kasbiy tavsiyani almashtirmaymiz va individual xususiyatlarni hisobga olishni eslatamiz." },
        { icon: "△", title: "Nazorat", body: "Hujjatlar, markirovka va mahsulotning belgilangan talablarga mosligini tekshiramiz." },
        { icon: "♧", title: "G‘amxo‘rlik", body: "Turli ehtiyoj va savollarga ega odamlar uchun tushunarli tajriba yaratamiz." },
      ],
    },
    chain: {
      label: "04 / XOMASHYODAN MAHSULOTGACHA",
      title: "Yevropa asosi. Mahalliy ishlab chiqarish. Yagona nazorat.",
      body: "Asosiy xomashyo Germaniyadan keladi. Ishlab chiqarish va qadoqlash O‘zbekistonda amalga oshiriladi, CureLife esa mahsulotni buyurtmachi va distribyutor sifatida kuzatib boradi.",
      steps: [
        ["01 / GERMANIYA", "Xomashyo", "Yevropa yetkazib beruvchilaridan komponentlar va vitamin-mineral premikslar."],
        ["02 / O‘ZBEKISTON", "Ishlab chiqarish", "Mahsulot nazorat tartibiga muvofiq mahalliy ishlab chiqariladi va qadoqlanadi."],
        ["03 / CURELIFE", "Distributsiya", "Kompaniya mahsulotni bozorga chiqarish, targ‘ib qilish va hujjatlar nazoratini tashkil etadi."],
      ],
    },
    certificates: {
      label: "05 / SERTIFIKATLAR",
      title: "Sifat va kelib chiqishini tasdiqlovchi hujjatlar.",
      intro: "Hujjatni kattalashtirib ko‘rish uchun uning ustiga bosing.",
      productLabel: "MAHSULOT",
      note: "Mahsulotning muvofiqligi va ro‘yxatdan o‘tgani haqidagi hujjat.",
      alt: "Sertifikat",
      open: "Sertifikatni ochish",
    },
    responsibility: {
      label: "06 / MAS’ULIYAT",
      title: "Shunchaki mahsulot emas — tushunarli ma’lumot tizimi.",
      body: "CureLife foydalanuvchi asosiy ma’lumotlarni tez topishi va qaysi savollarni mutaxassis bilan muhokama qilish kerakligini tushunishi uchun harakat qiladi.",
      points: ["Tarkib va dozalash", "Qo‘llash va cheklovlar", "Kelib chiqishi va hujjatlar"],
      imageAlt: "CureLife ochiq ma’lumot tizimi",
    },
    contact: {
      label: "07 / BOG‘LANISH",
      title: "Kompaniya yoki mahsulot haqida savolingiz bormi?",
      body: "Tarkib, kelib chiqishi, sertifikatlar yoki rasmiy savdo nuqtalari haqida aniqlashtirish uchun CureLife bilan bog‘laning.",
      primary: "Biz bilan bog‘lanish",
      secondary: "Mahsulotlarga o‘tish",
      imageAlt: "CureLife mahsulotlari xavfsizligi",
    },
  },
  articles: {
    label: "08 / Maqolalar",
    title: "Tarkib va qo‘llash haqida",
    titleAccent: "maqolalar.",
    intro: "Tarkibni qanday o‘qish, mahsulotni qanday saqlash va qachon mutaxassisga murojaat qilish haqida qisqa maqolalar.",
    all: "Barcha maqolalar",
    readMore: "Batafsil o‘qish",
    back: "Maqolalarga qaytish",
    empty: "Maqolalar tez orada qo‘shiladi.",
    listTitle: "Maqolalar",
    listIntro: "CureLife mahsulotlarining tarkibi, qo‘llanishi va saqlanishi haqidagi materiallar.",
    meta: {
      title: "Maqolalar — CureLife",
      description: "Mahsulot tarkibi, qo‘llanishi, saqlanishi va qachon mutaxassisga murojaat qilish haqidagi materiallar.",
    },
    relatedProduct: {
      label: "SHU MAVZU BO‘YICHA",
      title: "Sizga foydali bo‘lishi",
      titleAccent: "mumkin bo‘lgan mahsulot.",
      cta: "Mahsulot pasportini ko‘rish",
    },
  },
  productPage: {
    back: "Mahsulotlarga qaytish",
    hero: {
      primary: "Tarkibni ko‘rish",
      secondary: "Xavfsizlik ma’lumoti",
    },
    factLabels: ["QABUL", "QADOQ", "XOMASHYO", "ISHLAB CHIQARUVCHI"],
    composition: {
      label: "TARKIB",
      title: "Har bir komponentning",
      titleAccent: "aniq miqdorini biling.",
      intro: "Quyida yo‘riqnomada ko‘rsatilgan asosiy komponentlar keltirilgan. To‘liq tarkib va yordamchi moddalarni mahsulot yo‘riqnomasidan qarang.",
      perCapsule: "Bitta kapsuladagi miqdori",
      perSachet: "Bitta sashedagi miqdori",
      perApplicator: "Bitta applikatordagi miqdori",
    },
    usage: { label: "QO‘LLASH USULI", daily: "har kuni" },
    before: {
      label: "QABULDAN OLDIN",
      defaultItems: [
        "Qadoqning butunligi va yaroqlilik muddatini tekshiring.",
        "Komponentlarga individual sezuvchanlikni hisobga oling.",
        "Homiladorlik, emizish va preparatlar qabul qilish davrida shifokor bilan maslahatlashing.",
        "Tavsiya etilgan kunlik dozadan oshirmang.",
      ],
    },
    safety: {
      label: "XAVFSIZLIK",
      title: "Qachon ehtiyot bo‘lish kerak?",
      body: "BFQ dori vositasi emas. Individual holatni hisobga olgan holda shifokor tavsiyasini olish muhim.",
    },
    origin: {
      label: "KELIB CHIQISHI",
      title: "Nemis xomashyosi.",
      titleAccent: "O‘zbekistonda ishlab chiqariladi.",
      cardRaw: "XOMASHYO",
      cardMake: "ISHLAB CHIQARISH",
      importedTitle: "Ishlab chiqarish davlati —",
      importedCardLabel: "ISHLAB CHIQARISH DAVLATI",
      note: "Ishlab chiqaruvchi va kelib chiqishi bo‘yicha yakuniy ma’lumotlarni mahsulot qadog‘i va rasmiy yo‘riqnoma bilan solishtiring.",
      rowLabels: ["XOMASHYO", "ISHLAB CHIQARUVCHI", "CURELIFE ROLI"],
    },
    documents: {
      label: "HUJJATLAR",
      title: "Sertifikat",
      titleAccent: "va yo‘riqnoma",
      body: "Mahsulot sifatini va talablarga muvofiqligini tasdiqlovchi hujjat. Sotib olishdan oldin sertifikat va qo‘llash yo‘riqnomasi bilan tanishish mumkin.",
      typeLabel: "HUJJAT TURI",
      typeValue: "Mahsulot sertifikati",
      formatLabel: "FORMAT",
      formatValue: "PDF · ko‘rish uchun",
      certificateCta: "Sertifikatni ochish",
      instructionCta: "Yo‘riqnomani ochish",
      certificateAlt: "Mahsulot sertifikati",
      instructionEmpty: "Yo‘riqnoma keyinroq qo‘shiladi.",
    },
    related: {
      label: "BOSHQA MAHSULOTLAR",
      title: "Sizni",
      titleAccent: "qiziqtirishi mumkin.",
      intro: "Mahsulotlarni faqat ehtiyoj, tarkib, qarshi ko‘rsatmalar va mutaxassis tavsiyasini hisobga olgan holda tanlang.",
      cta: "Pasportni ko‘rish",
    },
  },
  common: {
    viewProducts: "Mahsulotlarni ko‘rish",
    close: "Yopish",
  },
  a11y: {
    openMenu: "Menyuni ochish",
    closeMenu: "Menyuni yopish",
    language: "Tilni tanlash",
    languageActive: "tanlangan",
  },
  meta: {
    title: "CureLife — hayotingiz uchun yevropa sifati",
    description:
      "Butun oila salomatligi haqida keng qamrovli g‘amxo‘rlik uchun nemis xomashyosi asosidagi biologik faol qo‘shimchalar.",
  },
  notFound: {
    title: "Sahifa topilmadi",
    body: "Havola eskirgan yoki sahifa ko‘chirilgan bo‘lishi mumkin. Manzilni tekshiring yoki bosh sahifaga qayting.",
    cta: "Bosh sahifaga",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { ru, uz };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
