import AppShell from "@/components/layout/app-shell";
import { ChatProvider } from "@/providers/chat-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { UserProvider } from "@/providers/user-provider"
import { getChats } from "@/services/chat/get";
import { user } from "@/services/user"

export default async function AppLayout( { children }: { children: React.ReactNode }) {

    const [{ data: userData }, { data: chatsData }] = await Promise.all([
        user.getProfile(),
        getChats(),
    ]);

    return (
        <QueryProvider>
            <UserProvider initialUser={userData}>
                <ChatProvider initialChats={chatsData ?? []}>
                    <SocketProvider>
                        <AppShell>
                            {children}
                        </AppShell>
                    </SocketProvider>
                </ChatProvider>
            </UserProvider>
        </QueryProvider>
    )
}
