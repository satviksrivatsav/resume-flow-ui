import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { PageTransition } from "@/components/layout/PageTransition";
import { MeshGradient } from "@/components/ui/MeshGradient";
import { AnimatedResumeHero } from "@/components/ui/AnimatedResumeHero";
import { HeartbeatPulseBackground } from "@/components/ui/heartbeat-pulse-background";

export default function LandingPage() {
  const navigate = useNavigate();
  const words = ["GREAT", "STRIKING", "MODERN", "BEAUTIFUL"];

  return (
    <PageTransition className="min-h-screen w-full bg-black relative overflow-hidden flex flex-col items-center justify-center pt-24 md:pt-20">
      <HeartbeatPulseBackground opacity={0.4} />
      <MeshGradient />

      <div className="container relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center px-6 py-12 md:py-0">
        <div className="lg:col-span-5 space-y-8">
          <div className="backdrop-blur-md bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Everyone deserves a <br />
              <ContainerTextFlip words={words} className="text-blue-500 bg-transparent shadow-none p-0" /> <br />
              Resume.
            </h1>
            <p className="mt-6 text-base md:text-lg text-zinc-400">
              Create stunning, professional resumes in minutes with Resume Flow. Modern templates, easy customization, and ATS-friendly designs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate("/resume-builder")}
              className="w-full sm:w-auto px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Build now
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="w-full sm:w-auto px-8 py-3 bg-transparent text-white font-semibold rounded-full border border-white/20 hover:bg-white/5 transition-all backdrop-blur-sm"
            >
              Create from existing resume
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <AnimatedResumeHero className="w-full max-w-xl" />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-4 text-sm text-neutral-500">
        <Link to="/privacy" className="hover:text-neutral-300 transition-colors">
          Privacy Policy
        </Link>
        <span className="text-neutral-700">•</span>
        <Link to="/terms" className="hover:text-neutral-300 transition-colors">
          Terms of Service
        </Link>
      </div>
    </PageTransition>
  );
}
