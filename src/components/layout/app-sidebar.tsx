'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, CandlestickChart, LayoutDashboard, Settings, SlidersHorizontal, Database } from 'lucide-react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { SheetTitle, SheetDescription } from '../ui/sheet';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/strategies', icon: SlidersHorizontal, label: 'Strategies' },
    { href: '/backtesting', icon: CandlestickChart, label: 'Backtesting' },
    { href: '/data-collection', icon: Database, label: 'Data Collection' },
];

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
                                isActive={pathname === item.href}
                                tooltip={{ children: item.label }}
                            >
                                <Link href={item.href}>
                                    <item.icon />
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
                        isActive={pathname === '/settings'}
                        tooltip={{ children: 'Settings' }}
                    >
                        <Link href="/settings">
                          <Settings />
                          <span>Settings</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton tooltip={{children: "Profile"}}>
                          <Avatar className="size-7">
                              <AvatarImage data-ai-hint="person portrait" src="https://picsum.photos/seed/user-avatar/40/40" alt="User Avatar" />
                              <AvatarFallback>CS</AvatarFallback>
                          </Avatar>
                          <span className='truncate'>User Profile</span>
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start" className="w-56">
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Profile</DropdownMenuItem>
                          <DropdownMenuItem>Billing</DropdownMenuItem>
                          <DropdownMenuItem>Team</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Log out</DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
