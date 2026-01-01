import { create } from 'zustand';
import { processField, AIFieldRequest } from '@/lib/ai';

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

    // Callback to update the actual field
    onAccept: ((newText: string) => void) | null;

    // Actions
    openInstructionModal: (
        field: string,
        action: 'REWRITE' | 'GENERATE',
        text: string,
        onAccept: (newText: string) => void
    ) => void;
    closeInstructionModal: () => void;
    submitAIRequest: (params: { instruction?: string; tone?: string; format?: string }) => Promise<void>;
    acceptChanges: () => void;
    discardChanges: () => void;
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

    submitAIRequest: async (params) => {
        const { currentField, currentAction, originalText } = get();
        if (!currentField || !currentAction) return;

        console.log('\n========== AI WRITER REQUEST ==========');
        console.log('Field:', currentField);
        console.log('Action:', currentAction);
        console.log('Original Text:', originalText);
        console.log('Params:', params);

        // Close instruction modal, show review modal with loading
        set({
            showInstructionModal: false,
            showReviewModal: true,
            isLoading: true,
            error: null,
        });

        try {
            const request: AIFieldRequest = {
                action: currentAction,
                fieldName: currentField,
                originalText: currentAction === 'REWRITE' ? originalText : undefined,
                instruction: params.instruction,
                tone: params.tone as any,
                format: params.format as any,
            };

            console.log('\n>>> SENDING TO API:');
            console.log(JSON.stringify(request, null, 2));

            const response = await processField(request);

            console.log('\n<<< API RESPONSE:');
            console.log(JSON.stringify(response, null, 2));
            console.log('========================================\n');

            set({
                newText: response.newText,
                isLoading: false,
            });
        } catch (error: any) {
            console.error('\n!!! API ERROR:', error.message);
            console.log('========================================\n');

            set({
                error: error.message || 'Failed to process request',
                isLoading: false,
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
