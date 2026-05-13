import { create } from 'zustand';
import { AtsReport } from '@/types/ats';

interface AtsState {
  resumeFile: File | null;
  resumeId: string | null;
  jdText: string;
  status: 'idle' | 'analyzing' | 'success' | 'error';
  report: AtsReport | null;
  error: string | null;

  setResumeFile: (file: File | null) => void;
  setResumeId: (id: string | null) => void;
  setJdText: (text: string) => void;
  setStatus: (status: AtsState['status']) => void;
  setReport: (report: AtsReport | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAtsStore = create<AtsState>((set) => ({
  resumeFile: null,
  resumeId: null,
  jdText: '',
  status: 'idle',
  report: null,
  error: null,

  setResumeFile: (resumeFile) => set({ resumeFile, resumeId: null }),
  setResumeId: (resumeId) => set({ resumeId, resumeFile: null }),
  setJdText: (jdText) => set({ jdText }),
  setStatus: (status) => set({ status }),
  setReport: (report) => set({ report }),
  setError: (error) => set({ error }),
  reset: () => set({ resumeFile: null, resumeId: null, jdText: '', status: 'idle', report: null, error: null }),
}));
