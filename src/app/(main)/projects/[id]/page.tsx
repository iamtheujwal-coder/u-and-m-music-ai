"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  Play, Pause, Download, Share2, RotateCcw, Music, 
  Volume2, VolumeX, ArrowLeft, Check, Camera, MonitorPlay
} from "lucide-react";
import Link from "next/link";
import { MASTERING_STYLES, PROCESSING_STAGES } from "@/lib/constants";

function ProjectDetailContent() {
  const searchParams = useSearchParams();
  const isProcessing = searchParams.get("processing") === "true";
  const [processing, setProcessing] = useState(isProcessing);
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [beforeAfter, setBeforeAfter] = useState<"before" | "after">("after");
  const [selectedMastering, setSelectedMastering] = useState("warm");

  // Mock processing simulation
  useEffect(() => {
    if (!processing) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 3 + 1;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setProcessing(false), 500);
          return 100;
        }
        setCurrentStage(Math.min(Math.floor(next / (100 / PROCESSING_STAGES.length)), PROCESSING_STAGES.length - 1));
        return next;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [processing]);

  if (processing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg text-center"
        >
          {/* Animated Waveform */}
          <div className="mx-auto mb-8 flex h-20 items-end justify-center gap-[3px]">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full gradient-primary"
                animate={{
                  height: [
                    Math.random() * 30 + 10,
                    Math.random() * 60 + 20,
                    Math.random() * 30 + 10,
                  ],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full gradient-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
          </div>

          {/* Stages */}
          <div className="space-y-3 text-left">
            {PROCESSING_STAGES.map((stage, i) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                  i === currentStage ? "bg-violet-500/10" :
                  i < currentStage ? "opacity-60" : "opacity-30"
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  i < currentStage ? "bg-emerald-500/20" :
                  i === currentStage ? "bg-violet-500/20 animate-pulse" : "bg-muted"
                }`}>
                  {i < currentStage ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : i === currentStage ? (
                    <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${i === currentStage ? "text-violet-500" : ""}`}>
                    {stage.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{stage.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tum Hi Ho — Cover</h1>
            <p className="mt-1 text-sm text-muted-foreground">Cover Song • Bollywood Pop • Warm Mastering</p>
          </div>
          <span className="inline-flex items-center self-start rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500">
            <Check className="mr-1.5 h-3.5 w-3.5" /> Completed
          </span>
        </div>
      </motion.div>

      {/* Audio Player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        {/* Before/After Toggle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setBeforeAfter("before")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-medium transition-all ${
              beforeAfter === "before"
                ? "bg-red-500/10 text-red-500 border border-red-500/30"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <VolumeX className="h-4 w-4" /> Before
          </button>
          <button
            onClick={() => setBeforeAfter("after")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-medium transition-all ${
              beforeAfter === "after"
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Volume2 className="h-4 w-4" /> After
          </button>
        </div>

        {/* Waveform */}
        <div className="relative h-24 rounded-xl bg-muted/50 overflow-hidden mb-4">
          <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-2">
            {Array.from({ length: 100 }).map((_, i) => {
              const h = beforeAfter === "after"
                ? Math.sin(i * 0.2) * 30 + 35
                : Math.sin(i * 0.3) * 20 + Math.random() * 15 + 10;
              return (
                <motion.div
                  key={i}
                  className={`w-[2px] rounded-full ${beforeAfter === "after" ? "bg-violet-500" : "bg-muted-foreground/50"}`}
                  animate={{ height: h }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPlaying(!playing)}
            className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-white shadow-lg shadow-violet-500/20 transition-transform hover:scale-105 active:scale-95"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">0:00 / 3:42</p>
      </motion.div>

      {/* Mastering Style Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="text-sm font-semibold mb-3">Mastering Style</h3>
        <div className="flex flex-wrap gap-2">
          {MASTERING_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedMastering(style.value)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                selectedMastering === style.value
                  ? "gradient-primary text-white"
                  : "border border-border hover:border-violet-500/30"
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Export Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="text-sm font-semibold mb-4">Export & Share</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:border-violet-500/20 hover:bg-muted/50">
            <Download className="h-5 w-5 text-violet-500" />
            <div className="text-left">
              <p className="text-sm font-medium">MP3</p>
              <p className="text-xs text-muted-foreground">320kbps</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:border-violet-500/20 hover:bg-muted/50">
            <Download className="h-5 w-5 text-blue-500" />
            <div className="text-left">
              <p className="text-sm font-medium">WAV</p>
              <p className="text-xs text-muted-foreground">Lossless</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:border-violet-500/20 hover:bg-muted/50">
            <Camera className="h-5 w-5 text-pink-500" />
            <div className="text-left">
              <p className="text-sm font-medium">Instagram</p>
              <p className="text-xs text-muted-foreground">Optimized</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:border-violet-500/20 hover:bg-muted/50">
            <MonitorPlay className="h-5 w-5 text-red-500" />
            <div className="text-left">
              <p className="text-sm font-medium">YouTube</p>
              <p className="text-xs text-muted-foreground">HD Audio</p>
            </div>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">
            <Share2 className="h-4 w-4" /> Share Preview
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">
            <RotateCcw className="h-4 w-4" /> Regenerate
          </button>
          <Link
            href="/release-kit/1"
            className="flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Music className="h-4 w-4" /> Generate Release Kit
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

import { Suspense } from "react";

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>}>
      <ProjectDetailContent />
    </Suspense>
  );
}
