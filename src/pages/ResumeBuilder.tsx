import { useState, useEffect, useRef } from "react";
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
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
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

const ResumeBuilder = () => {
  const { activeTab, setActiveTab } = useUiStore();
  const [showPreview, setShowPreview] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(0.5);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setShowPreview(true);
    }
  }, []);

  // Calculate zoom to fit entire resume in preview panel
  const calculateZoom = () => {
    if (!previewPanelRef.current) return;

    const container = previewPanelRef.current;
    const containerWidth = container.clientWidth - 48; // Standard side padding (p-6 = 24px * 2)
    // Account for header/label stuff (~30px) and bottom padding (24px)
    const containerHeight = container.clientHeight - 54; 

    // A4 dimensions in pixels
    const resumeWidth = 794;
    const resumeHeight = 1123;

    // Calculate zoom to fit both width and height
    const zoomToFitWidth = containerWidth / resumeWidth;
    const zoomToFitHeight = containerHeight / resumeHeight;

    const zoom = Math.min(zoomToFitWidth, zoomToFitHeight, 1);
    setPreviewZoom(Math.max(0.3, zoom));
  };

  useEffect(() => {
    if (showPreview) {
      // Wait for transition
      const timer = setTimeout(calculateZoom, 310);
      return () => clearTimeout(timer);
    }
  }, [showPreview, activeTab]);

  const handleResize = () => {
    requestAnimationFrame(calculateZoom);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5">
        <ResumeSidebar />
        
        <div className="flex flex-col flex-1 overflow-hidden relative">
          <header className="border-b bg-card/40 backdrop-blur-md sticky top-0 z-50 overflow-hidden group">
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              <div 
                className="absolute inset-[-100%] opacity-[0.03] dark:opacity-[0.05] animate-[gradient-flow_20s_ease_infinite] bg-[linear-gradient(90deg,transparent_0%,rgba(var(--primary-rgb),0.5)_25%,rgba(var(--primary-rgb),1)_50%,rgba(var(--primary-rgb),0.5)_75%,transparent_100%)] bg-[length:400%_100%]" 
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05),transparent_70%)]" />
              <div className="absolute inset-0 bg-grid-white/[0.02]" />
            </div>
            
            <div className="mx-auto px-6 py-3 relative">
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
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="gap-2 bg-background/40 hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
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
              <div className={cn(
                "h-full overflow-y-auto transition-all duration-300 ease-in-out p-4 md:p-8 custom-scrollbar",
                showPreview ? "w-full lg:w-[55%] xl:w-[60%]" : "w-full"
              )}>
                <div className="max-w-3xl mx-auto space-y-6 pt-2 md:pt-4 pb-4 md:pb-8">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold tracking-tight">{getSectionTitle(activeTab)}</h2>
                      <p className="text-muted-foreground">{getSectionDescription(activeTab)}</p>
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

              {showPreview && (
                <div 
                  ref={previewPanelRef}
                  className="hidden lg:flex flex-col flex-1 h-full bg-muted/30 border-l p-4 xl:p-6 xl:pt-0 xl:pb-6 overflow-hidden relative group/preview"
                >
                  <div className="flex-1 flex flex-col items-center justify-end">
                    <div 
                      className="flex flex-col transition-all duration-500 ease-out"
                      style={{
                        width: `${794 * previewZoom}px`,
                      }}
                    >
                      <div className="flex items-center justify-start gap-2 mb-6 -mt-4 text-muted-foreground/60 uppercase tracking-widest text-[10px] font-bold select-none shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                        Live Preview
                      </div>
                      
                      <div 
                        className="flex items-center justify-center"
                        style={{
                          width: '100%',
                          height: `${1123 * previewZoom}px`,
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: previewZoom }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 20,
                            opacity: { duration: 0.2 }
                          }}
                          className="shadow-2xl rounded-sm origin-center"
                          style={{ 
                            width: '794px',
                            height: '1123px',
                            flexShrink: 0,
                          }}
                        >
                          <ResumePreview />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        <AIInstructionModal />
        <AIReviewModal />
      </div>
    </SidebarProvider>
  );
};

export default ResumeBuilder;