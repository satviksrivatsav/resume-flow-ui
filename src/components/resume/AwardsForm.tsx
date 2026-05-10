import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trophy, Plus, Calendar } from "lucide-react";
import { TrashAnimatedIcon } from "@/components/ui/TrashAnimatedIcon";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const AwardsForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: awards } = resumeData.sections.awards;

  const handleAdd = () => {
    addItem('awards', { title: '', awarder: '', date: '', description: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          List your professional awards, honors, and recognitions.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Award
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {awards.map((award) => (
            <motion.div
              key={award.id}
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
                    onClick={() => deleteItem('awards', award.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-10 w-10"
                  >
                    <TrashAnimatedIcon className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">Award Title <span className="text-red-500">*</span></Label>
                  <Input
                    value={award.title}
                    onChange={(e) => updateItem('awards', award.id, { title: e.target.value })}
                    placeholder="e.g. Employee of the Month"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Awarder / Organization</Label>
                  <Input
                    value={award.awarder}
                    onChange={(e) => updateItem('awards', award.id, { awarder: e.target.value })}
                    placeholder="e.g. Acme Corp"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Date</Label>
                  <div className="relative">
                    <Input
                      value={award.date}
                      onChange={(e) => updateItem('awards', award.id, { date: e.target.value })}
                      placeholder="e.g. 2022-05"
                      className="pl-9"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="font-medium">Description</Label>
                  <Textarea
                    value={award.description}
                    onChange={(e) => updateItem('awards', award.id, { description: e.target.value })}
                    placeholder="Briefly describe the award and why you received it."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {awards.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Trophy className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No awards added</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Highlight your achievements and standing in your field.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Award
          </Button>
        </div>
      )}
    </motion.div>
  );
};
