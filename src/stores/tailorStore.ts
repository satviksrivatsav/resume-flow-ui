import { create } from 'zustand';

export interface TailoredSection {
  sectionId: string;
  sectionName: string;
  originalContent: any;
  tailoredContent: any;
  decision?: 'accept' | 'reject';
}

interface TailorStore {
  jobDescription: string;
  setJobDescription: (jd: string) => void;

  sectionsToTailor: string[];
  setSectionsToTailor: (sections: string[]) => void;

  tailoredSections: TailoredSection[];
  setTailoredSections: (sections: TailoredSection[]) => void;

  updateDecision: (sectionId: string, decision: 'accept' | 'reject') => void;

  isTailoring: boolean;
  setIsTailoring: (is: boolean) => void;

  viewMode: 'form' | 'diff';
  setViewMode: (mode: 'form' | 'diff') => void;

  error: string | null;
  setError: (err: string | null) => void;

  reset: () => void;
}

export const useTailorStore = create<TailorStore>((set) => ({
  jobDescription: '',
  setJobDescription: (jobDescription) => set({ jobDescription }),

  sectionsToTailor: ['summary', 'experience', 'projects', 'skills'],
  setSectionsToTailor: (sectionsToTailor) => set({ sectionsToTailor }),

  tailoredSections: [],
  setTailoredSections: (tailoredSections) => set({ tailoredSections }),

  updateDecision: (sectionId, decision) =>
    set((state) => ({
      tailoredSections: state.tailoredSections.map((s) =>
        s.sectionId === sectionId ? { ...s, decision } : s,
      ),
    })),

  isTailoring: false,
  setIsTailoring: (isTailoring) => set({ isTailoring }),

  viewMode: 'form',
  setViewMode: (viewMode) => set({ viewMode }),

  error: null,
  setError: (error) => set({ error }),

  reset: () =>
    set({
      jobDescription: '',
      sectionsToTailor: ['summary', 'experience', 'projects', 'skills'],
      tailoredSections: [],
      isTailoring: false,
      viewMode: 'form',
      error: null,
    }),
}));
