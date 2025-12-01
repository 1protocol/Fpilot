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
import { useFirebase, setDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, collection, query } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

const apiKeys = [
    { id: "1", exchange: "Binance", key: "abc...xyz", status: "Active" },
    { id: "2", exchange: "Bybit", key: "def...uvw", status: "Active" },
    { id: "3", exchange: "Coinbase", key: "ghi...rst", status: "Expired" },
];

const riskProfileSchema = z.object({
  valueAtRisk: z.number().min(0).max(100),
  expectedShortfall: z.number().min(0).max(100),
  maxPositionSize: z.number().min(0).max(100),
});

export default function SettingsPage() {
    const { user, auth, firestore, isUserLoading } = useFirebase();
    const { toast } = useToast();
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingRisk, setIsSavingRisk] = useState(false);
    const [displayName, setDisplayName] = useState('');
    
    // Risk Profile ID is hardcoded to "default" for simplicity, assuming one profile per user.
    const riskProfileDocRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid, 'risk_profiles', 'default');
    }, [user, firestore]);

    const { data: riskProfileData, isLoading: isRiskProfileLoading } = useDoc(riskProfileDocRef);

    const riskForm = useForm<z.infer<typeof riskProfileSchema>>({
        resolver: zodResolver(riskProfileSchema),
        defaultValues: {
            valueAtRisk: 5,
            expectedShortfall: 10,
            maxPositionSize: 25,
        },
    });

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
        }
    }, [user]);

    useEffect(() => {
        if (riskProfileData) {
            riskForm.reset({
                valueAtRisk: riskProfileData.valueAtRisk,
                expectedShortfall: riskProfileData.expectedShortfall,
                maxPositionSize: riskProfileData.maxPositionSize,
            });
        }
    }, [riskProfileData, riskForm]);


    const handleProfileSave = async () => {
        if (!user || !auth || !firestore) return;
        setIsSavingProfile(true);
        try {
            await updateProfile(user, { displayName });
            const userDocRef = doc(firestore, "users", user.uid);
            setDocumentNonBlocking(userDocRef, { username: displayName }, { merge: true });
            toast({ title: "Profile Updated" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsSavingProfile(false);
        }
    }

    const onRiskProfileSave = async (values: z.infer<typeof riskProfileSchema>) => {
        if (!riskProfileDocRef || !user) return;
        setIsSavingRisk(true);
        const dataToSave = {
            ...values,
            userId: user.uid,
            id: 'default'
        };
        // setDocumentNonBlocking handles both create and update
        setDocumentNonBlocking(riskProfileDocRef, dataToSave, { merge: true });
        toast({ title: "Risk Profile Updated" });
        setIsSavingRisk(false);
    };

    const getStatusBadgeVariant = (status: string) => {
        return status === "Active" ? "default" : "destructive";
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Settings"
                description="Manage your account, API keys, and platform preferences."
            />
            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 md:w-max">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="risk-management">Risk Management</TabsTrigger>
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
                                    <Button onClick={handleProfileSave} disabled={isSavingProfile}>
                                        {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </>
                             ) : (
                                <p className="text-muted-foreground">Please log in to manage your profile.</p>
                             )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="risk-management">
                    <Form {...riskForm}>
                        <form onSubmit={riskForm.handleSubmit(onRiskProfileSave)}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Risk Management</CardTitle>
                                    <CardDescription>Define your personal risk parameters for AI-driven actions.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {isRiskProfileLoading ? <p>Loading risk profile...</p> : (
                                    <>
                                        <FormField
                                            control={riskForm.control}
                                            name="valueAtRisk"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex justify-between items-center">
                                                        <FormLabel>Value at Risk (VaR)</FormLabel>
                                                        <span className="text-sm font-mono">{field.value}%</span>
                                                    </div>
                                                    <FormControl>
                                                        <Slider
                                                            min={0} max={100} step={1}
                                                            onValueChange={(vals) => field.onChange(vals[0])}
                                                            value={[field.value]}
                                                            />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={riskForm.control}
                                            name="expectedShortfall"
                                            render={({ field }) => (
                                                <FormItem>
                                                     <div className="flex justify-between items-center">
                                                        <FormLabel>Expected Shortfall (CVaR)</FormLabel>
                                                        <span className="text-sm font-mono">{field.value}%</span>
                                                    </div>
                                                    <FormControl>
                                                        <Slider
                                                            min={0} max={100} step={1}
                                                            onValueChange={(vals) => field.onChange(vals[0])}
                                                            value={[field.value]}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={riskForm.control}
                                            name="maxPositionSize"
                                            render={({ field }) => (
                                                <FormItem>
                                                     <div className="flex justify-between items-center">
                                                        <FormLabel>Max Position Size</FormLabel>
                                                        <span className="text-sm font-mono">{field.value}%</span>
                                                    </div>
                                                    <FormControl>
                                                        <Slider
                                                            min={0} max={100} step={1}
                                                            onValueChange={(vals) => field.onChange(vals[0])}
                                                            value={[field.value]}
                                                            />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                    )}
                                    <Button type="submit" disabled={isSavingRisk || isRiskProfileLoading}>
                                        {isSavingRisk && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Risk Profile
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>
                    </Form>
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
                            <div className="rounded-md border hidden md:block">
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
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(key.status)} className={cn(key.status === 'Active' && 'bg-green-600/80')}>{key.status}</Badge>
                                                </TableCell>
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
                            <div className="space-y-4 md:hidden">
                                {apiKeys.map((key) => (
                                    <Card key={key.id} className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="font-semibold text-card-foreground">{key.exchange}</span>
                                            <Badge variant={getStatusBadgeVariant(key.status)} className={cn(key.status === 'Active' && 'bg-green-600/80')}>{key.status}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Public Key</p>
                                                <p className="font-mono text-sm">{key.key}</p>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
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
                                    <SelectTrigger className="w-full md:w-[280px]">
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
