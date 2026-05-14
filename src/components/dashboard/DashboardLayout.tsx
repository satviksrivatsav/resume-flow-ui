import { ReactNode } from 'react';

import { DashboardSidebar } from './DashboardSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

import { Topbar } from '../layout/Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gradient-to-br from-background via-background to-primary/5 w-full overflow-hidden font-sans">
        <DashboardSidebar />
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden relative">
          <Topbar />
          <main className="flex-1 px-8 pb-8 pt-24 overflow-y-auto w-full relative">
            <div className="w-full max-w-[1100px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
