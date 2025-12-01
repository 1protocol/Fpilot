'use client'
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bot, CandlestickChart, LayoutDashboard, Settings, SlidersHorizontal, Database, BarChart, LogOut, LogIn, User } from 'lucide-react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { useUser, useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';


const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
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
            <div className="flex flex-col items-center gap-2 p-2 group-data-[collapsible=icon]:items-start">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-24 group-data-[collapsible=icon]:hidden" />
            </div>
        );
    }

    if (!user) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: "Login" }}>
                    <Link href="/login">
                        <LogIn className="size-5" />
                        <span>Login</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    return (
        <>
            <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip={{ children: user.displayName || user.email || 'Profile' }}>
                    <Link href="/settings">
                        <User className="size-5"/>
                        <span className='truncate'>{user.displayName || user.email}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{ children: "Log Out" }}>
                    <LogOut className="size-5" />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </>
    );
}

export default function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2 justify-center group-data-[collapsible=icon]:justify-start">
                    <Bot className="w-8 h-8 text-accent" />
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <h1 className="text-xl font-headline font-bold text-foreground">CryptoSage</h1>
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
                    <UserProfileArea />
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
