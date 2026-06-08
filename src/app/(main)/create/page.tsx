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
        // Instead of navigating away to a project page, we could stay here,
        // but the prompt is "make like all this", and Suno doesn't navigate away. 
        // We'll let the user stay here and see the song pop up in the right panel!
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
    <div className="flex flex-col h-full bg-[#121212]">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-6 text-sm font-bold">
          <button 
            onClick={() => setActiveTab("simple")}
            className={`transition-colors ${activeTab === "simple" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Simple
          </button>
          <button 
            onClick={() => setActiveTab("advanced")}
            className={`transition-colors ${activeTab === "advanced" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Advanced
          </button>
          <button 
            onClick={() => setActiveTab("sounds")}
            className={`transition-colors ${activeTab === "sounds" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Sounds
          </button>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
          v5.5 <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-2xl mx-auto w-full">
        
        {/* Top Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <label className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-sm font-semibold hover:bg-zinc-800 transition-colors cursor-pointer text-white">
            <Music className="h-4 w-4" /> + Audio
            <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
          </label>
          <button className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-sm font-semibold hover:bg-zinc-800 transition-colors text-white">
            <Mic className="h-4 w-4" /> + Voice <span className="text-[9px] bg-pink-500 text-white px-1.5 rounded uppercase ml-1">New</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-sm font-semibold hover:bg-zinc-800 transition-colors text-white">
            <Zap className="h-4 w-4 text-amber-500" /> + Inspo
          </button>
        </div>

        {uploadedFile && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between text-emerald-500 text-xs">
            <span>Audio loaded: {uploadedFile.name}</span>
            <button onClick={() => setUploadedFile(null)} className="text-emerald-500 hover:underline">Remove</button>
          </div>
        )}

        {/* Lyrics Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <button className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-zinc-300">
              <ChevronDown className="h-4 w-4" /> Lyrics
            </button>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <button className="text-white bg-zinc-800 px-3 py-1 rounded-full">Write</button>
              <button className="text-zinc-400 hover:text-white">Prompt</button>
              <button className="text-zinc-400 hover:text-white">Instrumental</button>
            </div>
          </div>
          
          <div className="relative group">
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="[Verse]\nThis is where you write your rhymes\nor give our Magic Wand a try ✨\nSection [tags] can help instruct your\nsongs to feel more tight and structured"
              className="w-full h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 resize-none leading-relaxed"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors">
                <Wand2 className="h-4 w-4" />
              </button>
              <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors">
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
            <button className="absolute bottom-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Style Area */}
        <div className="space-y-2">
          <button className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-zinc-300 px-1">
            <ChevronDown className="h-4 w-4" /> Styles
          </button>
          
          <textarea
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="double bass drum, instrumental breaks, himno, blackened death metal, a cappella"
            className="w-full h-24 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 resize-none leading-relaxed"
          />
        </div>

        <div className="pt-4">
          <button 
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Music className="h-5 w-5" />}
            {loading ? "Creating..." : "Create"}
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
