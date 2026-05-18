import { motion } from 'framer-motion';
import { ChevronDown, Github, Globe, Linkedin, Twitter, User } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { TrashAnimatedIcon } from '@/shared/components/ui/TrashAnimatedIcon';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { SectionListManager } from './shared/SectionListManager';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { cn } from '@/shared/lib/utils';

export const ProfilesForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: profiles } = resumeData.sections.profiles;

  const defaultNewItem = (id: string) => ({
    id,
    network: '',
    username: '',
    icon: '',
    website: { label: '', href: '' },
    visible: true,
  });

  const getNetworkIcon = (network: string) => {
    const n = network.toLowerCase();
    if (n.includes('github')) return <Github className="w-4 h-4" />;
    if (n.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (n.includes('twitter') || n.includes('x')) return <Twitter className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={profiles}
        onAdd={(newItem) => addItem('profiles', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Profile"
        emptyMessage="Add links to your social profiles and professional portfolios."
        renderItem={(profile, index, isExpanded) => (
          <AccordionItem
            key={profile.id}
            value={profile.id}
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
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">
                      {getNetworkIcon(profile.network)}
                    </div>
                    <h3 className="font-semibold text-base truncate">
                      {profile.network || `Profile ${index + 1}`}
                    </h3>
                  </div>
                  {profile.username && (
                    <p className="text-sm text-muted-foreground mt-0.5 font-medium ml-6">
                      @{profile.username}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem('profiles', profile.id);
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
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium">
                    Network <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={profile.network}
                      onChange={(e) =>
                        updateItem('profiles', profile.id, { network: e.target.value })
                      }
                      placeholder="e.g. GitHub, LinkedIn"
                      className="pl-9"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {getNetworkIcon(profile.network)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-medium">Username / Handle</Label>
                    <div className="relative">
                      <Input
                        value={profile.username}
                        onChange={(e) =>
                          updateItem('profiles', profile.id, { username: e.target.value })
                        }
                        placeholder="e.g. johndoe"
                        className="pl-9"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">Profile URL</Label>
                    <div className="relative">
                      <Input
                        value={profile.website.href}
                        onChange={(e) =>
                          updateItem('profiles', profile.id, {
                            website: { ...profile.website, href: e.target.value },
                          })
                        }
                        placeholder="e.g. https://github.com/johndoe"
                        className="pl-9"
                      />
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      />
    </motion.div>
  );
};


