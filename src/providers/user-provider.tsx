"use client";

import { UserType } from "@/services/user/user.type";
import { createContext, useContext } from "react";

const UserContext = createContext<UserType | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: UserType | null;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
