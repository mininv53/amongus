import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    /* Nav */
    nav_home: 'Home',
    nav_analyze: 'Analyze',
    nav_dashboard: 'Dashboard',
    nav_enterprise: 'API',
    nav_run_scan: 'Run a free scan',

    /* Hero */
    hero_eyebrow: 'Multi-model AI · Built for verification',
    hero_title_a: 'Built for the',
    hero_title_pill: 'thinkers',
    hero_title_b: 'who verify what they share.',
    hero_subtitle:
      'DeepGuard checks images, audio, and links across three AI models in seconds — and tells you exactly why something feels off.',
    hero_cta_primary: 'Run a free scan',
    hero_cta_secondary: 'See how it works',
    hero_microcopy: 'Free · No sign-up · 10 scans / day',
    hero_inline_label: 'Or paste a link to scan now',
    hero_inline_placeholder: 'https://example.com/article',
    hero_inline_button: 'Scan',

    /* Trust strip */
    stat_models: 'AI models in consensus',
    stat_models_value: '3',
    stat_speed: 'avg seconds per scan',
    stat_speed_value: '30',
    stat_signup: 'sign-ups required',
    stat_signup_value: '0',
    stat_proof: 'shareable proof on every scan',
    stat_proof_value: '100%',

    /* Features */
    features_eyebrow: 'What it catches',
    features_title: 'One scan. Every layer of trust.',
    features_subtitle: 'DeepGuard reads the signals humans miss — and explains every flag in plain language.',
    feat_multimodel_title: 'Three models, one verdict',
    feat_multimodel_desc:
      'GPT, Claude and Gemini analyze the same input in parallel. We surface the consensus — and the disagreements.',
    feat_image_title: 'Image authenticity',
    feat_image_desc:
      'Detects AI-generated faces, doctored photos, splices and synthetic imagery at the pixel level.',
    feat_audio_title: 'Voice & audio',
    feat_audio_desc: 'Identifies cloned voices, synthesized speech, and edited recordings.',
    feat_url_title: 'Link & article scan',
    feat_url_desc: 'Reads the page, checks media, weighs source credibility.',
    feat_signals_title: 'Explainable signals',
    feat_signals_desc: 'Every score is broken down into specific signals you can read, share and audit.',
    feat_share_title: 'Shareable proof',
    feat_share_desc: 'Every scan gets a public link with the full breakdown — no edits, no spin.',

    /* How it works */
    how_eyebrow: 'How it works',
    how_title: 'Three steps. Under a minute.',
    how_step1_title: 'Drop or paste',
    how_step1_desc: 'An image, an audio file, or any URL. No format to learn, no account to create.',
    how_step2_title: 'Three AIs scan',
    how_step2_desc: 'Each model looks at the input independently and produces its own trust signals.',
    how_step3_title: 'You read the verdict',
    how_step3_desc: 'A consensus Trust Score, signal-by-signal explanations, and a link you can share.',
    how_disclaimer: 'What we do not claim',
    how_disclaimer_text:
      'DeepGuard provides probabilistic AI assessments — never definitive proof. Always cross-reference critical findings with independent sources.',

    /* Pricing */
    pricing_eyebrow: 'Pricing',
    pricing_title: 'Start free. Upgrade when you scale.',
    pricing_subtitle: 'No card required. Every plan includes the full multi-model engine.',
    pricing_free: 'Free',
    pricing_free_desc: 'For individuals and quick checks.',
    pricing_free_price: '$0',
    pricing_free_price_unit: 'forever',
    pricing_free_f1: '10 scans per day',
    pricing_free_f2: 'Image, audio & URL',
    pricing_free_f3: 'Signal breakdown',
    pricing_free_f4: 'Public shareable links',
    pricing_pro: 'Pro',
    pricing_pro_desc: 'For creators, journalists, researchers.',
    pricing_pro_price: '$15',
    pricing_pro_price_unit: '/ month',
    pricing_pro_f1: 'Unlimited scans',
    pricing_pro_f2: 'All analysis types',
    pricing_pro_f3: 'Advanced signals',
    pricing_pro_f4: 'API access',
    pricing_pro_f5: 'Priority processing',
    pricing_enterprise: 'Enterprise',
    pricing_enterprise_desc: 'For organizations at scale.',
    pricing_enterprise_price: 'Custom',
    pricing_enterprise_price_unit: 'volume pricing',
    pricing_enterprise_f1: 'Unlimited everything',
    pricing_enterprise_f2: 'Batch processing',
    pricing_enterprise_f3: 'Custom integrations',
    pricing_enterprise_f4: 'SLA guarantees',
    pricing_enterprise_f5: 'Dedicated support',
    pricing_cta_free: 'Start free',
    pricing_cta_pro: 'Get Pro',
    pricing_cta_enterprise: 'Talk to us',
    pricing_popular: 'Most popular',

    /* CTA strip + footer */
    cta_title: 'Stop second-guessing what you see.',
    cta_subtitle: 'Run your first scan in seconds. We will show you the receipts.',
    cta_button: 'Run a free scan',
    sticky_cta: 'Run a free scan',

    footer_tagline: 'Verify what you share.',
    footer_product: 'Product',
    footer_resources: 'Resources',
    footer_company: 'Company',
    footer_privacy: 'Privacy',
    footer_terms: 'Terms',
    footer_about: 'About',
    footer_madeby: 'DeepGuard · think. verify. share.',

    /* Analyzer */
    analyzer_eyebrow: 'Analyzer',
    analyzer_title: 'Verify your media.',
    analyzer_subtitle: 'Drop a file or paste a URL. We will run the full multi-model scan.',
    tab_image: 'Image',
    tab_audio: 'Audio',
    tab_url: 'Link',
    upload_image_text: 'Drop an image here, or click to browse',
    upload_image_hint: 'JPEG, PNG, WEBP · up to 10 MB',
    upload_audio_text: 'Drop an audio file here, or click to browse',
    upload_audio_hint: 'MP3, WAV, OGG, FLAC · up to 25 MB',
    url_placeholder: 'Paste a URL to scan…',
    url_hint: 'A full URL starting with http:// or https://',
    analyze_button: 'Run scan',
    analyzing: 'Scanning…',
    analyze_step_upload: 'Uploading content',
    analyze_step_gpt: 'GPT model analysis',
    analyze_step_claude: 'Claude model analysis',
    analyze_step_gemini: 'Gemini model analysis',
    analyze_step_consensus: 'Computing consensus',
    result_trust_score: 'Trust Score',
    result_verdict: 'Verdict',
    result_confidence: 'Confidence',
    result_signals: 'Signal breakdown',
    result_summary: 'Summary',
    result_recommendations: 'What to do next',
    result_share: 'Share result',
    result_copy_link: 'Copy link',
    result_link_copied: 'Link copied',
    result_new_scan: 'New scan',

    /* Dashboard */
    dashboard_eyebrow: 'Dashboard',
    dashboard_title: 'Live signals from the network.',
    dashboard_subtitle: 'A live look at what people are scanning right now.',
    dash_filter_all: 'All',
    dash_filter_image: 'Image',
    dash_filter_audio: 'Audio',
    dash_filter_url: 'URL',
    dash_total: 'Total scans',
    dash_avg: 'Average trust',
    dash_flagged: 'Flagged content',
    dash_recent: 'Recent scans',
    dash_no_data: 'No scans yet — run the first one.',

    /* Enterprise */
    enterprise_eyebrow: 'For teams',
    enterprise_title: 'Verification, at the scale of your platform.',
    enterprise_subtitle:
      'Plug DeepGuard into your CMS, newsroom, fraud team or moderation pipeline.',
    enterprise_usecase1: 'Newsrooms',
    enterprise_usecase1_desc: 'Verify UGC and source media before it ships.',
    enterprise_usecase2: 'Platforms',
    enterprise_usecase2_desc: 'Catch synthetic media at upload time.',
    enterprise_usecase3: 'Fraud teams',
    enterprise_usecase3_desc: 'Detect cloned voices on calls and KYC flows.',
    enterprise_usecase4: 'Compliance',
    enterprise_usecase4_desc: 'Auditable trust scores with shareable proof.',
    enterprise_form_title: 'Talk to us',
    enterprise_form_subtitle: 'We reply within one working day.',
    enterprise_name: 'Your name',
    enterprise_email: 'Work email',
    enterprise_company: 'Company',
    enterprise_message: 'How can we help?',
    enterprise_submit: 'Send',
    enterprise_submitting: 'Sending…',
    enterprise_submitted: 'Got it — we will be in touch.',
    enterprise_required: 'Please fill the required fields',

    /* Shared result */
    shared_title: 'Shared result',
    shared_back: 'Run your own scan',
    shared_not_found: 'This result is not available.',

    /* Education */
    edu_title: 'How to read a Trust Score',
    edu_80_100: '80–100 · High authenticity',
    edu_60_80: '60–79 · Likely authentic',
    edu_40_60: '40–59 · Uncertain — verify manually',
    edu_20_40: '20–39 · Likely manipulated',
    edu_0_20: '0–19 · Manipulation detected',
  },

  ru: {
    /* Nav */
    nav_home: 'Главная',
    nav_analyze: 'Анализ',
    nav_dashboard: 'Дашборд',
    nav_enterprise: 'API',
    nav_run_scan: 'Бесплатный скан',

    /* Hero */
    hero_eyebrow: 'Мульти-модель AI · Создан для проверки',
    hero_title_a: 'Сделан для тех,',
    hero_title_pill: 'кто думает',
    hero_title_b: 'и проверяет, чем делится.',
    hero_subtitle:
      'DeepGuard проверяет фото, аудио и ссылки тремя AI-моделями за секунды — и точно объясняет, что именно не так.',
    hero_cta_primary: 'Запустить скан',
    hero_cta_secondary: 'Как это работает',
    hero_microcopy: 'Бесплатно · Без регистрации · 10 сканов в день',
    hero_inline_label: 'Или вставь ссылку — проверим прямо сейчас',
    hero_inline_placeholder: 'https://example.com/статья',
    hero_inline_button: 'Сканировать',

    /* Trust strip */
    stat_models: 'AI-модели в консенсусе',
    stat_models_value: '3',
    stat_speed: 'секунд на скан в среднем',
    stat_speed_value: '30',
    stat_signup: 'регистраций нужно',
    stat_signup_value: '0',
    stat_proof: 'публичных доказательств на каждый скан',
    stat_proof_value: '100%',

    /* Features */
    features_eyebrow: 'Что находит',
    features_title: 'Один скан. Все слои доверия.',
    features_subtitle:
      'DeepGuard замечает то, что не видит человек, и объясняет каждый флаг простым языком.',
    feat_multimodel_title: 'Три модели — один вердикт',
    feat_multimodel_desc:
      'GPT, Claude и Gemini анализируют один и тот же вход параллельно. Мы показываем и согласие, и расхождения.',
    feat_image_title: 'Подлинность изображений',
    feat_image_desc:
      'Видит AI-сгенерированные лица, ретушь, склейки и синтетическую графику на уровне пикселей.',
    feat_audio_title: 'Голос и аудио',
    feat_audio_desc: 'Распознаёт клонированные голоса, синтетическую речь и склеенные записи.',
    feat_url_title: 'Скан ссылок',
    feat_url_desc: 'Читает страницу, проверяет медиа и оценивает источник.',
    feat_signals_title: 'Объяснимые сигналы',
    feat_signals_desc:
      'Каждая оценка раскладывается на конкретные сигналы — их можно читать, делиться, проверять.',
    feat_share_title: 'Доказательство ссылкой',
    feat_share_desc:
      'Каждому скану — публичная ссылка с полным разбором. Без правок, без приукрашивания.',

    /* How it works */
    how_eyebrow: 'Как это работает',
    how_title: 'Три шага. Меньше минуты.',
    how_step1_title: 'Перетащи или вставь',
    how_step1_desc: 'Изображение, аудио или любой URL. Никаких форматов, никаких аккаунтов.',
    how_step2_title: 'Три AI сканируют',
    how_step2_desc: 'Каждая модель смотрит независимо и выдаёт собственные сигналы доверия.',
    how_step3_title: 'Ты читаешь вердикт',
    how_step3_desc: 'Консенсусный Trust Score, разбор по сигналам и ссылка, которой можно делиться.',
    how_disclaimer: 'Чего мы не обещаем',
    how_disclaimer_text:
      'DeepGuard даёт вероятностную оценку, а не окончательное доказательство. Критичные находки проверяй из независимых источников.',

    /* Pricing */
    pricing_eyebrow: 'Тарифы',
    pricing_title: 'Старт бесплатный. Расти — когда нужно.',
    pricing_subtitle: 'Карта не нужна. Полный мульти-модельный движок — на всех тарифах.',
    pricing_free: 'Free',
    pricing_free_desc: 'Для частных и быстрых проверок.',
    pricing_free_price: '$0',
    pricing_free_price_unit: 'навсегда',
    pricing_free_f1: '10 сканов в день',
    pricing_free_f2: 'Image, аудио и URL',
    pricing_free_f3: 'Разбор сигналов',
    pricing_free_f4: 'Публичные ссылки',
    pricing_pro: 'Pro',
    pricing_pro_desc: 'Для авторов, журналистов, исследователей.',
    pricing_pro_price: '$15',
    pricing_pro_price_unit: '/ мес',
    pricing_pro_f1: 'Без лимита',
    pricing_pro_f2: 'Все типы анализа',
    pricing_pro_f3: 'Расширенные сигналы',
    pricing_pro_f4: 'Доступ к API',
    pricing_pro_f5: 'Приоритетная очередь',
    pricing_enterprise: 'Enterprise',
    pricing_enterprise_desc: 'Для команд и платформ.',
    pricing_enterprise_price: 'По запросу',
    pricing_enterprise_price_unit: 'ценообразование от объёма',
    pricing_enterprise_f1: 'Всё без лимитов',
    pricing_enterprise_f2: 'Пакетная обработка',
    pricing_enterprise_f3: 'Кастомные интеграции',
    pricing_enterprise_f4: 'SLA',
    pricing_enterprise_f5: 'Выделенная поддержка',
    pricing_cta_free: 'Начать бесплатно',
    pricing_cta_pro: 'Получить Pro',
    pricing_cta_enterprise: 'Связаться',
    pricing_popular: 'Популярный',

    /* CTA strip + footer */
    cta_title: 'Хватит сомневаться в том, что видишь.',
    cta_subtitle: 'Первый скан — за секунды. Мы покажем все сигналы.',
    cta_button: 'Запустить скан',
    sticky_cta: 'Запустить скан',

    footer_tagline: 'Проверяй то, чем делишься.',
    footer_product: 'Продукт',
    footer_resources: 'Ресурсы',
    footer_company: 'Компания',
    footer_privacy: 'Конфиденциальность',
    footer_terms: 'Условия',
    footer_about: 'О нас',
    footer_madeby: 'DeepGuard · думай. проверяй. делись.',

    /* Analyzer */
    analyzer_eyebrow: 'Анализатор',
    analyzer_title: 'Проверь медиа.',
    analyzer_subtitle: 'Перетащи файл или вставь ссылку — мы запустим полный мульти-модельный скан.',
    tab_image: 'Фото',
    tab_audio: 'Аудио',
    tab_url: 'Ссылка',
    upload_image_text: 'Перетащи изображение или нажми, чтобы выбрать',
    upload_image_hint: 'JPEG, PNG, WEBP · до 10 МБ',
    upload_audio_text: 'Перетащи аудио или нажми, чтобы выбрать',
    upload_audio_hint: 'MP3, WAV, OGG, FLAC · до 25 МБ',
    url_placeholder: 'Вставь URL для скана…',
    url_hint: 'Полный URL, начинающийся с http:// или https://',
    analyze_button: 'Запустить скан',
    analyzing: 'Сканирую…',
    analyze_step_upload: 'Загружаю контент',
    analyze_step_gpt: 'Анализ GPT',
    analyze_step_claude: 'Анализ Claude',
    analyze_step_gemini: 'Анализ Gemini',
    analyze_step_consensus: 'Считаю консенсус',
    result_trust_score: 'Trust Score',
    result_verdict: 'Вердикт',
    result_confidence: 'Уверенность',
    result_signals: 'Разбор сигналов',
    result_summary: 'Кратко',
    result_recommendations: 'Что делать дальше',
    result_share: 'Поделиться',
    result_copy_link: 'Скопировать ссылку',
    result_link_copied: 'Ссылка скопирована',
    result_new_scan: 'Новый скан',

    /* Dashboard */
    dashboard_eyebrow: 'Дашборд',
    dashboard_title: 'Живые сигналы из сети.',
    dashboard_subtitle: 'Что сейчас сканируют другие.',
    dash_filter_all: 'Все',
    dash_filter_image: 'Фото',
    dash_filter_audio: 'Аудио',
    dash_filter_url: 'URL',
    dash_total: 'Всего сканов',
    dash_avg: 'Средний trust',
    dash_flagged: 'Помечено',
    dash_recent: 'Недавние сканы',
    dash_no_data: 'Сканов пока нет — запусти первый.',

    /* Enterprise */
    enterprise_eyebrow: 'Для команд',
    enterprise_title: 'Верификация в масштабе твоей платформы.',
    enterprise_subtitle: 'Подключи DeepGuard к CMS, ньюсруму, антифроду или модерации.',
    enterprise_usecase1: 'Ньюсрумы',
    enterprise_usecase1_desc: 'Проверяй UGC и источники до публикации.',
    enterprise_usecase2: 'Платформы',
    enterprise_usecase2_desc: 'Лови синтетику ещё на загрузке.',
    enterprise_usecase3: 'Антифрод',
    enterprise_usecase3_desc: 'Распознавай клонированные голоса в звонках и KYC.',
    enterprise_usecase4: 'Комплаенс',
    enterprise_usecase4_desc: 'Аудируемые оценки с публичной ссылкой.',
    enterprise_form_title: 'Связаться',
    enterprise_form_subtitle: 'Отвечаем в течение рабочего дня.',
    enterprise_name: 'Имя',
    enterprise_email: 'Рабочая почта',
    enterprise_company: 'Компания',
    enterprise_message: 'Как мы можем помочь?',
    enterprise_submit: 'Отправить',
    enterprise_submitting: 'Отправляю…',
    enterprise_submitted: 'Принято — скоро напишем.',
    enterprise_required: 'Заполните обязательные поля',

    /* Shared result */
    shared_title: 'Публичный результат',
    shared_back: 'Запустить свой скан',
    shared_not_found: 'Этот результат недоступен.',

    /* Education */
    edu_title: 'Как читать Trust Score',
    edu_80_100: '80–100 · Высокая подлинность',
    edu_60_80: '60–79 · Скорее всего подлинно',
    edu_40_60: '40–59 · Неоднозначно — проверь вручную',
    edu_20_40: '20–39 · Скорее всего манипуляция',
    edu_0_20: '0–19 · Манипуляция обнаружена',
  },

  ro: {
    /* Nav */
    nav_home: 'Acasă',
    nav_analyze: 'Analiză',
    nav_dashboard: 'Panou',
    nav_enterprise: 'API',
    nav_run_scan: 'Scanare gratuită',

    /* Hero */
    hero_eyebrow: 'AI multi-model · Construit pentru verificare',
    hero_title_a: 'Făcut pentru cei',
    hero_title_pill: 'care gândesc',
    hero_title_b: 'și verifică ce distribuie.',
    hero_subtitle:
      'DeepGuard verifică imagini, audio și linkuri cu trei modele AI în câteva secunde — și îți spune exact de ce ceva nu se simte în regulă.',
    hero_cta_primary: 'Scanare gratuită',
    hero_cta_secondary: 'Cum funcționează',
    hero_microcopy: 'Gratuit · Fără cont · 10 scanări / zi',
    hero_inline_label: 'Sau lipește un link — îl scanăm acum',
    hero_inline_placeholder: 'https://example.com/articol',
    hero_inline_button: 'Scanează',

    /* Trust strip */
    stat_models: 'modele AI în consens',
    stat_models_value: '3',
    stat_speed: 'secunde în medie pe scanare',
    stat_speed_value: '30',
    stat_signup: 'conturi necesare',
    stat_signup_value: '0',
    stat_proof: 'dovadă publică pentru fiecare scan',
    stat_proof_value: '100%',

    /* Features */
    features_eyebrow: 'Ce detectează',
    features_title: 'O singură scanare. Toate straturile.',
    features_subtitle:
      'DeepGuard citește semnalele pe care oamenii le ratează — și explică fiecare alertă în limbaj simplu.',
    feat_multimodel_title: 'Trei modele, un verdict',
    feat_multimodel_desc:
      'GPT, Claude și Gemini analizează același input în paralel. Afișăm consensul — și dezacordurile.',
    feat_image_title: 'Autenticitate imagini',
    feat_image_desc: 'Detectează fețe AI, fotografii retușate, splice și imagini sintetice.',
    feat_audio_title: 'Voce & audio',
    feat_audio_desc: 'Identifică voci clonate, vorbire sintetică și înregistrări editate.',
    feat_url_title: 'Scanare linkuri',
    feat_url_desc: 'Citește pagina, verifică media, evaluează sursa.',
    feat_signals_title: 'Semnale explicabile',
    feat_signals_desc: 'Fiecare scor e descompus în semnale concrete pe care le poți citi și împărtăși.',
    feat_share_title: 'Dovadă partajabilă',
    feat_share_desc: 'Fiecare scanare primește un link public cu raportul complet.',

    /* How it works */
    how_eyebrow: 'Cum funcționează',
    how_title: 'Trei pași. Sub un minut.',
    how_step1_title: 'Trage sau lipește',
    how_step1_desc: 'O imagine, un fișier audio sau orice URL. Fără format, fără cont.',
    how_step2_title: 'Trei AI scanează',
    how_step2_desc: 'Fiecare model analizează independent și produce propriile semnale.',
    how_step3_title: 'Citești verdictul',
    how_step3_desc: 'Trust Score consensual, explicații pe semnale, link de partajat.',
    how_disclaimer: 'Ce NU pretindem',
    how_disclaimer_text:
      'DeepGuard oferă evaluări probabilistice, nu dovezi definitive. Verifică întotdeauna constatările critice din surse independente.',

    /* Pricing */
    pricing_eyebrow: 'Tarife',
    pricing_title: 'Începe gratuit. Scalează când e nevoie.',
    pricing_subtitle: 'Fără card. Toate planurile includ motorul multi-model complet.',
    pricing_free: 'Free',
    pricing_free_desc: 'Pentru uz individual.',
    pricing_free_price: '$0',
    pricing_free_price_unit: 'pentru totdeauna',
    pricing_free_f1: '10 scanări pe zi',
    pricing_free_f2: 'Imagini, audio & URL',
    pricing_free_f3: 'Descompunere semnale',
    pricing_free_f4: 'Linkuri publice',
    pricing_pro: 'Pro',
    pricing_pro_desc: 'Pentru creatori, jurnaliști, cercetători.',
    pricing_pro_price: '$15',
    pricing_pro_price_unit: '/ lună',
    pricing_pro_f1: 'Scanări nelimitate',
    pricing_pro_f2: 'Toate tipurile',
    pricing_pro_f3: 'Semnale avansate',
    pricing_pro_f4: 'Acces API',
    pricing_pro_f5: 'Procesare prioritară',
    pricing_enterprise: 'Enterprise',
    pricing_enterprise_desc: 'Pentru organizații.',
    pricing_enterprise_price: 'La cerere',
    pricing_enterprise_price_unit: 'preț la volum',
    pricing_enterprise_f1: 'Totul nelimitat',
    pricing_enterprise_f2: 'Procesare în lot',
    pricing_enterprise_f3: 'Integrări custom',
    pricing_enterprise_f4: 'Garanții SLA',
    pricing_enterprise_f5: 'Suport dedicat',
    pricing_cta_free: 'Începe gratuit',
    pricing_cta_pro: 'Obține Pro',
    pricing_cta_enterprise: 'Contactează-ne',
    pricing_popular: 'Popular',

    /* CTA strip + footer */
    cta_title: 'Nu mai ghici ce vezi.',
    cta_subtitle: 'Prima scanare în câteva secunde. Îți arătăm toate semnalele.',
    cta_button: 'Scanare gratuită',
    sticky_cta: 'Scanare gratuită',

    footer_tagline: 'Verifică ce distribui.',
    footer_product: 'Produs',
    footer_resources: 'Resurse',
    footer_company: 'Companie',
    footer_privacy: 'Confidențialitate',
    footer_terms: 'Termeni',
    footer_about: 'Despre',
    footer_madeby: 'DeepGuard · gândește. verifică. distribuie.',

    /* Analyzer */
    analyzer_eyebrow: 'Analizator',
    analyzer_title: 'Verifică-ți media.',
    analyzer_subtitle: 'Trage un fișier sau lipește un URL — pornim scanarea multi-model completă.',
    tab_image: 'Imagine',
    tab_audio: 'Audio',
    tab_url: 'Link',
    upload_image_text: 'Trage o imagine aici sau apasă pentru a selecta',
    upload_image_hint: 'JPEG, PNG, WEBP · până la 10 MB',
    upload_audio_text: 'Trage un fișier audio sau apasă pentru a selecta',
    upload_audio_hint: 'MP3, WAV, OGG, FLAC · până la 25 MB',
    url_placeholder: 'Lipește un URL pentru scanare…',
    url_hint: 'URL complet care începe cu http:// sau https://',
    analyze_button: 'Pornește scanul',
    analyzing: 'Se scanează…',
    analyze_step_upload: 'Se încarcă conținutul',
    analyze_step_gpt: 'Analiză GPT',
    analyze_step_claude: 'Analiză Claude',
    analyze_step_gemini: 'Analiză Gemini',
    analyze_step_consensus: 'Calculez consensul',
    result_trust_score: 'Trust Score',
    result_verdict: 'Verdict',
    result_confidence: 'Încredere',
    result_signals: 'Descompunere semnale',
    result_summary: 'Sumar',
    result_recommendations: 'Ce urmează',
    result_share: 'Partajează',
    result_copy_link: 'Copiază link',
    result_link_copied: 'Link copiat',
    result_new_scan: 'Scan nou',

    /* Dashboard */
    dashboard_eyebrow: 'Panou',
    dashboard_title: 'Semnale live din rețea.',
    dashboard_subtitle: 'Ce scanează alții chiar acum.',
    dash_filter_all: 'Toate',
    dash_filter_image: 'Imagine',
    dash_filter_audio: 'Audio',
    dash_filter_url: 'URL',
    dash_total: 'Total scanări',
    dash_avg: 'Trust mediu',
    dash_flagged: 'Conținut marcat',
    dash_recent: 'Scanări recente',
    dash_no_data: 'Nicio scanare încă — pornește prima.',

    /* Enterprise */
    enterprise_eyebrow: 'Pentru echipe',
    enterprise_title: 'Verificare la scara platformei tale.',
    enterprise_subtitle: 'Conectează DeepGuard la CMS, redacție, antifraudă sau moderare.',
    enterprise_usecase1: 'Redacții',
    enterprise_usecase1_desc: 'Verifică UGC și sursele înainte de publicare.',
    enterprise_usecase2: 'Platforme',
    enterprise_usecase2_desc: 'Prinzi conținut sintetic la upload.',
    enterprise_usecase3: 'Antifraudă',
    enterprise_usecase3_desc: 'Detectează voci clonate în apeluri și KYC.',
    enterprise_usecase4: 'Conformitate',
    enterprise_usecase4_desc: 'Scoruri auditabile cu dovadă publică.',
    enterprise_form_title: 'Vorbește cu noi',
    enterprise_form_subtitle: 'Răspundem într-o zi lucrătoare.',
    enterprise_name: 'Numele tău',
    enterprise_email: 'Email de serviciu',
    enterprise_company: 'Companie',
    enterprise_message: 'Cu ce te putem ajuta?',
    enterprise_submit: 'Trimite',
    enterprise_submitting: 'Se trimite…',
    enterprise_submitted: 'Am primit — te contactăm.',
    enterprise_required: 'Completează câmpurile obligatorii',

    /* Shared result */
    shared_title: 'Rezultat partajat',
    shared_back: 'Pornește propria scanare',
    shared_not_found: 'Acest rezultat nu este disponibil.',

    /* Education */
    edu_title: 'Cum citești Trust Score',
    edu_80_100: '80–100 · Autenticitate ridicată',
    edu_60_80: '60–79 · Probabil autentic',
    edu_40_60: '40–59 · Incert — verificare manuală',
    edu_20_40: '20–39 · Probabil manipulat',
    edu_0_20: '0–19 · Manipulare detectată',
  },
};

const LANG_ORDER = ['en', 'ru', 'ro'];
const LANG_LABELS = { en: 'EN', ru: 'RU', ro: 'RO' };
const LANG_FULL = { en: 'English', ru: 'Русский', ro: 'Română' };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('deepguard_lang') : null;
    return stored && LANG_ORDER.includes(stored) ? stored : 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deepguard_lang', lang);
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (next) => {
    if (LANG_ORDER.includes(next)) setLangState(next);
  };

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;

  const cycleLang = () => {
    const idx = LANG_ORDER.indexOf(lang);
    setLangState(LANG_ORDER[(idx + 1) % LANG_ORDER.length]);
  };

  const nextLangLabel = () => {
    const idx = LANG_ORDER.indexOf(lang);
    return LANG_LABELS[LANG_ORDER[(idx + 1) % LANG_ORDER.length]];
  };

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, cycleLang, nextLangLabel, t, LANG_ORDER, LANG_LABELS, LANG_FULL }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export default LanguageContext;
