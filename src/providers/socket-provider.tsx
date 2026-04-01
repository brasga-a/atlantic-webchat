"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { Chat, MessageType } from "@/services/chat/chat-type";
import { UserType } from "@/services/user/user.type";

const AWAY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const awayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAwayRef = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_API_URL!, {
      withCredentials: true,
    });
    setSocket(s);

    // Listen for status changes from any user (including self)
    s.on("user_status_changed", ({ user_id, status }: { user_id: string; status: string }) => {
      queryClient.setQueryData<Chat[]>(["chats"], (old) =>
        old?.map((chat) =>
          chat.contact_id === user_id ? { ...chat, status } : chat
        )
      );
      queryClient.setQueryData<UserType>(["user", "profile"], (old) =>
        old?.id === user_id ? { ...old, status } : old
      );
    });

    // Listen for new messages
    s.on("new_message", (message: MessageType) => {
      queryClient.setQueryData<MessageType[]>(["messages", message.chat_id], (old) =>
        old ? [...old, message] : [message]
      );
      queryClient.setQueryData<Chat[]>(["chats"], (old) =>
        old?.map((chat) =>
          chat.id === message.chat_id
            ? { ...chat, last_message: { content: message.content, sender_id: message.sender_id, created_at: message.created_at } }
            : chat
        )
      );
    });

    // Listen for edited messages
    s.on("message_edited", ({ id, chat_id, content, edited_at }: { id: string; chat_id: string; content: string; edited_at: string }) => {
      queryClient.setQueryData<MessageType[]>(["messages", chat_id], (old) =>
        old?.map((msg) => msg.id === id ? { ...msg, content, edited_at } : msg)
      );
      // Update sidebar last_message if it was the last one
      queryClient.setQueryData<Chat[]>(["chats"], (old) =>
        old?.map((chat) => {
          if (chat.id === chat_id && chat.last_message) {
            // We don't have the message id in last_message, so update content if it matches
            return { ...chat, last_message: { ...chat.last_message, content } };
          }
          return chat;
        })
      );
    });

    // Listen for deleted messages
    s.on("message_deleted", ({ id, chat_id, delete_for_all }: { id: string; chat_id: string; delete_for_all: boolean }) => {
      if (delete_for_all) {
        // Replace content with "Deleted message" for everyone
        queryClient.setQueryData<MessageType[]>(["messages", chat_id], (old) =>
          old?.map((msg) => msg.id === id ? { ...msg, content: "Deleted message", deleted_at: new Date().toISOString() } : msg)
        );
      } else {
        // Remove from this user's view only
        queryClient.setQueryData<MessageType[]>(["messages", chat_id], (old) =>
          old?.filter((msg) => msg.id !== id)
        );
      }
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    });

    // Activity tracking
    const resetAwayTimer = () => {
      if (isAwayRef.current) {
        isAwayRef.current = false;
        s.emit("user_online");
      }

      if (awayTimerRef.current) {
        clearTimeout(awayTimerRef.current);
      }

      awayTimerRef.current = setTimeout(() => {
        isAwayRef.current = true;
        s.emit("user_away");
      }, AWAY_TIMEOUT);
    };

    resetAwayTimer();

    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetAwayTimer));

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        resetAwayTimer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetAwayTimer));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
      s.disconnect();
    };
  }, [queryClient]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
