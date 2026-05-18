import { ReactNode } from 'react';

import { SidebarProvider } from '@/shared/components/ui/sidebar';

import { cn } from '@/shared/lib/utils';
import { Topbar } from '@/shared/components/layout/Topbar';
import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export function DashboardLayout({ children, fullWidth = false }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gradient-to-br from-background via-background to-primary/5 w-full overflow-hidden font-sans">
        <DashboardSidebar />
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden relative">
          <Topbar />
          <main className={cn(
            "flex-1 w-full relative min-h-0",
            fullWidth ? "overflow-hidden px-0 pb-0 pt-[var(--header-height)]" : "overflow-y-auto px-12 pb-24 pt-[calc(var(--header-height)+3rem)]"
          )}>
            <div className={cn(
              "w-full mx-auto flex flex-col",
              fullWidth ? "max-w-none h-full" : "max-w-[1100px] min-h-full"
            )}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
