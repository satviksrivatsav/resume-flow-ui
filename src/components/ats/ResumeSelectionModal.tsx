import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ResumeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string, name: string) => void;
}

interface ResumeRow {
  id: string;
  name: string;
  updated_at: string;
}

export function ResumeSelectionModal({ isOpen, onClose, onSelect }: ResumeSelectionModalProps) {
  const { user } = useAuthStore();
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      fetchResumes();
    }
  }, [isOpen, user]);

  async function fetchResumes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resumes')
        .select('id, name, updated_at')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (err) {
      console.error('Error fetching resumes for selection:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredResumes = resumes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[400px] bg-card/60 backdrop-blur-2xl border border-border/50 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[70vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="p-7 pb-4">
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight mb-1">Select Resume</h2>
                <p className="text-[11px] text-muted-foreground font-medium italic">Choose a resume to analyze.</p>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-full bg-muted/20 border-border/50 focus:ring-primary/20 transition-all text-xs"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-7 space-y-2 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mb-3 text-primary/40" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40">Fetching records</p>
                </div>
              ) : filteredResumes.length > 0 ? (
                filteredResumes.map((resume) => (
                  <button
                    key={resume.id}
                    onClick={() => onSelect(resume.id, resume.name)}
                    className="w-full flex items-center justify-between p-3 px-5 rounded-full border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all group text-left"
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate max-w-[280px]">{resume.name}</p>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">
                        {new Date(resume.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-12 bg-muted/5 rounded-[1.5rem] border border-dashed border-border/50">
                  <p className="text-xs text-muted-foreground italic">No matches found.</p>
                </div>
              )}
            </div>

            <div className="p-7 pt-4 flex justify-center">
              <Button
                variant="ghost"
                onClick={onClose}
                className="h-9 rounded-full px-8 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
