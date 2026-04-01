"use server"

import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { UserResponse } from "./user.type";

export async function uploadAvatar(formData: FormData) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/avatar`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorBody = await res.json() as UserResponse;
      return {
        data: null,
        error: {
          status: res.status,
          message: errorBody.message,
        },
      };
    }

    const data = await res.json() as { avatar_url: string };
    return { data, error: null };
  } catch (err) {
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
