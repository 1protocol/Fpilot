import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, KeyRound, Bell, LayoutGrid } from 'lucide-react';

function SettingsPlaceholder({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) {
    return (
        <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-muted-foreground/20 p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold font-headline">{title}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Settings"
                description="Manage your account, API keys, and notification preferences."
            />
            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="api-keys">
                        <KeyRound className="mr-2 h-4 w-4" />
                        API Keys
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="workspace">
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        Workspace
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Settings</CardTitle>
                            <CardDescription>Manage your public profile and account details.</CardDescription>
                        </CardHeader>
                        <CardContent className="min-h-[40vh]">
                             <SettingsPlaceholder 
                                title="Profile Management"
                                description="This section will allow you to update your personal information, change your password, and manage multi-factor authentication."
                                icon={User}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="api-keys">
                     <Card>
                        <CardHeader>
                            <CardTitle>API Keys</CardTitle>
                            <CardDescription>Manage your exchange API keys for live trading.</CardDescription>
                        </CardHeader>
                        <CardContent className="min-h-[40vh]">
                            <SettingsPlaceholder 
                                title="API Key Management"
                                description="Connect to exchanges like Binance, Bybit, and Coinbase by adding your API keys. All keys are stored with AES-256 encryption."
                                icon={KeyRound}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="notifications">
                     <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Configure how you receive alerts and updates from the system.</CardDescription>
                        </Header>
                        <CardContent className="min-h-[40vh]">
                             <SettingsPlaceholder 
                                title="Alert Configuration"
                                description="Set up email, SMS, or Telegram alerts for trade executions, risk threshold breaches, and system status changes."
                                icon={Bell}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="workspace">
                     <Card>
                        <CardHeader>
                            <CardTitle>Workspace Settings</CardTitle>
                            <CardDescription>Customize the look and feel of your trading dashboard.</CardDescription>
                        </Header>
                        <CardContent className="min-h-[40vh]">
                             <SettingsPlaceholder 
                                title="Workspace Customization"
                                description="Choose your preferred theme, layout, and data display settings to create a workspace that fits your workflow."
                                icon={LayoutGrid}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}