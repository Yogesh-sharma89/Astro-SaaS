// features/kundali/pdf-generator.ts — generates a text-only structured future prediction PDF.

import type { BirthChart, UserProfile, ZodiacSign, PlanetName } from '@/types';
import { ZODIAC_SYMBOLS, PLANET_SYMBOLS } from '@/constants';
import {
  SIGN_TRAITS, HOUSE_MEANINGS, VEDIC_PLANETS, getNakshatra,
  getLifeAreaPredictions,
} from '@/services/astrology-data';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface PDFOptions {
  nakshatra: string;
  isPaid: boolean;
}

// Vimshottari Dasha periods (years)
const DASHA_PERIODS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

export function generateKundaliPDF(
  chart: BirthChart,
  profile: UserProfile,
  options: PDFOptions,
): string {
  const { nakshatra, isPaid } = options;

  const predictions = getLifeAreaPredictions(chart);
  const moonPlanet = chart.planets.find((p) => p.name === 'Moon');
  const nakshatraData = moonPlanet ? getNakshatra(moonPlanet.degree) : null;

  // Calculate Dasha sequence from Moon's nakshatra
  const nakshatraIndex = nakshatraData ? Math.floor((moonPlanet!.degree / 360) * 27) : 0;
  const dashaStartIndex = nakshatraIndex % 9;
  const birthYear = new Date(profile.birthDate).getFullYear();
  const dashaSequence = DASHA_ORDER.map((_, i) => DASHA_ORDER[(dashaStartIndex + i) % 9]);

  // Build Dasha timeline
  let currentYear = birthYear;
  const dashaTimeline = dashaSequence.map((lord) => {
    const years = DASHA_PERIODS[lord] ?? 7;
    const start = currentYear;
    const end = currentYear + years;
    currentYear = end;
    return { lord, start, end, years };
  });

  // Current Dasha
  const now = new Date().getFullYear();
  const currentDasha = dashaTimeline.find((d) => now >= d.start && now < d.end);
  const nextDasha = dashaTimeline.find((d) => d.start >= now);

  // Yearly transit forecast
  const transitForecast = generateTransitForecast(chart);

  // Remedial measures
  const remedies = generateRemedialMeasures(chart);

  const planetsXml = chart.planets.map((p) => {
    const traits = SIGN_TRAITS[p.sign];
    const vedic = VEDIC_PLANETS[p.name];
    return `
      <div class="planet-section">
        <h3>${PLANET_SYMBOLS[p.name] ?? ''} ${p.name} in ${p.sign}</h3>
        <p class="planet-meta">Degree: ${p.degree.toFixed(1)}°${p.house > 0 ? ` | House: ${p.house}` : ''}${p.retrograde ? ' | Retrograde' : ''}</p>
        <p class="planet-traits">Element: ${traits.element} | Quality: ${traits.quality} | Ruler: ${traits.ruler}</p>
        <p>${escapeXml(p.meaning)}</p>
        ${isPaid && vedic ? `
        <div class="vedic-box">
          <strong>Vedic Association:</strong> Deity: ${vedic.deity} | Day: ${vedic.day} | Gemstone: ${vedic.gemstone} | Color: ${vedic.color}<br/>
          <strong>Mantra:</strong> ${vedic.mantra}
        </div>` : ''}
      </div>`;
  }).join('');

  const housesXml = chart.houses.length > 0 ? `
    <div class="section">
      <h2>House Placements</h2>
      <table>
        <thead><tr><th>#</th><th>Sign</th><th>Degree</th><th>Life Area</th></tr></thead>
        <tbody>
          ${chart.houses.map((h) => {
            const meaning = HOUSE_MEANINGS.find((m) => m.number === h.number);
            return `<tr><td>${h.number}</td><td>${ZODIAC_SYMBOLS[h.sign]} ${h.sign}</td><td>${h.degree.toFixed(1)}°</td><td>${escapeXml(meaning?.area ?? '')}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>` : '';

  const predictionsXml = predictions.map((p, i) => `
    <div class="prediction-section">
      <h3>${i + 1}. ${escapeXml(p.title)}</h3>
      <p class="score-line">Favorability: ${p.score}%</p>
      <p>${escapeXml(p.description)}</p>
      <div class="remedy-box">
        <strong>Remedies:</strong>
        <ul>
          ${p.remedies.map((r) => `<li>${escapeXml(r)}</li>`).join('')}
        </ul>
      </div>
    </div>`).join('');

  const dashaXml = isPaid ? `
    <div class="section">
      <h2>Vimshottari Dasha Timeline</h2>
      <p class="intro-text">The Vimshottari Dasha system is a 120-year planetary period system based on your Moon's nakshatra (${nakshatra}). Each period is ruled by a planet and influences different phases of your life.</p>
      <table class="dasha-table">
        <thead><tr><th>Dasha Lord</th><th>Start Year</th><th>End Year</th><th>Duration</th><th>Status</th></tr></thead>
        <tbody>
          ${dashaTimeline.map((d) => {
            const isCurrent = currentDasha && d.lord === currentDasha.lord;
            return `<tr${isCurrent ? ' class="current-dasha"' : ''}>
              <td>${d.lord}</td><td>${d.start}</td><td>${d.end}</td><td>${d.years} years</td>
              <td>${isCurrent ? '◄ CURRENT' : ''}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      ${currentDasha ? `
        <div class="current-dasha-box">
          <h3>Current Dasha: ${currentDasha.lord} (${currentDasha.start} – ${currentDasha.end})</h3>
          <p>${getDashaEffect(currentDasha.lord)}</p>
        </div>` : ''}
      ${nextDasha ? `
        <div class="next-dasha-box">
          <h3>Next Dasha: ${nextDasha.lord} (starts ${nextDasha.start})</h3>
          <p>${getDashaEffect(nextDasha.lord)}</p>
        </div>` : ''}
    </div>` : '';

  const transitXml = isPaid ? `
    <div class="section">
      <h2>Yearly Transit Forecast (${now} – ${now + 1})</h2>
      <p class="intro-text">Planetary transits over your natal positions activate different life areas. Here's your forecast for the coming year:</p>
      ${transitForecast.map((t) => `
        <div class="transit-section">
          <h3>${t.planet} Transit in ${t.sign}</h3>
          <p><strong>Effect:</strong> ${escapeXml(t.effect)}</p>
          <p><strong>Life Area:</strong> ${t.lifeArea}</p>
          <p><strong>Timing:</strong> ${t.timing}</p>
        </div>`).join('')}
    </div>` : '';

  const remediesXml = isPaid ? `
    <div class="section">
      <h2>Personalized Remedial Measures</h2>
      <p class="intro-text">Based on your chart analysis, the following remedies can strengthen weak planets and enhance positive energies:</p>
      ${remedies.map((r) => `
        <div class="remedy-section">
          <h3>${r.title}</h3>
          <p>${escapeXml(r.description)}</p>
          <ul>
            ${r.actions.map((a) => `<li>${escapeXml(a)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>` : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Kundali Report — ${escapeXml(profile.name)}</title>
<style>
  @page { margin: 1.5cm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a2e; line-height: 1.7; padding: 20px; max-width: 800px; margin: 0 auto; }
  .header { text-align: center; padding: 30px 0; border-bottom: 3px double #c9a227; margin-bottom: 30px; }
  .header h1 { font-size: 28px; color: #1a1a2e; margin-bottom: 5px; }
  .header .subtitle { font-size: 14px; color: #666; }
  .header .name { font-size: 20px; color: #c9a227; margin-top: 8px; }
  .section { margin-bottom: 25px; page-break-inside: avoid; }
  .section h2 { font-size: 18px; color: #1a1a2e; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 12px; }
  .section h3 { font-size: 15px; color: #1a1a2e; margin-bottom: 6px; margin-top: 12px; }
  .intro-text { font-size: 13px; color: #555; margin-bottom: 10px; font-style: italic; }
  .birth-info { background: #f9f7f0; border-radius: 6px; padding: 12px; margin-bottom: 20px; font-size: 13px; }
  .birth-info strong { color: #1a1a2e; }
  .big-three { display: flex; justify-content: space-around; text-align: center; margin: 15px 0; }
  .big-three-item { flex: 1; }
  .big-three-item .label { font-size: 11px; text-transform: uppercase; color: #888; }
  .big-three-item .value { font-size: 18px; color: #1a1a2e; margin: 4px 0; }
  .big-three-item .traits { font-size: 11px; color: #666; }
  .nakshatra-box { text-align: center; background: #f9f7f0; border: 1px solid #c9a22733; border-radius: 6px; padding: 10px; margin: 15px 0; }
  .nakshatra-box .label { font-size: 11px; color: #888; }
  .nakshatra-box .value { font-size: 16px; color: #c9a227; }
  .planet-section { border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px; margin-bottom: 10px; page-break-inside: avoid; }
  .planet-meta { font-size: 12px; color: #666; margin-bottom: 4px; }
  .planet-traits { font-size: 11px; color: #888; margin-bottom: 6px; }
  .vedic-box { font-size: 11px; color: #555; background: #f9f7f0; padding: 8px; border-radius: 4px; margin-top: 6px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 12px; }
  th { background: #f9f7f0; font-weight: bold; }
  .dasha-table .current-dasha { background: #c9a2271a; font-weight: bold; }
  .current-dasha-box, .next-dasha-box { border: 1px solid #c9a22733; border-radius: 6px; padding: 10px; margin-top: 10px; background: #f9f7f0; }
  .prediction-section { border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px; margin-bottom: 10px; page-break-inside: avoid; }
  .score-line { font-size: 12px; color: #c9a227; font-weight: bold; margin-bottom: 6px; }
  .remedy-box { background: #f9f7f0; border-radius: 4px; padding: 8px; margin-top: 8px; }
  .remedy-box ul { padding-left: 20px; margin-top: 4px; }
  .remedy-box li { font-size: 12px; margin-bottom: 4px; }
  .transit-section { border: 1px solid #e0e0e0; border-radius: 6px; padding: 10px; margin-bottom: 8px; }
  .remedy-section { border: 1px solid #c9a22733; border-radius: 6px; padding: 10px; margin-bottom: 8px; background: #f9f7f0; }
  .remedy-section ul { padding-left: 20px; margin-top: 4px; }
  .remedy-section li { font-size: 12px; margin-bottom: 4px; }
  .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 11px; color: #888; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="header">
    <h1>Personalized Kundali & Future Prediction Report</h1>
    <div class="subtitle">Vedic & Western Astrological Life Forecast</div>
    <div class="name">${escapeXml(profile.name)}</div>
  </div>

  <div class="birth-info">
    <strong>Date of Birth:</strong> ${profile.birthDate}<br/>
    <strong>Time of Birth:</strong> ${profile.birthTimeUnknown ? 'Unknown' : profile.birthTime}<br/>
    <strong>Place of Birth:</strong> ${escapeXml(profile.birthPlace)}<br/>
    ${chart.ascendant ? `<strong>Ascendant (Lagna):</strong> ${ZODIAC_SYMBOLS[chart.ascendant]} ${chart.ascendant}<br/>` : ''}
    <strong>Generated:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
  </div>

  <div class="section">
    <h2>Your Cosmic Signature</h2>
    <div class="big-three">
      <div class="big-three-item">
        <div class="label">Sun Sign</div>
        <div class="value">${ZODIAC_SYMBOLS[chart.sunSign]} ${chart.sunSign}</div>
        <div class="traits">${SIGN_TRAITS[chart.sunSign].element} · ${SIGN_TRAITS[chart.sunSign].quality}</div>
      </div>
      <div class="big-three-item">
        <div class="label">Moon Sign</div>
        <div class="value">${ZODIAC_SYMBOLS[chart.moonSign]} ${chart.moonSign}</div>
        <div class="traits">${SIGN_TRAITS[chart.moonSign].element} · ${SIGN_TRAITS[chart.moonSign].quality}</div>
      </div>
      ${chart.ascendant ? `
      <div class="big-three-item">
        <div class="label">Rising Sign</div>
        <div class="value">${ZODIAC_SYMBOLS[chart.ascendant]} ${chart.ascendant}</div>
        <div class="traits">${SIGN_TRAITS[chart.ascendant].element} · ${SIGN_TRAITS[chart.ascendant].quality}</div>
      </div>` : ''}
    </div>
    <div class="nakshatra-box">
      <div class="label">Nakshatra (Lunar Mansion)</div>
      <div class="value">${nakshatra}</div>
      ${nakshatraData ? `<div style="font-size: 11px; color: #888; margin-top: 4px;">Ruler: ${nakshatraData.ruler} | Deity: ${nakshatraData.deity} | Symbol: ${nakshatraData.symbol}</div>` : ''}
    </div>
  </div>

  <div class="section">
    <h2>Planetary Placements & Meanings</h2>
    ${planetsXml}
  </div>

  ${housesXml}

  <div class="section">
    <h2>Life Predictions & Future Forecast</h2>
    <p class="intro-text">Based on your planetary positions, here are detailed predictions for key areas of your life with personalized remedies.</p>
    ${predictionsXml}
  </div>

  ${dashaXml}
  ${transitXml}
  ${remediesXml}

  <div class="footer">
    Generated by Astralis · ${new Date().getFullYear()}<br/>
    This report is for spiritual guidance and entertainment purposes only.
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  return URL.createObjectURL(blob);
}

function getDashaEffect(lord: string): string {
  const effects: Record<string, string> = {
    Ketu: 'A period of spiritual growth, detachment, and introspection. Past karmas surface for resolution. Focus on meditation and inner work.',
    Venus: 'A period of love, luxury, comfort, and artistic expression. Relationships flourish. Good time for marriage, partnerships, and creative endeavors.',
    Sun: 'A period of authority, recognition, and career advancement. Your ego and self-expression are highlighted. Focus on leadership and health.',
    Moon: 'A period of emotional growth, family, and public life. Your mind and emotions are heightened. Good for real estate, mother, and domestic matters.',
    Mars: 'A period of energy, courage, and action. Career takes off but conflicts may arise. Channel aggression into sports, fitness, or competitive fields.',
    Rahu: 'A period of ambition, worldly desires, and unconventional paths. Foreign connections, technology, and sudden gains are possible. Stay grounded.',
    Jupiter: 'A period of wisdom, expansion, and good fortune. Spiritual growth, higher education, children, and marriage are favored. A blessed period.',
    Saturn: 'A period of discipline, hard work, and karmic lessons. Slow but steady progress. Focus on career, responsibility, and long-term investments.',
    Mercury: 'A period of intellect, communication, and business. Education, writing, and analytical work flourish. Good for commerce and networking.',
  };
  return effects[lord] ?? 'This period brings the energies of the ruling planet into focus.';
}

interface TransitForecast {
  planet: string;
  sign: string;
  effect: string;
  lifeArea: string;
  timing: string;
}

function generateTransitForecast(chart: BirthChart): TransitForecast[] {
  const forecasts: TransitForecast[] = [];
  const now = new Date();

  const transits = [
    { planet: 'Saturn', sign: 'Pisces', effect: 'Saturn transiting through Pisces brings a period of spiritual discipline and emotional restructuring. You may face tests in your emotional foundations and spiritual beliefs. This is a time for building lasting inner strength.', lifeArea: 'Spirituality, emotional foundation', timing: 'Throughout the year' },
    { planet: 'Jupiter', sign: 'Gemini', effect: 'Jupiter in Gemini expands your communication, learning, and social connections. New opportunities for education, travel, and networking arise. Your optimism and curiosity grow.', lifeArea: 'Communication, education, travel', timing: 'Mid-year peak' },
    { planet: 'Rahu', sign: 'Pisces', effect: 'Rahu in Pisces creates a desire for spiritual exploration and foreign connections. You may feel drawn to unconventional spiritual paths. Be cautious of illusions and escapism.', lifeArea: 'Spirituality, foreign affairs', timing: 'Year-long influence' },
  ];

  // Add personalized transit based on chart
  const sunSign = chart.sunSign;
  forecasts.push({
    planet: 'Jupiter',
    sign: 'Gemini',
    effect: `For your ${sunSign} Sun, Jupiter's transit brings growth and opportunity to your communication and social sectors. New friendships and learning opportunities are favored.`,
    lifeArea: 'Social connections, learning',
    timing: 'Peak influence: ' + now.toLocaleDateString('en-US', { month: 'long' }),
  });

  forecasts.push(...transits);
  return forecasts;
}

interface RemedialMeasure {
  title: string;
  description: string;
  actions: string[];
}

function generateRemedialMeasures(chart: BirthChart): RemedialMeasure[] {
  const remedies: RemedialMeasure[] = [];

  chart.planets.forEach((p) => {
    const vedic = VEDIC_PLANETS[p.name];
    if (!vedic) return;

    // Determine if planet is weak or afflicted
    const isWeak = p.degree < 5 || p.degree > 25 || p.retrograde;

    if (isWeak || p.name === 'Sun' || p.name === 'Moon' || p.name === 'Saturn') {
      remedies.push({
        title: `${p.name} in ${p.sign} — Strengthening Measures`,
        description: `${p.name} in your chart is positioned at ${p.degree.toFixed(1)}° in ${p.sign}. ${p.retrograde ? 'This planet is retrograde, indicating karmic lessons related to its energies. ' : ''}The following remedies can help strengthen and balance ${p.name}'s energy in your life.`,
        actions: [
          `Chant the mantra: "${vedic.mantra}" — 108 times on ${vedic.day}s at sunrise.`,
          `Wear ${vedic.color.toLowerCase()} colors on ${vedic.day}s.`,
          `Consider wearing a ${vedic.gemstone} (consult a qualified astrologer before wearing gemstones).`,
          `Donate items related to ${p.name}: ${getDonationItems(p.name)}.`,
          `Face ${vedic.direction} while meditating or praying.`,
        ],
      });
    }
  });

  // General remedies
  remedies.push({
    title: 'General Well-being & Spiritual Protection',
    description: 'These general remedies help balance all planetary energies and protect against negative influences.',
    actions: [
      'Chant the Gayatri Mantra 108 times daily at sunrise for spiritual illumination and protection.',
      'Chant the Mahamrityunjaya Mantra for health and longevity protection.',
      'Practice Surya Namaskar (Sun Salutation) 12 times daily at sunrise.',
      'Offer water to the Sun at sunrise on Sundays.',
      'Keep your home clean and clutter-free to allow positive energy flow.',
      'Practice gratitude daily — thank the universe for your blessings.',
    ],
  });

  return remedies;
}

function getDonationItems(planet: string): string {
  const items: Record<string, string> = {
    Sun: 'wheat, copper, red flowers',
    Moon: 'rice, milk, white flowers, silver',
    Mercury: 'green vegetables, books, stationery',
    Venus: 'sweets, white flowers, perfumes, dairy',
    Mars: 'red lentils, red cloth, copper items',
    Jupiter: 'yellow items, chickpeas, gold items, books',
    Saturn: 'black sesame seeds, iron items, mustard oil, blue cloth',
  };
  return items[planet] ?? 'items related to the planet';
}
