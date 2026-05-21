import { cn } from '@/shared/lib/utils';

export const RadialGridBackground = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn('absolute inset-0 z-0 overflow-hidden bg-zinc-50 dark:bg-zinc-950', className)}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000030_1px,transparent_1px),linear-gradient(to_bottom,#00000030_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)] dark:bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)]" />
    </div>
  );
};
