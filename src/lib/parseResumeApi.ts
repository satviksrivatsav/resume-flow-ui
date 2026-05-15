import { config } from '@/config/config';
import { defaultResumeData, ResumeData } from '@/types/resume';

const API_BASE_URL = config.aiApiUrl;

export interface ParseResponse {
  success: boolean;
  data?: Partial<ResumeData>;
  error?: string;
}

export async function parseResume(file: File, signal?: AbortSignal): Promise<ResumeData> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/resume/parse`, {
    method: 'POST',
    body: formData,
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to parse resume (HTTP ${response.status})`);
  }

  const result: ParseResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Unknown error parsing resume');
  }

  // Merge parsed data with defaults to ensure all required fields exist
  const mergedData: ResumeData = {
    ...defaultResumeData,
    ...result.data,
    basics: {
      ...defaultResumeData.basics,
      ...(result.data.basics || {}),
    },
    sections: {
      ...defaultResumeData.sections,
      ...(result.data.sections || {}),
    },
    metadata: {
      ...defaultResumeData.metadata,
      ...(result.data.metadata || {}),
    },
  };

  // Ensure all items have unique IDs, especially replacing the placeholder '4f4e4f4e-4f4e-4f4e-4f4e-4f4e4f4e4f4e'
  const PLACEHOLDER_ID = '4f4e4f4e-4f4e-4f4e-4f4e-4f4e4f4e4f4e';
  const ensureUniqueIds = (items: any[]) => {
    if (!items) return [];
    return items.map((item) => ({
      ...item,
      id: !item.id || item.id === PLACEHOLDER_ID ? crypto.randomUUID() : item.id,
      // Handle nested roles in experience
      roles: item.roles ? ensureUniqueIds(item.roles) : undefined,
    }));
  };

  const finalData: ResumeData = {
    ...mergedData,
    sections: {
      ...mergedData.sections,
      experience: {
        ...mergedData.sections.experience,
        items: ensureUniqueIds(mergedData.sections.experience.items),
      },
      education: {
        ...mergedData.sections.education,
        items: ensureUniqueIds(mergedData.sections.education.items),
      },
      projects: {
        ...mergedData.sections.projects,
        items: ensureUniqueIds(mergedData.sections.projects.items),
      },
      skills: {
        ...mergedData.sections.skills,
        items: ensureUniqueIds(mergedData.sections.skills.items),
      },
      profiles: {
        ...mergedData.sections.profiles,
        items: ensureUniqueIds(mergedData.sections.profiles.items),
      },
      languages: {
        ...mergedData.sections.languages,
        items: ensureUniqueIds(mergedData.sections.languages.items),
      },
      interests: {
        ...mergedData.sections.interests,
        items: ensureUniqueIds(mergedData.sections.interests.items),
      },
      awards: {
        ...mergedData.sections.awards,
        items: ensureUniqueIds(mergedData.sections.awards.items),
      },
      certifications: {
        ...mergedData.sections.certifications,
        items: ensureUniqueIds(mergedData.sections.certifications.items),
      },
      publications: {
        ...mergedData.sections.publications,
        items: ensureUniqueIds(mergedData.sections.publications.items),
      },
      volunteer: {
        ...mergedData.sections.volunteer,
        items: ensureUniqueIds(mergedData.sections.volunteer.items),
      },
      references: {
        ...mergedData.sections.references,
        items: ensureUniqueIds(mergedData.sections.references.items),
      },
    },
  };

  console.log('[Parser] Merged resume data with unique IDs:', finalData);

  return finalData;
}
