import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageTransition } from '@/shared/components/layout/PageTransition';
import { HeartbeatPulseBackground } from '@/shared/components/ui/backgrounds';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Logo } from '@/shared/components/ui/Logo';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuthStore } from '@/shared/stores/authStore';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await resetPassword(email);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.message) {
      toast({
        title: 'Success',
        description: 'Password reset link sent to your email',
      });
    }
  };

  return (
    <PageTransition className="h-screen flex overflow-hidden">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-black">
        {/* Heartbeat Pulse Background */}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            {/* Logo Circle Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: 1,
              }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 2,
                },
                opacity: {
                  duration: 0.5,
                  delay: 0.3,
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
          </motion.div>
        </div>
      </div>

      {/* Right side - Forgot Password Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Back button */}
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate('/login')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>

          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p className="text-muted-foreground mt-2">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
