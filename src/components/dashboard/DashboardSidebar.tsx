import { motion, Variants } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  FileText,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
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
        variant: 'destructive' as const,
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
    <Sidebar collapsible="icon" className="border-r bg-card/50 backdrop-blur-sm">
      <SidebarHeader className="h-20 px-4 border-b flex flex-col justify-center">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1">
          <motion.div
            whileHover="hover"
            whileTap="tap"
            className="flex-1 group-data-[collapsible=icon]:flex-none"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full justify-center gap-2 h-10 px-2 hover:bg-primary/10 transition-colors group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
              title="Back to Homepage"
            >
              <AnimatedIcon icon={ArrowLeft} preset="slideLeft" className="w-4 h-4" />
              <span className="font-medium group-data-[collapsible=icon]:hidden whitespace-nowrap">
                Homepage
              </span>
            </Button>
          </motion.div>
          <SidebarTrigger className="group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8" />
        </div>
      </SidebarHeader>

      <SidebarContent className="py-3 overflow-y-auto">
        {navItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const variants = iconVariants[item.label] ?? {};
                  const isDestructive = item.variant === 'destructive';

                  return (
                    <motion.div key={item.label} whileHover="hover" whileTap="tap">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={isActive}
                          onClick={() => navigate(item.href)}
                          tooltip={item.label}
                          className={cn(
                            'transition-all duration-200 h-10 px-4 rounded-full',
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
                            className="mr-2 inline-flex items-center justify-center"
                            style={{ display: 'inline-flex' }}
                          >
                            <item.icon
                              className={cn(
                                'w-4 h-4 transition-colors duration-200',
                                isActive && !isDestructive ? 'text-primary' : '',
                              )}
                            />
                          </motion.span>
                          <span className="truncate flex-1">{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 border-t">
        {/* User info — hide text in icon mode */}
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <Avatar className="w-10 h-10 border border-border/50 shrink-0">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
              {displayName?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold truncate text-foreground leading-tight">
              {displayName}
            </span>
            <span className="text-[11px] text-muted-foreground truncate leading-tight">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Sign out */}
        <motion.div
          whileHover="hover"
          whileTap="tap"
          className="group-data-[collapsible=icon]:hidden"
        >
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-3 w-full h-10 px-4 rounded-full text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <AnimatedIcon icon={LogOut} preset="slideLeft" className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>

        {/* Collapsed sign-out icon-only */}
        <motion.div
          whileHover="hover"
          whileTap="tap"
          className="hidden group-data-[collapsible=icon]:flex justify-center"
        >
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </motion.div>

        {/* License — hidden in icon mode */}
        <div className="px-2 space-y-4 group-data-[collapsible=icon]:hidden">
          <div className="h-[1px] bg-border/50 w-full" />
          <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground/60 leading-tight">
              Licensed under{' '}
              <span className="underline decoration-muted-foreground/30 underline-offset-2">
                MIT
              </span>
              .
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
      </SidebarFooter>
    </Sidebar>
  );
}
