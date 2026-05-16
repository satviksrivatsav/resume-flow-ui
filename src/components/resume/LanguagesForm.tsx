import { AnimatePresence, motion } from 'framer-motion';
import { Languages, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { useResumeStore } from '@/stores/resumeStore';

export const LanguagesForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: languages } = resumeData.sections.languages;

  const handleAdd = () => {
    addItem('languages', { name: '', description: '', level: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          List the languages you speak and your proficiency levels.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Language
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {languages.map((lang) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative border rounded-xl p-6 bg-card hover:border-primary/30 transition-all duration-200 shadow-sm"
            >
              <div className="absolute top-4 right-4">
                <motion.div whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem('languages', lang.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-10 w-10"
                  >
                    <TrashAnimatedIcon className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium">
                    Language Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={lang.name}
                    onChange={(e) => updateItem('languages', lang.id, { name: e.target.value })}
                    placeholder="e.g. English, Spanish, Japanese"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Fluency / Proficiency</Label>
                  <Input
                    value={lang.description}
                    onChange={(e) =>
                      updateItem('languages', lang.id, { description: e.target.value })
                    }
                    placeholder="e.g. Native, Professional Working, Conversational"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {languages.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Languages className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No languages added</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Add the languages you know to broaden your profile's appeal.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Language
          </Button>
        </div>
      )}
    </motion.div>
  );
};
