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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/ui/UserMenu";
import { motion } from "framer-motion";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";

// Per-icon hover animation variants
const iconVariants: Record<string, object> = {
  personal: {
    // User: subtle bounce up (like waving hello)
    hover: { y: -3, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap:   { y: 0, scale: 0.9 },
  },
  work: {
    // Briefcase: slight rock left-right (busy at work)
    hover: { rotate: [-4, 4, -4, 0], transition: { duration: 0.4, ease: "easeInOut" } },
    tap:   { scale: 0.9 },
  },
  education: {
    // GraduationCap: tilt side-to-side (thinking)
    hover: { rotate: 12, transition: { type: "spring", stiffness: 300, damping: 8 } },
    tap:   { rotate: 0, scale: 0.9 },
  },
  projects: {
    // FolderGit2: pop scale (opening a folder)
    hover: { scale: 1.25, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap:   { scale: 0.9 },
  },
  skills: {
    // Wrench: small clockwise rotation (tightening a bolt)
    hover: { rotate: 30, transition: { type: "spring", stiffness: 300, damping: 8 } },
    tap:   { rotate: 0, scale: 0.9 },
  },
  custom: {
    // Layout: expand slightly (building a layout)
    hover: { scaleX: 1.2, transition: { type: "spring", stiffness: 300, damping: 10 } },
    tap:   { scaleX: 1, scale: 0.9 },
  },
  settings: {
    // Settings: slow spin (gears turning)
    hover: { rotate: 90, transition: { duration: 0.35, ease: "easeInOut" } },
    tap:   { rotate: 0, scale: 0.9 },
  },
};

const sections = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "work", label: "Work Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "custom", label: "Custom Sections", icon: Layout },
  { id: "settings", label: "Settings", icon: Settings },
];

export const ResumeSidebar = () => {
  const { activeTab, setActiveTab } = useUiStore();
  const { resumeData } = useResumeStore();
  const navigate = useNavigate();

  const getCompletionStatus = (sectionId: string) => {
    switch (sectionId) {
      case "personal": {
        const { personalInfo } = resumeData;
        return !!(personalInfo.name && personalInfo.email && personalInfo.phone && personalInfo.location);
      }
      
      case "work":
        return resumeData.workExperience.length > 0 && 
               resumeData.workExperience.every(exp => 
                 exp.position && 
                 exp.company && 
                 exp.startDate && 
                 (exp.current || exp.endDate)
               );
      
      case "education":
        return resumeData.education.length > 0 && 
               resumeData.education.every(edu => 
                 edu.school && 
                 edu.degree && 
                 edu.startDate && 
                 edu.endDate
               );
      
      case "projects":
        return resumeData.projects.length > 0 && 
               resumeData.projects.every(proj => 
                 proj.name && 
                 proj.role && 
                 proj.description &&
                 proj.startDate && 
                 (proj.ongoing || proj.endDate) &&
                 (Array.isArray(proj.technologies) ? proj.technologies.length > 0 : proj.technologies)
               );
      
      case "skills":
        return resumeData.skills.length > 0 && 
               resumeData.skills.every(skill => skill.category && skill.items);
      
      case "custom":
        return resumeData.customSections.length > 0 && 
               resumeData.customSections.every(section => 
                 section.title && 
                 section.description && 
                 section.description !== '<p><br></p>'
               );
      
      case "settings":
        return true;
      
      default:
        return false;
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-card/50 backdrop-blur-sm">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
          <motion.div whileHover="hover" whileTap="tap" className="flex-1 group-data-[collapsible=icon]:flex-none">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="w-full justify-center gap-2 h-10 px-2 hover:bg-primary/10 transition-colors group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0"
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
              {sections.map((section) => {
                const Icon = section.icon;
                const isCompleted = getCompletionStatus(section.id);
                const isActive = activeTab === section.id;

                const variants = iconVariants[section.id] ?? {};

                return (
                  // motion.div owns whileHover/whileTap; framer-motion propagates
                  // the active variant name down to the child motion.span automatically.
                  <motion.div key={section.id} whileHover="hover" whileTap="tap">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => setActiveTab(section.id)}
                        tooltip={section.label}
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
                            style={
                              isActive
                                ? { color: "hsl(var(--primary))" }
                                : {}
                            }
                          />
                        </motion.span>
                        <span>{section.label}</span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-green-500 fill-green-500/10" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 ml-auto text-muted-foreground/20" />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 pb-4">
          <motion.div whileHover="hover" whileTap="tap">
            <Button
              variant="outline"
              onClick={() => navigate("/upload")}
              className="w-full justify-center gap-2 h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0"
            >
              <AnimatedIcon icon={Upload} preset="bounceUp" className="w-4 h-4" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Upload Resume</span>
            </Button>
          </motion.div>
          {/* Info label — hidden when sidebar is collapsed to icon-only mode */}
          <p className="group-data-[collapsible=icon]:hidden mt-2 text-[10px] text-muted-foreground/60 leading-relaxed text-center px-1">
            Upload an existing resume and we'll auto-fill your details.
          </p>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-center w-full">
          <UserMenu />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
