"use server"

import { api } from "@/lib/ky";
import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { UserResponse, UserType, UserUpdateProfile } from "./user.type";

export async function updateProfile(data: UserUpdateProfile) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const result = await api.put('user/update', {
      json: data,
      headers: {
        Cookie: cookieHeader,
      },
      redirect: 'manual',
    }).json<UserUpdateProfile>();

    return { data: result, error: null };
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

