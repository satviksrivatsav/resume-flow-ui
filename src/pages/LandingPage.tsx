import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FeaturesCarousel } from '@/components/landing/FeaturesCarousel';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { PageTransition } from '@/components/layout/PageTransition';
import { AnimatedResumeHero } from '@/components/ui/AnimatedResumeHero';
import { MeshGradient } from '@/components/ui/MeshGradient';
import { useAuthStore } from '@/stores/authStore';
import { ResumeSelectionModal } from '@/components/dashboard/ResumeSelectionModal';

export default React.memo(function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isResumeSelectionModalOpen, setIsResumeSelectionModalOpen] = useState(false);

  return (
    <PageTransition className="w-full bg-black relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <MeshGradient />
      </div>

      {/* Hero Section - Natural Vertical Flow */}
      <div className="relative min-h-screen w-full z-20 flex flex-col items-center pt-24 md:pt-32 pb-0">
        <div className="container relative z-10 grid lg:grid-cols-12 gap-12 px-6 h-full pb-0 flex-1">
          <div className="lg:col-span-6 lg:pr-12 space-y-10 self-start pt-8 md:pt-12">
            <div className="space-y-6 text-left">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                You&apos;ve Done the Work.
                <br />
                Let&apos;s Make Sure It{' '}
                <span className="bg-gradient-to-r from-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                  Shows.
                </span>
              </h1>
              <p className="mt-6 text-sm md:text-base text-zinc-400 max-w-xl">
                Resume Flow combines intelligent AI assistance with clean, modern templates — so
                your experience gets the spotlight it deserves.
              </p>
            </div>

            {/* CTAs Group */}
            <div className="flex flex-col items-start gap-8">
              <div className="flex flex-row flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate(user ? '/dashboard' : '/login')}
                  className="whitespace-nowrap w-full sm:w-auto px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all text-sm"
                >
                  Build now
                </button>
                <button
                  onClick={() => {
                    if (user) {
                      setIsResumeSelectionModalOpen(true);
                    } else {
                      navigate('/ats');
                    }
                  }}
                  className="whitespace-nowrap w-full sm:w-auto px-8 py-3 bg-transparent text-white font-semibold rounded-full border border-white/20 hover:bg-white/5 transition-all backdrop-blur-sm text-sm"
                >
                  ATS Checker
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center lg:justify-end self-start">
            <AnimatedResumeHero className="w-full max-w-xl lg:max-w-2xl lg:-translate-y-12" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="w-full relative z-10 bg-black border-t border-white/5 -mt-24">
        <FeaturesCarousel />
      </div>

      {/* Footer Section */}
      <div className="w-full relative z-20 bg-black">
        <LandingFooter />
      </div>

      <ResumeSelectionModal
        isOpen={isResumeSelectionModalOpen}
        onClose={() => setIsResumeSelectionModalOpen(false)}
      />
    </PageTransition>
  );
});
