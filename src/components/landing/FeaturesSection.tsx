import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Zap, Layout } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { FeaturePreview, FeatureKey } from './FeaturePreview';

const features = [
  { id: 'ai' as FeatureKey, title: 'AI Writing Assistant', description: 'Transform bullet points into impact statements instantly.', icon: Sparkles },
  { id: 'ats' as FeatureKey, title: 'ATS Optimization', description: 'Engineered to pass the most sophisticated filters.', icon: ShieldCheck },
  { id: 'format' as FeatureKey, title: 'Instant Formatting', description: 'Pixel-perfect PDF exports in seconds, not hours.', icon: Zap },
  { id: 'templates' as FeatureKey, title: 'Modern Templates', description: 'Professional designs that stand out from the noise.', icon: Layout },
];

export const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('ai');

  return (
    <section className="py-32 px-6 bg-black relative">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight mb-4">
            Built for the modern professional.
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            Experience the precision of a resume builder designed by experts, powered by intelligence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <FeatureCard
                key={f.id}
                isActive={activeFeature === f.id}
                onClick={() => setActiveFeature(f.id)}
                {...f}
              />
            ))}
          </div>
          
          <div className="sticky top-32">
            <FeaturePreview activeFeature={activeFeature} />
          </div>
        </div>
      </div>
    </section>
  );
};
