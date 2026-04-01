import { api } from "@/lib/ky";
import { UserType } from "./user.type";

export async function fetchProfile(): Promise<UserType> {
  return api.get("user/profile").json<UserType>();
}
