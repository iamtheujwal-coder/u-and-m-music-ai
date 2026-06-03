"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Copy, Check, Download, Package, Hash, FileText, Image, Camera, MonitorPlay, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

function ReleaseKitContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [artistName, setArtistName] = useState("Artist");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const supabase = createClient();
        
        // Fetch project details
        const projectRes = await fetch(`/api/projects/${id}`);
        const projectData = await projectRes.json();
        
        if (projectData.project) {
          setProject(projectData.project);
          
          // Fetch user profile to get artist name
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("artist_name, name")
              .eq("id", user.id)
              .single();
              
            if (profile) {
              setArtistName(profile.artist_name || profile.name || "Artist");
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center flex-col gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <p className="text-sm text-muted-foreground">Generating release materials...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center flex-col gap-3">
        <p className="text-sm text-red-500 font-medium">Song not found</p>
        <Link href="/projects" className="text-sm text-violet-500 hover:underline">
          Go back to projects
        </Link>
      </div>
    );
  }

  // Generate metadata dynamically
  const title = project.title || "Untitled Project";
  const genre = project.genre || "Pop";
  const mood = project.mood || "Energetic";
  const masteringStyle = project.mastering_style || "Clean";
  const mode = project.mode ? project.mode.replace("_", " ") : "cover";

  // Dynamic content generations (client-side AI simulation)
  const titleIdeas = [
    `${title} (AI Remastered)`,
    `${title} - Reimagined`,
    `${title} (${genre} Edit)`,
    `${title} [${artistName} Version]`,
  ];

  const coverArtPrompt = `A gorgeous, professional album artwork for a song named '${title}' by '${artistName}' in the genre of ${genre}. Visual themes should evoke a ${mood} mood with ambient neon lighting, deep color gradients, clean shapes, and sophisticated modern aesthetic. Cinematic, 8k resolution, graphic design masterwork.`;

  const instagramCaption = `🎤 Just dropped my new ${mode} track '${title}'! Recorded at home and polished using U&M Music AI ✨\n\nReally happy with how the ${masteringStyle} mastering turned out. Let me know what you think in the comments! 💜\n\nFull link in bio!\n\n#${title.replace(/\s+/g, "")} #${artistName.replace(/\s+/g, "")} #${genre} #NewMusic #AIMastering #StudioQuality`;

  const youtubeDescription = `🎵 ${title} by ${artistName} (${mode.toUpperCase()})\n\nRecorded at home, enhanced, and professionally mastered using U&M Music AI.\n\nOriginal Vocalist: ${artistName}\nMastering Style: ${masteringStyle} Mastering\nGenre: ${genre}\nMood: ${mood}\n\n⏱ Timestamps:\n0:00 Intro\n0:15 Verse 1\n1:00 Chorus\n2:15 Verse 2\n2:45 Outro\n\nListen, share, and support! Don't forget to like and subscribe.\n\n#${title.replace(/\s+/g, "")} #${genre} #${artistName.replace(/\s+/g, "")} #MusicAI #HomeRecording`;

  const hashtags = [
    `#${title.replace(/\s+/g, "")}`,
    `#${genre}`,
    `#${artistName.replace(/\s+/g, "")}`,
    "#AIMusic",
    "#HomeRecording",
    "#IndieArtist",
    "#VocalProcessing",
    "#Songwriter"
  ];

  const metadata = {
    artist: artistName,
    title: title,
    genre: genre,
    mood: mood,
    mastering: masteringStyle
  };

  const checklist = [
    { item: "Vocal recording uploaded and processed", done: true },
    { item: "Audio mastered to studio-quality level", done: true },
    { item: "Album Cover Art prompt generated", done: false },
    { item: "Instagram and social posts prepared", done: false },
    { item: "YouTube video description finalized", done: false },
    { item: "WAV & MP3 audio files downloaded", done: false }
  ];

  const handleDownloadKit = () => {
    const kitText = `
U&M MUSIC AI — RELEASE KIT
-----------------------------------------
Song Title: ${title}
Artist: ${artistName}
Genre: ${genre}
Mood: ${mood}
Mastering Style: ${masteringStyle}

-----------------------------------------
TITLE IDEAS:
${titleIdeas.map((t, idx) => `${idx + 1}. ${t}`).join("\n")}

-----------------------------------------
COVER ART PROMPT:
${coverArtPrompt}

-----------------------------------------
INSTAGRAM CAPTION:
${instagramCaption}

-----------------------------------------
YOUTUBE DESCRIPTION:
${youtubeDescription}

-----------------------------------------
HASHTAGS:
${hashtags.join(" ")}
`;

    const blob = new Blob([kitText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, "_")}_release_kit.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href={`/projects/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Project Studio
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Package className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">Release Kit</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Everything you need to launch and promote '{title}' on all streaming platforms.</p>
      </motion.div>

      {/* Metadata */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Song Metadata</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground capitalize">{key.replace("_", " ")}</p>
              <p className="mt-1 text-sm font-semibold truncate capitalize">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Title Ideas */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-violet-500" /> Song Title Ideas</h3>
        <div className="space-y-2">
          {titleIdeas.map((t) => (
            <div key={t} className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
              <span className="text-sm font-medium">{t}</span>
              <CopyButton text={t} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cover Art Prompt */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><Image className="h-4 w-4 text-violet-500" /> Cover Art Prompt</h3>
          <CopyButton text={coverArtPrompt} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-xl p-4">{coverArtPrompt}</p>
      </motion.div>

      {/* Instagram Caption */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><Camera className="h-4 w-4 text-pink-500" /> Instagram Caption</h3>
          <CopyButton text={instagramCaption} />
        </div>
        <pre className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-xl p-4 whitespace-pre-wrap font-sans">{instagramCaption}</pre>
      </motion.div>

      {/* YouTube Description */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><MonitorPlay className="h-4 w-4 text-red-500" /> YouTube Description</h3>
          <CopyButton text={youtubeDescription} />
        </div>
        <pre className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-xl p-4 whitespace-pre-wrap font-sans">{youtubeDescription}</pre>
      </motion.div>

      {/* Hashtags */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><Hash className="h-4 w-4 text-violet-500" /> Hashtags</h3>
          <CopyButton text={hashtags.join(" ")} />
        </div>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <span key={tag} className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-500">{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* Checklist */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Release Checklist</h3>
        <div className="space-y-2">
          {checklist.map((item, i) => (
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

      <button 
        onClick={handleDownloadKit}
        className="w-full rounded-xl gradient-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
      >
        <Download className="inline h-4 w-4 mr-2" />
        Download Complete Release Kit (.txt)
      </button>
    </div>
  );
}

export default function ReleaseKitPage() {
  return (
    <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>}>
      <ReleaseKitContent />
    </Suspense>
  );
}
