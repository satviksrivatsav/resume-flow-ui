import { create } from 'zustand';

interface UiStore {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const useUiStore = create<UiStore>((set) => ({
    activeTab: 'personal',
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
