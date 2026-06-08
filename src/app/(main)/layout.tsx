"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { GlobalPlayer } from "@/components/shared/global-player";
import { WorkspacePanel } from "@/components/shared/workspace-panel";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black text-white">
      {/* Top Main Section (3 columns) */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        {/* Main Content Pane (Middle) */}
        <main className="flex-1 overflow-y-auto bg-[#121212] relative shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.5)] z-10 rounded-tl-xl border-l border-white/5">
          {children}
        </main>

        {/* Right Workspace Panel */}
        <div className="hidden lg:block z-0 relative shadow-[10px_0_30px_-10px_rgba(0,0,0,0.5)] border-l border-white/5 bg-[#0A0A0A]">
          <WorkspacePanel />
        </div>
      </div>

      {/* Persistent Bottom Player */}
      <GlobalPlayer />
    </div>
  );
}
