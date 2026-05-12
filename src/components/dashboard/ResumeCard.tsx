import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Copy, Edit3, MoreVertical, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useResumeStore } from '@/stores/resumeStore';
import { supabase } from '@/lib/supabase';
import { ResumeData } from '@/types/resume';
import { ResumePreview } from '@/components/resume/ResumePreview';

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
  const navigate = useNavigate();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(resume.name);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25); // Default fallback scale

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Calculate exact scale to fit the 794px wide A4 preview
        setScale(entry.contentRect.width / 794);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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
      toast.success('Resume renamed');
      setIsRenaming(false);
      onRefresh();
    } catch (error) {
      toast.error('Failed to rename resume');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resume.id);

      if (error) throw error;
      toast.success('Resume deleted');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  const handleDuplicate = async () => {
    try {
      // Fetch existing names to ensure uniqueness
      const { data: existingResumes } = await supabase
        .from('resumes')
        .select('name')
        .eq('user_id', resume.user_id);

      const existingNames = existingResumes?.map((r) => r.name) || [];
      
      // Remove any trailing numbers from the base name for clean duplication
      const baseNameMatch = resume.name.match(/^(.*?)( \d+)?$/);
      const baseName = baseNameMatch ? baseNameMatch[1] : resume.name;
      
      let finalName = baseName;
      let counter = 1;
      while (existingNames.includes(finalName)) {
        finalName = `${baseName} ${counter}`;
        counter++;
      }

      // Create a copy of the data
      const newData = { ...resume.data, name: finalName };
      delete newData.id; // ensure a new ID is generated

      const { error } = await supabase
        .from('resumes')
        .insert({
          user_id: resume.user_id,
          name: finalName,
          data: newData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('Resume duplicated');
      onRefresh();
    } catch (error) {
      toast.error('Failed to duplicate resume');
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group relative aspect-[794/1123] overflow-hidden rounded-xl bg-white shadow-lg cursor-pointer border border-border hover:border-primary/50"
      onClick={handleOpen}
    >
      {/* Live Preview Area */}
      <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 origin-top-left opacity-90 group-hover:opacity-100 transition-opacity"
          style={{
            width: '794px',
            height: '1123px',
            transform: `scale(${scale})`,
          }}
        >
          <ResumePreview data={resume.data} />
        </div>
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10" />

      {/* Bottom Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 z-20 text-white flex flex-col justify-end">
        {isRenaming ? (
          <input
            autoFocus
            className="w-full bg-transparent border-b border-white outline-none mb-1 text-sm font-medium"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="font-semibold text-base truncate pr-8 drop-shadow-md">{resume.name}</h3>
        )}
        <p className="text-[11px] text-white/80 drop-shadow-md">
          Last updated {formatDistanceToNow(new Date(resume.updated_at))} ago
        </p>
      </div>

      {/* Menu Trigger */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
        <DropdownMenu>
          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
            <button className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsRenaming(true); }}>
              <Edit3 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(); }}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}

export function CreateNewCard() {
  const navigate = useNavigate();
  const { resetResume } = useResumeStore();

  const handleCreate = () => {
    resetResume();
    sessionStorage.removeItem('rf-anonymous-resume');
    navigate('/resume-builder');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group relative aspect-[794/1123] flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
      onClick={handleCreate}
    >
      <div className="p-4 rounded-full bg-background shadow-sm group-hover:scale-110 transition-transform">
        <Edit3 className="w-8 h-8 text-primary" />
      </div>
      <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">
        Create New Resume
      </span>
    </motion.div>
  );
}
