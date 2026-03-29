"use server"

import { api } from "@/lib/ky";
import { HTTPError } from "ky";
import { cookies, headers } from "next/headers";
import { UserResponse, VerifyUsername, VerifyUsernameResponse } from "./user.type";

export async function verifyUsername({ username }: VerifyUsername) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const data = await api.post('user/verify-username', {
      json: { username },
      headers: {
        Cookie: cookieHeader,
      },
      redirect: 'manual',
    }).json<VerifyUsernameResponse>();

    return { data, error: null };
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorBody = await err.response.json<UserResponse>();

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