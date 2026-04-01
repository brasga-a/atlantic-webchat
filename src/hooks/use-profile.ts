import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/services/user/profile.client";
import { UserType } from "@/services/user/user.type";

export function useProfile(initialData?: UserType | null) {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: fetchProfile,
    initialData: initialData ?? undefined,
  });
}
