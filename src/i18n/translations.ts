// i18n/ — internationalization system supporting 4 languages.
// English (en), Hindi (hi), Marathi (mr), Tamil (ta)
//
// The system uses a React context provider with localStorage persistence.
// All UI strings flow through the useTranslation hook: t('key.path').

export type Language = 'en' | 'hi' | 'mr' | 'ta';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳' },
];

export const DEFAULT_LANGUAGE: Language = 'en';

// --- Translation keys ---
// Organized by feature area. Each key is a dot-separated path.

export interface TranslationTree {
  app: { name: string; tagline: string };
  nav: {
    dashboard: string;
    birthChart: string;
    kundali: string;
    astrologer: string;
    profile: string;
    pricing: string;
  };
  auth: {
    welcomeBack: string;
    signInContinue: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    beginJourney: string;
    createAccountUnlock: string;
    name: string;
    createAccount: string;
    creatingAccount: string;
    newPassword: string;
    atLeast6: string;
    newToAstralis: string;
    alreadyHaveAccount: string;
  };
  onboarding: {
    tellUsAboutYou: string;
    yourBirthDetails: string;
    yourIntentions: string;
    name: string;
    namePlaceholder: string;
    gender: string;
    language: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    birthPlacePlaceholder: string;
    dontKnowTime: string;
    relationshipStatus: string;
    goals: string;
    interests: string;
    continue: string;
    back: string;
    generateMyChart: string;
    generating: string;
    generatingChart: string;
  };
  dashboard: {
    welcome: string;
    todaysHoroscope: string;
    moonPhase: string;
    todaysGuidance: string;
    viewBirthChart: string;
    explorePlanetary: string;
    askAstrologer: string;
    getPersonalized: string;
    personalizedKundali: string;
    deepAnalysis: string;
    luckyColor: string;
    luckyNumber: string;
    luckyTime: string;
    love: string;
    career: string;
  };
  chat: {
    welcome: string;
    askAnything: string;
    askStars: string;
    clearChat: string;
    somethingWrong: string;
  };
  birthChart: {
    title: string;
    generate: string;
    generating: string;
    notGenerated: string;
    planetaryPositions: string;
    timeUnknownNote: string;
    sun: string;
    moon: string;
    rising: string;
    house: string;
  };
  kundali: {
    title: string;
    subtitle: string;
    cosmicSignature: string;
    lifeAspect: string;
    planetAnalysis: string;
    houseAnalysis: string;
    proFeatures: string;
    unlockAll: string;
    careerPotential: string;
    relationshipHarmony: string;
    physicalEnergy: string;
    growthPotential: string;
    dashaPeriods: string;
    dashaDesc: string;
    yearlyTransits: string;
    transitsDesc: string;
    compatibility: string;
    compatDesc: string;
    remedialMeasures: string;
    remedialDesc: string;
    unlockPro: string;
    deepAnalysisBlue: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    monthly: string;
    yearly: string;
    save20: string;
    forever: string;
    perMonth: string;
    perMonthBilledYearly: string;
    perYear: string;
    currentPlan: string;
    upgradePro: string;
    goPremium: string;
    mostPopular: string;
    free: string;
    pro: string;
    premium: string;
    freeDesc: string;
    proDesc: string;
    premiumDesc: string;
    whatYouGet: string;
    personalizedKundali: string;
    unlimitedAI: string;
    yearlyTransits: string;
    dashaPeriods: string;
    back: string;
  };
  profile: {
    title: string;
    astrologicalProfile: string;
    viewChart: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    language: string;
    unknown: string;
    goals: string;
    interests: string;
    subscription: string;
    freePlan: string;
    memberSince: string;
  };
  common: {
    retry: string;
    signOut: string;
    upgrade: string;
    back: string;
  };
  suggestions: {
    prompt1: string;
    prompt2: string;
    prompt3: string;
    prompt4: string;
  };
  goals: {
    'Self-discovery': string;
    'Love & relationships': string;
    'Career guidance': string;
    'Spiritual growth': string;
    'Emotional healing': string;
    'Life purpose': string;
    'Financial success': string;
    'Creativity': string;
    'Better decisions': string;
  };
  interests: {
    'Zodiac signs': string;
    'Daily horoscopes': string;
    'Birth charts': string;
    'Moon phases': string;
    'Crystals': string;
    'Meditation': string;
    'Tarot': string;
    'Numerology': string;
    'Dreams': string;
    'Energy healing': string;
  };
  genders: {
    female: string;
    male: string;
    'non-binary': string;
    'prefer-not': string;
  };
  relationships: {
    single: string;
    'in-relationship': string;
    married: string;
    complicated: string;
    'prefer-not': string;
  };
  zodiac: {
    Aries: string; Taurus: string; Gemini: string; Cancer: string;
    Leo: string; Virgo: string; Libra: string; Scorpio: string;
    Sagittarius: string; Capricorn: string; Aquarius: string; Pisces: string;
  };
  planets: {
    Sun: string; Moon: string; Mercury: string; Venus: string;
    Mars: string; Jupiter: string; Saturn: string;
  };
  horoscope: {
    general: string;
    love: string;
    career: string;
    health: string;
    guidance: string;
  };
  ai: {
    greeting: string;
    careerIntro: string;
    loveIntro: string;
    moonIntro: string;
    sunIntro: string;
    risingIntro: string;
    purposeIntro: string;
    forecastIntro: string;
    chartIntro: string;
    generalIntro: string;
    healthIntro: string;
    familyIntro: string;
    socialIntro: string;
    askMore: string;
  };
  marriage: {
    title: string;
    subtitle: string;
    groom: string;
    bride: string;
    groomsDetails: string;
    bridesDetails: string;
    fullName: string;
    dateOfBirth: string;
    timeOfBirth: string;
    birthPlace: string;
    timeUnknown: string;
    calculate: string;
    calculating: string;
    enterBothDates: string;
    score: string;
    compatible: string;
    verdict: string;
    excellentMatch: string;
    veryGoodMatch: string;
    goodMatch: string;
    averageMatch: string;
    challengingMatch: string;
    ashtaKoota: string;
    ashtaKootaDesc: string;
    recommendations: string;
    checkAnother: string;
    groomNakshatra: string;
    brideNakshatra: string;
    varna: string;
    vashya: string;
    tara: string;
    yoni: string;
    grahaMaitri: string;
    gana: string;
    bhakoot: string;
    nadi: string;
    points: string;
    groomValue: string;
    brideValue: string;
    favorable: string;
    notFavorable: string;
  };
  birthChartDetails: {
    cosmicSignature: string;
    nakshatra: string;
    nakshatraLunar: string;
    rulingPlanet: string;
    deity: string;
    symbol: string;
    quality: string;
    range: string;
    planetAnalysis: string;
    planetAnalysisDesc: string;
    houseAnalysis: string;
    houseAnalysisDesc: string;
    lifePredictions: string;
    lifePredictionsDesc: string;
    summary: string;
    personality: string;
    challenges: string;
    remedy: string;
    mantra: string;
    vedicDetails: string;
    deityLabel: string;
    dayLabel: string;
    gemstoneLabel: string;
    colorLabel: string;
    numberLabel: string;
    directionLabel: string;
    elementLabel: string;
    qualityLabel: string;
    rulerLabel: string;
    bodyLabel: string;
    strengths: string;
    careerFields: string;
    healthFocus: string;
    luckyAttributes: string;
    luckyColor: string;
    luckyNumbers: string;
    luckyDay: string;
    gemstone: string;
    houseNumber: string;
    planetsInHouse: string;
    lifeArea: string;
    careerProfession: string;
    loveMarriage: string;
    healthVitality: string;
    wealthProsperity: string;
    spiritualGrowth: string;
    favorablePct: string;
    recommendedRemedies: string;
    noTimeHouses: string;
  };
  kundaliDetails: {
    generatePdf: string;
    regeneratePdf: string;
    download: string;
    pdfTitle: string;
    pdfDesc: string;
    pdfPreview: string;
    dashaTimeline: string;
    dashaCurrent: string;
    dashaNext: string;
    yearlyTransitForecast: string;
    transitForecast: string;
    remedialMeasures: string;
    yourMantras: string;
    currentDasha: string;
    dashaEffect: string;
    transitEffect: string;
    futurePrediction: string;
    futurePredictionDesc: string;
  };
  location: {
    autoDetect: string;
    detecting: string;
    locationDetected: string;
    locationDenied: string;
    useCurrentLocation: string;
    confirmLocation: string;
  };
}

