"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Music, Mic, Zap, ChevronDown, Wand2, Upload, Loader2, Maximize2, MoreHorizontal } from "lucide-react";

type CreateTab = "simple" | "advanced" | "sounds";

function CreateContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CreateTab>("simple");
  const [lyrics, setLyrics] = useState("");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleCreate = async () => {
    const localProfile = localStorage.getItem("demo_profile");
    if (localProfile) {
      const profile = JSON.parse(localProfile);
      if (profile.credits < 5) {
        alert("Insufficient credits. Please upgrade to a Pro or Studio plan to get more credits.");
        router.push("/pricing");
        return;
      }
    }

    setLoading(true);
    try {
      let fileUrl = null;
      if (uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        const uploadRes = await fetch("/api/upload/audio", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.url || URL.createObjectURL(uploadedFile);
      }

      const endpoint = uploadedFile ? "/api/process/raw-vocal-to-song" : "/api/process/lyrics-to-song";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "AI Generated Track",
          mode: uploadedFile ? "cover" : "ai_generate",
          genre: style || "Pop",
          mood: "Energetic",
          mastering_style: "clean",
          vocal_file_url: fileUrl,
          bpm: 120,
          key: "C Major",
          duration: 180,
          prompt: lyrics,
          customization: { isProMode: false }
        }),
      });

      const data = await res.json();
      if (data.project) {
        if (localProfile) {
          const profile = JSON.parse(localProfile);
          profile.credits -= 5;
          localStorage.setItem("demo_profile", JSON.stringify(profile));
          window.dispatchEvent(new Event('profileUpdated'));
        }
        setLyrics("");
        setStyle("");
        setUploadedFile(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950/20 backdrop-blur-md">
        <div className="flex items-center gap-8 text-sm font-bold">
          <button 
            onClick={() => setActiveTab("simple")}
            className={`transition-all relative pb-2 -mb-2 ${activeTab === "simple" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Simple
            {activeTab === "simple" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab("advanced")}
            className={`transition-all relative pb-2 -mb-2 ${activeTab === "advanced" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Advanced
            {activeTab === "advanced" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab("sounds")}
            className={`transition-all relative pb-2 -mb-2 ${activeTab === "sounds" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Sounds
            {activeTab === "sounds" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />}
          </button>
        </div>
        <button className="flex items-center gap-1.5 text-[11px] font-mono text-violet-300 hover:text-white transition-colors bg-violet-500/10 px-3 py-1.5 rounded-full border border-violet-500/20 shadow-inner">
          v5.5 <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-2xl mx-auto w-full">
        
        {/* Top Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <label className="group flex items-center justify-center gap-2 bg-zinc-900/40 border border-white/5 rounded-2xl py-3.5 text-sm font-semibold hover:bg-zinc-800/80 hover:border-violet-500/30 transition-all cursor-pointer text-zinc-300 hover:text-white shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
            <Music className="h-4 w-4 group-hover:text-violet-400 transition-colors" /> + Audio
            <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
          </label>
          <button className="group flex items-center justify-center gap-2 bg-zinc-900/40 border border-white/5 rounded-2xl py-3.5 text-sm font-semibold hover:bg-zinc-800/80 hover:border-violet-500/30 transition-all text-zinc-300 hover:text-white shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
            <Mic className="h-4 w-4 group-hover:text-violet-400 transition-colors" /> + Voice 
            <span className="text-[9px] bg-pink-500 text-white px-1.5 rounded uppercase ml-1 shadow-[0_0_10px_rgba(236,72,153,0.5)]">New</span>
          </button>
          <button className="group flex items-center justify-center gap-2 bg-zinc-900/40 border border-white/5 rounded-2xl py-3.5 text-sm font-semibold hover:bg-zinc-800/80 hover:border-violet-500/30 transition-all text-zinc-300 hover:text-white shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
            <Zap className="h-4 w-4 text-amber-500 group-hover:text-amber-400 transition-colors drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" /> + Inspo
          </button>
        </div>

        {uploadedFile && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl flex items-center justify-between text-emerald-400 text-xs shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="font-medium flex items-center gap-2"><Upload className="h-3.5 w-3.5" /> Audio loaded: {uploadedFile.name}</span>
            <button onClick={() => setUploadedFile(null)} className="text-emerald-500 hover:text-emerald-300 hover:underline transition-colors font-bold tracking-wide">Remove</button>
          </div>
        )}

        {/* Lyrics Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <button className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-violet-300 transition-colors">
              <ChevronDown className="h-4 w-4" /> Lyrics
            </button>
            <div className="flex items-center gap-4 text-[13px] font-semibold">
              <button className="text-white bg-white/10 px-4 py-1.5 rounded-full shadow-inner border border-white/5">Write</button>
              <button className="text-zinc-500 hover:text-white transition-colors">Prompt</button>
              <button className="text-zinc-500 hover:text-white transition-colors">Instrumental</button>
            </div>
          </div>
          
          <div className="relative group">
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="[Verse]\nThis is where you write your rhymes\nor give our Magic Wand a try ✨\nSection [tags] can help instruct your\nsongs to feel more tight and structured"
              className="w-full h-72 bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-3xl p-5 text-[15px] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none leading-relaxed shadow-inner transition-all"
            />
            <div className="absolute bottom-5 left-5 flex gap-2">
              <button className="p-2.5 bg-zinc-800/80 hover:bg-violet-600 text-zinc-300 hover:text-white rounded-xl transition-colors border border-white/5 hover:border-violet-500 shadow-lg">
                <Wand2 className="h-4 w-4" />
              </button>
              <button className="p-2.5 bg-zinc-800/80 hover:bg-violet-600 text-zinc-300 hover:text-white rounded-xl transition-colors border border-white/5 hover:border-violet-500 shadow-lg">
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
            <button className="absolute bottom-5 right-5 p-2.5 text-zinc-500 hover:text-white transition-colors">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Style Area */}
        <div className="space-y-3">
          <button className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-violet-300 transition-colors px-2">
            <ChevronDown className="h-4 w-4" /> Styles
          </button>
          
          <textarea
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="double bass drum, instrumental breaks, himno, blackened death metal, a cappella"
            className="w-full h-28 bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-3xl p-5 text-[15px] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none leading-relaxed shadow-inner transition-all"
          />
        </div>

        <div className="pt-6 pb-20">
          <button 
            onClick={handleCreate}
            disabled={loading}
            className={`w-full relative overflow-hidden font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg border ${
              loading 
                ? "bg-zinc-800 border-zinc-700 text-zinc-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500/50 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-[1.01]"
            }`}
          >
            {!loading && <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />}
            {loading ? <Loader2 className="h-5 w-5 animate-spin relative z-10" /> : <Music className="h-5 w-5 relative z-10" />}
            <span className="relative z-10 text-base">{loading ? "Creating Track..." : "Create"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>}>
      <CreateContent />
    </Suspense>
  );
}
