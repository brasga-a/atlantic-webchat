import { useQuery } from "@tanstack/react-query";
import { fetchChats } from "@/services/chat/get.client";
import { Chat } from "@/services/chat/chat-type";

export function useChatList(initialData?: Chat[]) {
  return useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
    initialData,
  });
}
