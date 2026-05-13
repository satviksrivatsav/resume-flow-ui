import { motion, Variants } from 'framer-motion';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Circle,
  FolderGit2,
  GraduationCap,
  HandHelping,
  Heart,
  Languages,
  Plus,
  Settings,
  Sparkles,
  Trophy,
  Upload,
  User,
  Users,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { UserMenu } from '@/components/ui/UserMenu';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';
import { useUiStore } from '@/stores/uiStore';
import { getSectionCompletionStatus } from '@/utils/mandatoryFieldValidator';

// Per-icon hover animation variants
const iconVariants: Record<string, Variants> = {
  personal: {
    hover: { y: -3, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { y: 0, scale: 0.9 },
  },
  work: {
    hover: { rotate: [-4, 4, -4, 0], transition: { duration: 0.4, ease: 'easeInOut' } },
    tap: { scale: 0.9 },
  },
  education: {
    hover: { rotate: 12, transition: { type: 'spring', stiffness: 300, damping: 8 } },
    tap: { rotate: 0, scale: 0.9 },
  },
  projects: {
    hover: { scale: 1.25, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { scale: 0.9 },
  },
  skills: {
    hover: { rotate: 30, transition: { type: 'spring', stiffness: 300, damping: 8 } },
    tap: { rotate: 0, scale: 0.9 },
  },
  settings: {
    hover: { rotate: 90, transition: { duration: 0.35, ease: 'easeInOut' } },
    tap: { rotate: 0, scale: 0.9 },
  },
};

const staticSections = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'work', label: 'Work Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'interests', label: 'Interests', icon: Heart },
  { id: 'awards', label: 'Awards', icon: Trophy },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'publications', label: 'Publications', icon: BookOpen },
  { id: 'volunteer', label: 'Volunteer', icon: HandHelping },
  { id: 'references', label: 'References', icon: Users },
];

export const ResumeSidebar = () => {
  const { activeTab, setActiveTab } = useUiStore();
  const { resumeData, addCustomSection } = useResumeStore();
  const navigate = useNavigate();
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const handleAddCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionTitle.trim()) {
      const newId = addCustomSection(newSectionTitle.trim());
      setActiveTab(newId);
      setIsAddSectionOpen(false);
      setNewSectionTitle('');
    }
  };

  const renderMenuItem = (
    sectionId: string,
    label: string,
    Icon: any,
    variants: Variants,
    showCompletion = true,
  ) => {
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
              'transition-all duration-200 h-10 px-4',
              isActive
                ? 'bg-primary/10 text-primary font-semibold'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground',
            )}
          >
            <motion.span
              variants={variants}
              initial={false}
              className="mr-2 inline-flex items-center justify-center"
              style={{ display: 'inline-flex' }}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors duration-200',
                  isActive ? 'text-primary' : '',
                )}
              />
            </motion.span>
            <span className="truncate">{label}</span>
            {showCompletion &&
              (isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-green-500 fill-green-500/10 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 ml-auto text-muted-foreground/20 shrink-0" />
              ))}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </motion.div>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-card/50 backdrop-blur-sm">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 border-b">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
          <motion.div
            whileHover="hover"
            whileTap="tap"
            className="flex-1 group-data-[collapsible=icon]:flex-none"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="w-full justify-center gap-2 h-10 px-2 hover:bg-primary/10 transition-colors group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
              title="Back to Dashboard"
            >
              <AnimatedIcon icon={ArrowLeft} preset="slideLeft" className="w-4 h-4" />
              <span className="font-medium group-data-[collapsible=icon]:hidden whitespace-nowrap">
                Dashboard
              </span>
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
                renderMenuItem(
                  section.id,
                  section.label,
                  section.icon,
                  iconVariants[section.id] || {},
                ),
              )}

              {/* Custom Sections */}
              {resumeData.customSections.map((section) =>
                renderMenuItem(section.id, section.name, Plus, {}),
              )}

              <motion.div whileHover="hover" whileTap="tap">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsAddSectionOpen(true)}
                    className="transition-all duration-200 h-10 px-4 text-primary hover:bg-primary/5 hover:text-primary"
                    tooltip="Add Custom Section"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Add section</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <div className="my-2 border-t border-border/50" />

              {renderMenuItem(
                'settings',
                'Resume Settings',
                Settings,
                iconVariants.settings,
                false,
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 pb-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pb-2 space-y-2">
          <motion.div whileHover="hover" whileTap="tap">
            <Button
              variant="outline"
              onClick={() => setActiveTab('tailor')}
              className={cn(
                'w-full justify-center gap-2 h-10 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 transition-all duration-300',
                activeTab === 'tailor'
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'
                  : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10',
              )}
            >
              <AnimatedIcon icon={Sparkles} preset="pulse" className="w-4 h-4" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap font-semibold">
                Tailor Resume
              </span>
            </Button>
          </motion.div>

          <motion.div whileHover="hover" whileTap="tap">
            <Button
              variant="outline"
              onClick={() => navigate('/upload')}
              className="w-full justify-center gap-2 h-10 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
            >
              <AnimatedIcon icon={Upload} preset="bounceUp" className="w-4 h-4" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">
                Upload Resume
              </span>
            </Button>
          </motion.div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 border-t">
        <div className="flex items-center justify-center w-full">
          <UserMenu />
        </div>
      </SidebarFooter>

      <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle>Add Custom Section</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCustomSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="section-title">Section Title</Label>
                <Input
                  id="section-title"
                  placeholder="e.g. Volunteer Work, Projects..."
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddSectionOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newSectionTitle.trim()}>
                Add Section
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
};
