import { AlertCircle, LayoutGrid } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CreateNewCard, ResumeCard } from '@/components/dashboard/ResumeCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { ResumeData } from '@/types/resume';

interface ResumeRow {
  id: string;
  user_id: string;
  name: string;
  data: ResumeData;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user, isInitialized } = useAuthStore();
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = useCallback(async () => {
    // Wait until the auth store has finished its initial session check.
    // Using isInitialized (a permanent flag) prevents an infinite-loading
    // race where the effect fires while authLoading is still true and
    // returns early, but then authLoading never flips again in a way that
    // re-triggers the effect.
    if (!isInitialized) return;

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (err: any) {
      console.error('Error fetching resumes:', err);
      setError(err.message || 'Failed to fetch resumes');
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, [user, isInitialized]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const isActuallyLoading = !isInitialized || (loading && resumes.length === 0);

  return (
    <DashboardLayout>
      <header className="flex items-end justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Resumes</h1>
          <p className="text-muted-foreground font-medium italic">
            Crafting your professional narrative.
          </p>
        </div>
      </header>

      {error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
          <Button onClick={fetchResumes}>Try Again</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          <CreateNewCard />

          {isActuallyLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[794/1123] rounded-xl bg-muted/30 animate-pulse" />
              ))
            : resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} onRefresh={fetchResumes} />
              ))}
        </div>
      )}

      {!loading && !error && resumes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl mt-6">
          <LayoutGrid className="w-12 h-12 mb-4 opacity-20" />
          <h2 className="text-xl font-medium mb-1">Welcome to your Dashboard!</h2>
          <p className="text-sm">
            You haven't saved any resumes yet. Click "Create New" to get started.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
