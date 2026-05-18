import 'react-quill-new/dist/quill.snow.css';
import '@/resume/components/quill-custom.css';

import { Bold, Italic, List, ListOrdered, Strikethrough, Type, Underline } from 'lucide-react';
import * as React from 'react';
import ReactQuill, { Quill } from 'react-quill-new';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const ToolbarButton = ({
  className,
  tooltip,
  children,
  value,
  delayDuration = 400,
  disabled,
}: {
  className: string;
  tooltip: string;
  children: React.ReactNode;
  value?: string;
  delayDuration?: number;
  disabled?: boolean;
}) => (
  <TooltipProvider delayDuration={delayDuration}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            'custom-toolbar-button transition-colors hover:bg-muted p-1 rounded-md',
            className,
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          value={value}
          disabled={disabled}
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
  value,
  onChange,
  placeholder,
  className,
  disabled,
}: RichTextEditorProps) => {
  const editorId = React.useId().replace(/:/g, '');
  const toolbarId = `toolbar-${editorId}`;

  const modules = React.useMemo(
    () => ({
      toolbar: {
        container: `#${toolbarId}`,
      },
    }),
    [toolbarId],
  );

  // 'list' is the format name, 'bullet' and 'ordered' are attributes
  const formats = ['bold', 'italic', 'underline', 'strike', 'list'];

  return (
    <div
      className={cn(
        'rich-text-editor-container bg-background rounded-2xl border border-input overflow-hidden transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background shadow-sm font-normal',
        disabled && 'opacity-50 cursor-not-allowed select-none',
        className,
      )}
    >
      <div
        id={toolbarId}
        className={cn(
          'flex items-center gap-0.5 px-2 py-1.5 border-b border-input bg-muted/20',
          disabled && 'pointer-events-none',
        )}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-0.5">
          <ToolbarButton className="ql-bold" tooltip="Bold" disabled={disabled}>
            <Bold className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton className="ql-italic" tooltip="Italic" disabled={disabled}>
            <Italic className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton className="ql-underline" tooltip="Underline" disabled={disabled}>
            <Underline className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton className="ql-strike" tooltip="Strikethrough" disabled={disabled}>
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-4 bg-border mx-1.5" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            className="ql-list"
            tooltip="Bullet List"
            value="bullet"
            disabled={disabled}
          >
            <List className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            className="ql-list"
            tooltip="Numbered List"
            value="ordered"
            disabled={disabled}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-4 bg-border mx-1.5" />

        <ToolbarButton className="ql-clean" tooltip="Clear Formatting" disabled={disabled}>
          <Type className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
      />
    </div>
  );
};
