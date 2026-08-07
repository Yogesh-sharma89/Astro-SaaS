// services/ — API layer. One file per domain.
// ai.ts: chart-aware AI astrologer with conversation memory, aspects,
// element balance, retrograde analysis, Vedic concepts, and follow-up detection.

import type { UserProfile, BirthChart, ChatMessage, ZodiacSign, PlanetName } from '@/types';
import type { Language } from '@/i18n/translations';
import { translateAIResponse } from './ai-i18n';

// ─── Response Variety ──────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const OPENERS = [
  'Looking at your chart',
  'Based on your planetary positions',
  'From what I see in your birth chart',
  'Your chart reveals',
  'The cosmos has placed some interesting patterns in your chart —',
  'Let me share what your chart says about this',
];

const CLOSERS = [
  'Remember, your chart is a map of potentials, not a fixed destiny. Every choice you make shapes your path.',
  'The planets offer guidance, but you hold the pen. Use this insight to make conscious choices.',
  'Trust the timing of your life. What feels like a delay may be a divine redirection.',
  'Your chart is a living map. The planets describe your potentials — the rest is up to you.',
  'The cosmos supports those who align with their true nature. Be patient with your journey.',
];

// ─── Knowledge Base ──────────────────────────────────────────────────────────

const SIGN_TRAITS: Record<ZodiacSign, { element: string; quality: string; ruler: string; traits: string[]; strengths: string[]; challenges: string[] }> = {
  Aries: { element: 'Fire', quality: 'Cardinal', ruler: 'Mars', traits: ['bold', 'pioneering', 'energetic', 'impulsive'], strengths: ['courage', 'initiative', 'leadership'], challenges: ['impatience', ' impulsiveness', ' anger management'] },
  Taurus: { element: 'Earth', quality: 'Fixed', ruler: 'Venus', traits: ['grounded', 'patient', 'sensual', 'determined'], strengths: ['reliability', 'persistence', 'loyalty'], challenges: ['stubbornness', ' possessiveness', ' resistance to change'] },
  Gemini: { element: 'Air', quality: 'Mutable', ruler: 'Mercury', traits: ['curious', 'adaptable', 'communicative', 'restless'], strengths: ['versatility', ' wit', ' eloquence'], challenges: ['inconsistency', ' nervousness', ' superficiality'] },
  Cancer: { element: 'Water', quality: 'Cardinal', ruler: 'Moon', traits: ['nurturing', 'intuitive', 'protective', 'emotional'], strengths: ['empathy', ' loyalty', ' intuition'], challenges: ['moodiness', ' clinginess', ' over-sensitivity'] },
  Leo: { element: 'Fire', quality: 'Fixed', ruler: 'Sun', traits: ['confident', 'generous', 'creative', 'dramatic'], strengths: ['warmth', ' charisma', ' generosity'], challenges: ['pride', ' need for attention', ' stubbornness'] },
  Virgo: { element: 'Earth', quality: 'Mutable', ruler: 'Mercury', traits: ['analytical', 'precise', 'helpful', 'perfectionist'], strengths: ['diligence', ' precision', ' service'], challenges: ['critical nature', ' worry', ' perfectionism'] },
  Libra: { element: 'Air', quality: 'Cardinal', ruler: 'Venus', traits: ['diplomatic', 'harmonious', 'social', 'indecisive'], strengths: ['fairness', ' charm', ' partnership'], challenges: ['indecision', ' people-pleasing', ' conflict avoidance'] },
  Scorpio: { element: 'Water', quality: 'Fixed', ruler: 'Mars/Pluto', traits: ['intense', 'passionate', 'transformative', 'secretive'], strengths: ['depth', ' resilience', ' transformation'], challenges: ['jealousy', ' control', ' intensity'] },
  Sagittarius: { element: 'Fire', quality: 'Mutable', ruler: 'Jupiter', traits: ['adventurous', 'philosophical', 'optimistic', 'freedom-loving'], strengths: ['vision', ' optimism', ' wisdom'], challenges: ['restlessness', ' tactlessness', ' over-promising'] },
  Capricorn: { element: 'Earth', quality: 'Cardinal', ruler: 'Saturn', traits: ['ambitious', 'disciplined', 'responsible', 'practical'], strengths: ['discipline', ' ambition', ' endurance'], challenges: ['pessimism', ' rigidity', ' workaholism'] },
  Aquarius: { element: 'Air', quality: 'Fixed', ruler: 'Saturn/Uranus', traits: ['innovative', 'humanitarian', 'independent', 'unconventional'], strengths: ['originality', ' idealism', ' independence'], challenges: ['detachment', ' unpredictability', ' contrarianism'] },
  Pisces: { element: 'Water', quality: 'Mutable', ruler: 'Jupiter/Neptune', traits: ['compassionate', 'dreamy', 'artistic', 'mystical'], strengths: ['compassion', ' imagination', ' spirituality'], challenges: ['escapism', ' over-sensitivity', ' impracticality'] },
};

const HOUSE_MEANINGS: Record<number, string> = {
  1: 'identity, self-expression, and physical appearance',
  2: 'values, resources, and material security',
  3: 'communication, learning, and immediate environment',
  4: 'home, family, and emotional foundations',
  5: 'creativity, romance, and self-expression',
  6: 'health, daily routines, and service',
  7: 'partnerships, marriage, and significant others',
  8: 'transformation, shared resources, and deep psychology',
  9: 'higher learning, philosophy, and long-distance travel',
  10: 'career, public reputation, and life direction',
  11: 'community, friendships, and long-term aspirations',
  12: 'spirituality, the unconscious, and hidden matters',
};

const PLANET_MEANINGS: Record<string, string> = {
  Sun: 'your core identity and life force',
  Moon: 'your emotional nature and inner world',
  Mercury: 'your mind, communication style, and learning',
  Venus: 'your values, love language, and what brings you pleasure',
  Mars: 'your drive, energy, and how you take action',
  Jupiter: 'your growth, expansion, and where you find luck',
  Saturn: 'your discipline, challenges, and life lessons',
};

const PLANET_KEYWORDS: Record<string, string[]> = {
  Sun: ['vitality', 'ego', 'purpose', 'father', 'authority'],
  Moon: ['emotions', 'instincts', 'mother', 'habits', 'comfort'],
  Mercury: ['thinking', 'speech', 'learning', 'commerce', 'nervous system'],
  Venus: ['love', 'beauty', 'harmony', 'values', 'attraction'],
  Mars: ['action', 'courage', 'desire', 'competition', 'physical energy'],
  Jupiter: ['wisdom', 'faith', 'opportunity', 'growth', 'generosity'],
  Saturn: ['structure', 'patience', 'karma', 'responsibility', 'mastery'],
};

