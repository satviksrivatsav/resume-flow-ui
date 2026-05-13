import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { AlertTriangle, ServerCrash, Timer } from 'lucide-react';

import aiSearchAnimation from '@/assets/AI Searching.json';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAIWriterStore } from '@/stores/aiWriterStore';
import { AIDiffViewer } from './AIDiffViewer';

// ── Portal loading animation ─────────────────────────────────────────────────
function PortalLoader() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-32 h-32 flex items-center justify-center">
        <Lottie animationData={aiSearchAnimation} loop={true} />
      </div>
      <p className="text-sm text-muted-foreground font-medium">Generating content…</p>
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
export function AIReviewModal() {
  const {
    showReviewModal,
    originalText,
    newText,
    currentField,
    acceptChanges,
    discardChanges,
    cancelRequest,
    isLoading,
    error,
  } = useAIWriterStore();

  const fieldLabel =
    currentField?.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()) || 'Field';

  return (
    <Dialog
      open={showReviewModal}
      onOpenChange={(open) => {
        if (!open) cancelRequest();
      }}
    >
      <DialogContent
        className="sm:max-w-3xl flex flex-col max-h-[82vh] overflow-hidden p-0 border-primary/20 shadow-2xl shadow-primary/5"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
          <DialogTitle className="text-xl font-bold tracking-tight">Review Changes - {fieldLabel}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <PortalLoader />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                {error.toLowerCase().includes('too long') ? (
                  <Timer className="w-6 h-6 text-destructive" />
                ) : error.toLowerCase().includes('server') ||
                  error.toLowerCase().includes('500') ||
                  error.toLowerCase().includes('failed to fetch') ? (
                  <ServerCrash className="w-6 h-6 text-destructive" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                )}
              </div>
              <p className="text-sm font-medium text-destructive px-8 text-center">{error}</p>
            </div>
          ) : (
            <div className="h-full py-2">
              <AIDiffViewer
                originalText={originalText}
                newText={newText}
                onAccept={acceptChanges}
                onReject={discardChanges}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
