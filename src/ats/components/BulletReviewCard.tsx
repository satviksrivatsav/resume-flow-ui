import { motion } from 'framer-motion';
import { AlertCircle, Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { BulletReview } from '@/shared/types/ats';

interface BulletReviewCardProps {
  review: BulletReview;
  index: number;
}

export function BulletReviewCard({ review, index }: BulletReviewCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(review.improved);
      setCopied(true);
      toast({
        title: 'Success',
        description: 'Bullet copied to clipboard',
        variant: 'success',
      });
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
      <div className="bg-destructive/5 dark:bg-destructive/10 border-r border-border p-4 md:p-5">
        <div className="flex items-start gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <span className="text-[10px] font-semibold text-destructive uppercase tracking-wider">
            Original
          </span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed pl-6">{review.original}</p>
      </div>

      {/* Improved - Green toned */}
      <div className="bg-success/5 dark:bg-success/10 p-4 md:p-5 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
            <span className="text-[10px] font-semibold text-success dark:text-success uppercase tracking-wider">
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
