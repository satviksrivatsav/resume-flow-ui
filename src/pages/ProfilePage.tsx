import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';

export default function ProfilePage() {
  const { user, profile, updateProfile, updateEmail, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setUsername(profile.username ?? '');
    }
    if (user) {
      setEmail(user.email ?? '');
    }
  }, [profile, user]);

  const handleSave = async () => {
    try {
      // 1. Update profile (Name, Username)
      const profileResult = await updateProfile({
        name: name.trim() ?? null,
        username: username.trim() ?? null,
      });

      if (profileResult.error) {
        toast.error(profileResult.error);
        return;
      }

      // 2. Update email if changed
      if (email.trim().toLowerCase() !== user?.email?.toLowerCase()) {
        const confirmChange = window.confirm(
          'Changing your email address will require you to re-verify it. You will receive a verification link at the new address. Continue?',
        );

        if (confirmChange) {
          const emailResult = await updateEmail(email.trim().toLowerCase());
          if (emailResult.error) {
            toast.error(emailResult.error);
            return;
          }
          toast.success(`Verification email sent to ${email.trim()}`);
        } else {
          setEmail(user?.email ?? '');
        }
      } else {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const isEmailVerified = !!user?.email_confirmed_at;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <header className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <User className="w-5 h-5" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">Profile</h1>
            </div>
            <p className="text-muted-foreground font-medium italic">
              Manage your professional identity and account settings.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 rounded-[2rem] shadow-sm space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-semibold px-1">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-accent/30 border-border/50 rounded-2xl h-12 px-5 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username" className="text-sm font-semibold px-1">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-accent/30 border-border/50 rounded-2xl h-12 px-5 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email Address
                  </Label>
                  {isEmailVerified && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Verified
                    </span>
                  )}
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-accent/30 border-border/50 rounded-2xl h-12 px-5 focus:ring-primary/20 transition-all"
                />
                <p className="text-[11px] text-muted-foreground px-1 italic">
                  Note: Changing your email will require re-verification.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSave}
                  className="w-full sm:w-auto min-w-[160px] rounded-2xl h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2rem] space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Account Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tighter">
                    Free Tier
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground px-6 italic">
              &quot;Your profile is your digital handshake. Keep it updated to make the best
              impression.&quot;
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
