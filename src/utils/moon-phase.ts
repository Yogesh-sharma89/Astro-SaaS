// utils/ — pure helper functions with no side effects.

/**
 * Calculate the moon phase for a given date.
 * Based on a well-known astronomical approximation: a synodic month is
 * ~29.53 days, and the known new-moon epoch is 2000-01-06 18:14 UTC.
 */
const SYNODIC_MONTH = 29.530588853;
const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14, 0);

const PHASE_NAMES = [
  { name: 'New Moon', emoji: '🌑' },
  { name: 'Waxing Crescent', emoji: '🌒' },
  { name: 'First Quarter', emoji: '🌓' },
  { name: 'Waxing Gibbous', emoji: '🌔' },
  { name: 'Full Moon', emoji: '🌕' },
  { name: 'Waning Gibbous', emoji: '🌖' },
  { name: 'Last Quarter', emoji: '🌗' },
  { name: 'Waning Crescent', emoji: '🌘' },
];

export function getMoonPhase(date = new Date()) {
  const diff = (date.getTime() - NEW_MOON_EPOCH) / 86400000;
  const age = ((diff % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const illumination = (1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) / 2;
  const phaseIndex = Math.floor(((age / SYNODIC_MONTH) * 8) + 0.5) % 8;
  const phase = PHASE_NAMES[phaseIndex];

  return {
    phase: phase.name,
    emoji: phase.emoji,
    illumination: Math.round(illumination * 100),
    age: Math.round(age * 10) / 10,
  };
}
