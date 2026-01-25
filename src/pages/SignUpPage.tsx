import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Github, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { HeartbeatPulseBackground } from '@/components/ui/heartbeat-pulse-background';
import { PageTransition } from "@/components/layout/PageTransition";
import LogoImage from '@/assets/ResumeFlowCut.png';

export default function SignUpPage() {
    const navigate = useNavigate();
    const { signUp, signInWithProvider, isLoading, error, clearError } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        const result = await signUp(email, password);
        if (!result.error) {
            navigate('/resume-builder');
        }
    };

    const handleOAuth = (provider: 'google' | 'github' | 'linkedin_oidc') => {
        signInWithProvider(provider);
    };

    const displayError = localError || error;

    return (
        <PageTransition className="h-screen flex overflow-hidden">
            {/* Left side - Sign Up Form */}
            <div className="w-full lg:w-3/5 flex items-center justify-center p-6 bg-background overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Back button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-2"
                        onClick={() => navigate('/')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>

                    <div className="space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold">Create account</h1>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Start building your professional resume today
                            </p>
                        </div>

                        {/* OAuth Buttons */}
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full gap-2 h-9 text-sm"
                                onClick={() => handleOAuth('google')}
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full gap-2 h-9 text-sm"
                                onClick={() => handleOAuth('github')}
                                disabled={isLoading}
                            >
                                <Github className="w-5 h-5" />
                                Continue with GitHub
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full gap-2 h-9 text-sm"
                                onClick={() => handleOAuth('linkedin_oidc')}
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                Continue with LinkedIn
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        {/* Email/Password Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {displayError && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                    {displayError}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            clearError();
                                            setLocalError('');
                                        }}
                                        className="pl-10 h-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            clearError();
                                            setLocalError('');
                                        }}
                                        className="pl-10 h-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setLocalError('');
                                        }}
                                        className="pl-10 h-9"
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-10" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right side - Decorative */}
            <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-black">
                {/* Heartbeat Pulse Background */}
                <HeartbeatPulseBackground
                    gap={18}
                    radius={1.5}
                    color="rgba(255,255,255,0.15)"
                    glowColor="rgba(59, 130, 246, 0.6)"
                    opacity={0.8}
                    centerX={0.5}
                    centerY={0.42}
                    pulseDuration={2000}
                    pulseGap={2000}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-900/20 pointer-events-none" />

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
                                opacity: 1
                            }}
                            transition={{
                                scale: {
                                    duration: 2, // Matches pulse duration
                                    repeat: Infinity,
                                    repeatDelay: 2
                                },
                                opacity: {
                                    duration: 0.5,
                                    delay: 0.3
                                }
                            }}
                            className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl relative z-10 mx-auto"
                        >
                            <img
                                src={LogoImage}
                                alt="Resume Flow"
                                className="w-24 h-24 object-contain"
                            />
                        </motion.div>
                        <h2 className="text-4xl font-bold text-white mb-4">Resume Flow</h2>
                        <p className="text-xl text-neutral-400 max-w-md">
                            Create stunning, professional resumes that stand out from the crowd.
                        </p>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
