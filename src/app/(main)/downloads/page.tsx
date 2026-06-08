"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Download, Music, Shield, ArrowRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  mode: string;
  genre: string;
  mood: string;
  status: string;
  created_at: string;
  release_quality_score?: number;
  quality_score?: number;
  audio_blobs?: Record<string, string>;
}

const FILE_TYPES = [
  { key: "mp3", label: "Final MP3", size: "6.8 MB", color: "text-violet-500", desc: "320kbps compression" },
  { key: "wav", label: "Final WAV", size: "38.2 MB", color: "text-blue-500", desc: "24-bit/48kHz studio lossless" },
  { key: "flac", label: "Final FLAC", size: "26.4 MB", color: "text-pink-500", desc: "Audiophile-grade lossless" },
  { key: "instrumental", label: "Instrumental (WAV)", size: "32.1 MB", color: "text-emerald-500", desc: "Vocal-free backtrack" },
  { key: "acapella", label: "Acapella (WAV)", size: "12.8 MB", color: "text-amber-500", desc: "Raw isolated vocal stem" },
  { key: "stems", label: "Stems ZIP", size: "94.5 MB", color: "text-cyan-500", desc: "Individual multi-tracks" },
  { key: "lyrics", label: "Lyrics TXT", size: "1.2 KB", color: "text-indigo-500", desc: "Synchronized lyrics text file" },
  { key: "project", label: "Project ZIP", size: "128.0 MB", color: "text-rose-500", desc: "Complete mix session package" },
];

export default function DownloadsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.projects) {
          const completed = data.projects.filter((p: Project) => p.status === "completed");
          setProjects(completed);
          if (completed.length > 0) {
            setSelectedProject(completed[0]);
          }
        }
      } catch (err) {
        console.error("Error loading downloads:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center flex-col gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <p className="text-sm text-muted-foreground">Loading download records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Download className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">Downloads Panel</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Access high-fidelity stems, masters, and complete project sessions for all completed work.
        </p>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"
        >
          <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No ready downloads found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Once you create a song or finish mastering a vocal track, all your files will appear here for download.
          </p>
          <Link
            href="/create"
            className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 hover:shadow-lg transition-all"
          >
            Create Your First Song
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* List */}
          <div className="md:col-span-1 space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
              Completed Compositions
            </h2>
            <div className="space-y-1">
              {projects.map((p) => {
                const isSelected = selectedProject?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`w-full text-left rounded-xl p-4 transition-all border ${
                      isSelected
                        ? "border-violet-500 bg-violet-500/5 shadow-md"
                        : "border-border hover:border-violet-500/20 bg-card hover:bg-muted/50"
                    }`}
                  >
                    <p className="text-sm font-semibold truncate capitalize">{p.title}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                      {p.mode.replace("_", " ")} • {p.genre || "Pop"}
                    </p>
                    {p.release_quality_score && (
                      <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-violet-500 bg-violet-500/10 rounded-full px-2 py-0.5 w-max">
                        <Sparkles className="h-3 w-3" />
                        Quality: {p.release_quality_score}%
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details & Download Grid */}
          <div className="md:col-span-2 space-y-4">
            <AnimatePresence mode="wait">
              {selectedProject && (
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  {/* Selected Info */}
                  <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold capitalize">{selectedProject.title}</h3>
                      <p className="text-sm text-muted-foreground capitalize mt-0.5">
                        {selectedProject.mode.replace("_", " ")} • {selectedProject.genre} • {selectedProject.mood}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created {new Date(selectedProject.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-violet-500/5 border border-violet-500/20 rounded-2xl p-4 self-start sm:self-center">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Release Quality</p>
                        <p className="text-3xl font-extrabold gradient-primary-text">
                          {selectedProject.release_quality_score || 91}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warning on License rights */}
                  <div className="flex gap-3 rounded-xl border border-violet-500/10 bg-violet-500/5 p-4 text-xs text-violet-500">
                    <Shield className="h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-semibold">Commercial Usage Rights Active</p>
                      <p className="mt-0.5 opacity-80">
                        This download includes complete master rights. Ensure reference songs uploaded conform to fair use.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {FILE_TYPES.map((file) => {
                      let localUrl;
                      if (selectedProject.audio_blobs) {
                        const blobs = selectedProject.audio_blobs;
                        if (file.key === "mp3") localUrl = blobs.output_mp3_url;
                        else if (file.key === "wav") localUrl = blobs.output_wav_url;
                        else if (file.key === "flac") localUrl = blobs.output_flac_url;
                        else if (file.key === "instrumental") localUrl = blobs.instrumental_url;
                        else if (file.key === "acapella") localUrl = blobs.acapella_url;
                        else if (file.key === "stems") localUrl = blobs.stems_zip_url;
                        else if (file.key === "lyrics") localUrl = blobs.lyrics_txt_url;
                        else if (file.key === "project") localUrl = blobs.project_zip_url;
                      }
                      
                      return (
                        <a
                          key={file.key}
                          href={localUrl || `/api/download/${selectedProject.id}/${file.key}`}
                          download={`${selectedProject.title || file.key}.${file.key === "stems" || file.key === "project" ? "zip" : file.key === "lyrics" ? "txt" : file.key}`}
                          className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-violet-500/20 hover:shadow-md hover:bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted group-hover:bg-violet-500/5 transition-colors`}>
                              <Download className={`h-5 w-5 ${file.color}`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">{file.label}</p>
                              <p className="text-xs text-muted-foreground truncate">{file.desc}</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-medium text-muted-foreground whitespace-nowrap ml-3">
                            {file.size}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
