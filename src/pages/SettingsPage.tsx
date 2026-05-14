import { Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/authStore';

export default function SettingsPage() {
  const { profile, updateProfile, isLoading } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (profile?.language) {
      setLanguage(profile.language);
    }
  }, [profile]);

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    try {
      const result = await updateProfile({ theme: newTheme });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Theme updated to ${newTheme}`);
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
      toast.error('Failed to update theme preference');
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    try {
      const result = await updateProfile({ language: newLanguage });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Language preference updated');
      }
    } catch (error) {
      console.error('Failed to update language:', error);
      toast.error('Failed to update language preference');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <header className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Settings className="w-5 h-5" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">Preferences</h1>
            </div>
            <p className="text-muted-foreground font-medium italic">
              Customize your experience and interface settings.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 rounded-[2rem] shadow-sm space-y-8">
              <div className="grid gap-3">
                <Label htmlFor="theme" className="text-sm font-semibold px-1">
                  Appearance Theme
                </Label>
                <Select value={theme} onValueChange={handleThemeChange} disabled={isLoading}>
                  <SelectTrigger
                    id="theme"
                    className="bg-accent/30 border-border/50 rounded-2xl h-12 px-5 focus:ring-primary/20 transition-all"
                  >
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="light" className="rounded-lg">
                      Light
                    </SelectItem>
                    <SelectItem value="dark" className="rounded-lg">
                      Dark
                    </SelectItem>
                    <SelectItem value="system" className="rounded-lg">
                      System
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground px-1 italic">
                  Choose between light, dark, or follow your system preference.
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="language" className="text-sm font-semibold px-1">
                  Interface Language
                </Label>
                <Select value={language} onValueChange={handleLanguageChange} disabled={isLoading}>
                  <SelectTrigger
                    id="language"
                    className="bg-accent/30 border-border/50 rounded-2xl h-12 px-5 focus:ring-primary/20 transition-all"
                  >
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="en" className="rounded-lg">
                      English
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground px-1 italic">
                  Select your preferred language for the application interface.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2rem] space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Settings Info
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your preferences are synced across all your devices once you save them to your
                profile.
              </p>
            </div>

            <p className="text-xs text-center text-muted-foreground px-6 italic">
              &quot;The best interface is the one that feels like home. Make it yours.&quot;
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
