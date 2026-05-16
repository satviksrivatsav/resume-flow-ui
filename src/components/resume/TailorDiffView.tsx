import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { AIDiffViewer, DrawableCheck, DrawableX } from '@/components/ui/AIDiffViewer';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';
import { useTailorStore } from '@/stores/tailorStore';
import { formatSectionContent } from '@/utils/formatters';

export const TailorDiffView = () => {
  const { tailoredSections, updateDecision, setViewMode, reset } = useTailorStore();
  const { resumeData, updateSummary, updateSection, updateCustomSection, setResumeData } =
    useResumeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rejectHovered, setRejectHovered] = useState(false);
  const [acceptHovered, setAcceptHovered] = useState(false);

  const currentSection = tailoredSections[currentIndex];
  const totalSections = tailoredSections.length;

  const handleApply = () => {
    const pending = tailoredSections.filter((s) => !s.decision);
    if (pending.length > 0) {
      const confirmed = window.confirm(
        `You have ${pending.length} pending decisions. Applying anyway will reject those changes. Continue?`,
      );
      if (!confirmed) return;
    }

    tailoredSections.forEach((section) => {
      if (section.decision === 'accept') {
        const { sectionId, tailoredContent } = section;
        if (sectionId === 'summary') {
          updateSummary(tailoredContent);
        } else if (sectionId === 'headline') {
          setResumeData({
            ...resumeData,
            basics: { ...resumeData.basics, headline: tailoredContent.headline },
          });
        } else if (
          [
            'experience',
            'education',
            'projects',
            'skills',
            'profiles',
            'languages',
            'interests',
            'awards',
            'certifications',
            'publications',
            'volunteer',
            'references',
          ].includes(sectionId)
        ) {
          updateSection(sectionId as any, tailoredContent);
        } else {
          updateCustomSection(sectionId, tailoredContent);
        }
      }
    });

    reset();
    setViewMode('form');
  };

  const nextSection = () => {
    if (currentIndex < totalSections - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSection = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentSection) return null;

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <motion.div whileHover="hover" whileTap="tap">
          <Button
            variant="ghost"
            onClick={() => setViewMode('form')}
            className="gap-2 rounded-full px-5 h-10 text-muted-foreground hover:text-foreground transition-all"
          >
            <AnimatedIcon icon={ArrowLeft} preset="slideLeft" className="w-4 h-4" />
            Back to JD
          </Button>
        </motion.div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {tailoredSections.map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  width: i === currentIndex ? 24 : 8,
                  backgroundColor:
                    i === currentIndex
                      ? '#ffffff'
                      : tailoredSections[i].decision === 'accept'
                        ? '#22c55e'
                        : tailoredSections[i].decision === 'reject'
                          ? '#ef4444'
                          : '#e2e8f0',
                }}
                className="h-2 rounded-full cursor-pointer transition-all duration-300"
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-muted-foreground/60 tabular-nums">
            {currentIndex + 1} / {totalSections}
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.sectionId}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="h-full"
          >
            <AIDiffViewer
              showActions={false}
              title={currentSection.sectionName}
              description="Review the AI-tailored suggestions for this section."
              originalText={formatSectionContent(
                currentSection.sectionId,
                currentSection.originalContent,
              )}
              newText={formatSectionContent(
                currentSection.sectionId,
                currentSection.tailoredContent,
              )}
              footer={
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevSection}
                      disabled={currentIndex === 0}
                      className="rounded-full h-12 w-12 border-primary/20 hover:bg-primary/5 hover:border-primary/40 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextSection}
                      disabled={currentIndex === totalSections - 1}
                      className="rounded-full h-12 w-12 border-primary/20 hover:bg-primary/5 hover:border-primary/40 disabled:opacity-30 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => setRejectHovered(true)}
                      onHoverEnd={() => setRejectHovered(false)}
                    >
                      <Button
                        variant={currentSection.decision === 'reject' ? 'destructive' : 'outline'}
                        size="lg"
                        onClick={() => {
                          updateDecision(currentSection.sectionId, 'reject');
                          if (currentIndex < totalSections - 1) setTimeout(nextSection, 300);
                        }}
                        className={cn(
                          'gap-2 rounded-full px-8 h-12 transition-all duration-300',
                          currentSection.decision === 'reject'
                            ? 'shadow-lg shadow-destructive/20 border-destructive'
                            : 'border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive',
                        )}
                      >
                        <DrawableX draw={rejectHovered} />
                        Reject
                      </Button>
                    </motion.div>

                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => setAcceptHovered(true)}
                      onHoverEnd={() => setAcceptHovered(false)}
                    >
                      <Button
                        size="lg"
                        onClick={() => {
                          updateDecision(currentSection.sectionId, 'accept');
                          if (currentIndex < totalSections - 1) setTimeout(nextSection, 300);
                        }}
                        className={cn(
                          'gap-2 rounded-full px-8 h-12 transition-all duration-300',
                          currentSection.decision === 'accept'
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 border-0'
                            : 'bg-green-600/10 text-green-600 hover:bg-green-600 hover:text-white border-0',
                        )}
                      >
                        <DrawableCheck draw={acceptHovered} />
                        Accept
                      </Button>
                    </motion.div>
                  </div>

                    <Button
                      size="lg"
                      className={cn(
                        'h-12 px-8 rounded-full font-bold gap-3 transition-all duration-500',
                        tailoredSections.every((s) => s.decision)
                          ? 'bg-primary'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80',
                      )}
                      onClick={handleApply}
                    >
                    {tailoredSections.every((s) => s.decision) ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Finalize
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-5 h-5" />
                        Apply {tailoredSections.filter((s) => s.decision).length} / {totalSections}
                      </>
                    )}
                  </Button>
                </div>
              }
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
