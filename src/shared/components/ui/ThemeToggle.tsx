import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch - must wait for client-side render
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="bg-primary/5 border border-primary/20 h-10 w-10 rounded-full text-primary hover:bg-primary/10 transition-all"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden bg-primary/5 border border-primary/20 h-10 w-10 rounded-full text-primary hover:bg-primary/10 transition-all"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
    >
      {/* Sun icon - visible in light mode */}
      <Sun
        className={cn(
          'absolute transition-all duration-500 ease-in-out h-4 w-4',
          theme === 'light' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
        )}
      />
      {/* Moon icon - visible in dark mode */}
      <Moon
        className={cn(
          'absolute transition-all duration-500 ease-in-out h-4 w-4',
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0',
        )}
      />
      {/* Monitor icon - visible in system mode */}
      <Monitor
        className={cn(
          'absolute transition-all duration-500 ease-in-out h-4 w-4',
          theme === 'system' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0',
        )}
      />
    </Button>
  );
}
