import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Copy, Edit3, FileSearch, FileText, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResumePreview } from '@/resume/components/ResumePreview';
import { DeleteConfirmationModal } from '@/shared/components/ui/DeleteConfirmationModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/shared/lib/supabase';
import { sanitizeResumeData } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { useUiStore } from '@/shared/stores/uiStore';
import { ResumeData } from '@/shared/types/resume';

interface ResumeRow {
  id: string;
  user_id: string;
  name: string;
  data: ResumeData;
  created_at: string;
  updated_at: string;
}

interface ResumeCardProps {
  resume: ResumeRow;
  onRefresh: () => void;
}

export function ResumeCard({ resume, onRefresh }: ResumeCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(resume.name);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  const [hasReport, setHasReport] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const checkReport = async () => {
      const { data } = await supabase
        .from('ats_reports')
        .select('id')
        .eq('resume_id', resume.id)
        .limit(1)
        .maybeSingle();

      if (data) setHasReport(true);
    };

    checkReport();

    if (!containerRef.current) return;
    const currentContainer = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setScale(entry.contentRect.width / 794);
      }
    });
    observer.observe(currentContainer);
    return () => observer.disconnect();
  }, [resume.id]);

  const handleOpen = () => {
    navigate(`/resume-builder?id=${resume.id}`);
  };

  const handleRename = async () => {
    if (!newName.trim() || newName === resume.name) {
      setIsRenaming(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('resumes')
        .update({ name: newName })
        .eq('id', resume.id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Resume renamed', variant: 'success' });
      setIsRenaming(false);
      onRefresh();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to rename resume', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('resumes').delete().eq('id', resume.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Resume deleted', variant: 'success' });
      onRefresh();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete resume', variant: 'destructive' });
    }
  };

  const handleDuplicate = async () => {
    try {
      const { data: existingResumes } = await supabase
        .from('resumes')
        .select('name')
        .eq('user_id', resume.user_id);

      const existingNames = existingResumes?.map((r) => r.name) || [];

      const baseNameMatch = /^(.*?)( \d+)?$/.exec(resume.name);
      const baseName = baseNameMatch ? baseNameMatch[1] : resume.name;

      let finalName = baseName;
      let counter = 1;
      while (existingNames.includes(finalName)) {
        finalName = `${baseName} ${counter}`;
        counter++;
      }

      const newData = sanitizeResumeData({ ...resume.data, name: finalName });
      delete newData.id;

      const { error } = await supabase.from('resumes').insert({
        user_id: resume.user_id,
        name: finalName,
        data: newData,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast({ title: 'Success', description: 'Resume duplicated', variant: 'success' });
      onRefresh();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to duplicate resume', variant: 'destructive' });
    }
  };

  return (
    <>
      <motion.div
        className="group relative flex flex-col bg-accent/20 border border-border/50 rounded-[24px] overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300"
        onClick={handleOpen}
      >
        <div className="aspect-[1/1.414] bg-background m-2 rounded-[18px] overflow-hidden relative shadow-inner">
          <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{ width: '794px', height: '1123px', transform: `scale(${scale})` }}
            >
              <ResumePreview data={resume.data} />
            </div>
          </div>
        </div>

        <div className="p-4 pt-2">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-sm truncate pr-2 group-hover:text-primary transition-colors">
              {isRenaming ? (
                <input
                  autoFocus
                  className="w-full bg-transparent border-b border-primary outline-none text-sm font-bold"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                resume.name
              )}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                <button className="p-1 rounded-lg hover:bg-accent transition-colors">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {hasReport && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/ats?resumeId=${resume.id}&view=true`);
                    }}
                  >
                    <FileSearch className="w-4 h-4 mr-2" />
                    View ATS Report
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRenaming(true);
                  }}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate();
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteModal(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground/60 font-medium">
              Updated {formatDistanceToNow(new Date(resume.updated_at))} ago
            </span>
          </div>
        </div>
      </motion.div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Resume"
        itemName={resume.name}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          void handleDelete();
        }}
      />
    </>
  );
}

export function CreateNewCard() {
  const navigate = useNavigate();
  const { resetResume } = useResumeStore();
  const { setActiveTab } = useUiStore();

  const handleCreate = () => {
    resetResume();
    setActiveTab('personal');
    sessionStorage.removeItem('rf-anonymous-resume');
    navigate('/resume-builder');
  };

  return (
    <motion.div
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col bg-primary/[0.02] border-2 border-dashed border-border/50 rounded-[24px] cursor-pointer hover:border-primary/50 hover:bg-primary/[0.04] transition-all duration-300"
      onClick={handleCreate}
    >
      {/* Invisible structure to match ResumeCard height exactly */}
      <div className="flex flex-col invisible select-none pointer-events-none" aria-hidden="true">
        <div className="aspect-[1/1.414] m-2 rounded-[18px]" />
        <div className="p-4 pt-2">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-sm">Placeholder</h3>
            <div className="p-1">
              <div className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium">Updated 1 month ago</span>
          </div>
        </div>
      </div>

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-16 h-16 rounded-full bg-background shadow-sm border border-border/50 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all">
          <Plus className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-bold text-muted-foreground group-hover:text-foreground transition-colors text-lg leading-tight">
            New Masterpiece
          </p>
          <p className="text-xs text-muted-foreground/60 font-medium mt-1">From scratch</p>
        </div>
      </div>
    </motion.div>
  );
}

export function ParseResumeCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col bg-primary/[0.02] border-2 border-dashed border-border/50 rounded-[24px] cursor-pointer hover:border-primary/50 hover:bg-primary/[0.04] transition-all duration-300"
      onClick={() => navigate('/dashboard/upload')}
    >
      {/* Invisible structure to match ResumeCard height exactly */}
      <div className="flex flex-col invisible select-none pointer-events-none" aria-hidden="true">
        <div className="aspect-[1/1.414] m-2 rounded-[18px]" />
        <div className="p-4 pt-2">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-sm">Placeholder</h3>
            <div className="p-1">
              <div className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium">Updated 1 month ago</span>
          </div>
        </div>
      </div>

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-16 h-16 rounded-full bg-background shadow-sm border border-border/50 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-bold text-muted-foreground group-hover:text-foreground transition-colors text-lg leading-tight">
            Parse Existing Resume
          </p>
          <p className="text-xs text-muted-foreground/60 font-medium mt-1">AI-powered extraction</p>
        </div>
      </div>
    </motion.div>
  );
}
