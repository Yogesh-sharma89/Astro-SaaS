// services/astrology-data.ts — comprehensive interpretation data for birth charts,
// remedies, and Vedic marriage matching (Ashta Koota system).

import type { ZodiacSign, PlanetName } from '@/types';

// ─── Sign Traits ──────────────────────────────────────────────────────────────

export interface SignTraits {
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  quality: 'Cardinal' | 'Fixed' | 'Mutable';
  ruler: string;
  bodyPart: string;
  color: string;
  luckyDay: string;
  luckyNumbers: number[];
  gemstone: string;
  nature: string;
  strengths: string[];
  weaknesses: string[];
  careerFields: string[];
  healthFocus: string;
  description: string;
}

export const SIGN_TRAITS: Record<ZodiacSign, SignTraits> = {
  Aries: {
    element: 'Fire', quality: 'Cardinal', ruler: 'Mars', bodyPart: 'Head', color: 'Red',
    luckyDay: 'Tuesday', luckyNumbers: [1, 9, 17], gemstone: 'Red Coral',
    nature: 'Pioneering, energetic, courageous',
    strengths: ['Leadership', 'Courage', 'Confidence', 'Initiative', 'Enthusiasm'],
    weaknesses: ['Impatience', 'Impulsiveness', 'Short temper', 'Restlessness'],
    careerFields: ['Military', 'Sports', 'Entrepreneurship', 'Surgery', 'Firefighting'],
    healthFocus: 'Head, face, brain — prone to headaches and stress',
    description: 'Aries is the first sign of the zodiac, representing new beginnings and raw energy. You are a natural-born leader who thrives on challenges and action. Your pioneering spirit makes you fearless in the face of the unknown.',
  },
  Taurus: {
    element: 'Earth', quality: 'Fixed', ruler: 'Venus', bodyPart: 'Throat, neck', color: 'Green, Pink',
    luckyDay: 'Friday', luckyNumbers: [2, 6, 9], gemstone: 'Diamond',
    nature: 'Stable, patient, sensual',
    strengths: ['Reliability', 'Patience', 'Persistence', 'Loyalty', 'Practicality'],
    weaknesses: ['Stubbornness', 'Possessiveness', 'Materialistic', 'Resistance to change'],
    careerFields: ['Banking', 'Agriculture', 'Real Estate', 'Cooking', 'Interior Design'],
    healthFocus: 'Throat, neck, thyroid — prone to sore throats',
    description: 'Taurus is the sign of stability and sensuality. You value security, comfort, and the finer things in life. Your patient and methodical approach ensures that you build lasting foundations in everything you do.',
  },
  Gemini: {
    element: 'Air', quality: 'Mutable', ruler: 'Mercury', bodyPart: 'Lungs, arms, hands', color: 'Yellow',
    luckyDay: 'Wednesday', luckyNumbers: [3, 5, 14], gemstone: 'Emerald',
    nature: 'Versatile, communicative, curious',
    strengths: ['Adaptability', 'Communication', 'Intelligence', 'Wit', 'Versatility'],
    weaknesses: ['Indecisiveness', 'Nervousness', 'Inconsistency', 'Superficiality'],
    careerFields: ['Journalism', 'Teaching', 'Sales', 'Writing', 'Social Media'],
    healthFocus: 'Lungs, arms, nervous system — prone to anxiety',
    description: 'Gemini is the sign of communication and duality. You are intellectually curious, always seeking new information and experiences. Your quick wit and adaptability make you a natural communicator.',
  },
  Cancer: {
    element: 'Water', quality: 'Cardinal', ruler: 'Moon', bodyPart: 'Chest, stomach', color: 'White, Silver',
    luckyDay: 'Monday', luckyNumbers: [2, 7, 11], gemstone: 'Pearl',
    nature: 'Nurturing, emotional, protective',
    strengths: ['Empathy', 'Loyalty', 'Intuition', 'Caring', 'Protectiveness'],
    weaknesses: ['Moodiness', 'Clinginess', 'Over-sensitivity', 'Insecurity'],
    careerFields: ['Nursing', 'Childcare', 'Culinary Arts', 'Social Work', 'Real Estate'],
    healthFocus: 'Chest, stomach, digestive system — prone to emotional eating',
    description: 'Cancer is the sign of emotional depth and nurturing. You are deeply connected to home and family, with a strong intuitive sense. Your caring nature makes you a natural protector of those you love.',
  },
  Leo: {
    element: 'Fire', quality: 'Fixed', ruler: 'Sun', bodyPart: 'Heart, spine', color: 'Gold, Orange',
    luckyDay: 'Sunday', luckyNumbers: [1, 4, 19], gemstone: 'Ruby',
    nature: 'Confident, generous, dramatic',
    strengths: ['Leadership', 'Generosity', 'Creativity', 'Warmth', 'Charisma'],
    weaknesses: ['Arrogance', 'Stubbornness', 'Self-centeredness', 'Vanity'],
    careerFields: ['Entertainment', 'Politics', 'Management', 'Fashion', 'Teaching'],
    healthFocus: 'Heart, spine, back — prone to heart issues and back pain',
    description: 'Leo is the sign of royalty and self-expression. You are a natural performer who loves to be in the spotlight. Your warmth and generosity draw people to you, and your creative energy is magnetic.',
  },
  Virgo: {
    element: 'Earth', quality: 'Mutable', ruler: 'Mercury', bodyPart: 'Intestines, spleen', color: 'Green, Brown',
    luckyDay: 'Wednesday', luckyNumbers: [5, 14, 23], gemstone: 'Emerald',
    nature: 'Analytical, practical, service-oriented',
    strengths: ['Precision', 'Reliability', 'Intelligence', 'Practicality', 'Diligence'],
    weaknesses: ['Perfectionism', 'Worry', 'Criticism', 'Over-thinking'],
    careerFields: ['Healthcare', 'Accounting', 'Research', 'Editing', 'Veterinary'],
    healthFocus: 'Digestive system, intestines — prone to stress-related digestive issues',
    description: 'Virgo is the sign of precision and service. You have a keen eye for detail and a desire to help others. Your analytical mind and practical approach make you excellent at solving complex problems.',
  },
  Libra: {
    element: 'Air', quality: 'Cardinal', ruler: 'Venus', bodyPart: 'Kidneys, lower back', color: 'Pink, Blue',
    luckyDay: 'Friday', luckyNumbers: [4, 6, 13], gemstone: 'Diamond',
    nature: 'Diplomatic, harmonious, social',
    strengths: ['Diplomacy', 'Fairness', 'Charm', 'Cooperation', 'Aesthetics'],
    weaknesses: ['Indecisiveness', 'People-pleasing', 'Avoidance', 'Superficiality'],
    careerFields: ['Law', 'Diplomacy', 'Design', 'Counseling', 'Event Planning'],
    healthFocus: 'Kidneys, lower back, skin — prone to kidney issues',
    description: 'Libra is the sign of balance and partnership. You seek harmony in all relationships and have a strong sense of justice. Your diplomatic nature and aesthetic sense make you a natural peacemaker.',
  },
  Scorpio: {
    element: 'Water', quality: 'Fixed', ruler: 'Mars/Pluto', bodyPart: 'Reproductive organs', color: 'Dark Red, Black',
    luckyDay: 'Tuesday', luckyNumbers: [4, 13, 21], gemstone: 'Red Coral, Topaz',
    nature: 'Intense, passionate, transformative',
    strengths: ['Determination', 'Loyalty', 'Intuition', 'Depth', 'Resilience'],
    weaknesses: ['Jealousy', 'Secretiveness', 'Vengefulness', 'Obsessiveness'],
    careerFields: ['Research', 'Psychology', 'Detective Work', 'Surgery', 'Finance'],
    healthFocus: 'Reproductive organs, bladder — prone to hormonal imbalances',
    description: 'Scorpio is the sign of transformation and intensity. You experience life at a profound depth and are not afraid of the shadows. Your passionate nature and investigative mind make you a powerful force.',
  },
  Sagittarius: {
    element: 'Fire', quality: 'Mutable', ruler: 'Jupiter', bodyPart: 'Hips, thighs, liver', color: 'Purple, Turquoise',
    luckyDay: 'Thursday', luckyNumbers: [3, 9, 22], gemstone: 'Yellow Sapphire',
    nature: 'Adventurous, philosophical, optimistic',
    strengths: ['Optimism', 'Honesty', 'Adventure', 'Wisdom', 'Generosity'],
    weaknesses: ['Restlessness', 'Bluntness', 'Over-confidence', 'Irresponsibility'],
    careerFields: ['Travel', 'Philosophy', 'Teaching', 'Publishing', 'Sports'],
    healthFocus: 'Hips, thighs, liver — prone to hip problems and overindulgence',
    description: 'Sagittarius is the sign of adventure and higher learning. You are a seeker of truth and wisdom, always expanding your horizons. Your optimistic spirit and love of freedom make you a natural explorer.',
  },
  Capricorn: {
    element: 'Earth', quality: 'Cardinal', ruler: 'Saturn', bodyPart: 'Bones, knees, teeth', color: 'Black, Brown',
    luckyDay: 'Saturday', luckyNumbers: [4, 8, 13], gemstone: 'Blue Sapphire',
    nature: 'Disciplined, ambitious, practical',
    strengths: ['Discipline', 'Responsibility', 'Ambition', 'Patience', 'Organization'],
    weaknesses: ['Pessimism', 'Rigidity', 'Coldness', 'Workaholism'],
    careerFields: ['Business', 'Engineering', 'Government', 'Finance', 'Architecture'],
    healthFocus: 'Bones, knees, teeth — prone to joint issues and calcium deficiency',
    description: 'Capricorn is the sign of ambition and discipline. You are a master builder who approaches goals with patience and strategy. Your practical wisdom and determination ensure long-term success.',
  },
  Aquarius: {
    element: 'Air', quality: 'Fixed', ruler: 'Saturn/Uranus', bodyPart: 'Ankles, circulation', color: 'Electric Blue, Silver',
    luckyDay: 'Saturday', luckyNumbers: [4, 7, 22], gemstone: 'Blue Sapphire, Amethyst',
    nature: 'Innovative, humanitarian, independent',
    strengths: ['Innovation', 'Humanitarianism', 'Independence', 'Vision', 'Intellect'],
    weaknesses: ['Detachment', 'Unpredictability', 'Stubbornness', 'Aloofness'],
    careerFields: ['Technology', 'Science', 'Social Activism', 'Invention', 'Aviation'],
    healthFocus: 'Ankles, circulatory system — prone to varicose veins',
    description: 'Aquarius is the sign of innovation and humanitarianism. You are a visionary thinker who sees beyond convention. Your independent spirit and desire to improve society make you a natural reformer.',
  },
  Pisces: {
    element: 'Water', quality: 'Mutable', ruler: 'Jupiter/Neptune', bodyPart: 'Feet, lymphatic system', color: 'Sea Green, Lavender',
    luckyDay: 'Thursday', luckyNumbers: [3, 7, 12], gemstone: 'Yellow Sapphire, Pearl',
    nature: 'Compassionate, mystical, artistic',
    strengths: ['Compassion', 'Intuition', 'Creativity', 'Spirituality', 'Adaptability'],
    weaknesses: ['Escapism', 'Over-sensitivity', 'Idealism', 'Vagueness'],
    careerFields: ['Arts', 'Music', 'Healing', 'Spiritual Work', 'Photography'],
    healthFocus: 'Feet, lymphatic system — prone to foot problems and infections',
    description: 'Pisces is the sign of compassion and mysticism. You are deeply connected to the spiritual and emotional dimensions of life. Your artistic soul and empathetic nature make you a natural healer.',
  },
};

