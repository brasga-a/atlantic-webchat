"use client";

import ChatPage, { ChatContact } from "@/components/layout/chat-page";
import ProfilePage from "@/components/layout/profile-page";
import SettingsPage from "@/components/layout/settings-page";
import Sidebar from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { useState } from "react";

type View = "chat" | "profile" | "settings";

export default function Home() {
  const [view, setView] = useState<View>("chat");
  const [selectedChat, setSelectedChat] = useState<ChatContact | undefined>();

  return (
    <main className="mx-auto container max-w-7xl py-10 flex items-center justify-center h-screen">
      <Card className="w-full h-full flex-row p-0 gap-0 overflow-hidden">
        {/* Sidebar */}
        <div className="w-xs shrink-0">
          <Sidebar onNavigate={setView} onSelectChat={setSelectedChat} />
        </div>

        {/* Page */}
        <div className="flex-1 overflow-hidden border-l">
          {view === "chat"     && <ChatPage contact={selectedChat} />}
          {view === "profile"  && <ProfilePage />}
          {view === "settings" && <SettingsPage />}
        </div>
      </Card>
    </main>
  );
}
