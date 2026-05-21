import Lottie from 'lottie-react';

import aiSearchAnimation from '@/assets/ai-searching.json';

interface AILoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AILoader({ message, size = 'md' }: AILoaderProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <Lottie animationData={aiSearchAnimation} loop={true} />
      </div>
      {message && (
        <p className="text-sm text-muted-foreground font-medium animate-pulse text-center max-w-[280px]">
          {message}
        </p>
      )}
    </div>
  );
}
