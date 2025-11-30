import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Settings"
                description="Manage your account, API keys, and notification preferences."
            />
            <div className="flex h-[60vh] items-center justify-center">
                <Card className="w-full max-w-lg text-center shadow-lg">
                    <CardHeader>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <Settings className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Application Settings</CardTitle>
                        <CardDescription>Coming Soon</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            The settings page is being built. You will soon be able to manage your profile, configure exchange API keys, set up alert preferences, and customize your workspace.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
