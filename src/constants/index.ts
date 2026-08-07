// constants/ — app-wide static values: navigation config, branding, feature flags.

export const APP_NAME = 'Astralis';
export const APP_TAGLINE = 'AI-Powered Astrology';

export type NavItem = {
  label: string;
  to: string;
  icon: string;
  disabled?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'Sparkles' },
  { label: 'Birth Chart', to: '/birth-chart', icon: 'CircleDot' },
  { label: 'Kundali', to: '/kundali', icon: 'Sun' },
  { label: 'Marriage Match', to: '/marriage-matching', icon: 'Heart' },
  { label: 'AI Astrologer', to: '/astrologer', icon: 'MessageSquare' },
  { label: 'Profile', to: '/profile', icon: 'User' },
];

export const AUTH_STORAGE_KEY = 'astralis-auth';
export const PROFILE_STORAGE_KEY = 'astralis-profile';
export const CHAT_STORAGE_KEY = 'astralis-chat';

export const ONBOARDING_STEPS = 3;

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

export const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिन्दी (Hindi)' },
  { value: 'Marathi', label: 'मराठी (Marathi)' },
  { value: 'Tamil', label: 'தமிழ் (Tamil)' },
];

export const RELATIONSHIP_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'in-relationship', label: 'In a relationship' },
  { value: 'married', label: 'Married' },
  { value: 'complicated', label: 'It\'s complicated' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

export const GOAL_OPTIONS = [
  'Self-discovery', 'Love & relationships', 'Career guidance',
  'Spiritual growth', 'Emotional healing', 'Life purpose',
  'Financial success', 'Creativity', 'Better decisions',
];

export const INTEREST_OPTIONS = [
  'Zodiac signs', 'Daily horoscopes', 'Birth charts', 'Moon phases',
  'Crystals', 'Meditation', 'Tarot', 'Numerology',
  'Dreams', 'Energy healing',
];

export const SUGGESTED_PROMPTS = [
  'What does today hold for me?',
  'Career guidance',
  'Relationship advice',
  'What does my moon sign mean?',
];

export const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  NorthNode: '☊', Chiron: '⚷',
};
