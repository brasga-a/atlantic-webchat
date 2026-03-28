"use client";

import { AtSign, Camera, FileText, User } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

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
    const [name, setName] = useState("Bragolino");
    const [username, setUsername] = useState("braga");
    const [bio, setBio] = useState("");

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
                        <div className="flex items-center rounded-lg border border-input overflow-hidden focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 transition-shadow">
                            <span className="px-2.5 text-sm text-muted-foreground bg-muted border-r border-input h-8 flex items-center">@</span>
                            <input
                                className="flex-1 h-8 px-2.5 text-sm bg-transparent outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </FieldRow>

                    <FieldRow label="Bio">
                        <Textarea
                            placeholder="Tell people a little about yourself..."
                            className="resize-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </FieldRow>
                </Section>

                <div className="flex justify-end">
                    <Button>Save changes</Button>
                </div>
            </div>
        </div>
    );
}
