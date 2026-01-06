import { useResumeStore } from "@/stores/resumeStore";
import { Settings, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const THEME_COLORS = [
  '#1f2937', '#ef4444', '#fb923c', '#f97316',
  '#fbbf24', '#22c55e', '#16a34a', '#38bdf8',
  '#0ea5e9', '#a78bfa', '#7c3aed',
];

const FONT_FAMILIES = [
  'Roboto', 'Lato', 'Montserrat', 'Open Sans', 'Raleway',
  'Caladea', 'Lora', 'Roboto Slab', 'Playfair Display', 'Merriweather',
];

const FONT_SIZES = [
  { value: 'compact' as const, label: 'Compact', pt: 9 },
  { value: 'standard' as const, label: 'Standard', pt: 11 },
  { value: 'large' as const, label: 'Large', pt: 13 },
];

export const ResumeSettings = () => {
  const { resumeData, updateSettings } = useResumeStore();
  const { settings } = resumeData;
  const [customColor, setCustomColor] = useState(settings.themeColor);

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    updateSettings({ themeColor: color });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border p-6 space-y-6"
    >
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Resume Settings</h2>
      </div>

      {/* Theme Color */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium mb-1">Theme Color</h3>
          <p className="text-xs text-muted-foreground">{settings.themeColor}</p>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {THEME_COLORS.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSettings({ themeColor: color })}
              className="w-full aspect-square rounded-md relative transition-all"
              style={{ backgroundColor: color }}
            >
              {settings.themeColor === color && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-full aspect-square rounded-md relative transition-all bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center"
              >
                <Pencil className="w-6 h-6 text-white" />
              </motion.button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose a custom color</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <Input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full h-24 p-0 m-0 border-none cursor-pointer"
                  style={{ padding: 0, margin: 0 }}
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#ffffff"
                  />
                  <Button onClick={() => updateSettings({ themeColor: customColor })}>Set Color</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Font Family */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Font Family</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FONT_FAMILIES.map((font) => (
            <motion.button
              key={font}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateSettings({ fontFamily: font })}
              className={`px-4 py-2.5 rounded-md border-2 text-sm font-medium transition-all ${settings.fontFamily === font
                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                : 'border-border bg-background hover:border-primary/50'
                }`}
              style={{ fontFamily: font }}
            >
              {font}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium mb-1">Font Size (pt)</h3>
          <p className="text-xs text-muted-foreground">
            {FONT_SIZES.find(f => f.value === settings.fontSize)?.pt}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {FONT_SIZES.map((size) => (
            <motion.button
              key={size.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateSettings({ fontSize: size.value })}
              className={`px-4 py-2.5 rounded-md border-2 text-sm font-medium transition-all ${settings.fontSize === size.value
                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                : 'border-border bg-background hover:border-primary/50'
                }`}
            >
              {size.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
