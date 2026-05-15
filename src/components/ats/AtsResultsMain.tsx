import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  UserSearch,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import type { RecruiterSimulation as RecruiterSimType } from '@/types/ats';

import { AtsReport } from '@/types/ats';
import { Badge } from '@/components/ui/badge';
import { BulletReviewCard } from './BulletReviewCard';
import { JdMatchSection } from './JdMatchSection';
import { cn } from '@/lib/utils';

interface AtsResultsMainProps {
  report: AtsReport;
}

type Tab = 'ats' | 'optimization' | 'jd' | 'recruiter';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'ats', label: 'ATS Report', icon: CheckCircle2 },
  { id: 'optimization', label: 'Optimization', icon: Lightbulb },
  { id: 'jd', label: 'JD Match', icon: Target },
  { id: 'recruiter', label: 'Recruiter View', icon: UserSearch },
];

export function AtsResultsMain({ report }: AtsResultsMainProps) {
  const [activeTab, setActiveTab] = useState<Tab>('ats');

  return (
    <div className="flex flex-col min-h-full">
      {/* Tab Bar */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border/40 px-6">
        <div className="flex gap-1 pt-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            // Hide JD tab if no jd_match data
            if (tab.id === 'jd' && !report.jd_match) return null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors',
                  isActive
                    ? 'text-foreground bg-muted/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'ats' && (
            <motion.div
              key="ats"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* ATS Essentials */}
              <Section title="ATS Essentials" icon={CheckCircle2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(report.ats_essentials).map(([key, passed]) => (
                    <div
                      key={key}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-xl border text-sm',
                        passed
                          ? 'bg-green-500/5 border-green-500/20'
                          : 'bg-red-500/5 border-red-500/20'
                      )}
                    >
                      <span className="capitalize text-foreground/90">{key.replace(/_/g, ' ')}</span>
                      {passed ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[11px]">
                          ✓ Pass
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[11px]">
                          ✗ Fail
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Section>

              {/* Risks */}
              {report.risks.length > 0 && (
                <Section title="Risks" icon={AlertCircle} titleClass="text-red-500">
                  <ul className="space-y-2.5">
                    {report.risks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Warnings */}
              {report.ats_warnings.length > 0 && (
                <Section title="ATS Warnings" icon={AlertTriangle} titleClass="text-yellow-500">
                  <ul className="space-y-2.5">
                    {report.ats_warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-yellow-500" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Detailed Feedback */}
              {report.feedback.length > 0 && (
                <Section title="Parser Feedback" icon={MessageSquare}>
                  <ul className="space-y-2">
                    {report.feedback.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                        <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </motion.div>
          )}

          {activeTab === 'optimization' && (
            <motion.div
              key="optimization"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Suggestions */}
              {report.suggestions.length > 0 && (
                <Section title="Optimization Suggestions" icon={Lightbulb}>
                  <ul className="space-y-3">
                    {report.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm bg-muted/30 border border-border/30 p-3.5 rounded-xl">
                        <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-foreground/85 leading-relaxed">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Bullet Reviews */}
              {report.bullet_reviews.length > 0 && (
                <Section title="Bullet Point Rewrites" icon={CheckCircle2}>
                  <div className="space-y-4">
                    {report.bullet_reviews.map((review, i) => (
                      <BulletReviewCard key={i} review={review} index={i} />
                    ))}
                  </div>
                </Section>
              )}

              {/* Keywords */}
              <div className="grid sm:grid-cols-2 gap-4">
                {report.strong_keywords.length > 0 && (
                  <Section title="Strong Keywords" icon={CheckCircle2} titleClass="text-green-500">
                    <div className="flex flex-wrap gap-2">
                      {report.strong_keywords.map((kw, i) => (
                        <Badge key={i} className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-[11px]">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </Section>
                )}
                {report.missing_keywords.length > 0 && (
                  <Section title="Missing Keywords" icon={AlertCircle} titleClass="text-red-500">
                    <div className="flex flex-wrap gap-2">
                      {report.missing_keywords.map((kw, i) => (
                        <Badge key={i} variant="outline" className="text-[11px] text-red-500 border-red-400/30">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </Section>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'jd' && report.jd_match && (
            <motion.div
              key="jd"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <JdMatchSection jdMatch={report.jd_match} />
            </motion.div>
          )}

          {activeTab === 'recruiter' && (
            <motion.div
              key="recruiter"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <RecruiterSimulation sim={report.recruiter_simulation} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Shared Section wrapper ─── */
function Section({
  title,
  icon: Icon,
  titleClass,
  children,
}: {
  title: string;
  icon: React.ElementType;
  titleClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/30 bg-muted/20">
        <Icon className={cn('w-4 h-4', titleClass ?? 'text-muted-foreground')} />
        <h2 className={cn('text-sm font-semibold', titleClass ?? 'text-foreground')}>{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ─── Recruiter Simulation ─── */
function RecruiterSimulation({ sim }: { sim: RecruiterSimType | undefined }) {
  if (!sim) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
        <UserSearch className="w-10 h-10 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No recruiter simulation data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* First Impression */}
      <div className="rounded-2xl border border-border/40 bg-card/50 p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <UserSearch className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">First Impression</p>
            <p className="text-[11px] text-muted-foreground">What a recruiter sees in 6 seconds</p>
          </div>
        </div>
        <p className="text-sm text-foreground/85 leading-relaxed bg-muted/30 rounded-xl p-4 border border-border/30 italic">
          "{sim.first_impression}"
        </p>
      </div>

      {/* Likely Concerns */}
      {sim.likely_concerns.length > 0 && (
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">Likely Concerns</p>
              <p className="text-[11px] text-muted-foreground">Red flags a recruiter may raise</p>
            </div>
          </div>
          <ul className="space-y-2.5">
            {sim.likely_concerns.map((concern, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-yellow-800 dark:text-yellow-200/80">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-yellow-500" />
                {concern}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Likely Outcome */}
      <div className="rounded-2xl border border-border/40 bg-card/50 p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Likely Outcome</p>
            <p className="text-[11px] text-muted-foreground">Predicted recruiter decision</p>
          </div>
        </div>
        <p className="text-sm text-foreground/85 leading-relaxed">{sim.likely_outcome}</p>
      </div>
    </div>
  );
}