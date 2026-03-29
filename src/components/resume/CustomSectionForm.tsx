import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronDown, ChevronUp, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-custom.css';
import { cn } from "@/lib/utils";

export const CustomSectionsForm = () => {
  const { resumeData, addCustomSection, updateCustomSection, deleteCustomSection } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (resumeData.customSections.length > 0 && !expandedId) {
      setExpandedId(resumeData.customSections[resumeData.customSections.length - 1].id);
    }
  }, [resumeData.customSections]);

  const handleAdd = () => {
    addCustomSection();
    setTimeout(() => {
      const lastSection = resumeData.customSections[resumeData.customSections.length - 1];
      if (lastSection) setExpandedId(lastSection.id);
    }, 0);
  };

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
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          Add any other relevant sections like Certifications, Awards, or Languages.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {resumeData.customSections.map((section, index) => {
            const isExpanded = expandedId === section.id;

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "group border rounded-xl overflow-hidden transition-all duration-200",
                  isExpanded ? "ring-1 ring-primary/20 shadow-md bg-card" : "hover:border-primary/30 hover:shadow-sm bg-card/50"
                )}
              >
                <div 
                  className={cn(
                    "flex items-center justify-between p-4 cursor-pointer select-none",
                    isExpanded && "border-b bg-muted/30"
                  )}
                  onClick={() => setExpandedId(isExpanded ? null : section.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                      {section.title || `Custom Section ${index + 1}`}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomSection(section.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="text-muted-foreground p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <div className="p-6 space-y-6">
                        <div className="space-y-2 max-w-md">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Section Title *</Label>
                          <Input
                            placeholder="e.g. Certifications, Awards, Languages"
                            value={section.title}
                            onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                            className="font-medium"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold">Content</Label>
                          <div className="bg-background rounded-2xl border overflow-hidden">
                            <ReactQuill
                              theme="snow"
                              value={section.description}
                              onChange={(value) => updateCustomSection(section.id, { description: value })}
                              modules={modules}
                              placeholder="Describe your achievements or details here..."
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {resumeData.customSections.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Layout className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No custom sections</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Add sections for certifications, awards, publications, or anything else.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Section
          </Button>
        </div>
      )}
    </motion.div>
  );
};

