import '@/resume/components/quill-custom.css';

import Placeholder from '@tiptap/extension-placeholder';
import UnderlineExtension from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Strikethrough, Type, Underline } from 'lucide-react';
import * as React from 'react';

import { AIWriterButton } from '@/shared/components/ui/AIWriterButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAIWriter?: boolean;
  aiFieldName?: string;
  aiFieldValue?: string;
  onAiUpdate?: (newText: string) => void;
}

const ToolbarButton = ({
  tooltip,
  children,
  delayDuration = 400,
  disabled,
  isActive,
  onMouseDown,
}: {
  tooltip: string;
  children: React.ReactNode;
  delayDuration?: number;
  disabled?: boolean;
  isActive?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}) => (
  <TooltipProvider delayDuration={delayDuration}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            'custom-toolbar-button transition-colors hover:bg-muted p-1 rounded-md',
            isActive && 'ql-active',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          disabled={disabled}
          onMouseDown={onMouseDown}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="text-[10px] font-bold tracking-wider uppercase py-1 px-2"
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const RichTextEditor = ({
  id,
  value,
  onChange,
  placeholder,
  className,
  disabled,
  showAIWriter = false,
  aiFieldName,
  aiFieldValue,
  onAiUpdate,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
      }),
      UnderlineExtension,
      Placeholder.configure({
        placeholder: placeholder || '',
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Handle empty content state
      const isEmpty = html === '<p></p>' || html === '';
      onChange(isEmpty ? '' : html);
    },
  });

  // Keep content in sync when value changes externally
  React.useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    if (value !== currentHtml) {
      const isInputEmpty = !value || value === '<p></p>';
      const isEditorEmpty = !currentHtml || currentHtml === '<p></p>';
      if (isInputEmpty && isEditorEmpty) return;

      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Keep editable state in sync
  React.useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          'rich-text-editor-container bg-background rounded-2xl border border-input overflow-hidden transition-all duration-200 shadow-sm font-normal opacity-50',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-0.5 px-2 py-1.5 border-b border-input bg-muted/20">
          <div className="flex items-center gap-0.5">
            <Bold className="w-3.5 h-3.5 opacity-50 m-1.5" />
            <Italic className="w-3.5 h-3.5 opacity-50 m-1.5" />
            <Underline className="w-3.5 h-3.5 opacity-50 m-1.5" />
            <Strikethrough className="w-3.5 h-3.5 opacity-50 m-1.5" />
            <div className="w-[1px] h-4 bg-border mx-1.5" />
            <List className="w-3.5 h-3.5 opacity-50 m-1.5" />
            <ListOrdered className="w-3.5 h-3.5 opacity-50 m-1.5" />
          </div>
        </div>
        <div className="min-h-[120px]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rich-text-editor-container bg-background rounded-2xl border border-input overflow-hidden transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background shadow-sm font-normal',
        disabled && 'opacity-50 cursor-not-allowed select-none',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-0.5 px-2 py-1.5 border-b border-input bg-muted/20',
          disabled && 'pointer-events-none',
        )}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-0.5">
          <div className="flex items-center gap-0.5">
            <ToolbarButton
              tooltip="Bold"
              disabled={disabled}
              isActive={editor.isActive('bold')}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBold().run();
              }}
            >
              <Bold className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              tooltip="Italic"
              disabled={disabled}
              isActive={editor.isActive('italic')}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleItalic().run();
              }}
            >
              <Italic className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              tooltip="Underline"
              disabled={disabled}
              isActive={editor.isActive('underline')}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleUnderline().run();
              }}
            >
              <Underline className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              tooltip="Strikethrough"
              disabled={disabled}
              isActive={editor.isActive('strike')}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleStrike().run();
              }}
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </ToolbarButton>
          </div>

          <div className="w-[1px] h-4 bg-border mx-1.5" />

          <div className="flex items-center gap-0.5">
            <ToolbarButton
              tooltip="Bullet List"
              disabled={disabled}
              isActive={editor.isActive('bulletList')}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBulletList().run();
              }}
            >
              <List className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              tooltip="Numbered List"
              disabled={disabled}
              isActive={editor.isActive('orderedList')}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleOrderedList().run();
              }}
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </ToolbarButton>
          </div>

          <div className="w-[1px] h-4 bg-border mx-1.5" />

          <ToolbarButton
            tooltip="Clear Formatting"
            disabled={disabled}
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().clearNodes().unsetAllMarks().run();
            }}
          >
            <Type className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>

        {showAIWriter && aiFieldName && onAiUpdate && (
          <div className="ml-auto flex items-center pr-1 select-none pointer-events-auto shrink-0">
            <AIWriterButton
              fieldName={aiFieldName}
              fieldLabel=""
              fieldValue={aiFieldValue ?? value}
              onUpdate={onAiUpdate}
            />
          </div>
        )}
      </div>

      <EditorContent editor={editor} id={id} />
    </div>
  );
};
