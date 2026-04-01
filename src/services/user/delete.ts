"use server"

import { api } from "@/lib/ky";
import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { UserResponse } from "./user.type";

export async function deleteProfile() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    await api.delete('user/delete', {
      headers: {
        Cookie: cookieHeader,
      },
      redirect: 'manual',
    });

    cookieStore.delete("session");

    return { data: true, error: null };
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

