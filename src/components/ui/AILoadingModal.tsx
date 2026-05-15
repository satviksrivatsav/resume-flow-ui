import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AILoader } from './AILoader';

interface AILoadingModalProps {
  isOpen: boolean;
  onCancel: () => void;
  message?: string;
  title?: string;
}

export function AILoadingModal({
  isOpen,
  onCancel,
  message = 'Processing...',
  title,
}: AILoadingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent
        className="sm:max-w-[420px] p-0 overflow-hidden border-none bg-transparent shadow-none flex flex-col items-center justify-center outline-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="relative bg-card/60 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10 w-full flex flex-col items-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          {/* Header context */}
          <div className="text-center mb-8">
            {title && (
              <h3 className="text-2xl font-extrabold tracking-tight mb-2">
                {title}
              </h3>
            )}
          </div>

          <div className="py-4 w-full">
            <AILoader message={message} size="lg" />
          </div>

          <Button
            variant="ghost"
            onClick={onCancel}
            className="mt-10 rounded-full px-8 py-6 font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all gap-2"
          >
            <X className="w-4 h-4" />
            Cancel Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
