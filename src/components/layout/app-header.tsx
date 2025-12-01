'use client'
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/strategies': 'Trading Strategies',
  '/backtesting': 'Backtesting & Validation',
  '/settings': 'Settings',
};

export default function AppHeader() {
    const pathname = usePathname();
    const title = pageTitles[pathname] || 'CryptoSage';

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-headline font-semibold text-foreground hidden md:block">{title}</h1>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
            </div>
        </header>
    )
}
