import { AlertTriangle, ServerCrash, Timer } from 'lucide-react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAIWriterStore } from '@/stores/aiWriterStore';
import { TailoredItemEditor } from '@/components/resume/TailoredItemEditor';

import { AIDiffViewer } from './AIDiffViewer';

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
    error,
    setNewText,
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
        className="sm:max-w-4xl p-0 border-none bg-transparent shadow-none outline-none overflow-visible"
        hideClose={true}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >

        <div className="w-full">
          {error ? (
            <div className="bg-card/60 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                {error.toLowerCase().includes('too long') ? (
                  <Timer className="w-8 h-8 text-destructive" />
                ) : error.toLowerCase().includes('server') ||
                  error.toLowerCase().includes('500') ||
                  error.toLowerCase().includes('failed to fetch') ? (
                  <ServerCrash className="w-8 h-8 text-destructive" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground">Generation Failed</h3>
              <p className="text-sm font-medium text-muted-foreground px-8 text-center max-w-md">
                {error}
              </p>
              <button
                onClick={discardChanges}
                className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Close and Try Again
              </button>
            </div>
          ) : (
            <AIDiffViewer
              title={fieldLabel}
              description="Review and refine the AI-generated suggestions."
              infoTip="Feel free to edit the tailored version to make it perfect before accepting."
              onAccept={acceptChanges}
              onReject={discardChanges}
              originalText={
                <div className="pt-2">
                  <TailoredItemEditor
                    sectionId={currentField || 'summary'}
                    content={originalText}
                    readOnly={true}
                  />
                </div>
              }
              newText={
                <div className="pt-2">
                  <TailoredItemEditor
                    sectionId={currentField || 'summary'}
                    content={newText}
                    onChange={(val) => setNewText(typeof val === 'string' ? val : val.content || val.description || '')}
                  />
                </div>
              }
            />

          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

