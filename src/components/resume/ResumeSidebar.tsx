import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  GripVertical,
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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { UserMenu } from '@/components/ui/UserMenu';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';
import { useUiStore } from '@/stores/uiStore';
import { DEFAULT_SECTION_ORDER } from '@/types/resume';
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

// Metadata for every static section
const SECTION_META: Record<string, { label: string; icon: React.ElementType }> = {
  summary: { label: 'Summary', icon: User },
  personal: { label: 'Personal Info', icon: User },
  work: { label: 'Work Experience', icon: Briefcase },
  education: { label: 'Education', icon: GraduationCap },
  projects: { label: 'Projects', icon: FolderGit2 },
  skills: { label: 'Skills', icon: Wrench },
  profiles: { label: 'Profiles', icon: User },
  languages: { label: 'Languages', icon: Languages },
  interests: { label: 'Interests', icon: Heart },
  awards: { label: 'Awards', icon: Trophy },
  certifications: { label: 'Certifications', icon: Award },
  publications: { label: 'Publications', icon: BookOpen },
  volunteer: { label: 'Volunteer', icon: HandHelping },
  references: { label: 'References', icon: Users },
};

// Sidebar navigation sections — personal is always pinned at the top separately
const STATIC_SIDEBAR_SECTIONS = [
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

// Map from sidebar id → resume section key (for completion check)
const SIDEBAR_TO_SECTION_KEY: Record<string, string> = {
  work: 'experience',
};

// ── Sortable row ──────────────────────────────────────────────────────────────

interface SortableMenuItemProps {
  id: string;
  label: string;
  Icon: React.ElementType;
  variants: Variants;
  isActive: boolean;
  isCompleted: boolean;
  showCompletion: boolean;
  onClick: () => void;
}

const SortableMenuItem = ({
  id,
  label,
  Icon,
  variants,
  isActive,
  isCompleted,
  showCompletion,
  onClick,
}: SortableMenuItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div whileHover="hover" whileTap="tap">
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={isActive}
            onClick={onClick}
            tooltip={label}
            className={cn(
              'transition-all duration-200 h-10 px-4 group/row',
              isActive
                ? 'bg-primary/10 text-primary font-semibold'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground',
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Left: section icon */}
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

            {/* Label */}
            <span className="truncate flex-1">{label}</span>

            {/* Right: grip on hover, completion status otherwise */}
            {showCompletion && (
              <span
                className="ml-auto shrink-0"
                // Stop click on the grip area from selecting the tab
                onClick={(e) => isHovered && e.stopPropagation()}
              >
                {isHovered ? (
                  <span
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing inline-flex items-center justify-center"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors" />
                  </span>
                ) : isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 fill-green-500/10" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-muted-foreground/20" />
                )}
              </span>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </motion.div>
    </div>
  );
};

// ── Main sidebar ──────────────────────────────────────────────────────────────

export const ResumeSidebar = () => {
  const { activeTab, setActiveTab } = useUiStore();
  const { resumeData, addCustomSection, reorderSections } = useResumeStore();
  const navigate = useNavigate();
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Build the ordered list of draggable section IDs (personal is always pinned — excluded here)
  const storedOrder: string[] = resumeData.metadata.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const staticIds = STATIC_SIDEBAR_SECTIONS.map((s) => s.id); // does NOT include 'personal'
  const orderedStaticIds = [
    ...storedOrder.filter((id) => staticIds.includes(id)),
    ...staticIds.filter((id) => !storedOrder.includes(id)),
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedStaticIds.indexOf(active.id as string);
    const newIndex = orderedStaticIds.indexOf(over.id as string);
    const newOrder = arrayMove(orderedStaticIds, oldIndex, newIndex);

    // Merge with custom section ids (they are appended, not reordered here)
    const customIds = resumeData.customSections.map((s) => s.id);
    reorderSections([...newOrder, ...customIds]);
  };

  const handleAddCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionTitle.trim()) {
      const newId = addCustomSection(newSectionTitle.trim());
      setActiveTab(newId);
      setIsAddSectionOpen(false);
      setNewSectionTitle('');
    }
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
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
            Build Progress
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Personal Info — always pinned at top, never draggable */}
              {(() => {
                const isActive = activeTab === 'personal';
                const isCompleted = getSectionCompletionStatus('personal', resumeData);
                return (
                  <motion.div whileHover="hover" whileTap="tap">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => setActiveTab('personal')}
                        tooltip="Personal Info"
                        className={cn(
                          'transition-all duration-200 h-10 px-4',
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'hover:bg-accent text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <motion.span
                          variants={iconVariants.personal}
                          initial={false}
                          className="mr-2 inline-flex items-center justify-center"
                          style={{ display: 'inline-flex' }}
                        >
                          <User
                            className={cn(
                              'w-4 h-4 transition-colors duration-200',
                              isActive ? 'text-primary' : '',
                            )}
                          />
                        </motion.span>
                        <span className="truncate flex-1">Personal Info</span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-green-500 fill-green-500/10 shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 ml-auto text-muted-foreground/20 shrink-0" />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })()}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              >
                <SortableContext items={orderedStaticIds} strategy={verticalListSortingStrategy}>
                  {orderedStaticIds.map((id) => {
                    const meta = STATIC_SIDEBAR_SECTIONS.find((s) => s.id === id);
                    if (!meta) return null;

                    const sectionKey = SIDEBAR_TO_SECTION_KEY[id] ?? id;
                    const isCompleted = getSectionCompletionStatus(sectionKey, resumeData);

                    return (
                      <SortableMenuItem
                        key={id}
                        id={id}
                        label={meta.label}
                        Icon={meta.icon}
                        variants={iconVariants[id] ?? {}}
                        isActive={activeTab === id}
                        isCompleted={isCompleted}
                        showCompletion={true}
                        onClick={() => setActiveTab(id)}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>

              {/* Custom Sections (not draggable for now, appended at bottom) */}
              {resumeData.customSections.map((section) => {
                const isActive = activeTab === section.id;
                return (
                  <motion.div key={section.id} whileHover="hover" whileTap="tap">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => setActiveTab(section.id)}
                        tooltip={section.name}
                        className={cn(
                          'transition-all duration-200 h-10 px-4',
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'hover:bg-accent text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <Plus
                          className={cn(
                            'w-4 h-4 mr-2 transition-colors duration-200',
                            isActive ? 'text-primary' : '',
                          )}
                        />
                        <span className="truncate">{section.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}

              {/* Add custom section button */}
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

              {/* Settings — fixed, not sortable */}
              {(() => {
                const isActive = activeTab === 'settings';
                return (
                  <motion.div whileHover="hover" whileTap="tap">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => setActiveTab('settings')}
                        tooltip="Resume Settings"
                        className={cn(
                          'transition-all duration-200 h-10 px-4',
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'hover:bg-accent text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <motion.span
                          variants={iconVariants.settings}
                          initial={false}
                          className="mr-2 inline-flex items-center justify-center"
                          style={{ display: 'inline-flex' }}
                        >
                          <Settings
                            className={cn(
                              'w-4 h-4 transition-colors duration-200',
                              isActive ? 'text-primary' : '',
                            )}
                          />
                        </motion.span>
                        <span className="truncate">Resume Settings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })()}
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
