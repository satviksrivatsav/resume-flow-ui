import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
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
  const { theme: activeTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  // Initialize from profile when it loads
  useEffect(() => {
    if (profile) {
      setSelectedTheme(profile.theme || 'system');
      setSelectedLanguage(profile.language || 'en');
    }
  }, [profile]);

  // Initial fallback if profile isn't loaded yet
  useEffect(() => {
    if (!profile && activeTheme && !selectedTheme) {
      setSelectedTheme(activeTheme);
    }
  }, [profile, activeTheme, selectedTheme]);

  const handleSave = async () => {
    try {
      const result = await updateProfile({
        theme: selectedTheme,
        language: selectedLanguage,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Preferences updated successfully');
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme); // Immediate visual feedback (Live Preview)
  };

  const hasChanges =
    selectedTheme !== (profile?.theme || 'system') ||
    selectedLanguage !== (profile?.language || 'en');

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <header className="flex items-end justify-between mb-12">
          <div>
            <h1 className="text-xl font-bold tracking-tight mb-0.5">Settings</h1>
            <p className="text-[13px] text-muted-foreground/80">
              Customize your experience and interface settings.
            </p>
          </div>
        </header>

        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 rounded-[2rem] shadow-sm space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="theme" className="text-sm font-bold px-1">
                Appearance Theme
              </Label>
              <Select value={selectedTheme} onValueChange={handleThemeChange}>
                <SelectTrigger
                  id="theme"
                  className="bg-accent/30 border-border/50 rounded-full h-10 px-5 focus:ring-primary/20 transition-all"
                >
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className="rounded-[1.5rem] border-border/50 backdrop-blur-xl">
                  <SelectItem value="light" className="rounded-full">
                    Light
                  </SelectItem>
                  <SelectItem value="dark" className="rounded-full">
                    Dark
                  </SelectItem>
                  <SelectItem value="system" className="rounded-full">
                    System
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground px-1 italic">
                Choose between light, dark, or follow your system preference.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="language" className="text-sm font-bold px-1">
                Interface Language
              </Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger
                  id="language"
                  className="bg-accent/30 border-border/50 rounded-full h-10 px-5 focus:ring-primary/20 transition-all"
                >
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="rounded-[1.5rem] border-border/50 backdrop-blur-xl">
                  <SelectItem value="en" className="rounded-full">
                    English
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground px-1 italic">
                Select your preferred language for the application interface.
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
      </div>
    </DashboardLayout>
  );
}

