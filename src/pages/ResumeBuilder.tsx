import { AnimatePresence, motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Maximize2,
  MoveHorizontal,
  MoveVertical,
  RotateCcw,
  Save,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Logo from '@/assets/logo.png';
import { AwardsForm } from '@/components/resume/AwardsForm';
import { CertificationsForm } from '@/components/resume/CertificationsForm';
import { CustomSectionForm } from '@/components/resume/CustomSectionForm';
import { EducationForm } from '@/components/resume/EducationForm';
import { ExportMenu } from '@/components/resume/ExportMenu';
import { InterestsForm } from '@/components/resume/InterestsForm';
import { LanguagesForm } from '@/components/resume/LanguagesForm';
import { PersonalInfoForm } from '@/components/resume/PersonalInfoForm';
import { ProfilesForm } from '@/components/resume/ProfilesForm';
import { ProjectsForm } from '@/components/resume/ProjectsForm';
import { PublicationsForm } from '@/components/resume/PublicationsForm';
import { ReferencesForm } from '@/components/resume/ReferencesForm';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { ResumeSettings } from '@/components/resume/ResumeSettings';
import { ResumeSidebar } from '@/components/resume/ResumeSidebar';
import { SaveStatus } from '@/components/resume/SaveStatus';
import { SkillsForm } from '@/components/resume/SkillsForm';
import { TailorDiffView } from '@/components/resume/TailorDiffView';
import { TailorForm } from '@/components/resume/TailorForm';
import { VolunteerForm } from '@/components/resume/VolunteerForm';
import { WorkExperienceForm } from '@/components/resume/WorkExperienceForm';
import { AIInstructionModal } from '@/components/ui/AIInstructionModal';
import { AIReviewModal } from '@/components/ui/AIReviewModal';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { useAutoSave } from '@/hooks/useAutoSave';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';
import { useTailorStore } from '@/stores/tailorStore';
import { useUiStore } from '@/stores/uiStore';

type ViewMode = 'fit-width' | 'fit-height';

const ResumeBuilder = () => {
  const { activeTab, setActiveTab } = useUiStore();
  const { viewMode: tailorViewMode } = useTailorStore();
  const { resumeData, deleteCustomSection, isSaving, loadResume, setResumeData } = useResumeStore();
  const { saveNow } = useAutoSave();
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('fit-width');
  const [previewZoom, setPreviewZoom] = useState(0.5);
  const [fullscreenZoom, setFullscreenZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const resumeId = searchParams.get('id');
    if (resumeId) {
      loadResume(resumeId).catch(() => {
        navigate('/dashboard');
      });
    } else {
      // Load from session storage for anonymous users on refresh
      const saved = sessionStorage.getItem('rf-anonymous-resume');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setResumeData(parsed);
        } catch (e) {
          console.error('Failed to parse saved resume', e);
        }
      }
    }
  }, [searchParams, loadResume, setResumeData, navigate]);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setShowPreview(true);
    }
  }, []);

  const calculateZoom = useCallback(() => {
    if (!previewPanelRef.current) return;

    const container = previewPanelRef.current;
    const rect = container.getBoundingClientRect();

    // A4 dimensions in pixels
    const resumeWidth = 794;
    const resumeHeight = 1123;

    let zoom = 1;

    if (viewMode === 'fit-height') {
      const containerHeight = rect.height - 200;
      zoom = containerHeight / resumeHeight;
    } else {
      const containerWidth = rect.width - 60;
      zoom = containerWidth / resumeWidth;
    }

    setPreviewZoom(Math.max(0.15, Math.min(zoom, 1.2)));
  }, [viewMode]);

  useEffect(() => {
    if (showPreview) {
      calculateZoom();
    }
  }, [showPreview, activeTab, viewMode, calculateZoom]);

  useEffect(() => {
    if (!previewPanelRef.current || !showPreview) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateZoom();
    });

    resizeObserver.observe(previewPanelRef.current);

    return () => resizeObserver.disconnect();
  }, [calculateZoom, showPreview]);

  useEffect(() => {
    const handleResize = () => calculateZoom();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateZoom]);

  const getSectionTitle = (id: string) => {
    switch (id) {
      case 'personal':
        return 'Personal Information';
      case 'work':
        return 'Work Experience';
      case 'education':
        return 'Education';
      case 'projects':
        return 'Projects';
      case 'skills':
        return 'Skills';
      case 'profiles':
        return 'Profiles';
      case 'languages':
        return 'Languages';
      case 'interests':
        return 'Interests';
      case 'awards':
        return 'Awards';
      case 'certifications':
        return 'Certifications';
      case 'publications':
        return 'Publications';
      case 'volunteer':
        return 'Volunteer';
      case 'references':
        return 'References';
      case 'settings':
        return 'Resume Settings';
      case 'tailor':
        return 'AI Resume Tailoring';
      default: {
        const section = resumeData.customSections.find((s) => s.id === id);
        return section ? section.name : 'Section';
      }
    }
  };

  const getSectionDescription = (id: string) => {
    switch (id) {
      case 'personal':
        return 'Provide your contact details and a professional summary.';
      case 'work':
        return 'Detail your professional background and accomplishments.';
      case 'education':
        return 'List your academic qualifications and achievements.';
      case 'projects':
        return 'Showcase your best projects and technical contributions.';
      case 'skills':
        return 'Categorize your professional and technical expertise.';
      case 'profiles':
        return 'Add links to your social and professional networks.';
      case 'languages':
        return 'List languages you know and your fluency levels.';
      case 'interests':
        return "Share your hobbies and what you're passionate about.";
      case 'awards':
        return "Highlight honors and recognitions you've received.";
      case 'certifications':
        return 'List certifications and licenses you hold.';
      case 'publications':
        return 'Showcase your articles, books, or papers.';
      case 'volunteer':
        return 'Detail your community service and volunteer work.';
      case 'references':
        return 'List people who can vouch for your professional work.';
      case 'settings':
        return "Customize your resume's layout, colors, and fonts.";
      case 'tailor':
        return 'Align your resume content perfectly with your target job description using our AI-powered assistant.';
      default:
        return 'Manage your custom resume section content.';
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const previewContent = (
    <div className="flex-1 flex flex-col items-center justify-start pt-24 pb-12">
      <div
        className="flex flex-col transition-all duration-200 ease-out"
        style={{
          width: `${794 * previewZoom}px`,
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-4 shrink-0 px-1">
          <div className="flex items-center gap-2 text-muted-foreground/60 uppercase tracking-widest text-[10px] font-bold select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            Live Preview
          </div>
          <div className="text-[10px] font-mono text-muted-foreground/40 bg-muted/50 px-2 py-0.5 rounded-full">
            {Math.round(previewZoom * 100)}%
          </div>
        </div>

        <div
          className="flex items-center justify-center relative"
          style={{
            width: '100%',
            height: `${1123 * previewZoom}px`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: previewZoom }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 25,
              opacity: { duration: 0.2 },
            }}
            className="shadow-2xl rounded-sm origin-top"
            style={{
              width: '794px',
              height: '1123px',
              position: 'absolute',
              top: 0,
            }}
          >
            <ResumePreview />
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden font-sans">
        <ResumeSidebar />

        <div className="flex flex-col flex-1 overflow-hidden relative">
          <header className="absolute top-0 left-0 right-0 z-40 border-b bg-card/40 backdrop-blur-md overflow-hidden group">
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              <div className="absolute inset-[-100%] opacity-[0.03] dark:opacity-[0.05] animate-[gradient-flow_20s_ease_infinite] bg-[linear-gradient(90deg,transparent_0%,rgba(var(--primary-rgb),0.5)_25%,rgba(var(--primary-rgb),1)_50%,rgba(var(--primary-rgb),0.5)_75%,transparent_100%)] bg-[length:400%_100%]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05),transparent_70%)]" />
              <div className="absolute inset-0 bg-grid-white/[0.02]" />
            </div>

            <div className="mx-auto px-6 py-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <SidebarTrigger />
                  <div
                    className="flex items-center gap-3 group/logo cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                  >
                    <img
                      src={Logo}
                      alt="Resume Flow"
                      className="w-8 h-8 object-contain transition-transform duration-500 group-hover/logo:scale-110 brightness-0 dark:invert"
                    />
                    <h1 className="text-xl font-bold text-foreground hidden sm:block tracking-tight">
                      Resume Flow
                    </h1>
                  </div>
                  <div className="hidden md:block">
                    <SaveStatus />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.div whileHover="hover" whileTap="tap">
                    <Button
                      variant="ghost"
                      onClick={() => saveNow()}
                      disabled={isSaving}
                      className="gap-2 bg-background/40 transition-all border border-transparent h-10 px-4 rounded-full hover:bg-primary/10 hover:border-primary/20"
                    >
                      <AnimatedIcon
                        icon={Save}
                        className={cn('w-4 h-4', isSaving && 'animate-spin')}
                      />
                      <span className="hidden sm:inline font-medium">
                        {isSaving ? 'Saving...' : 'Save'}
                      </span>
                    </Button>
                  </motion.div>
                  <div className="w-[1px] h-6 bg-border mx-1" />
                  <motion.div whileHover="hover" whileTap="tap">
                    <Button
                      variant="ghost"
                      onClick={() => setShowPreview(!showPreview)}
                      className={cn(
                        'gap-2 bg-background/40 transition-all border border-transparent h-10 px-4 rounded-full',
                        showPreview
                          ? 'text-primary border-primary/20 bg-primary/5'
                          : 'hover:bg-primary/10 hover:border-primary/20',
                      )}
                    >
                      <div className="relative w-4 h-4 flex items-center justify-center">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.div
                            key={showPreview ? 'closed' : 'open'}
                            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                            transition={{
                              duration: 0.2,
                              type: 'spring',
                              stiffness: 300,
                              damping: 20,
                            }}
                            className="absolute inset-0"
                          >
                            {showPreview ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <span className="hidden sm:inline font-medium">
                        {showPreview ? 'Hide' : 'Show'} Preview
                      </span>
                    </Button>
                  </motion.div>
                  <div className="w-[1px] h-6 bg-border mx-1" />
                  <ExportMenu />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-hidden relative">
            <div className="flex h-full w-full">
              {/* Form Column */}
              <div
                className={cn(
                  'h-full overflow-y-auto transition-all duration-300 ease-in-out px-4 md:px-8 custom-scrollbar',
                  showPreview ? 'w-full lg:w-[55%] xl:w-[60%]' : 'w-full',
                )}
              >
                <div className="max-w-3xl mx-auto space-y-6 pt-24 pb-20">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">
                          {getSectionTitle(activeTab)}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          {getSectionDescription(activeTab)}
                        </p>
                      </div>

                      {resumeData.customSections.some((s) => s.id === activeTab) && (
                        <motion.div whileHover="hover" whileTap="tap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              deleteCustomSection(activeTab);
                              setActiveTab('personal');
                            }}
                            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 gap-2 shrink-0 h-10 px-4"
                          >
                            <TrashAnimatedIcon className="w-4 h-4" />
                            Delete Section
                          </Button>
                        </motion.div>
                      )}
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsContent value="personal">
                        <PersonalInfoForm />
                      </TabsContent>
                      <TabsContent value="work">
                        <WorkExperienceForm />
                      </TabsContent>
                      <TabsContent value="education">
                        <EducationForm />
                      </TabsContent>
                      <TabsContent value="projects">
                        <ProjectsForm />
                      </TabsContent>
                      <TabsContent value="skills">
                        <SkillsForm />
                      </TabsContent>
                      <TabsContent value="profiles">
                        <ProfilesForm />
                      </TabsContent>
                      <TabsContent value="languages">
                        <LanguagesForm />
                      </TabsContent>
                      <TabsContent value="interests">
                        <InterestsForm />
                      </TabsContent>
                      <TabsContent value="awards">
                        <AwardsForm />
                      </TabsContent>
                      <TabsContent value="certifications">
                        <CertificationsForm />
                      </TabsContent>
                      <TabsContent value="publications">
                        <PublicationsForm />
                      </TabsContent>
                      <TabsContent value="volunteer">
                        <VolunteerForm />
                      </TabsContent>
                      <TabsContent value="references">
                        <ReferencesForm />
                      </TabsContent>
                      <TabsContent value="settings">
                        <ResumeSettings />
                      </TabsContent>

                      <TabsContent value="tailor">
                        {tailorViewMode === 'form' ? <TailorForm /> : <TailorDiffView />}
                      </TabsContent>

                      {/* Dynamic Custom Sections Content */}
                      {resumeData.customSections.map((section) => (
                        <TabsContent key={section.id} value={section.id}>
                          <CustomSectionForm />
                        </TabsContent>
                      ))}
                    </Tabs>
                  </motion.div>
                </div>
              </div>

              {/* Preview Column */}
              {showPreview && (
                <div
                  ref={previewPanelRef}
                  className="hidden lg:flex flex-col flex-1 h-full bg-muted/30 border-l overflow-y-auto custom-scrollbar relative group/preview"
                >
                  <div className="sticky top-24 z-30 flex justify-center w-full pointer-events-none mb-2">
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex items-center gap-1 bg-card/80 backdrop-blur-xl border p-1.5 rounded-full shadow-2xl pointer-events-auto mt-2"
                    >
                      <motion.div whileHover="hover" whileTap="tap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-full gap-2 text-xs font-medium px-3"
                          onClick={() =>
                            setViewMode(viewMode === 'fit-height' ? 'fit-width' : 'fit-height')
                          }
                        >
                          {viewMode === 'fit-height' ? (
                            <AnimatedIcon
                              icon={MoveVertical}
                              preset="slideV"
                              className="w-3.5 h-3.5"
                            />
                          ) : (
                            <AnimatedIcon
                              icon={MoveHorizontal}
                              preset="slideH"
                              className="w-3.5 h-3.5"
                            />
                          )}
                          {viewMode === 'fit-height' ? 'Fit Height' : 'Fit Width'}
                        </Button>
                      </motion.div>

                      <div className="w-[1px] h-4 bg-border mx-1" />

                      <motion.div whileHover="hover" whileTap="tap">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={toggleFullscreen}
                        >
                          <AnimatedIcon icon={Maximize2} preset="scaleUp" className="w-3.5 h-3.5" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>

                  {previewContent}
                </div>
              )}
            </div>
          </main>
        </div>

        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-zinc-950/40 backdrop-blur-xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-md z-10">
                <div className="flex items-center gap-3 w-1/4">
                  <img src={Logo} alt="Logo" className="w-8 h-8 object-contain" />
                  <span className="font-bold tracking-tight hidden sm:block text-white">
                    Fullscreen Preview
                  </span>
                </div>

                <div className="flex-1 flex justify-center">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {resumeData.basics.name || 'Untitled Resume'}
                  </h2>
                </div>

                <div className="flex items-center justify-end gap-3 w-1/4">
                  <motion.div whileHover="hover" whileTap="tap">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full px-5 h-10 gap-2 bg-white text-black hover:bg-white/90 shadow-lg"
                      onClick={toggleFullscreen}
                    >
                      <AnimatedIcon icon={X} preset="crossSpin" className="w-4 h-4" />
                      <span className="font-semibold">Close Preview</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
              <div className="flex-1 relative flex overflow-hidden">
                <div className="flex-1 overflow-auto custom-scrollbar bg-black/10">
                  <div className="min-h-full flex flex-col items-center py-24">
                    <div className="my-auto">
                      <div
                        className="shadow-2xl rounded-sm bg-white shrink-0"
                        style={{
                          width: '794px',
                          height: '1123px',
                          transform: `scale(${fullscreenZoom})`,
                          transformOrigin: 'top center',
                        }}
                      >
                        <ResumePreview />
                      </div>
                      <div style={{ height: `${1123 * (fullscreenZoom - 1)}px` }} />
                    </div>
                  </div>
                </div>

                <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center py-5 px-2.5 gap-4 bg-zinc-900/80 backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-full">
                  <motion.div whileHover="hover" whileTap="tap">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-white/10 transition-all"
                      onClick={() => setFullscreenZoom((prev) => Math.min(prev + 0.1, 1.5))}
                    >
                      <AnimatedIcon icon={ZoomIn} preset="scaleUp" className="w-5 h-5 text-white" />
                    </Button>
                  </motion.div>

                  <div className="h-32 py-2 flex items-center justify-center">
                    <Slider
                      orientation="vertical"
                      min={0.5}
                      max={1.5}
                      step={0.01}
                      value={[fullscreenZoom]}
                      onValueChange={(val) =>
                        setFullscreenZoom(Math.max(0.5, Math.min(val[0], 1.5)))
                      }
                      className="h-full"
                      trackClassName="bg-white/20 w-1.5"
                      rangeClassName="bg-white"
                      thumbClassName="bg-white border-white h-4 w-4"
                    />
                  </div>

                  <motion.div whileHover="hover" whileTap="tap">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-white/10 transition-all"
                      onClick={() => setFullscreenZoom((prev) => Math.max(prev - 0.1, 0.5))}
                    >
                      <AnimatedIcon
                        icon={ZoomOut}
                        preset="scaleDown"
                        className="w-5 h-5 text-white"
                      />
                    </Button>
                  </motion.div>

                  <div className="w-8 h-[1px] bg-white/10 mx-auto" />

                  <motion.div whileHover="hover" whileTap="tap">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-white/10 transition-all"
                      onClick={() => setFullscreenZoom(1.0)}
                    >
                      <AnimatedIcon
                        icon={RotateCcw}
                        preset="spinCCW"
                        className="w-5 h-5 text-white/80"
                      />
                    </Button>
                  </motion.div>

                  <div className="text-[11px] font-bold text-white tabular-nums px-1">
                    {Math.round(fullscreenZoom * 100)}%
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AIInstructionModal />
        <AIReviewModal />
      </div>
    </SidebarProvider>
  );
};

export default ResumeBuilder;
