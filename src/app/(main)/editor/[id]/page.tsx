"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Play, Pause, Sliders, Music, FileText, ChevronLeft,
  Sparkles, Save, RotateCcw, Plus, Trash2, Loader2, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { GENRES, MOODS, MASTERING_STYLES } from "@/lib/constants";

interface ProjectSection {
  id: string;
  label: string;
  start: number;
  end: number;
  lyrics: string;
  type: "intro" | "verse" | "pre_chorus" | "chorus" | "bridge" | "outro";
}

const DEFAULT_SECTIONS: ProjectSection[] = [
  { id: "1", label: "Intro", start: 0, end: 15, lyrics: "[Instrumental Intro]", type: "intro" },
  { id: "2", label: "Verse 1", start: 15, end: 55, lyrics: "Dil ke armaan, aankhon mein hai...\nTu hi mera sapna, tu hi meri dhadkan...", type: "verse" },
  { id: "3", label: "Chorus", start: 55, end: 95, lyrics: "Sun yaara, sun yaara...\nTere bina main adhoora, tere bina main fana...", type: "chorus" },
  { id: "4", label: "Bridge", start: 95, end: 125, lyrics: "Khwab mein bhi tera hi zikr hai...\nZindagi ka safar ab tere sang hai...", type: "bridge" },
  { id: "5", label: "Chorus", start: 125, end: 165, lyrics: "Sun yaara, sun yaara...\nTere bina main adhoora, tere bina main fana...", type: "chorus" },
  { id: "6", label: "Outro", start: 165, end: 180, lyrics: "[Soft Outro fades out]", type: "outro" },
];

function EditorContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const supabase = createClient();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Playback States
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Song Structure States
  const [sections, setSections] = useState<ProjectSection[]>(DEFAULT_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState<string>("2");

  // Customization Sliders
  const [bpm, setBpm] = useState(120);
  const [genre, setGenre] = useState("Bollywood Pop");
  const [mood, setMood] = useState("Romantic");
  const [masteringStyle, setMasteringStyle] = useState("clean");

  useEffect(() => {
    if (!id) return;

    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        if (data.project) {
          setProject(data.project);
          setBpm(data.project.bpm || 120);
          setGenre(data.project.genre || "Bollywood Pop");
          setMood(data.project.mood || "Romantic");
          setMasteringStyle(data.project.mastering_style || "clean");
          if (data.project.duration) {
            setDuration(data.project.duration);
          }
          if (data.project.customization?.sections) {
            setSections(data.project.customization.sections);
          }
        }
      } catch (err) {
        console.error("Error loading editor project:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  // Audio Playback synchronization
  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      // Auto-detect active section based on current play time
      const match = sections.find(
        (s) => audioRef.current!.currentTime >= s.start && audioRef.current!.currentTime < s.end
      );
      if (match && match.id !== activeSectionId) {
        setActiveSectionId(match.id);
      }
    }
  };

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  const updateSectionLyrics = (text: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === activeSectionId ? { ...s, lyrics: text } : s))
    );
  };

  const triggerRegenerate = async () => {
    setRegenerating(true);
    setPlaying(false);
    
    // Simulate compilation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Calculate updated full lyrics
    const fullLyrics = sections.map((s) => `[${s.label}]\n${s.lyrics}`).join("\n\n");

    try {
      const { getAIProvider } = await import("@/lib/ai/modelRouter");
      const provider = getAIProvider();
      const res = await provider.generateSong({
        projectId: id,
        genre,
        mood,
        bpm,
        lyrics: fullLyrics,
        masteringStyle,
      });

      if (res.success) {
        // Save back to DB
        await fetch(`/api/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bpm,
            genre,
            mood,
            mastering_style: masteringStyle,
            lyrics: fullLyrics,
            customization: {
              ...project.customization,
              sections,
            },
          }),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRegenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const fullLyrics = sections.map((s) => `[${s.label}]\n${s.lyrics}`).join("\n\n");
    
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bpm,
          genre,
          mood,
          mastering_style: masteringStyle,
          lyrics: fullLyrics,
          customization: {
            ...project.customization,
            sections,
          },
        }),
      });
      alert("Project saved successfully!");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center flex-col gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <p className="text-sm text-muted-foreground">Loading composition session...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center flex-col gap-3">
        <p className="text-sm text-red-500 font-medium">Session not found</p>
        <Link href="/projects" className="text-sm text-violet-500 hover:underline">
          Go back to projects
        </Link>
      </div>
    );
  }

  const audioSource = project.output_mp3_url || project.output_file_url || "https://kudivkkrmgraypstkgot.supabase.co/storage/v1/object/public/audio_uploads/demo-vocal.mp3";

  return (
    <div className="space-y-6">
      <audio
        ref={audioRef}
        src={audioSource}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration || 180)}
        onEnded={() => setPlaying(false)}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Project Result
          </Link>
          <h1 className="text-2xl font-bold tracking-tight capitalize flex items-center gap-2">
            <Sliders className="h-6 w-6 text-violet-500" />
            <span>Song Editor — {project.title}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-muted"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Draft
          </button>
          <button
            onClick={triggerRegenerate}
            disabled={regenerating}
            className="flex items-center gap-1.5 rounded-xl gradient-primary px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/15"
          >
            {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Apply & Regenerate
          </button>
        </div>
      </div>

      {/* Editor Layout Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline & Lyrics (Left/Col-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Waveform timeline editor */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Music className="h-4 w-4 text-violet-500" /> Waveform Timeline
            </h3>

            {/* Simulated Timeline sections block */}
            <div className="relative h-24 rounded-xl bg-muted/30 overflow-hidden flex items-end p-2 border border-border">
              {/* Active Playhead tracker bar */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)] z-20 pointer-events-none"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />

              {/* Grid block overlays of structures */}
              <div className="absolute inset-0 flex">
                {sections.map((sec) => {
                  const widthPercent = ((sec.end - sec.start) / duration) * 100;
                  const isActive = activeSectionId === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSectionId(sec.id);
                        if (audioRef.current) {
                          audioRef.current.currentTime = sec.start;
                        }
                      }}
                      className={`h-full border-r border-border flex flex-col justify-between p-2 text-left relative transition-all ${
                        isActive ? "bg-violet-500/10 border-t-2 border-t-violet-500" : "hover:bg-muted/30"
                      }`}
                      style={{ width: `${widthPercent}%` }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider block truncate text-muted-foreground">
                        {sec.label}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground/60 block">
                        {sec.start}s - {sec.end}s
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setPlaying(!playing)}
                className="flex h-11 w-11 items-center justify-center rounded-full gradient-primary text-white shadow-md shadow-violet-500/20 hover:scale-105 transition-all"
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>

              <span className="text-xs font-mono text-muted-foreground">
                Playhead: {Math.round(currentTime)}s / {Math.round(duration)}s
              </span>
            </div>
          </div>

          {/* Lyrics Editor panel */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-500" />
                <span>Lyrics Structure — Edit Section: <span className="text-violet-500 capitalize">{activeSection.label}</span></span>
              </h3>
            </div>

            <textarea
              value={activeSection.lyrics}
              onChange={(e) => updateSectionLyrics(e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-border bg-background py-3 px-4 text-sm font-mono resize-none focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            <p className="text-[10px] text-muted-foreground">
              Tip: Modify the lyrics above. Clicking "Apply & Regenerate" will adapt vocals using your trained Voice DNA.
            </p>
          </div>
        </div>

        {/* Global Controls Panel (Right/Col-1) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <h3 className="text-sm font-semibold border-b border-border pb-3">Vibe Customization</h3>

            {/* Genre */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm focus:border-violet-500 focus:outline-none"
              >
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm focus:border-violet-500 focus:outline-none"
              >
                {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* BPM */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
                <span>Tempo</span>
                <span className="font-mono text-violet-500">{bpm} BPM</span>
              </div>
              <input
                type="range"
                min={60}
                max={180}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full h-1.5 appearance-none rounded-full bg-muted accent-violet-500"
              />
            </div>

            {/* Mastering Preset */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Mastering Preset</label>
              <div className="grid grid-cols-2 gap-1.5">
                {MASTERING_STYLES.slice(0, 4).map((s) => {
                  const isSelected = masteringStyle === s.value;
                  return (
                    <button
                      key={s.value}
                      onClick={() => setMasteringStyle(s.value)}
                      className={`rounded-lg p-2 text-left border text-[10px] font-semibold transition-all ${
                        isSelected
                          ? "border-violet-500 bg-violet-500/5 text-violet-500"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extending duration option */}
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Song Extension</label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const extraSec = 30;
                    setDuration((prev) => prev + extraSec);
                    setSections((prev) => [
                      ...prev,
                      {
                        id: (prev.length + 1).toString(),
                        label: `Extension`,
                        start: duration,
                        end: duration + extraSec,
                        lyrics: "[Instrumental Extension section]",
                        type: "outro",
                      },
                    ]);
                  }}
                  className="w-full text-center rounded-xl border border-border p-2.5 text-xs font-semibold hover:bg-muted flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Extend Song 30s
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Loader animation overlay */}
      <AnimatePresence>
        {regenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 text-center shadow-2xl"
            >
              <Loader2 className="h-8 w-8 animate-spin text-violet-500 mx-auto mb-4" />
              <h4 className="font-bold text-lg">Regenerating Song...</h4>
              <p className="text-xs text-muted-foreground mt-1 px-4">
                Applying section structural edits, lyrics modifications, and mixing with trained Voice DNA.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SongEditorPage() {
  return (
    <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