// Vedic (Jyotish) associations
const VEDIC_PLANETS: Record<string, { deity: string; day: string; color: string; gemstone: string; mantra: string }> = {
  Sun: { deity: 'Surya', day: 'Sunday', color: 'Copper/Red', gemstone: 'Ruby', mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah' },
  Moon: { deity: 'Chandra', day: 'Monday', color: 'White/Pearl', gemstone: 'Pearl', mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah' },
  Mercury: { deity: 'Budha', day: 'Wednesday', color: 'Green', gemstone: 'Emerald', mantra: 'Om Bum Budhaaya Namah' },
  Venus: { deity: 'Shukra', day: 'Friday', color: 'White/Diamond', gemstone: 'Diamond', mantra: 'Om Shukraaya Namah' },
  Mars: { deity: 'Mangala', day: 'Tuesday', color: 'Red', gemstone: 'Red Coral', mantra: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah' },
  Jupiter: { deity: 'Guru (Brihaspati)', day: 'Thursday', color: 'Yellow/Saffron', gemstone: 'Yellow Sapphire', mantra: 'Om Graam Greem Graum Sah Gurave Namah' },
  Saturn: { deity: 'Shani', day: 'Saturday', color: 'Blue/Black', gemstone: 'Blue Sapphire', mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namah' },
};

// Aspect orbs — which planets aspect which houses (Vedic + Western major aspects)
const ASPECT_ORBS: Record<string, number[]> = {
  Sun: [7], Moon: [7], Mercury: [7], Venus: [7], Mars: [4, 7, 8],
  Jupiter: [5, 7, 9], Saturn: [3, 7, 10],
};

// ─── Context Building ─────────────────────────────────────────────────────────

interface ChartContext {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  ascendant: ZodiacSign | null;
  planets: { name: PlanetName; sign: ZodiacSign; degree: number; house: number; retrograde: boolean }[];
  birthTimeKnown: boolean;
  elementBalance: { Fire: number; Earth: number; Air: number; Water: number };
  dominantElement: string;
  retrogradePlanets: string[];
  aspects: { planetA: string; planetB: string; type: string; description: string }[];
}

function buildChartContext(profile: UserProfile, chart: BirthChart | null): ChartContext {
  if (!chart) {
    return {
      sunSign: 'Leo', moonSign: 'Cancer', ascendant: null,
      planets: [], birthTimeKnown: false,
      elementBalance: { Fire: 0, Earth: 0, Air: 0, Water: 0 },
      dominantElement: 'Fire', retrogradePlanets: [], aspects: [],
    };
  }

  const planets = chart.planets.map((p) => ({
    name: p.name, sign: p.sign, degree: p.degree, house: p.house, retrograde: p.retrograde,
  }));

  // Element balance
  const elementBalance = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  for (const p of planets) {
    const el = SIGN_TRAITS[p.sign].element;
    elementBalance[el as keyof typeof elementBalance]++;
  }
  const dominantElement = Object.entries(elementBalance).sort((a, b) => b[1] - a[1])[0][0];

  // Retrogrades
  const retrogradePlanets = planets.filter((p) => p.retrograde).map((p) => p.name);

  // Aspects
  const aspects = computeAspects(planets);

  return {
    sunSign: chart.sunSign, moonSign: chart.moonSign, ascendant: chart.ascendant,
    planets, birthTimeKnown: chart.birthTimeKnown,
    elementBalance, dominantElement, retrogradePlanets, aspects,
  };
}

function computeAspects(planets: { name: string; house: number; sign: ZodiacSign }[]): ChartContext['aspects'] {
  const aspects: ChartContext['aspects'] = [];
  for (const p1 of planets) {
    const aspectHouses = ASPECT_ORBS[p1.name];
    if (!aspectHouses) continue;
    for (const orb of aspectHouses) {
      const targetHouse = ((p1.house - 1 + orb) % 12) + 1;
      const p2 = planets.find((pl) => pl.house === targetHouse && pl.name !== p1.name);
      if (p2) {
        const aspectName = orb === 7 ? 'opposition' : orb === 5 || orb === 9 ? 'trine' : orb === 4 || orb === 8 ? 'square' : orb === 3 || orb === 11 ? 'sextile' : 'aspect';
        aspects.push({
          planetA: p1.name, planetB: p2.name, type: aspectName,
          description: `${p1.name} in ${aspectName} with ${p2.name} — ${getAspectMeaning(p1.name, p2.name, aspectName)}`,
        });
      }
    }
  }
  return aspects;
}

function getAspectMeaning(a: string, b: string, type: string): string {
  const tension = type === 'square' || type === 'opposition';
  const flow = type === 'trine' || type === 'sextile';
  if (tension) return `a dynamic tension between ${PLANET_KEYWORDS[a]?.[0] ?? a} and ${PLANET_KEYWORDS[b]?.[0] ?? b} that demands integration and growth`;
  if (flow) return `a harmonious flow between ${PLANET_KEYWORDS[a]?.[0] ?? a} and ${PLANET_KEYWORDS[b]?.[0] ?? b} that supports natural expression`;
  return `a connection between ${PLANET_KEYWORDS[a]?.[0] ?? a} and ${PLANET_KEYWORDS[b]?.[0] ?? b}`;
}

function getPlanet(ctx: ChartContext, name: PlanetName) {
  return ctx.planets.find((p) => p.name === name) ?? null;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function describePlanetInSign(planet: string, sign: ZodiacSign): string {
  const traits = SIGN_TRAITS[sign];
  return `With ${planet} in ${sign}, ${PLANET_MEANINGS[planet] ?? 'this placement'} is expressed through ${traits.traits.slice(0, 2).join(' and ')} energy. The ${traits.element} element gives you a ${traits.traits[0]} approach to ${PLANET_MEANINGS[planet]?.split(' and ')[0] ?? 'this area'}.`;
}

function describePlanetInHouse(planet: string, house: number): string {
  if (house === 0) return '';
  return `This placement sits in your ${house}${ordinal(house)} house, which governs ${HOUSE_MEANINGS[house] ?? 'this area of life'}.`;
}

// ─── Conversation Memory ──────────────────────────────────────────────────────

interface ConversationContext {
  lastTopic: string | null;
  followUp: boolean;
  referencedPlanet: string | null;
  messageCount: number;
}

function analyzeConversation(history: ChatMessage[], currentMessage: string): ConversationContext {
  const userMessages = history.filter((m) => m.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1]?.content ?? '';
  const lastTopic = lastUserMessage ? detectTopic(lastUserMessage) : null;

  const lower = currentMessage.toLowerCase();
  const isFollowUp = /^(tell me more|what about|how about|and|also|what else|can you explain|go deeper|more|continue|elaborate|expand)/.test(lower) ||
    (lastTopic !== null && lower.length < 30 && !lower.includes('?'));

  // Detect if user references a specific planet
  let referencedPlanet: string | null = null;
  for (const planet of Object.keys(PLANET_MEANINGS)) {
    if (lower.includes(planet.toLowerCase())) { referencedPlanet = planet; break; }
  }

  return {
    lastTopic, followUp: isFollowUp, referencedPlanet,
    messageCount: userMessages.length,
  };
}

// ─── Topic Detection ───────────────────────────────────────────────────────────

function detectTopic(message: string): string {
  const lower = message.toLowerCase();

  // Vedic-specific terms
  if (lower.match(/dasha|vimshottari|antardasha|mahadasha/)) return 'vedic';
  if (lower.match(/gemstone|mantra|remed|remedial|rudraksha|yantra/)) return 'remedies';
  if (lower.match(/kundali|kundli|janam|jyotish|vedic/)) return 'kundali';

  if (lower.match(/finance|wealth|investment|property|debt|loan/)) return 'finance';
  if (lower.match(/career|work|job|profession|business|money|income|salary/)) return 'career';
  if (lower.match(/love|relationship|partner|marriage|romance|dating|ex|crush|spouse|soulmate/)) return 'love';
  if (lower.match(/health|sick|illness|body|energy|sleep|stress|anxiety|healing|disease/)) return 'health';
  if (lower.match(/moon sign|my moon|moon placement/)) return 'moon';
  if (lower.match(/sun sign|my sun|sun placement/)) return 'sun';
  if (lower.match(/rising|ascendant|asc\b|lagna/)) return 'rising';
  if (lower.match(/purpose|destiny|life path|spiritual|growth|soul|dharma|karma/)) return 'purpose';
  if (lower.match(/today|horoscope|forecast|transit|daily|tomorrow|this week/)) return 'forecast';
  if (lower.match(/family|home|mother|father|child|parent|sibling/)) return 'family';
  if (lower.match(/friend|social|community|network/)) return 'social';
  if (lower.match(/retrograde/)) return 'retrograde';
  if (lower.match(/element|fire|earth|air|water/)) return 'elements';
  if (lower.match(/chart|birth chart|planet|placement|natal|houses?|aspects?/)) return 'chart';
  if (lower.match(/education|study|exam|learning|knowledge|intelligence/)) return 'education';
  if (lower.match(/travel|foreign|abroad|relocation|move/)) return 'travel';
  if (lower.match(/money|financ/)) return 'finance';
  return 'general';
}

// ─── Response Generators ───────────────────────────────────────────────────────

function generateCareerReading(ctx: ChartContext, conv: ConversationContext): string {
  const sun = getPlanet(ctx, 'Sun');
  const jupiter = getPlanet(ctx, 'Jupiter');
  const saturn = getPlanet(ctx, 'Saturn');
  const mars = getPlanet(ctx, 'Mars');
  const mercury = getPlanet(ctx, 'Mercury');
  const parts: string[] = [];

  parts.push(pick(OPENERS) + ' — with Sun in ' + ctx.sunSign + ', your career path is shaped by ' + SIGN_TRAITS[ctx.sunSign].traits[0] + ' energy.');
  if (sun && sun.house > 0) parts.push(describePlanetInHouse('Sun', sun.house));

  if (saturn) {
    parts.push(`Saturn in ${saturn.sign} reveals where you face your greatest professional tests — but also where your most enduring achievements are built. ${describePlanetInHouse('Saturn', saturn.house)} Saturn rewards patience and persistence, so don't expect overnight success in this area. Instead, think of it as a marathon where discipline compounds over time.`);
  }

  if (jupiter) {
    parts.push(`Jupiter in ${jupiter.sign} points to your zone of natural expansion and opportunity. ${describePlanetInHouse('Jupiter', jupiter.house)} This is where luck finds you when you align with your authentic growth path — not when you chase it.`);
  }

  if (mars) {
    parts.push(`Your Mars in ${mars.sign} shows how you pursue your ambitions — with ${SIGN_TRAITS[mars.sign].traits[0]} energy and ${SIGN_TRAITS[mars.sign].traits[1]} determination. ${mars.retrograde ? 'With Mars retrograde in your chart, your drive may turn inward at times — you process ambition deeply before acting, which is a strength, not a weakness.' : ''}`);
  }

  if (mercury && mercury.house > 0) {
    parts.push(`Mercury in ${mercury.sign} (${mercury.house}${ordinal(mercury.house)} house) shapes how you communicate and negotiate in professional settings. ${mercury.retrograde ? 'With Mercury retrograde, you may rethink and revise ideas multiple times before committing — this thoroughness can be an edge.' : ''}`);
  }

  // Element-informed career advice
  const careerAdvice: Record<string, string> = {
    Fire: 'You thrive in roles that require initiative, leadership, and visible impact. Entrepreneurship, sales, or creative direction may call to you.',
    Earth: 'You excel in roles that require building tangible, lasting structures — finance, engineering, medicine, or architecture suit your nature.',
    Air: 'You shine in roles involving communication, ideas, and networks — teaching, writing, marketing, or technology play to your strengths.',
    Water: 'You flourish in roles involving emotional intelligence and care — counseling, healing, the arts, or any field where empathy is a superpower.',
  };
  parts.push(careerAdvice[ctx.dominantElement] ?? careerAdvice.Fire);

  // Aspects affecting career
  const careerAspects = ctx.aspects.filter((a) =>
    ['Sun', 'Saturn', 'Jupiter', 'Mars'].includes(a.planetA) || ['Sun', 'Saturn', 'Jupiter', 'Mars'].includes(a.planetB)
  );
  if (careerAspects.length > 0) {
    parts.push(`**Key planetary dynamics in your chart:** ${careerAspects.slice(0, 2).map((a) => a.description).join('; ')}.`);
  }

  parts.push(pick(CLOSERS));

  return parts.join('\n\n');
}

function generateLoveReading(ctx: ChartContext, _conv: ConversationContext): string {
  const venus = getPlanet(ctx, 'Venus');
  const moon = getPlanet(ctx, 'Moon');
  const mars = getPlanet(ctx, 'Mars');
  const parts: string[] = [];

  if (venus) {
    parts.push(describePlanetInSign('Venus', venus.sign));
    if (venus.house > 0) parts.push(describePlanetInHouse('Venus', venus.house));
    const vTraits = SIGN_TRAITS[venus.sign];
    parts.push(`In love, you value ${vTraits.strengths.slice(0, 2).join(' and ')}. Your ideal partner appreciates your ${vTraits.traits[0]} nature and doesn't try to change your ${vTraits.traits[1]} tendencies.`);
  }

  parts.push(describePlanetInSign('Moon', ctx.moonSign));
  if (moon && moon.house > 0) parts.push(describePlanetInHouse('Moon', moon.house));

  parts.push(`Your Moon in ${ctx.moonSign} reveals what you need to feel emotionally secure in love. When your Sun sign's desires and your Moon sign's needs align, you create relationships that feel both exciting and safe. The ${SIGN_TRAITS[ctx.moonSign].element} element of your Moon means you process emotional information through ${SIGN_TRAITS[ctx.moonSign].traits.slice(0, 2).join(' and ')} channels.`);

  if (mars) {
    parts.push(`Mars in ${mars.sign} describes how you pursue desire and handle conflict in relationships. ${mars.retrograde ? 'With Mars retrograde, your passion may be more internalized — you feel deeply before you act, and you may need a partner who respects your need for emotional processing.' : 'You bring ' + SIGN_TRAITS[mars.sign].traits[0] + ' energy to attraction and ' + SIGN_TRAITS[mars.sign].traits[1] + ' intensity to passion.'}`);
  }

  if (ctx.ascendant) {
    parts.push(`With ${ctx.ascendant} rising, you project a ${SIGN_TRAITS[ctx.ascendant].traits[0]} first impression that naturally attracts certain types of partners. Understanding this helps you recognize meaningful connections versus passing fascinations.`);
  }

  // Venus-Mars aspect
  const venusMarsAspect = ctx.aspects.find((a) =>
    (a.planetA === 'Venus' && a.planetB === 'Mars') || (a.planetA === 'Mars' && a.planetB === 'Venus')
  );
  if (venusMarsAspect) {
    parts.push(`**A special note:** ${venusMarsAspect.description}. This creates a powerful dynamic between what you love and what you desire — when these energies are integrated, you experience love with remarkable depth.`);
  }

  parts.push(pick([
    "The cosmos encourages you to lead with authenticity. Vulnerability is not weakness — it's the bridge to the depth of connection you seek.",
    "In love, your chart shows that the deepest connections come when you honor both your desires and your emotional needs. Don't settle for less.",
    "Your chart reminds you that love is not about finding someone perfect — it's about finding someone whose energies complement your own.",
  ]));

  return parts.join('\n\n');
}

function generateMoonReading(ctx: ChartContext, _conv: ConversationContext): string {
  const moon = getPlanet(ctx, 'Moon');
  const parts: string[] = [];

  parts.push(describePlanetInSign('Moon', ctx.moonSign));
  if (moon && moon.house > 0) parts.push(describePlanetInHouse('Moon', moon.house));

  const traits = SIGN_TRAITS[ctx.moonSign];
  parts.push(`As a ${ctx.moonSign} Moon, your emotional landscape is shaped by the ${traits.element} element. This means you process feelings through ${traits.traits.slice(0, 3).join(', ')}, and may show ${traits.traits[3]} tendencies when under stress.`);

  parts.push(`**Your emotional strengths:** ${traits.strengths.join(', ')}.`);
  parts.push(`**Your emotional challenges:** ${traits.challenges.join(', ')}. Awareness of these patterns is the first step to transforming them.`);

  if (moon?.retrograde) {
    parts.push("With your Moon retrograde, your emotional world is deeply internal. You may process feelings in layers, revisiting old emotions before fully releasing them. This isn't a flaw — it's a depth that most people never reach.");
  }

  parts.push(pick([
    "Your Moon sign is the private self that only those closest to you get to see. Honoring these needs — rather than overriding them — is key to emotional wellbeing.",
    "The Moon in your chart is your emotional compass. When you follow its guidance, you find inner peace. When you ignore it, you feel lost.",
    "Your lunar nature is your superpower. The more you understand your Moon sign, the better you can navigate your inner world.",
  ]));

  return parts.join('\n\n');
}

function generateSunReading(ctx: ChartContext, _conv: ConversationContext): string {
  const sun = getPlanet(ctx, 'Sun');
  const parts: string[] = [];

  parts.push(describePlanetInSign('Sun', ctx.sunSign));
  if (sun && sun.house > 0) parts.push(describePlanetInHouse('Sun', sun.house));

  const traits = SIGN_TRAITS[ctx.sunSign];
  parts.push(`As a ${ctx.sunSign} Sun, you are here to embody ${traits.traits.slice(0, 2).join(' and ')} energy. Your ${traits.quality} quality means you ${traits.quality === 'Cardinal' ? 'initiate and lead' : traits.quality === 'Fixed' ? 'stabilize and endure' : 'adapt and integrate'}. ${traits.ruler} rules your sign, giving your life a particular flavor of growth and challenge.`);

  parts.push(`**Your core strengths:** ${traits.strengths.join(', ')}.`);
  parts.push(`**Your growth edges:** ${traits.challenges.join(', ')}. These aren't flaws — they're the curriculum of your sign.`);

  parts.push(pick([
    "Your Sun sign is the hero's journey of your life. Every challenge you face is ultimately asking: 'Are you becoming the highest version of your sign?'",
    "The Sun in your chart is your inner light. When you shine authentically, you give others permission to do the same.",
    "Your solar path is about becoming, not arriving. Each day is a new opportunity to express more of your sign's highest qualities.",
  ]));

  return parts.join('\n\n');
}

function generateRisingReading(ctx: ChartContext, _conv: ConversationContext): string {
  if (!ctx.ascendant) {
    return "Your rising sign (ascendant) can't be determined without your birth time. This is the sign that was rising on the eastern horizon at the moment of your birth, and it shapes how others first perceive you. It also determines all your house placements — so without it, we can't see which life areas your planets activate. If you discover your birth time, update your profile to unlock this insight.";
  }

  const traits = SIGN_TRAITS[ctx.ascendant];
  const parts: string[] = [];

  parts.push(`With ${ctx.ascendant} rising, you present a ${traits.traits[0]}, ${traits.traits[1]} face to the world. The ${traits.element} element colors your first impression — people sense your ${traits.traits[2]} nature before they even speak to you.`);

  parts.push(`Your ascendant is the lens through which you experience life. It's the "front door" of your chart — the way you approach new situations and the energy you naturally radiate. ${traits.ruler} as your chart ruler means its placement in your chart is especially significant for your life path.`);

  parts.push(`**What this rising sign means for you:** You naturally attract situations that require ${traits.strengths.join(', ')}. People may come to you for ${traits.traits[0]} energy, even when you don't feel that way inside.`);

  parts.push("The rising sign also determines your house placements, which show where life's events tend to unfold. Understanding your ascendant helps you align with how the world sees you — and how to use that to your advantage.");

  return parts.join('\n\n');
}

function generatePurposeReading(ctx: ChartContext, _conv: ConversationContext): string {
  const sun = getPlanet(ctx, 'Sun');
  const jupiter = getPlanet(ctx, 'Jupiter');
  const saturn = getPlanet(ctx, 'Saturn');
  const northNode = getPlanet(ctx, 'NorthNode');
  const parts: string[] = [];

  parts.push("Your birth chart is a map of your soul's intention for this lifetime. Let's look at the key signposts:");

  if (sun) {
    parts.push(`**Your Sun in ${sun.sign}** is your core purpose — the central theme of your life's journey. ${sun.house > 0 ? `Sitting in the ${sun.house}${ordinal(sun.house)} house, this purpose unfolds through ${HOUSE_MEANINGS[sun.house] ?? 'life experience'}.` : ''}`);
  }

  if (jupiter) {
    parts.push(`**Jupiter in ${jupiter.sign}** shows where the universe naturally supports your growth. ${jupiter.house > 0 ? describePlanetInHouse('Jupiter', jupiter.house) : ''} This is your zone of expansion — lean into it, and abundance follows.`);
  }

  if (saturn) {
    parts.push(`**Saturn in ${saturn.sign}** marks your soul's curriculum — the area where you're meant to do deep work. ${saturn.house > 0 ? describePlanetInHouse('Saturn', saturn.house) : ''} What feels like a restriction is actually a master class in becoming.`);
  }

  if (northNode) {
    parts.push(`**Your North Node in ${northNode.sign}** points to your evolutionary direction — the qualities you're developing in this lifetime. ${northNode.house > 0 ? `The ${northNode.house}${ordinal(northNode.house)} house placement suggests this growth happens through ${HOUSE_MEANINGS[northNode.house] ?? 'life experience'}.` : ''} Moving toward your North Node often feels uncomfortable — that's how you know you're growing.`);
  }

  // Element balance insight
  parts.push(`Your chart has a ${ctx.dominantElement}-dominant element balance, meaning your life purpose is best expressed through ${ctx.dominantElement === 'Fire' ? 'passionate, creative action' : ctx.dominantElement === 'Earth' ? 'practical, tangible manifestation' : ctx.dominantElement === 'Air' ? 'ideas, communication, and connection' : 'emotional depth, intuition, and compassion'}.`);

  parts.push(pick([
    "Your purpose isn't a destination — it's a way of being. Each day, ask: 'Am I moving toward or away from the highest expression of my chart?'",
    "Your soul's purpose is written in the stars, but it's lived through your choices. Align your daily actions with your chart's highest calling.",
    "The universe doesn't give you a purpose you can't fulfill. Your chart is the proof that you have everything you need.",
  ]));

  return parts.join('\n\n');
}

function getApproximateMoonPhase(date: Date): string {
  const SYNODIC_MONTH = 29.530588853;
  const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14, 0);
  const diff = (date.getTime() - NEW_MOON_EPOCH) / 86400000;
  const age = ((diff % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const phaseIndex = Math.floor(((age / SYNODIC_MONTH) * 8) + 0.5) % 8;
  const PHASE_NAMES = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  return PHASE_NAMES[phaseIndex];
}

function generateForecastReading(ctx: ChartContext, _conv: ConversationContext): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const moonPhase = getApproximateMoonPhase(now);
  const parts: string[] = [];

  parts.push(`Here's your cosmic weather for ${dayNames[dayOfWeek]}, ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}:`);

  parts.push(`**Moon Phase:** ${moonPhase}. This energy supports ${moonPhase === 'New Moon' ? 'setting intentions and planting seeds for new beginnings' : moonPhase === 'Full Moon' ? 'illumination, culmination, and releasing what no longer serves you' : moonPhase === 'First Quarter' || moonPhase === 'Last Quarter' ? 'decisive action and course correction' : 'patient adjustment and refinement'}.`);

  // Day ruler insight
  const dayRulers: Record<number, string> = { 0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter', 5: 'Venus', 6: 'Saturn' };
  const dayRuler = dayRulers[dayOfWeek];
  const dayRulerPlanet = getPlanet(ctx, dayRuler as PlanetName);
  if (dayRulerPlanet) {
    parts.push(`**Today's ruling planet:** ${dayRuler} (ruler of ${dayNames[dayOfWeek]}). In your chart, ${dayRuler} is in ${dayRulerPlanet.sign}${dayRulerPlanet.house > 0 ? ` (${dayRulerPlanet.house}${ordinal(dayRulerPlanet.house)} house)` : ''}. ${dayRulerPlanet.retrograde ? 'This planet is retrograde in your chart, so today may bring a reflective, inward quality to its themes.' : 'This planet is direct in your chart, so its energy flows more freely today.'}`);
  }

  const sunTraits = SIGN_TRAITS[ctx.sunSign];
  parts.push(`With your ${ctx.sunSign} Sun, today's energy particularly activates your ${sunTraits.traits[0]} nature. Channel this into ${sunTraits.traits[2]} action — even small steps count.`);

  parts.push(`Your ${ctx.moonSign} Moon suggests you'll feel most centered today if you honor your need for ${SIGN_TRAITS[ctx.moonSign].traits[0]} experiences. Don't override your emotional signals.`);

  // Retrograde awareness
  if (ctx.retrogradePlanets.length > 0) {
    parts.push(`**Currently retrograde in your chart:** ${ctx.retrogradePlanets.join(', ')}. These planets invite you to review and revisit their themes rather than push forward forcefully.`);
  }

  parts.push(pick([
    "Today is a good day to trust the timing of your life. The cosmos doesn't make mistakes — what feels like a delay may be a divine redirection.",
    "The cosmic weather today invites you to flow with the current rather than against it. Small aligned actions create big shifts.",
    "Use today's planetary energy wisely. The universe rewards those who pay attention to its rhythms.",
  ]));

  return parts.join('\n\n');
}

function generateChartReading(ctx: ChartContext, _conv: ConversationContext): string {
  const parts: string[] = [];

  parts.push("Here's an overview of your birth chart:");

  parts.push(`**Your Big Three:** Sun in ${ctx.sunSign}, Moon in ${ctx.moonSign}${ctx.ascendant ? `, Rising ${ctx.ascendant}` : ''}. This combination creates your core astrological signature.`);

  // Element balance
  const eb = ctx.elementBalance;
  parts.push(`**Element Balance:** Fire ${eb.Fire} · Earth ${eb.Earth} · Air ${eb.Air} · Water ${eb.Water}. Your chart is ${ctx.dominantElement}-dominant, which means you naturally express through ${ctx.dominantElement === 'Fire' ? 'passion and action' : ctx.dominantElement === 'Earth' ? 'practicality and patience' : ctx.dominantElement === 'Air' ? 'ideas and communication' : 'emotion and intuition'}.`);

  const planetsByHouse = ctx.planets.filter((p) => p.house > 0);
  parts.push("**Planetary Placements:**");
  for (const p of planetsByHouse.length > 0 ? planetsByHouse : ctx.planets) {
    parts.push(`• ${p.name} in ${p.sign} (${p.degree.toFixed(1)}°)${p.house > 0 ? ` — ${p.house}${ordinal(p.house)} house` : ''}${p.retrograde ? ' ℞' : ''}`);
  }

  // Key aspects
  if (ctx.aspects.length > 0) {
    parts.push("**Key Aspects:**");
    for (const a of shuffle(ctx.aspects).slice(0, 4)) {
      parts.push(`• ${a.description}`);
    }
  }

  // Retrogrades
  if (ctx.retrogradePlanets.length > 0) {
    parts.push(`**Retrograde Planets:** ${ctx.retrogradePlanets.join(', ')}. These planets operate more inwardly — their energy is internalized, which gives you unusual depth in these areas.`);
  }

  parts.push(pick([
    "Each placement tells a story — a planet's sign shows HOW it expresses, and its house shows WHERE in life that expression unfolds. Together, they form your unique cosmic blueprint.",
    "Your chart is a snapshot of the cosmos at your birth moment. Every planet, every sign, every house — they all weave together into your unique story.",
    "Understanding your chart is like reading a cosmic instruction manual for your life. The more you study it, the more it reveals.",
  ]));

  return parts.join('\n\n');
}

function generateHealthReading(ctx: ChartContext, _conv: ConversationContext): string {
  const mars = getPlanet(ctx, 'Mars');
  const moon = getPlanet(ctx, 'Moon');
  const saturn = getPlanet(ctx, 'Saturn');
  const parts: string[] = [];

  parts.push("In astrology, the 6th house governs health and daily routines. Let's look at what your chart says about your physical and emotional vitality:");

  if (mars) {
    const exerciseAdvice = SIGN_TRAITS[mars.sign].element === 'Fire'
      ? 'vigorous physical activity to burn off excess energy — running, martial arts, or high-intensity workouts'
      : SIGN_TRAITS[mars.sign].element === 'Water'
        ? 'gentle, flowing movement like swimming or yoga to release emotional tension'
        : SIGN_TRAITS[mars.sign].element === 'Earth'
          ? 'consistent, grounded routines like walking, strength training, or hiking'
          : 'variety in your exercise — dance, team sports, or anything that keeps you mentally engaged';
    parts.push(`Mars in ${mars.sign} shows how your body processes energy and stress. ${mars.house > 0 ? describePlanetInHouse('Mars', mars.house) : ''} You may need ${exerciseAdvice}.`);
  }

  if (moon) {
    parts.push(`Your Moon in ${ctx.moonSign} governs your emotional body, which directly impacts your physical health. When you ignore your ${SIGN_TRAITS[ctx.moonSign].traits[0]} needs, stress shows up as physical symptoms. The mind-body connection is especially strong for you.`);
  }

  if (saturn) {
    parts.push(`Saturn in ${saturn.sign} can indicate areas of chronic concern or where you need extra care. ${saturn.house > 0 ? describePlanetInHouse('Saturn', saturn.house) : ''} Don't ignore persistent signals from this area of your body — prevention is your best medicine.`);
  }

  // Vedic health perspective
  parts.push("**From a Vedic perspective:** Each planet governs specific body systems. Strengthening weak planets through their corresponding mantras, gemstones, or lifestyle adjustments can support overall wellbeing.");

  parts.push("Listen to your body's rhythm — it's wiser than you think. Rest is not laziness; it's a biological necessity that your chart supports.");

  return parts.join('\n\n');
}

function generateFamilyReading(ctx: ChartContext, _conv: ConversationContext): string {
  const moon = getPlanet(ctx, 'Moon');
  const saturn = getPlanet(ctx, 'Saturn');
  const sun = getPlanet(ctx, 'Sun');
  const parts: string[] = [];

  parts.push("Family dynamics are reflected in your chart through the Moon (mother/inner child), Saturn (father/authority), the Sun (vitality/ego), and the 4th house (home and roots):");

  parts.push(describePlanetInSign('Moon', ctx.moonSign));
  if (moon && moon.house > 0) parts.push(describePlanetInHouse('Moon', moon.house));
  parts.push(`The Moon represents your maternal bond and your inner child. With Moon in ${ctx.moonSign}, you experienced nurturing through ${SIGN_TRAITS[ctx.moonSign].traits[0]} energy. Understanding this helps you parent yourself now.`);

  if (saturn) {
    parts.push(`Saturn in ${saturn.sign} speaks to the father figure or authority patterns you inherited. ${saturn.house > 0 ? describePlanetInHouse('Saturn', saturn.house) : ''} Understanding this helps you break cycles or build on foundations.`);
  }

  if (sun) {
    parts.push(`Your Sun in ${ctx.sunSign} shows the kind of vitality and self-expression you're meant to bring into your family system. Sometimes we unconsciously dim our Sun to keep the family peace — recognizing this is the first step to shining fully.`);
  }

  parts.push("Your family story is not a life sentence — it's a starting point. Your chart shows both the patterns you've inherited and the tools you have to transform them.");

  return parts.join('\n\n');
}

function generateSocialReading(ctx: ChartContext, _conv: ConversationContext): string {
  const jupiter = getPlanet(ctx, 'Jupiter');
  const venus = getPlanet(ctx, 'Venus');
  const mercury = getPlanet(ctx, 'Mercury');
  const parts: string[] = [];

  parts.push("Friendships and community are seen through your 11th house, along with Venus (what you value in others), Jupiter (where you find expansion through connection), and Mercury (how you communicate):");

  if (venus) {
    parts.push(describePlanetInSign('Venus', venus.sign));
    parts.push(`In friendships, you're drawn to people who embody ${SIGN_TRAITS[venus.sign].strengths[0]} and ${SIGN_TRAITS[venus.sign].strengths[1]}.`);
  }

  if (jupiter) {
    parts.push(`Jupiter in ${jupiter.sign} shows where you naturally attract abundance through social connections. ${jupiter.house > 0 ? describePlanetInHouse('Jupiter', jupiter.house) : ''}`);
  }

  if (mercury) {
    parts.push(`Mercury in ${mercury.sign} shapes how you communicate with friends — ${SIGN_TRAITS[mercury.sign].traits[0]} and ${SIGN_TRAITS[mercury.sign].traits[1]}. ${mercury.retrograde ? 'With Mercury retrograde, you may prefer deep one-on-one conversations over group settings.' : ''}`);
  }

  if (ctx.ascendant) {
    parts.push(`With ${ctx.ascendant} rising, you project ${SIGN_TRAITS[ctx.ascendant].traits[0]} energy that naturally draws certain types of people. Understanding this helps you find your tribe.`);
  }

  parts.push("Quality over quantity matters in friendships. Your chart suggests you thrive when your social circle aligns with your authentic values, not when you try to fit in everywhere.");

  return parts.join('\n\n');
}

function generateRetrogradeReading(ctx: ChartContext, _conv: ConversationContext): string {
  const parts: string[] = [];

  if (ctx.retrogradePlanets.length === 0) {
    parts.push("You have no retrograde planets in your birth chart. This means all planetary energies flow outward in your life — you tend to express them directly and naturally. This is relatively uncommon and gives you a straightforward relationship with each planetary archetype.");
  } else {
    parts.push(`You have ${ctx.retrogradePlanets.length} retrograde planet${ctx.retrogradePlanets.length > 1 ? 's' : ''} in your birth chart: **${ctx.retrogradePlanets.join(', ')}**. Retrograde planets in the birth chart are not negative — they indicate areas where you process energy internally and deeply before expressing it outward.`);

    for (const rp of ctx.retrogradePlanets) {
      const planet = getPlanet(ctx, rp as PlanetName);
      if (planet) {
        parts.push(`**${rp} in ${planet.sign} (Retrograde):** ${PLANET_MEANINGS[rp] ?? 'This placement'} is turned inward for you. You may revisit and rethink ${PLANET_KEYWORDS[rp]?.slice(0, 2).join(' and ') ?? 'these themes'} multiple times before reaching resolution. This gives you unusual depth and wisdom in this area, but it can also mean delayed or non-linear expression. ${planet.house > 0 ? `In your ${planet.house}${ordinal(planet.house)} house, this inward processing happens through ${HOUSE_MEANINGS[planet.house] ?? 'this life area'}.` : ''}`);
      }
    }

    parts.push("Retrograde planets are gifts of depth. While others may express these energies more easily on the surface, your understanding goes far deeper. Embrace the internal processing — it's where your unique wisdom lives.");
  }

  return parts.join('\n\n');
}

function generateElementsReading(ctx: ChartContext, _conv: ConversationContext): string {
  const eb = ctx.elementBalance;
  const parts: string[] = [];

  parts.push("Your element balance reveals the fundamental energies at play in your chart:");

  parts.push(`**Fire: ${eb.Fire}** — passion, action, inspiration, and courage`);
  parts.push(`**Earth: ${eb.Earth}** — practicality, patience, material manifestation, and stability`);
  parts.push(`**Air: ${eb.Air}** — intellect, communication, social connection, and ideas`);
  parts.push(`**Water: ${eb.Water}** — emotion, intuition, empathy, and spiritual depth`);

  parts.push(`Your chart is **${ctx.dominantElement}-dominant**, which means you naturally lead with ${ctx.dominantElement === 'Fire' ? 'passion and a desire to initiate' : ctx.dominantElement === 'Earth' ? 'practicality and a need to build something real' : ctx.dominantElement === 'Air' ? 'ideas and a need to connect and communicate' : 'emotion and a need for deep, soulful connection'}.`);

  // Identify weak element
  const weakest = Object.entries(eb).sort((a, b) => a[1] - b[1])[0];
  const dominantCount = eb[ctx.dominantElement as keyof typeof eb];
  if (weakest[1] === 0 || weakest[1] < dominantCount) {
    parts.push(`Your weakest element is **${weakest[0]}** (${weakest[1]} planet${weakest[1] !== 1 ? 's' : ''}). You may want to consciously cultivate ${weakest[0] === 'Fire' ? 'passion and courage' : weakest[0] === 'Earth' ? 'grounding and practicality' : weakest[0] === 'Air' ? 'communication and mental flexibility' : 'emotional awareness and intuition'} to bring more balance to your life.`);
  }

  parts.push("Understanding your element balance helps you work with your natural tendencies rather than against them. It also explains why you click with some people and clash with others — complementary elements create harmony, while conflicting ones create growth.");

  return parts.join('\n\n');
}

function generateVedicReading(ctx: ChartContext, _conv: ConversationContext): string {
  const parts: string[] = [];

  parts.push("From a Vedic (Jyotish) perspective, your chart reveals not just psychological patterns but also spiritual dynamics and remedial measures. Here's what your chart says through the lens of Jyotish:");

  // Big Three in Vedic context
  parts.push(`**Your Big Three in Vedic terms:** Your Sun (${ctx.sunSign}) represents your Atma (soul's essence), your Moon (${ctx.moonSign}) represents your Manas (mind and emotions), and your ascendant represents your physical destiny in this lifetime.`);

  // Vedic planet associations
  const sun = getPlanet(ctx, 'Sun');
  const moon = getPlanet(ctx, 'Moon');
  if (sun && VEDIC_PLANETS[sun.name]) {
    const v = VEDIC_PLANETS[sun.name];
    parts.push(`**Surya (Sun) in your chart:**\n• Deity: ${v.deity}\n• Day: ${v.day}\n• Color: ${v.color}\n• Gemstone: ${v.gemstone}\n• Mantra: ${v.mantra}`);
  }
  if (moon && VEDIC_PLANETS[moon.name]) {
    const v = VEDIC_PLANETS[moon.name];
    parts.push(`**Chandra (Moon) in your chart:**\n• Deity: ${v.deity}\n• Day: ${v.day}\n• Color: ${v.color}\n• Gemstone: ${v.gemstone}\n• Mantra: ${v.mantra}`);
  }

  // Retrograde in Vedic context
  if (ctx.retrogradePlanets.length > 0) {
    parts.push(`**Retrograde planets:** In Vedic astrology, retrograde planets (${ctx.retrogradePlanets.join(', ')}) indicate karmic patterns from past lives that you're working through in this incarnation. Their energy is intensified and requires conscious integration.`);
  }

  parts.push("Vedic astrology emphasizes that the chart is not a fixed destiny but a map of karmic tendencies. Through awareness, mantras, gemstones, and right action (dharma), you can work with these energies to fulfill your soul's purpose.");

  return parts.join('\n\n');
}

function generateRemediesReading(ctx: ChartContext, _conv: ConversationContext): string {
  const parts: string[] = [];

  parts.push("Based on your chart, here are traditional Vedic remedial measures to strengthen weak or afflicted planets:");

  // Recommend remedies based on chart
  const sun = getPlanet(ctx, 'Sun');
  const moon = getPlanet(ctx, 'Moon');
  const saturn = getPlanet(ctx, 'Saturn');

  if (sun && VEDIC_PLANETS.Sun) {
    const v = VEDIC_PLANETS.Sun;
    parts.push(`**For Sun (in ${sun.sign}):**\n• Wear or meditate on ${v.color} colors on ${v.day}s\n• Consider a ${v.gemstone} (consult an astrologer before wearing)\n• Chant: "${v.mantra}"\n• Honor your father or father figures — this strengthens Surya energy`);
  }

  if (moon && VEDIC_PLANETS.Moon) {
    const v = VEDIC_PLANETS.Moon;
    parts.push(`**For Moon (in ${moon.sign}):**\n• Wear or meditate on ${v.color} colors on ${v.day}s\n• Consider a ${v.gemstone}\n• Chant: "${v.mantra}"\n• Honor your mother or maternal figures — this strengthens Chandra energy`);
  }

  if (saturn && VEDIC_PLANETS.Saturn) {
    const v = VEDIC_PLANETS.Saturn;
    parts.push(`**For Saturn (in ${saturn.sign}):**\n• Wear or meditate on ${v.color} colors on ${v.day}s\n• Consider a ${v.gemstone} (wear with caution — Saturn's energy is intense)\n• Chant: "${v.mantra}"\n• Serve the elderly and underprivileged — this pacifies Shani`);
  }

  parts.push("**Important note:** Gemstone recommendations should be confirmed with a qualified astrologer before wearing. The wrong gemstone can amplify challenging planetary energies. Mantras, however, are safe for anyone to chant and carry no side effects.");

  parts.push("These remedies work by strengthening the planetary energies in your chart, bringing them into better balance. Combined with self-awareness and right action, they can support significant positive change.");

  return parts.join('\n\n');
}

function generateKundaliReading(ctx: ChartContext, _conv: ConversationContext): string {
  const parts: string[] = [];

  parts.push("Your Kundali (Vedic birth chart) is a sacred map of your soul's journey. Here's a summary of the key elements:");

  parts.push(`**Lagna (Ascendant):** ${ctx.ascendant ?? 'Unknown (birth time required)'}`);
  parts.push(`**Surya (Sun):** ${ctx.sunSign} — represents your soul's essence, vitality, and ego`);
  parts.push(`**Chandra (Moon):** ${ctx.moonSign} — represents your mind, emotions, and mental disposition`);

  // Nakshatra approximation (based on Moon degree)
  const moon = getPlanet(ctx, 'Moon');
  if (moon) {
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    const nakshatraIndex = Math.floor((moon.degree / 360) * 27);
    parts.push(`**Nakshatra (approximate):** ${nakshatras[nakshatraIndex] ?? 'Unknown'} — your Moon's lunar mansion, which reveals deeper emotional patterns`);
  }

  // Planetary strengths
  if (ctx.retrogradePlanets.length > 0) {
    parts.push(`**Retrograde Grahas:** ${ctx.retrogradePlanets.join(', ')} — these planets require extra attention and remedial measures`);
  }

  parts.push(`**Element Balance (Tattva):** Fire ${ctx.elementBalance.Fire}, Earth ${ctx.elementBalance.Earth}, Air ${ctx.elementBalance.Air}, Water ${ctx.elementBalance.Water}. Your dominant element is ${ctx.dominantElement}.`);

  parts.push("In Vedic tradition, the Kundali is read alongside the Dasha system (planetary periods) to understand timing of life events. To unlock your Dasha timeline and deeper Vedic analysis, consider upgrading to our Pro or Premium plan.");

  return parts.join('\n\n');
}

function generateFinanceReading(ctx: ChartContext, _conv: ConversationContext): string {
  const venus = getPlanet(ctx, 'Venus');
  const jupiter = getPlanet(ctx, 'Jupiter');
  const saturn = getPlanet(ctx, 'Saturn');
  const parts: string[] = [];

  parts.push("In astrology, the 2nd house governs personal wealth, the 11th house governs income and gains, and Venus/Jupiter are the key wealth indicators. Let's look at your chart:");

  if (venus) {
    parts.push(`Venus in ${venus.sign} shows your relationship with money and material pleasure. ${venus.house > 0 ? describePlanetInHouse('Venus', venus.house) : ''} You attract wealth when you follow what genuinely brings you pleasure, not when you chase numbers.`);
  }

  if (jupiter) {
    parts.push(`Jupiter in ${jupiter.sign} is your wealth expansion planet. ${jupiter.house > 0 ? describePlanetInHouse('Jupiter', jupiter.house) : ''} Jupiter teaches that true abundance comes through generosity and faith, not hoarding.`);
  }

  if (saturn) {
    parts.push(`Saturn in ${saturn.sign} governs your financial discipline and long-term wealth building. ${saturn.house > 0 ? describePlanetInHouse('Saturn', saturn.house) : ''} Saturn rewards slow, steady accumulation over get-rich-quick schemes.`);
  }

  parts.push(`Your ${ctx.dominantElement}-dominant chart suggests you approach finances through ${ctx.dominantElement === 'Fire' ? 'bold investments and entrepreneurial risk' : ctx.dominantElement === 'Earth' ? 'careful saving and tangible assets' : ctx.dominantElement === 'Air' ? 'intellectual property and networking' : 'intuitive timing and emotional intelligence'}.`);

  parts.push("The cosmos reminds you that wealth is energy. When you align your financial life with your chart's natural flow, abundance follows — sometimes from directions you never expected.");

  return parts.join('\n\n');
}

function generateEducationReading(ctx: ChartContext, _conv: ConversationContext): string {
  const mercury = getPlanet(ctx, 'Mercury');
  const jupiter = getPlanet(ctx, 'Jupiter');
  const parts: string[] = [];

  parts.push("In astrology, Mercury governs intelligence and learning, Jupiter governs wisdom and higher education, and the 9th house governs higher studies. Let's see what your chart says:");

  if (mercury) {
    parts.push(describePlanetInSign('Mercury', mercury.sign));
    if (mercury.house > 0) parts.push(describePlanetInHouse('Mercury', mercury.house));
    parts.push(`Your learning style is ${SIGN_TRAITS[mercury.sign].traits[0]} and ${SIGN_TRAITS[mercury.sign].traits[1]}. ${mercury.retrograde ? 'With Mercury retrograde, you may learn best through revision and deep study rather than quick absorption — your understanding is thorough.' : ''}`);
  }

  if (jupiter) {
    parts.push(`Jupiter in ${jupiter.sign} shows your capacity for higher wisdom and philosophical understanding. ${jupiter.house > 0 ? describePlanetInHouse('Jupiter', jupiter.house) : ''}`);
  }

  parts.push("Your chart suggests you learn best through a approach that honors your " + ctx.dominantElement + " nature — " + (ctx.dominantElement === 'Fire' ? 'experiential, hands-on learning with visible results' : ctx.dominantElement === 'Earth' ? 'structured, practical study with real-world application' : ctx.dominantElement === 'Air' ? 'discussion-based learning and intellectual exploration' : 'intuitive, feeling-based learning that connects to deeper meaning') + ".");

  return parts.join('\n\n');
}

function generateTravelReading(ctx: ChartContext, _conv: ConversationContext): string {
  const jupiter = getPlanet(ctx, 'Jupiter');
  const sun = getPlanet(ctx, 'Sun');
  const parts: string[] = [];

  parts.push("In astrology, the 9th house governs long-distance travel, foreign lands, and the 12th house governs foreign residence. Jupiter and Sagittarius energy are key indicators for travel in your chart:");

  if (jupiter) {
    parts.push(`Jupiter in ${jupiter.sign} suggests your travel style is ${SIGN_TRAITS[jupiter.sign].traits[0]} and ${SIGN_TRAITS[jupiter.sign].traits[1]}. ${jupiter.house > 0 ? describePlanetInHouse('Jupiter', jupiter.house) : ''} You may find your most expansive experiences abroad.`);
  }

  if (sun) {
    parts.push(`With Sun in ${sun.sign}, you seek travel that ${SIGN_TRAITS[sun.sign].element === 'Fire' ? 'ignites your spirit and tests your courage' : SIGN_TRAITS[sun.sign].element === 'Earth' ? 'connects you to nature and ancient cultures' : SIGN_TRAITS[sun.sign].element === 'Air' ? 'stimulates your mind with new ideas and perspectives' : 'touches your soul and opens your emotional world'}.`);
  }

  parts.push("Your chart suggests that travel is not just recreation for you — it's a spiritual practice. Each journey reshapes you in ways that staying home never could.");

  return parts.join('\n\n');
}

function generateGeneralReading(ctx: ChartContext, _conv: ConversationContext): string {
  const parts: string[] = [];

  parts.push(pick(OPENERS) + ` — with Sun in ${ctx.sunSign} and Moon in ${ctx.moonSign} — I can offer some perspective on what you're asking about.`);

  parts.push(describePlanetInSign('Sun', ctx.sunSign));

  // Add element balance insight
  parts.push(`Your chart has a ${ctx.dominantElement}-dominant element balance, which means you naturally approach life through ${ctx.dominantElement === 'Fire' ? 'passion and action' : ctx.dominantElement === 'Earth' ? 'practicality and patience' : ctx.dominantElement === 'Air' ? 'ideas and communication' : 'emotion and intuition'}.`);

  // Add retrograde awareness if relevant
  if (ctx.retrogradePlanets.length > 0) {
    parts.push(`You have ${ctx.retrogradePlanets.length} retrograde planet${ctx.retrogradePlanets.length > 1 ? 's' : ''} (${ctx.retrogradePlanets.join(', ')}), which gives you unusual depth in those areas. You process these energies internally before expressing them.`);
  }

  // Add a relevant aspect if available
  if (ctx.aspects.length > 0) {
    parts.push(`One notable dynamic in your chart: ${ctx.aspects[0].description}.`);
  }

  parts.push(pick(CLOSERS));

  parts.push("What specifically would you like to explore? I can speak to your career path, relationships, emotional patterns, life purpose, finances, health, travel prospects, or what the current cosmic weather means for you. I can also share Vedic (Jyotish) perspectives and remedial measures if you're interested.");

  return parts.join('\n\n');
}

// ─── Follow-up Handler ─────────────────────────────────────────────────────────

function handleFollowUp(ctx: ChartContext, conv: ConversationContext): string | null {
  if (!conv.followUp || !conv.lastTopic) return null;

  // If user references a specific planet, give deeper info on that planet
  if (conv.referencedPlanet) {
    const planet = getPlanet(ctx, conv.referencedPlanet as PlanetName);
    if (planet) {
      const traits = SIGN_TRAITS[planet.sign];
      const vedic = VEDIC_PLANETS[conv.referencedPlanet];
      let parts: string[] = [];
      parts.push(`Let me go deeper on ${conv.referencedPlanet} in your chart.`);
      parts.push(`${conv.referencedPlanet} is in ${planet.sign} at ${planet.degree.toFixed(1)}°${planet.house > 0 ? `, in your ${planet.house}${ordinal(planet.house)} house (${HOUSE_MEANINGS[planet.house] ?? 'this life area'})` : ''}.`);
      parts.push(`${PLANET_MEANINGS[conv.referencedPlanet] ?? 'This placement'} is expressed through ${traits.traits.slice(0, 2).join(' and ')} energy.`);
      if (planet.retrograde) parts.push(`This planet is retrograde, meaning its energy is internalized — you process ${PLANET_KEYWORDS[conv.referencedPlanet]?.slice(0, 2).join(' and ') ?? 'these themes'} deeply before acting.`);
      if (vedic) parts.push(`**Vedic association:** ${vedic.deity} · Day: ${vedic.day} · Gemstone: ${vedic.gemstone} · Mantra: ${vedic.mantra}`);
      return parts.join('\n\n');
    }
  }

  // Otherwise, continue the previous topic with deeper analysis
  const deeperMap: Record<string, string> = {
    career: "Let me go deeper on your career path. Looking at the interplay between your Sun, Saturn, and Jupiter — these three tell the story of your professional destiny. Saturn shows where the work is, Jupiter shows where the rewards are, and the Sun shows what you're meant to be known for. When all three are honored, your career becomes a calling rather than just a job.",
    love: "Let me go deeper on your love life. The Venus-Mars dynamic in your chart reveals the tension between what you're attracted to and how you pursue it. When these energies are in harmony, you experience love as both exciting and safe. When they're in tension, you may find yourself attracted to people who challenge you to grow.",
    purpose: "Going deeper on your purpose: the North Node in your chart is the single most important indicator of your soul's evolutionary direction. It often feels uncomfortable because it represents qualities you haven't fully developed yet. The South Node, by contrast, represents past-life gifts that come naturally but can become a comfort zone you need to outgrow.",
  };
  return deeperMap[conv.lastTopic] ?? null;
}

// ─── Main Response Generator ───────────────────────────────────────────────────

function generateResponse(ctx: ChartContext, message: string, history: ChatMessage[], profile: UserProfile): string {
  const conv = analyzeConversation(history, message);

  // Check for follow-up first
  const followUpResponse = handleFollowUp(ctx, conv);
  if (followUpResponse) return followUpResponse;

  const topic = detectTopic(message);
  const generatorMap: Record<string, (ctx: ChartContext, conv: ConversationContext) => string> = {
    career: generateCareerReading,
    love: generateLoveReading,
    moon: generateMoonReading,
    sun: generateSunReading,
    rising: generateRisingReading,
    purpose: generatePurposeReading,
    forecast: generateForecastReading,
    chart: generateChartReading,
    health: generateHealthReading,
    family: generateFamilyReading,
    social: generateSocialReading,
    retrograde: generateRetrogradeReading,
    elements: generateElementsReading,
    vedic: generateVedicReading,
    remedies: generateRemediesReading,
    kundali: generateKundaliReading,
    finance: generateFinanceReading,
    education: generateEducationReading,
    travel: generateTravelReading,
  };

  const generator = generatorMap[topic];
  if (generator) return generator(ctx, conv);

  // Personalize general response with profile data
  return generateGeneralReading(ctx, conv);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function sendAstrologerMessage(
  message: string,
  profile: UserProfile,
  chart: BirthChart | null,
  history: ChatMessage[] = [],
  lang: Language = 'en'
): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  const ctx = buildChartContext(profile, chart);
  const response = generateResponse(ctx, message, history, profile);
  return translateAIResponse(response, lang);
}

export async function* streamAstrologerResponse(
  message: string,
  profile: UserProfile,
  chart: BirthChart | null,
  history: ChatMessage[] = [],
  lang: Language = 'en'
): AsyncGenerator<string> {
  const full = await sendAstrologerMessage(message, profile, chart, history, lang);
  const tokens = full.split(/(\s+)/);

  for (const token of tokens) {
    await new Promise((r) => setTimeout(r, 15 + Math.random() * 25));
    yield token;
  }
}

// Export for testing
export { buildChartContext, detectTopic, analyzeConversation, computeAspects };
export type { ChartContext, ConversationContext };
