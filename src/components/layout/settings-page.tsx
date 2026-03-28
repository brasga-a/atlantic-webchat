"use client";

import { Bell, Eye, Monitor, Moon, Sun, Trash2, Volume2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

const themes = [
    { value: "system", label: "System", icon: Monitor },
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
] as const;

function SettingRow({ icon: Icon, label, description, children }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
            <div className="flex flex-col gap-3">{children}</div>
        </div>
    );
}

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [sounds, setSounds]               = useState(true);
    const [readReceipts, setReadReceipts]   = useState(true);
    const [onlineStatus, setOnlineStatus]   = useState(true);

    return (
        <div className="h-full flex flex-col">
            <div className="shrink-0 flex items-center gap-3 px-4 py-3 h-16 border-b">
                <h1 className="text-lg font-medium">Settings</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                <Section title="Appearance">
                    <div className="grid grid-cols-3 gap-2">
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
                </Section>

                <Separator />

                <Section title="Notifications">
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

                <Separator />

                <Section title="Danger zone">
                    <SettingRow icon={Trash2} label="Delete account" description="Permanently delete your account and all data">
                        <Button variant="destructive" size="sm">Delete</Button>
                    </SettingRow>
                </Section>
            </div>
        </div>
    );
}
