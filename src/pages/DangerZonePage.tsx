import { AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export default function DangerZonePage() {
  const { signOut } = useAuthStore();
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'delete') return;

    const confirm = window.confirm(
      'Are you absolutely sure you want to delete your account? This action is irreversible and all your data (resumes, reports, profile) will be permanently deleted.',
    );

    if (!confirm) return;

    setIsDeleting(true);
    try {
      // 1. Call the delete_user RPC
      // Note: This RPC must be created in Supabase with SECURITY DEFINER
      const { error } = await supabase.rpc('delete_user');

      if (error) {
        console.error('Error deleting account:', error);
        // If RPC fails (e.g. doesn't exist), we can't really delete from frontend
        // unless we use a service role which we shouldn't have here.
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <header className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">Danger Zone</h1>
            </div>
            <p className="text-muted-foreground font-medium italic">
              Irreversible actions and account management.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-destructive/5 backdrop-blur-sm border border-destructive/20 p-8 rounded-[2rem] shadow-sm space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-destructive">
                  <Trash2 className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Delete Account</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Once you delete your account, there is no going back. All your resumes, ATS
                  analysis reports, and personal data will be wiped from our servers immediately.
                </p>

                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive font-medium leading-relaxed">
                    To delete your account, you need to enter the confirmation text and click the
                    button below.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="confirmation" className="text-sm font-semibold px-1">
                    Please type{' '}
                    <span className="font-mono font-bold text-destructive underline">delete</span>{' '}
                    to confirm
                  </Label>
                  <Input
                    id="confirmation"
                    placeholder="Type 'delete' here..."
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="bg-background border-destructive/20 rounded-2xl h-12 px-5 focus:ring-destructive/20 transition-all font-mono"
                    autoComplete="off"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleDeleteAccount}
                    variant="destructive"
                    className="w-full sm:w-auto min-w-[200px] rounded-2xl h-12 text-base font-bold shadow-lg shadow-destructive/20 hover:shadow-destructive/30 transition-all active:scale-[0.98] gap-2"
                    disabled={confirmationText !== 'delete' || isDeleting}
                  >
                    {isDeleting ? (
                      'Deleting...'
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/30 border border-border/50 p-8 rounded-[2rem] space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2 italic text-muted-foreground">
                Final Warning
              </h3>
              <ul className="text-sm text-muted-foreground space-y-3 list-disc pl-4">
                <li>Immediate loss of all resumes.</li>
                <li>Permanent deletion of reports.</li>
                <li>Username becomes available.</li>
                <li>Cannot be undone.</li>
              </ul>
            </div>

            <p className="text-xs text-center text-muted-foreground px-6 italic">
              &quot;We&apos;re sorry to see you go. If there&apos;s anything we could have done
              better, please let us know.&quot;
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
