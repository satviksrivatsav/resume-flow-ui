import { motion } from 'framer-motion';
import { AlertCircle, Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BulletReview } from '@/types/ats';

interface BulletReviewCardProps {
  review: BulletReview;
  index: number;
}

export function BulletReviewCard({ review, index }: BulletReviewCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(review.improved);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-0 border rounded-2xl overflow-hidden bg-card"
    >
      {/* Original - Red toned */}
      <div className="bg-red-50/50 dark:bg-red-950/30 border-r border-border p-4 md:p-5">
        <div className="flex items-start gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
            Original
          </span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed pl-6">{review.original}</p>
      </div>

      {/* Improved - Green toned */}
      <div className="bg-green-50/50 dark:bg-green-950/30 p-4 md:p-5 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
              AI Improved
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs h-7 px-2">
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed pl-6">{review.improved}</p>
      </div>
    </motion.div>
  );
}
