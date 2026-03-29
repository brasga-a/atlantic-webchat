"use client";

import Sidebar from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePreferences, usePreferencesHydrated } from "@/store/preferences";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { islandStyle } = usePreferences();
    const hydrated = usePreferencesHydrated();
    
      if (!hydrated) return null;

    return (
        <main className={cn("flex items-center justify-center h-screen", islandStyle && "mx-auto container max-w-7xl py-10")}>
            <Card className="w-full h-full flex-row p-0 gap-0 overflow-hidden">
                {/* Sidebar */}
                <div className="w-xs shrink-0">
                    <Sidebar/>
                </div>

                {/* Page */}
                <div className="flex-1 overflow-hidden border-l">
                    {children}
                </div>
            </Card>
        </main>
    );
}
