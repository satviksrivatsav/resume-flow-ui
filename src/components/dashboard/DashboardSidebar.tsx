import { AlertTriangle, BarChart3, FileText, Settings, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
  {
    group: 'Workspace',
    items: [
      { label: 'Resumes', icon: FileText, href: '/dashboard' },
      { label: 'ATS Reports', icon: BarChart3, href: '/dashboard/reports' },
    ],
  },
  {
    group: 'Account',
    items: [
      { label: 'Profile', icon: User, href: '/dashboard/profile' },
      { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
      {
        label: 'Danger Zone',
        icon: AlertTriangle,
        href: '/dashboard/danger',
        variant: 'destructive',
      },
    ],
  },
];

export function DashboardSidebar() {
  const { pathname } = useLocation();
  const { user } = useAuthStore();

  return (
    <aside className="w-64 bg-background border-r flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
          <span className="text-background font-bold text-xl tracking-tighter italic">Rx</span>
        </div>
        <span className="font-bold text-lg tracking-tight">Resume Flow</span>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-8">
        {navItems.map((group) => (
          <div key={group.group}>
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all group',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      item.variant === 'destructive' &&
                        'hover:bg-destructive/10 hover:text-destructive',
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-accent/30 border border-border/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs">
            {user?.email?.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold truncate">{user?.email?.split('@')[0]}</span>
            <span className="text-[10px] text-muted-foreground truncate">Free Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
