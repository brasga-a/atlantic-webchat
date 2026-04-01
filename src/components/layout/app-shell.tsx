"use client";

import Sidebar from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePreferences, usePreferencesHydrated } from "@/store/preferences";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { islandStyle } = usePreferences();
    const hydrated = usePreferencesHydrated();
    const pathname = usePathname();
    const isRoot = pathname === "/";

      if (!hydrated) return null;

    return (
        <main className={cn("flex items-center justify-center h-screen", islandStyle && "mx-auto container max-w-7xl md:py-10")}>
            <Card className="w-full h-full flex-row p-0 gap-0 overflow-hidden">
                {/* Sidebar */}
                <div className={cn("w-full md:w-xs shrink-0", !isRoot && "hidden md:block")}>
                    <Sidebar/>
                </div>

                {/* Page */}
                <div className={cn("flex-1 overflow-hidden md:border-l", isRoot && "hidden md:block")}>
                    {children}
                </div>
            </Card>
        </main>
    );
}
