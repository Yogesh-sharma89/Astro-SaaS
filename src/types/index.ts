// types/ — shared TypeScript types and interfaces used across features.

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Session {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// --- Onboarding / User Profile ---

export type Gender = 'female' | 'male' | 'non-binary' | 'prefer-not';
export type RelationshipStatus = 'single' | 'in-relationship' | 'married' | 'complicated' | 'prefer-not';

export interface UserProfile {
  name: string;
  gender: Gender;
  language: string;
  birthDate: string; // ISO date
  birthTime: string; // HH:mm or empty if unknown
  birthTimeUnknown: boolean;
  birthPlace: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  relationshipStatus: RelationshipStatus;
  goals: string[];
  interests: string[];
  onboardingComplete: boolean;
  chartGeneratedAt?: string;
}

// --- Birth Chart ---

export type PlanetName =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'
  | 'NorthNode' | 'Chiron';

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn'
  | 'Aquarius' | 'Pisces';

export interface PlanetPosition {
  name: PlanetName;
  sign: ZodiacSign;
  degree: number; // 0–29.99
  house: number; // 1–12
  retrograde: boolean;
  meaning: string;
}

export interface BirthChart {
  id: string;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  ascendant: ZodiacSign | null;
  birthTimeKnown: boolean;
  houses: { number: number; sign: ZodiacSign; degree: number }[];
  planets: PlanetPosition[];
  generatedAt: string;
}

// --- Horoscope / Dashboard ---

export interface DailyHoroscope {
  date: string;
  sign: ZodiacSign;
  general: string;
  love: string;
  career: string;
  health: string;
  luckyColor: string;
  luckyNumber: number;
  luckyTime: string;
  mood: string;
  quote: string;
  guidance: string;
}

export interface MoonPhase {
  phase: string;
  emoji: string;
  illumination: number; // 0–100
  age: number; // days since new moon
}

// --- AI Astrologer Chat ---

export type ChatRole = 'user' | 'assistant';
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}
