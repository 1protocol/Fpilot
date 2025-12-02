'use client';

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bot, Loader2, PlusCircle, Trash2, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useFirebase, setDocumentNonBlocking, useDoc, useMemoFirebase, useCollection, deleteDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, collection, serverTimestamp } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export type ApiKey = {
    id: string;
    exchange: string;
    publicKey: string;
    status: 'Active' | 'Expired';
    userId: string;
}

const profileSchema = z.object({
  displayName: z.string().min(3, { message: "Name must be at least 3 characters." }),
  photoURL: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')),
});

const riskProfileSchema = z.object({
  valueAtRisk: z.number().min(0).max(100),
  expectedShortfall: z.number().min(0).max(100),
  maxPositionSize: z.number().min(0).max(100),
});

const apiKeySchema = z.object({
    exchange: z.string().min(1, "Please select an exchange."),
    publicKey: z.string().min(10, "Public key is too short."),
    secretKey: z.string().min(10, "Secret key is too short."),
})

const aiConfigSchema = z.object({
    provider: z.enum(["google", "openai", "anthropic", "deepseek"]),
    model: z.string().min(1, "Model name is required."),
    apiKey: z.string().optional(),
}).refine(data => {
    return data.provider === 'google' || (data.apiKey && data.apiKey.length > 0);
}, {
    message: "API Key is required for this provider.",
    path: ["apiKey"],
});

