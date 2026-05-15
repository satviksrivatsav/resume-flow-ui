import { create } from 'zustand';

import { AtsReport } from '@/types/ats';
import { ResumeData } from '@/types/resume';

interface AtsState {
  resumeFile: File | null;
  resumeId: string | null;
  jdText: string;
  jdFile: File | null;
  status: 'idle' | 'analyzing' | 'success' | 'error';
  report: AtsReport | null;
  parsedResume: ResumeData | null;
  error: string | null;

  setResumeFile: (file: File | null) => void;
  setResumeId: (id: string | null) => void;
  setJdText: (text: string) => void;
  setJdFile: (file: File | null) => void;
  setStatus: (status: AtsState['status']) => void;
  setReport: (report: AtsReport | null) => void;
  setParsedResume: (resume: ResumeData | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAtsStore = create<AtsState>((set) => ({
  resumeFile: null,
  resumeId: null,
  jdText: '',
  jdFile: null,
  status: 'idle',
  report: null,
  parsedResume: null,
  error: null,

  setResumeFile: (resumeFile) => set({ resumeFile, resumeId: null }),
  setResumeId: (resumeId) => set({ resumeId, resumeFile: null }),
  setJdText: (jdText) => set({ jdText, jdFile: null }),
  setJdFile: (jdFile) => set({ jdFile, jdText: '' }),
  setStatus: (status) => set({ status }),
  setReport: (report) => set({ report }),
  setParsedResume: (parsedResume) => set({ parsedResume }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      resumeFile: null,
      resumeId: null,
      jdText: '',
      jdFile: null,
      status: 'idle',
      report: null,
      parsedResume: null,
      error: null,
    }),
}));
