import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { DeleteAccountModal } from '@/components/danger-zone/DeleteAccountModal';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

const MotionButton = motion.create(Button);

export default function DangerZonePage() {
  const { signOut } = useAuthStore();
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccountClick = () => {
    if (confirmationText !== 'delete') return;
    setShowDeleteModal(true);
  };

  const handleConfirmDeletion = async () => {
    setShowDeleteModal(false);
    setIsDeleting(true);
    try {
      // 1. Call the delete_user RPC
      const { error } = await supabase.rpc('delete_user');

      if (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account. Please contact support or try again later.');
        setIsDeleting(false);
        return;
      }

      // 2. Sign out and redirect
      await signOut();
      toast.success('Your account has been successfully deleted.');
      navigate('/');
    } catch (error) {
      console.error('Unexpected error during account deletion:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsDeleting(false);
    }
  };

  const isEnabled = confirmationText === 'delete' && !isDeleting;

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <header className="flex items-end justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Danger Zone</h1>
            <p className="text-muted-foreground font-medium italic">
              Irreversible actions and account management.
            </p>
          </div>
        </header>

        <div className="space-y-6">
          <div className="bg-destructive/5 backdrop-blur-sm border border-destructive/20 p-8 rounded-[2rem] shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-destructive">
                <TrashAnimatedIcon className="w-5 h-5" />
                <h3 className="text-lg font-bold">Delete Account</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once you delete your account, there is no going back. All your resumes, ATS analysis
                reports, and personal data will be wiped from our servers immediately.
              </p>

              <div className="bg-destructive/10 border border-destructive/20 rounded-full py-3 px-6 flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-xs text-destructive font-bold leading-relaxed italic">
                  Note: To delete your account, you need to enter the confirmation text below.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="confirmation" className="text-sm font-bold px-1">
                  Please type{' '}
                  <span className="font-mono font-bold text-destructive underline">delete</span> to
                  confirm
                </Label>
                <Input
                  id="confirmation"
                  placeholder="Type 'delete' here..."
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="bg-background border-destructive/20 rounded-full h-10 px-5 focus-visible:ring-destructive/50 focus-visible:border-destructive transition-all font-mono"
                  autoComplete="off"
                />
              </div>

              <div className="pt-2">
                <MotionButton
                  onClick={handleDeleteAccountClick}
                  variant="destructive"
                  className="w-full sm:w-auto min-w-[160px] rounded-full h-10 text-xs font-bold transition-all active:scale-[0.98] gap-2 overflow-hidden"
                  disabled={!isEnabled}
                  initial="initial"
                  whileHover={isEnabled ? 'hover' : 'initial'}
                  whileTap={isEnabled ? 'tap' : 'initial'}
                >
                  {isDeleting ? (
                    'Deleting...'
                  ) : (
                    <>
                      <TrashAnimatedIcon className="w-4 h-4" />
                      <span>Delete Account</span>
                    </>
                  )}
                </MotionButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDeletion}
      />
    </DashboardLayout>
  );
}

