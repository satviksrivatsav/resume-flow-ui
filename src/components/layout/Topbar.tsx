import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Save, RefreshCw, Check, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Logo } from '@/components/ui/Logo';
import { ExportMenu } from '@/components/resume/ExportMenu';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';
import { useUiStore } from '@/stores/uiStore';

export const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveStatus, saveResume } = useResumeStore();
  const { showPreview, setShowPreview } = useUiStore();

  const isBuilderPage = location.pathname === '/resume-builder';
  const isHomePage = location.pathname === '/';

  if (isHomePage) return null;

  return (
    <header className="absolute top-0 left-0 right-0 z-40 bg-card/40 backdrop-blur-md overflow-hidden shrink-0 border-b border-border transition-all duration-500 ease-in-out h-[var(--header-height)]">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-[-100%] opacity-[0.03] dark:opacity-[0.05] animate-[gradient-flow_20s_ease_infinite] bg-[linear-gradient(90deg,transparent_0%,rgba(var(--primary-rgb),0.5)_25%,rgba(var(--primary-rgb),1)_50%,rgba(var(--primary-rgb),0.5)_75%,transparent_100%)] bg-[length:400%_100%]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      <div className="px-6 h-full relative flex items-center transition-all duration-500 ease-in-out">
        <div className="flex items-center justify-between w-full">
          {/* Left: Logo + brand */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 group/logo cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <Logo className="w-8 h-8 transition-transform duration-500 group-hover/logo:scale-110" />
              <h1 className="text-xl font-bold text-foreground hidden sm:block tracking-tight">
                Resume Flow
              </h1>
            </div>
          </div>

          {/* Right: Builder actions + Theme toggle */}
          <div className="flex items-center gap-2">
            {isBuilderPage && (
              <>
                <motion.div whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    onClick={() => saveResume()}
                    disabled={saveStatus !== 'idle'}
                    className={cn(
                      'gap-2 border h-10 px-4 rounded-full transition-all font-medium',
                      saveStatus === 'error'
                        ? 'bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive/20'
                        : saveStatus === 'success'
                          ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                          : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10',
                    )}
                  >
                    {saveStatus === 'saving' ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : saveStatus === 'success' ? (
                      <Check className="w-4 h-4" />
                    ) : saveStatus === 'error' ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline font-medium">
                      {saveStatus === 'saving'
                        ? 'Saving...'
                        : saveStatus === 'success'
                          ? 'Saved'
                          : saveStatus === 'error'
                            ? 'Save Failed'
                            : 'Save'}
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
                          transition={{
                            duration: 0.2,
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                          }}
                          className="absolute inset-0"
                        >
                          {showPreview ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
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
