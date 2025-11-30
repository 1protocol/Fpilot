'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, CandlestickChart, LayoutDashboard, Settings, SlidersHorizontal } from 'lucide-react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/strategies', icon: SlidersHorizontal, label: 'Strategies' },
    { href: '/backtesting', icon: CandlestickChart, label: 'Backtesting' },
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
                            <Link href={item.href} passHref>
                                <SidebarMenuButton 
                                    asChild
                                    isActive={pathname === item.href}
                                    tooltip={{ children: item.label }}
                                >
                                    <span>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/settings" passHref>
                      <SidebarMenuButton 
                          asChild
                          isActive={pathname === '/settings'}
                          tooltip={{ children: 'Settings' }}
                      >
                          <span>
                            <Settings />
                            <span>Settings</span>
                          </span>
                      </SidebarMenuButton>
                  </Link>
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
