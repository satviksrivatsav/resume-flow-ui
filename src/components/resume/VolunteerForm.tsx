import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, HandHelping, Link as LinkIcon, MapPin, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { useResumeStore } from '@/stores/resumeStore';

export const VolunteerForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: volunteer } = resumeData.sections.volunteer;

  const handleAdd = () => {
    addItem('volunteer', {
      organization: '',
      position: '',
      location: '',
      period: '',
      description: '',
      website: { label: '', href: '' },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          List your volunteer work, community involvement, and non-profit contributions.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Volunteer
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {volunteer.map((vol) => (
            <motion.div
              key={vol.id}
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
                    onClick={() => deleteItem('volunteer', vol.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-10 w-10"
                  >
                    <TrashAnimatedIcon className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">
                    Organization <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={vol.organization}
                    onChange={(e) =>
                      updateItem('volunteer', vol.id, { organization: e.target.value })
                    }
                    placeholder="e.g. Red Cross, Local Shelter"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Role / Position <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={vol.position}
                    onChange={(e) => updateItem('volunteer', vol.id, { position: e.target.value })}
                    placeholder="e.g. Volunteer Coordinator, Event Staff"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Location</Label>
                  <div className="relative">
                    <Input
                      value={vol.location}
                      onChange={(e) =>
                        updateItem('volunteer', vol.id, { location: e.target.value })
                      }
                      placeholder="e.g. Remote, New York, NY"
                      className="pl-9"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Period</Label>
                  <div className="relative">
                    <Input
                      value={vol.period}
                      onChange={(e) => updateItem('volunteer', vol.id, { period: e.target.value })}
                      placeholder="e.g. 2021-06 - 2022-01"
                      className="pl-9"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="font-medium">Organization Link</Label>
                  <div className="relative">
                    <Input
                      value={vol.website.href}
                      onChange={(e) =>
                        updateItem('volunteer', vol.id, {
                          website: { ...vol.website, href: e.target.value },
                        })
                      }
                      placeholder="e.g. https://organization.org"
                      className="pl-9"
                    />
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="font-medium">Description</Label>
                  <Textarea
                    value={vol.description}
                    onChange={(e) =>
                      updateItem('volunteer', vol.id, { description: e.target.value })
                    }
                    placeholder="Describe your responsibilities and the organization's mission."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {volunteer.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <HandHelping className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No volunteer work added</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Showcase your values and commitment to giving back to the community.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Volunteer
          </Button>
        </div>
      )}
    </motion.div>
  );
};
