import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Briefcase, FileSearch, FileText, MoreVertical, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { AtsReport } from '@/types/ats';

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
  const navigate = useNavigate();
  const score = report.data.overall_score;
  const grade = report.data.grade;

  const scoreColor =
    score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';
  const scoreBg =
    score >= 80 ? 'bg-green-500/10' : score >= 60 ? 'bg-yellow-500/10' : 'bg-red-500/10';
  const scoreBorder =
    score >= 80
      ? 'border-green-500/20'
      : score >= 60
        ? 'border-yellow-500/20'
        : 'border-red-500/20';

  const handleView = () => {
    navigate(`/dashboard/ats?resumeId=${report.resume_id}&view=true`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('ats_reports')
        .delete()
        .eq('id', report.id);
      if (deleteError) throw deleteError;
      toast.success('Report deleted');
      onRefresh();
    } catch (err) {
      console.error('Failed to delete report:', err);
      toast.error('Failed to delete report');
    }
  };

  return (
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
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <button className="p-1 rounded-lg hover:bg-accent transition-colors">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <FileSearch className="w-4 h-4 mr-2" />
                View Report
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
