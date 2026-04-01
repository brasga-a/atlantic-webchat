"use client";

import { ArrowLeft, Pencil, Send, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChats } from "@/providers/chat-provider";
import { useUser } from "@/providers/user-provider";
import { useSocket } from "@/providers/socket-provider";
import { useMessages } from "@/hooks/use-messages";
import { cn } from "@/lib/utils";
import { MessageType } from "@/services/chat/chat-type";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";

function isWithinMinutes(createdAt: string, minutes: number): boolean {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    return (now - created) < minutes * 60 * 1000;
}

export default function ChatPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { chats } = useChats();
    const user = useUser();
    const socket = useSocket();
    const { data: messages = [] } = useMessages(id);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Edit dialog state
    const [editingMessage, setEditingMessage] = useState<MessageType | null>(null);
    const [editContent, setEditContent] = useState("");
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    // Delete dialog state
    const [deletingMessage, setDeletingMessage] = useState<MessageType | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const chat = chats.find((c) => c.id === id);

    // Join/leave chat room
    useEffect(() => {
        if (!socket || !id) return;

        socket.emit("join_chat", { chat_id: id });

        return () => {
            socket.emit("leave_chat", { chat_id: id });
        };
    }, [socket, id]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        const content = message.trim();
        if (!content || !socket || !id) return;

        socket.emit("send_message", { chat_id: id, content });
        setMessage("");
    };

    const handleEdit = () => {
        if (!editingMessage || !socket) return;
        const content = editContent.trim();
        if (!content || content === editingMessage.content) {
            setEditDialogOpen(false);
            return;
        }
        socket.emit("edit_message", { message_id: editingMessage.id, content });
        setEditDialogOpen(false);
    };

    const handleDelete = (deleteForAll: boolean) => {
        if (!deletingMessage || !socket) return;
        socket.emit("delete_message", { message_id: deletingMessage.id, delete_for_all: deleteForAll });
        setDeleteDialogOpen(false);
    };

    if (!chat) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                Chat not found.
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="shrink-0 flex items-center gap-3 px-4 h-16 py-3 border-b">
                <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => router.push("/")}>
                    <ArrowLeft className="size-4" />
                </Button>
                <Avatar className="h-9 w-9">
                    <AvatarImage src={chat.avatar_url ?? undefined} />
                    <AvatarFallback>{chat.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-semibold">{chat.name}</p>
                    {chat.status && (
                        <p className="text-xs text-muted-foreground">{chat.status}</p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 no-scrollbar">
                {messages.map((msg) => {
                    const isMine = msg.sender_id === user?.id;
                    const isDeleted = !!msg.deleted_at;
                    const canEdit = isMine && !isDeleted && isWithinMinutes(msg.created_at, 2);
                    const canDeleteForAll = isMine && !isDeleted && isWithinMinutes(msg.created_at, 5);

                    if (isDeleted) {
                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "max-w-[70%] rounded-2xl px-3 py-2 italic opacity-50",
                                    isMine ? "self-end" : "self-start"
                                )}
                            >
                                <p className="text-sm text-muted-foreground">Deleted message</p>
                                <p className="text-[10px] text-muted-foreground">
                                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                </p>
                            </div>
                        );
                    }

                    return (
                        <ContextMenu key={msg.id}>
                            <ContextMenuTrigger
                                className={cn(
                                    "max-w-[70%] rounded-2xl px-3 py-2",
                                    isMine
                                        ? "self-end bg-primary text-primary-foreground"
                                        : "self-start bg-muted"
                                )}
                            >
                                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                <p className={cn(
                                    "text-[10px] mt-0.5",
                                    isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                                )}>
                                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                    {msg.edited_at && " (edited)"}
                                </p>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                {canEdit && (
                                    <ContextMenuItem
                                        onClick={() => {
                                            setEditingMessage(msg);
                                            setEditContent(msg.content);
                                            setEditDialogOpen(true);
                                        }}
                                    >
                                        <Pencil className="size-4" />
                                        Edit message
                                    </ContextMenuItem>
                                )}
                                {canEdit && <ContextMenuSeparator />}
                                <ContextMenuItem
                                    variant="destructive"
                                    onClick={() => {
                                        setDeletingMessage(msg);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <Trash2 className="size-4" />
                                    Delete message
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 flex items-end gap-2 px-4 py-3 min-h-16 border-t">
                <Textarea
                    placeholder={`Message ${chat.name}...`}
                    className={cn("resize-none min-h-9 max-h-32 rounded-sm no-scrollbar",
                        message ? "text-lg!" : "text-md!"
                    )}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <Button size="icon" disabled={!message.trim()} onClick={handleSend}>
                    <Send className="size-4" />
                </Button>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit message</DialogTitle>
                        <DialogDescription>
                            You can edit messages sent within 2 minutes.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="resize-none min-h-20"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleEdit();
                            }
                        }}
                    />
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" />}>
                            Cancel
                        </DialogClose>
                        <Button onClick={handleEdit} disabled={!editContent.trim()}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete message</DialogTitle>
                        <DialogDescription>
                            How would you like to delete this message?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" />}>
                            Cancel
                        </DialogClose>
                        <Button variant="destructive" onClick={() => handleDelete(false)}>
                            Delete for me
                        </Button>
                        {deletingMessage && deletingMessage.sender_id === user?.id && isWithinMinutes(deletingMessage.created_at, 5) && (
                            <Button variant="destructive" onClick={() => handleDelete(true)}>
                                Delete for all
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
