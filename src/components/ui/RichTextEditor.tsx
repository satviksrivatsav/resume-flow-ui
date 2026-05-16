import * as React from 'react';
import ReactQuill from 'react-quill';
import { Bold, Italic, List, ListOrdered, Strikethrough, Underline, Type } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';
import '../resume/quill-custom.css';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ToolbarButton = ({ 
  className, 
  tooltip, 
  children,
  value,
  delayDuration = 400
}: { 
  className: string; 
  tooltip: string; 
  children: React.ReactNode;
  value?: string;
  delayDuration?: number;
}) => (
  <TooltipProvider delayDuration={delayDuration}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button className={cn("custom-toolbar-button transition-colors hover:bg-muted p-1 rounded-md", className)} value={value}>

          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[10px] font-bold tracking-wider uppercase py-1 px-2">
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
}: RichTextEditorProps) => {
  const editorId = React.useId().replace(/:/g, '');
  const toolbarId = `toolbar-${editorId}`;

  const modules = React.useMemo(() => ({
    toolbar: {
      container: `#${toolbarId}`,
    },
  }), [toolbarId]);

  const formats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
  ];

  return (
    <div className={cn(
      "rich-text-editor-container bg-background rounded-2xl border border-input overflow-hidden transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background shadow-sm font-normal",
      className
    )}>

      <div 
        id={toolbarId} 
        className="flex items-center gap-0.5 px-2 py-1.5 border-b border-input bg-muted/20"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center gap-0.5">
          <ToolbarButton className="ql-bold" tooltip="Bold">
            <Bold className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton className="ql-italic" tooltip="Italic">
            <Italic className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton className="ql-underline" tooltip="Underline">
            <Underline className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton className="ql-strike" tooltip="Strikethrough">
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>
        
        <div className="w-[1px] h-4 bg-border mx-1.5" />
        
        <div className="flex items-center gap-0.5">
          <ToolbarButton className="ql-list" tooltip="Bullet List" value="bullet">
            <List className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton className="ql-list" tooltip="Numbered List" value="ordered">
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-4 bg-border mx-1.5" />

        <ToolbarButton className="ql-clean" tooltip="Clear Formatting">
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
      />
    </div>
  );
};
