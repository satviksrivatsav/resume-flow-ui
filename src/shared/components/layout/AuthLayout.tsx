import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Logo } from '@/shared/components/ui/Logo';
import { HeartbeatPulseBackground } from '@/shared/components/ui/backgrounds';
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
            className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-black flex-shrink-0"
          >
            <HeartbeatPulseBackground
              gap={18}
              radius={1.5}
              color="rgba(255,255,255,0.15)"
              glowColor="rgba(255, 255, 255, 0.4)"
              opacity={0.8}
              centerX={0.5}
              centerY={0.42}
              pulseDuration={2000}
              pulseGap={2000}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-zinc-900/40 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
              <div className="text-center">
                {/* Logo circle */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 2,
                    },
                  }}
                  className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl relative z-10 mx-auto"
                >
                  <Logo
                    variant="dark"
                    className="w-24 h-24 transition-transform duration-300 opacity-80"
                  />
                </motion.div>

                <h2 className="text-4xl font-bold text-white mb-4">Resume Flow</h2>
                <p className="text-xl text-neutral-400 max-w-md">
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
