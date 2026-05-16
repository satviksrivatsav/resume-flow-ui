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
  const { tailoredSections, updateDecision, updateTailoredContent, setViewMode, reset } = useTailorStore();
  const { resumeData, updateSummary, updateSection, updateCustomSection, setResumeData } =
    useResumeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rejectHovered, setRejectHovered] = useState(false);
  const [acceptHovered, setAcceptHovered] = useState(false);

  const currentSection = tailoredSections[currentIndex];
  const totalSections = tailoredSections.length;

  const handleTextChange = (newText: string) => {
    if (!currentSection) return;

    let updatedContent = currentSection.tailoredContent;

    if (currentSection.sectionId === 'summary') {
      updatedContent =
        typeof updatedContent === 'string'
          ? newText
          : { ...updatedContent, content: newText };
    } else if (currentSection.sectionId === 'headline') {
      updatedContent = newText;
    } else {
      updatedContent = newText;
    }

    updateTailoredContent(currentSection.sectionId, updatedContent);
  };

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
          const content =
            typeof tailoredContent === 'string'
              ? { ...resumeData.summary, content: tailoredContent }
              : tailoredContent;
          updateSummary(content);
        } else if (sectionId === 'headline') {
          const headline =
            typeof tailoredContent === 'string' ? tailoredContent : tailoredContent.headline;
          setResumeData({
            ...resumeData,
            basics: { ...resumeData.basics, headline },
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
          // If it's a string (edited), we might have lost the structure.
          // For now, we only update if it's still structured, or we'd need a way to parse it back.
          // Most edits will be on Summary/Headline which are handled above.
          if (typeof tailoredContent !== 'string') {
            updateSection(sectionId as any, tailoredContent);
          }
        } else {
          if (typeof tailoredContent !== 'string') {
            updateCustomSection(sectionId, tailoredContent);
          }
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
    <div className="flex flex-col space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-32">
      <div className="flex items-center justify-start">
        <motion.div whileHover="hover" whileTap="tap">
          <Button
            variant="ghost"
            onClick={() => setViewMode('form')}
            className="gap-2 rounded-full px-6 h-11 text-xs font-bold text-muted-foreground hover:text-foreground transition-all"
          >
            <AnimatedIcon icon={ArrowLeft} preset="slideLeft" className="w-4 h-4" />
            Back
          </Button>
        </motion.div>
      </div>

      <div className="min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex} // Use index instead of ID to stabilize during content edits
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <AIDiffViewer
              showActions={false}
              title={currentSection.sectionName}
              description="Review the AI-tailored suggestions for this section."
              isEditable={true}
              onNewTextChange={handleTextChange}
              infoTip="You can edit the tailored version directly to make minor adjustments before accepting."
              rightElement={
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-muted-foreground/60 tabular-nums">
                    {currentIndex + 1} / {totalSections}
                  </span>
                </div>
              }
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevSection}
                      disabled={currentIndex === 0}
                      className="rounded-full h-10 w-10 border-primary/20 hover:bg-primary/5 hover:border-primary/40 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextSection}
                      disabled={currentIndex === totalSections - 1}
                      className="rounded-full h-10 w-10 border-primary/20 hover:bg-primary/5 hover:border-primary/40 disabled:opacity-30 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => setRejectHovered(true)}
                      onHoverEnd={() => setRejectHovered(false)}
                    >
                      <Button
                        variant={currentSection.decision === 'reject' ? 'destructive' : 'outline'}
                        onClick={() => {
                          updateDecision(currentSection.sectionId, 'reject');
                          if (currentIndex < totalSections - 1) setTimeout(nextSection, 300);
                        }}
                        className={cn(
                          'gap-2 rounded-full px-6 h-10 text-sm transition-all duration-300',
                          currentSection.decision === 'reject'
                            ? 'border-destructive bg-destructive/10'
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
                        onClick={() => {
                          updateDecision(currentSection.sectionId, 'accept');
                          if (currentIndex < totalSections - 1) setTimeout(nextSection, 300);
                        }}
                        className={cn(
                          'gap-2 rounded-full px-6 h-10 text-sm transition-all duration-300',
                          currentSection.decision === 'accept'
                            ? 'bg-green-600 hover:bg-green-700 text-white border-0'
                            : 'bg-green-600/10 text-green-600 hover:bg-green-600 hover:text-white border-0',
                        )}
                      >
                        <DrawableCheck draw={acceptHovered} />
                        Accept
                      </Button>
                    </motion.div>
                  </div>

                  <Button
                    className={cn(
                      'h-10 px-6 rounded-full font-bold text-sm gap-2 transition-all duration-500',
                      tailoredSections.every((s) => s.decision)
                        ? 'bg-primary'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80',
                    )}
                    onClick={handleApply}
                  >
                    {tailoredSections.every((s) => s.decision) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Finalize
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4" />
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
