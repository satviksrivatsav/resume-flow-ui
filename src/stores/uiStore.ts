
import { create } from 'zustand';

export interface AIRequestIntent {
    text: string; // The initial prompt or instruction
    section?: string; // targetSection
    id?: string; // targetId
}

interface UiStore {
    activeTab: string;
    setActiveTab: (tab: string) => void;

    // To pass context from Magic Button to AI Assistant
    aiIntent: AIRequestIntent | null;
    setAiIntent: (intent: AIRequestIntent | null) => void;
}

export const useUiStore = create<UiStore>((set) => ({
    activeTab: 'personal',
    setActiveTab: (tab) => set({ activeTab: tab }),
    aiIntent: null,
    setAiIntent: (intent) => set({ aiIntent: intent }),
}));
