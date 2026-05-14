import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle, FileText, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { AILoadingModal } from '@/components/ui/AILoadingModal';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore } from '@/stores/resumeStore';
import { useTailorStore } from '@/stores/tailorStore';
import { config } from '@/config/config';
import { cn } from '@/lib/utils';

export const TailorForm = () => {
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleCancel = () => {
    abortControllerRef.current?.abort();
    setIsTailoring(false);
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
    const allSelected = availableSections.length > 0 && 
                        availableSections.every(s => sectionsToTailor.includes(s.id));
    
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
      setSectionsToTailor(availableSections.map(s => s.id));
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

    const sectionsToSubmit = tailorEntire ? availableSections.map(s => s.id) : sectionsToTailor;

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold">Job Description</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Paste the job description you want to tailor your resume for. The AI will analyze it and
          suggest improvements to your content.
        </p>
        <Textarea
          placeholder="Paste the job description here..."
          className="min-h-[300px] bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary transition-all resize-none rounded-2xl p-6"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold">Tailoring Options</h3>
        </div>
        
        <div className="space-y-3">
          <div 
            className={cn(
              "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
              tailorEntire ? "bg-primary/5 border-primary/40 shadow-sm" : "bg-card/50 border-border"
            )}
            onClick={() => setTailorEntire(!tailorEntire)}
          >
            <div className="space-y-0.5">
              <Label className="text-base font-semibold cursor-pointer">Tailor the entire resume</Label>
              <p className="text-xs text-muted-foreground">Modify all sections to align with the JD.</p>
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
                <div className="pt-2 space-y-2 pl-2">
                  <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-2">
                    <ChevronDown className="w-3 h-3" />
                    Select Specific Sections
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableSections.map((section) => {
                      const isSelected = sectionsToTailor.includes(section.id);
                      return (
                        <motion.div
                          key={section.id}
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "relative group flex items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden",
                            isSelected 
                              ? "bg-primary/10 border-primary" 
                              : "bg-card/50 border-border hover:border-primary/30 hover:bg-primary/[0.02]"
                          )}
                          onClick={() => handleToggleSection(section.id)}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Label className={cn(
                              "font-bold text-sm cursor-pointer transition-colors duration-300",
                              isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                              {section.label}
                            </Label>
                          </div>
                        </motion.div>
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

      <div className="pt-4">
        <Button
          className="w-full h-14 rounded-2xl text-lg font-bold gap-3 transition-all hover:scale-[1.01]"
          size="lg"
          onClick={handleTailor}
          disabled={isTailoring || !jobDescription.trim()}
        >
          <Sparkles className="w-6 h-6" />
          Tailor Content Now
        </Button>
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
