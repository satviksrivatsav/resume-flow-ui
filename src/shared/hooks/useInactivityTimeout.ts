import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/shared/stores/authStore';

const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour

export const useInactivityTimeout = () => {
  const { session, signOut } = useAuthStore();
  const lastActivityTime = useRef<number>(Date.now());

  useEffect(() => {
    // Only track inactivity if there is an active session
    if (!session) {
      return;
    }

    const handleActivity = () => {
      const now = Date.now();
      const elapsed = now - lastActivityTime.current;

      if (elapsed > INACTIVITY_LIMIT) {
        console.log('[InactivityTimeout] Limit reached, signing out...');
        void signOut();
      } else {
        lastActivityTime.current = now;
      }
    };

    // Attach global listeners
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // Cleanup listeners on unmount or session change
    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [session, signOut]);
};
