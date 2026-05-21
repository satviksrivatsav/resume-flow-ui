import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import AtsChecker from '@/ats/pages/AtsChecker';
import AtsReports from '@/ats/pages/AtsReports';
import { ProtectedRoute } from '@/auth/components/ProtectedRoute';
import { PublicRoute } from '@/auth/components/PublicRoute';
import ForgotPasswordPage from '@/auth/pages/ForgotPasswordPage';
import LoginPage from '@/auth/pages/LoginPage';
import SignUpPage from '@/auth/pages/SignUpPage';
import UpdatePasswordPage from '@/auth/pages/UpdatePasswordPage';
import DangerZonePage from '@/dashboard/pages/DangerZonePage';
import Dashboard from '@/dashboard/pages/Dashboard';
import ProfilePage from '@/dashboard/pages/ProfilePage';
import Index from '@/landing/pages/Index';
import PrivacyPolicy from '@/legal/pages/PrivacyPolicy';
import TermsOfService from '@/legal/pages/TermsOfService';
import ResumeBuilder from '@/resume/pages/ResumeBuilder';
import UploadResume from '@/resume/pages/UploadResume';
import AuthLayout from '@/shared/components/layout/AuthLayout';
import { FaviconManager } from '@/shared/components/layout/FaviconManager';
import { Toaster } from '@/shared/components/ui/toaster';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { useInactivityTimeout } from '@/shared/hooks/useInactivityTimeout';
import NotFound from '@/shared/pages/NotFound';
import { useAuthStore } from '@/shared/stores/authStore';

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  // Keep a stable key for auth routes so AuthLayout stays mounted between
  // /login and /signup, allowing the live panel-swap animation.
  const isAuthRoute = ['/login', '/signup'].includes(location.pathname);
  const routeKey = isAuthRoute ? 'auth' : location.pathname;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={routeKey}>
        <Route path="/" element={<Index />} />

        {/* Auth routes share a layout so panels can slide between each other */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/update-password"
            element={
              <ProtectedRoute>
                <UpdatePasswordPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reports"
          element={
            <ProtectedRoute>
              <AtsReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/danger"
          element={
            <ProtectedRoute>
              <DangerZonePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-builder"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/upload"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/ats"
          element={
            <ProtectedRoute>
              <AtsChecker />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const { initialize } = useAuthStore();

  // Register inactivity timeout monitoring
  useInactivityTimeout();

  useEffect(() => {
    void initialize();
    void import('@/shared/lib/geolocation').then((m) => m.initializeCountryCode());
  }, [initialize]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <FaviconManager />
      <div className="min-h-screen font-sans antialiased">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

const App = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem={true}
    enableColorScheme={true}
    disableTransitionOnChange={false}
    storageKey="resume-flow-theme"
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
