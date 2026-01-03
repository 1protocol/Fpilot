'use client'
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { CandlestickChart, LayoutDashboard, Settings, SlidersHorizontal, Database, BarChart, LogOut, User, Bot, Target } from 'lucide-react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { useUser, useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/ai-bots', icon: Bot, label: 'AI Bots' },
    { href: '/strategies', icon: SlidersHorizontal, label: 'Strategies' },
    { href: '/analytics', icon: BarChart, label: 'Analytics' },
    { href: '/backtesting', icon: CandlestickChart, label: 'Backtesting' },
    { href: '/data-collection', icon: Database, label: 'Data Collection' },
];

function UserProfileArea() {
    const { user, isUserLoading } = useUser();
    const { auth } = useFirebase();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
            toast({
                title: 'Logged Out',
                description: 'You have been successfully logged out.',
            });
            router.push('/login');
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex items-center gap-3 p-2">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-24 group-data-[collapsible=icon]:hidden" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="p-2 space-y-2">
            <div className="flex items-center gap-3">
                 <Avatar className="size-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'}/>
                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                 <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium truncate">{user.displayName || 'User'}</span>
                    <span className="text-xs text-sidebar-foreground/70 truncate">{user.email}</span>
                 </div>
            </div>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{ children: "Log Out" }} size="lg">
                    <LogOut className="size-5" />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </div>
    );
}

export default function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center gap-2 p-2 justify-center group-data-[collapsible=icon]:justify-start">
                    <div className="flex items-center gap-2.5">
                        <Target className="w-7 h-7 text-accent" />
                        <h1 className="text-xl font-headline font-bold text-foreground group-data-[collapsible=icon]:hidden">FPILOT</h1>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                size="lg"
                                isActive={pathname.startsWith(item.href)}
                                tooltip={{ children: item.label }}
                            >
                                <Link href={item.href}>
                                    <item.icon className="size-5" />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            size="lg"
                            isActive={pathname === '/settings'}
                            tooltip={{ children: 'Settings' }}
                        >
                            <Link href="/settings">
                                <Settings className="size-5" />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                 <UserProfileArea />
            </SidebarFooter>
        </Sidebar>
    );
}
