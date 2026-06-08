"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Disc3, Upload, Play, Pause, Download, Loader2, Check, Music, Mic,
  ArrowRight, RotateCcw, ChevronRight
} from "lucide-react";

const COVER_STAGES = [
  { id: "timing", label: "Timing Alignment", description: "Syncing vocal timing with reference track", icon: "⏱️" },
  { id: "key", label: "Key Detection", description: "Detecting key & transposing vocals", icon: "🎹" },
  { id: "vocal", label: "Vocal Processing", description: "Cleaning & enhancing vocal performance", icon: "🎤" },
  { id: "mix", label: "Mixing", description: "Balancing vocals with instrumentation", icon: "🎛️" },
  { id: "master", label: "Mastering", description: "Final polish & loudness optimization", icon: "💎" },
];

function WaveformVisual({ color, seed }: { color: string; seed: number }) {
  const bars: number[] = [];
  for (let i = 0; i < 60; i++) {
    const x = Math.sin(i * 0.2 + seed) * 0.4 + Math.sin(i * 0.1 + seed * 3) * 0.3;
    bars.push(Math.abs(x) * 80 + 10);
  }
  return (
    <div className="flex items-end gap-[2px] h-16">
      {bars.map((h, i) => (
        <div key={i} className={`flex-1 rounded-full ${color}`} style={{ height: `${h}%`, minWidth: 2 }} />
      ))}
    </div>
  );
}