const providerModels = {
    google: [
        { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Fast & Efficient)" },
        { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro (Balanced)" },
        { value: "gemini-2.5-ultra", label: "Gemini 2.5 Ultra (Most Powerful)", disabled: true },
    ],
    openai: [
        { value: "gpt-4o", label: "GPT-4o (Latest)" },
        { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
        { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    ],
    anthropic: [
        { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
        { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
        { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
    ],
    deepseek: [
        { value: "deepseek-chat", label: "DeepSeek-V2 Chat" },
        { value: "deepseek-coder", label: "DeepSeek-V2 Coder" },
    ]
}

const ThemeCustomizer = () => {
    const { theme, setTheme, isLoading } = useTheme();

    if (isLoading) {
        return (
             <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Primary Color Hue</Label>
                    <span className="text-sm font-mono text-muted-foreground">{theme?.primaryHue}</span>
                </div>
                <Slider 
                    value={[theme?.primaryHue ?? 275]}
                    onValueChange={(value) => setTheme({ primaryHue: value[0] })}
                    max={360}
                    step={1}
                />
            </div>
             <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <Label>Accent Color Hue</Label>
                    <span className="text-sm font-mono text-muted-foreground">{theme?.accentHue}</span>
                </div>
                <Slider 
                    value={[theme?.accentHue ?? 258]}
                    onValueChange={(value) => setTheme({ accentHue: value[0] })}
                    max={360}
                    step={1}
                />
            </div>
        </div>
    )
}

export default function SettingsPage() {
    const { user, auth, firestore, isUserLoading } = useFirebase();
    const { toast } = useToast();
    const [isAddKeyOpen, setAddKeyOpen] = useState(false);
    
    // Risk Profile Data
    const riskProfileDocRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid, 'risk_profiles', 'default');
    }, [user, firestore]);
    const { data: riskProfileData, isLoading: isRiskProfileLoading } = useDoc(riskProfileDocRef);

    // API Keys Data
    const apiKeysCollectionRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'api_keys');
    }, [user, firestore]);
    const { data: apiKeys, isLoading: areApiKeysLoading } = useCollection<ApiKey>(apiKeysCollectionRef);

    // AI Config Data
    const aiConfigDocRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid, 'config', 'ai');
    }, [user, firestore]);
    const { data: aiConfigData, isLoading: isAiConfigLoading } = useDoc(aiConfigDocRef);

    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        values: { 
            displayName: user?.displayName || '',
            photoURL: user?.photoURL || '',
        },
    });

    const riskForm = useForm<z.infer<typeof riskProfileSchema>>({
        resolver: zodResolver(riskProfileSchema),
        values: {
            valueAtRisk: riskProfileData?.valueAtRisk ?? 5,
            expectedShortfall: riskProfileData?.expectedShortfall ?? 10,
            maxPositionSize: riskProfileData?.maxPositionSize ?? 25,
        },
    });

    const apiKeyForm = useForm<z.infer<typeof apiKeySchema>>({
        resolver: zodResolver(apiKeySchema),
        defaultValues: {
            exchange: "",
            publicKey: "",
            secretKey: "",
        },
    });

    const aiConfigForm = useForm<z.infer<typeof aiConfigSchema>>({
        resolver: zodResolver(aiConfigSchema),
        values: {
            provider: aiConfigData?.provider ?? "google",
            model: aiConfigData?.model ?? "gemini-2.5-flash",
            apiKey: aiConfigData?.apiKey ?? "",
        },
    });

    useEffect(() => {
        if (user) {
            profileForm.reset({ 
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
            });
        }
    }, [user, profileForm]);

    useEffect(() => {
        if (riskProfileData) {
            riskForm.reset({
                valueAtRisk: riskProfileData.valueAtRisk,
                expectedShortfall: riskProfileData.expectedShortfall,
                maxPositionSize: riskProfileData.maxPositionSize,
            });
        }
    }, [riskProfileData, riskForm]);
    
    useEffect(() => {
        if (aiConfigData) {
            aiConfigForm.reset({
                provider: aiConfigData.provider || 'google',
                model: aiConfigData.model || 'gemini-2.5-flash',
                apiKey: aiConfigData.apiKey || '',
            });
        }
    }, [aiConfigData, aiConfigForm]);

    const watchedAiProvider = aiConfigForm.watch("provider");
    const watchedPhotoUrl = profileForm.watch("photoURL");

    // Reset model when provider changes
    useEffect(() => {
        const defaultModels: Record<string, string> = {
            google: 'gemini-2.5-flash',
            openai: 'gpt-4o',
            anthropic: 'claude-3-sonnet-20240229',
            deepseek: 'deepseek-chat',
        };
        const newProvider = aiConfigForm.getValues('provider');
        // Only reset if the current model is not valid for the new provider
        const currentModelIsValid = providerModels[newProvider as keyof typeof providerModels]?.some(m => m.value === aiConfigForm.getValues('model'));
        
        if (!currentModelIsValid) {
            aiConfigForm.setValue('model', defaultModels[newProvider]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedAiProvider]);


    const onProfileSave = async (values: z.infer<typeof profileSchema>) => {
        if (!user || !auth || !firestore) return;
        profileForm.formState.isSubmitting;
        try {
            await updateProfile(user, { 
                displayName: values.displayName,
                photoURL: values.photoURL,
            });
            const userDocRef = doc(firestore, "users", user.uid);
            setDocumentNonBlocking(userDocRef, { 
                username: values.displayName,
                photoURL: values.photoURL 
            }, { merge: true });
            toast({ title: "Profile Updated" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        }
    }

    const onRiskProfileSave = async (values: z.infer<typeof riskProfileSchema>) => {
        if (!riskProfileDocRef || !user) return;
        riskForm.formState.isSubmitting;
        const dataToSave = {
            ...values,
            userId: user.uid,
            id: 'default'
        };
        setDocumentNonBlocking(riskProfileDocRef, dataToSave, { merge: true });
        toast({ title: "Risk Profile Updated" });
    };
    
    const onAiConfigSave = async (values: z.infer<typeof aiConfigSchema>) => {
        if (!aiConfigDocRef) return;
        aiConfigForm.formState.isSubmitting;
        
        let dataToSave = { ...values };
        if (values.provider === "google") {
            dataToSave.apiKey = ""; // Clear API key for Google provider
        }

        setDocumentNonBlocking(aiConfigDocRef, dataToSave, { merge: true });
        toast({ title: "AI Configuration Saved" });
    }

    const onApiKeySave = async (values: z.infer<typeof apiKeySchema>) => {
        if (!apiKeysCollectionRef || !user) return;
        
        const newKeyData = {
            userId: user.uid,
            exchange: values.exchange,
            publicKey: values.publicKey,
            status: "Active" as const,
            createdAt: serverTimestamp(),
        };

        await addDocumentNonBlocking(apiKeysCollectionRef, newKeyData);
        toast({ title: "API Key Added", description: `Your ${values.exchange} key has been securely added.` });
        apiKeyForm.reset();
        setAddKeyOpen(false);
    }

    const handleDeleteApiKey = (keyId: string) => {
        if (!user || !firestore) return;
        const keyDocRef = doc(firestore, 'users', user.uid, 'api_keys', keyId);
        deleteDocumentNonBlocking(keyDocRef);
        toast({ title: "API Key Deleted" });
    };

    const getStatusBadgeVariant = (status: string) => {
        return status === "Active" ? "default" : "destructive";
    };

    const MaskedApiKey = ({ apiKey }: { apiKey: string | undefined }) => {
        if (!apiKey) return <span className="text-muted-foreground italic">Not set</span>;
        const masked = `••••••••••••${apiKey.slice(-4)}`;
        return (
            <div className="flex items-center justify-between">
                <span className="font-mono">{masked}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => aiConfigForm.setValue("apiKey", "")}>
                    <X className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>
        );
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
                                <CardDescription className="mt-1.5">Update your personal information and avatar.</CardDescription>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(onProfileSave)}>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-4">
                                            {isUserLoading ? (
                                                <div className="space-y-4">
                                                    <Skeleton className="h-6 w-24" />
                                                    <Skeleton className="h-10 w-full" />
                                                    <Skeleton className="h-6 w-24" />
                                                    <Skeleton className="h-10 w-full" />
                                                </div>
                                            ) : user ? (
                                                <>
                                                    <FormField
                                                        control={profileForm.control}
                                                        name="displayName"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Full Name</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <Input type="email" value={user.email || ''} readOnly disabled />
                                                    </FormItem>
                                                    <FormField
                                                        control={profileForm.control}
                                                        name="photoURL"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Avatar URL</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="https://example.com/avatar.png" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </>
                                            ) : (
                                                <p className="text-muted-foreground">Please log in to manage your profile.</p>
                                            )}
                                        </div>
                                         <div className="md:col-span-1 flex flex-col items-center justify-center space-y-2">
                                            <Avatar className="h-24 w-24 border">
                                                <AvatarImage src={watchedPhotoUrl} />
                                                <AvatarFallback>
                                                    {user?.displayName?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <p className="text-sm text-muted-foreground">Avatar Preview</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" disabled={profileForm.formState.isSubmitting || isUserLoading}>
                                            {profileForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Form>
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
                                        {isRiskProfileLoading ? (
                                             <div className="space-y-6">
                                                <Skeleton className="h-10 w-full" />
                                                <Skeleton className="h-10 w-full" />
                                                <Skeleton className="h-10 w-full" />
                                            </div>
                                        ) : (
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
                                        <Button type="submit" disabled={riskForm.formState.isSubmitting || isRiskProfileLoading}>
                                            {riskForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                                <Dialog open={isAddKeyOpen} onOpenChange={setAddKeyOpen}>
                                    <DialogTrigger asChild>
                                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Key</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New API Key</DialogTitle>
                                            <DialogDescription>
                                                Securely add a new API key from a supported exchange. The secret key is only used to establish a connection and is never stored.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form {...apiKeyForm}>
                                            <form onSubmit={apiKeyForm.handleSubmit(onApiKeySave)} className="space-y-4 py-4">
                                                 <FormField
                                                    control={apiKeyForm.control}
                                                    name="exchange"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                        <FormLabel>Exchange</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select an exchange" />
                                                            </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Binance">Binance</SelectItem>
                                                                <SelectItem value="Bybit">Bybit</SelectItem>
                                                                <SelectItem value="Coinbase">Coinbase</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                        </FormItem>
                                                    )}
                                                    />
                                                <FormField
                                                    control={apiKeyForm.control}
                                                    name="publicKey"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>API Public Key</FormLabel>
                                                            <FormControl><Input placeholder="Your public key" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                 <FormField
                                                    control={apiKeyForm.control}
                                                    name="secretKey"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>API Secret Key</FormLabel>
                                                            <FormControl><Input type="password" placeholder="Your secret key" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <DialogFooter>
                                                    <Button variant="ghost" type="button" onClick={() => setAddKeyOpen(false)}>Cancel</Button>
                                                    <Button type="submit" disabled={apiKeyForm.formState.isSubmitting}>
                                                        {apiKeyForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                        Add Key
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                 {areApiKeysLoading ? (
                                    <div className="text-center p-8 text-muted-foreground"> <Loader2 className="h-6 w-6 animate-spin mx-auto"/> </div>
                                ) : apiKeys && apiKeys.length > 0 ? (
                                <>
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
                                                    <TableCell className="font-mono">{key.publicKey.substring(0, 4)}...{key.publicKey.slice(-4)}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusBadgeVariant(key.status)} className={cn(key.status === 'Active' && 'bg-green-600/80')}>{key.status}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                         <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>This will permanently delete the API key for {key.exchange}. This action cannot be undone.</AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDeleteApiKey(key.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
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
                                                    <p className="font-mono text-sm">{key.publicKey.substring(0, 4)}...{key.publicKey.slice(-4)}</p>
                                                </div>
                                                 <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>This will permanently delete the API key for {key.exchange}. This action cannot be undone.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteApiKey(key.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                                </>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p>No API keys added yet.</p>
                                        <p className="text-sm">Click "Add New Key" to connect an exchange.</p>
                                    </div>
                                )}
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                 <AccordionItem value="ai-management">
                     <Card>
                        <AccordionTrigger className="p-6 hover:no-underline">
                             <div className="text-left">
                                <CardTitle>AI Management</CardTitle>
                                <CardDescription className="mt-1.5">Configure the AI models used by the platform.</CardDescription>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Form {...aiConfigForm}>
                                <form onSubmit={aiConfigForm.handleSubmit(onAiConfigSave)}>
                                    <CardContent className="space-y-4">
                                        {isAiConfigLoading ? (
                                            <div className="space-y-4">
                                                <Skeleton className="h-10 w-full" />
                                                <Skeleton className="h-10 w-full" />
                                            </div>
                                        ) : (
                                            <>
                                                <FormField
                                                    control={aiConfigForm.control}
                                                    name="provider"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>AI Provider</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select an AI provider" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="google">Google Gemini</SelectItem>
                                                                    <SelectItem value="openai">OpenAI</SelectItem>
                                                                    <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                                                                    <SelectItem value="deepseek">DeepSeek</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={aiConfigForm.control}
                                                    name="model"
                                                    render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Language Model</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a model" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {(providerModels[watchedAiProvider as keyof typeof providerModels] || []).map((model) => (
                                                                    <SelectItem key={model.value} value={model.value} disabled={model.disabled}>
                                                                        {model.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                                />
                                                {watchedAiProvider !== "google" && (
                                                    <Controller
                                                        control={aiConfigForm.control}
                                                        name="apiKey"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>API Key</FormLabel>
                                                                <FormControl>
                                                                    {field.value ? (
                                                                        <MaskedApiKey apiKey={field.value} />
                                                                    ) : (
                                                                        <Input type="password" placeholder="Your API Key" {...field} />
                                                                    )}
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </CardContent>
                                     <CardFooter>
                                        <Button type="submit" disabled={aiConfigForm.formState.isSubmitting || isAiConfigLoading}>
                                            {aiConfigForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save AI Configuration
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Form>
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
                                <div className="space-y-4">
                                    <h4 className="font-medium">Email Notifications</h4>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="trade-alerts" className="text-base">Trade Alerts</Label>
                                            <p className="text-sm text-muted-foreground">Receive an email when a trade order is filled.</p>
                                        </div>
                                        <Switch id="trade-alerts" />
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="bot-status" className="text-base">Bot Status</Label>
                                            <p className="text-sm text-muted-foreground">Get notified if a bot encounters an error or stops unexpectedly.</p>
                                        </div>
                                        <Switch id="bot-status" />
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <h4 className="font-medium">Push Notifications</h4>
                                     <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                 <Label htmlFor="push-trade-alerts" className="text-base">Trade Alerts</Label>
                                                 <Badge variant="outline">Soon</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Receive a push notification for every filled order.</p>
                                        </div>
                                        <Switch id="push-trade-alerts" disabled />
                                    </div>
                                </div>
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                <AccordionItem value="language">
                    <Card>
                        <AccordionTrigger className="p-6 hover:no-underline">
                             <div className="text-left">
                                <CardTitle>Language &amp; Region</CardTitle>
                                <CardDescription className="mt-1.5">Choose the language and region for your account.</CardDescription>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger className="w-full md:w-[280px]">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">
                                                <span className="flex items-center gap-2">🇬🇧 English</span>
                                            </SelectItem>
                                            <SelectItem value="tr">
                                                <span className="flex items-center gap-2">🇹🇷 Türkçe</span>
                                            </SelectItem>
                                            <SelectItem value="es" disabled>
                                                <span className="flex items-center gap-2">🇪🇸 Español (coming soon)</span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
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
                            <CardContent>
                                <ThemeCustomizer />
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

    