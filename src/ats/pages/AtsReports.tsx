import { AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { DashboardLayout } from '@/dashboard/components/DashboardLayout';
import { ReportCard, ScanCard } from '@/dashboard/components/ReportCard';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/shared/lib/supabase';
import { useAuthStore } from '@/shared/stores/authStore';
import { AtsReport } from '@/shared/types/ats';

interface ReportRow {
  id: string;
  resume_id: string;
  user_id: string;
  data: AtsReport;
  job_description: string | null;
  created_at: string;
  resumes: {
    name: string;
  };
}

export default function AtsReports() {
  const { toast } = useToast();
  const { user, isInitialized } = useAuthStore();
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (!isInitialized) return;

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('ats_reports')
        .select('*, resumes(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setReports((data as unknown as ReportRow[]) ?? []);
    } catch (err: unknown) {
      console.error('Error fetching reports:', err);
      const isNetworkError =
        !navigator.onLine ||
        (err instanceof TypeError && err.message.toLowerCase().includes('fetch'));
      const message = isNetworkError
        ? 'A network error occurred. Please check your connection and try again.'
        : 'Failed to load your ATS reports. Please try again later.';
      setError(message);
      toast({
        title: isNetworkError ? 'Network Error' : 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, isInitialized]);

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  const isActuallyLoading = !isInitialized || (loading && reports.length === 0);

  return (
    <DashboardLayout>
      <header className="flex items-end justify-between mb-12">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-0.5">ATS Reports</h1>
          <p className="text-[13px] text-muted-foreground/80">
            Your historical analysis and optimizations.
          </p>
        </div>
      </header>

      {error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
          <Button
            onClick={() => {
              void fetchReports();
            }}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <ScanCard />

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
            : reports.map((report) => (
                <ReportCard key={report.id} report={report} onRefresh={fetchReports} />
              ))}
        </div>
      )}
    </DashboardLayout>
  );
}
