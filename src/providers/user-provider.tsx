"use client";

import { useProfile } from "@/hooks/use-profile";
import { UserType } from "@/services/user/user.type";
import { createContext, useContext } from "react";

const UserContext = createContext<UserType | undefined>(undefined);

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: UserType | null;
  children: React.ReactNode;
}) {
  const { data } = useProfile(initialUser);

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
