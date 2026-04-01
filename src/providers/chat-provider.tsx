"use client";

import { useChatList } from "@/hooks/use-chat-list";
import { Chat } from "@/services/chat/chat-type";
import { createContext, useContext } from "react";

type ChatContextType = {
  chats: Chat[];
};

const ChatContext = createContext<ChatContextType>({ chats: [] });

export function ChatProvider({
  initialChats,
  children,
}: {
  initialChats: Chat[];
  children: React.ReactNode;
}) {
  const { data } = useChatList(initialChats);

  return (
    <ChatContext.Provider value={{ chats: data ?? [] }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  return useContext(ChatContext);
}
