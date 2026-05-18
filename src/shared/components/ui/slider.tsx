import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    trackClassName?: string;
    rangeClassName?: string;
    thumbClassName?: string;
  }
>(
  (
    {
      className,
      trackClassName,
      rangeClassName,
      thumbClassName,
      orientation = 'horizontal',
      ...props
    },
    ref,
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      orientation={orientation}
      className={cn(
        'relative flex touch-none select-none items-center',
        orientation === 'horizontal' ? 'w-full' : 'h-full flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          'relative grow overflow-hidden rounded-full bg-secondary',
          orientation === 'horizontal' ? 'h-2 w-full' : 'w-2 h-full',
          trackClassName,
        )}
      >
        <SliderPrimitive.Range
          className={cn(
            'absolute bg-primary',
            orientation === 'horizontal' ? 'h-full' : 'w-full bottom-0',
            rangeClassName,
          )}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          'block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          thumbClassName,
        )}
      />
    </SliderPrimitive.Root>
  ),
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
