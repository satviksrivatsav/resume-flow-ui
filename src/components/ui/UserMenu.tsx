import { LogOut, User, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/authStore';
import { useSidebar } from '@/components/ui/sidebar';

export function UserMenu() {
    const navigate = useNavigate();
    const { user, signOut } = useAuthStore();
    const { state } = useSidebar();

    if (!user) {
        if (state === 'collapsed') {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                            <UserCircle className="h-6 w-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="end" className="w-40">
                        <DropdownMenuItem onClick={() => navigate('/login')}>
                            Log in
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/signup')}>
                            Sign up
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        return (
            <div className="flex items-center gap-2 w-full justify-center">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="flex-1 max-w-[80px]">
                    Log in
                </Button>
                <Button size="sm" onClick={() => navigate('/signup')} className="flex-1 max-w-[80px]">
                    Sign up
                </Button>
            </div>
        );
    }

    const userEmail = user.email || '';
    const userName = user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0];
    const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    const initials = userName.slice(0, 2).toUpperCase();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
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
                        <p className="text-xs leading-none text-muted-foreground">
                            {userEmail}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
