import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AtsResultsMain } from '@/components/ats/AtsResultsMain';
import { AtsResultsSidebar } from '@/components/ats/AtsResultsSidebar';
import { AtsSetup } from '@/components/ats/AtsSetup';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { analyzeResumeAts, analyzeResumeJsonAts } from '@/lib/atsApi';
import { supabase } from '@/lib/supabase';
import { useAtsStore } from '@/stores/atsStore';
import { useResumeStore } from '@/stores/resumeStore';
import { cn } from '@/lib/utils';
import { AtsReport } from '@/types/ats';
import { ResumeData } from '@/types/resume';

export default function AtsChecker() {
  const [searchParams] = useSearchParams();
  const resumeIdParam = searchParams.get('resumeId');
  const viewParam = searchParams.get('view');
  const navigate = useNavigate();

  const {
    resumeId: storeResumeId,
    status,
    report,
    parsedResume,
    error,
    setResumeId,
    setStatus,
    setReport,
    setParsedResume,
    setError,
    reset,
  } = useAtsStore();

  const setResumeData = useResumeStore((state) => state.setResumeData);

  const [phase, setPhase] = useState<'setup' | 'results'>(
    searchParams.get('view') === 'true' ? 'results' : 'setup'
  );
  const [existingReport, setExistingReport] = useState<AtsReport | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkExistingReport = useCallback(async (id: string, autoLoad = false) => {
    try {
      const { data, error } = await supabase
        .from('ats_reports')
        .select('data')
        .eq('resume_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.data) {
        const reportData = data.data as AtsReport;
        setExistingReport(reportData);
        
        if (autoLoad) {
          setReport(reportData);
          setPhase('results');
        }
      }
    } catch (err) {
      console.error('Error checking existing report:', err);
    }
  }, [setReport]);

  // Clear the form and handle parameters whenever the user navigates to the ATS page
  useEffect(() => {
    reset();
    
    if (resumeIdParam) {
      // Fetch the resume name if it's not already in the store
      const fetchResumeName = async () => {
        const { data } = await supabase
          .from('resumes')
          .select('name')
          .eq('id', resumeIdParam)
          .single();
        
        if (data?.name) {
          setResumeId(resumeIdParam, data.name);
        } else {
          setResumeId(resumeIdParam);
        }
      };
      
      fetchResumeName();
      checkExistingReport(resumeIdParam, viewParam === 'true');
    }
  }, [resumeIdParam, viewParam, reset, setResumeId, checkExistingReport]);

  const loadExistingReport = useCallback(() => {
    if (existingReport) {
      setReport(existingReport);
      setPhase('results');
    }
  }, [existingReport, setReport]);

  const handleAnalyze = async (file: File | null, jd: string) => {
    try {
      setStatus('analyzing');
      setError(null);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      let result: { parsed_resume: ResumeData; ats_report: AtsReport };
      if (file) {
        result = await analyzeResumeAts(file, jd, abortController.signal);
      } else if (storeResumeId) {
        // Fetch resume data from supabase
        const { data: resumeData, error: resumeError } = await supabase
          .from('resumes')
          .select('data')
          .eq('id', storeResumeId)
          .single();

        if (resumeError) throw resumeError;
        result = await analyzeResumeJsonAts(resumeData.data, jd, abortController.signal);
      } else {
        throw new Error('No resume provided');
      }

      setReport(result.ats_report);
      setParsedResume(result.parsed_resume);
      setPhase('results');
      setStatus('success');
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('ATS Analysis Error:', err);
      setError(err.message || 'Failed to analyze resume');
      setStatus('error');
    }
  };

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setStatus('idle');
  }, [setStatus]);


  const handleReset = useCallback(() => {
    abortControllerRef.current?.abort();
    
    if (viewParam === 'true') {
      // If we came from the reports list, go back there
      navigate(-1);
    } else {
      // If we just did a fresh analysis, go back to setup
      reset();
      setExistingReport(null);
      setPhase('setup');
      navigate('/dashboard/ats', { replace: true });
    }
  }, [reset, navigate, viewParam]);

  const handleSaveReport = async () => {
    if (!report || !storeResumeId || isSaving) return;

    try {
      setIsSaving(true);
      const { error } = await supabase.from('ats_reports').upsert({
        resume_id: storeResumeId,
        data: report,
        score: report.overall_score,
        target_role: report.jd_match?.role_match || 'General',
      });

      if (error) throw error;
      setExistingReport(report);
      // Optional: show success toast
    } catch (err) {
      console.error('Error saving report:', err);
      // Optional: show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoToBuilder = useCallback(() => {
    if (storeResumeId) {
      navigate(`/resume-builder?id=${storeResumeId}`);
    } else if (parsedResume) {
      // If we have parsed data from a file upload, set it in the builder store
      setResumeData(parsedResume);
      navigate('/resume-builder');
    } else {
      navigate('/resume-builder');
    }
  }, [navigate, storeResumeId, parsedResume, setResumeData]);

  return (
    <DashboardLayout fullWidth={phase === 'results'}>
      <div className={cn("flex flex-col w-full relative", phase === 'results' && "h-full")}>


        <AnimatePresence mode="wait">
          {phase === 'setup' ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 w-full pb-20"
            >
              <div className="mb-6 flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 rounded-full hover:bg-accent transition-all group px-4 h-10"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span className="text-sm font-semibold">Back</span>
                </Button>
              </div>
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
            </motion.div>
          ) : (
            report ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col min-h-[600px]"
              >
                {/* Two-column body: left fixed, right scrolls */}
                <div className="flex-1 flex min-h-0 overflow-hidden">
                  {/* LEFT SIDEBAR — 30%, fixed, no scroll */}
                  <div className="w-[30%] shrink-0 border-r border-border/40 overflow-y-auto bg-card/30">
                    <AtsResultsSidebar report={report} onBack={handleReset} />
                  </div>

                  {/* RIGHT MAIN — 70%, scrollable */}
                  <div className="flex-1 overflow-y-auto">
                    <AtsResultsMain 
                      report={report} 
                      onGoToBuilder={handleGoToBuilder}
                      onSaveReport={handleSaveReport}
                      isSaving={isSaving}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
              </div>
            )
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
