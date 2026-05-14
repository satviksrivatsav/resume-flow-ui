import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { AtsResultsMain } from '@/components/ats/AtsResultsMain';
import { AtsResultsSidebar } from '@/components/ats/AtsResultsSidebar';
import { AtsSetup } from '@/components/ats/AtsSetup';
import { Button } from '@/components/ui/button';
import { analyzeResumeAts, analyzeResumeJsonAts } from '@/lib/atsApi';
import { supabase } from '@/lib/supabase';
import { useAtsStore } from '@/stores/atsStore';
import { useAuthStore } from '@/stores/authStore';

export default function AtsChecker() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeIdParam = searchParams.get('resumeId');
  const viewParam = searchParams.get('view');
  const { user } = useAuthStore();

  const {
    resumeFile,
    resumeId: storeResumeId,
    jdText,
    status,
    report,
    error,
    setResumeId,
    setStatus,
    setReport,
    setError,
    reset,
  } = useAtsStore();

  const [phase, setPhase] = useState<'setup' | 'results'>('setup');
  const [isSaving, setIsSaving] = useState(false);
  const [existingReport, setExistingReport] = useState<AtsReport | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (resumeIdParam) {
      setResumeId(resumeIdParam);
      checkExistingReport(resumeIdParam, viewParam === 'true');
    }
  }, [resumeIdParam, viewParam, setResumeId]);

  const checkExistingReport = async (id: string, autoLoad = false) => {
    try {
      const { data, error } = await supabase
        .from('ats_reports')
        .select('data')
        .eq('resume_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.data) {
        const reportData = data.data as AtsReport;
        setExistingReport(reportData);
        if (autoLoad) {
          setReport(reportData);
          setPhase('results');
          setStatus('success');
        }
      }
    } catch (err) {
      console.error('Error checking existing report:', err);
    }
  };

  const loadExistingReport = () => {
    if (existingReport) {
      setReport(existingReport);
      setPhase('results');
      setStatus('success');
    }
  };

  const handleAnalyze = useCallback(
    async (file: File | null, jdTextValue: string) => {
      const activeResumeId = file ? null : storeResumeId;
      if (!file && !activeResumeId) return;

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setStatus('analyzing');
      setError(null);

      try {
        let response;
        if (file) {
          response = await analyzeResumeAts(file, jdTextValue || undefined, controller.signal);
        } else if (activeResumeId) {
          // Fetch resume data from Supabase
          const { data, error: supabaseError } = await supabase
            .from('resumes')
            .select('data')
            .eq('id', activeResumeId)
            .single();

          if (supabaseError) throw new Error('Failed to fetch resume data from dashboard');
          if (!data?.data) throw new Error('Resume data is empty');

          response = await analyzeResumeJsonAts(
            data.data,
            jdTextValue || undefined,
            controller.signal,
          );
        } else {
          throw new Error('No resume selected');
        }

        setReport(response.ats_report);
        setStatus('success');

        await new Promise((resolve) => setTimeout(resolve, 400));
        setPhase('results');
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
        setError(message);
        setStatus('error');
      }
    },
    [storeResumeId, setStatus, setError, setReport],
  );

  const handleSaveReport = async () => {
    if (!user) {
      toast.error('Please sign in to save reports');
      return;
    }

    if (!storeResumeId) {
      toast.error('Please save your resume first before saving the ATS report');
      return;
    }

    if (!report) return;

    setIsSaving(true);
    try {
      const { error: saveError } = await supabase.from('ats_reports').insert({
        resume_id: storeResumeId,
        user_id: user.id,
        data: report,
        job_description: jdText || null,
      });

      if (saveError) throw saveError;

      toast.success('ATS Report saved to dashboard');
      setExistingReport(report);
    } catch (err) {
      console.error('Failed to save report:', err);
      toast.error('Failed to save report to dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setStatus('idle');
  }, [setStatus]);

  const handleBackToSetup = useCallback(() => {
    setPhase('setup');
    setReport(null);
    setStatus('idle');
  }, [setReport, setStatus]);

  const handleReset = useCallback(() => {
    abortControllerRef.current?.abort();
    reset();
    setExistingReport(null);
    setPhase('setup');
  }, [reset]);

  const handleGoToBuilder = useCallback(() => {
    navigate('/resume-builder');
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header — always visible */}
      <header className="shrink-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between h-14 px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back
          </Button>
          <h1 className="text-base font-semibold tracking-tight">
            {phase === 'setup' ? 'ATS Checker' : 'Analysis Results'}
          </h1>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
            Reset
          </Button>
        </div>
      </header>

      {/* Body */}
      <AnimatePresence mode="wait">
        {phase === 'setup' ? (
          <motion.main
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 overflow-y-auto px-6 py-8"
          >
            <AtsSetup
              onAnalyze={handleAnalyze}
              onCancel={handleCancel}
              isAnalyzing={status === 'analyzing'}
              hasExistingReport={!!existingReport}
              onViewExistingReport={loadExistingReport}
            />
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </motion.main>
        ) : (
          report && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Action Bar */}
              <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-border/40 bg-background/60 backdrop-blur-sm">
                <Button variant="outline" size="sm" onClick={handleBackToSetup} className="gap-2">
                  ← Back to Setup
                </Button>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={handleGoToBuilder}>
                    Open in Builder →
                  </Button>
                  <Button size="sm" onClick={handleSaveReport} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save to Dashboard'}
                  </Button>
                </div>
              </div>

              {/* Two-column body: left fixed, right scrolls */}
              <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* LEFT SIDEBAR — 30%, fixed, no scroll */}
                <div className="w-[30%] shrink-0 border-r border-border/40 overflow-y-auto bg-card/30">
                  <AtsResultsSidebar report={report} />
                </div>

                {/* RIGHT MAIN — 70%, scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <AtsResultsMain report={report} />
                </div>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