// --- English (default) ---
const en: TranslationTree = {
  app: { name: 'Astralis', tagline: 'AI-Powered Astrology' },
  nav: {
    dashboard: 'Dashboard', birthChart: 'Birth Chart', kundali: 'Kundali',
    astrologer: 'AI Astrologer', profile: 'Profile', pricing: 'Pricing',
  },
  auth: {
    welcomeBack: 'Welcome back', signInContinue: 'Sign in to continue your cosmic journey',
    email: 'Email', password: 'Password', signIn: 'Sign in', signingIn: 'Signing in…',
    beginJourney: 'Begin your journey', createAccountUnlock: 'Create an account to unlock the cosmos',
    name: 'Name', createAccount: 'Create account', creatingAccount: 'Creating account…',
    newPassword: 'New Password', atLeast6: 'At least 6 characters',
    newToAstralis: 'New to Astralis?', alreadyHaveAccount: 'Already have an account?',
  },
  onboarding: {
    tellUsAboutYou: 'Tell us about you', yourBirthDetails: 'Your birth details',
    yourIntentions: 'Your intentions', name: 'Name', namePlaceholder: 'Your name',
    gender: 'Gender', language: 'Language', birthDate: 'Birth Date', birthTime: 'Birth Time',
    birthPlace: 'Birth Place', birthPlacePlaceholder: 'Enter city name',
    dontKnowTime: "I don't know my exact time", relationshipStatus: 'Relationship Status',
    goals: 'Goals', interests: 'Interests', continue: 'Continue', back: 'Back',
    generateMyChart: 'Generate My Chart', generating: 'Generating…', generatingChart: 'Generating your birth chart…',
  },
  dashboard: {
    welcome: 'Welcome', todaysHoroscope: "Today's Horoscope", moonPhase: 'Moon Phase',
    todaysGuidance: "Today's Guidance", viewBirthChart: 'View Birth Chart',
    explorePlanetary: 'Explore your planetary positions', askAstrologer: 'Ask AI Astrologer',
    getPersonalized: 'Get personalized guidance', personalizedKundali: 'Personalized Kundali',
    deepAnalysis: 'Deep analysis of your cosmic blueprint', luckyColor: 'Lucky Color',
    luckyNumber: 'Lucky Number', luckyTime: 'Lucky Time', love: 'Love', career: 'Career',
  },
  chat: {
    welcome: 'Welcome', askAnything: 'Ask me anything about your chart, your day, or what the stars have in store for you.',
    askStars: 'Ask the stars…', clearChat: 'Clear chat', somethingWrong: 'Something went wrong. Please try again.',
  },
  birthChart: {
    title: 'Your Birth Chart', generate: 'Generate My Chart', generating: 'Generating…',
    notGenerated: "Your birth chart hasn't been generated yet.", planetaryPositions: 'Planetary Positions',
    timeUnknownNote: "Your birth time wasn't provided, so house placements and your rising sign aren't shown. Sun and Moon signs are still accurate.",
    sun: 'Sun', moon: 'Moon', rising: 'Rising', house: 'House',
  },
  kundali: {
    title: 'Personalized Kundali', subtitle: 'A deep analysis of your cosmic blueprint — strengths, challenges, and life path.',
    cosmicSignature: 'Your Cosmic Signature', lifeAspect: 'Life Aspect Analysis',
    planetAnalysis: 'Planet-by-Planet Analysis', houseAnalysis: 'House Analysis',
    proFeatures: 'Pro Features', unlockAll: 'Unlock All Pro Features',
    careerPotential: 'Career Potential', relationshipHarmony: 'Relationship Harmony',
    physicalEnergy: 'Physical Energy', growthPotential: 'Growth Potential',
    dashaPeriods: 'Dasha Periods', dashaDesc: 'Unlock your Vimshottari Dasha timeline to see which planetary periods are active and what they mean for your life.',
    yearlyTransits: 'Yearly Transits', transitsDesc: "See how current planetary transits interact with your birth chart for the next 12 months.",
    compatibility: 'Relationship Compatibility', compatDesc: "Upload a partner's birth details to see your synastry chart and compatibility scores.",
    remedialMeasures: 'Remedial Measures', remedialDesc: "Personalized gemstone, mantra, and ritual recommendations based on your chart's weak points.",
    unlockPro: 'Dasha periods, transits, compatibility & more', deepAnalysisBlue: 'Deep analysis of your cosmic blueprint',
  },
  pricing: {
    title: 'Choose Your Plan', subtitle: 'Unlock deeper insights, personalized kundali analysis, and advanced Vedic astrology features.',
    monthly: 'Monthly', yearly: 'Yearly', save20: 'Save 20%', forever: 'forever', perMonth: '/month',
    perMonthBilledYearly: '/month, billed yearly', perYear: '/year',
    currentPlan: 'Current Plan', upgradePro: 'Upgrade to Pro', goPremium: 'Go Premium',
    mostPopular: 'Most Popular', free: 'Free', pro: 'Pro', premium: 'Premium',
    freeDesc: 'Start your cosmic journey with essential astrology tools.',
    proDesc: 'Unlock your full personalized kundali and deep analysis.',
    premiumDesc: 'The complete astrology suite with advanced Vedic features.',
    whatYouGet: 'What You Get With Pro',
    personalizedKundali: 'Personalized Kundali', unlimitedAI: 'Unlimited AI Guidance',
    yearlyTransits: 'Yearly Transits', dashaPeriods: 'Dasha Periods (Premium)',
    back: 'Back',
  },
  profile: {
    title: 'Profile', astrologicalProfile: 'Astrological Profile', viewChart: 'View Chart',
    birthDate: 'Birth Date', birthTime: 'Birth Time', birthPlace: 'Birth Place', language: 'Language',
    unknown: 'Unknown', goals: 'Goals', interests: 'Interests',
    subscription: 'Subscription', freePlan: 'Free plan · Upgrade for more features',
    memberSince: 'Member since',
  },
  common: { retry: 'Retry', signOut: 'Sign out', upgrade: 'Upgrade', back: 'Back' },
  suggestions: {
    prompt1: 'What does today hold for me?', prompt2: 'Career guidance',
    prompt3: 'Relationship advice', prompt4: 'What does my moon sign mean?',
  },
  goals: {
    'Self-discovery': 'Self-discovery', 'Love & relationships': 'Love & relationships',
    'Career guidance': 'Career guidance', 'Spiritual growth': 'Spiritual growth',
    'Emotional healing': 'Emotional healing', 'Life purpose': 'Life purpose',
    'Financial success': 'Financial success', 'Creativity': 'Creativity',
    'Better decisions': 'Better decisions',
  },
  interests: {
    'Zodiac signs': 'Zodiac signs', 'Daily horoscopes': 'Daily horoscopes',
    'Birth charts': 'Birth charts', 'Moon phases': 'Moon phases',
    'Crystals': 'Crystals', 'Meditation': 'Meditation', 'Tarot': 'Tarot',
    'Numerology': 'Numerology', 'Dreams': 'Dreams', 'Energy healing': 'Energy healing',
  },
  genders: { female: 'Female', male: 'Male', 'non-binary': 'Non-binary', 'prefer-not': 'Prefer not to say' },
  relationships: {
    single: 'Single', 'in-relationship': 'In a relationship', married: 'Married',
    complicated: "It's complicated", 'prefer-not': 'Prefer not to say',
  },
  zodiac: {
    Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer',
    Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Scorpio',
    Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces',
  },
  planets: { Sun: 'Sun', Moon: 'Moon', Mercury: 'Mercury', Venus: 'Venus', Mars: 'Mars', Jupiter: 'Jupiter', Saturn: 'Saturn' },
  horoscope: { general: 'general', love: 'love', career: 'career', health: 'health', guidance: 'guidance' },
  ai: {
    greeting: 'Thank you for sharing that. Looking at your chart',
    careerIntro: 'In astrology, the 10th house governs career. Let me look at what your chart says about your professional path:',
    loveIntro: 'In astrology, the 7th house governs partnerships. Let me look at what your chart says about love:',
    moonIntro: 'Your Moon sign reveals your emotional nature — the private self that only those closest to you get to see.',
    sunIntro: 'Your Sun sign is your core identity — the hero\'s journey of your life.',
    risingIntro: 'Your rising sign (ascendant) is the sign that was rising on the eastern horizon at the moment of your birth.',
    purposeIntro: "Your birth chart is a map of your soul's intention for this lifetime. Let's look at the key signposts:",
    forecastIntro: "Here's your cosmic weather for today:",
    chartIntro: "Here's an overview of your birth chart:",
    generalIntro: 'What specifically would you like to explore? I can speak to your career path, relationships, emotional patterns, life purpose, or what the current cosmic weather means for you.',
    healthIntro: 'In astrology, the 6th house governs health and daily routines.',
    familyIntro: 'Family dynamics are reflected in your chart through the Moon (mother/inner child), Saturn (father/authority), and the 4th house (home and roots):',
    socialIntro: 'Friendships and community are seen through your 11th house, along with Venus (what you value in others) and Jupiter (where you find expansion through connection):',
    askMore: 'What specifically would you like to explore?',
  },
  marriage: {
    title: 'Marriage Matching', subtitle: 'Vedic Ashta Koota (8-fold) compatibility analysis based on Moon sign and Nakshatra.',
    groom: 'Groom', bride: 'Bride', groomsDetails: "Groom's Details", bridesDetails: "Bride's Details",
    fullName: 'Full Name', dateOfBirth: 'Date of Birth', timeOfBirth: 'Time of Birth',
    birthPlace: 'Birth Place', timeUnknown: 'Birth time unknown',
    calculate: 'Calculate Compatibility', calculating: 'Calculating Match…',
    enterBothDates: 'Please enter birth dates for both partners to calculate compatibility.',
    score: 'Score', compatible: 'Compatible', verdict: 'Verdict',
    excellentMatch: 'Excellent Match', veryGoodMatch: 'Very Good Match',
    goodMatch: 'Good Match', averageMatch: 'Average Match', challengingMatch: 'Challenging Match',
    ashtaKoota: 'Ashta Koota Breakdown (8-fold Analysis)',
    ashtaKootaDesc: 'The Ashta Koota system evaluates compatibility across eight dimensions totaling 36 points (Guna Milan). A score of 18+ is considered acceptable for marriage.',
    recommendations: 'Recommendations & Remedies', checkAnother: 'Check Another Match',
    groomNakshatra: "Groom's Nakshatra", brideNakshatra: "Bride's Nakshatra",
    varna: 'Varna', vashya: 'Vashya', tara: 'Tara', yoni: 'Yoni',
    grahaMaitri: 'Graha Maitri', gana: 'Gana', bhakoot: 'Bhakoot', nadi: 'Nadi',
    points: 'points', groomValue: 'Groom', brideValue: 'Bride',
    favorable: 'Favorable', notFavorable: 'Needs Attention',
  },
  birthChartDetails: {
    cosmicSignature: 'Your Cosmic Signature',
    nakshatra: 'Your Nakshatra (Lunar Mansion)', nakshatraLunar: 'Nakshatra',
    rulingPlanet: 'Ruling Planet', deity: 'Deity', symbol: 'Symbol', quality: 'Quality', range: 'Range',
    planetAnalysis: 'Planet Analysis', planetAnalysisDesc: 'Each planet in your chart represents a different facet of your personality and life. Click any card to reveal detailed interpretations, challenges, and remedies.',
    houseAnalysis: 'House Analysis', houseAnalysisDesc: 'The twelve houses represent different areas of your life. Each house is ruled by a zodiac sign, showing how that life area is colored for you.',
    lifePredictions: 'Life Predictions', lifePredictionsDesc: 'Based on your planetary positions, here are predictions for key areas of your life with personalized remedies.',
    summary: 'Summary', personality: 'Personality', challenges: 'Challenges',
    remedy: 'Remedy', mantra: 'Mantra', vedicDetails: 'Vedic Details',
    deityLabel: 'Deity:', dayLabel: 'Day:', gemstoneLabel: 'Gemstone:', colorLabel: 'Color:',
    numberLabel: 'Number:', directionLabel: 'Direction:', elementLabel: 'Element:',
    qualityLabel: 'Quality:', rulerLabel: 'Ruler:', bodyLabel: 'Body:',
    strengths: 'Strengths', careerFields: 'Career Fields', healthFocus: 'Health Focus',
    luckyAttributes: 'Your Lucky Attributes', luckyColor: 'Lucky Color',
    luckyNumbers: 'Lucky Numbers', luckyDay: 'Lucky Day', gemstone: 'Gemstone',
    houseNumber: 'House', planetsInHouse: 'Planets in this house',
    lifeArea: 'Life Area', careerProfession: 'Career & Profession',
    loveMarriage: 'Love & Marriage', healthVitality: 'Health & Vitality',
    wealthProsperity: 'Wealth & Prosperity', spiritualGrowth: 'Spiritual Growth',
    favorablePct: '% Favorable', recommendedRemedies: 'Recommended Remedies',
    noTimeHouses: 'House analysis requires your birth time. Please update your profile with your birth time to see house placements.',
  },
  kundaliDetails: {
    generatePdf: 'Generate PDF', regeneratePdf: 'Regenerate PDF', download: 'Download',
    pdfTitle: 'Personalized Kundali PDF', pdfDesc: 'Download your complete future prediction report as a printable document.',
    pdfPreview: 'PDF Preview', dashaTimeline: 'Dasha Timeline',
    dashaCurrent: 'Current Dasha Period', dashaNext: 'Next Dasha Period',
    yearlyTransitForecast: 'Yearly Transit Forecast', transitForecast: 'Transit Forecast',
    remedialMeasures: 'Remedial Measures', yourMantras: 'Your Mantras',
    currentDasha: 'Current Dasha', dashaEffect: 'Dasha Effect',
    transitEffect: 'Transit Effect', futurePrediction: 'Future Predictions',
    futurePredictionDesc: 'Your complete life forecast based on planetary positions',
  },
  location: {
    autoDetect: 'Auto-detect location', detecting: 'Detecting location…',
    locationDetected: 'Location detected', locationDenied: 'Location access denied',
    useCurrentLocation: 'Use my current location', confirmLocation: 'Confirm location',
  },
};

