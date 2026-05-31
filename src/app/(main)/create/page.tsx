"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mic2, Music2, Sparkles, Wand2, Settings2, ArrowRight, ArrowLeft,
  Upload, X
} from "lucide-react";
import { GENRES, MOODS, MASTERING_STYLES } from "@/lib/constants";

type Mode = "home_studio" | "cover" | "original" | "ai_generate" | "mix_master";

const modes = [
  { id: "home_studio" as Mode, icon: Mic2, title: "Home Studio Mode", description: "For raw vocals recorded at home", color: "from-violet-500 to-purple-500" },
  { id: "cover" as Mode, icon: Music2, title: "Cover Song Mode", description: "Sing over an existing instrumental", color: "from-blue-500 to-cyan-500" },
  { id: "original" as Mode, icon: Sparkles, title: "Original Song Mode", description: "Create something brand new", color: "from-pink-500 to-rose-500" },
  { id: "ai_generate" as Mode, icon: Wand2, title: "AI Generate Song", description: "Describe your dream song", color: "from-amber-500 to-orange-500" },
  { id: "mix_master" as Mode, icon: Settings2, title: "Mix & Master Only", description: "Polish an existing track", color: "from-emerald-500 to-teal-500" },
];

function CreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") as Mode | null;
  const [selectedMode, setSelectedMode] = useState<Mode | null>(initialMode);
  const [step, setStep] = useState(initialMode ? 1 : 0);
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [masteringStyle, setMasteringStyle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
  };

  const startProcessing = async () => {
    setLoading(true);
    try {
      let fileUrl = null;
      if (uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        const uploadRes = await fetch("/api/upload/audio", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          fileUrl = uploadData.url;
        }
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Untitled Project",
          mode: selectedMode,
          genre,
          mood,
          mastering_style: masteringStyle,
          vocal_file_url: fileUrl,
        }),
      });
      const data = await res.json();
      if (data.project) {
        router.push(`/projects/${data.project.id}?processing=true`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">Create New Song</h1>
        <p className="mt-1 text-muted-foreground">Choose how you want to create your music.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 0: Mode Selection */}
        {step === 0 && (
          <motion.div
            key="modes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {modes.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => { setSelectedMode(mode.id); setStep(1); }}
                  className={`group flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all hover:border-violet-500/30 hover:shadow-lg hover:-translate-y-0.5 ${
                    selectedMode === mode.id ? "border-violet-500 bg-violet-500/5" : "border-border bg-card"
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${mode.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{mode.title}</h3>
                    <p className="text-sm text-muted-foreground">{mode.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Step 1: Upload + Configuration */}
        {step === 1 && (
          <motion.div
            key="config"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Title */}
            <div className="rounded-xl border border-border bg-card p-6">
              <label className="text-sm font-medium">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My First Cover"
                className="mt-2 w-full rounded-xl border border-border bg-background py-3 px-4 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* AI Generate: Prompt */}
            {selectedMode === "ai_generate" ? (
              <div className="rounded-xl border border-border bg-card p-6">
                <label className="text-sm font-medium">Describe Your Song</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a sad romantic acoustic Hindi song with soft guitar and emotional vibe."
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-border bg-background py-3 px-4 text-sm resize-none focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            ) : (
              /* Upload Area */
              <div className="rounded-xl border border-border bg-card p-6">
                <label className="text-sm font-medium">
                  {selectedMode === "mix_master" ? "Upload Full Track" : "Upload Vocal"}
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
                    dragActive ? "border-violet-500 bg-violet-500/5" : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  {uploadedFile ? (
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                        <Music2 className="h-6 w-6 text-emerald-500" />
                      </div>
                      <p className="text-sm font-medium">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="mt-3 inline-flex items-center gap-1 text-xs text-red-500 hover:underline"
                      >
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Drag & drop your audio file</p>
                      <p className="mt-1 text-xs text-muted-foreground">MP3, WAV, M4A — up to 50MB</p>
                      <label className="mt-4 cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                        Browse Files
                        <input
                          type="file"
                          accept=".mp3,.wav,.m4a,audio/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Genre & Mood */}
            {selectedMode !== "mix_master" && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-6">
                  <label className="text-sm font-medium">Genre</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {GENRES.slice(0, 8).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGenre(g)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          genre === g ? "gradient-primary text-white" : "border border-border hover:border-violet-500/30"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                  <label className="text-sm font-medium">Mood</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          mood === m ? "gradient-primary text-white" : "border border-border hover:border-violet-500/30"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mastering Style */}
            <div className="rounded-xl border border-border bg-card p-6">
              <label className="text-sm font-medium">Mastering Style</label>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {MASTERING_STYLES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setMasteringStyle(s.value)}
                    className={`rounded-xl p-3 text-left transition-all ${
                      masteringStyle === s.value
                        ? "border-2 border-violet-500 bg-violet-500/5"
                        : "border border-border hover:border-violet-500/20"
                    }`}
                  >
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(0)}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={startProcessing}
                disabled={loading}
                className="group flex items-center gap-2 rounded-xl gradient-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? "Starting..." : "Start Processing"}
                {!loading && <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { Suspense } from "react";

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>}>
      <CreateContent />
    </Suspense>
  );
}
