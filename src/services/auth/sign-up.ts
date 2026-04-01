import { api } from "@/lib/ky";
import { SignInInput, AuthResponse, SignUpInput } from "./auth.type";
import { HTTPError } from "ky";

export async function signUp(input: SignUpInput) {
    console.log(input)

  try { 
    
    const data = await api.post('auth/register', { 
      json: input,
      credentials: "include",
    }).json<AuthResponse>();
    
    return { data, error: null };
  }catch (err) {
    if (err instanceof HTTPError) {
      const errorBody = await err.response.json<AuthResponse>();

      return {
        data: null,
        error: {
          status: err.response.status,
          message: errorBody.message,
        },
      };
    }
    throw err;
  }
}