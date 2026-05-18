import { ArrowRight, Layout, ShieldCheck, Sparkles, Zap } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

const features = [
  {
    title: 'AI Writing Assistant',
    description:
      'Rewrite any bullet point in seconds. Our AI surfaces your best achievements while keeping your voice intact.',
    icon: Sparkles,
    color: 'bg-zinc-500',
  },
  {
    title: 'ATS Optimization',
    description:
      'Beat automated filters before a human even reads your resume. Engineered to pass ATS scans cleanly.',
    icon: ShieldCheck,
    color: 'bg-zinc-400',
  },
  {
    title: 'Instant Formatting',
    description:
      'Pick a template, fill in your details, and download a pixel-perfect PDF in minutes. No design tools needed.',
    icon: Zap,
    color: 'bg-zinc-600',
  },
  {
    title: 'Modern Templates',
    description:
      'Clean, professional, and distinct designs that put your experience in the spotlight it deserves.',
    icon: Layout,
    color: 'bg-zinc-300',
  },
];

export const FeaturesCarousel = () => {
  return (
    <section className="py-24 px-6 relative z-10 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Capabilities</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Everything your resume needs.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-300 flex flex-col h-full cursor-default"
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-300',
                  'bg-zinc-900 border-white/5 group-hover:border-white/20',
                )}
              >
                <feature.icon className="w-6 h-6 text-white group-hover:text-zinc-100 transition-colors" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-zinc-100 transition-colors text-left">
                {feature.title}
              </h3>

              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-grow text-left">
                {feature.description}
              </p>

              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors cursor-pointer">
                Learn more{' '}
                <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
