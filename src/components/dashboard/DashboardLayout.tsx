import { ReactNode } from 'react';

import { DashboardSidebar } from './DashboardSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <DashboardSidebar />
        <main className="flex-1 p-8 overflow-y-auto w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
