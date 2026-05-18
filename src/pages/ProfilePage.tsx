import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EmailChangeModal } from '@/components/profile/EmailChangeModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, profile, updateProfile, updateEmail, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setUsername(profile.username ?? '');
    }
  }, [profile]);

  useEffect(() => {
    if (user && !isInitialized) {
      setEmail(user.email ?? '');
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  const handleSave = async () => {
    try {
      // 1. Update profile (Name, Username)
      const profileResult = await updateProfile({
        name: name.trim() || null,
        username: username.trim() || null,
      });

      if (profileResult.error) {
        toast({
          title: 'Error',
          description: profileResult.error,
          variant: 'destructive',
        });
        return;
      }

      // 2. Check if email changed
      if (email.trim().toLowerCase() !== user?.email?.toLowerCase()) {
        setShowEmailModal(true);
      } else {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmEmailChange = async () => {
    setShowEmailModal(false);
    try {
      const emailResult = await updateEmail(email.trim().toLowerCase());
      if (emailResult.error) {
        toast({
          title: 'Error',
          description: emailResult.error,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Success',
        description: `Verification email sent to ${email.trim()}`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Error updating email:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleCancelEmailChange = () => {
    setShowEmailModal(false);
    setEmail(user?.email ?? '');
  };

  const hasChanges =
    name.trim() !== (profile?.name ?? '') ||
    username.trim() !== (profile?.username ?? '') ||
    email.trim().toLowerCase() !== (user?.email?.toLowerCase() ?? '');

  return (
    <DashboardLayout>
      <header className="flex items-end justify-between mb-12">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-0.5">Profile</h1>
          <p className="text-[13px] text-muted-foreground/80">
            Manage your professional identity and account settings.
          </p>
        </div>
      </header>

      <div className="max-w-2xl">
        <div className="space-y-8">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-bold px-1">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-accent/30 border-border/50 rounded-full h-10 px-5 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username" className="text-sm font-bold px-1">
              Username
            </Label>
            <Input
              id="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-accent/30 border-border/50 rounded-full h-10 px-5 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between px-1">
              <Label htmlFor="email" className="text-sm font-bold">
                Email Address
              </Label>
              {email.trim().toLowerCase() === user?.email?.toLowerCase() ? (
                user?.email_confirmed_at ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-destructive bg-destructive/10 px-2.5 py-1 rounded-full border border-destructive/20">
                    Pro
                  </span>
                  ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-destructive bg-destructive/10 px-2.5 py-1 rounded-full border border-destructive/20">

                    Unverified
                  </span>
                )
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive bg-destructive/10 px-2.5 py-1 rounded-full border border-destructive/20">
                  Unverified
                </span>
              )}
            </div>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-accent/30 border-border/50 rounded-full h-10 px-5 focus:ring-primary/20 transition-all"
            />
            <p className="text-[11px] text-muted-foreground px-1 italic">
              Note: Changing your email will require re-verification.
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              className="w-full sm:w-auto min-w-[160px] rounded-full h-10 text-xs font-bold transition-all active:scale-[0.98]"
              disabled={isLoading || !hasChanges}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <EmailChangeModal
        isOpen={showEmailModal}
        onClose={handleCancelEmailChange}
        onConfirm={handleConfirmEmailChange}
        newEmail={email.trim()}
      />
    </DashboardLayout>
  );
}
