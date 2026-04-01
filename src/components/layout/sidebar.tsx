"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronUp, Loader2, LogOut, MessageSquarePlus, Search, Settings, User } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "../ui/dialog";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useUser } from "@/providers/user-provider";

import { createChat } from "@/services/chat/create";
import { useChats } from "@/providers/chat-provider";
import { useQueryClient } from "@tanstack/react-query";

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
    if (response.data) {
        window.location.href = "/auth/signin";
    } else {
        alert("Failed to log out");
    }
}

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const { chats } = useChats();
    const queryClient = useQueryClient();
    const [newChatIdentifier, setNewChatIdentifier] = useState("");
    const [newChatError, setNewChatError] = useState<string | null>(null);
    const [creatingChat, setCreatingChat] = useState(false);
    const user = useUser();
    const router = useRouter();

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center px-4 py-3 h-16 border-b">
                    <h1 className="text-lg font-medium">Messages</h1>
                    <Dialog>
                        <DialogTrigger render={
                            <Button variant="ghost" size="icon-lg" className="ml-auto" />
                        }>
                            <MessageSquarePlus className="size-4" />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New chat</DialogTitle>
                                <DialogDescription>
                                    Enter a username or email to start a conversation.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-2">
                                <Input
                                    placeholder="Username or email"
                                    value={newChatIdentifier}
                                    onChange={(e) => { setNewChatIdentifier(e.target.value); setNewChatError(null); }}
                                />
                                {newChatError && (
                                    <p className="text-xs text-red-500">{newChatError}</p>
                                )}
                            </div>
                            <DialogFooter>
                                <DialogClose render={<Button variant="outline" />}>
                                    Cancel
                                </DialogClose>
                                <Button
                                    disabled={!newChatIdentifier.trim() || creatingChat}
                                    onClick={async () => {
                                        setCreatingChat(true);
                                        setNewChatError(null);
                                        const { data, error } = await createChat({ identifier: newChatIdentifier.trim() });
                                        setCreatingChat(false);
                                        if (error) {
                                            setNewChatError(error.message);
                                            return;
                                        }
                                        if (data?.chat_id) {
                                            setNewChatIdentifier("");
                                            await queryClient.invalidateQueries({ queryKey: ["chats"] });
                                            router.push(`/chat/${data.chat_id}`);
                                        }
                                    }}
                                >
                                    {creatingChat ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                                    {creatingChat ? "Creating..." : "Start chat"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                    {chats.map((chat) => (
                        <div key={chat.id} onClick={() => { router.push(`/chat/${chat.id}`) }} className="p-2 w-full rounded-md flex items-center gap-2 hover:bg-muted cursor-pointer not-last:mb-1">
                            <Avatar className="size-10 shrink-0">
                                <AvatarImage src={chat.avatar_url ?? undefined} />
                                <AvatarFallback>{chat.name?.[0] ?? "?"}</AvatarFallback>
                                <AvatarBadge className={cn("border", statusColor(chat.status))} /> {/* Mock status based on last message sender */}
                            </Avatar>
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-base! font-medium truncate">{chat.name}</p>
                                    {chat.last_message?.created_at && (
                                        <span className="text-[10px] text-muted-foreground shrink-0">
                                            {new Date(chat.last_message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                    {chat.last_message
                                        ? `${chat.last_message.sender_id === user?.id ? "You" : chat.name}: ${chat.last_message.content}`
                                        : ""}
                                </p>
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
                                <Dialog>
                                    <DialogTrigger render={
                                        <Button variant="ghost" className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive rounded-sm h-9" />
                                    }>
                                        <LogOut className="size-4" /> Logout
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Logout</DialogTitle>
                                            <DialogDescription>
                                                Are you sure you want to log out?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose render={<Button variant="outline" />}>
                                                Cancel
                                            </DialogClose>
                                            <Button variant="destructive" onClick={handleLogout}>
                                                Logout
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-3 px-4 py-3 h-16 hover:bg-muted border-t transition-colors w-full text-left"
                >
                    <Avatar className="size-10 shrink-0">
                        <AvatarImage src={user?.avatar_url ?? undefined} />
                        <AvatarFallback className={"border"}>{user?.name?.[0] ?? <User/>}</AvatarFallback>
                        <AvatarBadge className={statusColor(user?.status ?? "offline")} />
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold">{user?.name ?? user?.username}</p>
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
