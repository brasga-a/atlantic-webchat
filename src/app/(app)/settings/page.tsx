"use client";

import { useState } from "react";
import { ArrowLeft, Bell, Eye, Monitor, Moon, MoonStar, Sun, Trash2, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/store/preferences";
import { useUser } from "@/providers/user-provider";
import { deleteProfile } from "@/services/user/delete";

const themes = [
    { value: "system", label: "System", icon: Monitor },
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "more-dark", label: "More Dark", icon: MoonStar },
] as const;

function SettingRow({ icon: Icon, label, description, children }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 flex-1">
            <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
                    <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-medium">{label}</p>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </div>
            </div>
            {children}
        </div>
    );
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
            <div className="flex flex-col gap-4">{children}</div>
        </div>
    );
}

export default function SettingsPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { islandStyle, notifications, sounds, readReceipts, onlineStatus,
            setIslandStyle, setNotifications, setSounds, setReadReceipts, setOnlineStatus } = usePreferences();
    const user = useUser();
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [open, setOpen] = useState(false);

    const canDelete = confirmText === user?.username;

    async function handleDeleteAccount() {
        setIsDeleting(true);
        const { error } = await deleteProfile();
        setIsDeleting(false);

        if (error) return;

        window.location.href = "/auth/signin";
    }

    return (
        <div className="h-full flex flex-col">
            <div className="shrink-0 flex items-center gap-3 px-4 py-3 h-16 border-b">
                <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => router.push("/")}>
                    <ArrowLeft className="size-4" />
                </Button>
                <h1 className="text-lg font-medium">Settings</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                <Section title="Appearance">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {themes.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => setTheme(value)}
                                className={cn(
                                    "flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors",
                                    theme === value
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-border hover:bg-muted/50 text-muted-foreground"
                                )}
                            >
                                <Icon className="size-5" />
                                <span className="text-xs font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                    {/* Fixed or Island style */}
                    <SettingRow icon={Sun} label="Island Style" description="Enable or disable island style layout">
                       <Switch checked={islandStyle} onCheckedChange={setIslandStyle} />
                    </SettingRow>
                </Section>

                <Separator />

                {/* <Section title="Notifications">
                    <SettingRow icon={Bell} label="Push notifications" description="Receive alerts for new messages">
                        <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </SettingRow>
                    <SettingRow icon={Volume2} label="Message sounds" description="Play a sound when a message arrives">
                        <Switch checked={sounds} onCheckedChange={setSounds} />
                    </SettingRow>
                </Section>

                <Separator />

                <Section title="Privacy">
                    <SettingRow icon={Eye} label="Read receipts" description="Let others know when you've read their messages">
                        <Switch checked={readReceipts} onCheckedChange={setReadReceipts} />
                    </SettingRow>
                    <SettingRow icon={Eye} label="Show online status" description="Let others see when you're online">
                        <Switch checked={onlineStatus} onCheckedChange={setOnlineStatus} />
                    </SettingRow>
                </Section> 

                <Separator />*/}

                <Section title="Danger zone">
                    <SettingRow icon={Trash2} label="Delete account" description="Permanently delete your account and all data">
                        <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (!open) setConfirmText(""); }}>
                            <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                                Delete
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete account</DialogTitle>
                                    <DialogDescription>
                                        This action is <strong>irreversible</strong>. This will permanently delete your
                                        account, messages, and all associated data.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex flex-col gap-2">
                                    <p className="text-sm text-muted-foreground">
                                        To confirm, type <strong className="text-foreground">{user?.username}</strong> below:
                                    </p>
                                    <Input
                                        placeholder="Enter your username"
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        autoComplete="off"
                                    />
                                </div>

                                <DialogFooter>
                                    <DialogClose render={<Button variant="outline" />}>
                                        Cancel
                                    </DialogClose>
                                    <Button
                                        variant="destructive"
                                        disabled={!canDelete || isDeleting}
                                        onClick={handleDeleteAccount}
                                    >
                                        {isDeleting ? "Deleting..." : "Delete my account"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </SettingRow>
                </Section>
            </div>
        </div>
    );
}
