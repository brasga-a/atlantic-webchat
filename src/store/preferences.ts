import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferencesState {
    islandStyle: boolean;
    notifications: boolean;
    sounds: boolean;
    readReceipts: boolean;
    onlineStatus: boolean;
    setIslandStyle: (v: boolean) => void;
    setNotifications: (v: boolean) => void;
    setSounds: (v: boolean) => void;
    setReadReceipts: (v: boolean) => void;
    setOnlineStatus: (v: boolean) => void;
}

export const usePreferences = create<PreferencesState>()(
    persist(
        (set) => ({
            islandStyle: true,
            notifications: true,
            sounds: true,
            readReceipts: true,
            onlineStatus: true,
            setIslandStyle: (v) => set({ islandStyle: v }),
            setNotifications: (v) => set({ notifications: v }),
            setSounds: (v) => set({ sounds: v }),
            setReadReceipts: (v) => set({ readReceipts: v }),
            setOnlineStatus: (v) => set({ onlineStatus: v }),
        }),
        { name: "chat-preferences" }
    )
);

export function usePreferencesHydrated() {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const unsub = usePreferences.persist.onFinishHydration(() => setHydrated(true));
        if (usePreferences.persist.hasHydrated()) setHydrated(true);
        return unsub;
    }, []);

    return hydrated;
}