// --- Hindi ---
const hi: TranslationTree = {
  app: { name: 'Astralis', tagline: 'एआई-संचालित ज्योतिष' },
  nav: {
    dashboard: 'डैशबोर्ड', birthChart: 'जन्म पत्रिका', kundali: 'कुंडली',
    astrologer: 'एआई ज्योतिषी', profile: 'प्रोफ़ाइल', pricing: 'मूल्य निर्धारण',
  },
  auth: {
    welcomeBack: 'वापसी पर स्वागत है', signInContinue: 'अपनी ब्रह्मांडीय यात्रा जारी रखने के लिए साइन इन करें',
    email: 'ईमेल', password: 'पासवर्ड', signIn: 'साइन इन', signingIn: 'साइन इन हो रहा है…',
    beginJourney: 'अपनी यात्रा शुरू करें', createAccountUnlock: 'ब्रह्मांड को अनलॉक करने के लिए खाता बनाएं',
    name: 'नाम', createAccount: 'खाता बनाएं', creatingAccount: 'खाता बन रहा है…',
    newPassword: 'नया पासवर्ड', atLeast6: 'कम से कम 6 अक्षर',
    newToAstralis: 'Astralis पर नए हैं?', alreadyHaveAccount: 'पहले से खाता है?',
  },
  onboarding: {
    tellUsAboutYou: 'अपने बारे में बताएं', yourBirthDetails: 'आपके जन्म के विवरण',
    yourIntentions: 'आपके उद्देश्य', name: 'नाम', namePlaceholder: 'आपका नाम',
    gender: 'लिंग', language: 'भाषा', birthDate: 'जन्म तिथि', birthTime: 'जन्म समय',
    birthPlace: 'जन्म स्थान', birthPlacePlaceholder: 'शहर का नाम दर्ज करें',
    dontKnowTime: 'मुझे अपना सटीक समय नहीं पता', relationshipStatus: 'रिश्ते की स्थिति',
    goals: 'लक्ष्य', interests: 'रुचियां', continue: 'जारी रखें', back: 'वापस',
    generateMyChart: 'मेरी कुंडली बनाएं', generating: 'बन रही है…', generatingChart: 'आपकी जन्म पत्रिका बन रही है…',
  },
  dashboard: {
    welcome: 'स्वागत है', todaysHoroscope: 'आज का राशिफल', moonPhase: 'चंद्र कला',
    todaysGuidance: 'आज का मार्गदर्शन', viewBirthChart: 'जन्म पत्रिका देखें',
    explorePlanetary: 'अपनी ग्रह स्थिति देखें', askAstrologer: 'एआई ज्योतिषी से पूछें',
    getPersonalized: 'व्यक्तिगत मार्गदर्शन पाएं', personalizedKundali: 'व्यक्तिगत कुंडली',
    deepAnalysis: 'आपके ब्रह्मांडीय खाके का गहन विश्लेषण', luckyColor: 'भाग्यशाली रंग',
    luckyNumber: 'भाग्यशाली अंक', luckyTime: 'भाग्यशाली समय', love: 'प्रेम', career: 'करियर',
  },
  chat: {
    welcome: 'स्वागत है', askAnything: 'अपनी कुंडली, अपने दिन, या तारों के भविष्य के बारे में कुछ भी पूछें।',
    askStars: 'तारों से पूछें…', clearChat: 'चैट साफ़ करें', somethingWrong: 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
  },
  birthChart: {
    title: 'आपकी जन्म पत्रिका', generate: 'मेरी कुंडली बनाएं', generating: 'बन रही है…',
    notGenerated: 'आपकी जन्म पत्रिका अभी तक नहीं बनाई गई है।', planetaryPositions: 'ग्रहों की स्थिति',
    timeUnknownNote: 'आपका जन्म समय नहीं दिया गया था, इसलिए घर की स्थिति और आपका लग्न नहीं दिखाए गए हैं। सूर्य और चंद्र राशि अभी भी सटीक हैं।',
    sun: 'सूर्य', moon: 'चंद्र', rising: 'लग्न', house: 'भाव',
  },
  kundali: {
    title: 'व्यक्तिगत कुंडली', subtitle: 'आपके ब्रह्मांडीय खाके का गहन विश्लेषण — शक्तियां, चुनौतियां, और जीवन पथ।',
    cosmicSignature: 'आपकी ब्रह्मांडीय पहचान', lifeAspect: 'जीवन पहलू विश्लेषण',
    planetAnalysis: 'ग्रह-दर-ग्रह विश्लेषण', houseAnalysis: 'भाव विश्लेषण',
    proFeatures: 'प्रो सुविधाएं', unlockAll: 'सभी प्रो सुविधाएं अनलॉक करें',
    careerPotential: 'करियर क्षमता', relationshipHarmony: 'रिश्ते में सामंजस्य',
    physicalEnergy: 'शारीरिक ऊर्जा', growthPotential: 'विकास क्षमता',
    dashaPeriods: 'दशा काल', dashaDesc: 'अपनी विंशोत्तरी दशा समयरेखा अनलॉक करें और देखें कि कौन से ग्रहीय काल सक्रिय हैं और उनका आपके जीवन के लिए क्या अर्थ है।',
    yearlyTransits: 'वार्षिक गोचर', transitsDesc: 'देखें कि वर्तमान ग्रह गोचर अगले 12 महीनों के लिए आपकी जन्म कुंडली के साथ कैसे बातचीत करते हैं।',
    compatibility: 'रिश्ते में स्वभाव मिलान', compatDesc: 'अपने साथी के जन्म विवरण अपलोड करें और अपनी सिनास्ट्री कुंडली और स्वभाव मिलान स्कोर देखें।',
    remedialMeasures: 'उपाय', remedialDesc: 'आपकी कुंडली की कमजोरियों के आधार पर व्यक्तिगत रत्न, मंत्र, और अनुष्ठान सिफारिशें।',
    unlockPro: 'दशा काल, गोचर, स्वभाव मिलान और अधिक', deepAnalysisBlue: 'आपके ब्रह्मांडीय खाके का गहन विश्लेषण',
  },
  pricing: {
    title: 'अपनी योजना चुनें', subtitle: 'गहन ज्योतिष अंतर्दृष्टि, व्यक्तिगत कुंडली विश्लेषण, और उन्नत वैदिक ज्योतिष सुविधाएं अनलॉक करें।',
    monthly: 'मासिक', yearly: 'वार्षिक', save20: '20% बचाएं', forever: 'हमेशा के लिए', perMonth: '/माह',
    perMonthBilledYearly: '/माह, वार्षिक बिलिंग', perYear: '/वर्ष',
    currentPlan: 'वर्तमान योजना', upgradePro: 'प्रो में अपग्रेड करें', goPremium: 'प्रीमियम चुनें',
    mostPopular: 'सबसे लोकप्रिय', free: 'निःशुल्क', pro: 'प्रो', premium: 'प्रीमियम',
    freeDesc: 'आधारभूत ज्योतिष उपकरणों के साथ अपनी ब्रह्मांडीय यात्रा शुरू करें।',
    proDesc: 'अपनी पूर्ण व्यक्तिगत कुंडली और गहन विश्लेषण अनलॉक करें।',
    premiumDesc: 'उन्नत वैदिक सुविधाओं के साथ संपूर्ण ज्योतिष सूट।',
    whatYouGet: 'प्रो के साथ आपको क्या मिलता है',
    personalizedKundali: 'व्यक्तिगत कुंडली', unlimitedAI: 'असीमित एआई मार्गदर्शन',
    yearlyTransits: 'वार्षिक गोचर', dashaPeriods: 'दशा काल (प्रीमियम)',
    back: 'वापस',
  },
  profile: {
    title: 'प्रोफ़ाइल', astrologicalProfile: 'ज्योतिषीय प्रोफ़ाइल', viewChart: 'कुंडली देखें',
    birthDate: 'जन्म तिथि', birthTime: 'जन्म समय', birthPlace: 'जन्म स्थान', language: 'भाषा',
    unknown: 'अज्ञात', goals: 'लक्ष्य', interests: 'रुचियां',
    subscription: 'सदस्यता', freePlan: 'निःशुल्क योजना · अधिक सुविधाओं के लिए अपग्रेड करें',
    memberSince: 'सदस्य से',
  },
  common: { retry: 'पुनः प्रयास', signOut: 'साइन आउट', upgrade: 'अपग्रेड', back: 'वापस' },
  suggestions: {
    prompt1: 'आज मेरे लिए क्या है?', prompt2: 'करियर मार्गदर्शन',
    prompt3: 'रिश्ते की सलाह', prompt4: 'मेरे चंद्र राशि का क्या अर्थ है?',
  },
  goals: {
    'Self-discovery': 'आत्म-खोज', 'Love & relationships': 'प्रेम और रिश्ते',
    'Career guidance': 'करियर मार्गदर्शन', 'Spiritual growth': 'आध्यात्मिक विकास',
    'Emotional healing': 'भावनात्मक उपचार', 'Life purpose': 'जीवन का उद्देश्य',
    'Financial success': 'आर्थिक सफलता', 'Creativity': 'रचनात्मकता',
    'Better decisions': 'बेहतर निर्णय',
  },
  interests: {
    'Zodiac signs': 'राशि चिन्ह', 'Daily horoscopes': 'दैनिक राशिफल',
    'Birth charts': 'जन्म पत्रिका', 'Moon phases': 'चंद्र कलाएं',
    'Crystals': 'क्रिस्टल', 'Meditation': 'ध्यान', 'Tarot': 'टैरो',
    'Numerology': 'अंक ज्योतिष', 'Dreams': 'सपने', 'Energy healing': 'ऊर्जा उपचार',
  },
  genders: { female: 'महिला', male: 'पुरुष', 'non-binary': 'गैर-बाइनरी', 'prefer-not': 'नहीं कहना चाहूंगा' },
  relationships: {
    single: 'अविवाहित', 'in-relationship': 'रिश्ते में', married: 'विवाहित',
    complicated: 'यह जटिल है', 'prefer-not': 'नहीं कहना चाहूंगा',
  },
  zodiac: {
    Aries: 'मेष', Taurus: 'वृषभ', Gemini: 'मिथुन', Cancer: 'कर्क',
    Leo: 'सिंह', Virgo: 'कन्या', Libra: 'तुला', Scorpio: 'वृश्चिक',
    Sagittarius: 'धनु', Capricorn: 'मकर', Aquarius: 'कुंभ', Pisces: 'मीन',
  },
  planets: { Sun: 'सूर्य', Moon: 'चंद्रमा', Mercury: 'बुध', Venus: 'शुक्र', Mars: 'मंगल', Jupiter: 'गुरु', Saturn: 'शनि' },
  horoscope: { general: 'सामान्य', love: 'प्रेम', career: 'करियर', health: 'स्वास्थ्य', guidance: 'मार्गदर्शन' },
  ai: {
    greeting: 'साझा करने के लिए धन्यवाद। आपकी कुंडली देखते हुए',
    careerIntro: 'ज्योतिष में, दसवां भाव करियर का संचालन करता है। आइए देखें आपकी कुंडली आपके पेशेवर मार्ग के बारे में क्या कहती है:',
    loveIntro: 'ज्योतिष में, सातवां भाव साझेदारी का संचालन करता है। आइए देखें आपकी कुंडली प्रेम के बारे में क्या कहती है:',
    moonIntro: 'आपकी चंद्र राशि आपकी भावनात्मक प्रकृति को दर्शाती है — वह निजी स्व जिसे केवल आपके सबसे करीबी लोग ही देख पाते हैं।',
    sunIntro: 'आपकी सूर्य राशि आपकी मूल पहचान है — आपके जीवन की नायक यात्रा।',
    risingIntro: 'आपका लग्न वह राशि है जो आपके जन्म के क्षण पर पूर्वी क्षितिज पर उदित हो रही थी।',
    purposeIntro: 'आपकी जन्म कुंडली इस जीवन के लिए आपके आत्मा के इरादे का नक्शा है। आइए मुख्य संकेतों को देखें:',
    forecastIntro: 'आज का आपका ब्रह्मांडीय मौसम:',
    chartIntro: 'आपकी जन्म कुंडली का अवलोकन:',
    generalIntro: 'आप विशेष रूप से क्या जानना चाहेंगे? मैं आपके करियर पथ, रिश्तों, भावनात्मक पैटर्न, जीवन उद्देश्य, या वर्तमान ब्रह्मांडीय मौसम के बारे में बात कर सकता हूं।',
    healthIntro: 'ज्योतिष में, छठा भाव स्वास्थ्य और दैनिक दिनचर्या का संचालन करता है।',
    familyIntro: 'परिवार की गतिशीलता आपकी कुंडली में चंद्रमा (माता/आंतरिक बालक), शनि (पिता/अधिकार), और चौथा भाव (घर और मूल) के माध्यम से दिखाई देती है:',
    socialIntro: 'मित्रता और समुदाय आपके 11वें भाव के माध्यम से देखे जाते हैं, साथ ही शुक्र (आप दूसरों में क्या मूल्य देते हैं) और गुरु (आप कनेक्शन के माध्यम से विस्तार कहां पाते हैं):',
    askMore: 'आप विशेष रूप से क्या जानना चाहेंगे?',
  },
  marriage: {
    title: 'विवाह मिलान', subtitle: 'चंद्र राशि और नक्षत्र के आधार पर वैदिक अष्ट कूट (8-गुण) स्वभाव मिलान विश्लेषण।',
    groom: 'वर', bride: 'वधू', groomsDetails: 'वर का विवरण', bridesDetails: 'वधू का विवरण',
    fullName: 'पूरा नाम', dateOfBirth: 'जन्म तिथि', timeOfBirth: 'जन्म समय',
    birthPlace: 'जन्म स्थान', timeUnknown: 'जन्म समय अज्ञात',
    calculate: 'स्वभाव मिलान गणना करें', calculating: 'मिलान की गणना हो रही है…',
    enterBothDates: 'स्वभाव मिलान की गणना के लिए दोनों की जन्म तिथि दर्ज करें।',
    score: 'स्कोर', compatible: 'स्वभाव', verdict: 'निर्णय',
    excellentMatch: 'उत्कृष्ट मिलान', veryGoodMatch: 'बहुत अच्छा मिलान',
    goodMatch: 'अच्छा मिलान', averageMatch: 'औसत मिलान', challengingMatch: 'चुनौतीपूर्ण मिलान',
    ashtaKoota: 'अष्ट कूट विश्लेषण (8-गुण विश्लेषण)',
    ashtaKootaDesc: 'अष्ट कूट प्रणाली आठ आयामों में स्वभाव का मूल्यांकन करती है, कुल 36 अंक (गुण मिलान)। 18+ अंक विवाह के लिए स्वीकार्य माना जाता है।',
    recommendations: 'सिफारिशें और उपाय', checkAnother: 'दूसरा मिलान जांचें',
    groomNakshatra: 'वर का नक्षत्र', brideNakshatra: 'वधू का नक्षत्र',
    varna: 'वर्ण', vashya: 'वश्य', tara: 'तारा', yoni: 'योनि',
    grahaMaitri: 'ग्रह मैत्री', gana: 'गण', bhakoot: 'भकूट', nadi: 'नाड़ी',
    points: 'अंक', groomValue: 'वर', brideValue: 'वधू',
    favorable: 'अनुकूल', notFavorable: 'ध्यान आवश्यक',
  },
  birthChartDetails: {
    cosmicSignature: 'आपकी ब्रह्मांडीय पहचान',
    nakshatra: 'आपका नक्षत्र (चंद्र वंश)', nakshatraLunar: 'नक्षत्र',
    rulingPlanet: 'शासक ग्रह', deity: 'देवता', symbol: 'प्रतीक', quality: 'गुण', range: 'सीमा',
    planetAnalysis: 'ग्रह विश्लेषण', planetAnalysisDesc: 'आपकी कुंडली का प्रत्येक ग्रह आपके व्यक्तित्व और जीवन के एक अलग पहलू का प्रतिनिधित्व करता है। विस्तृत व्याख्या, चुनौतियों और उपायों के लिए किसी भी कार्ड पर क्लिक करें।',
    houseAnalysis: 'भाव विश्लेषण', houseAnalysisDesc: 'बारह भाव आपके जीवन के विभिन्न क्षेत्रों का प्रतिनिधित्व करते हैं। प्रत्येक भाव एक राशि द्वारा शासित होता है।',
    lifePredictions: 'जीवन भविष्यवाणियां', lifePredictionsDesc: 'आपकी ग्रह स्थिति के आधार पर, यहां आपके जीवन के प्रमुख क्षेत्रों के लिए भविष्यवाणियां और उपाय हैं।',
    summary: 'सारांश', personality: 'व्यक्तित्व', challenges: 'चुनौतियां',
    remedy: 'उपाय', mantra: 'मंत्र', vedicDetails: 'वैदिक विवरण',
    deityLabel: 'देवता:', dayLabel: 'दिन:', gemstoneLabel: 'रत्न:', colorLabel: 'रंग:',
    numberLabel: 'अंक:', directionLabel: 'दिशा:', elementLabel: 'तत्व:',
    qualityLabel: 'गुण:', rulerLabel: 'शासक:', bodyLabel: 'शरीर:',
    strengths: 'शक्तियां', careerFields: 'करियर क्षेत्र', healthFocus: 'स्वास्थ्य केंद्र',
    luckyAttributes: 'आपके भाग्यशाली गुण', luckyColor: 'भाग्यशाली रंग',
    luckyNumbers: 'भाग्यशाली अंक', luckyDay: 'भाग्यशाली दिन', gemstone: 'रत्न',
    houseNumber: 'भाव', planetsInHouse: 'इस भाव में ग्रह',
    lifeArea: 'जीवन क्षेत्र', careerProfession: 'करियर और व्यवसाय',
    loveMarriage: 'प्रेम और विवाह', healthVitality: 'स्वास्थ्य और ऊर्जा',
    wealthProsperity: 'धन और समृद्धि', spiritualGrowth: 'आध्यात्मिक विकास',
    favorablePct: '% अनुकूल', recommendedRemedies: 'अनुशंसित उपाय',
    noTimeHouses: 'भाव विश्लेषण के लिए जन्म समय आवश्यक है। कृपया अपनी प्रोफ़ाइल में जन्म समय अपडेट करें।',
  },
  kundaliDetails: {
    generatePdf: 'पीडीएफ बनाएं', regeneratePdf: 'पीडीएफ पुनः बनाएं', download: 'डाउनलोड',
    pdfTitle: 'व्यक्तिगत कुंडली पीडीएफ', pdfDesc: 'अपनी संपूर्ण भविष्य भविष्यवाणी रिपोर्ट डाउनलोड करें।',
    pdfPreview: 'पीडीएफ पूर्वावलोकन', dashaTimeline: 'दशा समयरेखा',
    dashaCurrent: 'वर्तमान दशा काल', dashaNext: 'अगली दशा काल',
    yearlyTransitForecast: 'वार्षिक गोचर भविष्यवाणी', transitForecast: 'गोचर भविष्यवाणी',
    remedialMeasures: 'उपाय', yourMantras: 'आपके मंत्र',
    currentDasha: 'वर्तमान दशा', dashaEffect: 'दशा प्रभाव',
    transitEffect: 'गोचर प्रभाव', futurePrediction: 'भविष्य भविष्यवाणियां',
    futurePredictionDesc: 'ग्रह स्थिति के आधार पर आपका संपूर्ण जीवन पूर्वानुमान',
  },
  location: {
    autoDetect: 'स्थान स्वतः पता करें', detecting: 'स्थान पता लगाया जा रहा है…',
    locationDetected: 'स्थान पता चल गया', locationDenied: 'स्थान एक्सेस अस्वीकृत',
    useCurrentLocation: 'मेरा वर्तमान स्थान उपयोग करें', confirmLocation: 'स्थान की पुष्टि करें',
  },
};

