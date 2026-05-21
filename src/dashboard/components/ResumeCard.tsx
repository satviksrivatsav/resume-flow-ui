import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Copy,
  Download,
  Edit3,
  FileSearch,
  FileText,
  MoreVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ActionListMenu } from '@/shared/components/ui/ActionListMenu';
import { DeleteConfirmationModal } from '@/shared/components/ui/DeleteConfirmationModal';
import { Logo } from '@/shared/components/ui/Logo';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/shared/lib/supabase';
import { sanitizeResumeData } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { useUiStore } from '@/shared/stores/uiStore';
import { ResumeData } from '@/shared/types/resume';

import { ExportResumeModal } from './ExportResumeModal';

interface ResumeRow {
  id: string;
  user_id: string;
  name: string;
  data: ResumeData;
  thumbnail_url?: string | null;
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
  const [hasReport, setHasReport] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

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

    void checkReport();
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
    } catch {
      toast({ title: 'Error', description: 'Failed to rename resume', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('resumes').delete().eq('id', resume.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Resume deleted', variant: 'success' });
      onRefresh();
    } catch {
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
    } catch {
      toast({ title: 'Error', description: 'Failed to duplicate resume', variant: 'destructive' });
    }
  };

  const menuItems = [
    ...(hasReport
      ? [
          {
            label: 'View ATS Report',
            icon: FileSearch,
            onClick: (e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              navigate(`/dashboard/ats?resumeId=${resume.id}&view=true`);
            },
          },
        ]
      : []),
    {
      label: 'Rename',
      icon: Edit3,
      onClick: (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsRenaming(true);
      },
    },
    {
      label: 'Duplicate',
      icon: Copy,
      onClick: (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        void handleDuplicate();
      },
    },
    {
      label: 'Export',
      icon: Download,
      onClick: (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setShowExportModal(true);
      },
    },
    {
      label: 'Delete',
      icon: Trash2,
      destructive: true,
      onClick: (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setShowDeleteModal(true);
      },
    },
  ];

  return (
    <>
      <motion.div
        className="group relative flex flex-col bg-accent/20 border border-border/50 rounded-[24px] overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300"
        onClick={handleOpen}
      >
        <div className="aspect-[1/1.414] bg-background m-2 rounded-[18px] overflow-hidden relative shadow-inner">
          {resume.thumbnail_url ? (
            <img
              src={resume.thumbnail_url}
              alt={resume.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-accent/5 opacity-20 grayscale">
              <Logo className="w-16 h-16 mb-2" />
              <p className="text-[10px] font-bold tracking-widest uppercase">No Preview</p>
            </div>
          )}
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
                  onBlur={() => void handleRename()}
                  onKeyDown={(e) => e.key === 'Enter' && void handleRename()}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                resume.name
              )}
            </h3>
            <ActionListMenu
              align="end"
              trigger={
                <button
                  className="p-1 rounded-full hover:bg-accent transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              }
              items={menuItems}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground/60 font-medium">
              Updated {formatDistanceToNow(new Date(resume.updated_at))} ago
            </span>
          </div>
        </div>
      </motion.div>

      <ExportResumeModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        resumeData={resume.data}
        resumeName={resume.name}
      />

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
