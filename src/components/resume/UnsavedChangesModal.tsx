import { AlertTriangle } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndExit?: () => void;
  onExitWithoutSave?: () => void;
  title?: string;
  description?: string;
  saveLabel?: string;
  discardLabel?: string;
}

export function UnsavedChangesModal({ 
  isOpen, 
  onClose, 
  onSaveAndExit, 
  onExitWithoutSave,
  title = "Unsaved Changes",
  description = "You have unsaved progress on your resume. Would you like to save before leaving?",
  saveLabel = "Save and Exit",
  discardLabel = "Exit without save"
}: UnsavedChangesModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[400px] border-border/20 p-10 flex flex-col items-center text-center">
        <AlertDialogHeader className="flex flex-col items-center sm:text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-primary" />
          </div>
          <AlertDialogTitle className="text-2xl font-extrabold tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground font-medium py-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 flex flex-col items-center gap-3 w-full sm:flex-col sm:justify-center">
          {/* Primary Action */}
          {onSaveAndExit && (
            <AlertDialogAction
              onClick={onSaveAndExit}
              className="rounded-full h-12 px-10 font-bold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] w-full"
            >
              {saveLabel}
            </AlertDialogAction>
          )}

          {/* Secondary Action - Same dimensions as primary, solid red destructive variant */}
          {onExitWithoutSave && (
            <Button
              type="button"
              variant="destructive"
              onClick={onExitWithoutSave}
              className="rounded-full h-12 px-10 font-bold transition-all active:scale-[0.98] w-full"
            >
              {discardLabel}
            </Button>
          )}

          {/* Cancel Action - Text button below */}
          <AlertDialogCancel
            onClick={onClose}
            className="mt-2 border-none bg-transparent hover:bg-transparent text-muted-foreground hover:text-foreground font-semibold h-auto py-2 shadow-none"
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
