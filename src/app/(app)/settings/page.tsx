'use client';

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useFirebase, setDocumentNonBlocking } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc } from "firebase/firestore";

const apiKeys = [
    { id: "1", exchange: "Binance", key: "abc...xyz", status: "Active" },
    { id: "2", exchange: "Bybit", key: "def...uvw", status: "Active" },
    { id: "3", exchange: "Coinbase", key: "ghi...rst", status: "Expired" },
];

export default function SettingsPage() {
    const { user, auth, firestore, isUserLoading } = useFirebase();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
        }
    }, [user]);

    const handleProfileSave = async () => {
        if (!user || !auth || !firestore) {
            toast({ variant: "destructive", title: "Error", description: "User not logged in." });
            return;
        }

        setIsSaving(true);
        try {
            // Update Auth profile
            await updateProfile(user, { displayName });

            // Update Firestore document
            const userDocRef = doc(firestore, "users", user.uid);
            setDocumentNonBlocking(userDocRef, { username: displayName }, { merge: true });

            toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });

        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Settings"
                description="Manage your account, API keys, and notification preferences."
            />
            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {isUserLoading ? <p>Loading...</p> : user ? (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={user.email || ''} readOnly disabled />
                                    </div>
                                    <Button onClick={handleProfileSave} disabled={isSaving}>
                                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </>
                             ) : (
                                <p className="text-muted-foreground">Please log in to manage your profile.</p>
                             )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="api-keys">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <div>
                                <CardTitle>API Keys</CardTitle>
                                <CardDescription>Manage your exchange API keys for live trading.</CardDescription>
                            </div>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add New Key
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Exchange</TableHead>
                                            <TableHead>API Key (Public)</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {apiKeys.map((key) => (
                                            <TableRow key={key.id}>
                                                <TableCell className="font-medium">{key.exchange}</TableCell>
                                                <TableCell className="font-mono">{key.key}</TableCell>
                                                <TableCell>{key.status}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                     <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Choose how you want to be notified.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Email Notifications</Label>
                                <Select defaultValue="important">
                                    <SelectTrigger className="w-[280px]">
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Notifications</SelectItem>
                                        <SelectItem value="important">Only Important (Fills, Errors)</SelectItem>
                                        <SelectItem value="none">No Emails</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                             <div className="space-y-2">
                                <Label>Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">Coming soon.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="appearance">
                     <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize the look and feel of the application.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <p className="text-sm text-muted-foreground">Theme customization will be available soon.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
