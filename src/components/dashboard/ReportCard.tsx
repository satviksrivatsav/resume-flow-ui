import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Briefcase, FileSearch, MoreVertical, Trash2 } from 'lucide-react';
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
    navigate(`/ats?resumeId=${report.resume_id}&view=true`);
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
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative flex flex-col bg-accent/20 border border-border/50 rounded-[24px] overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300"
      onClick={handleView}
    >
      <div className="aspect-[1/0.8] bg-background m-2 rounded-[18px] overflow-hidden relative shadow-inner flex flex-col items-center justify-center gap-2">
        <div
          className={cn(
            'w-20 h-20 rounded-full border-4 flex items-center justify-center',
            scoreBg,
            scoreBorder,
          )}
        >
          <span className={cn('text-2xl font-black', scoreColor)}>{score}</span>
        </div>
        <div className="text-center">
          <span
            className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', scoreBg, scoreColor)}
          >
            GRADE {grade}
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="secondary"
            className="rounded-xl font-bold px-6 shadow-xl bg-white text-black hover:bg-zinc-100"
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

        {report.job_description && (
          <div className="flex items-center gap-1.5 mb-2">
            <Briefcase className="w-3 h-3 text-muted-foreground" />
            <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
              {report.job_description}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
            {formatDistanceToNow(new Date(report.created_at))} ago
          </span>
        </div>
      </div>
    </motion.div>
  );
}
