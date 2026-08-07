// services/horoscope.ts — daily horoscope using real planetary transits.
// Generates personalized content based on the user's birth chart and current
// planetary positions, producing dynamic, date-specific predictions.

import type { DailyHoroscope, UserProfile, ZodiacSign, BirthChart } from '@/types';
import { AstroTime, Body, Ecliptic, EclipticGeoMoon, SunPosition } from 'astronomy-engine';
import { SIGN_TRAITS } from './astrology-data';

const ZODIAC: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

function signFromLongitude(lon: number): ZodiacSign {
  return ZODIAC[Math.floor(lon / 30) % 12];
}

function planetLongitude(body: Body, time: AstroTime): number {
  const vec = (body === Body.Sun) ? SunPosition(time) : (body === Body.Moon) ? EclipticGeoMoon(time) : null;
  if (vec && 'elon' in vec) return ((vec.elon % 360) + 360) % 360;
  return 0;
}

const QUOTES = [
  'The stars incline us, they do not bind us.',
  'What the caterpillar calls the end, the rest of the world calls a butterfly.',
  'You are not a drop in the ocean; you are the entire ocean in a drop.',
  'The wound is the place where the light enters you.',
  'We are all in the gutter, but some of us are looking at the stars.',
];

const COLORS = ['Indigo', 'Gold', 'Crimson', 'Emerald', 'Silver', 'Amber', 'Violet', 'Rose', 'Sapphire'];
const MOODS = ['Reflective', 'Energetic', 'Calm', 'Ambitious', 'Intuitive', 'Playful', 'Focused', 'Inspired'];

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(Math.floor(seed)) % arr.length];
}

