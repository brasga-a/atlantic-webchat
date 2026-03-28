'use server'

import { api } from "@/lib/api";
import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type ActionResult = { success: false; message: string };

export async function handleLogin(formData: FormData): Promise<ActionResult> {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    let setCookieHeader: string | null = null;

    try {
        const response = await api.post("auth/login", {
            json: { username, password },
        });
        setCookieHeader = response.headers.get('set-cookie');
    } catch (error) {
        if (error instanceof HTTPError) {
            const body = await error.response.json<{ message: string }>();
            return { success: false, message: body.message };
        }
        return { success: false, message: "Unexpected error" };
    }

    if (setCookieHeader) {
        const cookieStore = await cookies();
        const [cookiePart] = setCookieHeader.split(';');
        const eqIndex = cookiePart.indexOf('=');
        const name = cookiePart.slice(0, eqIndex).trim();
        const value = cookiePart.slice(eqIndex + 1);
        cookieStore.set(name, value, { httpOnly: true, path: '/' });
    }

    redirect('/');
}