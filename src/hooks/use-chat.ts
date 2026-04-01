import { useQuery } from "@tanstack/react-query";
import { fetchChat } from "@/services/chat/get.client";

export function useChat(chatId: string) {
  return useQuery({
    queryKey: ["chats", chatId],
    queryFn: () => fetchChat(chatId),
    enabled: !!chatId,
  });
}
