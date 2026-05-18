import { motion } from 'framer-motion';
import { Award, Calendar, ChevronDown, Link as LinkIcon } from 'lucide-react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { AIWriterButton } from '@/shared/components/ui/AIWriterButton';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor';
import { TrashAnimatedIcon } from '@/shared/components/ui/TrashAnimatedIcon';
import { cn } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';

import { SectionListManager } from './shared/SectionListManager';

export const CertificationsForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: certifications } = resumeData.sections.certifications;

  const defaultNewItem = (id: string) => ({
    id,
    name: '',
    issuer: '',
    date: '',
    description: '',
    website: { label: '', href: '' },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={certifications}
        onAdd={(newItem) => addItem('certifications', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Certification"
        emptyMessage="List your professional certifications and licenses."
        renderItem={(cert, index, isExpanded) => (
          <AccordionItem
            key={cert.id}
            value={cert.id}
            className={cn(
              'group border rounded-xl overflow-hidden transition-all duration-200 border-b-0',
              isExpanded
                ? 'ring-1 ring-primary/20 shadow-md bg-card'
                : 'hover:border-primary/30 hover:shadow-sm bg-card/50',
            )}
          >
            <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
              <div
                className={cn(
                  'flex items-center justify-between p-4 w-full text-left',
                  isExpanded && 'border-b bg-muted/30',
                )}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">
                    {cert.name || `Certification ${index + 1}`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    {cert.issuer && (
                      <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                        <Award className="w-3.5 h-3.5" />
                        {cert.issuer}
                      </span>
                    )}
                    {cert.date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {cert.date}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem('certifications', cert.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
                  >
                    <TrashAnimatedIcon className="w-4 h-4" />
                  </Button>
                  <div className="text-muted-foreground p-1">
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 transition-transform duration-200',
                        isExpanded && 'rotate-180',
                      )}
                    />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">
                    Certification Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={cert.name}
                    onChange={(e) =>
                      updateItem('certifications', cert.id, { name: e.target.value })
                    }
                    placeholder="e.g. AWS Certified Solutions Architect"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Issuer <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) =>
                      updateItem('certifications', cert.id, { issuer: e.target.value })
                    }
                    placeholder="e.g. Amazon Web Services"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Date</Label>
                  <div className="relative">
                    <Input
                      value={cert.date}
                      onChange={(e) =>
                        updateItem('certifications', cert.id, { date: e.target.value })
                      }
                      placeholder="e.g. 2022-05"
                      className="pl-9"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Verification Link</Label>
                  <div className="relative">
                    <Input
                      value={cert.website.href}
                      onChange={(e) =>
                        updateItem('certifications', cert.id, {
                          website: { ...cert.website, href: e.target.value },
                        })
                      }
                      placeholder="e.g. https://aws.amazon.com/..."
                      className="pl-9"
                    />
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Description</Label>
                    <AIWriterButton
                      fieldName="certifications"
                      fieldLabel="Certification"
                      fieldValue={cert.description || ''}
                      onUpdate={(newText) =>
                        updateItem('certifications', cert.id, { description: newText })
                      }
                    />
                  </div>
                  <RichTextEditor
                    value={cert.description || ''}
                    onChange={(value) =>
                      updateItem('certifications', cert.id, { description: value })
                    }
                    placeholder="Optional details about the certification."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      />
    </motion.div>
  );
};
