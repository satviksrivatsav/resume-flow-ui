import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ChevronDown, CloudUpload, FileText, Loader2, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { AILoadingModal } from '@/components/ui/AILoadingModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { config } from '@/config/config';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';
import { useTailorStore } from '@/stores/tailorStore';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { extractTextFromFile } from '@/lib/atsApi';

export const TailorForm = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const { resumeData } = useResumeStore();
  const {
    jobDescription,
    setJobDescription,
    sectionsToTailor,
    setSectionsToTailor,
    isTailoring,
    setIsTailoring,
    setTailoredSections,
    setViewMode,
    setError,
    error,
  } = useTailorStore();

  const [tailorEntire, setTailorEntire] = useState(true);
  const [isExtractingJd, setIsExtractingJd] = useState(false);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleCancel = () => {
    abortControllerRef.current?.abort();
    setIsTailoring(false);
  };

  const handleJdFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsExtractingJd(true);
        setJdFile(file);
        const text = await extractTextFromFile(file);
        setJobDescription(text);
        toast.success('Job description extracted from file');
      } catch (err: any) {
        console.error('JD extraction failed:', err);
        toast.error(err.message || 'Failed to extract text from JD file');
        setJdFile(null);
      } finally {
        setIsExtractingJd(false);
      }
    }
  };

  const handleClearJdFile = () => {
    setJdFile(null);
    setJobDescription('');
  };

  const getAvailableSections = () => {
    const sections: { id: string; label: string }[] = [];

    // Headline (part of basics)
    if (resumeData.basics.headline && resumeData.basics.headline.trim()) {
      sections.push({ id: 'headline', label: 'Headline' });
    }

    // Standard Sections
    const sectionConfig: Record<string, string> = {
      experience: 'Work Experience',
      education: 'Education',
      projects: 'Projects',
      skills: 'Skills',
      awards: 'Awards',
      certifications: 'Certifications',
      publications: 'Publications',
      volunteer: 'Volunteer',
      references: 'References',
    };

    Object.entries(resumeData.sections).forEach(([key, section]: [string, any]) => {
      if (sectionConfig[key] && section.items && section.items.length > 0) {
        sections.push({ id: key, label: sectionConfig[key] });
      }
    });

    // Custom Sections
    resumeData.customSections.forEach((s) => {
      if (s.items && s.items.length > 0) {
        sections.push({ id: s.id, label: s.name });
      }
    });

    return sections;
  };

  const availableSections = getAvailableSections();

  // Sync tailorEntire with sectionsToTailor
  useEffect(() => {
    const allSelected =
      availableSections.length > 0 &&
      availableSections.every((s) => sectionsToTailor.includes(s.id));

    if (allSelected && !tailorEntire) {
      setTailorEntire(true);
    } else if (!allSelected && tailorEntire) {
      // If the user unselected something while "entire" was on,
      // we already handle that in handleToggleSection,
      // but this effect keeps it robust.
      setTailorEntire(false);
    }
  }, [sectionsToTailor, availableSections, tailorEntire, setSectionsToTailor]);

  const handleToggleSection = (id: string) => {
    const isCurrentlySelected = sectionsToTailor.includes(id);
    let newSections: string[];

    if (isCurrentlySelected) {
      newSections = sectionsToTailor.filter((s) => s !== id);
    } else {
      newSections = [...sectionsToTailor, id];
    }

    setSectionsToTailor(newSections);

    // If we just enabled the last remaining section, the effect will handle tailorEntire.
    // If we just disabled a section while tailorEntire was true, the effect handles it.
  };

  const handleToggleEntire = (checked: boolean) => {
    setTailorEntire(checked);
    if (checked) {
      setSectionsToTailor(availableSections.map((s) => s.id));
    } else {
      // User turned off "Tailor Entire Resume", so we reset/clear the selections
      // as requested to allow for a clean start.
      setSectionsToTailor([]);
    }
  };

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }

    const sectionsToSubmit = tailorEntire ? availableSections.map((s) => s.id) : sectionsToTailor;

    if (sectionsToSubmit.length === 0) {
      setError('Please select at least one section to tailor.');
      return;
    }

    setIsTailoring(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${config.aiApiUrl}/resume/tailor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          resume_data: resumeData,
          job_description: jobDescription,
          sections_to_tailor: sectionsToSubmit,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTailoredSections(result.data.tailoredSections);
        setViewMode('diff');
      } else {
        setError(result.detail || 'Failed to tailor resume. Please try again.');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Tailoring error:', err);
      setError('A network error occurred. Please check your connection and try again.');
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="px-2">
            <h3 className="text-lg font-bold">Job Description</h3>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="tailor-jd-upload"
              className={cn(
                'inline-flex items-center gap-2 px-5 h-10 bg-background border border-border/50 rounded-full text-[11px] font-bold text-muted-foreground transition-all cursor-pointer uppercase tracking-wider hover:text-foreground hover:border-primary/30',
                (isExtractingJd || isTailoring) && 'opacity-50 cursor-not-allowed pointer-events-none',
              )}
            >
              {isExtractingJd ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CloudUpload className="w-3.5 h-3.5" />
              )}
              {isExtractingJd ? 'Extracting...' : 'Upload File'}
            </label>
            <input
              id="tailor-jd-upload"
              type="file"
              accept=".txt,.pdf,.docx"
              className="hidden"
              onChange={handleJdFileUpload}
              disabled={isExtractingJd || isTailoring}
            />
            {(jdFile || jobDescription.trim()) && !isExtractingJd && !isTailoring && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearJdFile}
                className="h-10 rounded-full text-[10px] font-bold text-muted-foreground hover:text-destructive gap-1.5 px-3 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          <Textarea
            placeholder={
              isExtractingJd
                ? 'Extracting text from file...'
                : 'Paste the job description here or upload a file above...'
            }
            className={cn(
              'min-h-[260px] bg-background border-border/50 focus:border-primary/30 focus:ring-primary/5 transition-all resize-none rounded-[2rem] p-8 text-sm leading-relaxed scrollbar-hide',
              isExtractingJd && 'opacity-50 cursor-not-allowed',
            )}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isExtractingJd || isTailoring}
          />
          {isExtractingJd && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
            </div>
          )}
          {jdFile && !isExtractingJd && (
            <div className="absolute top-6 right-6 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
              File: {jdFile.name}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">


        <div className="space-y-6">
          <div
            className="flex items-center justify-between px-4 py-2 transition-all cursor-pointer group"
            onClick={() => setTailorEntire(!tailorEntire)}
          >
            <div className="space-y-0.5">
              <Label className="text-base font-bold cursor-pointer group-hover:text-primary transition-colors">
                Tailor Entire Resume
              </Label>
              <p className="text-[11px] text-muted-foreground/60 font-medium">
                AI will optimize every section for the JD.
              </p>
            </div>
            <Switch
              checked={tailorEntire}
              onCheckedChange={handleToggleEntire}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <AnimatePresence>
            {!tailorEntire && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-4 px-2">
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40 px-2">
                    <ChevronDown className="w-3 h-3" />
                    Select Specific Sections
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSections.map((section) => {
                      const isSelected = sectionsToTailor.includes(section.id);
                      return (
                        <motion.button
                          key={section.id}
                          initial={{ scale: 0.98, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleToggleSection(section.id)}
                          className={cn(
                            'px-6 py-2.5 rounded-full border text-[13px] font-bold transition-all duration-300',
                            isSelected
                              ? 'bg-primary/10 border-primary/40 text-primary'
                              : 'bg-background border-border/50 text-muted-foreground hover:border-primary/20 hover:text-foreground',
                          )}
                        >
                          {section.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      <div className="pt-2">
        <motion.div
          onHoverStart={() => {
            if (isTailoring || !jobDescription.trim()) return;
            setIsButtonHovered(true);
            setIsButtonAnimating(true);
          }}
          onHoverEnd={() => setIsButtonHovered(false)}
          animate={
            (isButtonHovered || isButtonAnimating) && !isTailoring && jobDescription.trim()
              ? 'hover'
              : 'initial'
          }
          onAnimationComplete={() => setIsButtonAnimating(false)}
          whileTap={isTailoring || !jobDescription.trim() ? undefined : 'tap'}
        >
          <Button
            className="w-full h-14 rounded-full text-lg font-bold gap-3 transition-all"
            size="lg"
            onClick={handleTailor}
            disabled={isTailoring || !jobDescription.trim()}
          >
            <AnimatedIcon icon={Sparkles} preset="sparkle" className="w-6 h-6" />
            Tailor Resume Now
          </Button>
        </motion.div>
      </div>

      <AILoadingModal
        isOpen={isTailoring}
        onCancel={handleCancel}
        message="Tailoring your resume sections for the job description..."
        title="AI Tailor"
      />
    </div>
  );
};
