"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronUp, LogOut, MessageSquarePlus, Search, Settings, User } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useUser } from "@/providers/user-provider";

import { mockContacts } from "@/data/contacts";

function statusColor(status: string) {
    switch (status) {
        case "online": return "bg-green-500";
        case "away":   return "bg-yellow-500";
        default:       return "bg-gray-500";
    }
}

import { useRouter } from "next/navigation";
import { auth } from "@/services/auth/auth";

const handleLogout = async () => {
    const response = await auth.signOut();
}

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const user = useUser();
    const router = useRouter();

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center px-4 py-3 h-16 border-b">
                    <h1 className="text-lg font-medium">Messages</h1>
                    <Button variant="ghost" size="icon-lg" className="ml-auto">
                        <MessageSquarePlus className="size-4" />
                    </Button>
                </div>
                {/* Search */}
                <div className="p-4 shrink-0">
                    <InputGroup className="h-9 rounded-sm ring-0!">
                        <InputGroupAddon><Search /></InputGroupAddon>
                        <InputGroupInput placeholder="Search..." className="border-0 bg-transparent focus:ring-0" />
                    </InputGroup>
                </div>

                {/* Chat list */}
                <div className="flex-1 px-4 overflow-y-auto no-scrollbar">
                    {mockContacts.map((chat) => (
                        <div key={chat.username} onClick={() => { router.push(`/chat/${chat.id}`) }} className="p-2 w-full rounded-md flex items-center gap-2 hover:bg-muted cursor-pointer not-last:mb-1">
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage src={chat.avatar} />
                                <AvatarFallback>{chat.name[0]}</AvatarFallback>
                                <AvatarBadge className={cn(statusColor(chat.status))} />
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <p className="text-sm font-medium">{chat.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Animated profile footer */}
            <div className="shrink-0">

                <AnimatePresence>
                    {open && (
                        <motion.div
                            key="profile-menu"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="flex flex-col py-2 px-1 border-t">
                                <Button variant="ghost" onClick={() => { router.push("/profile"); setOpen(false) }} className="justify-start rounded-sm h-9 text-muted-foreground">
                                    <User className="size-4" /> Profile
                                </Button>
                                <Button variant="ghost" onClick={() => { router.push("/settings"); setOpen(false) }} className="justify-start rounded-sm h-9 text-muted-foreground">
                                    <Settings className="size-4" /> Settings
                                </Button>
                                <Separator className="my-1 w-full" />
                                <Button variant="ghost" onClick={handleLogout} className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive rounded-sm h-9">
                                    <LogOut className="size-4" /> Logout
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-3 px-4 py-3 h-16 hover:bg-muted border-t transition-colors w-full text-left"
                >
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src="https://github.com/brasga-a.png" />
                        <AvatarFallback>{user?.name?.[0] ?? "?"}</AvatarFallback>
                        <AvatarBadge className="bg-green-500" />
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold">{user?.name ?? "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">@{user?.username ?? "unknown"}</p>
                    </div>
                    <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="ml-auto shrink-0"
                    >
                        <ChevronUp className="size-4 text-muted-foreground" />
                    </motion.div>
                </button>
            </div>
        </div>
    )
}
