import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { RadialGridBackground } from '@/shared/components/ui/backgrounds';
import { Logo } from '@/shared/components/ui/Logo';
import { useAuthStore } from '@/shared/stores/authStore';

export default function AuthLayout() {
  const location = useLocation();
  const { clearError } = useAuthStore();
  const isLogin = location.pathname === '/login';

  useEffect(() => {
    // Clear any auth errors when switching between login and signup
    clearError();
  }, [location.pathname, clearError]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen overflow-hidden"
    >
      <LayoutGroup id="auth-panels">
        <div className="h-full flex">
          {/* ── Logo / Decorative Panel ── */}
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{ order: isLogin ? 0 : 1 }}
            className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-zinc-50 dark:bg-black flex-shrink-0"
          >
            <RadialGridBackground />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
              <div className="text-center">
                {/* Logo circle */}
                <div className="w-40 h-40 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center mb-6 shadow-xl border border-zinc-800 dark:border-zinc-200 relative z-10 mx-auto">
                  <Logo
                    variant="light"
                    className="w-24 h-24 transition-transform duration-300 dark:hidden"
                  />
                  <Logo
                    variant="dark"
                    className="w-24 h-24 transition-transform duration-300 hidden dark:block"
                  />
                </div>

                <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                  Resume Flow
                </h2>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-md">
                  Create stunning, professional resumes that stand out from the crowd.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Form Panel ── */}
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{ order: isLogin ? 1 : 0 }}
            className="w-full lg:w-3/5 flex items-center justify-center p-6 bg-background overflow-y-auto flex-shrink-0"
          >
            {/* Fade the form content in/out on route change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeInOut' }}
                className="w-full max-w-md"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </LayoutGroup>
    </motion.div>
  );
}
