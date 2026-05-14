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
        className="sm:max-w-[400px] p-0 overflow-hidden border-none bg-transparent shadow-none flex flex-col items-center justify-center gap-6 outline-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="relative bg-background backdrop-blur-xl border border-primary/20 rounded-3xl p-12 w-full flex flex-col items-center shadow-2xl">
          {/* Header context if provided */}
          {title && (
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {title}
            </h3>
          )}

          <AILoader message={message} size="lg" />

          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="mt-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full px-6 transition-all"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
