import { create } from 'zustand';

interface UiStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  activeTab: 'personal',
  setActiveTab: (tab) => set({ activeTab: tab }),
  showPreview: window.innerWidth >= 1024,
  setShowPreview: (show) => set({ showPreview: show }),
}));
