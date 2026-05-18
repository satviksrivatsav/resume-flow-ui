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
} from '@/shared/components/ui/alert-dialog';

interface TailorPendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptAll: () => void;
  pendingCount: number;
}

export const TailorPendingModal = ({
  isOpen,
  onClose,
  onAcceptAll,
  pendingCount,
}: TailorPendingModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[400px] border-border/20 p-10 flex flex-col items-center text-center">
        <AlertDialogHeader className="flex flex-col items-center sm:text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-primary" />
          </div>
          <AlertDialogTitle className="text-2xl font-extrabold tracking-tight">
            Pending Decisions
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground font-medium py-2">
            You have <span className="text-primary font-bold">{pendingCount}</span> sections that haven't been reviewed yet. Would you like to accept all changes and apply?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 flex flex-col items-center gap-3 w-full sm:flex-col sm:justify-center">
          <AlertDialogAction
            onClick={onAcceptAll}
            className="rounded-full h-12 px-10 font-bold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] w-full"
          >
            Accept All & Apply
          </AlertDialogAction>

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
};
