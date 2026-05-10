import { motion } from 'framer-motion';
import { LogOut, User, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar-context';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

export function UserMenu() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { state } = useSidebar();

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
    user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0];
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
          className={cn('relative rounded-full', state === 'collapsed' ? 'h-8 w-8' : 'h-10 w-10')}
        >
          <Avatar className={cn(state === 'collapsed' ? 'h-8 w-8' : 'h-10 w-10')}>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
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
        <motion.div whileHover="hover" whileTap="tap">
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
