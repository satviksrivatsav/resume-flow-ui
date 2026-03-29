import React, { useState, useCallback, useMemo } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const THEME_COLORS = [
  '#0f172a', '#1e293b', '#334155', // Col 1
  '#475569', '#1e3a8a', '#1d4ed8', '#2563eb', // Col 2
  '#3b82f6', '#0d9488', '#0891b2', '#059669', // Col 3 (surrounding custom)
  '#16a34a', '#15803d', '#a16207', '#b45309', // Col 4
  '#c2410c', '#dc2626', '#991b1b', // Col 5
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

interface ColorHexagonProps {
  color: string;
  isActive: boolean;
  onClick: (color: string) => void;
}

const ColorHexagon = ({ color, isActive, onClick }: ColorHexagonProps) => (
  <motion.button
    whileHover={{ y: -4, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    onClick={() => onClick(color)}
    className="w-16 h-14 relative transition-colors flex-shrink-0 drop-shadow-sm hover:drop-shadow-md border-none outline-none will-change-transform"
    style={{ 
      backgroundColor: color,
      clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    }}
  >
    {isActive && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-black/10"
      >
        <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    )}
  </motion.button>
);

export const ResumeSettings = () => {
  const { resumeData, updateSettings } = useResumeStore();
  const { settings } = resumeData;
  const [modalColor, setModalColor] = useState(settings.themeColor);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);

  // Sync local modal state when dialog opens
  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (open) {
      setModalColor(settings.themeColor);
    }
    setIsColorDialogOpen(open);
  }, [settings.themeColor]);

  const handleApplyColor = useCallback(() => {
    updateSettings({ themeColor: modalColor });
    setIsColorDialogOpen(false);
  }, [modalColor, updateSettings]);

  const handleColorClick = useCallback((color: string) => {
    updateSettings({ themeColor: color });
  }, [updateSettings]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Theme Color */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-sm font-medium mb-1">Theme Color</h3>
          <p className="text-xs font-mono text-muted-foreground uppercase">{settings.themeColor}</p>
        </div>
        
        <div className="flex justify-center space-x-[-12px] pb-4 overflow-visible">
          {/* Col 1 */}
          <div className="flex flex-col gap-1 justify-center">
            {THEME_COLORS.slice(0, 3).map(c => (
              <ColorHexagon 
                key={c} 
                color={c} 
                isActive={settings.themeColor === c} 
                onClick={handleColorClick} 
              />
            ))}
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-1 justify-center">
            {THEME_COLORS.slice(3, 7).map(c => (
              <ColorHexagon 
                key={c} 
                color={c} 
                isActive={settings.themeColor === c} 
                onClick={handleColorClick} 
              />
            ))}
          </div>

          {/* Col 3: Middle column with custom picker */}
          <div className="flex flex-col gap-1 justify-center">
            <ColorHexagon 
              color={THEME_COLORS[7]} 
              isActive={settings.themeColor === THEME_COLORS[7]} 
              onClick={handleColorClick} 
            />
            <ColorHexagon 
              color={THEME_COLORS[8]} 
              isActive={settings.themeColor === THEME_COLORS[8]} 
              onClick={handleColorClick} 
            />
            
            <Dialog open={isColorDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-16 h-14 relative transition-all bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0 drop-shadow-sm hover:drop-shadow-md will-change-transform border-none outline-none"
                  style={{ 
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                  }}
                >
                  <Pencil className="w-5 h-5 text-white" />
                </motion.button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl">
                <DialogHeader>
                  <DialogTitle>Choose a custom color</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full h-24 rounded-2xl overflow-hidden border border-input relative">
                    <input
                      type="color"
                      value={modalColor}
                      onChange={(e) => setModalColor(e.target.value)}
                      className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] cursor-pointer bg-transparent border-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      type="text"
                      value={modalColor}
                      onChange={(e) => setModalColor(e.target.value)}
                      placeholder="#ffffff"
                      className="font-mono rounded-full h-10"
                    />
                    <Button className="rounded-full h-10 px-6" onClick={handleApplyColor}>
                      Set Color
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <ColorHexagon 
              color={THEME_COLORS[9]} 
              isActive={settings.themeColor === THEME_COLORS[9]} 
              onClick={handleColorClick} 
            />
            <ColorHexagon 
              color={THEME_COLORS[10]} 
              isActive={settings.themeColor === THEME_COLORS[10]} 
              onClick={handleColorClick} 
            />
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-1 justify-center">
            {THEME_COLORS.slice(11, 15).map(c => (
              <ColorHexagon 
                key={c} 
                color={c} 
                isActive={settings.themeColor === c} 
                onClick={handleColorClick} 
              />
            ))}
          </div>

          {/* Col 5 */}
          <div className="flex flex-col gap-1 justify-center">
            {THEME_COLORS.slice(15, 18).map(c => (
              <ColorHexagon 
                key={c} 
                color={c} 
                isActive={settings.themeColor === c} 
                onClick={handleColorClick} 
              />
            ))}
          </div>
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
              className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${settings.fontFamily === font
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
              className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${settings.fontSize === size.value
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
