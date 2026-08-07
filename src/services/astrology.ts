// services/ — API layer. One file per domain.
// astrology.ts: real birth chart calculation using astronomy-engine.
//
// Uses Astronomy Engine (https://github.com/cosinekitty/astronomy) by Don Cross.
// Validated against NASA/JPL Horizons data. Computes geocentric ecliptic
// longitudes for planets, the Moon, and the Sun, plus the ascendant and
// house cusps using the Equal House system.
//
// Sanity check: 1990-08-24, 10:30 AM, New York (40.7128, -74.0060)
// Expected Sun in Virgo ~0°, Moon in Aries, Ascendant in Sagittarius.

import {
  AstroTime, Body, Ecliptic, EclipticGeoMoon, GeoVector, Observer,
  SiderealTime, SunPosition,
} from 'astronomy-engine';
import type { BirthChart, PlanetPosition, UserProfile, ZodiacSign } from '@/types';

const ZODIAC: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const MEANINGS: Record<string, string> = {
  Sun: 'Your core identity, ego, and the essence of who you are. It represents your conscious self and life force.',
  Moon: 'Your emotional nature, inner world, and instinctive reactions. It governs how you process feelings and seek comfort.',
  Mercury: 'How you think, communicate, and process information. It shapes your mental style and learning approach.',
  Venus: 'What you value, how you love, and what brings you pleasure. It governs attraction, beauty, and relationships.',
  Mars: 'Your drive, energy, and assertiveness. It represents how you take action and pursue your desires.',
  Jupiter: 'Growth, expansion, and optimism. It shows where you find luck, abundance, and philosophical meaning.',
  Saturn: 'Structure, discipline, and responsibility. It reveals your challenges and the lessons that build character.',
  Ascendant: 'Your outward personality, how others first see you, and the lens through which you experience life.',
};

function signFromLongitude(lon: number): ZodiacSign {
  return ZODIAC[Math.floor(lon / 30) % 12];
}

function degreeInSign(lon: number): number {
  return Math.round((lon % 30) * 100) / 100;
}

/** Compute geocentric ecliptic longitude for a planet in degrees [0, 360). */
function planetLongitude(body: Body, time: AstroTime): number {
  const vec = GeoVector(body, time, true);
  const ecl = Ecliptic(vec);
  return ((ecl.elon % 360) + 360) % 360;
}

/** Compute the ascendant degree from sidereal time and observer latitude. */
function ascendantDegree(siderealHours: number, latitude: number): number {
  const ramc = siderealHours * 15;
  const obliquity = 23.4367;
  const latRad = (latitude * Math.PI) / 180;
  const oblRad = (obliquity * Math.PI) / 180;
  const ramcRad = (ramc * Math.PI) / 180;

  const ascRad = Math.atan2(
    Math.cos(ramcRad),
    -Math.sin(ramcRad) * Math.cos(oblRad) - Math.tan(latRad) * Math.sin(oblRad)
  );
  let ascDeg = (ascRad * 180) / Math.PI;
  if (ascDeg < 0) ascDeg += 360;
  return ascDeg;
}

/** Build a Date from the profile's birth date + time (or noon if unknown). */
function buildBirthDate(profile: UserProfile): { date: Date; timeKnown: boolean } {
  const timeKnown = !profile.birthTimeUnknown && !!profile.birthTime;
  const time = timeKnown ? profile.birthTime : '12:00';
  const [h, m] = time.split(':').map(Number);
  const date = new Date(profile.birthDate);
  date.setUTCHours(h || 12, m || 0, 0, 0);
  return { date, timeKnown };
}

const PLANET_BODIES: { name: PlanetPosition['name']; body: Body }[] = [
  { name: 'Sun', body: Body.Sun },
  { name: 'Moon', body: Body.Moon },
  { name: 'Mercury', body: Body.Mercury },
  { name: 'Venus', body: Body.Venus },
  { name: 'Mars', body: Body.Mars },
  { name: 'Jupiter', body: Body.Jupiter },
  { name: 'Saturn', body: Body.Saturn },
];

export async function generateBirthChart(profile: UserProfile): Promise<BirthChart> {
  await new Promise((r) => setTimeout(r, 1500));

  const { date, timeKnown } = buildBirthDate(profile);
  const time = new AstroTime(date);

  const lat = profile.latitude ?? 0;
  const lng = profile.longitude ?? 0;

  const sunLon = SunPosition(time).elon;
  const moonLon = EclipticGeoMoon(time).lon;

  const planets: PlanetPosition[] = PLANET_BODIES.map(({ name, body }) => {
    const lon = name === 'Sun' ? sunLon : name === 'Moon' ? moonLon : planetLongitude(body, time);
    return {
      name,
      sign: signFromLongitude(lon),
      degree: degreeInSign(lon),
      house: 0,
      retrograde: false,
      meaning: MEANINGS[name] ?? '',
    };
  });

  let ascendant: ZodiacSign | null = null;
  let houses: BirthChart['houses'] = [];

  if (timeKnown) {
    const observer = new Observer(lat, lng, 0);
    const sidHours = SiderealTime(date);
    const ascDeg = ascendantDegree(sidHours, observer.latitude);
    ascendant = signFromLongitude(ascDeg);

    houses = Array.from({ length: 12 }, (_, i) => {
      const cuspDeg = (ascDeg + i * 30) % 360;
      return {
        number: i + 1,
        sign: signFromLongitude(cuspDeg),
        degree: degreeInSign(cuspDeg),
      };
    });

    for (const p of planets) {
      const lon = p.name === 'Sun' ? sunLon : p.name === 'Moon' ? moonLon : planetLongitude(
        PLANET_BODIES.find((b) => b.name === p.name)!.body, time
      );
      const houseIdx = Math.floor((((lon - ascDeg) % 360 + 360) % 360) / 30);
      p.house = houseIdx + 1;
    }
  }

  return {
    id: crypto.randomUUID(),
    sunSign: signFromLongitude(sunLon),
    moonSign: signFromLongitude(moonLon),
    ascendant,
    birthTimeKnown: timeKnown,
    houses,
    planets,
    generatedAt: new Date().toISOString(),
  };
}
