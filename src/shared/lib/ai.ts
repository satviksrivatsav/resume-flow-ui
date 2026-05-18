import { config } from '@/shared/config/config';

const API_BASE_URL = config.aiApiUrl;

export interface AIFieldRequest {
  action: 'REWRITE' | 'GENERATE';
  fieldName: string;
  originalText?: string;
  instruction?: string;
  tone?: 'professional' | 'casual' | 'confident' | 'friendly';
  format?: 'bullets' | 'paragraph';
  fullResumeData?: any;
}


export interface AIFieldResponse {
  id: string;
  newText: string;
  meta: {
    processingTimeMs: number;
    action: string;
    fieldName: string;
  };
}

export async function processField(
  request: AIFieldRequest,
  signal?: AbortSignal,
): Promise<AIFieldResponse> {
  const response = await fetch(`${API_BASE_URL}/resume/field`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail ||
        errorData.message ||
        errorData.error ||
        `AI request failed: ${response.status}`,
    );
  }

  const result = await response.json();
  return result.data;
}
