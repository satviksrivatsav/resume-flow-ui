import { config } from '@/shared/config/config';
import { AtsReport } from '@/shared/types/ats';
import { ResumeData } from '@/shared/types/resume';

const API_BASE_URL = config.aiApiUrl;

export async function analyzeResumeAts(
  file: File,
  jdText?: string,
  signal?: AbortSignal,
): Promise<{ parsed_resume: ResumeData; ats_report: AtsReport }> {
  const formData = new FormData();
  formData.append('file', file);
  if (jdText) {
    formData.append('job_description', jdText);
  }

  const response = await fetch(`${API_BASE_URL}/resume/ats`, {
    method: 'POST',
    body: formData,
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || 'ATS analysis failed');
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Unknown error during ATS analysis');
  }

  return result.data;
}

export async function analyzeResumeJsonAts(
  resumeData: ResumeData,
  jdText?: string,
  signal?: AbortSignal,
): Promise<{ parsed_resume: ResumeData; ats_report: AtsReport }> {
  const response = await fetch(`${API_BASE_URL}/resume/ats/json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume_data: resumeData,
      job_description: jdText,
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || 'ATS analysis failed');
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Unknown error during ATS analysis');
  }

  return result.data;
}

export async function extractTextFromFile(file: File, signal?: AbortSignal): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/resume/extract-text`, {
    method: 'POST',
    body: formData,
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || 'Failed to extract text from file');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Unknown error during text extraction');
  }

  return result.data;
}
