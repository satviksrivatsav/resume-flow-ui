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
               resumeData.workExperience.every(exp => exp.position && exp.company);
      
      case "education":
        return resumeData.education.length > 0 && 
               resumeData.education.every(edu => edu.school && edu.degree);
      
      case "projects":
        return resumeData.projects.length > 0 && 
               resumeData.projects.every(proj => proj.name);
      
      case "skills":
        return resumeData.skills.length > 0 && 
               resumeData.skills.every(skill => skill.category && skill.items);
      
      case "custom":
        return resumeData.customSections.length > 0 && 
               resumeData.customSections.every(section => section.title);
      
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex-1 justify-start gap-2 h-9 px-2 hover:bg-primary/10 transition-colors group/back group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover/back:-translate-x-1" />
            <span className="font-medium group-data-[collapsible=icon]:hidden whitespace-nowrap">Dashboard</span>
          </Button>
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

                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setActiveTab(section.id)}
                      tooltip={section.label}
                      className={cn(
                        "transition-all duration-200 h-10 px-4",
                        isActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 mr-2", isActive ? "text-primary scale-110" : "")} />
                      <span>{section.label}</span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-green-500 fill-green-500/10" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 ml-auto text-muted-foreground/20" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col gap-3 group-data-[collapsible=icon]:items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/upload")}
            className="w-full justify-start gap-2 h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
          >
            <Upload className="w-4 h-4" />
            <span className="group-data-[collapsible=icon]:hidden">Upload Resume</span>
          </Button>
          
          <div className="flex items-center justify-center w-full">
            <UserMenu />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
