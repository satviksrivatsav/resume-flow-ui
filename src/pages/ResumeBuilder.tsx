import { useState, useEffect, useRef, useCallback } from "react";
import { PersonalInfoForm } from "@/components/resume/PersonalInfoForm";
import { WorkExperienceForm } from "@/components/resume/WorkExperienceForm";
import { EducationForm } from "@/components/resume/EducationForm";
import { ProjectsForm } from "@/components/resume/ProjectsForm";
import { SkillsForm } from "@/components/resume/SkillsForm";
import { CustomSectionsForm } from "@/components/resume/CustomSectionForm";
import { ResumeSettings } from "@/components/resume/ResumeSettings";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { DownloadButton } from "@/components/resume/DownloadButton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Eye, Maximize2, Minimize2, MoveHorizontal, MoveVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AIInstructionModal } from "@/components/ui/AIInstructionModal";
import { AIReviewModal } from "@/components/ui/AIReviewModal";
import { useUiStore } from "@/stores/uiStore";
import { ResumeSidebar } from "@/components/resume/ResumeSidebar";
import Logo from "@/assets/ResumeFlowCut.svg";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type ViewMode = 'fit-width' | 'fit-height';

const ResumeBuilder = () => {
  const { activeTab, setActiveTab } = useUiStore();
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('fit-width');
  const [previewZoom, setPreviewZoom] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
        const containerHeight = rect.height - (isFullscreen ? 40 : 120);
        zoom = containerHeight / resumeHeight;
    } else {
        const containerWidth = rect.width - (isFullscreen ? 40 : 60);
        zoom = containerWidth / resumeWidth;
    }

    setPreviewZoom(Math.max(0.2, Math.min(zoom, isFullscreen ? 1.5 : 1.2)));
  }, [viewMode, isFullscreen]);

  useEffect(() => {
    if (showPreview) {
      const timer = setTimeout(calculateZoom, 400);
      return () => clearTimeout(timer);
    }
  }, [showPreview, activeTab, viewMode, isFullscreen, calculateZoom]);

  useEffect(() => {
    const handleResize = () => calculateZoom();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateZoom]);

  const getSectionTitle = (id: string) => {
    switch (id) {
      case "personal": return "Personal Information";
      case "work": return "Work Experience";
      case "education": return "Education";
      case "projects": return "Projects";
      case "skills": return "Skills";
      case "custom": return "Custom Sections";
      case "settings": return "Resume Settings";
      default: return "";
    }
  };

  const getSectionDescription = (id: string) => {
    switch (id) {
      case "personal": return "Provide your contact details and a professional summary.";
      case "work": return "Detail your professional background and accomplishments.";
      case "education": return "List your academic qualifications and achievements.";
      case "projects": return "Showcase your best projects and technical contributions.";
      case "skills": return "Categorize your professional and technical expertise.";
      case "custom": return "Add any other relevant sections to your resume.";
      case "settings": return "Customize your resume's layout, colors, and fonts.";
      default: return "";
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const previewContent = (
    <div className="flex-1 flex flex-col items-center justify-start pt-24 pb-12">
      <div 
        className="flex flex-col transition-all duration-500 ease-out"
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
              type: "spring", 
              stiffness: 260, 
              damping: 25,
              opacity: { duration: 0.2 }
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
              <div 
                className="absolute inset-[-100%] opacity-[0.03] dark:opacity-[0.05] animate-[gradient-flow_20s_ease_infinite] bg-[linear-gradient(90deg,transparent_0%,rgba(var(--primary-rgb),0.5)_25%,rgba(var(--primary-rgb),1)_50%,rgba(var(--primary-rgb),0.5)_75%,transparent_100%)] bg-[length:400%_100%]" 
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05),transparent_70%)]" />
              <div className="absolute inset-0 bg-grid-white/[0.02]" />
            </div>
            
            <div className="mx-auto px-6 py-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <SidebarTrigger />
                  <div className="flex items-center gap-3 group/logo cursor-pointer" onClick={() => navigate("/")}>
                    <img src={Logo} alt="Resume Flow" className="w-9 h-9 transition-transform duration-500 group-hover/logo:rotate-[360deg]" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 hidden sm:block tracking-tight">
                      Resume Flow
                    </h1>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowPreview(!showPreview)}
                    className={cn(
                        "gap-2 bg-background/40 transition-all border border-transparent h-10 px-4 rounded-full",
                        showPreview ? "text-primary border-primary/20 bg-primary/5" : "hover:bg-primary/10 hover:border-primary/20"
                    )}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline font-medium">{showPreview ? "Hide" : "Show"} Preview</span>
                  </Button>
                  <div className="w-[1px] h-6 bg-border mx-1" />
                  <DownloadButton />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-hidden relative">
            <div className="flex h-full w-full">
              {/* Form Column */}
              <div className={cn(
                "h-full overflow-y-auto transition-all duration-300 ease-in-out px-4 md:px-8 custom-scrollbar",
                showPreview ? "w-full lg:w-[55%] xl:w-[60%]" : "w-full"
              )}>
                <div className="max-w-3xl mx-auto space-y-6 pt-24 pb-20">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold tracking-tight">{getSectionTitle(activeTab)}</h2>
                      <p className="text-muted-foreground text-sm">{getSectionDescription(activeTab)}</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsContent value="personal"><PersonalInfoForm /></TabsContent>
                      <TabsContent value="work"><WorkExperienceForm /></TabsContent>
                      <TabsContent value="education"><EducationForm /></TabsContent>
                      <TabsContent value="projects"><ProjectsForm /></TabsContent>
                      <TabsContent value="skills"><SkillsForm /></TabsContent>
                      <TabsContent value="custom"><CustomSectionsForm /></TabsContent>
                      <TabsContent value="settings"><ResumeSettings /></TabsContent>
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
                  {/* Floating Toolbar */}
                  <div className="sticky top-24 z-30 flex justify-center w-full pointer-events-none mb-2">
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-1 bg-card/80 backdrop-blur-xl border p-1.5 rounded-full shadow-2xl pointer-events-auto mt-2"
                    >
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 rounded-full gap-2 text-xs font-medium px-3"
                            onClick={() => setViewMode(viewMode === 'fit-height' ? 'fit-width' : 'fit-height')}
                        >
                            {viewMode === 'fit-height' ? <MoveVertical className="w-3.5 h-3.5" /> : <MoveHorizontal className="w-3.5 h-3.5" />}
                            {viewMode === 'fit-height' ? 'Fit Height' : 'Fit Width'}
                        </Button>
                        
                        <div className="w-[1px] h-4 bg-border mx-1" />
                        
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full" 
                            onClick={toggleFullscreen}
                            title="Fullscreen"
                        >
                            <Maximize2 className="w-3.5 h-3.5" />
                        </Button>
                    </motion.div>
                  </div>

                  {previewContent}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Fullscreen Overlay */}
        <AnimatePresence>
            {isFullscreen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col"
                >
                    <div className="flex items-center justify-between p-4 border-b bg-card/50">
                        <div className="flex items-center gap-3">
                            <img src={Logo} alt="Logo" className="w-8 h-8" />
                            <span className="font-bold tracking-tight">Fullscreen Preview</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-full h-9"
                                onClick={() => setViewMode(viewMode === 'fit-height' ? 'fit-width' : 'fit-height')}
                            >
                                {viewMode === 'fit-height' ? 'Switch to Fit Width' : 'Switch to Fit Height'}
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="rounded-full h-9 w-9 bg-muted/50 hover:bg-muted"
                                onClick={toggleFullscreen}
                            >
                                <Minimize2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar p-8">
                        <div className="flex flex-col items-center justify-start">
                            <div 
                                className="shadow-2xl rounded-sm bg-white"
                                style={{ 
                                    width: '794px',
                                    height: '1123px',
                                    transform: `scale(${previewZoom * 1.5})`,
                                    transformOrigin: 'top center',
                                    marginBottom: `${1123 * previewZoom * 0.5}px`
                                }}
                            >
                                <ResumePreview />
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
