import { motion } from 'framer-motion';

import { DeleteConfirmationModal } from '@/shared/components/ui/DeleteConfirmationModal';
import { TrashAnimatedIcon } from '@/shared/components/ui/TrashAnimatedIcon';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Account?"
      contentClassName="border-destructive/20"
      titleClassName="text-destructive"
      icon={<TrashAnimatedIcon className="w-8 h-8 text-destructive" />}
      confirmButtonClassName="shadow-lg shadow-destructive/20 flex items-center justify-center gap-2 group"
      confirmNode={
        <motion.button
          whileHover="hover"
          whileTap="tap"
          variants={{
            hover: { scale: 1.05 },
            tap: { scale: 0.95 },
          }}
        >
          <TrashAnimatedIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Delete Forever
        </motion.button>
      }
      description={
        <>
          Are you absolutely sure? This action is{' '}
          <span className="text-destructive font-bold">irreversible</span>. All your resumes,
          reports, and profile data will be permanently deleted.
        </>
      }
    />
  );
}
