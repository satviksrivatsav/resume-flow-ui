import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrashAnimatedIcon } from "@/components/ui/TrashAnimatedIcon";
import { motion } from "framer-motion";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-custom.css';
import { FieldTip } from "@/components/ui/FieldTip";
import { AIWriterButton } from "@/components/ui/AIWriterButton";
import { useUiStore } from "@/stores/uiStore";

export const AdditionalSectionForm = () => {
  const { resumeData, updateAdditionalSection, deleteAdditionalSection } = useResumeStore();
  const { activeTab, setActiveTab } = useUiStore();

  const section = resumeData.additionalSections.find(s => s.id === activeTab);

  if (!section) return null;

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'bullet' }]
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="p-6 border rounded-xl bg-card/50 space-y-6 shadow-sm">
        <div className="space-y-2 max-w-md">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Section Title <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Certifications, Awards, Languages"
            value={section.title}
            onChange={(e) => updateAdditionalSection(section.id, { title: e.target.value })}
            className="font-medium bg-background"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content</Label>
            <AIWriterButton
              fieldName="description"
              fieldLabel="Section Content"
              fieldValue={section.description || ''}
              onUpdate={(newText) => updateAdditionalSection(section.id, { description: newText })}
            />
          </div>
          <div className="bg-background rounded-2xl border border-input overflow-hidden transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background shadow-sm">
            <ReactQuill
              theme="snow"
              value={section.description}
              onChange={(value) => updateAdditionalSection(section.id, { description: value })}
              modules={modules}
              placeholder="Describe your achievements or details here..."
            />
          </div>
          <FieldTip>
            Use the toolbar to add bullets, bold key terms, or italicise details. Keep each entry focused and relevant to the role you're applying for.
          </FieldTip>
        </div>
      </div>
    </motion.div>
  );
};
