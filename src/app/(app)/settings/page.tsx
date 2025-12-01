'use client';

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
        setDocumentNonBlocking(riskProfileDocRef, dataToSave, { merge: true });
        toast({ title: "Risk Profile Updated" });
        setIsSavingRisk(false);
    };

    const getStatusBadgeVariant = (status: string) => {
        return status === "Active" ? "default" : "destructive";
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Settings"
                description="Manage your account, API keys, and platform preferences."
            />
            <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="profile">
                <AccordionItem value="profile">
                    <Card>
                        <AccordionTrigger className="p-6 hover:no-underline">
                             <div className="text-left">
                                <CardTitle>Profile</CardTitle>
                                <CardDescription className="mt-1.5">Update your personal information.</CardDescription>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent>
                                {isUserLoading ? <p>Loading...</p> : user ? (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" value={user.email || ''} readOnly disabled />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">Please log in to manage your profile.</p>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleProfileSave} disabled={isSavingProfile || isUserLoading}>
                                    {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                <AccordionItem value="risk-management">
                     <Card>
                        <AccordionTrigger className="p-6 hover:no-underline">
                             <div className="text-left">
                                <CardTitle>Risk Management</CardTitle>
                                <CardDescription className="mt-1.5">Define your personal risk parameters for AI-driven actions.</CardDescription>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                             <Form {...riskForm}>
                                <form onSubmit={riskForm.handleSubmit(onRiskProfileSave)}>
                                    <CardContent className="space-y-6">
                                        {isRiskProfileLoading ? <p>Loading risk profile...</p> : (
                                        <>
                                            <FormField
                                                control={riskForm.control}
                                                name="valueAtRisk"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="flex justify-between items-center">
                                                            <FormLabel>Value at Risk (VaR)</FormLabel>
                                                            <span className="text-sm font-mono text-muted-foreground">{field.value}%</span>
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
                                                            <span className="text-sm font-mono text-muted-foreground">{field.value}%</span>
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
                                                            <span className="text-sm font-mono text-muted-foreground">{field.value}%</span>
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
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" disabled={isSavingRisk || isRiskProfileLoading}>
                                            {isSavingRisk && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Risk Profile
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Form>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                <AccordionItem value="api-keys">
                     <Card>
                        <AccordionTrigger className="p-6 hover:no-underline">
                            <div className="text-left">
                                <CardTitle>API Keys</CardTitle>
                                <CardDescription className="mt-1.5">Manage your exchange API keys for live trading.</CardDescription>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                             <CardHeader className="flex-row items-center justify-between pt-0 px-6 pb-6">
                                <div/>
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
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                 <AccordionItem value="notifications">
                     <Card>
                        <AccordionTrigger className="p-6 hover:no-underline">
                             <div className="text-left">
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription className="mt-1.5">Choose how you want to be notified.</CardDescription>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
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
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                <AccordionItem value="appearance">
                    <Card>
                        <AccordionTrigger className="p-6 hover:no-underline">
                             <div className="text-left">
                                <CardTitle>Appearance</CardTitle>
                                <CardDescription className="mt-1.5">Customize the look and feel of the application.</CardDescription>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Theme</Label>
                                    <p className="text-sm text-muted-foreground">Theme customization will be available soon.</p>
                                </div>
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
