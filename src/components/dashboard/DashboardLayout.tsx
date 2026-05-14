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
      <div className="flex min-h-screen bg-background w-full">
        <DashboardSidebar />
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
          <Topbar />
          <main className="flex-1 p-8 overflow-y-auto w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
