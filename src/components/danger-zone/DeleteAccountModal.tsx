import { motion } from 'framer-motion';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';

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
      icon={<TrashAnimatedIcon className="w-8 h-8 text-destructive" />}
      confirmText="Delete Forever"
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
