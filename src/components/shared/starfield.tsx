// components/shared/ — composed components built FROM shadcn primitives + custom styling.

import { useMemo } from 'react';

interface StarfieldProps {
  count?: number;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export function Starfield({ count = 80, className = '' }: StarfieldProps) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, [count]);

  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
