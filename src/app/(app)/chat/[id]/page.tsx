"use client";

import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mockContacts } from "@/data/contacts";

const mockMessages = [
    { id: 1, from: "them", text: "Hey, how are you?",                       time: "10:00 AM" },
    { id: 2, from: "me",   text: "I'm good, thanks! How about you?",        time: "10:01 AM" },
    { id: 3, from: "them", text: "Doing great! Working on anything fun?",   time: "10:02 AM" },
    { id: 4, from: "me",   text: "Yeah, building a chat app actually 😄",   time: "10:03 AM" },
    { id: 5, from: "them", text: "That's awesome, can't wait to try it!",   time: "10:05 AM" },
];

function statusLabel(status: string) {
    switch (status) {
        case "online": return "Online";
        case "away":   return "Away";
        default:       return "Offline";
    }
}

function statusColor(status: string) {
    switch (status) {
        case "online": return "bg-green-500";
        case "away":   return "bg-yellow-500";
        default:       return "bg-gray-500";
    }
}

export default function ChatPage() {
    const { id } = useParams<{ id: string }>();
    const [message, setMessage] = useState("");

    const contact = mockContacts.find((c) => c.id === id);

    if (!contact) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground select-none">
                <p className="text-sm">Conversation not found</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="shrink-0 flex items-center gap-3 px-4 h-16 py-3 border-b">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    <AvatarBadge className={cn(statusColor(contact.status))} />
                </Avatar>
                <div>
                    <p className="text-sm font-semibold">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{statusLabel(contact.status)}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {mockMessages.map((msg) => (
                    <div key={msg.id} className={cn("flex", msg.from === "me" ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "max-w-xs rounded-2xl px-4 py-2 text-sm",
                            msg.from === "me"
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-muted rounded-bl-sm"
                        )}>
                            <p>{msg.text}</p>
                            <p className={cn(
                                "text-xs mt-1",
                                msg.from === "me" ? "text-primary-foreground/60" : "text-muted-foreground"
                            )}>
                                {msg.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="shrink-0 flex items-end gap-2 px-4 py-3 h-16 border-t">
                <Textarea
                    placeholder={`Message ${contact.name}...`}
                    className="resize-none min-h-0 h-9 py-2 rounded-lg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            setMessage("");
                        }
                    }}
                />
                <Button size="icon" disabled={!message.trim()}>
                    <Send className="size-4" />
                </Button>
            </div>
        </div>
    );
}
