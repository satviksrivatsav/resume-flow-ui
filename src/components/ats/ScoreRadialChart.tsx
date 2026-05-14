import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface ScoreRadialChartProps {
  score: number;
  grade: string;
  size?: number;
}

const GRADE_CONFIG: Record<string, { color: string; label: string; bg: string }> = {
  A: { color: '#22c55e', label: 'Excellent', bg: 'bg-green-500/10' },
  B: { color: '#84cc16', label: 'Good', bg: 'bg-lime-500/10' },
  C: { color: '#eab308', label: 'Fair', bg: 'bg-yellow-500/10' },
  D: { color: '#f97316', label: 'Poor', bg: 'bg-orange-500/10' },
  F: { color: '#ef4444', label: 'Fail', bg: 'bg-red-500/10' },
};

export function ScoreRadialChart({ score, grade, size = 200 }: ScoreRadialChartProps) {
  const [animated, setAnimated] = useState(false);
  const gradeConfig = GRADE_CONFIG[grade] || GRADE_CONFIG.F;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated ? score / 100 : 0) * circumference;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeOpacity={0.2}
        />

        {/* Glow layer behind the arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gradeConfig.color}
          strokeWidth={strokeWidth + 10}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          opacity={0.08}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Main progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gradeConfig.color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          opacity={0.95}
        />
      </svg>

      {/* Center content — perfectly centred with inset-0 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={cn(
            'text-5xl font-bold tabular-nums leading-none',
            score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400',
          )}
        >
          {Math.round(score)}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mt-1"
        >
          {grade}
        </motion.span>
      </div>
    </div>
  );
}
