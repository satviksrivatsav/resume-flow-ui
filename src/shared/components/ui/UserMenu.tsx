import { motion } from 'framer-motion';
import { LogOut, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AnimatedIcon } from '@/shared/components/ui/AnimatedIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useSidebar } from '@/shared/components/ui/sidebar-context';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/shared/stores/authStore';

export function UserMenu() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const { state } = useSidebar();
  const [isAnimating, setIsAnimating] = useState(false);

  if (!user) {
    if (state === 'collapsed') {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <UserCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-40">
            <DropdownMenuItem onClick={() => navigate('/login')}>Log in</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/signup')}>Sign up</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="flex items-center gap-2 w-full justify-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="flex-1 max-w-[80px] h-10"
        >
          Log in
        </Button>
        <Button onClick={() => navigate('/signup')} className="flex-1 max-w-[80px] h-10">
          Sign up
        </Button>
      </div>
    );
  }

  const userEmail = user.email || '';
  const userName =
    profile?.name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    userEmail.split('@')[0];
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const initials = userName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'relative flex items-center transition-all duration-300 rounded-full',
            state === 'expanded'
              ? 'w-full justify-start gap-3 px-2 h-12 hover:bg-primary/5'
              : 'h-10 w-10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 justify-center p-0',
          )}
        >
          <Avatar
            className={cn(
              'border border-border/50 shrink-0 transition-all duration-300',
              state === 'expanded'
                ? 'h-9 w-9'
                : 'h-10 w-10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8',
            )}
          >
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs group-data-[collapsible=icon]:text-[10px] uppercase">
              {initials}
            </AvatarFallback>
          </Avatar>

          {state === 'expanded' && (
            <div className="flex flex-col items-start min-w-0 flex-1 overflow-hidden">
              <span className="text-sm font-semibold truncate w-full text-foreground text-left">
                {userName}
              </span>
              <span className="text-[10px] text-muted-foreground truncate w-full text-left">
                {userEmail}
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align={state === 'collapsed' ? 'end' : 'end'}
        side={state === 'collapsed' ? 'right' : 'bottom'}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <motion.div
          onMouseEnter={() => setIsAnimating(true)}
          animate={isAnimating ? 'hover' : 'initial'}
          onAnimationComplete={() => {
            if (isAnimating) setIsAnimating(false);
          }}
          whileTap="tap"
        >
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-destructive focus:text-destructive"
          >
            <AnimatedIcon icon={LogOut} preset="slideRight" className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
