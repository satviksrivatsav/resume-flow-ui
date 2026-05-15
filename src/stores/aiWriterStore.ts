import { create } from 'zustand';

import { AIFieldRequest, processField } from '@/lib/ai';

interface AIWriterState {
  // State
  isLoading: boolean;
  currentField: string | null;
  currentAction: 'REWRITE' | 'GENERATE' | null;
  originalText: string;
  newText: string | null;
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
}

const initialState = {
  isLoading: false,
  currentField: null,
  currentAction: null,
  originalText: '',
  newText: null,
  error: null,
  showInstructionModal: false,
  showReviewModal: false,
  onAccept: null,
  _abortController: null,
};

export const useAIWriterStore = create<AIWriterState>((set, get) => ({
  ...initialState,

  openInstructionModal: (field, action, text, onAccept) => {
    console.log('📝 Opening Instruction Modal', { field, action });
    set({
      currentField: field,
      currentAction: action,
      originalText: text,
      showInstructionModal: true,
      showReviewModal: false,
      newText: null,
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
      console.log('🚫 Cancelling in-flight AI request');
      _abortController.abort();
    }
    set({ ...initialState });
  },

  submitAIRequest: async (params) => {
    const { currentField, currentAction, originalText } = get();
    if (!currentField || !currentAction) return;

    console.log('\n========== AI WRITER REQUEST ==========');
    console.log('Field:', currentField);
    console.log('Action:', currentAction);
    console.log('Original Text:', originalText);
    console.log('Params:', params);

    // Create a fresh AbortController for this request
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏱️ AI request timed out');
      abortController.abort(new Error('TimeoutError'));
    }, 20000);

    // Close instruction modal, show review modal with loading
    set({
      showInstructionModal: false,
      showReviewModal: true,
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
      };

      console.log('\n>>> SENDING TO API:');
      console.log(JSON.stringify(request, null, 2));

      const response = await processField(request, abortController.signal);

      clearTimeout(timeoutId);

      console.log('\n<<< API RESPONSE:');
      console.log(JSON.stringify(response, null, 2));
      console.log('========================================\n');

      set({
        newText: response.newText,
        isLoading: false,
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
          _abortController: null,
        });
        return;
      }

      // Aborts are intentional — just close silently, don't surface an error
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🚫 Request aborted by user');
        // cancelRequest already reset the state, nothing more to do
        return;
      }

      const message = error instanceof Error ? error.message : 'Failed to process request';
      console.error('\n!!! API ERROR:', message);
      console.log('========================================\n');

      set({
        error: message,
        isLoading: false,
        _abortController: null,
      });
    }
  },

  acceptChanges: () => {
    const { newText, onAccept } = get();
    console.log('✅ Accepting changes');
    if (newText && onAccept) {
      onAccept(newText);
    }
    set({ ...initialState });
  },

  discardChanges: () => {
    console.log('❌ Discarding changes');
    set({ ...initialState });
  },
}));
