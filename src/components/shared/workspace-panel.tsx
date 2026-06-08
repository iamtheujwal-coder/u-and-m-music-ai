"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePlayerStore } from "@/lib/store";
import { Search, Filter, Play, CheckCircle2, ChevronDown, MoreHorizontal, Share2, ThumbsUp, ThumbsDown } from "lucide-react";

export function WorkspacePanel() {
  const [projects, setProjects] = useState<any[]>([]);
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();

  useEffect(() => {
    // Load generated songs from demo mode
    const loadProjects = () => {
      const stored = localStorage.getItem("demo_projects");
      if (stored) {
        try {
          const mapData = JSON.parse(stored);
          const parsed = mapData.map((item: any) => item[1]);
          setProjects(parsed.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } catch (e) {}
      }
    };
    
    loadProjects();
    
    // Poll for updates (in a real app this would be a websocket or SWR)
    const interval = setInterval(loadProjects, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-80 lg:w-[380px] flex-col bg-[#0A0A0A] border-l border-zinc-800 text-[#E5E5E5] shrink-0">
      
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <h2 className="text-sm font-bold flex items-center gap-2">
          Workspaces <span className="text-zinc-500 font-normal">{'>'}</span> My Workspace
        </h2>
        
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-700"
            />
          </div>
          <button className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 text-xs hover:bg-zinc-800 transition-colors">
            <Filter className="h-3 w-3" /> Filters
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Onboarding Progress */}
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="8" strokeDasharray={`${(3/6)*251} 251`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">3/6</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Unlock Your Sound</h3>
                <p className="text-[10px] text-zinc-400">3 of 6 completed</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x hide-scrollbar">
            {/* Mock Onboarding Cards */}
            <div className="shrink-0 snap-center w-32 rounded-lg bg-zinc-800/50 p-3 border border-zinc-700/50">
              <h4 className="text-[11px] font-bold mb-1">Pull it apart</h4>
              <p className="text-[9px] text-zinc-400 mb-4 line-clamp-2">Use Stems to split a song into vocals, drums, bass...</p>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <div className="h-3 w-3 rounded-full border border-zinc-600" /> 0/1
              </div>
            </div>
            <div className="shrink-0 snap-center w-32 rounded-lg bg-zinc-800/50 p-3 border border-zinc-700/50 opacity-60">
              <h4 className="text-[11px] font-bold mb-1">Remaster</h4>
              <p className="text-[9px] text-zinc-400 mb-4 line-clamp-2">Use the Remaster tool to make the song sound better</p>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <div className="h-3 w-3 rounded-full border border-zinc-600" /> 0/1
              </div>
            </div>
            <div className="shrink-0 snap-center w-32 rounded-lg bg-emerald-500/10 p-3 border border-emerald-500/30">
              <h4 className="text-[11px] font-bold mb-1 text-emerald-500">Use best model</h4>
              <p className="text-[9px] text-emerald-500/70 mb-4 line-clamp-2">Create a song using a Pro model</p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold">
                <CheckCircle2 className="h-3 w-3" /> Complete
              </div>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="space-y-2">
          {projects.length === 0 ? (
            <div className="text-center p-8 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl">
              No tracks generated yet. Go to Create to make your first song!
            </div>
          ) : (
            projects.map((project) => {
              const isProcessing = project.status === "processing";
              const isThisPlaying = currentTrack?.id === project.id;

              return (
                <div key={project.id} className="group relative flex items-start gap-3 rounded-lg hover:bg-zinc-900 p-2 transition-colors cursor-pointer">
                  
                  {/* Artwork & Play button */}
                  <div 
                    className="relative h-12 w-12 shrink-0 rounded bg-gradient-to-br from-amber-500/80 to-orange-500/80 overflow-hidden"
                    onClick={() => {
                      if (!isProcessing) {
                        playTrack({
                          id: project.id,
                          title: project.title,
                          artist: "UANM Artist",
                          coverUrl: "",
                          audioUrl: project.output_file_url || "https://kudivkkrmgraypstkgot.supabase.co/storage/v1/object/public/audio_uploads/demo-vocal.mp3",
                          duration: project.duration || 180,
                        });
                      }
                    }}
                  >
                    <div className="absolute bottom-1 right-1 text-[8px] bg-black/60 px-1 rounded font-bold">{isProcessing ? "..." : "3:00"}</div>
                    
                    <div className={`absolute inset-0 bg-black/40 items-center justify-center transition-opacity ${isThisPlaying ? "flex" : "hidden group-hover:flex"}`}>
                      {isThisPlaying && isPlaying ? (
                        <div className="flex gap-0.5 items-end h-3">
                          <motion.div animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-white rounded-full" />
                          <motion.div animate={{ height: ["12px", "4px", "12px"] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-white rounded-full" />
                          <motion.div animate={{ height: ["6px", "10px", "6px"] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-white rounded-full" />
                        </div>
                      ) : (
                        <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={`text-xs font-bold truncate ${isThisPlaying ? 'text-violet-400' : 'text-white'}`}>{project.title}</h4>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ThumbsUp className="h-3 w-3 text-zinc-400 hover:text-white" />
                        <ThumbsDown className="h-3 w-3 text-zinc-400 hover:text-white" />
                        <Share2 className="h-3 w-3 text-zinc-400 hover:text-white" />
                        <MoreHorizontal className="h-3 w-3 text-zinc-400 hover:text-white" />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1 rounded font-mono">v5.5</span>
                      {project.mode === "cover" && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 rounded">Cover</span>}
                      {project.mode === "extend" && <span className="text-[9px] bg-fuchsia-500/20 text-fuchsia-400 px-1 rounded">Extend</span>}
                      {isProcessing && <span className="text-[9px] text-amber-500 font-bold animate-pulse">Processing...</span>}
                    </div>

                    <p className="text-[9px] text-zinc-500 truncate mt-1">
                      {project.genre} • {project.mood} • {project.prompt || "Raw vocal studio processing"}
                    </p>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
