import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EmailChangeModal } from '@/components/profile/EmailChangeModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';

export default function ProfilePage() {
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
        toast.error(profileResult.error);
        return;
      }

      // 2. Check if email changed
      if (email.trim().toLowerCase() !== user?.email?.toLowerCase()) {
        setShowEmailModal(true);
      } else {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleConfirmEmailChange = async () => {
    setShowEmailModal(false);
    try {
      const emailResult = await updateEmail(email.trim().toLowerCase());
      if (emailResult.error) {
        toast.error(emailResult.error);
        return;
      }
      toast.success(`Verification email sent to ${email.trim()}`);
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleCancelEmailChange = () => {
    setShowEmailModal(false);
    setEmail(user?.email ?? '');
  };

  const isEmailVerified = !!user?.email_confirmed_at;

  return (
    <DashboardLayout>
      <header className="flex items-end justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Profile</h1>
          <p className="text-muted-foreground font-medium italic">
            Manage your professional identity and account settings.
          </p>
        </div>
      </header>

      <div className="max-w-2xl">
        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 rounded-[2rem] shadow-sm space-y-6">
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                      Unverified
                    </span>
                  )
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
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
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
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
