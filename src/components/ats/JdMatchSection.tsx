import { motion } from 'framer-motion';

import { JdMatch } from '@/types/ats';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <span>🎯</span>
            JD Match Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Match Score */}
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                jdMatch.match_score >= 70
                  ? 'bg-green-500/10 text-green-600'
                  : jdMatch.match_score >= 50
                    ? 'bg-yellow-500/10 text-yellow-600'
                    : 'bg-red-500/10 text-red-600'
              }`}
            >
              {jdMatch.match_score}%
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {jdMatch.match_score >= 70
                  ? 'Strong Match'
                  : jdMatch.match_score >= 50
                    ? 'Partial Match'
                    : 'Weak Match'}
              </p>
              <p className="text-xs text-muted-foreground">with job description</p>
            </div>
          </div>

          {/* Matched Skills */}
          {jdMatch.matched_skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Matched Skills</p>
              <div className="flex flex-wrap gap-2">
                {jdMatch.matched_skills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="default"
                    className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                  >
                    ✓ {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {jdMatch.missing_skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {jdMatch.missing_skills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-xs text-red-600 border-red-300 dark:border-red-800"
                  >
                    ✗ {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}