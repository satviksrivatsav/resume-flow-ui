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
  User,
  Users,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NavItemWrapper } from '@/shared/components/layout/SidebarUtils';
import { AnimatedIcon, type AnimatedIconPreset } from '@/shared/components/ui/AnimatedIcon';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
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
  useSidebar,
} from '@/shared/components/ui/sidebar';
import { UserMenu } from '@/shared/components/ui/UserMenu';
import { cn } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { useUiStore } from '@/shared/stores/uiStore';
import { DEFAULT_SECTION_ORDER } from '@/shared/types/resume';
import { getSectionCompletionStatus } from '@/shared/utils/mandatoryFieldValidator';

import { UnsavedChangesModal } from './UnsavedChangesModal';

// Metadata for every static section

// Sidebar navigation sections — personal is always pinned at the top separately
const STATIC_SIDEBAR_SECTIONS: {
  id: string;
  label: string;
  icon: any;
  preset: AnimatedIconPreset;
}[] = [
  { id: 'experience', label: 'Work Experience', icon: Briefcase, preset: 'scaleUp' },
  { id: 'education', label: 'Education', icon: GraduationCap, preset: 'scaleUp' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, preset: 'scaleUp' },
  { id: 'skills', label: 'Skills', icon: Wrench, preset: 'scaleUp' },
  { id: 'languages', label: 'Languages', icon: Languages, preset: 'scaleUp' },
  { id: 'interests', label: 'Interests', icon: Heart, preset: 'scaleUp' },
  { id: 'awards', label: 'Awards', icon: Trophy, preset: 'scaleUp' },
  { id: 'certifications', label: 'Certifications', icon: Award, preset: 'scaleUp' },
  { id: 'publications', label: 'Publications', icon: BookOpen, preset: 'scaleUp' },
  { id: 'volunteer', label: 'Volunteer', icon: HandHelping, preset: 'scaleUp' },
  { id: 'references', label: 'References', icon: Users, preset: 'scaleUp' },
];

const SIDEBAR_TO_SECTION_KEY: Record<string, string> = {};

// ── Sortable row ──────────────────────────────────────────────────────────────

interface SortableMenuItemProps {
  id: string;
  label: string;
  Icon: React.ElementType;
  preset: AnimatedIconPreset;
  isActive: boolean;
  isCompleted: boolean;
  showCompletion: boolean;
  onClick: () => void;
}

const SortableMenuItem = ({
  id,
  label,
  Icon,
  preset,
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
      <NavItemWrapper>
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
            <AnimatedIcon
              icon={Icon as any}
              preset={preset}
              className={cn(
                'w-4 h-4 mr-2 transition-colors duration-200',
                isActive ? 'text-primary' : '',
              )}
            />

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
                  <CheckCircle2 className="w-3.5 h-3.5 text-success fill-success/10" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-muted-foreground/20" />
                )}
              </span>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </NavItemWrapper>
    </div>
  );
};

// ── Main sidebar ──────────────────────────────────────────────────────────────

