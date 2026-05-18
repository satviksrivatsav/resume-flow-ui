import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Logo } from '@/shared/components/ui/Logo';

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="divide-y divide-border/30">
          <section className="py-12 first:pt-0">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">01</span>
              Information We Collect
            </h2>
            <div className="pl-12">
              <p className="text-muted-foreground leading-relaxed mb-6">
                When you use Resume Flow, we collect information that you provide directly to us:
              </p>
              <ul className="space-y-4 text-muted-foreground leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span>
                    <strong className="text-foreground/90 font-semibold">Account Information:</strong> Email address, name, and authentication data
                    when you create an account or sign in via social providers.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span>
                    <strong className="text-foreground/90 font-semibold">Resume Data:</strong> Personal information, work experience, education,
                    skills, and other details you enter while building your resume.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span>
                    <strong className="text-foreground/90 font-semibold">Usage Data:</strong> Information about how you interact with our service,
                    including pages visited and features used.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">02</span>
              How We Use Your Information
            </h2>
            <div className="pl-12">
              <p className="text-muted-foreground leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed">
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Provide, maintain, and improve our resume building service</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Process and store your resume data securely</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Authenticate your identity and manage your account</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Generate AI-powered suggestions and ATS analysis</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Send you service-related communications</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">03</span>
              Data Storage and Security
            </h2>
            <div className="pl-12">
              <p className="text-muted-foreground leading-relaxed">
                Your resume data is stored securely in our database. We implement industry-standard
                security measures to protect your information, including encryption in transit and at
                rest. Your authentication is handled by Supabase, a trusted authentication provider
                with enterprise-grade security. When using AI features, your data is securely transmitted 
                to our custom backend for processing before being sent to third-party AI providers.
              </p>
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">04</span>
              Third-Party Services
            </h2>
            <div className="pl-12">
              <p className="text-muted-foreground leading-relaxed mb-6">We use the following third-party services:</p>
              <ul className="space-y-4 text-muted-foreground leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span>
                    <strong className="text-foreground/90 font-semibold">Supabase:</strong> Authentication, database, and user management.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span>
                    <strong className="text-foreground/90 font-semibold">AI Service Providers:</strong> Integration with multiple AI models (OpenAI, Gemini, Groq) to power content suggestions and analysis.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span>
                    <strong className="text-foreground/90 font-semibold">Social Providers:</strong> Google, GitHub, and LinkedIn for authentication.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">05</span>
              Your Rights
            </h2>
            <div className="pl-12">
              <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed">
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Access your personal data stored in our service</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Request correction of inaccurate data</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Request deletion of your account and associated data</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>Export your resume data at any time</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">06</span>
              Cookies and Local Storage
            </h2>
            <div className="pl-12">
              <p className="text-muted-foreground leading-relaxed">
                We use local storage and cookies to maintain your session, remember your preferences
                (like theme settings), and improve your experience. These are essential for the proper
                functioning of the service.
              </p>
            </div>
          </section>

          <section className="py-12 last:border-0">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10">07</span>
              Contact Us
            </h2>
            <div className="pl-12 text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please
              contact us through our GitHub repository or reach out to the development team.
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
