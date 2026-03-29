import AppShell from "@/components/layout/app-shell";
import { UserProvider } from "@/providers/user-provider"
import { user } from "@/services/user"

export default async function AppLayout( { children }: { children: React.ReactNode }) {

    const { data } = await user.getProfile();
    return (
        <UserProvider user={data}>
            <AppShell>
                {children}
            </AppShell>
        </UserProvider>
    )
}
