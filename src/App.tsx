import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import AuthLayout from './components/layout/AuthLayout';
import { FaviconManager } from './components/layout/FaviconManager';
import AtsChecker from './pages/AtsChecker';
import AtsReports from './pages/AtsReports';
import DangerZonePage from './pages/DangerZonePage';
import Dashboard from './pages/Dashboard';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProfilePage from './pages/ProfilePage';
import ResumeBuilder from './pages/ResumeBuilder';
import SignUpPage from './pages/SignUpPage';
import TermsOfService from './pages/TermsOfService';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import UploadResume from './pages/UploadResume';
import { useAuthStore } from './stores/authStore';

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/update-password"
          element={
            <ProtectedRoute>
              {' '}
              <UpdatePasswordPage />{' '}
            </ProtectedRoute>
          }
        />
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
        <Route path="/resume-builder" element={<ResumeBuilder />} />
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

  useEffect(() => {
    void initialize();
    import('./lib/geolocation').then((m) => m.initializeCountryCode());
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
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
