import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  ResumeData,
  defaultResumeData,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillItem,
  ProfileItem,
} from '@/types/resume';

interface ResumeStore {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;

  // Basics
  updateBasics: (data: Partial<ResumeData['basics']>) => void;
  updatePicture: (data: Partial<ResumeData['picture']>) => void;

  // Summary
  updateSummary: (data: Partial<ResumeData['summary']>) => void;

  // Metadata
  updateMetadata: (metadata: Partial<ResumeData['metadata']>) => void;

  // Sections
  updateSection: (sectionKey: keyof ResumeData['sections'], data: Partial<ResumeData['sections'][keyof ResumeData['sections']]>) => void;

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

  resetResume: () => void;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resumeData: defaultResumeData,

  setResumeData: (data) => set({ resumeData: data }),

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
                item.id === id ? { ...item, ...data } : item
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
  addEducation: () => get().addItem('education', { school: '', degree: '', area: '', grade: '', location: '', period: '', website: { label: '', href: '' }, description: '' }),
  updateEducation: (id, item) => get().updateItem('education', id, item),
  deleteEducation: (id) => get().deleteItem('education', id),

  addExperience: () => get().addItem('experience', { company: '', position: '', location: '', period: '', website: { label: '', href: '' }, description: '', roles: [] }),
  updateExperience: (id, item) => get().updateItem('experience', id, item),
  deleteExperience: (id) => get().deleteItem('experience', id),

  addProject: () => get().addItem('projects', { name: '', description: '', period: '', website: { label: '', href: '' }, keywords: [] }),
  updateProject: (id, item) => get().updateItem('projects', id, item),
  deleteProject: (id) => get().deleteItem('projects', id),

  addSkill: () => get().addItem('skills', { name: '', description: '', level: 0, keywords: [] }),
  updateSkill: (id, item) => get().updateItem('skills', id, item),
  deleteSkill: (id) => get().deleteItem('skills', id),

  addProfile: () => get().addItem('profiles', { network: '', username: '', icon: '', website: { label: '', href: '' } }),
  updateProfile: (id, item) => get().updateItem('profiles', id, item),
  deleteProfile: (id) => get().deleteItem('profiles', id),

  updateProfileByNetwork: (network: string, username: string) => {
    const state = get();
    const profiles = state.resumeData.sections.profiles.items;
    const existing = profiles.find((p) => p.network.toLowerCase() === network.toLowerCase());

    if (existing) {
      if (!username) {
        state.deleteItem('profiles', existing.id);
      } else {
        state.updateItem('profiles', existing.id, { username, website: { ...existing.website, href: `https://${network.toLowerCase()}.com/${username.replace(/^@/, '')}` } });
      }
    } else if (username) {
      state.addItem('profiles', { 
          network, 
          username, 
          icon: network.toLowerCase(), 
          website: { label: '', href: `https://${network.toLowerCase()}.com/${username.replace(/^@/, '')}` } 
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
          section.id === id ? { ...section, ...data } : section
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

  resetResume: () => set({ resumeData: defaultResumeData }),
}));
