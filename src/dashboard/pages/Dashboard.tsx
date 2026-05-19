import { AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { DashboardLayout } from '@/dashboard/components/DashboardLayout';
import { CreateNewCard, ParseResumeCard, ResumeCard } from '@/dashboard/components/ResumeCard';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/shared/lib/supabase';
import { useAuthStore } from '@/shared/stores/authStore';
import { ResumeData } from '@/shared/types/resume';

interface ResumeRow {
  id: string;
  user_id: string;
  name: string;
  data: ResumeData;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { toast } = useToast();
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
      const isNetworkError =
        !navigator.onLine ||
        (err instanceof TypeError && err.message.toLowerCase().includes('fetch'));
      setError(
        isNetworkError
          ? 'A network error occurred. Please check your connection and try again.'
          : err.message || 'Failed to fetch resumes',
      );
      toast({
        title: isNetworkError ? 'Network Error' : 'Error',
        description: isNetworkError
          ? 'A network error occurred. Please check your connection and try again.'
          : 'Failed to load resumes',
        variant: 'destructive',
      });
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
          <h1 className="text-xl font-bold tracking-tight mb-0.5">My Resumes</h1>
          <p className="text-[13px] text-muted-foreground/80">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <CreateNewCard />
          <ParseResumeCard />

          {isActuallyLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-muted/10 border border-border/50 rounded-[24px] overflow-hidden"
                >
                  <div className="aspect-[1/1.414] bg-muted/20 m-2 rounded-[18px] animate-pulse" />
                  <div className="p-4 pt-2">
                    <div className="h-4 w-3/4 bg-muted/20 rounded animate-pulse mb-2" />
                    <div className="h-3 w-1/3 bg-muted/20 rounded animate-pulse mb-2" />
                    <div className="h-3 w-1/2 bg-muted/20 rounded animate-pulse" />
                  </div>
                </div>
              ))
            : resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} onRefresh={fetchResumes} />
              ))}
        </div>
      )}
    </DashboardLayout>
  );
}
