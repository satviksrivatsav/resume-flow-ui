import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TechChipsInput } from '@/components/ui/TechChipsInput';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { useResumeStore } from '@/stores/resumeStore';

export const InterestsForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: interests } = resumeData.sections.interests;

  const handleAdd = () => {
    addItem('interests', { name: '', keywords: [] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          Add your hobbies and personal interests to show your personality.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Interest
        </Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {interests.map((interest, index) => (
            <motion.div
              key={interest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative border rounded-xl p-6 bg-card hover:border-primary/30 transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Interest {index + 1}
                </h3>
                <motion.div whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem('interests', interest.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
                  >
                    <TrashAnimatedIcon className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-medium">
                    Interest / Hobby <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={interest.name}
                    onChange={(e) => updateItem('interests', interest.id, { name: e.target.value })}
                    placeholder="e.g. Photography, Hiking, Open Source"
                  />
                </div>

                <TechChipsInput
                  label="Keywords"
                  value={interest.keywords}
                  onChange={(keywords) => updateItem('interests', interest.id, { keywords })}
                  placeholder="Type a tag and press Enter"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {interests.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Heart className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No interests added</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Share what you're passionate about outside of work.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Interest
          </Button>
        </div>
      )}
    </motion.div>
  );
};

