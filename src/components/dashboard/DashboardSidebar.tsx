import { motion, Variants } from 'framer-motion';
import { AlertTriangle, BarChart3, FileText, LogOut, Settings, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

// Per-icon hover animation variants — matching ResumeSidebar's pattern
const iconVariants: Record<string, Variants> = {
  Resumes: {
    hover: { y: -3, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { y: 0, scale: 0.9 },
  },
  'ATS Reports': {
    hover: { rotate: [-4, 4, -4, 0], transition: { duration: 0.4, ease: 'easeInOut' } },
    tap: { scale: 0.9 },
  },
  Profile: {
    hover: { y: -3, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { y: 0, scale: 0.9 },
  },
  Settings: {
    hover: { rotate: 90, transition: { duration: 0.35, ease: 'easeInOut' } },
    tap: { rotate: 0, scale: 0.9 },
  },
  'Danger Zone': {
    hover: { rotate: [0, -10, 10, 0], transition: { duration: 0.4, ease: 'easeInOut' } },
    tap: { scale: 0.9 },
  },
};

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
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, profile, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = profile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0];

  return (
    <aside className="w-64 bg-card/50 backdrop-blur-sm border-r flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b flex items-center gap-3 h-[65px]">
        <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center shrink-0">
          <span className="text-background font-bold text-xl tracking-tighter italic">Rx</span>
        </div>
        <span className="font-bold text-lg tracking-tight">Resume Flow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-6 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.group}>
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
              {group.group}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const variants = iconVariants[item.label] ?? {};
                const isDestructive = item.variant === 'destructive';

                return (
                  <motion.div key={item.label} whileHover="hover" whileTap="tap">
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 h-10 px-4 rounded-full text-sm font-medium transition-all duration-200',
                        isActive && !isDestructive
                          ? 'bg-primary/10 text-primary font-semibold'
                          : isDestructive
                            ? 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                    >
                      <motion.span
                        variants={variants}
                        initial={false}
                        className="inline-flex items-center justify-center"
                        style={{ display: 'inline-flex' }}
                      >
                        <item.icon
                          className={cn(
                            'w-4 h-4 transition-colors duration-200',
                            isActive && !isDestructive ? 'text-primary' : '',
                          )}
                        />
                      </motion.span>
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-6">
        <div className="space-y-4">
          {/* User info */}
          <div className="flex items-center gap-3 px-2">
            <Avatar className="w-10 h-10 border border-border/50 shrink-0">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                {displayName?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold truncate text-foreground leading-tight">
                {displayName}
              </span>
              <span className="text-[11px] text-muted-foreground truncate leading-tight">
                {user?.email}
              </span>
            </div>
          </div>

          {/* Sign out */}
          <motion.div whileHover="hover" whileTap="tap">
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-3 w-full h-10 px-4 rounded-full text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
            >
              <AnimatedIcon icon={LogOut} preset="slideLeft" className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        </div>

        {/* License */}
        <div className="px-2 space-y-4">
          <div className="h-[1px] bg-border/50 w-full" />

          <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground/60 leading-tight">
              Licensed under{' '}
              <span className="underline decoration-muted-foreground/30 underline-offset-2">MIT</span>.
            </p>
            <p className="text-[10px] text-muted-foreground/60 leading-tight">
              By the community, for the community.
            </p>
            <p className="text-[10px] text-muted-foreground/60 leading-tight">
              A passion project by{' '}
              <span className="text-foreground/70 font-medium">Satvik Srivatsav</span>.
            </p>
          </div>

          <p className="text-[11px] font-semibold text-muted-foreground/30 tracking-tight">
            Resume Flow v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
