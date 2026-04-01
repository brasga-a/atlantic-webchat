import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "@/services/chat/get.client";

export function useMessages(chatId: string) {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => fetchMessages(chatId),
    enabled: !!chatId,
  });
}
