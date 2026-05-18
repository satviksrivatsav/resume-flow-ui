import { motion } from 'framer-motion';

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
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[440px] border-destructive/20 p-8 flex flex-col items-center text-center">
        <AlertDialogHeader className="flex flex-col items-center sm:text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <TrashAnimatedIcon className="w-8 h-8 text-destructive" />
          </div>
          <AlertDialogTitle className="text-2xl font-extrabold tracking-tight text-destructive">
            Delete Account?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground font-medium py-2">
            Are you absolutely sure? This action is{' '}
            <span className="text-destructive font-bold">irreversible</span>. All your resumes,
            reports, and profile data will be permanently deleted.
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
            asChild
            className="rounded-full h-11 px-10 font-bold bg-destructive hover:bg-destructive/90 transition-all active:scale-[0.98] w-full sm:w-auto"
          >
            <motion.button
              whileHover="hover"
              whileTap="tap"
              className="flex items-center justify-center gap-2"
            >
              <TrashAnimatedIcon className="w-4 h-4" />
              Delete Forever
            </motion.button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

