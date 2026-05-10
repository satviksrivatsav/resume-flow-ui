import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { ResumePDF } from './ResumePDF';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { getMissingMandatorySections } from '@/utils/mandatoryFieldValidator';


export const DownloadButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { resumeData } = useResumeStore();
  const { toast } = useToast();

  const handleDownload = async () => {
    // Validate mandatory fields before proceeding
    const missingForms = getMissingMandatorySections(resumeData);
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
      link.download = `${resumeData.basics.name || 'Resume'}.pdf`;

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