// ─── Planet in Sign Interpretations ───────────────────────────────────────────

export interface PlanetInSign {
  summary: string;
  personality: string;
  challenges: string;
  remedy: string;
  mantra: string;
}

export const PLANET_IN_SIGN: Partial<Record<PlanetName, Partial<Record<ZodiacSign, PlanetInSign>>>> = {
  Sun: {
    Aries: {
      summary: 'Sun in Aries (Exalted) — Your core identity is fiery, pioneering, and courageous. You are a natural-born leader.',
      personality: 'You radiate confidence and enthusiasm. People are drawn to your bold energy and pioneering spirit. You excel at initiating projects and inspiring others to follow your lead.',
      challenges: 'You may struggle with impatience, anger, and a tendency to dominate others. Learning to channel your fiery energy constructively is key.',
      remedy: 'Offer water to the Sun at sunrise. Wear red coral on the ring finger on Sundays. Practice meditation to calm your fiery temperament.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
    Taurus: {
      summary: 'Sun in Taurus — Your identity is grounded in stability, beauty, and material comfort. You build lasting foundations.',
      personality: 'You are patient, reliable, and sensual. You value security and beauty in all things. Your steady determination ensures you achieve your long-term goals.',
      challenges: 'You may resist change and become overly attached to comfort and material possessions.',
      remedy: 'Worship Goddess Lakshmi on Fridays. Wear clean, fresh clothes. Donate to those in need to balance material attachment.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
    Gemini: {
      summary: 'Sun in Gemini — Your identity is expressed through communication, intellect, and versatility.',
      personality: 'You are witty, adaptable, and intellectually curious. You thrive in social settings and excel at multitasking. Your communication skills are your greatest asset.',
      challenges: 'You may scatter your energy across too many interests or struggle with indecisiveness.',
      remedy: 'Chant the Gayatri Mantra daily at sunrise. Practice mindfulness to improve focus. Wear green on Wednesdays.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
    Cancer: {
      summary: 'Sun in Cancer — Your identity is deeply emotional, nurturing, and family-oriented.',
      personality: 'You are caring, protective, and emotionally sensitive. Your home and family are the center of your world. Your intuition is remarkably strong.',
      challenges: 'You may struggle with mood swings, over-attachment, and emotional vulnerability.',
      remedy: 'Offer white flowers to the Sun on Mondays. Keep a silver item with you. Practice emotional grounding through meditation.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
    Leo: {
      summary: 'Sun in Leo (Own Sign) — Your identity is regal, creative, and expressive. You are a natural leader.',
      personality: 'You radiate warmth, confidence, and charisma. You were born to shine and lead. Your generous heart and creative spirit inspire everyone around you.',
      challenges: 'You may struggle with pride, ego, and a need for constant admiration.',
      remedy: 'Offer arghya (water) to the Sun at sunrise on Sundays. Wear gold or orange. Practice humility through selfless service.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
    Virgo: {
      summary: 'Sun in Virgo — Your identity is analytical, precise, and service-oriented.',
      personality: 'You are meticulous, practical, and helpful. You find purpose in being of service to others. Your attention to detail is unmatched.',
      challenges: 'You may be overly critical of yourself and others, and prone to worry.',
      remedy: 'Chant the Gayatri Mantra 108 times daily. Wear green on Wednesdays. Serve and feed animals.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
    Libra: {
      summary: 'Sun in Libra — Your identity is centered on balance, harmony, and partnership.',
      personality: 'You are diplomatic, charming, and fair-minded. You seek balance in all areas of life and excel at bringing people together.',
      challenges: 'You may avoid confrontation and struggle with indecisiveness.',
      remedy: 'Worship Lord Shiva on Sundays. Wear pink or light colors. Practice assertiveness training.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
    Scorpio: {
      summary: 'Sun in Scorpio — Your identity is intense, transformative, and deeply emotional.',
      personality: 'You are passionate, determined, and fearless in exploring the depths of life. Your presence is magnetic and powerful.',
      challenges: 'You may struggle with jealousy, possessiveness, and a tendency to hold grudges.',
      remedy: 'Offer red flowers to the Sun on Sundays. Practice forgiveness meditation. Wear red coral.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
    Sagittarius: {
      summary: 'Sun in Sagittarius — Your identity is adventurous, philosophical, and optimistic.',
      personality: 'You are a seeker of truth and wisdom. Your optimistic spirit and love of adventure make you a natural explorer of both the world and the mind.',
      challenges: 'You may be overly blunt, restless, or take on too many commitments.',
      remedy: 'Offer water to the Sun at sunrise. Wear yellow on Thursdays. Practice gratitude daily.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
    Capricorn: {
      summary: 'Sun in Capricorn — Your identity is disciplined, ambitious, and practical.',
      personality: 'You are a master of strategy and discipline. You approach life with patience and long-term vision, building success step by step.',
      challenges: 'You may be overly serious, pessimistic, or struggle with workaholism.',
      remedy: 'Worship Lord Shiva on Saturdays. Wear dark blue or black. Practice self-compassion and rest.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
    Aquarius: {
      summary: 'Sun in Aquarius — Your identity is innovative, humanitarian, and independent.',
      personality: 'You are a visionary thinker who sees beyond convention. Your humanitarian spirit and unique perspective make you a natural reformer.',
      challenges: 'You may be emotionally detached, unpredictable, or resistant to intimacy.',
      remedy: 'Serve the community on Saturdays. Wear blue or violet. Practice heart-opening meditation.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
    Pisces: {
      summary: 'Sun in Pisces — Your identity is compassionate, mystical, and artistic.',
      personality: 'You are deeply spiritual and empathetic. Your artistic soul and compassionate nature make you a natural healer and creative spirit.',
      challenges: 'You may escape into fantasy, become overly idealistic, or struggle with boundaries.',
      remedy: 'Offer water to the Sun at sunrise. Wear yellow or sea green. Practice grounding exercises.',
      mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    },
  },
  Moon: {
    Aries: {
      summary: 'Moon in Aries — Your emotions are fiery, spontaneous, and quick to arise.',
      personality: 'You react emotionally with passion and urgency. Your feelings are intense but may pass quickly. You need excitement and challenge to feel emotionally fulfilled.',
      challenges: 'Emotional impatience, quick anger, and difficulty sitting with feelings.',
      remedy: 'Chant "Om Chandraaya Namah" on Mondays. Wear white. Practice moonlight meditation.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
    Taurus: {
      summary: 'Moon in Taurus (Exalted) — Your emotions are stable, steady, and comfort-seeking.',
      personality: 'You are emotionally grounded and seek security in all things. Your feelings are steady and reliable. You find comfort in beauty, food, and physical touch.',
      challenges: 'Emotional stubbornness and resistance to change.',
      remedy: 'Worship Goddess Lakshmi on Mondays. Wear white or light colors. Practice gratitude for abundance.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
    Gemini: {
      summary: 'Moon in Gemini — Your emotions are processed through intellect and communication.',
      personality: 'You understand your feelings by talking about them. Your emotional needs include variety, mental stimulation, and social connection.',
      challenges: 'Emotional inconsistency and nervousness.',
      remedy: 'Chant "Om Chandraaya Namah" on Mondays. Wear white or green. Practice journaling your emotions.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
    Cancer: {
      summary: 'Moon in Cancer (Own Sign) — Your emotions are deep, nurturing, and protective.',
      personality: 'You are the most emotionally sensitive and nurturing of all signs. Your feelings run deep and your intuition is powerful. Home and family are your emotional anchors.',
      challenges: 'Mood swings, emotional clinging, and over-sensitivity.',
      remedy: 'Offer white flowers to the Moon on Mondays. Wear silver. Practice emotional boundary setting.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
    Leo: {
      summary: 'Moon in Leo — Your emotions are warm, dramatic, and generous.',
      personality: 'You need to feel appreciated and recognized. Your emotional well-being is tied to creative expression and being seen. You are generous with your heart.',
      challenges: 'Emotional pride and need for attention.',
      remedy: 'Offer water to the Moon on Mondays. Wear white or gold. Practice self-love meditation.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
    Virgo: {
      summary: 'Moon in Virgo — Your emotions are analyzed, organized, and practical.',
      personality: 'You process emotions through logic and analysis. You feel best when things are organized and useful. You show care through acts of service.',
      challenges: 'Emotional criticism and worry.',
      remedy: 'Chant "Om Chandraaya Namah" on Mondays. Wear green or white. Practice self-acceptance.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
    Libra: {
      summary: 'Moon in Libra — Your emotions are balanced, harmonious, and partnership-oriented.',
      personality: 'Your emotional well-being depends on harmonious relationships. You feel best when surrounded by beauty and when your relationships are balanced.',
      challenges: 'Emotional indecisiveness and people-pleasing.',
      remedy: 'Worship Goddess Lakshmi on Mondays. Wear white or pink. Practice assertiveness.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
    Scorpio: {
      summary: 'Moon in Scorpio (Debilitated) — Your emotions are intense, deep, and transformative.',
      personality: 'You feel everything at a profound depth. Your emotional world is complex and powerful. You have a natural talent for understanding the hidden motivations of others.',
      challenges: 'Emotional jealousy, possessiveness, and holding onto past hurts.',
      remedy: 'Offer red flowers on Mondays. Wear white or red. Practice forgiveness and letting go.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
    Sagittarius: {
      summary: 'Moon in Sagittarius — Your emotions are optimistic, adventurous, and freedom-loving.',
      personality: 'You seek emotional freedom and adventure. Your feelings are expansive and optimistic. You need philosophical meaning to feel emotionally fulfilled.',
      challenges: 'Emotional restlessness and avoidance of deep feelings.',
      remedy: 'Offer water to the Moon on Mondays. Wear white or yellow. Practice emotional grounding.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
    Capricorn: {
      summary: 'Moon in Capricorn (Debilitated) — Your emotions are controlled, practical, and reserved.',
      personality: 'You process emotions through structure and discipline. You may appear emotionally cool but feel deeply inside. You seek emotional security through achievement.',
      challenges: 'Emotional suppression and difficulty expressing feelings.',
      remedy: 'Worship Lord Shiva on Mondays. Wear white or dark blue. Practice emotional expression.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
    Aquarius: {
      summary: 'Moon in Aquarius — Your emotions are detached, intellectual, and humanitarian.',
      personality: 'You process emotions through logic and ideals. You feel best when contributing to a cause greater than yourself. Your emotional needs include freedom and community.',
      challenges: 'Emotional detachment and difficulty with intimacy.',
      remedy: 'Serve the community on Mondays. Wear white or blue. Practice heart-centered meditation.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
    Pisces: {
      summary: 'Moon in Pisces — Your emotions are compassionate, mystical, and deeply sensitive.',
      personality: 'You are the most emotionally empathetic of all Moon signs. Your feelings are vast and oceanic. You have a natural connection to the spiritual and artistic dimensions.',
      challenges: 'Emotional escapism and over-sensitivity.',
      remedy: 'Offer water to the Moon on Mondays. Wear white or sea green. Practice grounding and boundary setting.',
      mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    },
  },
};

// ─── House Meanings ────────────────────────────────────────────────────────────

export interface HouseMeaning {
  number: number;
  title: string;
  area: string;
  description: string;
  keywords: string[];
  bodyPart: string;
}

export const HOUSE_MEANINGS: HouseMeaning[] = [
  { number: 1, title: 'First House', area: 'Self & Personality', bodyPart: 'Head, face',
    description: 'Represents your outward personality, physical appearance, and how others first perceive you. It is the mask you wear and the first impression you make. This house shows your approach to new beginnings and your overall vitality.',
    keywords: ['Self-image', 'Appearance', 'Vitality', 'First impressions', 'Beginnings'] },
  { number: 2, title: 'Second House', area: 'Values & Resources', bodyPart: 'Throat, neck',
    description: 'Governs your material resources, personal values, and what you treasure. It shows how you earn, spend, and relate to money and possessions. This house also relates to your sense of self-worth.',
    keywords: ['Money', 'Possessions', 'Self-worth', 'Values', 'Earning'] },
  { number: 3, title: 'Third House', area: 'Communication & Siblings', bodyPart: 'Lungs, arms, hands',
    description: 'Rules communication, learning, and your immediate environment. It covers siblings, neighbors, short trips, and your style of thinking. This house shows how you connect with others through words and ideas.',
    keywords: ['Communication', 'Siblings', 'Short trips', 'Learning', 'Neighbors'] },
  { number: 4, title: 'Fourth House', area: 'Home & Family', bodyPart: 'Chest, stomach',
    description: 'Represents your roots, home, family, and emotional foundation. It shows your relationship with parents (especially the mother), your sense of belonging, and where you feel most secure. This house also relates to property and the later years of life.',
    keywords: ['Home', 'Family', 'Roots', 'Mother', 'Inner foundation'] },
  { number: 5, title: 'Fifth House', area: 'Creativity & Romance', bodyPart: 'Heart, spine',
    description: 'Governs creativity, romance, children, and self-expression. It shows how you play, create, and fall in love. This house also relates to speculation, entertainment, and the joy of being yourself.',
    keywords: ['Creativity', 'Romance', 'Children', 'Self-expression', 'Fun'] },
  { number: 6, title: 'Sixth House', area: 'Health & Service', bodyPart: 'Intestines, digestive system',
    description: 'Rules daily routines, health, work, and service to others. It shows how you maintain your physical body and handle day-to-day responsibilities. This house also relates to pets and small animals.',
    keywords: ['Health', 'Daily routine', 'Work', 'Service', 'Habits'] },
  { number: 7, title: 'Seventh House', area: 'Partnerships & Marriage', bodyPart: 'Kidneys, lower back',
    description: 'Governs all partnerships, including marriage and business relationships. It shows what you seek in a partner and how you relate one-on-one. This house also relates to open enemies and legal matters.',
    keywords: ['Marriage', 'Partnerships', 'Business', 'Contracts', 'Other people'] },
  { number: 8, title: 'Eighth House', area: 'Transformation & Shared Resources', bodyPart: 'Reproductive organs',
    description: 'Rules transformation, shared resources, inheritance, and deep psychological matters. It covers intimacy, taxes, debts, and the cycle of birth and death. This house shows how you handle crisis and change.',
    keywords: ['Transformation', 'Shared money', 'Intimacy', 'Inheritance', 'Rebirth'] },
  { number: 9, title: 'Ninth House', area: 'Higher Learning & Philosophy', bodyPart: 'Hips, thighs, liver',
    description: 'Governs higher education, philosophy, religion, and long-distance travel. It shows your search for meaning and truth. This house also relates to teachers, gurus, and your belief system.',
    keywords: ['Higher education', 'Philosophy', 'Travel', 'Religion', 'Teachers'] },
  { number: 10, title: 'Tenth House', area: 'Career & Public Image', bodyPart: 'Bones, knees, teeth',
    description: 'Represents your career, public reputation, and life direction. It shows how the world sees your professional achievements. This house also relates to authority figures, especially the father.',
    keywords: ['Career', 'Reputation', 'Public image', 'Authority', 'Achievement'] },
  { number: 11, title: 'Eleventh House', area: 'Community & Aspirations', bodyPart: 'Ankles, circulatory system',
    description: 'Governs friendships, social networks, hopes, and long-term goals. It shows how you contribute to and benefit from community. This house also relates to income from career and collective endeavors.',
    keywords: ['Friends', 'Groups', 'Hopes', 'Dreams', 'Social networks'] },
  { number: 12, title: 'Twelfth House', area: 'Spirituality & the Unconscious', bodyPart: 'Feet, lymphatic system',
    description: 'Rules spirituality, the unconscious mind, solitude, and hidden matters. It shows where you seek retreat and spiritual connection. This house also relates to hospitals, ashrams, foreign lands, and letting go.',
    keywords: ['Spirituality', 'Solitude', 'Unconscious', 'Letting go', 'Hidden matters'] },
];

// ─── Vedic Planet Data ──────────────────────────────────────────────────────────

export interface VedicPlanet {
  deity: string;
  day: string;
  color: string;
  gemstone: string;
  mantra: string;
  number: number;
  direction: string;
  element: string;
}

export const VEDIC_PLANETS: Record<string, VedicPlanet> = {
  Sun: { deity: 'Surya', day: 'Sunday', color: 'Copper / Red', gemstone: 'Ruby', mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah', number: 1, direction: 'East', element: 'Fire' },
  Moon: { deity: 'Chandra', day: 'Monday', color: 'White / Pearl', gemstone: 'Pearl', mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah', number: 2, direction: 'Northwest', element: 'Water' },
  Mercury: { deity: 'Budha', day: 'Wednesday', color: 'Green', gemstone: 'Emerald', mantra: 'Om Bum Budhaaya Namah', number: 5, direction: 'North', element: 'Earth' },
  Venus: { deity: 'Shukra', day: 'Friday', color: 'White / Diamond', gemstone: 'Diamond', mantra: 'Om Shukraaya Namah', number: 6, direction: 'Southeast', element: 'Water' },
  Mars: { deity: 'Mangala', day: 'Tuesday', color: 'Red', gemstone: 'Red Coral', mantra: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah', number: 9, direction: 'South', element: 'Fire' },
  Jupiter: { deity: 'Guru (Brihaspati)', day: 'Thursday', color: 'Yellow / Saffron', gemstone: 'Yellow Sapphire', mantra: 'Om Graam Greem Graum Sah Gurave Namah', number: 3, direction: 'Northeast', element: 'Ether' },
  Saturn: { deity: 'Shani', day: 'Saturday', color: 'Blue / Black', gemstone: 'Blue Sapphire', mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namah', number: 8, direction: 'West', element: 'Air' },
};

// ─── Nakshatras (27 Lunar Mansions) ──────────────────────────────────────────────

export interface Nakshatra {
  name: string;
  ruler: string;
  deity: string;
  symbol: string;
  quality: string;
  range: string;
}

export const NAKSHATRAS: Nakshatra[] = [
  { name: 'Ashwini', ruler: 'Ketu', deity: 'Ashwini Kumaras', symbol: 'Horse\'s head', quality: 'Swift, healing', range: '0°–13°20\' Aries' },
  { name: 'Bharani', ruler: 'Venus', deity: 'Yama', symbol: 'Yoni (female organ)', quality: 'Creative, restrictive', range: '13°20\'–26°40\' Aries' },
  { name: 'Krittika', ruler: 'Sun', deity: 'Agni', symbol: 'Razor / Flame', quality: 'Purifying, sharp', range: '26°40\' Aries–10° Taurus' },
  { name: 'Rohini', ruler: 'Moon', deity: 'Brahma', symbol: 'Ox cart', quality: 'Nurturing, fertile', range: '10°–23°20\' Taurus' },
  { name: 'Mrigashira', ruler: 'Mars', deity: 'Soma', symbol: 'Deer head', quality: 'Searching, gentle', range: '23°20\' Taurus–6°40\' Gemini' },
  { name: 'Ardra', ruler: 'Rahu', deity: 'Rudra', symbol: 'Teardrop', quality: 'Stormy, intense', range: '6°40\'–20° Gemini' },
  { name: 'Punarvasu', ruler: 'Jupiter', deity: 'Aditi', symbol: 'Bow and quiver', quality: 'Renewing, abundant', range: '20° Gemini–3°20\' Cancer' },
  { name: 'Pushya', ruler: 'Saturn', deity: 'Brihaspati', symbol: 'Cow udder / Lotus', quality: 'Nourishing, auspicious', range: '3°20\'–16°40\' Cancer' },
  { name: 'Ashlesha', ruler: 'Mercury', deity: 'Nagas', symbol: 'Coiled serpent', quality: 'Cunning, hypnotic', range: '16°40\'–30° Cancer' },
  { name: 'Magha', ruler: 'Ketu', deity: 'Pitris (Ancestors)', symbol: 'Royal throne', quality: 'Honoring ancestors, proud', range: '0°–13°20\' Leo' },
  { name: 'Purva Phalguni', ruler: 'Venus', deity: 'Bhaga', symbol: 'Front of bed / Hammock', quality: 'Pleasure-loving, creative', range: '13°20\'–26°40\' Leo' },
  { name: 'Uttara Phalguni', ruler: 'Sun', deity: 'Aryaman', symbol: 'Back of bed', quality: 'Helpful, generous', range: '26°40\' Leo–10° Virgo' },
  { name: 'Hasta', ruler: 'Moon', deity: 'Savitar', symbol: 'Open hand', quality: 'Skillful, dexterous', range: '10°–23°20\' Virgo' },
  { name: 'Chitra', ruler: 'Mars', deity: 'Tvashtar', symbol: 'Bright jewel / Pearl', quality: 'Brilliant, artistic', range: '23°20\' Virgo–6°40\' Libra' },
  { name: 'Swati', ruler: 'Rahu', deity: 'Vayu', symbol: 'Young sprout / Sword', quality: 'Independent, flexible', range: '6°40\'–20° Libra' },
  { name: 'Vishakha', ruler: 'Jupiter', deity: 'Indra-Agni', symbol: 'Triumphal arch', quality: 'Goal-oriented, determined', range: '20° Libra–3°20\' Scorpio' },
  { name: 'Anuradha', ruler: 'Saturn', deity: 'Mitra', symbol: 'Lotus', quality: 'Friendly, devoted', range: '3°20\'–16°40\' Scorpio' },
  { name: 'Jyeshtha', ruler: 'Mercury', deity: 'Indra', symbol: 'Circular amulet / Umbrella', quality: 'Senior, protective', range: '16°40\'–30° Scorpio' },
  { name: 'Mula', ruler: 'Ketu', deity: 'Nirriti', symbol: 'Bunch of roots / Lion tail', quality: 'Root-seeking, destructive', range: '0°–13°20\' Sagittarius' },
  { name: 'Purva Ashadha', ruler: 'Venus', deity: 'Apah (Waters)', symbol: 'Fan / Winnow', quality: 'Invincible, early victory', range: '13°20\'–26°40\' Sagittarius' },
  { name: 'Uttara Ashadha', ruler: 'Sun', deity: 'Vishvadevas', symbol: 'Elephant tusk', quality: 'Later victory, righteous', range: '26°40\' Sagittarius–10° Capricorn' },
  { name: 'Shravana', ruler: 'Moon', deity: 'Vishnu', symbol: 'Ear / Three footprints', quality: 'Listening, learned', range: '10°–23°20\' Capricorn' },
  { name: 'Dhanishta', ruler: 'Mars', deity: 'Eight Vasus', symbol: 'Drum', quality: 'Wealthy, musical', range: '23°20\' Capricorn–6°40\' Aquarius' },
  { name: 'Shatabhisha', ruler: 'Rahu', deity: 'Varuna', symbol: 'Empty circle / 100 physicians', quality: 'Healing, secretive', range: '6°40\'–20° Aquarius' },
  { name: 'Purva Bhadrapada', ruler: 'Jupiter', deity: 'Aja Ekapada', symbol: 'Two-faced man / Sword', quality: 'Intense, spiritual', range: '20° Aquarius–3°20\' Pisces' },
  { name: 'Uttara Bhadrapada', ruler: 'Saturn', deity: 'Ahir Budhnya', symbol: 'Twin / Serpent', quality: 'Deep, wise', range: '3°20\'–16°40\' Pisces' },
  { name: 'Revati', ruler: 'Mercury', deity: 'Pushan', symbol: 'Fish / Drum', quality: 'Nourishing, journey', range: '16°40\'–30° Pisces' },
];

export function getNakshatra(moonDegree: number): Nakshatra {
  const idx = Math.floor((moonDegree / 360) * 27) % 27;
  return NAKSHATRAS[idx];
}

// ─── Ashta Koota (8-fold) Marriage Matching ──────────────────────────────────────

export interface KootaScore {
  name: string;
  englishName: string;
  maxPoints: number;
  points: number;
  description: string;
  boyValue: string;
  girlValue: string;
  compatible: boolean;
}

export interface CompatibilityResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  verdict: string;
  verdictColor: string;
  kootas: KootaScore[];
  summary: string;
  recommendations: string[];
}

// Nakshatra groups for various Koota calculations
const NAKSHATRA_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

const YONI_PAIRS: Record<string, string> = {
  Ashwini: 'Horse', Bharani: 'Elephant', Krittika: 'Sheep', Rohini: 'Serpent',
  Mrigashira: 'Serpent', Ardra: 'Dog', Punarvasu: 'Cat', Pushya: 'Sheep',
  Ashlesha: 'Cat', Magha: 'Rat', 'Purva Phalguni': 'Rat', 'Uttara Phalguni': 'Bull',
  Hasta: 'Buffalo', Chitra: 'Tiger', Swati: 'Buffalo', Vishakha: 'Tiger',
  Anuradha: 'Deer', Jyeshtha: 'Deer', Mula: 'Dog', 'Purva Ashadha': 'Monkey',
  'Uttara Ashadha': 'Mongoose', Shravana: 'Monkey', Dhanishta: 'Lion',
  Shatabhisha: 'Horse', 'Purva Bhadrapada': 'Lion', 'Uttara Bhadrapada': 'Cow', Revati: 'Elephant',
};

const YONI_COMPAT: Record<string, string[]> = {
  Horse: ['Horse', 'Monkey', 'Serpent'],
  Elephant: ['Elephant', 'Serpent', 'Buffalo'],
  Sheep: ['Sheep', 'Serpent', 'Monkey'],
  Serpent: ['Serpent', 'Horse', 'Sheep'],
  Dog: ['Dog', 'Rat', 'Cat'],
  Cat: ['Cat', 'Rat', 'Dog'],
  Rat: ['Rat', 'Dog', 'Cat'],
  Bull: ['Bull', 'Buffalo', 'Cow'],
  Buffalo: ['Buffalo', 'Bull', 'Elephant'],
  Tiger: ['Tiger', 'Deer', 'Monkey'],
  Deer: ['Deer', 'Tiger', 'Lion'],
  Monkey: ['Monkey', 'Horse', 'Sheep'],
  Mongoose: ['Mongoose', 'Cow', 'Lion'],
  Lion: ['Lion', 'Mongoose', 'Horse'],
  Cow: ['Cow', 'Bull', 'Mongoose'],
};

const GANA_TYPES: Record<string, 'Deva' | 'Manushya' | 'Rakshasa'> = {
  Ashwini: 'Deva', Bharani: 'Manushya', Krittika: 'Rakshasa', Rohini: 'Manushya',
  Mrigashira: 'Deva', Ardra: 'Manushya', Punarvasu: 'Deva', Pushya: 'Deva',
  Ashlesha: 'Rakshasa', Magha: 'Rakshasa', 'Purva Phalguni': 'Manushya', 'Uttara Phalguni': 'Manushya',
  Hasta: 'Deva', Chitra: 'Rakshasa', Swati: 'Deva', Vishakha: 'Rakshasa',
  Anuradha: 'Manushya', Jyeshtha: 'Rakshasa', Mula: 'Rakshasa', 'Purva Ashadha': 'Manushya',
  'Uttara Ashadha': 'Manushya', Shravana: 'Deva', Dhanishta: 'Rakshasa', Shatabhisha: 'Rakshasa',
  'Purva Bhadrapada': 'Manushya', 'Uttara Bhadrapada': 'Manushya', Revati: 'Deva',
};

const NADI_TYPES: Record<string, 'Aadi' | 'Madhya' | 'Antya'> = {
  Ashwini: 'Aadi', Bharani: 'Madhya', Krittika: 'Antya', Rohini: 'Aadi',
  Mrigashira: 'Madhya', Ardra: 'Antya', Punarvasu: 'Aadi', Pushya: 'Madhya',
  Ashlesha: 'Antya', Magha: 'Aadi', 'Purva Phalguni': 'Madhya', 'Uttara Phalguni': 'Antya',
  Hasta: 'Aadi', Chitra: 'Madhya', Swati: 'Antya', Vishakha: 'Aadi',
  Anuradha: 'Madhya', Jyeshtha: 'Antya', Mula: 'Aadi', 'Purva Ashadha': 'Madhya',
  'Uttara Ashadha': 'Antya', Shravana: 'Aadi', Dhanishta: 'Madhya', Shatabhisha: 'Antya',
  'Purva Bhadrapada': 'Aadi', 'Uttara Bhadrapada': 'Madhya', Revati: 'Antya',
};

function getNakshatraIndex(nakshatraName: string): number {
  return NAKSHATRAS.findIndex((n) => n.name === nakshatraName);
}

// 1. Varna (1 point) — spiritual compatibility
function calculateVarna(boyNak: string, girlNak: string): KootaScore {
  const boyIdx = getNakshatraIndex(boyNak);
  const girlIdx = getNakshatraIndex(girlNak);
  const boyVarna = Math.floor(boyIdx / 9);
  const girlVarna = Math.floor(girlNak ? getNakshatraIndex(girlNak) / 9 : 0);

  const varnaNames = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra'];
  const boyVarnaName = varnaNames[boyVarna] ?? 'Shudra';
  const girlVarnaName = varnaNames[girlVarna] ?? 'Shudra';

  let points = 0;
  if (boyVarna >= girlVarna) points = 1;
  const compatible = points === 1;

  return {
    name: 'वर्ण (Varna)',
    englishName: 'Spiritual Compatibility',
    maxPoints: 1,
    points,
    boyValue: boyVarnaName,
    girlValue: girlVarnaName,
    compatible,
    description: 'Varna represents spiritual compatibility and the capacity to absorb and reflect spiritual energy. A higher Varna for the boy is considered favorable. It reflects the spiritual evolution of both partners.',
  };
}

// 2. Vashya (2 points) — mutual attraction and control
function calculateVashya(boyNak: string, girlNak: string): KootaScore {
  const boyIdx = getNakshatraIndex(boyNak);
  const girlIdx = getNakshatraIndex(girlNak);
  const boySign = Math.floor(boyIdx / (27 / 12));
  const girlSign = Math.floor(girlIdx / (27 / 12));

  const vashyaGroups = [
    [0], [1], [2, 7], [3, 6, 11], [4], [5], [3, 6, 11], [2, 7], [8], [9], [10], [3, 6, 11],
  ];

  let points = 0;
  if (boySign === girlSign) points = 2;
  else if (vashyaGroups[boySign]?.includes(girlSign)) points = 1;

  const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  return {
    name: 'वश्य (Vashya)',
    englishName: 'Mutual Attraction & Control',
    maxPoints: 2,
    points,
    boyValue: signNames[boySign] ?? 'Unknown',
    girlValue: signNames[girlSign] ?? 'Unknown',
    compatible: points >= 1,
    description: 'Vashya represents the degree of mutual attraction and the balance of power in the relationship. It indicates how well the partners can maintain harmony and influence each other positively.',
  };
}

// 3. Tara (3 points) — mutual health and well-being
function calculateTara(boyNak: string, girlNak: string): KootaScore {
  const boyIdx = getNakshatraIndex(boyNak);
  const girlIdx = getNakshatraIndex(girlNak);

  const boyToGirl = ((girlIdx - boyIdx) % 27 + 27) % 27 + 1;
  const girlToBoy = ((boyIdx - girlIdx) % 27 + 27) % 27 + 1;

  const favorable = [1, 3, 5, 7, 8, 9, 11, 13, 15];
  const boyFav = favorable.includes(((boyToGirl - 1) % 9) + 1);
  const girlFav = favorable.includes(((girlToBoy - 1) % 9) + 1);

  let points = 0;
  if (boyFav && girlFav) points = 3;
  else if (boyFav || girlFav) points = 1.5;

  return {
    name: 'तारा (Tara)',
    englishName: 'Mutual Health & Well-being',
    maxPoints: 3,
    points,
    boyValue: `${boyToGirl}`,
    girlValue: `${girlToBoy}`,
    compatible: points >= 1.5,
    description: 'Tara represents the mutual health, well-being, and longevity of the partners. It is calculated by counting the distance between the two nakshatras. Favorable Tara positions ensure physical and mental harmony.',
  };
}

// 4. Yoni (4 points) — sexual and biological compatibility
function calculateYoni(boyNak: string, girlNak: string): KootaScore {
  const boyYoni = YONI_PAIRS[boyNak] ?? 'Unknown';
  const girlYoni = YONI_PAIRS[girlNak] ?? 'Unknown';

  let points = 0;
  if (boyYoni === girlYoni) points = 4;
  else if (YONI_COMPAT[boyYoni]?.includes(girlYoni)) points = 3;
  else if (YONI_COMPAT[girlYoni]?.includes(boyYoni)) points = 2;
  else {
    const allYonis = Object.keys(YONI_COMPAT);
    const boyIdx = allYonis.indexOf(boyYoni);
    const girlIdx = allYonis.indexOf(girlYoni);
    if (boyIdx >= 0 && girlIdx >= 0) {
      const diff = Math.abs(boyIdx - girlIdx);
      if (diff <= 2) points = 2;
      else if (diff <= 5) points = 1;
    }
  }

  return {
    name: 'योनि (Yoni)',
    englishName: 'Sexual & Biological Compatibility',
    maxPoints: 4,
    points,
    boyValue: boyYoni,
    girlValue: girlYoni,
    compatible: points >= 2,
    description: 'Yoni represents sexual compatibility and biological harmony between partners. Each nakshatra is associated with an animal yoni. Compatible yonis ensure physical intimacy and mutual satisfaction in the relationship.',
  };
}

// 5. Graha Maitri (5 points) — mental and intellectual compatibility
function calculateGrahaMaitri(boyMoonSign: ZodiacSign, girlMoonSign: ZodiacSign): KootaScore {
  const boyRuler = SIGN_TRAITS[boyMoonSign].ruler.split('/')[0];
  const girlRuler = SIGN_TRAITS[girlMoonSign].ruler.split('/')[0];

  const friendMap: Record<string, string[]> = {
    Sun: ['Moon', 'Mars', 'Jupiter'], Moon: ['Sun', 'Mercury'], Mars: ['Sun', 'Moon', 'Jupiter'],
    Mercury: ['Sun', 'Venus'], Jupiter: ['Sun', 'Moon', 'Mars'], Venus: ['Mercury', 'Saturn'],
    Saturn: ['Mercury', 'Venus'],
  };

  let points = 0;
  if (boyRuler === girlRuler) points = 5;
  else if (friendMap[boyRuler]?.includes(girlRuler) && friendMap[girlRuler]?.includes(boyRuler)) points = 5;
  else if (friendMap[boyRuler]?.includes(girlRuler) || friendMap[girlRuler]?.includes(boyRuler)) points = 3;
  else points = 1;

  return {
    name: 'ग्रह मैत्री (Graha Maitri)',
    englishName: 'Mental & Intellectual Compatibility',
    maxPoints: 5,
    points,
    boyValue: boyRuler,
    girlValue: girlRuler,
    compatible: points >= 3,
    description: 'Graha Maitri represents mental and intellectual compatibility. It is based on the friendship between the planetary rulers of the Moon signs. Good Graha Maitri ensures mental harmony and shared understanding.',
  };
}

// 6. Gana (6 points) — temperament compatibility
function calculateGana(boyNak: string, girlNak: string): KootaScore {
  const boyGana = GANA_TYPES[boyNak] ?? 'Manushya';
  const girlGana = GANA_TYPES[girlNak] ?? 'Manushya';

  let points = 0;
  if (boyGana === girlGana) points = 6;
  else if (boyGana === 'Deva' && girlGana === 'Manushya') points = 6;
  else if (boyGana === 'Manushya' && girlGana === 'Deva') points = 6;
  else if (boyGana === 'Deva' && girlGana === 'Rakshasa') points = 1;
  else if (boyGana === 'Rakshasa' && girlGana === 'Deva') points = 0;
  else if (boyGana === 'Manushya' && girlGana === 'Rakshasa') points = 1;
  else if (boyGana === 'Rakshasa' && girlGana === 'Manushya') points = 6;

  return {
    name: 'गण (Gana)',
    englishName: 'Temperament Compatibility',
    maxPoints: 6,
    points,
    boyValue: boyGana,
    girlValue: girlGana,
    compatible: points >= 3,
    description: 'Gana represents the temperament and nature of the partners. There are three types: Deva (divine), Manushya (human), and Rakshasa (demonic). Matching ganas ensure harmony in temperament and lifestyle.',
  };
}

// 7. Bhakoot (7 points) — emotional and love compatibility
function calculateBhakoot(boyMoonSign: ZodiacSign, girlMoonSign: ZodiacSign): KootaScore {
  const zodiacOrder: ZodiacSign[] = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const boyIdx = zodiacOrder.indexOf(boyMoonSign);
  const girlIdx = zodiacOrder.indexOf(girlMoonSign);

  const diff = Math.abs(boyIdx - girlIdx);
  const positions = [2, 12, 5, 9, 6, 8]; // 2/12, 5/9, 6/8 are problematic

  let points = 7;
  let issue = '';
  if (diff === 6 || diff === 8) { points = 0; issue = '6/8 (Shadashtaka)'; }
  else if (diff === 9 || diff === 5) { points = 0; issue = '5/9 (Navam-Panchama)'; }
  else if (diff === 2 || diff === 12) { points = 0; issue = '2/12 (Dwirdwadash)'; }
  else if (diff === 1 || diff === 11) { points = 5; issue = '3/11'; }
  else if (diff === 3 || diff === 10) { points = 6; issue = '4/10'; }
  else if (diff === 4 || diff === 7) { points = 7; issue = '5/7 or 1/1'; }

  return {
    name: 'भकूट (Bhakoot)',
    englishName: 'Emotional & Love Compatibility',
    maxPoints: 7,
    points,
    boyValue: boyMoonSign,
    girlValue: girlMoonSign,
    compatible: points >= 4,
    description: `Bhakoot represents emotional and love compatibility based on the Moon sign relationship. Position ${issue || '1/1 (same sign)'} is evaluated. Good Bhakoot ensures emotional bonding, love, and financial harmony in the relationship.`,
  };
}

// 8. Nadi (8 points) — genetic compatibility and health of progeny
function calculateNadi(boyNak: string, girlNak: string): KootaScore {
  const boyNadi = NADI_TYPES[boyNak] ?? 'Aadi';
  const girlNadi = NADI_TYPES[girlNak] ?? 'Aadi';

  let points = 8;
  if (boyNadi === girlNadi) points = 0;

  return {
    name: 'नाड़ी (Nadi)',
    englishName: 'Genetic Compatibility & Progeny Health',
    maxPoints: 8,
    points,
    boyValue: boyNadi,
    girlValue: girlNadi,
    compatible: points === 8,
    description: 'Nadi represents genetic compatibility and the health of progeny. There are three Nadis: Aadi (Vata), Madhya (Pitta), and Antya (Kapha). Same Nadi for both partners is considered unfavorable as it may affect the health of children.',
  };
}

export function calculateCompatibility(
  boyNakshatra: string,
  girlNakshatra: string,
  boyMoonSign: ZodiacSign,
  girlMoonSign: ZodiacSign,
): CompatibilityResult {
  const kootas: KootaScore[] = [
    calculateVarna(boyNakshatra, girlNakshatra),
    calculateVashya(boyNakshatra, girlNakshatra),
    calculateTara(boyNakshatra, girlNakshatra),
    calculateYoni(boyNakshatra, girlNakshatra),
    calculateGrahaMaitri(boyMoonSign, girlMoonSign),
    calculateGana(boyNakshatra, girlNakshatra),
    calculateBhakoot(boyMoonSign, girlMoonSign),
    calculateNadi(boyNakshatra, girlNakshatra),
  ];

  const totalScore = kootas.reduce((sum, k) => sum + k.points, 0);
  const maxScore = 36;
  const percentage = Math.round((totalScore / maxScore) * 100);

  let verdict = '';
  let verdictColor = '';
  let summary = '';

  if (totalScore >= 32) {
    verdict = 'Excellent Match';
    verdictColor = 'text-success';
    summary = 'This is an exceptional match with very high compatibility across all dimensions. The couple can expect a harmonious, loving, and prosperous marriage.';
  } else if (totalScore >= 24) {
    verdict = 'Very Good Match';
    verdictColor = 'text-success';
    summary = 'This is a very good match with strong compatibility. Minor differences can be easily resolved through mutual understanding and communication.';
  } else if (totalScore >= 18) {
    verdict = 'Good Match';
    verdictColor = 'text-accent';
    summary = 'This is a compatible match. While there are some areas of difference, the overall compatibility is favorable for a successful marriage with mutual effort.';
  } else if (totalScore >= 12) {
    verdict = 'Average Match';
    verdictColor = 'text-warning';
    summary = 'This match has moderate compatibility. There are significant differences that require conscious effort, patience, and understanding from both partners.';
  } else {
    verdict = 'Challenging Match';
    verdictColor = 'text-destructive';
    summary = 'This match has low compatibility. Significant differences exist across multiple dimensions. Careful consideration and remedial measures are strongly recommended.';
  }

  const recommendations: string[] = [];
  const failedKootas = kootas.filter((k) => !k.compatible);
  if (failedKootas.length > 0) {
    recommendations.push(`Areas needing attention: ${failedKootas.map((k) => k.englishName).join(', ')}.`);
  }
  if (kootas[7].points === 0) {
    recommendations.push('Nadi Dosha detected — consult a qualified Vedic astrologer for remedial measures. Chanting the Mahamrityunjaya Mantra and performing Nadi Shanti Puja are recommended.');
  }
  if (kootas[6].points === 0) {
    recommendations.push('Bhakoot Dosha detected — performing Bhakoot Shanti Puja and chanting Lord Shiva\'s mantras can help mitigate the effects.');
  }
  if (kootas[4].points < 3) {
    recommendations.push('Low Graha Maitri — improve mental compatibility through open communication, shared intellectual activities, and mutual respect for different viewpoints.');
  }
  if (totalScore >= 18) {
    recommendations.push('Overall compatibility is favorable. Regular prayer, mutual respect, and open communication will strengthen the bond.');
  }
  if (totalScore < 18) {
    recommendations.push('Consider consulting a qualified astrologer before proceeding. Remedial measures such as pujas, mantras, and gemstone recommendations may help improve compatibility.');
  }

  return {
    totalScore,
    maxScore,
    percentage,
    verdict,
    verdictColor,
    kootas,
    summary,
    recommendations,
  };
}

// ─── Retrograde Detection ───────────────────────────────────────────────────────

export function isPlanetRetrograde(planetName: string, _date: Date): boolean {
  // Simplified retrograde detection — in production, this would use
  // actual ephemeris data. For now, return false as the astrology engine
  // doesn't provide retrograde status directly.
  return false;
}

// ─── Planetary Aspect Meanings ──────────────────────────────────────────────────

export interface AspectInfo {
  planets: string;
  type: string;
  meaning: string;
}

export const ASPECT_MEANINGS: Record<string, AspectInfo> = {
  'Sun-Moon-conjunction': { planets: 'Sun & Moon', type: 'Conjunction (New Moon)', meaning: 'A powerful conjunction that aligns your conscious will with your emotional needs. You have a strong sense of self and inner unity.' },
  'Sun-Moon-opposition': { planets: 'Sun & Moon', type: 'Opposition (Full Moon)', meaning: 'You feel a pull between your conscious goals and emotional needs. Balancing these two forces is a central theme of your life.' },
  'Sun-Moon-trine': { planets: 'Sun & Moon', type: 'Trine', meaning: 'Harmonious flow between your identity and emotions. You feel comfortable in your own skin and express yourself naturally.' },
  'Sun-Moon-square': { planets: 'Sun & Moon', type: 'Square', meaning: 'Tension between your ego and emotions creates inner conflict. This friction drives personal growth and self-awareness.' },
  'Sun-Saturn-square': { planets: 'Sun & Saturn', type: 'Square', meaning: 'You may face challenges to your self-esteem from authority figures or through delays. Patience and discipline transform these into strength.' },
  'Sun-Jupiter-trine': { planets: 'Sun & Jupiter', type: 'Trine', meaning: 'Natural good fortune, optimism, and growth. You have a generous spirit and attract opportunities for expansion.' },
  'Moon-Venus-conjunction': { planets: 'Moon & Venus', type: 'Conjunction', meaning: 'You are naturally affectionate and emotionally expressive. Beauty, comfort, and love are central to your well-being.' },
  'Moon-Saturn-square': { planets: 'Moon & Saturn', type: 'Square', meaning: 'Emotional reserve and difficulty expressing feelings. Learning to open up and trust is a key life lesson.' },
  'Mars-Venus-conjunction': { planets: 'Mars & Venus', type: 'Conjunction', meaning: 'Passionate and magnetic. You pursue love and desire with intensity and charm. Creative and romantic energy is strong.' },
  'Mars-Saturn-square': { planets: 'Mars & Saturn', type: 'Square', meaning: 'Frustration between your drive and the restrictions you face. Channeling this tension into disciplined action brings success.' },
  'Jupiter-Saturn-conjunction': { planets: 'Jupiter & Saturn', type: 'Conjunction', meaning: 'A balance of expansion and contraction. You can build lasting success through optimism tempered with practical wisdom.' },
};

export function getAspectKey(planet1: string, planet2: string, aspectType: string): string {
  const sorted = [planet1, planet2].sort();
  return `${sorted[0]}-${sorted[1]}-${aspectType}`;
}

// ─── Life Area Predictions ──────────────────────────────────────────────────────

export interface LifeAreaPrediction {
  title: string;
  score: number;
  description: string;
  remedies: string[];
}

export function getLifeAreaPredictions(chart: BirthChartLike): LifeAreaPrediction[] {
  const predictions: LifeAreaPrediction[] = [];
  const getPlanet = (name: string) => chart.planets.find((p) => p.name === name);

  const sun = getPlanet('Sun');
  const moon = getPlanet('Moon');
  const mercury = getPlanet('Mercury');
  const venus = getPlanet('Venus');
  const mars = getPlanet('Mars');
  const jupiter = getPlanet('Jupiter');
  const saturn = getPlanet('Saturn');

  // Career
  const careerScore = Math.min(95, Math.max(45, ((sun?.house ?? 5) * 7 + (saturn?.degree ?? 10) * 3) % 100 + 40));
  predictions.push({
    title: 'Career & Profession',
    score: careerScore,
    description: `With Sun in ${sun?.sign ?? 'your chart'} and Saturn in ${saturn?.sign ?? 'your chart'}, your career path is influenced by ${SIGN_TRAITS[sun?.sign ?? 'Aries'].element} energy. ${sun ? PLANET_IN_SIGN.Sun?.[sun.sign]?.summary ?? '' : ''} Your professional strengths include ${SIGN_TRAITS[sun?.sign ?? 'Aries'].strengths.slice(0, 3).join(', ')}.`,
    remedies: [
      `Chant the Sun mantra "${VEDIC_PLANETS.Sun.mantra}" on Sundays at sunrise.`,
      `Wear ${VEDIC_PLANETS.Sun.color.toLowerCase()} colors on important work days.`,
      `Career fields suited for you: ${SIGN_TRAITS[sun?.sign ?? 'Aries'].careerFields.slice(0, 4).join(', ')}.`,
    ],
  });

  // Love & Marriage
  const loveScore = Math.min(95, Math.max(45, ((venus?.house ?? 5) * 8 + (moon?.degree ?? 15) * 2) % 100 + 40));
  predictions.push({
    title: 'Love & Marriage',
    score: loveScore,
    description: `Venus in ${venus?.sign ?? 'your chart'} governs your romantic nature. ${venus ? `Your approach to love is characterized by ${SIGN_TRAITS[venus.sign].nature.toLowerCase()}.` : ''} The Moon in ${moon?.sign ?? 'your chart'} influences your emotional responses in relationships.`,
    remedies: [
      `Worship Goddess Lakshmi on Fridays for marital harmony.`,
      `Wear ${VEDIC_PLANETS.Venus.color.toLowerCase()} on Fridays.`,
      `Chant "${VEDIC_PLANETS.Venus.mantra}" to strengthen Venus energy.`,
    ],
  });

  // Health
  const healthScore = Math.min(95, Math.max(45, ((mars?.house ?? 5) * 6 + (sun?.degree ?? 5) * 4) % 100 + 40));
  predictions.push({
    title: 'Health & Vitality',
    score: healthScore,
    description: `Mars in ${mars?.sign ?? 'your chart'} influences your physical energy and vitality. Your health focus area is ${SIGN_TRAITS[sun?.sign ?? 'Aries'].healthFocus}. Maintain regular exercise and a balanced diet to support your natural constitution.`,
    remedies: [
      `Chant the Mars mantra "${VEDIC_PLANETS.Mars.mantra}" on Tuesdays.`,
      `Focus on protecting your ${SIGN_TRAITS[sun?.sign ?? 'Aries'].bodyPart.toLowerCase()} area.`,
      `Practice yoga or meditation on ${VEDIC_PLANETS.Mars.day}s for vitality.`,
    ],
  });

  // Wealth
  const wealthScore = Math.min(95, Math.max(45, ((jupiter?.house ?? 5) * 9 + (venus?.degree ?? 10) * 2) % 100 + 40));
  predictions.push({
    title: 'Wealth & Prosperity',
    score: wealthScore,
    description: `Jupiter in ${jupiter?.sign ?? 'your chart'} governs your wealth and abundance. ${jupiter ? `Your ${SIGN_TRAITS[jupiter.sign].nature.toLowerCase()} nature attracts opportunities for growth.` : ''} Mercury in ${mercury?.sign ?? 'your chart'} influences your financial intelligence and business acumen.`,
    remedies: [
      `Chant "${VEDIC_PLANETS.Jupiter.mantra}" on Thursdays for abundance.`,
      `Wear ${VEDIC_PLANETS.Jupiter.color.toLowerCase()} on Thursdays.`,
      `Consider wearing a ${VEDIC_PLANETS.Jupiter.gemstone} (consult an astrologer first).`,
    ],
  });

  // Spiritual Growth
  const spiritualScore = Math.min(95, Math.max(45, ((jupiter?.house ?? 5) * 5 + (saturn?.degree ?? 15) * 3) % 100 + 40));
  predictions.push({
    title: 'Spiritual Growth',
    score: spiritualScore,
    description: `Your spiritual journey is influenced by Jupiter in ${jupiter?.sign ?? 'your chart'} and Saturn in ${saturn?.sign ?? 'your chart'}. These planets guide your search for higher meaning and karmic lessons. Meditation and self-reflection will bring profound insights.`,
    remedies: [
      `Meditate daily, especially on ${VEDIC_PLANETS.Jupiter.day}s and ${VEDIC_PLANETS.Saturn.day}s.`,
      `Chant the Gayatri Mantra at sunrise for spiritual illumination.`,
      `Practice charity and selfless service to balance karmic energies.`,
    ],
  });

  return predictions;
}

interface BirthChartLike {
  planets: { name: string; sign: ZodiacSign; degree: number; house: number }[];
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
}
