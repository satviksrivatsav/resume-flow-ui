import { Loader2 } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/shared/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isInitialized } = useAuthStore();
  const location = useLocation();

  // Block rendering until the auth store has completed its initial session
  // check. Using isInitialized (a one-way flag) avoids re-showing the spinner
  // when isLoading flips true during subsequent profile fetches.
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login, but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
