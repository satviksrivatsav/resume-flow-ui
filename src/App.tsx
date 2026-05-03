import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import ResumeBuilder from "./pages/ResumeBuilder";
import UploadResume from "./pages/UploadResume";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AuthLayout from "./components/layout/AuthLayout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";

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
        <Route path="/update-password" element={<ProtectedRoute> <UpdatePasswordPage /> </ProtectedRoute>} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/upload" element={<UploadResume />} />
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
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AnimatedRoutes />
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
