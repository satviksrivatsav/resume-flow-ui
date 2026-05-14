import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Save } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import Logo from '@/assets/logo.png';
import { ExportMenu } from '@/components/resume/ExportMenu';
import { SaveStatus } from '@/components/resume/SaveStatus';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAutoSave } from '@/hooks/useAutoSave';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';
import { useUiStore } from '@/stores/uiStore';

export const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSaving } = useResumeStore();
  const { saveNow } = useAutoSave();
  const { showPreview, setShowPreview } = useUiStore();

  const isBuilderPage = location.pathname === '/resume-builder';
  const isHomePage = location.pathname === '/';

  if (isHomePage) return null;

  return (
    <header className="sticky top-0 z-40 border-b bg-card/40 backdrop-blur-md overflow-hidden shrink-0">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-[-100%] opacity-[0.03] dark:opacity-[0.05] animate-[gradient-flow_20s_ease_infinite] bg-[linear-gradient(90deg,transparent_0%,rgba(var(--primary-rgb),0.5)_25%,rgba(var(--primary-rgb),1)_50%,rgba(var(--primary-rgb),0.5)_75%,transparent_100%)] bg-[length:400%_100%]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      <div className="px-6 py-4 relative">
        <div className="flex items-center justify-between">
          {/* Left: Logo + brand + save status */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 group/logo cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <img
                src={Logo}
                alt="Resume Flow"
                className="w-8 h-8 object-contain transition-transform duration-500 group-hover/logo:scale-110 brightness-0 dark:invert"
              />
              <h1 className="text-xl font-bold text-foreground hidden sm:block tracking-tight">
                Resume Flow
              </h1>
            </div>

            {isBuilderPage && (
              <div className="hidden md:block">
                <SaveStatus />
              </div>
            )}
          </div>

          {/* Right: Builder actions + Theme toggle */}
          <div className="flex items-center gap-2">
            {isBuilderPage && (
              <>
                <motion.div whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    onClick={() => saveNow()}
                    disabled={isSaving}
                    className="gap-2 bg-background/40 transition-all border border-transparent h-10 px-4 rounded-full hover:bg-primary/10 hover:border-primary/20"
                  >
                    <AnimatedIcon
                      icon={Save}
                      className={cn('w-4 h-4', isSaving && 'animate-spin')}
                    />
                    <span className="hidden sm:inline font-medium">
                      {isSaving ? 'Saving...' : 'Save'}
                    </span>
                  </Button>
                </motion.div>

                <div className="w-px h-6 bg-border" />

                <motion.div whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    onClick={() => setShowPreview(!showPreview)}
                    className={cn(
                      'gap-2 bg-background/40 transition-all border border-transparent h-10 px-4 rounded-full',
                      showPreview
                        ? 'text-primary border-primary/20 bg-primary/5'
                        : 'hover:bg-primary/10 hover:border-primary/20',
                    )}
                  >
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                          key={showPreview ? 'closed' : 'open'}
                          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                          transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                          className="absolute inset-0"
                        >
                          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <span className="hidden sm:inline font-medium">
                      {showPreview ? 'Hide' : 'Show'} Preview
                    </span>
                  </Button>
                </motion.div>

                <div className="w-px h-6 bg-border" />

                <ExportMenu />

                <div className="w-px h-6 bg-border" />
              </>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
