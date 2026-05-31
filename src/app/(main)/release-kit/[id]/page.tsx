"use client";

import { motion } from "framer-motion";
import { Copy, Check, Download, Package, Hash, FileText, Image, Camera, MonitorPlay } from "lucide-react";
import { useState } from "react";

const mockKit = {
  title_ideas: ["Tum Hi Ho (Acoustic Cover)", "My Version — Tum Hi Ho", "Tum Hi Ho Reimagined"],
  cover_art_prompt: "A silhouette of a singer under soft violet studio lights, holding a microphone, with gentle bokeh effects and a dark gradient background. Emotional, cinematic, intimate.",
  instagram_caption: "🎤 Just dropped my acoustic cover of Tum Hi Ho — recorded at home, polished by AI ✨\n\nThis song has always been close to my heart. Finally got the courage to put my version out there. Let me know what you think! 💜\n\n#TumHiHo #AcousticCover #IndieArtist",
  youtube_description: "🎵 Tum Hi Ho — Acoustic Cover\n\nRecorded at home and professionally mixed & mastered using U&M Music AI.\n\nOriginal Song: Arijit Singh\nCover: [Your Name]\nProduced with: U&M Music AI\n\n⏱ Timestamps:\n0:00 Intro\n0:15 Verse 1\n1:02 Chorus\n2:10 Bridge\n2:45 Final Chorus\n\n#TumHiHo #Cover #AcousticCover",
  hashtags: ["#TumHiHo", "#AcousticCover", "#IndieArtist", "#AIMusic", "#HomestudioRecording", "#UandMMusic", "#BollywoodCover", "#SingerSongwriter", "#MusicAI", "#VocalCover"],
  checklist: [
    { item: "Final mix approved", done: true },
    { item: "Master exported in WAV + MP3", done: true },
    { item: "Cover art created", done: false },
    { item: "Metadata filled", done: true },
    { item: "Instagram reel planned", done: false },
    { item: "YouTube upload scheduled", done: false },
    { item: "Distribution submitted", done: false },
  ],
  metadata: { artist_name: "Artist", genre: "Bollywood Pop", language: "Hindi", mood: "Romantic", bpm: 92 },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs text-violet-500 hover:underline">
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function ReleaseKitPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Package className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">Release Kit</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Everything you need to release your song.</p>
      </motion.div>

      {/* Metadata */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Song Metadata</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(mockKit.metadata).map(([key, value]) => (
            <div key={key} className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground capitalize">{key.replace("_", " ")}</p>
              <p className="mt-1 text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Title Ideas */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-violet-500" /> Song Title Ideas</h3>
        <div className="space-y-2">
          {mockKit.title_ideas.map((title) => (
            <div key={title} className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
              <span className="text-sm font-medium">{title}</span>
              <CopyButton text={title} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cover Art Prompt */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><Image className="h-4 w-4 text-violet-500" /> Cover Art Prompt</h3>
          <CopyButton text={mockKit.cover_art_prompt} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-xl p-4">{mockKit.cover_art_prompt}</p>
      </motion.div>

      {/* Instagram Caption */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><Camera className="h-4 w-4 text-pink-500" /> Instagram Caption</h3>
          <CopyButton text={mockKit.instagram_caption} />
        </div>
        <pre className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-xl p-4 whitespace-pre-wrap font-sans">{mockKit.instagram_caption}</pre>
      </motion.div>

      {/* YouTube Description */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><MonitorPlay className="h-4 w-4 text-red-500" /> YouTube Description</h3>
          <CopyButton text={mockKit.youtube_description} />
        </div>
        <pre className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-xl p-4 whitespace-pre-wrap font-sans">{mockKit.youtube_description}</pre>
      </motion.div>

      {/* Hashtags */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><Hash className="h-4 w-4 text-violet-500" /> Hashtags</h3>
          <CopyButton text={mockKit.hashtags.join(" ")} />
        </div>
        <div className="flex flex-wrap gap-2">
          {mockKit.hashtags.map((tag) => (
            <span key={tag} className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-500">{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* Checklist */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Release Checklist</h3>
        <div className="space-y-2">
          {mockKit.checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/50">
              <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                item.done ? "border-emerald-500 bg-emerald-500" : "border-muted-foreground"
              }`}>
                {item.done && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : "font-medium"}`}>
                {item.item}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <button className="w-full rounded-xl gradient-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20">
        <Download className="inline h-4 w-4 mr-2" />
        Download Complete Release Kit
      </button>
    </div>
  );
}
