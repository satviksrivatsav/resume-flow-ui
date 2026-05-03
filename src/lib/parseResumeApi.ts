import { ResumeData, defaultResumeData } from '@/types/resume';
import { config } from '@/config/config';

const PARSER_API_URL = config.parserApiUrl;


export interface ParseResponse {
    success: boolean;
    data?: Partial<ResumeData>;
    error?: string;
}

export async function parseResumeFromPdf(file: File, signal?: AbortSignal): Promise<ResumeData> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${PARSER_API_URL}/api/v1/resume/parse`, {
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
        personalInfo: {
            ...defaultResumeData.personalInfo,
            ...(result.data.personalInfo || {}),
        },
        education: result.data.education || [],
        workExperience: result.data.workExperience || [],
        projects: result.data.projects || [],
        skills: result.data.skills || [],
        customSections: result.data.customSections || [],
        settings: {
            ...defaultResumeData.settings,
            ...(result.data.settings || {}),
        },
    };

    console.log('[Parser] Merged resume data:', mergedData);

    return mergedData;
}
