import { create } from 'zustand';

import { AIFieldRequest, processField } from '@/shared/lib/ai';

interface AIWriterState {
  // State
  isLoading: boolean;
  currentField: string | null;
  currentAction: 'REWRITE' | 'GENERATE' | null;
  originalText: string;
  newText: string | null;
  fullResumeData: any;
  error: string | null;
  showInstructionModal: boolean;
  showReviewModal: boolean;

  // Internal: tracks the in-flight request so it can be aborted
  _abortController: AbortController | null;

  // Callback to update the actual field
  onAccept: ((newText: string) => void) | null;

  // Actions
  openInstructionModal: (
    field: string,
    action: 'REWRITE' | 'GENERATE',
    text: string,
    onAccept: (newText: string) => void,
    fullResumeData?: any,
  ) => void;

  closeInstructionModal: () => void;
  submitAIRequest: (params: {
    instruction?: string;
    tone?: string;
    format?: string;
  }) => Promise<void>;
  acceptChanges: () => void;
  discardChanges: () => void;
  /** Abort any in-flight request and immediately reset all state. */
  cancelRequest: () => void;
  setNewText: (text: string) => void;
}

const initialState = {
  isLoading: false,
  currentField: null,
  currentAction: null,
  originalText: '',
  newText: null,
  fullResumeData: null,
  error: null,
  showInstructionModal: false,
  showReviewModal: false,
  onAccept: null,

  _abortController: null,
};

export const useAIWriterStore = create<AIWriterState>((set, get) => ({
  ...initialState,

  openInstructionModal: (field, action, text, onAccept, fullResumeData) => {
    set({
      currentField: field,
      currentAction: action,
      originalText: text,
      showInstructionModal: true,
      showReviewModal: false,
      newText: null,
      fullResumeData: fullResumeData || null,
      error: null,
      onAccept,
    });
  },

  closeInstructionModal: () => {
    set({ ...initialState });
  },

  cancelRequest: () => {
    const { _abortController } = get();
    if (_abortController) {
      _abortController.abort();
    }
    set({ ...initialState });
  },

  submitAIRequest: async (params) => {
    const { currentField, currentAction, originalText } = get();
    if (!currentField || !currentAction) return;

    // Create a fresh AbortController for this request
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort(new Error('TimeoutError'));
    }, 20000);

    // Close instruction modal, trigger loading state
    set({
      showInstructionModal: false,
      showReviewModal: false,
      isLoading: true,
      error: null,
      _abortController: abortController,
    });

    try {
      const request: AIFieldRequest = {
        action: currentAction,
        fieldName: currentField,
        originalText: currentAction === 'REWRITE' ? originalText : undefined,
        instruction: params.instruction,
        tone: params.tone as AIFieldRequest['tone'],
        format: params.format as AIFieldRequest['format'],
        fullResumeData: get().fullResumeData,
      };

      const response = await processField(request, abortController.signal);

      clearTimeout(timeoutId);

      set({
        newText: response.newText,
        isLoading: false,
        showReviewModal: true,
        _abortController: null,
      });
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      // Handle timeout abort
      if (error instanceof Error && error.message === 'TimeoutError') {
        console.error('\n!!! API TIMEOUT: Response took longer than 20 seconds');
        set({
          error: 'The AI took too long to respond. Please try again.',
          isLoading: false,
          showReviewModal: true,
          _abortController: null,
        });

        return;
      }

      // Aborts are intentional — just close silently, don't surface an error
      if (error instanceof Error && error.name === 'AbortError') {
        // cancelRequest already reset the state, nothing more to do
        return;
      }

      const isNetworkError =
        !navigator.onLine ||
        (error instanceof TypeError && error.message.toLowerCase().includes('fetch'));

      const message = isNetworkError
        ? 'A network error occurred. Please check your connection and try again.'
        : 'Failed to process your request with AI. Please try again.';
      console.error('\n!!! API ERROR:', error);

      set({
        error: message,
        isLoading: false,
        showReviewModal: true,
        _abortController: null,
      });
    }
  },

  acceptChanges: () => {
    const { newText, onAccept } = get();
    if (newText && onAccept) {
      onAccept(newText);
    }
    set({ ...initialState });
  },

  discardChanges: () => {
    set({ ...initialState });
  },
  setNewText: (text: string) => {
    set({ newText: text });
  },
}));
