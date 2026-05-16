import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { AIDiffViewer, DrawableCheck, DrawableX } from '@/components/ui/AIDiffViewer';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTailorStore } from '@/stores/tailorStore';
import { TailoredItemEditor } from './TailoredItemEditor';

interface TailorDiffViewProps {
  onApply: () => void;
}

export const TailorDiffView = ({ onApply }: TailorDiffViewProps) => {
  const { tailoredSlides, updateDecision, updateTailoredContent } = useTailorStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rejectHovered, setRejectHovered] = useState(false);
  const [acceptHovered, setAcceptHovered] = useState(false);

  const currentSlide = tailoredSlides[currentIndex];
  const totalSlides = tailoredSlides.length;

  const handleTextChange = (updatedContent: any) => {
    if (!currentSlide) return;
    updateTailoredContent(currentSlide.slideId, updatedContent);
  };

  const handleApply = () => {
    const pending = tailoredSlides.filter((s) => !s.decision);
    if (pending.length > 0) {
      const confirmed = window.confirm(
        `You have ${pending.length} pending decisions. Applying anyway will reject those changes. Continue?`,
      );
      if (!confirmed) return;
    }

    onApply();
  };

  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentSlide) return null;

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-32">


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
              title={currentSlide.sectionName}
              description="Review the AI-tailored suggestions for this item."
              isEditable={false} // Managed by our custom TailoredItemEditor
              infoTip="You can edit the tailored version to make minor adjustments."
              rightElement={
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-muted-foreground/60 tabular-nums">
                    {currentIndex + 1} / {totalSlides}
                  </span>
                </div>
              }
              originalText={
                <div className="pt-2">
                  <TailoredItemEditor
                    sectionId={currentSlide.sectionId}
                    content={currentSlide.originalContent}
                    readOnly={true}
                  />
                </div>
              }
              newText={
                <div className="pt-2">
                  <TailoredItemEditor
                    sectionId={currentSlide.sectionId}
                    content={currentSlide.tailoredContent}
                    onChange={handleTextChange}
                  />
                </div>
              }
              footer={
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                      className="rounded-full h-10 w-10 border-primary/20 hover:bg-primary/5 hover:border-primary/40 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextSlide}
                      disabled={currentIndex === totalSlides - 1}
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
                        variant={currentSlide.decision === 'reject' ? 'destructive' : 'outline'}
                        onClick={() => {
                          updateDecision(currentSlide.slideId, 'reject');
                          if (currentIndex < totalSlides - 1) setTimeout(nextSlide, 300);
                        }}
                        className={cn(
                          'gap-2 rounded-full px-6 h-10 text-sm transition-all duration-300',
                          currentSlide.decision === 'reject'
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
                          updateDecision(currentSlide.slideId, 'accept');
                          if (currentIndex < totalSlides - 1) setTimeout(nextSlide, 300);
                        }}
                        className={cn(
                          'gap-2 rounded-full px-6 h-10 text-sm transition-all duration-300',
                          currentSlide.decision === 'accept'
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
                      tailoredSlides.every((s) => s.decision)
                        ? 'bg-primary'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80',
                    )}
                    onClick={handleApply}
                  >
                    {tailoredSlides.every((s) => s.decision) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Finalize
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        Apply {tailoredSlides.filter((s) => s.decision).length} / {totalSlides}
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
