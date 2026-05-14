import { AlertCircle, FileText } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ReportCard, ScanCard } from '@/components/dashboard/ReportCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { AtsReport } from '@/types/ats';

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
      const message = err instanceof Error ? err.message : 'Failed to fetch reports';
      setError(message);
      toast.error('Failed to load reports');
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
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">ATS Reports</h1>
          <p className="text-muted-foreground font-medium italic">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          <ScanCard />

          {isActuallyLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[1/1.414] rounded-xl bg-muted/30 animate-pulse" />
              ))
            : reports.map((report) => (
                <ReportCard key={report.id} report={report} onRefresh={fetchReports} />
              ))}
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl mt-6">
          <FileText className="w-12 h-12 mb-4 opacity-20" />
          <h2 className="text-xl font-medium mb-1">No reports yet</h2>
          <p className="text-sm">Analyze your first resume to see reports here.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