function hashSeed(...values: (string | number)[]): number {
  const str = values.join('-');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function getSunSignFromDate(birthDate: string): ZodiacSign {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const monthDay = month * 100 + day;
  const signs: ZodiacSign[] = [
    'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
    'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius',
  ];
  const signIndex = Math.floor((monthDay + 20) / 100) % 12;
  return signs[signIndex] ?? 'Leo';
}

function getMoonPhase(date: Date): { phase: string; emoji: string; illumination: number } {
  const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
  const lunarCycle = 29.530588853 * 86400000;
  const elapsed = date.getTime() - knownNewMoon;
  const phaseFraction = ((elapsed % lunarCycle) + lunarCycle) % lunarCycle / lunarCycle;

  if (phaseFraction < 0.03 || phaseFraction > 0.97) return { phase: 'New Moon', emoji: '🌑', illumination: 0 };
  if (phaseFraction < 0.22) return { phase: 'Waxing Crescent', emoji: '🌒', illumination: Math.round(phaseFraction * 100) };
  if (phaseFraction < 0.28) return { phase: 'First Quarter', emoji: '🌓', illumination: 50 };
  if (phaseFraction < 0.47) return { phase: 'Waxing Gibbous', emoji: '🌔', illumination: Math.round(phaseFraction * 100) };
  if (phaseFraction < 0.53) return { phase: 'Full Moon', emoji: '🌕', illumination: 100 };
  if (phaseFraction < 0.72) return { phase: 'Waning Gibbous', emoji: '🌖', illumination: Math.round((1 - phaseFraction) * 100) };
  if (phaseFraction < 0.78) return { phase: 'Last Quarter', emoji: '🌗', illumination: 50 };
  return { phase: 'Waning Crescent', emoji: '🌘', illumination: Math.round((1 - phaseFraction) * 100) };
}

function getTransitInsights(now: Date): {
  moonSign: ZodiacSign;
  sunSign: ZodiacSign;
  moonPhase: { phase: string; emoji: string; illumination: number };
  mercuryRetrogradeLikely: boolean;
} {
  const time = new AstroTime(now);
  const moonLon = EclipticGeoMoon(time).lon;
  const sunLon = SunPosition(time).elon;

  return {
    moonSign: signFromLongitude(moonLon),
    sunSign: signFromLongitude(sunLon),
    moonPhase: getMoonPhase(now),
    mercuryRetrogradeLikely: false,
  };
}

function generateGeneralHoroscope(
  sunSign: ZodiacSign,
  transits: ReturnType<typeof getTransitInsights>,
  seed: number,
): string {
  const traits = SIGN_TRAITS[sunSign];
  const moonInSign = transits.moonSign;
  const moonTraits = SIGN_TRAITS[moonInSign];
  const phase = transits.moonPhase.phase;

  const intros = [
    `With the Moon transiting ${moonInSign} today, your emotional focus shifts toward ${moonTraits.nature.toLowerCase()}.`,
    `The current ${phase} amplifies your natural ${traits.nature.toLowerCase()} energy.`,
    `As the Moon moves through ${moonInSign}, it forms a dynamic connection with your ${sunSign} Sun.`,
    `Today's cosmic weather highlights your ${traits.strengths[0].toLowerCase()} — lean into it.`,
  ];

  const bodies = [
    `Trust your intuition; the ${phase} supports decisions aligned with your authentic self. A meaningful conversation could open a new door.`,
    `Channel the ${moonTraits.element.toLowerCase()} energy into creative pursuits or emotional connections. You may feel more ${moonTraits.nature.toLowerCase()} than usual.`,
    `This is a favorable time for activities related to ${traits.careerFields[0].toLowerCase()}. Your ${traits.strengths[1].toLowerCase()} will serve you well.`,
    `The universe encourages you to embrace your ${traits.strengths[2].toLowerCase()} while being mindful of ${traits.weaknesses[0].toLowerCase()}. Balance is key today.`,
  ];

  return `${pick(intros, seed)} ${pick(bodies, seed + 1)}`;
}

function generateLoveHoroscope(
  sunSign: ZodiacSign,
  transits: ReturnType<typeof getTransitInsights>,
  seed: number,
): string {
  const moonInSign = transits.moonSign;
  const moonTraits = SIGN_TRAITS[moonInSign];

  const venusAreas = [
    'Venus energy highlights your connections. If single, an unexpected encounter may spark interest.',
    'The Moon in your relationship sector amplifies emotional intimacy today.',
    `With the Moon in ${moonInSign}, your approach to love is colored by ${moonTraits.nature.toLowerCase()} energy.`,
    'Express appreciation to those you care about — small gestures carry outsized weight today.',
  ];

  const additions = [
    'If partnered, plan a thoughtful gesture that shows you truly see them.',
    'A heart-to-heart conversation could deepen a bond you value.',
    'Avoid making impulsive romantic decisions under this lunar influence.',
    'Your charm is heightened — use it to build bridges, not walls.',
  ];

  return `${pick(venusAreas, seed)} ${pick(additions, seed + 2)}`;
}

function generateCareerHoroscope(
  sunSign: ZodiacSign,
  transits: ReturnType<typeof getTransitInsights>,
  seed: number,
): string {
  const traits = SIGN_TRAITS[sunSign];

  const intros = [
    `Your creative mind is sharp today. With your ${traits.strengths[0].toLowerCase()} at the forefront, it's a good day to pitch ideas.`,
    `The ${transits.moonPhase.phase} supports strategic thinking. Tackle a problem from a fresh angle.`,
    `Your natural aptitude for ${traits.careerFields[0].toLowerCase()} is highlighted. Network and share your vision.`,
    `Channel your ${traits.element.toLowerCase()} energy into focused work. Quality over quantity wins.`,
  ];

  const advice = [
    'Avoid overcommitting; prioritize the tasks that truly move the needle.',
    'A colleague may offer valuable feedback — stay open to it.',
    'Trust your instincts on a decision you have been weighing.',
    'Set ambitious goals but break them into manageable steps.',
  ];

  return `${pick(intros, seed)} ${pick(advice, seed + 1)}`;
}

function generateHealthHoroscope(
  sunSign: ZodiacSign,
  transits: ReturnType<typeof getTransitInsights>,
  seed: number,
): string {
  const traits = SIGN_TRAITS[sunSign];
  const focus = traits.healthFocus;

  const intros = [
    `Listen to your body's rhythm. Pay attention to your ${focus.toLowerCase()} today.`,
    `The ${transits.moonPhase.phase} invites you to slow down and tune in to your physical needs.`,
    `With the Moon in ${transits.moonSign}, your energy may feel more ${SIGN_TRAITS[transits.moonSign].nature.toLowerCase()}. Honor that.`,
    `Your ${traits.element.toLowerCase()} constitution benefits from mindful movement today.`,
  ];

  const advice = [
    'Gentle movement and hydration will keep your energy steady.',
    'Avoid caffeine late in the day; opt for herbal tea instead.',
    'A short walk outdoors can reset your mental and physical state.',
    'Prioritize sleep tonight — your body is processing deeply.',
  ];

  return `${pick(intros, seed)} ${pick(advice, seed + 3)}`;
}

function generateGuidance(
  sunSign: ZodiacSign,
  transits: ReturnType<typeof getTransitInsights>,
  seed: number,
): string {
  const phase = transits.moonPhase.phase;
  const moonSign = transits.moonSign;

  if (phase === 'New Moon') {
    return `The New Moon in ${moonSign} is a powerful time for intention-setting. Take 10 minutes today to write down what you want to call in this cycle. As a ${sunSign}, you thrive when you lead with intention.`;
  }
  if (phase === 'Full Moon') {
    return `The Full Moon in ${moonSign} illuminates what has been hidden. Release what no longer serves you. As a ${sunSign}, your ${SIGN_TRAITS[sunSign].strengths[0].toLowerCase()} helps you navigate this emotional peak with grace.`;
  }
  if (phase.includes('Waxing')) {
    return `The ${phase} supports building and growing. As a ${sunSign}, focus on ${SIGN_TRAITS[sunSign].careerFields[0].toLowerCase()} and creative projects. Trust the timing of your life.`;
  }
  return `The ${phase} in ${moonSign} invites reflection and release. As a ${sunSign}, use this time to reconnect with your inner ${SIGN_TRAITS[sunSign].element.toLowerCase()} nature. Trust the timing of your life.`;
}

export async function getTodayHoroscope(profile: UserProfile): Promise<DailyHoroscope> {
  await new Promise((r) => setTimeout(r, 600));

  const now = new Date();
  const sunSign = getSunSignFromDate(profile.birthDate);
  const transits = getTransitInsights(now);
  const seed = hashSeed(now.toDateString(), profile.name, sunSign);

  return {
    date: now.toISOString().split('T')[0],
    sign: sunSign,
    general: generateGeneralHoroscope(sunSign, transits, seed),
    love: generateLoveHoroscope(sunSign, transits, seed + 1),
    career: generateCareerHoroscope(sunSign, transits, seed + 2),
    health: generateHealthHoroscope(sunSign, transits, seed + 3),
    luckyColor: pick(COLORS, seed),
    luckyNumber: Math.abs(seed % 9) + 1,
    luckyTime: `${Math.abs(seed % 12) + 1}:00 ${seed % 2 === 0 ? 'AM' : 'PM'}`,
    mood: pick(MOODS, seed + 5),
    quote: pick(QUOTES, seed + 3),
    guidance: generateGuidance(sunSign, transits, seed + 7),
  };
}
