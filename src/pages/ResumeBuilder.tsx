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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, FileText, ArrowLeft, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AIInstructionModal } from "@/components/ui/AIInstructionModal";
import { AIReviewModal } from "@/components/ui/AIReviewModal";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useUiStore } from "@/stores/uiStore";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

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
    const containerWidth = container.clientWidth - 48; // subtract padding (p-6 = 24px * 2)
    const containerHeight = container.clientHeight - 48;

    // A4 dimensions in pixels (at 96 DPI: 210mm = 794px)
    const resumeWidth = 794;

    // Calculate zoom to fit width (full left-to-right always visible)
    const zoomToFitWidth = containerWidth / resumeWidth;

    // Cap zoom at 1.0 (don't zoom past 100%)
    const zoom = Math.min(zoomToFitWidth, 1);
    setPreviewZoom(Math.max(0.4, zoom)); // minimum 0.4 to keep readable
  };

  // Recalculate zoom when panel resizes
  const handlePanelResize = () => {
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(calculateZoom);
  };

  // Also recalculate on window resize
  useEffect(() => {
    const handleWindowResize = () => calculateZoom();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Initial calculation after mount
  useEffect(() => {
    if (showPreview) {
      // Small delay to ensure panel is rendered
      setTimeout(calculateZoom, 100);
    }
  }, [showPreview]);

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col overflow-hidden">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Resume Builder</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
              <DownloadButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {showPreview ? (
          <PanelGroup direction="horizontal" onLayout={handlePanelResize}>
            <Panel defaultSize={60} minSize={40}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full overflow-y-auto p-6"
              >
                <div className="max-w-4xl mx-auto">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-7">
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                      <TabsTrigger value="work">Work</TabsTrigger>
                      <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="projects">Projects</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                      <TabsTrigger value="custom">Custom</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal"><PersonalInfoForm /></TabsContent>
                    <TabsContent value="work"><WorkExperienceForm /></TabsContent>
                    <TabsContent value="education"><EducationForm /></TabsContent>
                    <TabsContent value="projects"><ProjectsForm /></TabsContent>
                    <TabsContent value="skills"><SkillsForm /></TabsContent>
                    <TabsContent value="custom"><CustomSectionsForm /></TabsContent>
                    <TabsContent value="settings"><ResumeSettings /></TabsContent>
                  </Tabs>
                </div>
              </motion.div>
            </Panel>

            <PanelResizeHandle className="w-2 bg-border hover:bg-primary/20 transition-colors flex items-center justify-center group">
              <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </PanelResizeHandle>

            <Panel defaultSize={40} minSize={25} maxSize={60}>
              <motion.div
                ref={previewPanelRef}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full overflow-y-auto overflow-x-hidden bg-muted/30 p-6"
              >
                <div
                  className="origin-top mx-auto w-fit"
                  style={{ zoom: previewZoom }}
                >
                  <ResumePreview />
                </div>
              </motion.div>
            </Panel>
          </PanelGroup>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-4xl mx-auto pb-8"
              >
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="work">Work</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

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
        )}
      </div>

      {/* Global AI Writer Modals */}
      <AIInstructionModal />
      <AIReviewModal />
    </div>
  );
};

export default ResumeBuilder;