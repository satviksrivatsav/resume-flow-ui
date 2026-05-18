import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Logo } from '@/shared/components/ui/Logo';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto max-w-3xl px-6 py-20">
        <Link to="/">
          <Button variant="ghost" className="mb-16 gap-2 hover:bg-transparent hover:text-primary transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>
        </Link>

        <div className="flex flex-col items-center mb-24">
          <Logo className="w-14 h-14 mb-8" />
          <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="divide-y divide-border/30">
          <section className="py-12 first:pt-0">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">01</span>
              Acceptance of Terms
            </h2>
            <div className="pl-12 text-muted-foreground leading-relaxed">
              By accessing and using Resume Flow ("the Service"), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our service.
              We reserve the right to modify these terms at any time, and your continued use of the
              Service constitutes acceptance of any changes.
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">02</span>
              Description of Service
            </h2>
            <div className="pl-12 text-muted-foreground leading-relaxed">
              Resume Flow is an AI-powered resume building platform that allows users to create,
              edit, tailor to job descriptions, analyze ATS compatibility, and export professional resumes. The Service includes features such as resume
              templates, AI-assisted content generation, PDF export, and cloud storage of resume
              data.
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">03</span>
              User Accounts
            </h2>
            <div className="pl-12">
              <p className="text-muted-foreground leading-relaxed mb-4">To use certain features of the Service, you must:</p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed">
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Create an account with accurate and complete information</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Maintain the security of your account credentials</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Notify us immediately of any unauthorized access</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Be at least 13 years of age</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">04</span>
              User Content
            </h2>
            <div className="pl-12">
              <p className="text-muted-foreground leading-relaxed mb-6">
                You retain ownership of all content you create using the Service, including your
                resume data. By using the Service, you grant us a limited license to:
              </p>
              <ul className="space-y-4 text-muted-foreground leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span>Store and process your content to provide the Service</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span>Transmit your content to our backend and third-party AI providers to generate suggestions</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span>Create backups for data recovery purposes</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">05</span>
              Acceptable Use
            </h2>
            <div className="pl-12">
              <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed">
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Use the Service for any unlawful purpose</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Create false or misleading resume content</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Attempt to gain unauthorized access</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">06</span>
              AI-Generated Content
            </h2>
            <div className="pl-12 text-muted-foreground leading-relaxed">
              The Service utilizes various artificial intelligence models (such as OpenAI, Google Gemini, and Groq) via our backend systems to process your inputs and generate content suggestions, tailoring, and ATS feedback. While we
              strive for accuracy, AI-generated content may contain errors or inaccuracies. You are
              responsible for reviewing and verifying all AI-generated suggestions.
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">07</span>
              Intellectual Property
            </h2>
            <div className="pl-12 text-muted-foreground leading-relaxed">
              The Service, including its design, features, and underlying technology, is owned by
              Resume Flow and protected by intellectual property laws. You may not copy, modify,
              distribute, or reverse engineer any part of the Service without our written
              permission.
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">08</span>
              Disclaimer of Warranties
            </h2>
            <div className="pl-12 text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE
              DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. YOUR
              USE OF THE SERVICE IS AT YOUR OWN RISK.
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">09</span>
              Limitation of Liability
            </h2>
            <div className="pl-12 text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RESUME FLOW SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR
              USE OF THE SERVICE.
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">10</span>
              Termination
            </h2>
            <div className="pl-12 text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your access to the Service at any time
              for violation of these Terms. You may also delete your account at any time
              through your account settings.
            </div>
          </section>

          <section className="py-12 last:border-0">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">11</span>
              Contact
            </h2>
            <div className="pl-12 text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through our
              GitHub repository or reach out to the development team.
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsOfService;
