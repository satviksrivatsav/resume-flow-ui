import { Github, Globe, Linkedin, Mail, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Logo } from '@/shared/components/ui/Logo';
import { config } from '@/shared/config/config';
import { cn } from '@/shared/lib/utils';

const SystemStatus = () => {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    const checkHealth = async () => {
      // Don't ping if the tab is hidden to save resources
      if (document.hidden) return;

      try {
        const baseUrl = new URL(config.aiApiUrl).origin;
        const res = await fetch(`${baseUrl}/health`, { method: 'GET' });
        if (res.ok) setStatus('ok');
        else setStatus('error');
      } catch (err) {
        setStatus('error');
      }
    };

    // Initial check
    checkHealth();

    // Continuous ping every 5 seconds
    const interval = setInterval(checkHealth, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          status === 'loading' ? 'bg-zinc-600' : status === 'ok' ? 'bg-success' : 'bg-destructive',
        )}
      />
      <span className="text-xs font-medium text-zinc-500">
        {status === 'loading'
          ? 'Checking API...'
          : status === 'ok'
            ? '200 OK — API Online'
            : 'API Offline'}
      </span>
    </div>
  );
};

export const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 py-20 px-6 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
              <Logo className="w-9 h-9 transition-transform duration-300 group-hover:scale-105" />
              <span className="text-xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors duration-300">
                Resume Flow
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              An open-source initiative dedicated to simplifying resume optimization with AI.
              Built for the community, by the community.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/satviksrivatsav/resume-flow-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all duration-300 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">UI</span>
              </a>
              <a
                href="https://github.com/satviksrivatsav/resume-flow-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all duration-300 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">API</span>
              </a>
              <a
                href="https://www.linkedin.com/company/resume-flow7"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all duration-300 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Features Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-400 dark:text-zinc-500">
              Features
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/resume-builder"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link
                  to="/upload"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Resume Parser
                </Link>
              </li>
              <li>
                <Link
                  to="/ats"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  ATS Checker
                </Link>
              </li>
              <li>
                <Link
                  to="/resume-builder"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Job Tailor
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-400 dark:text-zinc-500">
              Resources
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Writing Guide
                </a>
              </li>
              <li>
                <a
                  href="https://career.uci.edu/wp-content/uploads/2025/03/2025-Mastering-ATS-Career-Guide-8.5x11.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  ATS Secrets
                </a>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-400 dark:text-zinc-500">
              About
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/satviksrivatsav/resume-flow-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  About the Project
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-400 dark:text-zinc-500">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-zinc-400" />
                <a
                  href="mailto:satviksrivatsav@gmail.com"
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  satviksrivatsav@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-500 dark:text-zinc-400">IN</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>MIT Licensed • {currentYear}</span>
            <span className="hidden md:inline text-zinc-800 dark:text-zinc-800">|</span>
            <SystemStatus />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Globe className="w-3.5 h-3.5" />
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