export const ResumeSidebar = () => {
  const { state } = useSidebar();
  const { activeTab, setActiveTab } = useUiStore();
  const { resumeData, addCustomSection, reorderSections, lastSavedData, resetResume, saveResume } =
    useResumeStore();
  const navigate = useNavigate();
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const handleBackToDashboard = () => {
    const isNew = !resumeData.id;
    const currentDataStr = JSON.stringify(resumeData);
    const isUnchanged = currentDataStr === lastSavedData;

    // Check if the summary is completely empty, ignoring default rich-text wrapper tags like <p><br></p>
    const isSummaryEmpty =
      !resumeData.summary.content ||
      resumeData.summary.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim().length === 0;

    // Check if it's a completely empty new resume (no name, no content)
    const hasNoContent =
      isNew &&
      resumeData.basics.name === '' &&
      resumeData.basics.email === '' &&
      isSummaryEmpty &&
      resumeData.sections.experience.items.length === 0 &&
      resumeData.sections.education.items.length === 0;

    // A resume is safe to exit without a confirmation dialog only if:
    // 1. It is an existing, already-saved resume (not new) and has no unsaved edits.
    // 2. Or, it is a brand-new resume that is completely empty (nothing to lose).
    const isSafeToExit = (!isNew && isUnchanged) || (isNew && hasNoContent);

    if (isSafeToExit) {
      if (hasNoContent) resetResume();
      setActiveTab('personal');
      navigate('/dashboard');
      return;
    }

    setShowUnsavedModal(true);
  };

  const handleSaveAndExit = async () => {
    await saveResume();
    setShowUnsavedModal(false);
    setActiveTab('personal');
    navigate('/dashboard');
  };

  const handleExitWithoutSave = () => {
    setShowUnsavedModal(false);
    // Clear all unsaved changes from the local store
    resetResume();
    setActiveTab('personal');
    navigate('/dashboard');
  };

  // Build the ordered list of draggable section IDs (personal is always pinned — excluded here)
  const storedOrder: string[] = resumeData.metadata.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const staticIds = STATIC_SIDEBAR_SECTIONS.map((s) => s.id); // does NOT include 'personal'
  const customIds = resumeData.customSections.map((s) => s.id);
  const allIds = [...staticIds, ...customIds];

  const orderedAllIds = [
    ...storedOrder.filter((id) => allIds.includes(id)),
    ...allIds.filter((id) => !storedOrder.includes(id)),
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedAllIds.indexOf(active.id as string);
    const newIndex = orderedAllIds.indexOf(over.id as string);
    const newOrder = arrayMove(orderedAllIds, oldIndex, newIndex);

    reorderSections(newOrder);
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
      <SidebarHeader
        className={cn(
          'px-4 border-b border-border flex flex-col justify-center transition-all duration-500 ease-in-out',
          state === 'expanded' ? 'h-[var(--header-height)]' : 'h-32',
        )}
      >
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
          <NavItemWrapper className="flex-1 group-data-[collapsible=icon]:flex-none">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="w-full justify-center gap-2 h-10 px-2 hover:bg-primary/10 transition-colors group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
              title="Back to Dashboard"
            >
              <AnimatedIcon icon={ArrowLeft} preset="slideLeft" className="w-4 h-4" />
              <span className="font-medium group-data-[collapsible=icon]:hidden whitespace-nowrap">
                Dashboard
              </span>
            </Button>
          </NavItemWrapper>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
            Resume Sections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Personal Info — always pinned at top, never draggable */}
              {(() => {
                const isActive = activeTab === 'personal';
                const isCompleted = getSectionCompletionStatus('personal', resumeData);
                return (
                  <NavItemWrapper>
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
                        <AnimatedIcon
                          icon={User}
                          preset="scaleUp"
                          className={cn(
                            'w-4 h-4 mr-2 transition-colors duration-200',
                            isActive ? 'text-primary' : '',
                          )}
                        />
                        <span className="truncate flex-1">Personal Info</span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-success fill-success/10 shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 ml-auto text-muted-foreground/20 shrink-0" />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </NavItemWrapper>
                );
              })()}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              >
                <SortableContext items={orderedAllIds} strategy={verticalListSortingStrategy}>
                  {orderedAllIds.map((id) => {
                    const meta = STATIC_SIDEBAR_SECTIONS.find((s) => s.id === id);
                    if (meta) {
                      const sectionKey = SIDEBAR_TO_SECTION_KEY[id] ?? id;
                      const isCompleted = getSectionCompletionStatus(sectionKey, resumeData);

                      return (
                        <SortableMenuItem
                          key={id}
                          id={id}
                          label={meta.label}
                          Icon={meta.icon}
                          preset={meta.preset}
                          isActive={activeTab === id}
                          isCompleted={isCompleted}
                          showCompletion={true}
                          onClick={() => setActiveTab(id)}
                        />
                      );
                    } else {
                      const customMeta = resumeData.customSections.find((s) => s.id === id);
                      if (!customMeta) return null;
                      const isCompleted = getSectionCompletionStatus(customMeta.id, resumeData);

                      return (
                        <SortableMenuItem
                          key={id}
                          id={id}
                          label={customMeta.name}
                          Icon={Plus}
                          preset="scaleUp"
                          isActive={activeTab === id}
                          isCompleted={isCompleted}
                          showCompletion={true}
                          onClick={() => setActiveTab(id)}
                        />
                      );
                    }
                  })}
                </SortableContext>
              </DndContext>

              {/* Add custom section button */}
              <NavItemWrapper>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsAddSectionOpen(true)}
                    className="transition-all duration-200 h-10 px-4 text-primary hover:bg-primary/5 hover:text-primary"
                    tooltip="Add Custom Section"
                  >
                    <AnimatedIcon icon={Plus} preset="scaleUp" className="w-4 h-4 mr-2" />
                    <span>Add section</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </NavItemWrapper>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 py-4 border-t border-border/50 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2 space-y-4 group-data-[collapsible=icon]:space-y-2">
          <NavItemWrapper>
            <Button
              variant="outline"
              onClick={() => setActiveTab('settings')}
              className="w-full justify-center gap-2 h-10 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
            >
              <AnimatedIcon icon={Settings} preset="spinCW" className="w-4 h-4" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">
                Resume Settings
              </span>
            </Button>
          </NavItemWrapper>

          <NavItemWrapper>
            <Button
              variant="outline"
              onClick={() => setActiveTab('tailor')}
              className="w-full justify-center gap-2 h-10 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
            >
              <AnimatedIcon icon={Sparkles} preset="portal" className="w-4 h-4" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">
                Tailor Resume
              </span>
            </Button>
          </NavItemWrapper>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 border-t">
        <div className="flex items-center justify-start w-full">
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
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onSaveAndExit={handleSaveAndExit}
        onExitWithoutSave={handleExitWithoutSave}
      />
    </Sidebar>
  );
};
