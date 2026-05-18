import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, CheckCircle2, TrendingUp } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AtsReport } from '@/types/ats';

import { ScoreRadialChart } from './ScoreRadialChart';

interface AtsResultsSidebarProps {
  report: AtsReport;
  onBack: () => void;
}

const SECTION_LABELS: Record<keyof AtsReport['scores'], string> = {
  formatting: 'Formatting',
  keywords: 'Keywords',
  experience: 'Experience',
  skills: 'Skills',
  impact: 'Impact',
  readability: 'Readability',
  repetition: 'Repetition',
  grammar: 'Grammar',
  parse_rate: 'Parse Rate',
};

export function AtsResultsSidebar({ report, onBack }: AtsResultsSidebarProps) {
  const gradeLetter = report.grade.charAt(0).toUpperCase();

  const gradeConfig = (
    {
      A: {
        color: 'text-success',
        bg: 'bg-success/10',
        border: 'border-success/25',
        glow: 'shadow-success/10',
      },
      B: {
        color: 'text-success',
        bg: 'bg-success/10',
        border: 'border-success/25',
        glow: 'shadow-success/10',
      },
      C: {
        color: 'text-warning',
        bg: 'bg-warning/10',
        border: 'border-warning/25',
        glow: 'shadow-warning/10',
      },
      D: {
        color: 'text-warning',
        bg: 'bg-warning/10',
        border: 'border-warning/25',
        glow: 'shadow-warning/10',
      },
      F: {
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        border: 'border-destructive/25',
        glow: 'shadow-destructive/10',
      },
    } as const
  )[gradeLetter as 'A' | 'B' | 'C' | 'D' | 'F'] ?? {
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/25',
    glow: 'shadow-destructive/10',
  };

  const passProbability = Math.min(
    100,
    Math.max(
      0,
      report.overall_score +
        (report.overall_score >= 75 ? 10 : report.overall_score >= 50 ? 0 : -15),
    ),
  );

  const probColor =
    passProbability >= 70
      ? 'text-success'
      : passProbability >= 40
        ? 'text-warning'
        : 'text-destructive';
  const ProbIcon = passProbability >= 70 ? CheckCircle2 : AlertTriangle;

  const sortedScores = Object.entries(report.scores).sort(([, a], [, b]) => b - a);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex flex-col gap-5 p-5"
    >
      {/* Back Button */}
      <div className="mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 rounded-full hover:bg-accent transition-all group px-4 h-9"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span className="text-[11px] font-semibold tracking-wide">Back</span>
        </Button>
      </div>

      {/* Score wheel */}
      <div className="flex flex-col items-center pt-4 pb-2">
        <ScoreRadialChart score={report.overall_score} grade={gradeLetter} size={220} />
        <p className="text-[11px] text-muted-foreground mt-4 font-bold uppercase tracking-[0.2em]">ATS Score</p>
      </div>



      {/* Section Scores */}
      <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Section Scores
          </p>
        </div>
        <div className="space-y-3">
          {sortedScores.map(([key, value]) => {
            const label = SECTION_LABELS[key as keyof typeof SECTION_LABELS];
            const barColor =
              value >= 70 ? 'bg-success' : value >= 50 ? 'bg-warning' : 'bg-destructive';
            const textColor =
              value >= 70 ? 'text-success' : value >= 50 ? 'text-warning' : 'text-destructive';

            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground/80">{label}</span>
                  <span className={cn('text-xs font-bold tabular-nums', textColor)}>{value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    className={cn('h-full rounded-full', barColor)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Warnings */}
      {report.ats_warnings.length > 0 && (
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warning">
              Warnings
            </p>
          </div>
          <ul className="space-y-2">
            {report.ats_warnings.map((w, i) => (
              <li
                key={i}
                className="text-xs text-warning dark:text-warning/80 leading-relaxed flex gap-2"
              >
                <span className="shrink-0 mt-0.5">—</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}


