import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Download, FileCode, FileJson, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuthStore } from '@/shared/stores/authStore';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { generateDocx } from '@/shared/utils/export/docxGenerator';
import { PDFGenerator } from '@/shared/utils/export/pdfGenerator';
import { getMissingMandatorySections } from '@/shared/utils/mandatoryFieldValidator';

export const ExportMenu = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { resumeData } = useResumeStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateAndAuth = () => {
    // 1. Check Auth
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to export your resume.',
        variant: 'destructive',
      });
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }

    // 2. Validate mandatory fields
    const missingForms = getMissingMandatorySections(resumeData);
    if (missingForms.length > 0) {
      toast({
        title: 'Missing Required Fields',
        description: `Please fill the mandatory fields in the form(s): ${missingForms.join(', ')}`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleExportPDF = async () => {
    if (!validateAndAuth()) return;

    setIsGenerating(true);
    try {
      const blob = await pdf(<PDFGenerator resumeData={resumeData} />).toBlob();
      saveAs(blob, `${resumeData.basics.name || 'Resume'}.pdf`);
      toast({ title: 'Success!', description: 'PDF downloaded.' });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };


  const handleExportDocx = async () => {
    if (!validateAndAuth()) return;

    setIsGenerating(true);
    try {
      const blob = await generateDocx(resumeData);
      saveAs(blob, `${resumeData.basics.name || 'Resume'}.docx`);
      toast({ title: 'Success!', description: 'DOCX downloaded.' });
    } catch (error) {
      console.error('DOCX export error:', error);
      toast({ title: 'Error', description: 'Failed to generate DOCX.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportJSON = () => {
    if (!validateAndAuth()) return;

    try {
      const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
      saveAs(blob, `${resumeData.basics.name || 'Resume'}.json`);
      toast({ title: 'Success!', description: 'JSON downloaded.' });
    } catch (error) {
      console.error('JSON export error:', error);
      toast({ title: 'Error', description: 'Failed to export JSON.', variant: 'destructive' });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 bg-primary/5 border border-primary/20 h-10 px-4 rounded-full hover:bg-primary/10 transition-all text-primary font-medium"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleExportPDF} className="justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] px-1 py-0 h-4 bg-primary/10 text-primary border-primary/20"
          >
            Recommended
          </Badge>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportDocx}>
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            <span>Word (.docx)</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportJSON}>
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4" />
            <span>JSON</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
