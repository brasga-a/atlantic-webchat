"use server"

import { api } from "@/lib/ky";
import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { Chat, ChatResponse } from "./chat-type";

export async function getChats() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const data = await api.get('chat/list', {
      headers: {
        Cookie: cookieHeader,
      },
      redirect: 'manual',
    }).json<Chat[]>();

    return { data, error: null };
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