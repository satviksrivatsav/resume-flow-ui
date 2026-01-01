Resume Flow AI - Backend API Blueprint (v1.0)
Version: 1.0.0 Base URL: http://localhost:3000/api/v1 Protocol: REST (JSON)

This blueprint defines the contract for the "Resume Intelligence" service. It is designed for modularity, allowing partial updates to resume sections to minimize token usage.

1. Authentication & Security
Header: Authorization: Bearer <JWT_TOKEN> (Required for Production)
Rate Limiting:
Header: X-RateLimit-Limit: 20 (Requests per minute)
Response (429): Retry-After: 30 (Seconds)
2. Core Endpoint: Process AI Request
URL: POST /ai/process Description: The single entry point for all AI operations. It routes the request exclusively to the appropriate logic (Rewrite, Summarize, Chat) based on the action field.

2.1 Request Schema (JSON)
interface AIRequestPayload {
  /** 
   * The intent of the user. 
   * 'CHAT': General Q&A 
   * 'REWRITE': specific improvement of text 
   * 'SUMMARIZE': Generate a summary based on full data 
   * 'FIX_GRAMMAR': Grammar correction only
   */
  action: 'CHAT' | 'REWRITE' | 'SUMMARIZE' | 'FIX_GRAMMAR';
  /** 
   * The conversational history (for context). 
   * Limit to last 10 messages to save tokens.
   */
  history?: Array<{
    role: 'user' | 'ai' | 'system';
    content: string;
  }>;
  /** 
   * The prompt from the user (e.g., "Make this sound more professional") 
   */
  userInstruction?: string;
  /** 
   * The Data Context. 
   * CRITICAL: Send ONLY the data required for the operation.
   */
  context: {
    /** 
     * Target section name (matches ResumeData keys) 
     * e.g., 'workExperience', 'education', 'personalInfo'
     */
    targetSection?: string;
    /** 
     * The specific ID of the item being modified.
     * If present, AI knows to focus ONLY on this item.
     * e.g., 'b8d9-s8d9-a7d9'
     */
    targetId?: string;
    /**
     * The actual data sub-set.
     * If targetId is set, this should be the single object.
     * If not, it could be the array or full resume.
     */
    data: any; 
  };
}
2.2 Response Schema (JSON)
interface AIResponsePayload {
  /** 
   * Unique Request ID for tracing 
   */
  id: string;
  /** 
   * Conversational response from the AI.
   * "I have rephrased your experience..."
   */
  message: string;
  /** 
   * Structured updates to be applied to the Frontend Store.
   * If null, no changes are made (pure chat).
   */
  suggestedUpdates?: {
    [sectionName: string]: Array<{
      id: string; // The ID of the item to update
      [field: string]: any; // The fields to patch (e.g., { description: "..." })
    }>;
  };
  /** 
   * Operational Metadata 
   */
  meta: {
    tokensUsed?: number;
    processingTimeMs: number;
    model: string;
  };
}
3. Detailed Logic & Scenarios
Scenario A: Rewriting a Single Job Description
Payload:

{
  "action": "REWRITE",
  "userInstruction": "Make it punchier",
  "context": {
    "targetSection": "workExperience",
    "targetId": "exp_123",
    "data": { 
      "id": "exp_123", 
      "company": "Google", 
      "role": "Intern", 
      "description": "I did some coding." 
    }
  }
}
Expected Behavior:

Backend constructs prompt: "Rewrite the 'description' field for the role 'Intern' at 'Google'. Instruction: Make it punchier."
Backend receives JSON from LLM.
Response:
{
  "message": "Here is a punchier version highlighting your contributions.",
  "suggestedUpdates": {
    "workExperience": [
      { 
        "id": "exp_123", 
        "description": "Engineered scalable solutions..." 
      }
    ]
  }
}
Scenario B: Generate Summary (Full Context)
Payload:

{
  "action": "SUMMARIZE",
  "context": {
    "targetSection": "personalInfo",
    "data": { "workExperience": [...], "skills": [...] } // Sends Work+Skills to inform summary
  }
}
Expected Behavior:

Backend analyzes Work History and Skills.
Backend generates a roughly 3-sentence professional summary.
Response:
{
  "suggestedUpdates": {
    "personalInfo": { "summary": "Full stack developer with 5 years experience..." }
  }
}
4. Error Handling Standards
HTTP Code	Error Code	Description
400	INVALID_SCHEMA	Context data missing or malformed JSON.
400	MISSING_CONTEXT	Action 'REWRITE' requires context.data.
401	UNAUTHORIZED	Invalid or missing Bearer token.
429	RATE_LIMIT	User exceeded 20 requests/minute.
500	PROVIDER_ERROR	Upstream LLM (Gemini/OpenAI) failed.
5. Middleware Requirements (Backend Agent Note)
The backend agent must implement a Prompt Engineer Layer:

System Prompt: You are a Resume Expert. You must output responses in strict JSON format matching the suggestedUpdates structure.
Sanitization: Ensure the LLM does not hallucinate IDs. The returned id MUST match the input id.