import { create } from 'zustand';

export interface TailoredSlide {
  slideId: string;
  sectionId: string;
  itemIndex?: number;
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

  tailoredSlides: TailoredSlide[];
  setTailoredSlides: (slides: TailoredSlide[]) => void;

  updateDecision: (slideId: string, decision: 'accept' | 'reject') => void;
  updateTailoredContent: (slideId: string, content: any) => void;

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

  tailoredSlides: [],
  setTailoredSlides: (tailoredSlides) => set({ tailoredSlides }),

  updateDecision: (slideId, decision) =>
    set((state) => ({
      tailoredSlides: state.tailoredSlides.map((s) =>
        s.slideId === slideId ? { ...s, decision } : s,
      ),
    })),
  updateTailoredContent: (slideId, content) =>
    set((state) => ({
      tailoredSlides: state.tailoredSlides.map((s) =>
        s.slideId === slideId ? { ...s, tailoredContent: content } : s,
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
      tailoredSlides: [],
      isTailoring: false,
      viewMode: 'form',
      error: null,
    }),
}));
