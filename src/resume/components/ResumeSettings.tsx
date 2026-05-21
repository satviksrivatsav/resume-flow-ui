import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Slider } from '@/shared/components/ui/slider';
import { useResumeStore } from '@/shared/stores/resumeStore';

const THEME_COLORS = [
  '#0f172a',
  '#1e293b',
  '#334155', // Col 1
  '#475569',
  '#1e3a8a',
  '#1d4ed8',
  '#2563eb', // Col 2
  '#3b82f6',
  '#0d9488',
  '#0891b2',
  '#059669', // Col 3 (surrounding custom)
  '#16a34a',
  '#15803d',
  '#a16207',
  '#b45309', // Col 4
  '#c2410c',
  '#dc2626',
  '#991b1b', // Col 5
];

const FONT_FAMILIES = [
  'Open Sans',
  'Roboto',
  'Lato',
  'Montserrat',
  'Raleway',
  'Caladea',
  'Lora',
  'Roboto Slab',
  'Playfair Display',
  'Merriweather',
];

const FONT_SIZES = [
  { value: 'compact', label: 'Compact', pt: 9 },
  { value: 'standard', label: 'Standard', pt: 11 },
  { value: 'large', label: 'Large', pt: 13 },
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
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    onClick={() => onClick(color)}
    className="w-16 h-14 relative transition-colors flex-shrink-0 drop-shadow-sm hover:drop-shadow-md border-none outline-none will-change-transform"
    style={{
      backgroundColor: color,
      clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    }}
  >
    {isActive && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-black/10"
      >
        <svg
          className="w-6 h-6 text-white drop-shadow-md"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    )}
  </motion.button>
);

export const ResumeSettings = () => {
  const { resumeData, updateMetadata } = useResumeStore();
  const { metadata } = resumeData;
  const [modalColor, setModalColor] = useState(metadata.theme.primary);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);

  // Sync local modal state when dialog opens
  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setModalColor(metadata.theme.primary);
      }
      setIsColorDialogOpen(open);
    },
    [metadata.theme.primary],
  );

  const handleApplyColor = useCallback(() => {
    updateMetadata({ theme: { ...metadata.theme, primary: modalColor } });
    setIsColorDialogOpen(false);
  }, [modalColor, updateMetadata, metadata.theme]);

  const handleColorClick = useCallback(
    (color: string) => {
      updateMetadata({ theme: { ...metadata.theme, primary: color } });
    },
    [updateMetadata, metadata.theme],
  );

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
          <p className="text-xs font-mono text-muted-foreground uppercase">
            {metadata.theme.primary}
          </p>
        </div>

        <div className="flex justify-center space-x-[-12px] pb-4 overflow-visible">
          {/* Col 1 */}
          <div className="flex flex-col gap-1 justify-center">
            {THEME_COLORS.slice(0, 3).map((c) => (
              <ColorHexagon
                key={c}
                color={c}
                isActive={metadata.theme.primary === c}
                onClick={handleColorClick}
              />
            ))}
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-1 justify-center">
            {THEME_COLORS.slice(3, 7).map((c) => (
              <ColorHexagon
                key={c}
                color={c}
                isActive={metadata.theme.primary === c}
                onClick={handleColorClick}
              />
            ))}
          </div>

          {/* Col 3: Middle column with custom picker */}
          <div className="flex flex-col gap-1 justify-center">
            <ColorHexagon
              color={THEME_COLORS[7]}
              isActive={metadata.theme.primary === THEME_COLORS[7]}
              onClick={handleColorClick}
            />
            <ColorHexagon
              color={THEME_COLORS[8]}
              isActive={metadata.theme.primary === THEME_COLORS[8]}
              onClick={handleColorClick}
            />

            <Dialog open={isColorDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-16 h-14 relative transition-colors flex items-center justify-center flex-shrink-0 drop-shadow-sm hover:drop-shadow-md will-change-transform border-none outline-none"
                  style={{
                    backgroundColor: metadata.theme.primary,
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                  }}
                >
                  <Pencil className="w-5 h-5 text-white drop-shadow-sm" />
                </motion.button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl">
                <DialogHeader>
                  <DialogTitle>Choose a custom color</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full h-24 rounded-2xl overflow-hidden border border-input relative flex items-center justify-center">
                    <input
                      type="color"
                      value={modalColor}
                      onChange={(e) => setModalColor(e.target.value)}
                      className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] cursor-pointer bg-transparent border-none z-10"
                    />
                    <div className="w-10 h-10 bg-black/80 rounded-full flex items-center justify-center pointer-events-none z-20 shadow-md">
                      <Pencil className="w-5 h-5 text-white" />
                    </div>
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
              isActive={metadata.theme.primary === THEME_COLORS[9]}
              onClick={handleColorClick}
            />
            <ColorHexagon
              color={THEME_COLORS[10]}
              isActive={metadata.theme.primary === THEME_COLORS[10]}
              onClick={handleColorClick}
            />
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-1 justify-center">
            {THEME_COLORS.slice(11, 15).map((c) => (
              <ColorHexagon
                key={c}
                color={c}
                isActive={metadata.theme.primary === c}
                onClick={handleColorClick}
              />
            ))}
          </div>

          {/* Col 5 */}
          <div className="flex flex-col gap-1 justify-center">
            {THEME_COLORS.slice(15, 18).map((c) => (
              <ColorHexagon
                key={c}
                color={c}
                isActive={metadata.theme.primary === c}
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
              onClick={() =>
                updateMetadata({ typography: { ...metadata.typography, fontFamily: font } })
              }
              className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                metadata.typography.fontFamily === font
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
          <p className="text-xs text-muted-foreground">{metadata.typography.fontSize}pt</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {FONT_SIZES.map((size) => (
            <motion.button
              key={size.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                updateMetadata({ typography: { ...metadata.typography, fontSize: size.pt } })
              }
              className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                metadata.typography.fontSize === size.pt
                  ? 'border-primary bg-primary text-primary-foreground shadow-md'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              {size.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Line Height */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Line Height</h3>
          <p className="text-xs font-mono text-muted-foreground">
            {metadata.typography.lineHeight || 1.5}
          </p>
        </div>
        <div className="px-2 pt-2 pb-4">
          <Slider
            min={0.8}
            max={2.5}
            step={0.1}
            value={[metadata.typography.lineHeight || 1.5]}
            onValueChange={(val) =>
              updateMetadata({
                typography: { ...metadata.typography, lineHeight: val[0] },
              })
            }
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground px-1">
          <span>Compact</span>
          <span>Standard</span>
          <span>Loose</span>
        </div>
      </div>
    </motion.div>
  );
};
