import { AlertCircle, AlertTriangle, Check, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      richColors
      closeButton
      icons={{
        success: <Check className="h-4 w-4" />,
        info: <AlertCircle className="h-4 w-4" />,
        warning: <AlertTriangle className="h-4 w-4" />,
        error: <AlertCircle className="h-4 w-4" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          // Custom variant styles for high-quality, non-neon look
          success:
            'group-[.toaster]:bg-green-50/80 group-[.toaster]:text-green-900 group-[.toaster]:border-green-200/50 dark:group-[.toaster]:bg-green-950/30 dark:group-[.toaster]:text-green-200 dark:group-[.toaster]:border-green-800/50',
          error:
            'group-[.toaster]:bg-red-50/80 group-[.toaster]:text-red-900 group-[.toaster]:border-red-200/50 dark:group-[.toaster]:bg-red-950/30 dark:group-[.toaster]:text-red-200 dark:group-[.toaster]:border-red-800/50',
          warning:
            'group-[.toaster]:bg-orange-50/80 group-[.toaster]:text-orange-900 group-[.toaster]:border-orange-200/50 dark:group-[.toaster]:bg-orange-950/30 dark:group-[.toaster]:text-orange-200 dark:group-[.toaster]:border-orange-800/50',
          info: 'group-[.toaster]:bg-blue-50/80 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200/50 dark:group-[.toaster]:bg-blue-950/30 dark:group-[.toaster]:text-blue-200 dark:group-[.toaster]:border-blue-800/50',
          closeButton:
            'group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border-border group-[.toast]:hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
