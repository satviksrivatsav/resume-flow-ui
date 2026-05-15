import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

interface ResumeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ResumeListItem {
  id: string;
  name: string;
  updated_at: string;
}

export function ResumeSelectionModal({ isOpen, onClose }: ResumeSelectionModalProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !user?.id) {
      setResumes([]);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchResumes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('id, name, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setResumes(data || []);
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
        setError('Failed to load resumes. Please try again.');
        toast.error('Failed to load resumes.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [isOpen, user?.id]);

  const handleSelectResume = (resumeId: string) => {
    navigate(`/ats?resumeId=${resumeId}`);
    onClose();
  };

  const handleUploadNew = () => {
    navigate('/ats');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Select a Resume</DialogTitle>
          <DialogDescription>
            Choose an existing resume to analyze or upload a new one.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading resumes...</span>
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {resumes.length > 0 ? (
              <ScrollArea className="flex-grow max-h-[calc(90vh-200px)] pr-4">
                <div className="grid gap-2">
                  {resumes.map((resume) => (
                    <Button
                      key={resume.id}
                      variant="outline"
                      className="justify-between h-auto py-3 px-4"
                      onClick={() => handleSelectResume(resume.id)}
                    >
                      <span className="font-medium truncate">{resume.name}</span>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                        Updated: {new Date(resume.updated_at).toLocaleDateString()}
                      </span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-center text-muted-foreground p-4">No resumes found. Upload a new one!</p>
            )}

            <div className="flex justify-end pt-4 border-t border-border mt-4">
              <Button onClick={handleUploadNew} className="w-full">
                <UploadCloud className="h-4 w-4 mr-2" /> Upload New Resume
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
