import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';

import { AIDiffViewer, DrawableCheck, DrawableX } from '@/shared/components/ui/AIDiffViewer';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import { useTailorStore } from '@/shared/stores/tailorStore';

import { TailoredItemEditor } from './TailoredItemEditor';
import { TailorPendingModal } from './TailorPendingModal';

interface TailorDiffModalProps {
  onApply: () => void;
  onDiscard: () => void;
}

export const TailorDiffModal = ({ onApply, onDiscard }: TailorDiffModalProps) => {
  const { viewMode, setViewMode, tailoredSlides, updateDecision, updateTailoredContent } =
    useTailorStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [rejectHovered, setRejectHovered] = useState(false);
  const [acceptHovered, setAcceptHovered] = useState(false);

  const isOpen = viewMode === 'diff';
  const currentSlide = tailoredSlides[currentIndex];
  const totalSlides = tailoredSlides.length;

  const handleTextChange = (updatedContent: any) => {
    if (!currentSlide) return;
    updateTailoredContent(currentSlide.slideId, updatedContent);
  };

  const handleApply = () => {
    const pendingCount = tailoredSlides.filter((s) => !s.decision).length;
    if (pendingCount > 0) {
      setShowPendingModal(true);
      return;
    }

    onApply();
  };

  const handleAcceptAllAndApply = () => {
    tailoredSlides.forEach((slide) => {
      if (!slide.decision) {
        updateDecision(slide.slideId, 'accept');
      }
    });
    onApply();
    setShowPendingModal(false);
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

  if (!currentSlide && isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onDiscard();
      }}
    >
      <DialogContent
        className="sm:max-w-5xl p-0 border-none bg-transparent shadow-none outline-none overflow-visible"
        hideClose={true}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="w-full min-h-0">
          <div key={currentIndex}>
            <AIDiffViewer
              showActions={false}
              title={currentSlide?.sectionName}
              description="Review the AI-tailored suggestions for this item."
              isEditable={false}
              infoTip="You can edit the tailored version to make minor adjustments."
              rightElement={
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDiscard}
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground/40 transition-colors"
                    title="Discard and Close"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              }
              originalText={
                <div className="pt-2">
                  <TailoredItemEditor
                    sectionId={currentSlide?.sectionId || ''}
                    content={currentSlide?.originalContent}
                    readOnly={true}
                  />
                </div>
              }
              newText={
                <div className="pt-2">
                  <TailoredItemEditor
                    sectionId={currentSlide?.sectionId || ''}
                    content={currentSlide?.tailoredContent}
                    onChange={handleTextChange}
                  />
                </div>
              }
              footer={
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 bg-primary/5 px-2 py-1 rounded-full border border-primary/10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                      className="rounded-full h-8 w-8 hover:bg-primary/10 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <span className="text-[12px] font-bold text-primary/80 tabular-nums min-w-[3rem] text-center">
                      {currentIndex + 1} / {totalSlides}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextSlide}
                      disabled={currentIndex === totalSlides - 1}
                      className="rounded-full h-8 w-8 hover:bg-primary/10 disabled:opacity-30 transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-1.5">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => setRejectHovered(true)}
                      onHoverEnd={() => setRejectHovered(false)}
                    >
                      <Button
                        variant={currentSlide?.decision === 'reject' ? 'destructive' : 'ghost'}
                        onClick={() => {
                          updateDecision(currentSlide.slideId, 'reject');
                          if (currentIndex < totalSlides - 1) setTimeout(nextSlide, 300);
                        }}
                        className={cn(
                          'gap-2 rounded-full px-5 h-9 text-sm transition-all duration-300',
                          currentSlide?.decision === 'reject'
                            ? 'bg-destructive text-white border-none'
                            : 'text-destructive hover:bg-destructive/10 border border-destructive/20',
                        )}
                      >
                        <DrawableX draw={rejectHovered} />
                        {currentSlide?.decision === 'reject' ? 'Rejected' : 'Reject'}
                      </Button>
                    </motion.div>

                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => setAcceptHovered(true)}
                      onHoverEnd={() => setAcceptHovered(false)}
                    >
                      <Button
                        variant={currentSlide?.decision === 'accept' ? 'default' : 'ghost'}
                        onClick={() => {
                          updateDecision(currentSlide.slideId, 'accept');
                          if (currentIndex < totalSlides - 1) setTimeout(nextSlide, 300);
                        }}
                        className={cn(
                          'gap-2 rounded-full px-5 h-9 text-sm transition-all duration-300',
                          currentSlide?.decision === 'accept'
                            ? 'bg-success text-white hover:bg-success/90 border-none'
                            : 'text-success hover:bg-success/10 border border-success/20',
                        )}
                      >
                        <DrawableCheck draw={acceptHovered} />
                        {currentSlide?.decision === 'accept' ? 'Accepted' : 'Accept'}
                      </Button>
                    </motion.div>
                  </div>

                  <Button
                    className={cn(
                      'h-9 px-5 rounded-full font-bold text-sm gap-2 transition-all duration-500',
                      tailoredSlides.every((s) => s.decision)
                        ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80',
                    )}
                    onClick={handleApply}
                  >
                    {tailoredSlides.every((s) => s.decision) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Finalize Changes
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
          </div>
        </div>
      </DialogContent>

      <TailorPendingModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        onAcceptAll={handleAcceptAllAndApply}
        pendingCount={tailoredSlides.filter((s) => !s.decision).length}
      />
    </Dialog>
  );
};
