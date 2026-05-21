import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Download, FileCode, FileJson, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { ResumeData } from '@/shared/types/resume';
import { generateDocx } from '@/shared/utils/export/docxGenerator';
import { PDFGenerator } from '@/shared/utils/export/pdfGenerator';
import { getMissingMandatorySections } from '@/shared/utils/mandatoryFieldValidator';

interface ExportResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  resumeName: string;
}

export function ExportResumeModal({
  isOpen,
  onClose,
  resumeData,
  resumeName,
}: ExportResumeModalProps) {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { toast } = useToast();

  const validate = () => {
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
    if (!validate()) return;
    setIsGenerating('pdf');
    try {
      const blob = await pdf(<PDFGenerator resumeData={resumeData} />).toBlob();
      saveAs(blob, `${resumeName || 'Resume'}.pdf`);
      toast({ title: 'Success!', description: 'PDF downloaded.', variant: 'success' });
      onClose();
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleExportDocx = async () => {
    if (!validate()) return;
    setIsGenerating('docx');
    try {
      const blob = await generateDocx(resumeData);
      saveAs(blob, `${resumeName || 'Resume'}.docx`);
      toast({ title: 'Success!', description: 'DOCX downloaded.', variant: 'success' });
      onClose();
    } catch (error) {
      console.error('DOCX export error:', error);
      toast({ title: 'Error', description: 'Failed to generate DOCX.', variant: 'destructive' });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleExportJSON = () => {
    if (!validate()) return;
    try {
      const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
      saveAs(blob, `${resumeName || 'Resume'}.json`);
      toast({ title: 'Success!', description: 'JSON downloaded.', variant: 'success' });
      onClose();
    } catch (error) {
      console.error('JSON export error:', error);
      toast({ title: 'Error', description: 'Failed to export JSON.', variant: 'destructive' });
    }
  };

  const exportOptions = [
    {
      id: 'pdf',
      label: 'PDF Document',
      description: 'Best for sharing and printing',
      icon: FileText,
      onClick: handleExportPDF,
      recommended: true,
    },
    {
      id: 'docx',
      label: 'Word (.docx)',
      description: 'Editable in Microsoft Word',
      icon: FileCode,
      onClick: handleExportDocx,
    },
    {
      id: 'json',
      label: 'JSON Data',
      description: 'Raw data for developers',
      icon: FileJson,
      onClick: handleExportJSON,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Export Resume
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Choose your preferred format for{' '}
            <span className="font-semibold text-foreground">&quot;{resumeName}&quot;</span>
          </p>
        </DialogHeader>

        <div className="p-4 flex flex-col gap-2">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            const isLoading = isGenerating === option.id;

            return (
              <button
                key={option.id}
                onClick={option.onClick}
                disabled={!!isGenerating}
                className="group relative flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-accent/5 hover:bg-accent/10 hover:border-primary/30 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <Icon className="w-6 h-6 text-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{option.label}</span>
                    {option.recommended && (
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0 h-4 bg-success/10 text-success border-success/20 font-bold uppercase tracking-wider"
                      >
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{option.description}</p>
                </div>

                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/5 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
