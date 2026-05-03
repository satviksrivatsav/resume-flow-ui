import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { ResumePDF } from './ResumePDF';
import { useToast } from '@/hooks/use-toast';
import { ResumeData } from '@/types/resume';
import { motion } from 'framer-motion';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';

// Validate mandatory fields before download
const validateMandatoryFields = (resumeData: ResumeData): string[] => {
  const missingForms = new Set<string>();

  // Personal Info mandatory fields
  if (
    !resumeData.personalInfo.name?.trim() ||
    !resumeData.personalInfo.email?.trim() ||
    !resumeData.personalInfo.phone?.trim()
  ) {
    missingForms.add('Personal Info');
  }

  // Work Experience (only if entries exist)
  resumeData.workExperience.forEach((exp) => {
    if (
      !exp.position?.trim() ||
      !exp.company?.trim() ||
      !exp.startDate?.trim() ||
      (!exp.current && !exp.endDate?.trim())
    ) {
      missingForms.add('Work Experience');
    }
  });

  // Education (only if entries exist)
  resumeData.education.forEach((edu) => {
    if (
      !edu.school?.trim() ||
      !edu.degree?.trim() ||
      !edu.startDate?.trim() ||
      !edu.endDate?.trim() ||
      !edu.grade?.trim()
    ) {
      missingForms.add('Education');
    }
  });

  // Projects (only if entries exist)
  resumeData.projects.forEach((proj) => {
    if (!proj.name?.trim() || !proj.description?.trim()) {
      missingForms.add('Projects');
    }
  });

  return Array.from(missingForms);
};

export const DownloadButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { resumeData } = useResumeStore();
  const { toast } = useToast();

  const handleDownload = async () => {
    // Validate mandatory fields before proceeding
    const missingForms = validateMandatoryFields(resumeData);
    if (missingForms.length > 0) {
      toast({
        title: 'Missing Required Fields',
        description: `Please fill the mandatory fields in the form(s): ${missingForms.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      console.log('Starting PDF generation...');
      console.log('Resume data:', resumeData);

      // Generate the PDF blob
      const blob = await pdf(<ResumePDF resumeData={resumeData} />).toBlob();

      console.log('PDF blob generated:', blob);

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.personalInfo.name || 'Resume'}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success!',
        description: 'Your resume has been downloaded.',
      });
    } catch (error) {
      console.error('PDF generation error:', error);

      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div whileHover="hover" whileTap="tap">
      <Button
        onClick={handleDownload}
        disabled={isGenerating}
        className="gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <AnimatedIcon icon={Download} preset="bounceDown" className="w-4 h-4" />
            Download PDF
          </>
        )}
      </Button>
    </motion.div>
  );
};