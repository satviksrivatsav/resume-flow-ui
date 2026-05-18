import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

import { supabase } from '@/shared/lib/supabase';
import { sanitizeResumeData } from '@/shared/lib/utils';
import {
  defaultResumeData,
  EducationItem,
  ExperienceItem,
  ProfileItem,
  ProjectItem,
  ResumeData,
  SkillItem,
} from '@/shared/types/resume';

import { useAuthStore } from './authStore';

interface ResumeRow {
  id: string;
  user_id: string;
  name: string;
  data: ResumeData;
  created_at: string;
  updated_at: string;
}

interface ResumeStore {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  setResumeName: (name: string) => void;
  loadResume: (id: string) => Promise<void>;

  // Basics
  updateBasics: (data: Partial<ResumeData['basics']>) => void;
  updatePicture: (data: Partial<ResumeData['picture']>) => void;

  // Summary
  updateSummary: (data: Partial<ResumeData['summary']>) => void;

  // Metadata
  updateMetadata: (metadata: Partial<ResumeData['metadata']>) => void;
  reorderSections: (orderedIds: string[]) => void;

  // Sections
  updateSection: (
    sectionKey: keyof ResumeData['sections'],
    data: Partial<ResumeData['sections'][keyof ResumeData['sections']]>,
  ) => void;

  // Items (Generic Handlers for arrays)
  addItem: (sectionKey: keyof ResumeData['sections'], item: any) => void;
  updateItem: (sectionKey: keyof ResumeData['sections'], id: string, data: any) => void;
  deleteItem: (sectionKey: keyof ResumeData['sections'], id: string) => void;

