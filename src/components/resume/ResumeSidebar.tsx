import { useResumeStore } from "@/stores/resumeStore";
import { useUiStore } from "@/stores/uiStore";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  Layout,
  Settings,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Upload,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/ui/UserMenu";
import { motion, Variants } from "framer-motion";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { getSectionCompletionStatus } from "@/utils/mandatoryFieldValidator";

// Per-icon hover animation variants
const iconVariants: Record<string, Variants> = {
  personal: {
    hover: { y: -3, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { y: 0, scale: 0.9 },
  },
  work: {
    hover: { rotate: [-4, 4, -4, 0], transition: { duration: 0.4, ease: "easeInOut" } },
    tap: { scale: 0.9 },
  },
  education: {
    hover: { rotate: 12, transition: { type: "spring", stiffness: 300, damping: 8 } },
    tap: { rotate: 0, scale: 0.9 },
  },
  projects: {
    hover: { scale: 1.25, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.9 },
  },
  skills: {
    hover: { rotate: 30, transition: { type: "spring", stiffness: 300, damping: 8 } },
    tap: { rotate: 0, scale: 0.9 },
  },
  additional: {
    hover: { scaleX: 1.2, transition: { type: "spring", stiffness: 300, damping: 10 } },
    tap: { scaleX: 1, scale: 0.9 },
  },
  settings: {
    hover: { rotate: 90, transition: { duration: 0.35, ease: "easeInOut" } },
    tap: { rotate: 0, scale: 0.9 },
  },
};

const staticSections = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "work", label: "Work Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", icon: Wrench },
];

export const ResumeSidebar = () => {
  const { activeTab, setActiveTab } = useUiStore();
  const { resumeData, addAdditionalSection } = useResumeStore();
  const navigate = useNavigate();

  const handleAddAdditional = () => {
    addAdditionalSection();
    // Fetch the latest state to ensure we get the newly added section
    setTimeout(() => {
      const latestData = useResumeStore.getState().resumeData;
      const lastSection = latestData.additionalSections[latestData.additionalSections.length - 1];
      if (lastSection) {
        setActiveTab(lastSection.id);
      }
    }, 0);
  };

  const renderMenuItem = (sectionId: string, label: string, Icon: any, variants: Variants, showCompletion: boolean = true) => {
    const isCompleted = showCompletion ? getSectionCompletionStatus(sectionId, resumeData) : false;
    const isActive = activeTab === sectionId;

    return (
      <motion.div key={sectionId} whileHover="hover" whileTap="tap">
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={isActive}
            onClick={() => setActiveTab(sectionId)}
            tooltip={label}
            className={cn(
              "transition-all duration-200 h-10 px-4",
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "hover:bg-accent text-muted-foreground hover:text-foreground"
            )}
          >
            <motion.span
              variants={variants}
              initial={false}
              className="mr-2 inline-flex items-center justify-center"
              style={{ display: "inline-flex" }}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors duration-200",
                  isActive ? "text-primary" : ""
                )}
              />
            </motion.span>
            <span className="truncate">{label}</span>
            {showCompletion && (
              isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-green-500 fill-green-500/10 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 ml-auto text-muted-foreground/20 shrink-0" />
              )
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </motion.div>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-card/50 backdrop-blur-sm">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 border-b">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
          <motion.div whileHover="hover" whileTap="tap" className="flex-1 group-data-[collapsible=icon]:flex-none">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="w-full justify-center gap-2 h-10 px-2 hover:bg-primary/10 transition-colors group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
              title="Back to Home"
            >
              <AnimatedIcon icon={ArrowLeft} preset="slideLeft" className="w-4 h-4" />
              <span className="font-medium group-data-[collapsible=icon]:hidden whitespace-nowrap">Home</span>
            </Button>
          </motion.div>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
            Build Progress
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {staticSections.map((section) =>
                renderMenuItem(section.id, section.label, section.icon, iconVariants[section.id] || {})
              )}

              {/* Dynamic Additional Sections */}
              {resumeData.additionalSections.map((section) =>
                renderMenuItem(section.id, section.title || "Untitled Section", Layout, iconVariants.additional)
              )}

              {/* Add Additional Section Button */}
              <motion.div whileHover="hover" whileTap="tap">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleAddAdditional}
                    className="transition-all duration-200 h-10 px-4 text-primary hover:bg-primary/5 hover:text-primary"
                    tooltip="Add Section"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Add section</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <div className="my-2 border-t border-border/50" />

              {renderMenuItem("settings", "Resume Settings", Settings, iconVariants.settings, false)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 pb-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pb-2">
          <motion.div whileHover="hover" whileTap="tap">
            <Button
              variant="outline"
              onClick={() => navigate("/upload")}
              className="w-full justify-center gap-2 h-10 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
            >
              <AnimatedIcon icon={Upload} preset="bounceUp" className="w-4 h-4" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Upload Resume</span>
            </Button>
          </motion.div>
          <p className="group-data-[collapsible=icon]:hidden mt-2 text-[10px] text-muted-foreground/60 leading-relaxed text-center px-1">
            Upload an existing resume and we'll auto-fill your details.
          </p>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 border-t">
        <div className="flex items-center justify-center w-full">
          <UserMenu />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
