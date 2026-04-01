"use server"

import { api } from "@/lib/ky";
import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { CreateChat, CreateChatResponse, ChatResponse } from "./chat-type";

export async function createChat(data: CreateChat) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await api.post('chat/create', {
      json: data,
      headers: {
        Cookie: cookieHeader,
      },
      redirect: 'manual',
    }).json<CreateChatResponse>();

    return { data: response, error: null };
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorBody = await err.response.json<ChatResponse>();

      return {
        data: null,
        error: {
          status: err.response.status,
          message: errorBody.message,
        },
      };
    }

    if (err instanceof Error && err.name === 'TimeoutError') {
      return {
        data: null,
        error: {
          status: 0,
          message: 'Timeout ao conectar com o servidor',
        },
      };
    }

    throw err;
  }
}