// --- Marathi ---
const mr: TranslationTree = {
  app: { name: 'Astralis', tagline: 'एआय-संचालित ज्योतिष' },
  nav: {
    dashboard: 'डॅशबोर्ड', birthChart: 'जन्म पत्रिका', kundali: 'कुंडली',
    astrologer: 'एआय ज्योतिषी', profile: 'प्रोफाइल', pricing: 'किंमत निर्धारण',
  },
  auth: {
    welcomeBack: 'परत स्वागत आहे', signInContinue: 'तुमचा वैश्विक प्रवास सुरू ठेवण्यासाठी साइन इन करा',
    email: 'ईमेल', password: 'पासवर्ड', signIn: 'साइन इन', signingIn: 'साइन इन होत आहे…',
    beginJourney: 'तुमचा प्रवास सुरू करा', createAccountUnlock: 'विश्व अनलॉक करण्यासाठी खाते तयार करा',
    name: 'नाव', createAccount: 'खाते तयार करा', creatingAccount: 'खाते तयार होत आहे…',
    newPassword: 'नवीन पासवर्ड', atLeast6: 'किमान 6 अक्षरे',
    newToAstralis: 'Astralis वर नवीन आहात?', alreadyHaveAccount: 'आधीच खाते आहे?',
  },
  onboarding: {
    tellUsAboutYou: 'तुमच्याबद्दल सांगा', yourBirthDetails: 'तुमचे जन्म तपशील',
    yourIntentions: 'तुमचे हेतू', name: 'नाव', namePlaceholder: 'तुमचे नाव',
    gender: 'लिंग', language: 'भाषा', birthDate: 'जन्म तारीख', birthTime: 'जन्म वेळ',
    birthPlace: 'जन्म स्थान', birthPlacePlaceholder: 'शहराचे नाव प्रविष्ट करा',
    dontKnowTime: 'मला माझी अचूक वेळ माहीत नाही', relationshipStatus: 'नाते स्थिती',
    goals: 'ध्येये', interests: 'आवडी', continue: 'सुरू ठेवा', back: 'मागे',
    generateMyChart: 'माझी कुंडली बनवा', generating: 'बनत आहे…', generatingChart: 'तुमची जन्म पत्रिका बनत आहे…',
  },
  dashboard: {
    welcome: 'स्वागत', todaysHoroscope: 'आजचा राशिफल', moonPhase: 'चंद्र कला',
    todaysGuidance: 'आजचे मार्गदर्शन', viewBirthChart: 'जन्म पत्रिका पहा',
    explorePlanetary: 'तुमची ग्रह स्थिती पहा', askAstrologer: 'एआय ज्योतिषीला विचारा',
    getPersonalized: 'वैयक्तिक मार्गदर्शन मिळवा', personalizedKundali: 'वैयक्तिक कुंडली',
    deepAnalysis: 'तुमच्या वैश्विक आराखड्याचे सखोल विश्लेषण', luckyColor: 'भाग्यवान रंग',
    luckyNumber: 'भाग्यवान अंक', luckyTime: 'भाग्यवान वेळ', love: 'प्रेम', career: 'करियर',
  },
  chat: {
    welcome: 'स्वागत', askAnything: 'तुमच्या कुंडली, तुमच्या दिवस, किंवा ताऱ्यांच्या भविष्याबद्दल काहीही विचारा.',
    askStars: 'ताऱ्यांना विचारा…', clearChat: 'चॅट साफ करा', somethingWrong: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
  },
  birthChart: {
    title: 'तुमची जन्म पत्रिका', generate: 'माझी कुंडली बनवा', generating: 'बनत आहे…',
    notGenerated: 'तुमची जन्म पत्रिका अद्याप बनवलेली नाही.', planetaryPositions: 'ग्रहांची स्थिती',
    timeUnknownNote: 'तुमची जन्म वेळ दिली नव्हती, त्यामुळे घराची स्थिती आणि तुमचे लग्न दर्शवले नाही. सूर्य आणि चंद्र राशी अजूनही अचूक आहेत.',
    sun: 'सूर्य', moon: 'चंद्र', rising: 'लग्न', house: 'भाव',
  },
  kundali: {
    title: 'वैयक्तिक कुंडली', subtitle: 'तुमच्या वैश्विक आराखड्याचे सखोल विश्लेषण — शक्ती, आव्हाने, आणि जीवन मार्ग.',
    cosmicSignature: 'तुमची वैश्विक ओळख', lifeAspect: 'जीवन पैलू विश्लेषण',
    planetAnalysis: 'ग्रह-दर-ग्रह विश्लेषण', houseAnalysis: 'भाव विश्लेषण',
    proFeatures: 'प्रो वैशिष्ट्ये', unlockAll: 'सर्व प्रो वैशिष्ट्ये अनलॉक करा',
    careerPotential: 'करियर क्षमता', relationshipHarmony: 'नात्यात सामंजस्य',
    physicalEnergy: 'शारीरिक ऊर्जा', growthPotential: 'वाढ क्षमता',
    dashaPeriods: 'दशा काल', dashaDesc: 'तुमची विंशोत्तरी दशा टाइमलाइन अनलॉक करा आणि पहा कोणते ग्रह काळ सक्रिय आहेत आणि त्याचा तुमच्या जीवनासाठी काय अर्थ आहे.',
    yearlyTransits: 'वार्षिक गोचर', transitsDesc: 'पाहा की सध्याचे ग्रह गोचर पुढील १२ महिन्यांसाठी तुमच्या जन्म कुंडलीशी कसे संवाद साधतात.',
    compatibility: 'नात्यात सुसंगतता', compatDesc: 'तुमच्या जोडीदाराचे जन्म तपशील अपलोड करा आणि तुमची सिनास्ट्री कुंडली आणि सुसंगतता स्कोर पहा.',
    remedialMeasures: 'उपाय', remedialDesc: 'तुमच्या कुंडलीच्या कमकुवत बिंदूंवर आधारित वैयक्तिक रत्न, मंत्र, आणि विधी शिफारसी.',
    unlockPro: 'दशा काल, गोचर, सुसंगतता आणि बरेच काही', deepAnalysisBlue: 'तुमच्या वैश्विक आराखड्याचे सखोल विश्लेषण',
  },
  pricing: {
    title: 'तुमची योजना निवडा', subtitle: 'सखोल ज्योतिष अंतर्दृष्टी, वैयक्तिक कुंडली विश्लेषण, आणि प्रगत वैदिक ज्योतिष वैशिष्ट्ये अनलॉक करा.',
    monthly: 'मासिक', yearly: 'वार्षिक', save20: '२०% वाचवा', forever: 'कायमस्वरूपी', perMonth: '/महिना',
    perMonthBilledYearly: '/महिना, वार्षिक बिलिंग', perYear: '/वर्ष',
    currentPlan: 'सध्याची योजना', upgradePro: 'प्रो मध्ये अपग्रेड करा', goPremium: 'प्रीमियम निवडा',
    mostPopular: 'सर्वात लोकप्रिय', free: 'मोफत', pro: 'प्रो', premium: 'प्रीमियम',
    freeDesc: 'आधारभूत ज्योतिष साधनांसह तुमचा वैश्विक प्रवास सुरू करा.',
    proDesc: 'तुमची संपूर्ण वैयक्तिक कुंडली आणि सखोल विश्लेषण अनलॉक करा.',
    premiumDesc: 'प्रगत वैदिक वैशिष्ट्यांसह संपूर्ण ज्योतिष सूट.',
    whatYouGet: 'प्रो सह तुम्हाला काय मिळते',
    personalizedKundali: 'वैयक्तिक कुंडली', unlimitedAI: 'अमर्याद एआय मार्गदर्शन',
    yearlyTransits: 'वार्षिक गोचर', dashaPeriods: 'दशा काल (प्रीमियम)',
    back: 'मागे',
  },
  profile: {
    title: 'प्रोफाइल', astrologicalProfile: 'ज्योतिषीय प्रोफाइल', viewChart: 'कुंडली पहा',
    birthDate: 'जन्म तारीख', birthTime: 'जन्म वेळ', birthPlace: 'जन्म स्थान', language: 'भाषा',
    unknown: 'अज्ञात', goals: 'ध्येये', interests: 'आवडी',
    subscription: 'सदस्यता', freePlan: 'मोफत योजना · अधिक वैशिष्ट्यांसाठी अपग्रेड करा',
    memberSince: 'सदस्य पासून',
  },
  common: { retry: 'पुन्हा प्रयत्न', signOut: 'साइन आउट', upgrade: 'अपग्रेड', back: 'मागे' },
  suggestions: {
    prompt1: 'आज माझ्यासाठी काय आहे?', prompt2: 'करियर मार्गदर्शन',
    prompt3: 'नात्याचा सल्ला', prompt4: 'माझ्या चंद्र राशीचा अर्थ काय?',
  },
  goals: {
    'Self-discovery': 'स्व-शोध', 'Love & relationships': 'प्रेम आणि नाती',
    'Career guidance': 'करियर मार्गदर्शन', 'Spiritual growth': 'आध्यात्मिक वाढ',
    'Emotional healing': 'भावनिक उपचार', 'Life purpose': 'जीवन उद्देश',
    'Financial success': 'आर्थिक यश', 'Creativity': 'सर्जनशीलता',
    'Better decisions': 'चांगले निर्णय',
  },
  interests: {
    'Zodiac signs': 'राशी चिन्ह', 'Daily horoscopes': 'दैनिक राशिफल',
    'Birth charts': 'जन्म पत्रिका', 'Moon phases': 'चंद्र कला',
    'Crystals': 'क्रिस्टल', 'Meditation': 'ध्यान', 'Tarot': 'टॅरो',
    'Numerology': 'अंक ज्योतिष', 'Dreams': 'स्वप्न', 'Energy healing': 'ऊर्जा उपचार',
  },
  genders: { female: 'स्त्री', male: 'पुरुष', 'non-binary': 'गैर-बायनरी', 'prefer-not': 'सांगू इच्छित नाही' },
  relationships: {
    single: 'अविवाहित', 'in-relationship': 'नात्यात', married: 'विवाहित',
    complicated: 'हे गुंतागुंतीचे आहे', 'prefer-not': 'सांगू इच्छित नाही',
  },
  zodiac: {
    Aries: 'मेष', Taurus: 'वृषभ', Gemini: 'मिथुन', Cancer: 'कर्क',
    Leo: 'सिंह', Virgo: 'कन्या', Libra: 'तुला', Scorpio: 'वृश्चिक',
    Sagittarius: 'धनु', Capricorn: 'मकर', Aquarius: 'कुंभ', Pisces: 'मीन',
  },
  planets: { Sun: 'सूर्य', Moon: 'चंद्र', Mercury: 'बुध', Venus: 'शुक्र', Mars: 'मंगळ', Jupiter: 'गुरू', Saturn: 'शनि' },
  horoscope: { general: 'सामान्य', love: 'प्रेम', career: 'करियर', health: 'आरोग्य', guidance: 'मार्गदर्शन' },
  ai: {
    greeting: 'सामायिक करण्याबद्दल धन्यवाद. तुमची कुंडली पाहता',
    careerIntro: 'ज्योतिषामध्ये, दहावा भाव करियरचे नियंत्रण करतो. तुमची कुंडली तुमच्या व्यावसायिक मार्गाबद्दल काय सांगते ते पाहूया:',
    loveIntro: 'ज्योतिषामध्ये, सातवा भाव भागीदारीचे नियंत्रण करतो. तुमची कुंडली प्रेमाबद्दल काय सांगते ते पाहूया:',
    moonIntro: 'तुमची चंद्र रास तुमची भावनिक स्वभाव दर्शवते — ती खाजगी स्व जी फक्त तुमच्या जवळच्या लोकांना दिसते.',
    sunIntro: 'तुमची सूर्य रास तुमची मूळ ओळख आहे — तुमच्या जीवनाची नायक यात्रा.',
    risingIntro: 'तुमचे लग्न ही रास आहे जी तुमच्या जन्माच्या क्षणी पूर्व क्षितिजावर उगवत होती.',
    purposeIntro: 'तुमची जन्म कुंडली या जीवनासाठी तुमच्या आत्म्याच्या हेतूचा नकाशा आहे. मुख्य संकेत पाहूया:',
    forecastIntro: 'आजचे तुमचे वैश्विक हवामान:',
    chartIntro: 'तुमच्या जन्म कुंडलीचे आढावा:',
    generalIntro: 'तुम्हाला विशेषतः काय जाणून घ्यायचे आहे? मी तुमच्या करियर मार्ग, नात्यां, भावनिक नमुने, जीवन उद्देश, किंवा सध्याचे वैश्विक हवामान याबद्दल बोलू शकतो.',
    healthIntro: 'ज्योतिषामध्ये, सहावा भाव आरोग्य आणि दैनिक दिनचर्येचे नियंत्रण करतो.',
    familyIntro: 'कुटुंबाची गतिशीलता तुमच्या कुंडलीत चंद्र (माता/आंतरिक बाल), शनि (पिता/अधिकार), आणि चौथा भाव (घर आणि मूळ) द्वारे दिसते:',
    socialIntro: 'मैत्री आणि समुदाय तुमच्या ११व्या भावातून दिसतात, तसेच शुक्र (तुम्ही इतरांमध्ये काय मूल्य देता) आणि गुरू (तुम्ही कनेक्शनद्वारे विस्तार कुठे शोधता):',
    askMore: 'तुम्हाला विशेषतः काय जाणून घ्यायचे आहे?',
  },
  marriage: {
    title: 'विवाह मिलाप', subtitle: 'चंद्र रास आणि नक्षत्रावर आधारित वैदिक अष्ट कूट (8-गुण) सुसंगतता विश्लेषण.',
    groom: 'वर', bride: 'वधू', groomsDetails: 'वराचा तपशील', bridesDetails: 'वधूचा तपशील',
    fullName: 'पूर्ण नाव', dateOfBirth: 'जन्म तारीख', timeOfBirth: 'जन्म वेळ',
    birthPlace: 'जन्म स्थान', timeUnknown: 'जन्म वेळ अज्ञात',
    calculate: 'सुसंगतता गणना करा', calculating: 'मिलाप गणना होत आहे…',
    enterBothDates: 'सुसंगतता गणना करण्यासाठी दोघांच्या जन्म तारखा टाका.',
    score: 'गुण', compatible: 'सुसंगत', verdict: 'निर्णय',
    excellentMatch: 'उत्कृष्ट मिलाप', veryGoodMatch: 'खूप चांगला मिलाप',
    goodMatch: 'चांगला मिलाप', averageMatch: 'सरासरी मिलाप', challengingMatch: 'आव्हानात्मक मिलाप',
    ashtaKoota: 'अष्ट कूट विश्लेषण (8-गुण विश्लेषण)',
    ashtaKootaDesc: 'अष्ट कूट प्रणाली आठ आयामांमध्ये सुसंगतता मोजते, एकूण 36 गुण (गुण मिलान). 18+ गुण विवाहासाठी स्वीकार्य मानले जातात.',
    recommendations: 'शिफारसी आणि उपाय', checkAnother: 'दुसरा मिलाप तपासा',
    groomNakshatra: 'वराचे नक्षत्र', brideNakshatra: 'वधूचे नक्षत्र',
    varna: 'वर्ण', vashya: 'वश्य', tara: 'तारा', yoni: 'योनि',
    grahaMaitri: 'ग्रह मैत्री', gana: 'गण', bhakoot: 'भकूट', nadi: 'नाडी',
    points: 'गुण', groomValue: 'वर', brideValue: 'वधू',
    favorable: 'अनुकूल', notFavorable: 'लक्ष देणे आवश्यक',
  },
  birthChartDetails: {
    cosmicSignature: 'तुमची वैश्विक ओळख',
    nakshatra: 'तुमचे नक्षत्र (चंद्र वंश)', nakshatraLunar: 'नक्षत्र',
    rulingPlanet: 'शासक ग्रह', deity: 'देवता', symbol: 'प्रतीक', quality: 'गुण', range: 'श्रेणी',
    planetAnalysis: 'ग्रह विश्लेषण', planetAnalysisDesc: 'तुमच्या कुंडलीतील प्रत्येक ग्रह तुमच्या व्यक्तिमत्वाचा आणि जीवनाचा वेगवेगळा घटक दर्शवतो. सविस्तर विश्लेषणासाठी कोणत्याही कार्डवर क्लिक करा.',
    houseAnalysis: 'भाव विश्लेषण', houseAnalysisDesc: 'बारा भाव तुमच्या जीवनाच्या वेगवेगळ्या क्षेत्रांचे प्रतिनिधित्व करतात.',
    lifePredictions: 'जीवन भविष्यवाण्या', lifePredictionsDesc: 'तुमच्या ग्रह स्थितीवर आधारित, जीवनाच्या प्रमुख क्षेत्रांसाठी भविष्यवाण्या आणि उपाय.',
    summary: 'सारांश', personality: 'व्यक्तिमत्व', challenges: 'आव्हाने',
    remedy: 'उपाय', mantra: 'मंत्र', vedicDetails: 'वैदिक तपशील',
    deityLabel: 'देवता:', dayLabel: 'दिवस:', gemstoneLabel: 'रत्न:', colorLabel: 'रंग:',
    numberLabel: 'अंक:', directionLabel: 'दिशा:', elementLabel: 'तत्व:',
    qualityLabel: 'गुण:', rulerLabel: 'शासक:', bodyLabel: 'शरीर:',
    strengths: 'शक्ती', careerFields: 'करियर क्षेत्र', healthFocus: 'आरोग्य केंद्र',
    luckyAttributes: 'तुमचे भाग्यवान गुण', luckyColor: 'भाग्यवान रंग',
    luckyNumbers: 'भाग्यवान अंक', luckyDay: 'भाग्यवान दिवस', gemstone: 'रत्न',
    houseNumber: 'भाव', planetsInHouse: 'या भावातील ग्रह',
    lifeArea: 'जीवन क्षेत्र', careerProfession: 'करियर आणि व्यवसाय',
    loveMarriage: 'प्रेम आणि विवाह', healthVitality: 'आरोग्य आणि ऊर्जा',
    wealthProsperity: 'धन आणि समृद्धी', spiritualGrowth: 'आध्यात्मिक वाढ',
    favorablePct: '% अनुकूल', recommendedRemedies: 'शिफारस केलेले उपाय',
    noTimeHouses: 'भाव विश्लेषणासाठी जन्म वेळ आवश्यक आहे. कृपया तुमची प्रोफाइल अपडेट करा.',
  },
  kundaliDetails: {
    generatePdf: 'पीडीएफ बनवा', regeneratePdf: 'पीडीएफ पुन्हा बनवा', download: 'डाउनलोड',
    pdfTitle: 'वैयक्तिक कुंडली पीडीएफ', pdfDesc: 'तुमची संपूर्ण भविष्य भविष्यवाणी रिपोर्ट डाउनलोड करा.',
    pdfPreview: 'पीडीएफ पूर्वावलोकन', dashaTimeline: 'दशा टाइमलाइन',
    dashaCurrent: 'सध्याची दशा काल', dashaNext: 'पुढील दशा काल',
    yearlyTransitForecast: 'वार्षिक गोचर भविष्यवाणी', transitForecast: 'गोचर भविष्यवाणी',
    remedialMeasures: 'उपाय', yourMantras: 'तुमचे मंत्र',
    currentDasha: 'सध्याची दशा', dashaEffect: 'दशा परिणाम',
    transitEffect: 'गोचर परिणाम', futurePrediction: 'भविष्य भविष्यवाण्या',
    futurePredictionDesc: 'ग्रह स्थितीवर आधारित तुमचे संपूर्ण जीवन अंदाज',
  },
  location: {
    autoDetect: 'स्थान आपोआप शोधा', detecting: 'स्थान शोधत आहे…',
    locationDetected: 'स्थान सापडले', locationDenied: 'स्थान प्रवेश नकार',
    useCurrentLocation: 'माझे सध्याचे स्थान वापरा', confirmLocation: 'स्थान पुष्टी करा',
  },
};

