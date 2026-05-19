import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Briefcase, FileSearch, FileText, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { DeleteConfirmationModal } from '@/shared/components/ui/DeleteConfirmationModal';
import { ActionListMenu } from '@/shared/components/ui/ActionListMenu';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/shared/lib/supabase';
import { cn } from '@/shared/lib/utils';
import { AtsReport } from '@/shared/types/ats';

interface ReportRow {
  id: string;
  resume_id: string;
  user_id: string;
  data: AtsReport;
  job_description: string | null;
  created_at: string;
  resumes?: {
    name: string;
  };
}

interface ReportCardProps {
  report: ReportRow;
  onRefresh: () => void;
}

export function ReportCard({ report, onRefresh }: ReportCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const score = report.data.overall_score;
  const grade = report.data.grade;

  const scoreColor =
    score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-destructive';
  const scoreBg =
    score >= 80 ? 'bg-success/10' : score >= 60 ? 'bg-warning/10' : 'bg-destructive/10';
  const scoreBorder =
    score >= 80 ? 'border-success/20' : score >= 60 ? 'border-warning/20' : 'border-destructive/20';

  const handleView = () => {
    navigate(`/dashboard/ats?resumeId=${report.resume_id}&view=true`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('ats_reports')
        .delete()
        .eq('id', report.id);
      if (deleteError) throw deleteError;
      toast({ title: 'Success', description: 'Report deleted', variant: 'success' });
      onRefresh();
    } catch (err) {
      console.error('Failed to delete report:', err);
      toast({ title: 'Error', description: 'Failed to delete report', variant: 'destructive' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const menuItems = [
    {
      label: 'View Report',
      icon: FileSearch,
      onClick: (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        handleView();
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
        onClick={handleView}
      >
        <div className="aspect-[1/1.414] bg-background m-2 rounded-[18px] overflow-hidden relative shadow-inner flex flex-col items-center justify-center gap-4">
          <div
            className={cn(
              'w-24 h-24 rounded-full border-8 flex items-center justify-center shadow-lg',
              scoreBg,
              scoreBorder,
            )}
          >
            <span className={cn('text-3xl font-black', scoreColor)}>{score}</span>
          </div>
          <div className="text-center">
            <span
              className={cn(
                'text-xs font-black px-4 py-1 rounded-full shadow-sm',
                scoreBg,
                scoreColor,
              )}
            >
              GRADE {grade}
            </span>
          </div>

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="secondary"
              className="rounded-full font-bold px-8 shadow-xl bg-white text-black hover:bg-zinc-100 h-12"
            >
              View Report
            </Button>
          </div>
        </div>

        <div className="p-4 pt-2">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-sm truncate pr-2 group-hover:text-primary transition-colors">
              {report.resumes?.name ?? 'Untitled Resume'}
            </h3>
            <ActionListMenu
              align="end"
              trigger={
                <button className="p-1 rounded-lg hover:bg-accent transition-colors" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              }
              items={menuItems}
            />
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            {report.job_description ? (
              <>
                <Briefcase className="w-3 h-3 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
                  {report.job_description}
                </p>
              </>
            ) : (
              <>
                <FileSearch className="w-3 h-3 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
                  General Analysis
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground/60 font-medium">
              Updated {formatDistanceToNow(new Date(report.created_at))} ago
            </span>
          </div>
        </div>
      </motion.div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Report"
        itemName={report.resumes?.name ? `report for ${report.resumes.name}` : 'this ATS report'}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export function ScanCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col bg-primary/[0.02] border-2 border-dashed border-border/50 rounded-[24px] cursor-pointer hover:border-primary/50 hover:bg-primary/[0.04] transition-all duration-300"
      onClick={() => navigate('/dashboard/ats')}
    >
      {/* Invisible structure to match ReportCard height exactly */}
      <div className="flex flex-col invisible select-none pointer-events-none" aria-hidden="true">
        <div className="aspect-[1/1.414] m-2 rounded-[18px]" />
        <div className="p-4 pt-2">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-sm">Placeholder</h3>
            <div className="p-1">
              <div className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-3 h-3" />
            <p className="text-[11px]">Placeholder JD</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium">Updated 1 month ago</span>
          </div>
        </div>
      </div>

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-16 h-16 rounded-full bg-background shadow-sm border border-border/50 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all relative overflow-hidden">
          <FileText className="w-8 h-8 text-primary" />
          <div className="absolute inset-x-2 top-1/2 h-0.5 bg-primary/40 animate-scan shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
        </div>
        <div className="text-center">
          <p className="font-bold text-muted-foreground group-hover:text-foreground transition-colors text-lg leading-tight">
            Scan Resume
          </p>
          <p className="text-xs text-muted-foreground/60 font-medium mt-1">Analyze with AI</p>
        </div>
      </div>
    </motion.div>
  );
}