export default function CoverStudioPage() {
  const [step, setStep] = useState(0); // 0=upload, 1=processing, 2=result
  const [vocalFile, setVocalFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [processing, setProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [detectedKey, setDetectedKey] = useState("");
  const [detectedBpm, setDetectedBpm] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dragVocal, setDragVocal] = useState(false);
  const [dragRef, setDragRef] = useState(false);

  const handleProcess = () => {
    setStep(1);
    setProcessing(true);
    setCurrentStage(0);
    setStageProgress(0);

    let stage = 0;
    const stageInterval = setInterval(() => {
      setStageProgress(prev => {
        const next = prev + Math.random() * 5 + 2;
        if (next >= 100) {
          stage++;
          if (stage >= COVER_STAGES.length) {
            clearInterval(stageInterval);
            setDetectedKey("A Minor");
            setDetectedBpm(128);
            setProcessing(false);
            setCompleted(true);
            setStep(2);
            return 100;
          }
          setCurrentStage(stage);
          return 0;
        }
        return next;
      });
    }, 150);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Disc3 className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">Cover Studio</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Create professional cover songs. Upload your vocal and a reference track — AI handles the rest.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 0: Upload */}
        {step === 0 && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
            {/* Title */}
            <div className="rounded-xl border border-border bg-card p-6">
              <label className="text-sm font-medium">Cover Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., My cover of Tum Hi Ho"
                className="mt-2 w-full rounded-xl border border-border bg-background py-3 px-4 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Dual Upload */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Vocal Upload */}
              <div
                onDragOver={e => { e.preventDefault(); setDragVocal(true); }}
                onDragLeave={() => setDragVocal(false)}
                onDrop={e => { e.preventDefault(); setDragVocal(false); if (e.dataTransfer.files[0]) setVocalFile(e.dataTransfer.files[0]); }}
                className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  dragVocal ? "border-violet-500 bg-violet-500/5" : vocalFile ? "border-emerald-500/30 bg-emerald-500/5" : "border-border hover:border-muted-foreground/30"
                }`}
              >
                {vocalFile ? (
                  <div>
                    <div className="mx-auto mb-3 h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10">
                      <Mic className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium truncate">{vocalFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{(vocalFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                    <button onClick={() => setVocalFile(null)} className="mt-2 text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                ) : (
                  <div>
                    <Mic className="mx-auto h-8 w-8 text-violet-500 mb-3" />
                    <p className="text-sm font-semibold">Your Vocal</p>
                    <p className="text-xs text-muted-foreground mt-1">Drop your vocal recording</p>
                    <label className="mt-3 inline-block cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                      Browse
                      <input type="file" accept="audio/*" className="hidden" onChange={e => e.target.files?.[0] && setVocalFile(e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>

              {/* Reference Upload */}
              <div
                onDragOver={e => { e.preventDefault(); setDragRef(true); }}
                onDragLeave={() => setDragRef(false)}
                onDrop={e => { e.preventDefault(); setDragRef(false); if (e.dataTransfer.files[0]) setReferenceFile(e.dataTransfer.files[0]); }}
                className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  dragRef ? "border-blue-500 bg-blue-500/5" : referenceFile ? "border-emerald-500/30 bg-emerald-500/5" : "border-border hover:border-muted-foreground/30"
                }`}
              >
                {referenceFile ? (
                  <div>
                    <div className="mx-auto mb-3 h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10">
                      <Music className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium truncate">{referenceFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{(referenceFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                    <button onClick={() => setReferenceFile(null)} className="mt-2 text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                ) : (
                  <div>
                    <Music className="mx-auto h-8 w-8 text-blue-500 mb-3" />
                    <p className="text-sm font-semibold">Reference Song</p>
                    <p className="text-xs text-muted-foreground mt-1">The original/instrumental</p>
                    <label className="mt-3 inline-block cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                      Browse
                      <input type="file" accept="audio/*" className="hidden" onChange={e => e.target.files?.[0] && setReferenceFile(e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={!vocalFile || !referenceFile}
              className="w-full flex items-center justify-center gap-2 rounded-xl gradient-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
            >
              <Disc3 className="h-4 w-4" /> Create Cover <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* Step 1: Processing */}
        {step === 1 && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card p-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-violet-500/10">
                <Disc3 className="h-8 w-8 text-violet-500 animate-spin" style={{ animationDuration: "3s" }} />
              </div>
              <h3 className="text-lg font-bold">Creating Your Cover</h3>
              <p className="text-sm text-muted-foreground mt-1">Processing {vocalFile?.name}</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              {COVER_STAGES.map((stage, i) => (
                <div key={stage.id} className={`flex items-center gap-4 transition-all ${
                  i < currentStage ? "opacity-50" : i === currentStage ? "opacity-100" : "opacity-30"
                }`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    i < currentStage ? "bg-emerald-500/10" : i === currentStage ? "bg-violet-500/10" : "bg-muted"
                  }`}>
                    {i < currentStage ? <Check className="h-5 w-5 text-emerald-500" /> : <span className="text-lg">{stage.icon}</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{stage.label}</p>
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                    {i === currentStage && (
                      <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full gradient-primary transition-all" style={{ width: `${stageProgress}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Result */}
        {step === 2 && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
              <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold">Cover Created Successfully!</h3>
              <p className="text-sm text-muted-foreground mt-1">{title || "Untitled Cover"}</p>
            </div>

            {/* Detection Results */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground">Detected Key</p>
                <p className="text-lg font-bold text-violet-500 mt-1">{detectedKey}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground">Detected BPM</p>
                <p className="text-lg font-bold text-blue-500 mt-1">{detectedBpm}</p>
              </div>
            </div>

            {/* Side-by-side waveforms */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-amber-500 mb-2">Original Vocal</p>
                <WaveformVisual color="bg-amber-500/60" seed={1} />
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-emerald-500 mb-2">Processed Cover</p>
                <WaveformVisual color="bg-gradient-to-t from-violet-500 to-blue-400" seed={2} />
              </div>
            </div>

            {/* Player */}
            <div className="flex items-center justify-center gap-4 py-4">
              <button
                onClick={() => setPlaying(!playing)}
                className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-white shadow-lg shadow-violet-500/20 hover:scale-105 transition-all"
              >
                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-white">
                <Download className="h-4 w-4" /> Download Cover
              </button>
              <button
                onClick={() => { setStep(0); setVocalFile(null); setReferenceFile(null); setCompleted(false); }}
                className="flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" /> Create Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