// --- Tamil ---
const ta: TranslationTree = {
  app: { name: 'Astralis', tagline: 'AI-இயக்கப்படும் ஜோதிடம்' },
  nav: {
    dashboard: 'டாஷ்போர்டு', birthChart: 'பிறப்பு விளக்கப்படம்', kundali: 'குண்டலி',
    astrologer: 'AI ஜோதிடர்', profile: 'சுயவிவரம்', pricing: 'விலை நிர்ணயம்',
  },
  auth: {
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்', signInContinue: 'உங்கள் அண்டவ் பயணத்தைத் தொடர உள்நுழையவும்',
    email: 'மின்னஞ்சல்', password: '�டவுச்சொல்', signIn: 'உள்நுழை', signingIn: 'உள்நுழைகிறது…',
    beginJourney: 'உங்கள் பயணத்தைத் தொடங்குங்கள்', createAccountUnlock: 'அண்டத்தைத் திறக்க கணக்கை உருவாக்கவும்',
    name: 'பெயர்', createAccount: 'கணக்கை உருவாக்கு', creatingAccount: 'கணக்கு உருவாக்கப்படுகிறது…',
    newPassword: 'புதிய கடவுச்சொல்', atLeast6: 'குறைந்தது 6 எழுத்துகள்',
    newToAstralis: 'Astralis-க்கு புதியவரா?', alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
  },
  onboarding: {
    tellUsAboutYou: 'உங்களைப் பற்றி சொல்லுங்கள்', yourBirthDetails: 'உங்கள் பிறப்பு விவரங்கள்',
    yourIntentions: 'உங்கள் நோக்கங்கள்', name: 'பெயர்', namePlaceholder: 'உங்கள் பெயர்',
    gender: 'பாலினம்', language: 'மொழி', birthDate: 'பிறந்த தேதி', birthTime: 'பிறந்த நேரம்',
    birthPlace: 'பிறந்த இடம்', birthPlacePlaceholder: 'நகரப் பெயரை உள்ளிடவும்',
    dontKnowTime: 'எனக்கு என் சரியான நேரம் தெரியவில்லை', relationshipStatus: 'உறவு நிலை',
    goals: 'இலக்குகள்', interests: 'ஆர்வங்கள்', continue: 'தொடரவும்', back: 'பின்செல்',
    generateMyChart: 'என் விளக்கப்படத்தை உருவாக்கு', generating: 'உருவாக்குகிறது…', generatingChart: 'உங்கள் பிறப்பு விளக்கப்படம் உருவாக்கப்படுகிறது…',
  },
  dashboard: {
    welcome: 'வரவேற்கிறோம்', todaysHoroscope: 'இன்றைய ராசிபலன்', moonPhase: 'சந்திர கலை',
    todaysGuidance: 'இன்றைய வழிகாட்டுதல்', viewBirthChart: 'பிறப்பு விளக்கப்படம் பார்',
    explorePlanetary: 'உங்கள் கிரக நிலைகளை ஆராயுங்கள்', askAstrologer: 'AI ஜோதிடரிடம் கேளுங்கள்',
    getPersonalized: 'தனிப்பயன் வழிகாட்டுதல் பெறுங்கள்', personalizedKundali: 'தனிப்பயன் குண்டலி',
    deepAnalysis: 'உங்கள் அண்டவ் வரைபடத்தின் ஆழமான பகுப்பாய்வு', luckyColor: 'அதிர்ஷ்ட நிறம்',
    luckyNumber: 'அதிர்ஷ்ட எண்', luckyTime: 'அதிர்ஷ்ட நேரம்', love: 'காதல்', career: 'தொழில்',
  },
  chat: {
    welcome: 'வரவேற்கிறோம்', askAnything: 'உங்கள் விளக்கப்படம், உங்கள் நாள், அல்லது நட்சத்திரங்கள் எதைப் பற்றியும் என்னைக் கேளுங்கள்.',
    askStars: 'நட்சத்திரங்களிடம் கேளுங்கள்…', clearChat: 'அரட்டையை அழி', somethingWrong: 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',
  },
  birthChart: {
    title: 'உங்கள் பிறப்பு விளக்கப்படம்', generate: 'என் விளக்கப்படத்தை உருவாக்கு', generating: 'உருவாக்குகிறது…',
    notGenerated: 'உங்கள் பிறப்பு விளக்கப்படம் இன்னும் உருவாக்கப்படவில்லை.', planetaryPositions: 'கிரக நிலைகள்',
    timeUnknownNote: 'உங்கள் பிறந்த நேரம் வழங்கப்படவில்லை, எனவே வீட்டு நிலைகள் மற்றும் உங்கள் லக்னம் காட்டப்படவில்லை. சூரிய மற்றும் சந்திர ராசிகள் இன்னும் துல்லியமாக உள்ளன.',
    sun: 'சூரியன்', moon: 'சந்திரன்', rising: 'லக்னம்', house: 'வீடு',
  },
  kundali: {
    title: 'தனிப்பயன் குண்டலி', subtitle: 'உங்கள் அண்டவ் வரைபடத்தின் ஆழமான பகுப்பாய்வு — பலங்கள், சவால்கள், மற்றும் வாழ்க்கைப் பாதை.',
    cosmicSignature: 'உங்கள் அண்டவ் அடையாளம்', lifeAspect: 'வாழ்க்கை அம்ச பகுப்பாய்வு',
    planetAnalysis: 'கிரக-வாரி பகுப்பாய்வு', houseAnalysis: 'வீட்டு பகுப்பாய்வு',
    proFeatures: 'ப்ரோ அம்சங்கள்', unlockAll: 'அனைத்து ப்ரோ அம்சங்களையும் திறக்கவும்',
    careerPotential: 'தொழில் திறன்', relationshipHarmony: 'உறவு இசகுநிலை',
    physicalEnergy: 'உடல் ஆற்றல்', growthPotential: 'வளர்சி திறன்',
    dashaPeriods: 'தசை காலங்கள்', dashaDesc: 'உங்கள் விம்சோத்தரி தசை காலக்கெடுவைத் திறந்து, எந்த கிரக காலங்கள் செயலில் உள்ளன மற்றும் அவை உங்கள் வாழ்க்கைக்கு என்ன அர்த்தம் தருகின்றன என்பதைப் பார்க்கவும்.',
    yearlyTransits: 'வருடாந்திர கோச்சாரங்கள்', transitsDesc: 'தற்போதைய கிரக கோச்சாரங்கள் அடுத்த 12 மாதங்களுக்கு உங்கள் பிறப்பு விளக்கப்படத்துடன் எப்படி தொடர்பு கொள்கின்றன என்பதைப் பார்க்கவும்.',
    compatibility: 'உறவு இணக்கம்', compatDesc: 'உங்கள் துணையின் பிறப்பு விவரங்களைப் பதிவேற்றவும், உங்கள் சினாஸ்ட்ரி விளக்கப்படம் மற்றும் இணக்க மதிப்பெண்களைப் பார்க்கவும்.',
    remedialMeasures: 'தீர்வு நடவடிக்கைகள்', remedialDesc: 'உங்கள் விளக்கப்படத்தின் பலவீனமான புள்ளிகளின் அடிப்படையில் தனிப்பயன் ரத்தின, மந்திர, மற்றும் சடங்கு பரிந்துரைகள்.',
    unlockPro: 'தசை காலங்கள், கோச்சாரங்கள், இணக்கம் மற்றும் மேலும்', deepAnalysisBlue: 'உங்கள் அண்டவ் வரைபடத்தின் ஆழமான பகுப்பாய்வு',
  },
  pricing: {
    title: 'உங்கள் திட்டத்தைத் தேர்வு செய்யவும்', subtitle: 'ஆழமான ஜோதிட நுண்ணறிவு, தனிப்பயன் குண்டலி பகுப்பாய்வு, மற்றும் மேம்பட்ட வேத ஜோதிட அம்சங்களைத் திறக்கவும்.',
    monthly: 'மாதாந்திர', yearly: 'வருடாந்திர', save20: '20% சேமிக்கவும்', forever: 'என்றென்றுக்கும்', perMonth: '/மாதம்',
    perMonthBilledYearly: '/மாதம், வருடாந்திர பில்லிங்', perYear: '/வருடம்',
    currentPlan: 'தற்போதைய திட்டம்', upgradePro: 'ப்ரோவிற்கு மேம்படுத்தவும்', goPremium: 'ப்ரீமியம் தேர்வு',
    mostPopular: 'மிகவும் பிரபலமானது', free: 'இலவசம்', pro: 'ப்ரோ', premium: 'ப்ரீமியம்',
    freeDesc: 'அத்தியாவசிய ஜோதிட கருவிகளுடன் உங்கள் அண்டவ் பயணத்தைத் தொடங்கவும்.',
    proDesc: 'உங்கள் முழு தனிப்பயன் குண்டலி மற்றும் ஆழமான பகுப்பாய்வைத் திறக்கவும்.',
    premiumDesc: 'மேம்பட்ட வேத அம்சங்களுடன் முழுமையான ஜோதிட தொகுப்பு.',
    whatYouGet: 'ப்ரோவுடன் நீங்கள் என்ன பெறுகிறீர்கள்',
    personalizedKundali: 'தனிப்பயன் குண்டலி', unlimitedAI: 'வரம்பற்ற AI வழிகாட்டுதல்',
    yearlyTransits: 'வருடாந்திர கோச்சாரங்கள்', dashaPeriods: 'தசை காலங்கள் (ப்ரீமியம்)',
    back: 'பின்செல்',
  },
  profile: {
    title: 'சுயவிவரம்', astrologicalProfile: 'ஜோதிட சுயவிவரம்', viewChart: 'விளக்கப்படம் பார்',
    birthDate: 'பிறந்த தேதி', birthTime: 'பிறந்த நேரம்', birthPlace: 'பிறந்த இடம்', language: 'மொழி',
    unknown: 'தெரியவில்லை', goals: 'இலக்குகள்', interests: 'ஆர்வங்கள்',
    subscription: 'சந்தா', freePlan: 'இலவச திட்டம் · மேலும் அம்சங்களுக்கு மேம்படுத்தவும்',
    memberSince: 'உறுப்பினராக இருந்து',
  },
  common: { retry: 'மீண்டும் முயற்சி', signOut: 'வெளியேறு', upgrade: 'மேம்படுத்து', back: 'பின்செல்' },
  suggestions: {
    prompt1: 'இன்று எனக்காக என்ன உள்ளது?', prompt2: 'தொழில் வழிகாட்டுதல்',
    prompt3: 'உறவு ஆலோசனை', prompt4: 'என் சந்திர ராசி என்ன பொருள்?',
  },
  goals: {
    'Self-discovery': 'சுய-கண்டுபிடிப்பு', 'Love & relationships': 'காதல் மற்றும் உறவுகள்',
    'Career guidance': 'தொழில் வழிகாட்டுதல்', 'Spiritual growth': 'ஆன்மீக வளர்ச்சி',
    'Emotional healing': 'உணர்ச்சி குணம்', 'Life purpose': 'வாழ்க்கை நோக்கம்',
    'Financial success': 'நிதி வெற்றி', 'Creativity': 'படைப்பாற்றல்',
    'Better decisions': 'சிறந்த முடிவுகள்',
  },
  interests: {
    'Zodiac signs': 'ராசி அடையாளங்கள்', 'Daily horoscopes': 'தினசரி ராசிபலன்கள்',
    'Birth charts': 'பிறப்பு விளக்கப்படங்கள்', 'Moon phases': 'சந்திர கலைகள்',
    'Crystals': 'படிகங்கள்', 'Meditation': 'தியானம்', 'Tarot': 'டாரோட்',
    'Numerology': 'எண் ஜோதிடம்', 'Dreams': 'கனவுகள்', 'Energy healing': 'ஆற்றல் குணம்',
  },
  genders: { female: 'பெண்', male: 'ஆண்', 'non-binary': 'அல்லாத-பைனரி', 'prefer-not': 'சொல்ல விரும்பவில்லை' },
  relationships: {
    single: 'திருமணமாகாத', 'in-relationship': 'உறவில்', married: 'திருமணமான',
    complicated: 'இது சிக்கலானது', 'prefer-not': 'சொல்ல விரும்பவில்லை',
  },
  zodiac: {
    Aries: 'மேஷம்', Taurus: 'ரிஷபம்', Gemini: 'மிதுனம்', Cancer: 'கடகம்',
    Leo: 'சிம்மம்', Virgo: 'கன்னி', Libra: 'துலாம்', Scorpio: 'விருச்சிகம்',
    Sagittarius: 'தனுசு', Capricorn: 'மகரம்', Aquarius: 'கும்பம்', Pisces: 'மீனம்',
  },
  planets: { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mercury: 'புதன்', Venus: 'சுக்கிரன்', Mars: 'செவ்வாய்', Jupiter: 'குரு', Saturn: 'சனி' },
  horoscope: { general: 'பொது', love: 'காதல்', career: 'தொழில்', health: 'ஆரோக்கியம்', guidance: 'வழிகாட்டுதல்' },
  ai: {
    greeting: 'பகிர்வதற்கு நன்றி. உங்கள் விளக்கப்படத்தைப் பார்த்து',
    careerIntro: 'ஜோதிடத்தில், பத்தாவது வீடு தொழிலை நிர்வகிக்கிறது. உங்கள் விளக்கப்படம் உங்கள் தொழில் பாதையைப் பற்றி என்ன சொல்கிறது என்பதைப் பார்ப்போம்:',
    loveIntro: 'ஜோதிடத்தில், ஏழாவது வீடு கூட்டாளியை நிர்வகிக்கிறது. உங்கள் விளக்கப்படம் காதலைப் பற்றி என்ன சொல்கிறது என்பதைப் பார்ப்போம்:',
    moonIntro: 'உங்கள் சந்திர ராசி உங்கள் உணர்ச்சி இயல்பை வெளிப்படுத்துகிறது — உங்களுக்கு மிக நெருக்கமானவர்கள் மட்டுமே காணும் தனிப்பட்ட சுயம்.',
    sunIntro: 'உங்கள் சூரிய ராசி உங்கள் மைய அடையாளம் — உங்கள் வாழ்க்கையின் நாயகன் பயணம்.',
    risingIntro: 'உங்கள் லக்னம் என்பது உங்கள் பிறப்பின் தருணத்தில் கிழக்கு அடிவானத்தில் உதயமாகும் ராசி.',
    purposeIntro: 'உங்கள் பிறப்பு விளக்கப்படம் இந்த வாழ்க்கைக்கான உங்கள் ஆன்மாவின் நோக்கத்தின் வரைபடம். முக்கிய குறிப்புகளைப் பார்ப்போம்:',
    forecastIntro: 'இன்று உங்களுக்கான அண்டவ் வானிலை:',
    chartIntro: 'உங்கள் பிறப்பு விளக்கப்படத்தின் மேற்பார்வை:',
    generalIntro: 'நீங்கள் குறிப்பாக என்ன அறிய விரும்புகிறீர்கள்? நான் உங்கள் தொழில் பாதை, உறவுகள், உணர்ச்சி வடிவங்கள், வாழ்க்கை நோக்கம், அல்லது தற்போதைய அண்டவ் வானிலை பற்றி பேச முடியும்.',
    healthIntro: 'ஜோதிடத்தில், ஆறாவது வீடு ஆரோக்கியம் மற்றும் தினசரி அட்டவணையை நிர்வகிக்கிறது.',
    familyIntro: 'குடும்ப இயக்கவியல் உங்கள் விளக்கப்படத்தில் சந்திரன் (தாய்/உள் குழந்தை), சனி (தந்தை/அதிகாரம்), மற்றும் நான்காவது வீடு (வீடு மற்றும் வேர்கள்) மூலம் தெரிகிறது:',
    socialIntro: 'நட்பு மற்றும் சமூகம் உங்கள் 11வது வீடு மூலம் பார்க்கப்படுகிறது, சுக்கிரன் (நீங்கள் மற்றவர்களில் எதை மதிக்கிறீர்கள்) மற்றும் குரு (இணைப்பு மூலம் நீங்கள் எங்கு விரிவாக்கம் காண்கிறீர்கள்):',
    askMore: 'நீங்கள் குறிப்பாக என்ன அறிய விரும்புகிறீர்கள்?',
  },
  marriage: {
    title: 'திருமணப் பொருத்தம்', subtitle: 'சந்திர ராசி மற்றும் நட்சத்திர அடிப்படையில் வேத அஷ்ட கூட (8-மடங்கு) இணக்க பகுப்பாய்வு.',
    groom: 'மாப்பிள்ளை', bride: '�ெண்', groomsDetails: 'மாப்பிள்ளை விவரம்', bridesDetails: 'பெண் விவரம்',
    fullName: 'முழுப் பெயர்', dateOfBirth: 'பிறந்த தேதி', timeOfBirth: 'பிறந்த நேரம்',
    birthPlace: 'பிறந்த இடம்', timeUnknown: 'பிறந்த நேரம் தெரியவில்லை',
    calculate: 'இணக்கம் கணக்கிடு', calculating: 'பொருத்தம் கணக்கிடப்படுகிறது…',
    enterBothDates: 'இணக்கம் கணக்கிட இருவரின் பிறந்த தேதியையும் உள்ளிடவும்.',
    score: 'மதிப்பெண்', compatible: 'இணக்கம்', verdict: 'தீர்பு',
    excellentMatch: 'சிறந்த பொருத்தம்', veryGoodMatch: 'மிக நல்ல பொருத்தம்',
    goodMatch: 'நல்ல பொருத்தம்', averageMatch: 'சராசரி பொருத்தம்', challengingMatch: 'சவாலான பொருத்தம்',
    ashtaKoota: 'அஷ்ட கூட பகுப்பாய்வு (8-மடங்கு பகுப்பாய்வு)',
    ashtaKootaDesc: 'அஷ்ட கூட அமைப்பு எட்டு அளவுகோல்களில் இணக்கத்தை மதிப்பிடுகிறது, மொத்தம் 36 புள்ளிகள் (குண மிலாப்). 18+ புள்ளிகள் திருமணத்திற்கு ஏற்றது.',
    recommendations: 'பரிந்துரைகள் மற்றும் தீர்வுகள்', checkAnother: 'மற்றொரு பொருத்தத்தை சரிபார்க்கவும்',
    groomNakshatra: 'மாப்பிள்ளை நட்சத்திரம்', brideNakshatra: 'பெண் நட்சத்திரம்',
    varna: 'வர்ணா', vashya: 'வஷ்யா', tara: 'தாரா', yoni: 'யோனி',
    grahaMaitri: 'கிரக மைத்திரி', gana: 'கணா', bhakoot: 'பகூட்', nadi: 'நாடி',
    points: 'புள்ளிகள்', groomValue: 'மாப்பிள்ளை', brideValue: 'பெண்',
    favorable: 'சாதகமான', notFavorable: 'கவனம் தேவை',
  },
  birthChartDetails: {
    cosmicSignature: 'உங்கள் அண்டவ் அடையாளம்',
    nakshatra: 'உங்கள் நட்சத்திரம் (சந்திர வம்சம்)', nakshatraLunar: 'நட்சத்திரம்',
    rulingPlanet: 'ஆளும் கிரகம்', deity: 'தேவதை', symbol: 'சின்னம்', quality: 'தரம்', range: 'வரம்பு',
    planetAnalysis: 'கிரக பகுப்பாய்வு', planetAnalysisDesc: 'உங்கள் விளக்கப்படத்தின் ஒவ்வொரு கிரகமும் உங்கள் ஆளுமையின் வெவ்வேறு அம்சத்தை குறிக்கிறது. விரிவான விளக்கத்திற்கு எந்த அட்டையையும் கிளிக் செய்யவும்.',
    houseAnalysis: 'வீட்டு பகுப்பாய்வு', houseAnalysisDesc: 'பன்னிரண்டு வீடுகள் உங்கள் வாழ்க்கையின் வெவ்வேறு பகுதிகளை குறிக்கின்றன.',
    lifePredictions: 'வாழ்க்கை கணிப்புகள்', lifePredictionsDesc: 'உங்கள் கிரக நிலைகளின் அடிப்படையில், முக்கிய வாழ்க்கை பகுதிகளுக்கான கணிப்புகள் மற்றும் தீர்வுகள்.',
    summary: 'சுருக்கம்', personality: 'ஆளுமை', challenges: 'சவால்கள்',
    remedy: 'தீர்வு', mantra: 'மந்திரம்', vedicDetails: 'வேத விவரம்',
    deityLabel: 'தேவதை:', dayLabel: 'நாள்:', gemstoneLabel: 'ரத்தினம்:', colorLabel: 'நிறம்:',
    numberLabel: 'எண்:', directionLabel: 'திசை:', elementLabel: 'பூதம்:',
    qualityLabel: 'தரம்:', rulerLabel: 'ஆளும்:', bodyLabel: 'உடல்:',
    strengths: 'பலங்கள்', careerFields: 'தொழில் துறைகள்', healthFocus: 'ஆரோக்கிய மையம்',
    luckyAttributes: 'உங்கள் அதிர்ஷ்ட குணங்கள்', luckyColor: 'அதிர்ஷ்ட நிறம்',
    luckyNumbers: 'அதிர்ஷ்ட எண்கள்', luckyDay: 'அதிர்ஷ்ட நாள்', gemstone: 'ரத்தினம்',
    houseNumber: 'வீடு', planetsInHouse: 'இந்த வீட்டில் கிரகங்கள்',
    lifeArea: 'வாழ்க்கை பகுதி', careerProfession: 'தொழில் மற்றும் தொழில்',
    loveMarriage: 'காதல் மற்றும் திருமணம்', healthVitality: 'ஆரோக்கியம் மற்றும் ஆற்றல்',
    wealthProsperity: 'செல்வம் மற்றும் வளம்', spiritualGrowth: 'ஆன்மீக வளர்ச்சி',
    favorablePct: '% சாதகமான', recommendedRemedies: 'பரிந்துரைக்கப்பட்ட தீர்வுகள்',
    noTimeHouses: 'வீட்டு பகுப்பாய்வுக்கு பிறந்த நேரம் தேவை. உங்கள் சுயவிவரத்தை புதுப்பிக்கவும்.',
  },
  kundaliDetails: {
    generatePdf: 'PDF உருவாக்கு', regeneratePdf: 'PDF மீண்டும் உருவாக்கு', download: 'பதிவிறக்கம்',
    pdfTitle: 'தனிப்பயன் குண்டலி PDF', pdfDesc: 'உங்கள் முழு எதிர்கால கணிப்பு அறிக்கையை பதிவிறக்கவும்.',
    pdfPreview: 'PDF முன்னோட்டம்', dashaTimeline: 'தசை டைம்லைன்',
    dashaCurrent: 'தற்போதைய தசை காலம்', dashaNext: 'அடுத்த தசை காலம்',
    yearlyTransitForecast: 'வருடாந்திர கோச்சார கணிப்பு', transitForecast: 'கோச்சார கணிப்பு',
    remedialMeasures: 'தீர்வு நடவடிக்கைகள்', yourMantras: 'உங்கள் மந்திரங்கள்',
    currentDasha: 'தற்போதைய தசை', dashaEffect: 'தசை விளைவு',
    transitEffect: 'கோச்சார விளைவு', futurePrediction: 'எதிர்கால கணிப்புகள்',
    futurePredictionDesc: 'கிரக நிலை அடிப்படையில் உங்கள் முழு வாழ்க்கை கணிப்பு',
  },
  location: {
    autoDetect: 'இடத்தை தானாகக் கண்டறி', detecting: 'இடத்தை கண்டறியப்படுகிறது…',
    locationDetected: 'இடம் கண்டறியப்பட்டது', locationDenied: 'இட அணுகல் மறுக்கப்பட்டது',
    useCurrentLocation: 'எனது தற்போதைய இடத்தைப் பயன்படுத்து', confirmLocation: 'இடத்தை உறுதிப்படுத்து',
  },
};

export const translations: Record<Language, TranslationTree> = { en, hi, mr, ta };
