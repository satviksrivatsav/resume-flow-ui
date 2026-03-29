import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { ResumePDF } from './ResumePDF';
import { useToast } from '@/hooks/use-toast';
import { ResumeData } from '@/types/resume';

// Validate mandatory fields before download
const validateMandatoryFields = (resumeData: ResumeData): string[] => {
  const missingFields: string[] = [];

  // Personal Info mandatory fields
  if (!resumeData.personalInfo.name?.trim()) missingFields.push('Full Name');
  if (!resumeData.personalInfo.email?.trim()) missingFields.push('Email');
  if (!resumeData.personalInfo.phone?.trim()) missingFields.push('Phone');
  if (!resumeData.personalInfo.location?.trim()) missingFields.push('Location');

  // Work Experience (only if entries exist)
  resumeData.workExperience.forEach((exp, index) => {
    const entryName = exp.position || exp.company || `Work #${index + 1}`;
    if (!exp.position?.trim()) missingFields.push(`Position (${entryName})`);
    if (!exp.company?.trim()) missingFields.push(`Company (${entryName})`);
    if (!exp.startDate?.trim()) missingFields.push(`Start Date (${entryName})`);
    if (!exp.current && !exp.endDate?.trim()) missingFields.push(`End Date (${entryName})`);
  });

  // Education (only if entries exist)
  resumeData.education.forEach((edu, index) => {
    const entryName = edu.school || edu.degree || `Education #${index + 1}`;
    if (!edu.school?.trim()) missingFields.push(`School (${entryName})`);
    if (!edu.degree?.trim()) missingFields.push(`Degree (${entryName})`);
    if (!edu.startDate?.trim()) missingFields.push(`Start Date (${entryName})`);
    if (!edu.endDate?.trim()) missingFields.push(`End Date (${entryName})`);
  });

  // Projects (only if entries exist - all fields mandatory)
  resumeData.projects.forEach((proj, index) => {
    const entryName = proj.name || `Project #${index + 1}`;
    if (!proj.name?.trim()) missingFields.push(`Project Name (${entryName})`);
    if (!proj.role?.trim()) missingFields.push(`Role (${entryName})`);
    if (!proj.description?.trim()) missingFields.push(`Description (${entryName})`);
    if (!proj.startDate?.trim()) missingFields.push(`Start Date (${entryName})`);
    if (!proj.ongoing && !proj.endDate?.trim()) missingFields.push(`End Date (${entryName})`);
    if (!proj.technologies || proj.technologies.length === 0) missingFields.push(`Technologies (${entryName})`);
  });

  return missingFields;
};

export const DownloadButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { resumeData } = useResumeStore();
  const { toast } = useToast();

  const handleDownload = async () => {
    // Validate mandatory fields before proceeding
    const missingFields = validateMandatoryFields(resumeData);
    if (missingFields.length > 0) {
      toast({
        title: 'Missing Required Fields',
        description: `Please fill in the following mandatory fields: ${missingFields.join(', ')}`,
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
          <Download className="w-4 h-4" />
          Download PDF
        </>
      )}
    </Button>
  );
};