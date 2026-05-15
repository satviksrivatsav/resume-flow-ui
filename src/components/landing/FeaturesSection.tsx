import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';

import { FeatureRow } from './FeatureRow';
import { AIMockup } from './mockups/AIMockup';
import { ATSMockup } from './mockups/ATSMockup';
import { ParserMockup } from './mockups/ParserMockup';
import { TailorMockup } from './mockups/TailorMockup';

export const FeaturesSection = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const featuresData = [
    {
      title: 'AI Resume Writer.',
      description:
        'Drastically speed up your resume writing process. Thanks to artificial intelligence, generating high-impact bullet points is effortless.',
      bullets: [
        'Transform raw notes into professional achievements',
        'Tone matching for your specific industry',
        "Beat writer's block instantly",
      ],
      ctaText: 'Try AI Writer',
      mockup: <AIMockup />,
      reverse: false,
      link: '/resume-builder',
    },
    {
      title: 'Resume Parser.',
      description:
        'Upload your old PDF or Word document and let our parser instantly extract your experience, education, and skills.',
      bullets: [
        'Supports PDF, DOCX, and LinkedIn exports',
        'Accurate data extraction and categorization',
        'Start with your existing data, zero typing',
      ],
      ctaText: 'Resume Parser',
      mockup: <ParserMockup />,
      reverse: true,
      link: '/upload',
    },
    {
      title: 'ATS Resume Checker.',
      description:
        'Find out if your resume can pass the Applicant Tracking Systems used by top employers before you even apply.',
      bullets: [
        'Real-time ATS score and feedback',
        'Identify missing keywords',
        'Fix formatting issues automatically',
      ],
      ctaText: 'Check My Resume',
      mockup: <ATSMockup />,
      reverse: false,
      link: '/ats',
    },
    {
      title: 'Job Description Tailor.',
      description:
        "Align your resume perfectly with the job you want. Paste the job description, and we'll tailor your resume to match exactly what recruiters want.",
      bullets: [
        'Highlight exactly what recruiters want to see',
        'Re-order skills and experience for maximum impact',
        'Increase your interview chances significantly',
      ],
      ctaText: 'Tailor My Resume',
      mockup: <TailorMockup />,
      reverse: true,
      link: '/resume-builder',
    },
  ];

  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="mb-24 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Everything your resume needs.
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Built for the modern professional, powered by intelligence.
          </p>
        </div>

        <div className="flex flex-col">
          {featuresData.map((feature, idx) => (
            <FeatureRow
              key={idx}
              {...feature}
              onClick={() => navigate(user ? feature.link : '/login')}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

