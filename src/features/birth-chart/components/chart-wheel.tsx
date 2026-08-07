// features/birth-chart/ — birth chart visualization and planet detail cards.

import type { BirthChart, PlanetPosition } from '@/types';
import { PLANET_SYMBOLS, ZODIAC_SYMBOLS } from '@/constants';

interface ChartWheelProps {
  chart: BirthChart;
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, rOuter: number, rInner: number, startDeg: number, endDeg: number) {
  const o1 = polarToCartesian(cx, cy, rOuter, startDeg);
  const o2 = polarToCartesian(cx, cy, rOuter, endDeg);
  const i1 = polarToCartesian(cx, cy, rInner, endDeg);
  const i2 = polarToCartesian(cx, cy, rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${o1.x} ${o1.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${o2.x} ${o2.y} L ${i1.x} ${i1.y} A ${rInner} ${rInner} 0 ${large} 0 ${i2.x} ${i2.y} Z`;
}

const ZODIAC_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

const ZODIAC_COLORS: Record<string, string> = {
  Aries: '#ff6b6b', Taurus: '#88c97a', Gemini: '#f4d35e', Cancer: '#6bb6c4',
  Leo: '#ffa94d', Virgo: '#9c8c6e', Libra: '#c4a6d4', Scorpio: '#c44848',
  Sagittarius: '#e07856', Capricorn: '#6b7280', Aquarius: '#5e9bd8', Pisces: '#8db4d8',
};

export function ChartWheel({ chart, size = 380 }: ChartWheelProps) {
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 4;
  const rZodiac = rOuter * 0.92;
  const rInner = rOuter * 0.72;
  const rInnerMost = rOuter * 0.42;
  const rPlanet = (rZodiac + rInner) / 2;
  const hasHouses = chart.houses.length > 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-md mx-auto">
      <defs>
        <radialGradient id="chartGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(258 75% 56% / 0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <circle cx={cx} cy={cy} r={rOuter} fill="url(#chartGlow)" />

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="hsl(var(--border))" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={rZodiac} fill="none" stroke="hsl(var(--border))" strokeWidth={0.5} />
      <circle cx={cx} cy={cy} r={rInner} fill="none" stroke="hsl(var(--border))" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={rInnerMost} fill="none" stroke="hsl(var(--border))" strokeWidth={0.5} opacity={0.4} />

      {/* Zodiac sign ring (colored segments) */}
      {ZODIAC_ORDER.map((sign, i) => {
        const startDeg = i * 30;
        const endDeg = startDeg + 30;
        const mid = polarToCartesian(cx, cy, (rOuter + rZodiac) / 2, startDeg + 15);
        return (
          <g key={`zodiac-${sign}`}>
            <path
              d={arcPath(cx, cy, rOuter, rZodiac, startDeg, endDeg)}
              fill={ZODIAC_COLORS[sign]}
              fillOpacity={0.08}
              stroke="hsl(var(--border))"
              strokeWidth={0.3}
            />
            <text
              x={mid.x}
              y={mid.y}
              fontSize={11}
              fill={ZODIAC_COLORS[sign]}
              fillOpacity={0.8}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {ZODIAC_SYMBOLS[sign]}
            </text>
          </g>
        );
      })}

      {/* House wedges — only if birth time is known */}
      {hasHouses && chart.houses.map((house) => {
        const startDeg = (house.number - 1) * 30;
        const endDeg = startDeg + 30;
        return (
          <g key={`house-${house.number}`}>
            <path
              d={arcPath(cx, cy, rInner, rInnerMost, startDeg, endDeg)}
              fill="hsl(var(--primary) / 0.03)"
              stroke="hsl(var(--border))"
              strokeWidth={0.4}
            />
          </g>
        );
      })}

      {/* Spokes */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30;
        const p1 = polarToCartesian(cx, cy, rZodiac, angle);
        const p2 = polarToCartesian(cx, cy, rOuter, angle);
        return <line key={`spoke-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="hsl(var(--border))" strokeWidth={0.5} />;
      })}

      {/* Inner spokes */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30;
        const p1 = polarToCartesian(cx, cy, rInnerMost, angle);
        const p2 = polarToCartesian(cx, cy, rInner, angle);
        return <line key={`in-spoke-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="hsl(var(--border))" strokeWidth={0.3} opacity={0.4} />;
      })}

      {/* Planets — positioned by ecliptic longitude (0° = Aries start = top) */}
      {chart.planets.map((p: PlanetPosition) => {
        const signIndex = ZODIAC_ORDER.indexOf(p.sign);
        const totalDeg = signIndex * 30 + p.degree;
        const pos = polarToCartesian(cx, cy, rPlanet, totalDeg);
        const color = ZODIAC_COLORS[p.sign] ?? 'hsl(var(--accent))';
        return (
          <g key={`planet-${p.name}`}>
            <circle cx={pos.x} cy={pos.y} r={13} fill="hsl(var(--card))" stroke={color} strokeWidth={1.5} />
            <text x={pos.x} y={pos.y} fontSize={12} fill="hsl(var(--accent))" textAnchor="middle" dominantBaseline="middle" className="font-display">
              {PLANET_SYMBOLS[p.name]}
            </text>
          </g>
        );
      })}

      {/* Center medallion */}
      <circle cx={cx} cy={cy} r={rInnerMost * 0.7} fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={rInnerMost * 0.55} fill="none" stroke="hsl(var(--accent) / 0.2)" strokeWidth={0.5} />
      <text x={cx} y={cy - 10} fontSize={13} fill="hsl(var(--accent))" textAnchor="middle" dominantBaseline="middle" className="font-display">
        {ZODIAC_SYMBOLS[chart.sunSign]}
      </text>
      <text x={cx} y={cy + 4} fontSize={8} fill="hsl(var(--muted-foreground))" textAnchor="middle" dominantBaseline="middle">
        Sun
      </text>
      <text x={cx} y={cy + 18} fontSize={13} fill="hsl(var(--primary))" textAnchor="middle" dominantBaseline="middle" className="font-display">
        {ZODIAC_SYMBOLS[chart.moonSign]}
      </text>
      <text x={cx} y={cy + 30} fontSize={8} fill="hsl(var(--muted-foreground))" textAnchor="middle" dominantBaseline="middle">
        Moon
      </text>
    </svg>
  );
}
