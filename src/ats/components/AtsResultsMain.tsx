import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  MessageSquare,
  Target,
  UserSearch,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { RecruiterSimulation as RecruiterSimType } from '@/shared/types/ats';
import { AtsReport } from '@/shared/types/ats';

import { BulletReviewCard } from './BulletReviewCard';
import { JdMatchSection } from './JdMatchSection';

interface AtsResultsMainProps {
  report: AtsReport;
  onGoToBuilder: () => void;
  onSaveReport: () => void;
  isSaving: boolean;
}

type Tab = 'ats' | 'optimization' | 'jd' | 'recruiter';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'ats', label: 'ATS Report', icon: CheckCircle2 },
  { id: 'optimization', label: 'Optimization', icon: Lightbulb },
  { id: 'jd', label: 'JD Match', icon: Target },
  { id: 'recruiter', label: 'Recruiter View', icon: UserSearch },
];

export function AtsResultsMain({
  report,
  onGoToBuilder,
  onSaveReport,
  isSaving,
}: AtsResultsMainProps) {
  const [activeTab, setActiveTab] = useState<Tab>('ats');

  return (
    <div className="flex flex-col min-h-full">
      {/* Tab Bar + Actions */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border/40 px-6 flex items-center justify-between h-14">
        <div className="flex gap-1 h-full pt-2">
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
                  'relative flex items-center gap-2 px-4 text-sm font-medium rounded-t-xl transition-colors h-full',
                  isActive
                    ? 'text-foreground bg-muted/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
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

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoToBuilder}
            className="h-8 rounded-full text-[11px] font-medium tracking-wide text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
          >
            Open in Builder →
          </Button>
          <Button
            size="sm"
            onClick={onSaveReport}
            disabled={isSaving}
            className="h-8 rounded-full text-[11px] font-medium tracking-wide px-5 shadow-sm"
          >
            {isSaving ? 'Saving...' : 'Save to Dashboard'}
          </Button>
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
                          ? 'bg-success/5 border-success/20'
                          : 'bg-destructive/5 border-destructive/20',
                      )}
                    >
                      <span className="capitalize text-foreground/90">
                        {key.replace(/_/g, ' ')}
                      </span>
                      {passed ? (
                        <Badge className="bg-success/10 text-success border-success/20 text-[11px]">
                          ✓ Pass
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[11px]">
                          ✗ Fail
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Section>

              {/* Risks */}
              {report.risks.length > 0 && (
                <Section title="Risks" icon={AlertCircle} titleClass="text-destructive">
                  <ul className="space-y-2.5">
                    {report.risks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Warnings */}
              {report.ats_warnings.length > 0 && (
                <Section title="ATS Warnings" icon={AlertTriangle} titleClass="text-warning">
                  <ul className="space-y-2.5">
                    {report.ats_warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-warning" />
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
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                      >
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
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm bg-muted/30 border border-border/30 p-3.5 rounded-xl"
                      >
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
                  <Section title="Strong Keywords" icon={CheckCircle2} titleClass="text-success">
                    <div className="flex flex-wrap gap-2">
                      {report.strong_keywords.map((kw, i) => (
                        <Badge
                          key={i}
                          className="bg-success/10 text-success dark:text-success border-success/20 text-[11px]"
                        >
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </Section>
                )}
                {report.missing_keywords.length > 0 && (
                  <Section
                    title="Missing Keywords"
                    icon={AlertCircle}
                    titleClass="text-destructive"
                  >
                    <div className="flex flex-wrap gap-2">
                      {report.missing_keywords.map((kw, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[11px] text-destructive border-destructive/30"
                        >
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
      <div className="p-6">{children}</div>
    </div>
  );
}

/* ─── Helper Components ─── */
function AtsCard({
  title,
  subtitle,
  icon: Icon,
  titleClass,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  titleClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 bg-muted/20">
        <div className="flex items-center gap-2.5">
          <Icon className={cn('w-4 h-4', titleClass ?? 'text-muted-foreground')} />
          <div>
            <h2 className={cn('text-sm font-semibold', titleClass ?? 'text-foreground')}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
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
    <div className="space-y-6">
      {/* First Impression */}
      <AtsCard
        title="First Impression"
        subtitle="What a recruiter sees in 6 seconds"
        icon={UserSearch}
        titleClass="text-foreground"
      >
        <p className="text-sm text-foreground/85 leading-relaxed bg-muted/30 rounded-xl p-4 border border-border/30 italic">
          "{sim.first_impression}"
        </p>
      </AtsCard>

      {/* Likely Concerns */}
      {sim.likely_concerns.length > 0 && (
        <AtsCard
          title="Likely Concerns"
          subtitle="Red flags a recruiter may raise"
          icon={AlertTriangle}
          titleClass="text-warning"
        >
          <ul className="space-y-3">
            {sim.likely_concerns.map((concern, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/85">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-warning/70" />
                {concern}
              </li>
            ))}
          </ul>
        </AtsCard>
      )}

      {/* Likely Outcome */}
      <AtsCard
        title="Likely Outcome"
        subtitle="Predicted recruiter decision"
        icon={ChevronRight}
        titleClass="text-primary"
      >
        <p className="text-sm text-foreground/85 leading-relaxed">{sim.likely_outcome}</p>
      </AtsCard>
    </div>
  );
}
