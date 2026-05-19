import { LucideIcon } from 'lucide-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';

export interface ActionMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  destructive?: boolean;
  rightElement?: React.ReactNode;
}

interface ActionListMenuProps {
  trigger: React.ReactNode;
  items: ActionMenuItem[];
  align?: 'start' | 'end' | 'center';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  header?: React.ReactNode;
}

export function ActionListMenu({
  trigger,
  items,
  align = 'end',
  side,
  className,
  header,
}: ActionListMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        className={cn(
          'p-0 overflow-hidden min-w-[160px] bg-popover rounded-xl border border-border/60 shadow-md',
          className,
        )}
      >
        <div className="flex flex-col">
          {header && (
            <div className="select-none">
              {header}
            </div>
          )}
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={index}
                onClick={item.onClick}
                className={cn(
                  'flex items-center w-full px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer rounded-none border-b border-border/40 last:border-b-0 outline-none select-none',
                  item.destructive
                    ? 'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive'
                    : 'text-foreground hover:bg-accent/60 focus:bg-accent/60 focus:text-accent-foreground',
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5 mr-2.5 shrink-0 text-current" />}
                <span className="flex-1 text-left">{item.label}</span>
                {item.rightElement}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
