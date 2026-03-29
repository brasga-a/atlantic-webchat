"use client";

import { Camera, Check, X, Loader2 } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/providers/user-provider";
import { user as userService } from "@/services/user";

function FieldRow({ icon: Icon, label, children }: {
    icon?: React.ComponentType<{ className?: string }>;
    label?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                {Icon && (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
                            <Icon className="size-4 text-muted-foreground" />
                    </div>
                 )}
                <p className="text-sm font-medium">{label}</p>
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

export default function ProfilePage() {
    const currentUser = useUser();
    const [name, setName] = useState(currentUser?.name);
    const [username, setUsername] = useState(currentUser?.username);
    const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // const [bio, setBio] = useState(currentUser?.bio);

    const handleUsernameChange = useCallback((value: string) => {
        setUsername(value);
        setUsernameError(null);

        if (!value || value === currentUser?.username) {
            setUsernameStatus("idle");
            if (debounceRef.current) clearTimeout(debounceRef.current);
            return;
        }

        setUsernameStatus("checking");

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            const { data, error } = await userService.verifyUsername({ username: value });

            if (error) {
                setUsernameStatus("idle");
                setUsernameError(error.message);
                return;
            }

            setUsernameStatus(data?.available ? "available" : "taken");
        }, 500);
    }, [currentUser?.username]);

    const hasChanges = name !== currentUser?.name || username !== currentUser?.username;
    const canSave = hasChanges && usernameStatus !== "checking" && usernameStatus !== "taken" && !saving;

    const handleSave = async () => {
        setSaving(true);
        setSaveError(null);

        const { error } = await userService.updateProfile({ name, username });

        setSaving(false);

        if (error) {
            setSaveError(error.message);
            return;
        }

        window.location.reload();
    };

    return (
        <div className="h-full flex flex-col">
            <div className="shrink-0 flex items-center gap-3 px-4 py-3 h-16 border-b">
                <h1 className="text-lg font-medium">Profile</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                <Section title="Avatar">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="size-16">
                                <AvatarImage src="https://github.com/brasga-a.png" />
                                <AvatarFallback>BR</AvatarFallback>
                            </Avatar>
                            <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 shadow-sm hover:bg-primary/90 transition-colors">
                                <Camera className="size-3" />
                            </button>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Profile picture</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                        </div>
                    </div>
                </Section>

                <Separator />

                <Section title="Personal info">
                    <FieldRow label="Display name">
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </FieldRow>

                    <FieldRow label="Username">
                        <div className="flex flex-col gap-1.5">
                            <div className={`flex items-center rounded-lg border overflow-hidden transition-shadow ${
                                usernameStatus === "available" ? "border-green-500 focus-within:ring-green-500/50" :
                                usernameStatus === "taken" || usernameError ? "border-red-500 focus-within:ring-red-500/50" :
                                "border-input focus-within:border-ring focus-within:ring-ring/50"
                            } focus-within:ring-3`}>
                                <span className="px-2.5 text-sm text-muted-foreground bg-muted border-r border-input h-8 flex items-center">@</span>
                                <input
                                    className="flex-1 h-8 px-2.5 text-sm bg-transparent outline-none"
                                    value={username}
                                    onChange={(e) => handleUsernameChange(e.target.value)}
                                />
                                <span className="px-2.5 flex items-center">
                                    {usernameStatus === "checking" && <Loader2 className="size-4 text-muted-foreground animate-spin" />}
                                    {usernameStatus === "available" && <Check className="size-4 text-green-500" />}
                                    {usernameStatus === "taken" && <X className="size-4 text-red-500" />}
                                </span>
                            </div>
                            {usernameStatus === "taken" && (
                                <p className="text-xs text-red-500">Username is already taken</p>
                            )}
                            {usernameError && (
                                <p className="text-xs text-red-500">{usernameError}</p>
                            )}
                            {usernameStatus === "available" && (
                                <p className="text-xs text-green-500">Username is available</p>
                            )}
                        </div>
                    </FieldRow>

                    {/* <FieldRow label="Bio">
                        <Textarea
                            placeholder="Tell people a little about yourself..."
                            className="resize-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </FieldRow> */}
                </Section>

                {saveError && (
                    <p className="text-xs text-red-500 text-right">{saveError}</p>
                )}

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={!canSave}>
                        {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                        {saving ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
