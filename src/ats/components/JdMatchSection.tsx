import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { JdMatch } from '@/shared/types/ats';

interface JdMatchSectionProps {
  jdMatch: JdMatch;
}

export function JdMatchSection({ jdMatch }: JdMatchSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/30 bg-muted/20">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">JD Match Score</h2>
        </div>

        <div className="flex flex-col md:flex-row items-stretch min-h-[300px]">
          {/* Left: Score (Centered Vertically) */}
          <div className="md:w-1/3 p-10 flex flex-col items-center justify-center text-center gap-4 bg-muted/5">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-black shadow-lg ${
                jdMatch.match_score >= 70
                  ? 'bg-success/10 text-success border border-success/20'
                  : jdMatch.match_score >= 50
                    ? 'bg-warning/10 text-warning border border-warning/20'
                    : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}
            >
              {jdMatch.match_score}%
            </div>
            <div>
              <p className="text-xl font-black text-foreground tracking-tight">
                {jdMatch.match_score >= 70
                  ? 'Strong Match'
                  : jdMatch.match_score >= 50
                    ? 'Partial Match'
                    : 'Weak Match'}
              </p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60 mt-1">
                JD Fit Score
              </p>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-border/40 to-transparent" />
          <div className="md:hidden h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

          {/* Right: Skills Stack */}
          <div className="flex-1 p-10 flex flex-col justify-center gap-8">
            {/* Matched Skills */}
            {jdMatch.matched_skills.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Matched Skills
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jdMatch.matched_skills.map((skill, i) => (
                    <Badge
                      key={i}
                      variant="default"
                      className="text-[11px] font-medium py-1 px-3 bg-success/5 text-success border border-success/10 rounded-full hover:bg-success/10 transition-colors"
                    >
                      ✓ {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {jdMatch.missing_skills.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Missing Skills
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jdMatch.missing_skills.map((skill, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-[11px] font-medium py-1 px-3 text-destructive border border-destructive/10 rounded-full bg-destructive/5 hover:bg-destructive/10 transition-colors"
                    >
                      ✗ {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