  // Specific Helpers for Component Compatibility
  addEducation: () => void;
  updateEducation: (id: string, item: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;

  addExperience: () => void;
  updateExperience: (id: string, item: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;

  addProject: () => void;
  updateProject: (id: string, item: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;

  addSkill: () => void;
  updateSkill: (id: string, item: Partial<SkillItem>) => void;
  deleteSkill: (id: string) => void;

  addProfile: () => void;
  updateProfile: (id: string, item: Partial<ProfileItem>) => void;
  deleteProfile: (id: string) => void;

  // Helper for quick profile updates from Personal Info Form
  updateProfileByNetwork: (network: string, username: string) => void;

  // Custom Sections
  addCustomSection: (title: string) => string;
  updateCustomSection: (id: string, data: any) => void;
  deleteCustomSection: (id: string) => void;

  // Save Status
  isSaving: boolean;
  isSavingInProgress: boolean;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  lastSaved: Date | null;
  lastSavedData: string;
  autoSaveTimer: any;
  setIsSaving: (isSaving: boolean) => void;
  setIsSavingInProgress: (isSaving: boolean) => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'success' | 'error') => void;
  setLastSaved: (lastSaved: Date | null) => void;
  setLastSavedData: (data: string) => void;

  saveResume: (userId?: string) => Promise<void>;
  startAutoSave: (userId?: string) => void;
  stopAutoSave: () => void;
  resetResume: () => void;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resumeData: {
    ...defaultResumeData,
    basics: {
      ...defaultResumeData.basics,
      countryCode: localStorage.getItem('rf_user_country_code') || 'US',
    },
  },
  isSaving: false,
  isSavingInProgress: false,
  saveStatus: 'idle',
  lastSaved: null,
  lastSavedData: '',
  autoSaveTimer: null,

  setIsSaving: (isSaving) => set({ isSaving }),
  setIsSavingInProgress: (isSavingInProgress) => set({ isSavingInProgress }),
  setSaveStatus: (saveStatus) => set({ saveStatus }),
  setLastSaved: (lastSaved) => set({ lastSaved }),
  setLastSavedData: (lastSavedData) => set({ lastSavedData }),

  setResumeData: (data) => set({ resumeData: sanitizeResumeData(data) }),

  setResumeName: (name) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        name,
      },
    })),

  saveResume: async (userId) => {
    const state = get();
    // If already in progress, don't start another but ensure UI reflects it
    if (state.isSavingInProgress) {
      set({ isSaving: true });
      return;
    }

    const currentResumeData = state.resumeData;
    const currentDataString = JSON.stringify(currentResumeData);
    const finalUserId = userId || useAuthStore.getState().user?.id;

    set({ isSaving: true, isSavingInProgress: true, saveStatus: 'saving' });

    try {
      if (finalUserId) {
        let finalName = currentResumeData.name;

        if (!currentResumeData.id) {
          const baseName =
            currentResumeData.name && currentResumeData.name !== 'Untitled Resume'
              ? currentResumeData.name
              : currentResumeData.basics.name || 'Untitled Resume';

          const { data: existingResumes } = await supabase
            .from('resumes')
            .select('name')
            .eq('user_id', finalUserId);

          const existingNames = existingResumes?.map((r) => r.name) || [];

          finalName = baseName;
          if (existingNames.includes(baseName)) {
            let counter = 1;
            while (existingNames.includes(`${baseName} ${counter}`)) {
              counter++;
            }
            finalName = `${baseName} ${counter}`;
          }
        }

        const upsertData: any = {
          user_id: finalUserId,
          name: finalName || 'Untitled Resume',
          data: { ...currentResumeData, name: finalName },
          updated_at: new Date().toISOString(),
        };

        if (currentResumeData.id) {
          upsertData.id = currentResumeData.id;
        }

        const { data, error } = await supabase
          .from('resumes')
          .upsert(upsertData)
          .select('id, name')
          .single();

        if (error) throw error;

        if (data) {
          const updatedResume = { ...currentResumeData, id: data.id, name: data.name };
          set({
            resumeData: updatedResume,
            lastSavedData: JSON.stringify(updatedResume),
          });
        }
      } else {
        sessionStorage.setItem('rf-anonymous-resume', currentDataString);
        set({ lastSavedData: currentDataString });
      }

      set({ lastSaved: new Date(), saveStatus: 'success' });
    } catch (error) {
      console.error('Error saving:', error);
      set({ saveStatus: 'error' });
    } finally {
      set({ isSavingInProgress: false });
      // Keep saveStatus for 1 second as requested
      setTimeout(() => {
        set({ isSaving: false, saveStatus: 'idle' });
      }, 1000);

      // Reschedule the next autosave check
      get().startAutoSave(finalUserId);
    }
  },

  startAutoSave: (userId) => {
    const { stopAutoSave, saveResume } = get();
    stopAutoSave();

    const timer = setTimeout(async () => {
      const state = get();
      const currentDataString = JSON.stringify(state.resumeData);

      if (currentDataString !== state.lastSavedData) {
        console.log('Autosaving...');
        await saveResume(userId);
      } else {
        // No changes, just schedule the next check
        get().startAutoSave(userId);
      }
    }, 30000);

    set({ autoSaveTimer: timer });
  },

  stopAutoSave: () => {
    const { autoSaveTimer } = get();
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    set({ autoSaveTimer: null });
  },

  loadResume: async (id) => {
    try {
      const { data, error } = await supabase.from('resumes').select('*').eq('id', id).single();

      if (error) throw error;

      if (data) {
        const row = data as unknown as ResumeRow;
        const loadedData = sanitizeResumeData({
          ...row.data,
          id: row.id,
          name: row.name,
        });
        set({
          resumeData: loadedData,
          lastSavedData: JSON.stringify(loadedData),
        });
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      throw error;
    }
  },

  updateBasics: (data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        basics: { ...state.resumeData.basics, ...data },
      },
    })),

  updatePicture: (data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        picture: { ...state.resumeData.picture, ...data },
      },
    })),

  updateSummary: (data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        summary: { ...state.resumeData.summary, ...data },
      },
    })),

  updateMetadata: (metadata) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        metadata: { ...state.resumeData.metadata, ...metadata },
      },
    })),

  reorderSections: (orderedIds) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        metadata: { ...state.resumeData.metadata, sectionOrder: orderedIds },
      },
    })),

  updateSection: (sectionKey, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        sections: {
          ...state.resumeData.sections,
          [sectionKey]: { ...state.resumeData.sections[sectionKey], ...data },
        },
      },
    })),

  addItem: (sectionKey, item) =>
    set((state) => {
      const section = state.resumeData.sections[sectionKey];
      return {
        resumeData: {
          ...state.resumeData,
          sections: {
            ...state.resumeData.sections,
            [sectionKey]: {
              ...section,
              items: [...section.items, { id: uuidv4(), visible: true, ...item }],
            },
          },
        },
      };
    }),

  updateItem: (sectionKey, id, data) =>
    set((state) => {
      const section = state.resumeData.sections[sectionKey];
      return {
        resumeData: {
          ...state.resumeData,
          sections: {
            ...state.resumeData.sections,
            [sectionKey]: {
              ...section,
              items: section.items.map((item: any) =>
                item.id === id ? { ...item, ...data } : item,
              ),
            },
          },
        },
      };
    }),

  deleteItem: (sectionKey, id) =>
    set((state) => {
      const section = state.resumeData.sections[sectionKey];
      return {
        resumeData: {
          ...state.resumeData,
          sections: {
            ...state.resumeData.sections,
            [sectionKey]: {
              ...section,
              items: section.items.filter((item: any) => item.id !== id),
            },
          },
        },
      };
    }),

  // Helpers
  addEducation: () =>
    get().addItem('education', {
      school: '',
      degree: '',
      area: '',
      grade: '',
      location: '',
      period: '',
      website: { label: '', href: '' },
      description: '',
    }),
  updateEducation: (id, item) => get().updateItem('education', id, item),
  deleteEducation: (id) => get().deleteItem('education', id),

  addExperience: () =>
    get().addItem('experience', {
      company: '',
      position: '',
      location: '',
      period: '',
      website: { label: '', href: '' },
      description: '',
      roles: [],
    }),
  updateExperience: (id, item) => get().updateItem('experience', id, item),
  deleteExperience: (id) => get().deleteItem('experience', id),

  addProject: () =>
    get().addItem('projects', {
      name: '',
      description: '',
      period: '',
      website: { label: '', href: '' },
      keywords: [],
    }),
  updateProject: (id, item) => get().updateItem('projects', id, item),
  deleteProject: (id) => get().deleteItem('projects', id),

  addSkill: () => get().addItem('skills', { name: '', description: '', level: 0, keywords: [] }),
  updateSkill: (id, item) => get().updateItem('skills', id, item),
  deleteSkill: (id) => get().deleteItem('skills', id),

  addProfile: () =>
    get().addItem('profiles', {
      network: '',
      username: '',
      icon: '',
      website: { label: '', href: '' },
    }),
  updateProfile: (id, item) => get().updateItem('profiles', id, item),
  deleteProfile: (id) => get().deleteItem('profiles', id),

  updateProfileByNetwork: (network: string, input: string) => {
    const state = get();
    const profiles = state.resumeData.sections.profiles.items;
    const existing = profiles.find((p) => p.network.toLowerCase() === network.toLowerCase());

    if (!input) {
      if (existing) {
        state.deleteItem('profiles', existing.id);
      }
      return;
    }

    // Determine if input is a URL or just a username
    let href = input;

    if (!input.startsWith('http') && !input.includes('.com')) {
      // It's likely just a username
      const cleanUsername = input.replace(/^@/, '');
      href = `https://${network.toLowerCase()}.com/${cleanUsername}`;
    } else {
      // It's a URL, let's try to extract a clean href
      try {
        const url = new URL(input.startsWith('http') ? input : `https://${input}`);
        href = url.href;
      } catch (e) {
        // Fallback
        href = input.startsWith('http') ? input : `https://${input}`;
      }
    }

    if (existing) {
      state.updateItem('profiles', existing.id, {
        username: input, // Store raw input to keep typing smooth
        website: { ...existing.website, href },
      });
    } else {
      state.addItem('profiles', {
        network,
        username: input, // Store raw input
        icon: network.toLowerCase(),
        website: { label: '', href },
      });
    }
  },

  addCustomSection: (title) => {
    const newId = uuidv4();
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: [
          ...state.resumeData.customSections,
          {
            id: newId,
            name: title,
            visible: true,
            columns: 1,
            separate: false,
            items: [],
          },
        ],
      },
    }));
    return newId;
  },

  updateCustomSection: (id, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: state.resumeData.customSections.map((section) =>
          section.id === id ? { ...section, ...data } : section,
        ),
      },
    })),

  deleteCustomSection: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: state.resumeData.customSections.filter((section) => section.id !== id),
      },
    })),

  resetResume: () =>
    set({
      resumeData: {
        ...defaultResumeData,
        basics: {
          ...defaultResumeData.basics,
          countryCode: localStorage.getItem('rf_user_country_code') || 'US',
        },
      },
    }),
}));
