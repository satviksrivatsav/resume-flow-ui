import { useEffect, useState, useCallback } from 'react';
import { LayoutGrid, Search, RefreshCcw, AlertCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { ResumeCard, CreateNewCard } from '@/components/dashboard/ResumeCard';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { ResumeData } from '@/types/resume';
import { Button } from '@/components/ui/button';

interface ResumeRow {
  id: string;
  user_id: string;
  name: string;
  data: ResumeData;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuthStore();
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchResumes = useCallback(async () => {
    if (authLoading) return;
    
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
  }, [user, authLoading]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const isActuallyLoading = authLoading || (loading && resumes.length === 0);

  const filteredResumes = resumes.filter((resume) =>
    resume.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center" title="Back to Home">
              <Home className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold tracking-tight">My Resumes</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 max-w-md w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resumes..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchResumes}
              disabled={loading}
              className="rounded-full"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
            <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
            <Button onClick={fetchResumes}>Try Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <CreateNewCard />
            
            {isActuallyLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[794/1123] rounded-xl bg-muted/30 animate-pulse"
                />
              ))
            ) : (
              filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onRefresh={fetchResumes}
                />
              ))
            )}
          </div>
        )}

        {!loading && !error && filteredResumes.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No resumes found matching "{searchQuery}"</p>
          </div>
        )}

        {!loading && !error && resumes.length === 0 && !searchQuery && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl mt-6">
            <LayoutGrid className="w-12 h-12 mb-4 opacity-20" />
            <h2 className="text-xl font-medium mb-1">Welcome to your Dashboard!</h2>
            <p className="text-sm">You haven't saved any resumes yet. Click "Create New" to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
}
