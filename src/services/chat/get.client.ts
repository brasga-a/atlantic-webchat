import { api } from "@/lib/ky";
import { Chat, MessageType } from "./chat-type";

export async function fetchChats(): Promise<Chat[]> {
  return api.get("chat/list").json<Chat[]>();
}

export async function fetchChat(chatId: string): Promise<Chat> {
  return api.get(`chat/${chatId}`).json<Chat>();
}

export async function fetchMessages(chatId: string): Promise<MessageType[]> {
  return api.get(`chat/${chatId}/messages`).json<MessageType[]>();
}
