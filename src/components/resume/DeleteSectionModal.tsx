import { Trash2 } from 'lucide-react';

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

interface DeleteSectionModalProps {
  isOpen: boolean;
  title?: string;
  sectionName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteSectionModal({
  isOpen,
  title = 'Delete Section',
  sectionName,
  onClose,
  onConfirm,
}: DeleteSectionModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[440px] bg-background backdrop-blur-xl border-border/50 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center text-center">
        <AlertDialogHeader className="flex flex-col items-center sm:text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-destructive" />
          </div>
          <AlertDialogTitle className="text-2xl font-extrabold tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground font-medium py-2">
            Are you sure you want to delete{' '}
            <span className="text-foreground font-bold">{sectionName}</span>? This action cannot be
            undone and all content within this section will be permanently lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex sm:flex-row flex-col items-center sm:justify-center sm:space-x-0 gap-3 w-full">
          <AlertDialogCancel
            type="button"
            onClick={onClose}
            className="rounded-full h-11 px-8 font-bold border-border/50 hover:bg-accent/50 transition-all w-full sm:w-auto"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={onConfirm}
            className="rounded-full h-11 px-10 font-bold bg-destructive text-white hover:bg-destructive/90 transition-all active:scale-[0.98] w-full sm:w-auto"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
