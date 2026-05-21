import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, CloudUpload, Loader2, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { AILoadingModal } from '@/shared/components/ui/AILoadingModal';
import { AnimatedIcon } from '@/shared/components/ui/AnimatedIcon';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor';
import { Switch } from '@/shared/components/ui/switch';
import { config } from '@/shared/config/config';
import { useToast } from '@/shared/hooks/use-toast';
import { extractTextFromFile } from '@/shared/lib/atsApi';
import { cn } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { useTailorStore } from '@/shared/stores/tailorStore';

export const TailorForm = () => {
  const { toast } = useToast();
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
    setTailoredSlides,
    setViewMode,
    setError,
  } = useTailorStore();

  const [tailorEntire, setTailorEntire] = useState(true);
  const [isExtractingJd, setIsExtractingJd] = useState(false);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      setIsTailoring(false);
      setIsExtractingJd(false);
    };
  }, [setIsTailoring, setIsExtractingJd]);

  const handleCancel = () => {
    abortControllerRef.current?.abort();
    setIsTailoring(false);
    setIsExtractingJd(false);
    setViewMode('form');
  };

  const handleJdFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      try {
        setIsExtractingJd(true);
        setJdFile(file);
        const text = await extractTextFromFile(file, controller.signal);
        setJobDescription(text);
        toast({
          title: 'Success',
          description: 'Job description extracted from file',
          variant: 'success',
        });
      } catch (err: any) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('JD extraction failed:', err);
        const isNetworkError =
          !navigator.onLine ||
          (err instanceof TypeError && err.message.toLowerCase().includes('fetch'));
        toast({
          title: isNetworkError ? 'Network Error' : 'Error',
          description: isNetworkError
            ? 'A network error occurred. Please check your connection and try again.'
            : 'Failed to extract text from the job description file. Please try again or paste it manually.',
          variant: 'destructive',
        });
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

    // Headline (part of basics) - Always visible if it exists
    if (resumeData.basics.headline && resumeData.basics.headline.trim()) {
      sections.push({ id: 'headline', label: 'Headline' });
    }

    // Summary
    if (
      resumeData.summary.visible &&
      resumeData.summary.content &&
      resumeData.summary.content.trim()
    ) {
      sections.push({ id: 'summary', label: 'Summary' });
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
      if (
        sectionConfig[key] &&
        section.visible &&
        section.items?.some((item: any) => item.visible)
      ) {
        sections.push({ id: key, label: sectionConfig[key] });
      }
    });

    // Custom Sections
    resumeData.customSections.forEach((s) => {
      if (s.visible && s.items && s.items.some((item: any) => item.visible)) {
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
      setTailorEntire(false);
    }
  }, [sectionsToTailor, availableSections, tailorEntire]);

  const handleToggleSection = (id: string) => {
    const isCurrentlySelected = sectionsToTailor.includes(id);
    let newSections: string[];

    if (isCurrentlySelected) {
      newSections = sectionsToTailor.filter((s) => s !== id);
    } else {
      newSections = [...sectionsToTailor, id];
    }

    setSectionsToTailor(newSections);
  };

  const handleToggleEntire = (checked: boolean) => {
    setTailorEntire(checked);
    if (checked) {
      setSectionsToTailor(availableSections.map((s) => s.id));
    } else {
      setSectionsToTailor([]);
    }
  };

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a job description.',
        variant: 'destructive',
      });
      return;
    }

    const sectionsToSubmit = tailorEntire ? availableSections.map((s) => s.id) : sectionsToTailor;

    if (sectionsToSubmit.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one section to tailor.',
        variant: 'destructive',
      });
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
        const slides: any[] = [];

        // Helper to check if a content value (string, object, or array) is empty
        const isContentEmpty = (content: any): boolean => {
          if (!content) return true;

          if (typeof content === 'string') {
            return (
              content
                .replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, '')
                .replace(/&#8203;/g, '')
                .replace(/[\u200B-\u200D\uFEFF]/g, '')
                .trim().length === 0
            );
          }

          if (typeof content === 'object') {
            if (Array.isArray(content)) {
              return content.length === 0 || content.every(isContentEmpty);
            }

            // Check specific text/rich-text fields
            const textFields = ['headline', 'content', 'name', 'description', 'summary'];
            let hasAnyTextField = false;
            let allTextFieldsEmpty = true;

            for (const key of textFields) {
              if (key in content) {
                hasAnyTextField = true;
                const val = content[key];
                if (val && typeof val === 'string') {
                  const clean = val
                    .replace(/<[^>]*>/g, '')
                    .replace(/&nbsp;/g, '')
                    .replace(/&#8203;/g, '')
                    .replace(/[\u200B-\u200D\uFEFF]/g, '')
                    .trim();
                  if (clean.length > 0) {
                    allTextFieldsEmpty = false;
                  }
                }
              }
            }

            // Check keywords array
            if ('keywords' in content) {
              hasAnyTextField = true;
              const kws = content.keywords;
              if (Array.isArray(kws) && kws.length > 0) {
                const hasVal = kws.some((kw) => typeof kw === 'string' && kw.trim().length > 0);
                if (hasVal) {
                  allTextFieldsEmpty = false;
                }
              }
            }

            // Check bullets array
            if ('bullets' in content) {
              hasAnyTextField = true;
              const bullets = content.bullets;
              if (Array.isArray(bullets) && bullets.length > 0) {
                const hasVal = bullets.some((b) => typeof b === 'string' && b.trim().length > 0);
                if (hasVal) {
                  allTextFieldsEmpty = false;
                }
              }
            }

            if (hasAnyTextField) {
              return allTextFieldsEmpty;
            }

            // Fallback: check all keys in object except id, visible
            const keys = Object.keys(content);
            if (keys.length === 0) return true;

            for (const key of keys) {
              if (key === 'id' || key === 'visible') continue;
              const val = content[key];
              if (val && typeof val === 'string') {
                const clean = val
                  .replace(/<[^>]*>/g, '')
                  .replace(/&nbsp;/g, '')
                  .replace(/&#8203;/g, '')
                  .replace(/[\u200B-\u200D\uFEFF]/g, '')
                  .trim();
                if (clean.length > 0) return false;
              }
              if (Array.isArray(val) && val.length > 0) {
                const hasVal = val.some((v) => typeof v === 'string' && v.trim().length > 0);
                if (hasVal) return false;
              }
            }
            return true;
          }

          return false;
        };

        const cleanText = (val: any): string => {
          if (!val || typeof val !== 'string') return '';
          return val
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, '')
            .replace(/&#8203;/g, '')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .trim();
        };

        const getConsolidatedDescription = (item: any): string => {
          if (!item) return '';
          if (item.description) return cleanText(item.description);

          let desc = item.summary ?? '';
          if (item.bullets && Array.isArray(item.bullets) && item.bullets.length > 0) {
            const activeBullets = item.bullets
              .map((b: string) => cleanText(b))
              .filter((b: string) => b.length > 0);
            if (activeBullets.length > 0) {
              if (desc) desc += '\n\n';
              desc += activeBullets.map((b: string) => `• ${b}`).join('\n');
            }
          }
          return cleanText(desc);
        };

        const hasChangesToReview = (sectId: string, orig: any, tail: any): boolean => {
          if (!orig && !tail) return false;

          if (sectId === 'headline') {
            const origHeadline = cleanText(typeof orig === 'string' ? orig : orig?.headline);
            const tailHeadline = cleanText(typeof tail === 'string' ? tail : tail?.headline);
            return (
              origHeadline !== tailHeadline && (origHeadline.length > 0 || tailHeadline.length > 0)
            );
          }

          if (sectId === 'summary') {
            const origContent = cleanText(typeof orig === 'string' ? orig : orig?.content);
            const tailContent = cleanText(typeof tail === 'string' ? tail : tail?.content);
            return (
              origContent !== tailContent && (origContent.length > 0 || tailContent.length > 0)
            );
          }

          if (sectId === 'skills') {
            const origName = cleanText(orig?.name);
            const tailName = cleanText(tail?.name);

            const origKeywords = Array.isArray(orig?.keywords)
              ? orig.keywords.map(cleanText).filter(Boolean)
              : [];
            const tailKeywords = Array.isArray(tail?.keywords)
              ? tail.keywords.map(cleanText).filter(Boolean)
              : [];

            const nameChanged =
              origName !== tailName && (origName.length > 0 || tailName.length > 0);
            const keywordsChanged =
              origKeywords.length !== tailKeywords.length ||
              origKeywords.some((kw, i) => kw !== tailKeywords[i]);

            const hasKeywords = origKeywords.length > 0 || tailKeywords.length > 0;
            const hasNames = origName.length > 0 || tailName.length > 0;

            return (nameChanged && hasNames) || (keywordsChanged && hasKeywords);
          }

          const origDesc = getConsolidatedDescription(orig);
          const tailDesc = getConsolidatedDescription(tail);

          return origDesc !== tailDesc && (origDesc.length > 0 || tailDesc.length > 0);
        };

        result.data.tailoredSections.forEach((section: any) => {
          if (section.tailoredContent?.items && Array.isArray(section.tailoredContent.items)) {
            section.tailoredContent.items.forEach((item: any, index: number) => {
              const origItem = section.originalContent?.items?.[index] || {};

              // Skip card if both original and tailored contents are empty
              if (isContentEmpty(origItem) && isContentEmpty(item)) {
                return;
              }

              // Skip card if there are no changes in reviewable/editable fields
              if (!hasChangesToReview(section.sectionId, origItem, item)) {
                return;
              }

              const title =
                item.company ||
                item.school ||
                item.name ||
                item.organization ||
                item.title ||
                item.position ||
                `Item ${index + 1}`;
              slides.push({
                slideId: `${section.sectionId}-${index}`,
                sectionId: section.sectionId,
                itemIndex: index,
                sectionName: `${section.sectionName}: ${title}`,
                originalContent: origItem,
                tailoredContent: item,
              });
            });
          } else {
            // Skip card if both original and tailored contents are empty
            if (
              isContentEmpty(section.originalContent) &&
              isContentEmpty(section.tailoredContent)
            ) {
              return;
            }

            // Skip card if there are no changes in reviewable/editable fields
            if (
              !hasChangesToReview(
                section.sectionId,
                section.originalContent,
                section.tailoredContent,
              )
            ) {
              return;
            }

            slides.push({
              slideId: section.sectionId,
              sectionId: section.sectionId,
              sectionName: section.sectionName,
              originalContent: section.originalContent,
              tailoredContent: section.tailoredContent,
            });
          }
        });

        if (slides.length === 0) {
          toast({
            title: 'No Changes Suggested',
            description: 'AI did not suggest any content changes for the selected sections.',
            variant: 'default',
          });
        } else {
          setTailoredSlides(slides);
          setViewMode('diff');
        }
      } else {
        console.error('Tailoring failed:', result.detail);
        toast({
          title: 'Tailoring Failed',
          description:
            result.detail || 'Failed to tailor your resume. Please check the inputs and try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Tailoring error:', err);
      toast({
        title: 'Network Error',
        description: 'A network error occurred. Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="px-2">
            <h3 className="text-lg font-bold whitespace-nowrap">Job Description</h3>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="tailor-jd-upload"
              className={cn(
                'inline-flex items-center gap-2 px-5 h-10 bg-background border border-border/50 rounded-full text-[11px] font-bold text-muted-foreground transition-all cursor-pointer uppercase tracking-wider hover:text-foreground hover:border-primary/30 whitespace-nowrap',
                (isExtractingJd || isTailoring) &&
                  'opacity-50 cursor-not-allowed pointer-events-none',
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
                className="h-10 rounded-full text-[10px] font-bold text-muted-foreground hover:text-destructive gap-1.5 px-3 transition-colors whitespace-nowrap"
              >
                <X className="w-3 h-3" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {jdFile && !isExtractingJd && (
          <div className="px-2 flex justify-start">
            <div className="bg-primary/10 border border-primary/20 text-primary px-4 h-9 rounded-full flex items-center text-[10px] font-bold uppercase tracking-wider max-w-full min-w-0 animate-in fade-in zoom-in-95 duration-200">
              <span className="truncate">File: {jdFile.name}</span>
            </div>
          </div>
        )}

        <div className="relative">
          <RichTextEditor
            placeholder={
              isExtractingJd
                ? 'Extracting text from file...'
                : 'Paste the job description here or upload a file above...'
            }
            className={cn('min-h-[260px]', isExtractingJd && 'opacity-50 cursor-not-allowed')}
            value={jobDescription}
            onChange={setJobDescription}
            disabled={isExtractingJd || isTailoring}
          />
          {isExtractingJd && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" />
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
            <AnimatedIcon icon={Sparkles} preset="portal" className="w-6 h-6" />
            Tailor Resume Now
          </Button>
        </motion.div>
      </div>

      {/* Loading Modal for Tailoring or JD Extraction */}
      <AILoadingModal
        isOpen={isTailoring || isExtractingJd}
        onCancel={handleCancel}
        message={
          isExtractingJd
            ? 'Extracting job description content with AI...'
            : 'Tailoring your resume sections for the job description...'
        }
        title={isExtractingJd ? 'JD Extractor' : 'AI Tailor'}
      />
    </div>
  );
};
