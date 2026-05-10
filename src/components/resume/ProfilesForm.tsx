import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Globe, Plus, User } from "lucide-react";
import { TrashAnimatedIcon } from "@/components/ui/TrashAnimatedIcon";
import { motion, AnimatePresence } from "framer-motion";

export const ProfilesForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: profiles } = resumeData.sections.profiles;

  const handleAdd = () => {
    addItem('profiles', { network: '', username: '', icon: '', website: { label: '', href: '' } });
  };

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
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          Add links to your social profiles and professional portfolios.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {profiles.map((profile) => (
            <motion.div
              key={profile.id}
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
                    onClick={() => deleteItem('profiles', profile.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-10 w-10"
                  >
                    <TrashAnimatedIcon className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium">Network <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      value={profile.network}
                      onChange={(e) => updateItem('profiles', profile.id, { network: e.target.value })}
                      placeholder="e.g. GitHub, LinkedIn"
                      className="pl-9"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {getNetworkIcon(profile.network)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Username / Handle</Label>
                  <div className="relative">
                    <Input
                      value={profile.username}
                      onChange={(e) => updateItem('profiles', profile.id, { username: e.target.value })}
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
                      onChange={(e) => updateItem('profiles', profile.id, { website: { ...profile.website, href: e.target.value } })}
                      placeholder="e.g. https://github.com/johndoe"
                      className="pl-9"
                    />
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {profiles.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Globe className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No profiles added</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Help recruiters find you on professional networks.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Profile
          </Button>
        </div>
      )}
    </motion.div>
  );
};
