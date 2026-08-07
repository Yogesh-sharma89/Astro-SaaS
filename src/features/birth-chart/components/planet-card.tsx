// features/birth-chart/components/planet-card.tsx — expandable planet detail card.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Sparkles, Heart, Shield, Zap, Star } from 'lucide-react';
import type { PlanetPosition, ZodiacSign } from '@/types';
import { PLANET_SYMBOLS, ZODIAC_SYMBOLS } from '@/constants';
import { SIGN_TRAITS, PLANET_IN_SIGN, VEDIC_PLANETS, type PlanetInSign } from '@/services/astrology-data';
import { cn } from '@/lib/utils';

interface PlanetCardProps {
  planet: PlanetPosition;
}

export function PlanetCard({ planet }: PlanetCardProps) {
  const [expanded, setExpanded] = useState(false);
  const traits = SIGN_TRAITS[planet.sign];
  const interpretation: PlanetInSign | undefined = PLANET_IN_SIGN[planet.name]?.[planet.sign];
  const vedic = VEDIC_PLANETS[planet.name];

  return (
    <GlassCard className={cn('transition-all', expanded && 'ring-1 ring-primary/30')}>
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full p-5 text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-lg text-accent">
              {PLANET_SYMBOLS[planet.name]}
            </span>
            <div>
              <p className="font-medium text-foreground">{planet.name} in {planet.sign}</p>
              <p className="text-xs text-muted-foreground">
                {planet.retrograde ? '℞ ' : ''}{planet.degree.toFixed(1)}° · {traits.element} · {traits.quality}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {planet.house > 0 && (
              <Badge variant="outline" className="border-border text-muted-foreground">
                House {planet.house}
              </Badge>
            )}
            <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                {interpretation && (
                  <>
                    <div>
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Summary</p>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/90">{interpretation.summary}</p>
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-primary" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Personality</p>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{interpretation.personality}</p>
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5 text-cosmic-rose" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-cosmic-rose">Challenges</p>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{interpretation.challenges}</p>
                    </div>

                    <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-accent" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Remedy</p>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/90">{interpretation.remedy}</p>
                    </div>

                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-primary" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Mantra</p>
                      </div>
                      <p className="font-display text-sm italic text-foreground/90">{interpretation.mantra}</p>
                    </div>
                  </>
                )}

                {vedic && (
                  <div className="rounded-lg border border-border/50 bg-muted/10 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vedic Details</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Deity:</span> <span className="text-foreground">{vedic.deity}</span></div>
                      <div><span className="text-muted-foreground">Day:</span> <span className="text-foreground">{vedic.day}</span></div>
                      <div><span className="text-muted-foreground">Gemstone:</span> <span className="text-foreground">{vedic.gemstone}</span></div>
                      <div><span className="text-muted-foreground">Color:</span> <span className="text-foreground">{vedic.color}</span></div>
                      <div><span className="text-muted-foreground">Number:</span> <span className="text-foreground">{vedic.number}</span></div>
                      <div><span className="text-muted-foreground">Direction:</span> <span className="text-foreground">{vedic.direction}</span></div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {traits.strengths.map((s) => (
                    <Badge key={s} variant="outline" className="border-success/30 bg-success/5 text-success">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </GlassCard>
  );
}
