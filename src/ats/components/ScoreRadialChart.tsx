import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/shared/lib/utils';

interface ScoreRadialChartProps {
  score: number;
  grade: string;
  size?: number;
}

const GRADE_CONFIG: Record<string, { color: string; label: string; bg: string }> = {
  A: { color: 'hsl(var(--success))', label: 'Excellent', bg: 'bg-success/10' },
  B: { color: 'hsl(var(--success))', label: 'Good', bg: 'bg-success/10' },
  C: { color: 'hsl(var(--warning))', label: 'Fair', bg: 'bg-warning/10' },
  D: { color: 'hsl(var(--warning))', label: 'Poor', bg: 'bg-warning/10' },
  F: { color: 'hsl(var(--destructive))', label: 'Fail', bg: 'bg-destructive/10' },
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

        {/* Main progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gradeConfig.color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          strokeLinecap="round"
          opacity={0.95}
        />
      </svg>

      {/* Center content — perfectly centred with inset-0 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <div className="flex flex-col items-center">
          <div className="relative">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={cn(
                'text-6xl font-bold tabular-nums leading-none tracking-tighter',
                score >= 70 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-destructive',
              )}
            >
              {Math.round(score)}
            </motion.span>
            <span
              className={cn(
                'absolute top-1/2 -translate-y-1/2 left-full ml-1 text-[10px] font-bold opacity-60',
                score >= 70 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-destructive',
              )}
            >
              %
            </span>
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-80"
          >
            Optimized
          </motion.span>
        </div>

        <div className="flex flex-col items-center mt-2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="text-2xl font-bold text-foreground leading-none"
          >
            {grade}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mt-1.5 opacity-80"
          >
            Grade
          </motion.span>
        </div>
      </div>
    </div>
  );
}
