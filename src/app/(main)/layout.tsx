"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { GlobalPlayer } from "@/components/shared/global-player";
import { WorkspacePanel } from "@/components/shared/workspace-panel";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950 text-zinc-50 relative selection:bg-violet-500/30">
      
      {/* Premium Background Glow Effect */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-violet-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] bg-gradient-to-tl from-indigo-900/10 via-transparent to-transparent pointer-events-none rounded-full blur-[100px]" />

      {/* Top Main Section (3 columns) */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar />
        
        {/* Main Content Pane (Middle) */}
        <main className="flex-1 overflow-y-auto bg-zinc-950/80 backdrop-blur-3xl relative shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.8)] z-10 rounded-tl-2xl border-l border-t border-white/5">
          {children}
        </main>

        {/* Right Workspace Panel */}
        <div className="hidden lg:block z-0 relative shadow-[10px_0_30px_-10px_rgba(0,0,0,0.8)] border-l border-white/5 bg-zinc-950/90 backdrop-blur-xl">
          <WorkspacePanel />
        </div>
      </div>

      {/* Persistent Bottom Player */}
      <GlobalPlayer />
    </div>
  );
}
