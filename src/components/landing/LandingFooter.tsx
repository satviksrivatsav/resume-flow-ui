import { ArrowRight, Github, Globe, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import LogoImage from '@/assets/logo.png';

export const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 py-20 px-6 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
              <img
                src={LogoImage}
                alt="Logo"
                className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors duration-300">
                Resume Flow
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              Empowering job seekers with AI-driven optimization and modern design. Craft your
              future with precision.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all duration-300"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-400 dark:text-zinc-500">
              Product
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
                  Import Resume
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Templates
                </a>
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
                  href="#"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Writing Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  ATS Secrets
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Career Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-400 dark:text-zinc-500">
              Company
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
                  href="#"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-black dark:hover:text-white transition-colors"
                >
                  Careers
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
                  href="mailto:support@resumeflow.com"
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  support@resumeflow.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-500 dark:text-zinc-400">San Francisco, CA</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-200 dark:text-white font-medium">
                <span>Developer:</span>
                <a href="mailto:dev@resumeflow.com" className="underline underline-offset-4">
                  dev@resumeflow.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>© {currentYear} Resume Flow Inc.</span>
            <span className="hidden md:inline text-zinc-800 dark:text-zinc-800">|</span>
            <span className="hidden md:inline">Built with passion for builders.</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Globe className="w-3.5 h-3.5" />
              <span>English (US)</span>
            </div>
            <button className="text-xs font-semibold px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
              System Status
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
