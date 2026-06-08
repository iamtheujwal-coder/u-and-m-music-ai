"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders, Upload, Play, Pause, SkipBack, Download, ToggleLeft, ToggleRight,
  Volume2, VolumeX, Music, Sparkles, Loader2, X, ChevronDown, ChevronUp, Check
} from "lucide-react";
import { STUDIO_EFFECTS, EXPORT_FORMATS, PLATFORM_PRESETS } from "@/lib/constants";
import { useStudioStore } from "@/lib/store";

const EFFECT_CATEGORIES = [
  { id: "cleanup", label: "Vocal Cleanup", color: "from-red-500 to-orange-500" },
  { id: "tuning", label: "Pitch & Tuning", color: "from-violet-500 to-purple-500" },
  { id: "enhance", label: "Enhancement", color: "from-blue-500 to-cyan-500" },
  { id: "creative", label: "Creative FX", color: "from-pink-500 to-rose-500" },
  { id: "mix", label: "Mix & Master", color: "from-emerald-500 to-teal-500" },
];

function generateWaveformBars(count: number, seed: number = 42): number[] {
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.sin(i * 0.15 + seed) * 0.5 + Math.sin(i * 0.08 + seed * 2) * 0.3;
    bars.push(Math.abs(x) * 80 + 10);
  }
  return bars;
}

export default function StudioPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processed, setProcessed] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("cleanup");
  const [showExport, setShowExport] = useState(false);
  const [splittingStems, setSplittingStems] = useState(false);
  const [stemCount, setStemCount] = useState<4 | 12>(4);

  const {
    effects, exportFormat, platformPreset, beforeAfter,
    toggleEffect, updateEffectParam, setExportFormat, setPlatformPreset, setBeforeAfter
  } = useStudioStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const eqLowRef = useRef<BiquadFilterNode | null>(null);
  const eqMidRef = useRef<BiquadFilterNode | null>(null);
  const eqHighRef = useRef<BiquadFilterNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const waveformBars = generateWaveformBars(100, audioFile ? audioFile.size : 42);

  const formatTime = (s: number) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleFile = useCallback((file: File) => {
    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setProcessed(false);
    setProcessProgress(0);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const setupAudioChain = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;

    const source = ctx.createMediaElementSource(audioRef.current);
    sourceRef.current = source;

    const gain = ctx.createGain();
    gainRef.current = gain;

    const eqLow = ctx.createBiquadFilter();
    eqLow.type = "lowshelf";
    eqLow.frequency.value = 250;
    eqLowRef.current = eqLow;

    const eqMid = ctx.createBiquadFilter();
    eqMid.type = "peaking";
    eqMid.frequency.value = 2500;
    eqMid.Q.value = 1;
    eqMidRef.current = eqMid;

    const eqHigh = ctx.createBiquadFilter();
    eqHigh.type = "highshelf";
    eqHigh.frequency.value = 8000;
    eqHighRef.current = eqHigh;

    const comp = ctx.createDynamicsCompressor();
    compressorRef.current = comp;

    source.connect(eqLow).connect(eqMid).connect(eqHigh).connect(comp).connect(gain).connect(ctx.destination);
  }, []);

  const applyEffects = useCallback(() => {
    const eqEffect = effects.find(e => e.id === "smart_eq");
    const compEffect = effects.find(e => e.id === "smart_compression");

    if (beforeAfter === "before") {
      if (eqLowRef.current) eqLowRef.current.gain.value = 0;
      if (eqMidRef.current) eqMidRef.current.gain.value = 0;
      if (eqHighRef.current) eqHighRef.current.gain.value = 0;
      if (compressorRef.current) {
        compressorRef.current.threshold.value = 0;
        compressorRef.current.ratio.value = 1;
      }
      return;
    }

    if (eqEffect?.enabled && eqLowRef.current && eqMidRef.current && eqHighRef.current) {
      eqLowRef.current.gain.value = (eqEffect.params.low - 50) * 0.3;
      eqMidRef.current.gain.value = (eqEffect.params.mid - 50) * 0.3;
      eqHighRef.current.gain.value = (eqEffect.params.high - 50) * 0.3;
    }

    if (compEffect?.enabled && compressorRef.current) {
      compressorRef.current.threshold.value = compEffect.params.threshold;
      compressorRef.current.ratio.value = 1 + (compEffect.params.ratio / 100) * 19;
    }
  }, [effects, beforeAfter]);

  useEffect(() => {
    applyEffects();
  }, [applyEffects]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) setupAudioChain();
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const handleProcess = () => {
    setProcessing(true);
    setProcessProgress(0);
    const interval = setInterval(() => {
      setProcessProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setProcessed(true);
          return 100;
        }
        return prev + Math.random() * 4 + 1;
      });
    }, 200);
  };

  const enabledCount = effects.filter(e => e.enabled).length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sliders className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">UANM Studio</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Professional vocal processing with 13 AI-powered effects.</p>
      </motion.div>

      {/* Upload Area */}
      {!audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-16 text-center transition-colors ${
            dragActive ? "border-violet-500 bg-violet-500/5" : "border-border hover:border-muted-foreground/30"
          }`}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Drop your vocal file here</h3>
          <p className="mt-1 text-sm text-muted-foreground">MP3, WAV, M4A, FLAC — up to 50MB</p>
          <label className="mt-6 inline-flex items-center gap-2 cursor-pointer rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-500/20 hover:shadow-lg transition-all">
            <Upload className="h-4 w-4" /> Browse Files
            <input type="file" accept="audio/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        </motion.div>
      )}

      {/* Studio Editor */}
      {audioUrl && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Audio element */}
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
            onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
            onEnded={() => setPlaying(false)}
            muted={muted}
          />

          {/* File info bar */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Music className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">{audioFile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {audioFile && (audioFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            </div>
            <button onClick={() => { setAudioUrl(null); setAudioFile(null); setProcessed(false); }} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Waveform & Player */}
          <div className="rounded-2xl border border-border bg-card p-6">
            {/* Before/After Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBeforeAfter("before")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    beforeAfter === "before" ? "bg-amber-500/10 text-amber-500 border border-amber-500/30" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Before
                </button>
                <button
                  onClick={() => setBeforeAfter("after")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    beforeAfter === "after" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  After
                </button>
              </div>
              <span className="text-xs text-muted-foreground">{enabledCount} effects active</span>
            </div>

            {/* Waveform Visualization */}
            <div className="relative h-24 flex items-end gap-[2px] rounded-xl overflow-hidden bg-muted/30 p-2 mb-4">
              {waveformBars.map((h, i) => {
                const progress = duration > 0 ? currentTime / duration : 0;
                const isPlayed = i / waveformBars.length <= progress;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors duration-150 ${
                      beforeAfter === "after"
                        ? isPlayed ? "bg-gradient-to-t from-violet-500 to-blue-400" : "bg-violet-500/20"
                        : isPlayed ? "bg-gradient-to-t from-amber-500 to-orange-400" : "bg-amber-500/20"
                    }`}
                    style={{ height: `${h}%`, minWidth: 2 }}
                  />
                );
              })}
              {/* Progress overlay click */}
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={e => {
                  if (!audioRef.current || !duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  audioRef.current.currentTime = pct * duration;
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }} className="p-2 rounded-lg hover:bg-muted">
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  onClick={togglePlay}
                  className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-white shadow-lg shadow-violet-500/20 hover:shadow-xl transition-all hover:scale-105"
                >
                  {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>
                <button onClick={() => setMuted(!muted)} className="p-2 rounded-lg hover:bg-muted">
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-sm font-mono text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* Effects Panel */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              Effects Chain
            </h2>

            {EFFECT_CATEGORIES.map(cat => {
              const catEffects = STUDIO_EFFECTS.filter(e => e.category === cat.id);
              const isExpanded = expandedCategory === cat.id;
              const activeInCat = catEffects.filter(e => effects.find(ef => ef.id === e.id)?.enabled).length;

              return (
                <div key={cat.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                    className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${cat.color}`} />
                      <span className="text-sm font-semibold">{cat.label}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {activeInCat}/{catEffects.length}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border"
                      >
                        <div className="p-4 space-y-3">
                          {catEffects.map(effect => {
                            const state = effects.find(e => e.id === effect.id);
                            if (!state) return null;

                            return (
                              <div key={effect.id} className={`rounded-xl border p-4 transition-all ${
                                state.enabled ? "border-violet-500/30 bg-violet-500/5" : "border-border"
                              }`}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{effect.icon}</span>
                                    <div>
                                      <p className="text-sm font-medium">{effect.label}</p>
                                      <p className="text-xs text-muted-foreground">{effect.description}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => toggleEffect(effect.id)}
                                    className="transition-colors"
                                  >
                                    {state.enabled
                                      ? <ToggleRight className="h-6 w-6 text-violet-500" />
                                      : <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                                    }
                                  </button>
                                </div>

                                {state.enabled && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-3 space-y-2"
                                  >
                                    {Object.entries(state.params).map(([param, value]) => (
                                      <div key={param} className="flex items-center gap-3">
                                        <span className="text-xs text-muted-foreground capitalize w-20">{param.replace('_', ' ')}</span>
                                        <input
                                          type="range"
                                          min={param === "threshold" ? -60 : 0}
                                          max={param === "threshold" ? 0 : 100}
                                          value={value}
                                          onChange={e => updateEffectParam(effect.id, param, Number(e.target.value))}
                                          className="flex-1 h-1.5 appearance-none rounded-full bg-muted accent-violet-500"
                                        />
                                        <span className="text-xs font-mono w-8 text-right">{Math.round(value)}</span>
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Platform Presets */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold mb-4">Platform Mastering Presets</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PLATFORM_PRESETS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPlatformPreset(platformPreset === p.value ? null : p.value)}
                  className={`flex flex-col items-center rounded-xl p-3 text-center transition-all ${
                    platformPreset === p.value
                      ? "border-2 border-violet-500 bg-violet-500/5"
                      : "border border-border hover:border-violet-500/20"
                  }`}
                >
                  <span className="text-xl mb-1">{p.icon}</span>
                  <span className="text-xs font-medium">{p.label}</span>
                  <span className="text-[10px] text-muted-foreground">{p.lufs} LUFS</span>
                </button>
              ))}
            </div>
          </div>

          {/* Process Button */}
          {!processed && (
            <button
              onClick={handleProcess}
              disabled={processing}
              className="w-full rounded-xl gradient-primary py-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing... {Math.round(processProgress)}%
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Apply {enabledCount} Effects & Process
                </span>
              )}
            </button>
          )}

          {processing && (
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full gradient-primary"
                style={{ width: `${processProgress}%` }}
              />
            </div>
          )}

          {/* Export Panel */}
          {processed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-emerald-500">
                <Check className="h-5 w-5" />
                <h3 className="font-semibold">Processing Complete!</h3>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {EXPORT_FORMATS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setExportFormat(f.value as any)}
                    className={`rounded-xl p-3 text-left transition-all ${
                      exportFormat === f.value
                        ? "border-2 border-violet-500 bg-violet-500/5"
                        : "border border-border hover:border-violet-500/20"
                    }`}
                  >
                    <p className="text-sm font-bold">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.bitrate}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!audioUrl) return;
                  const link = document.createElement("a");
                  link.href = audioUrl;
                  link.target = "_blank";
                  link.download = `mastered_${exportFormat}_${audioFile?.name || "audio.wav"}`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
              >
                <Download className="h-4 w-4" />
                Download {exportFormat.toUpperCase()}
              </button>
            </motion.div>
          )}

          {/* Premium Features: Stem Splitting */}
          {processed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border-2 border-violet-500/30 bg-card p-6 space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-violet-500 text-white px-3 py-1 rounded-bl-xl text-[10px] font-bold tracking-wider uppercase">
                Premium
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-500" />
                  Split Stems
                </h3>
                <p className="text-sm text-muted-foreground">
                  Separate your track into individual instrument layers.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStemCount(4)}
                  className={`flex-1 rounded-xl p-3 border transition-all ${
                    stemCount === 4 ? "border-violet-500 bg-violet-500/5 shadow-sm" : "border-border hover:bg-muted"
                  }`}
                >
                  <p className="text-sm font-bold">4 Stems</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Vocals, Drums, Bass, Other</p>
                </button>
                <button
                  onClick={() => setStemCount(12)}
                  className={`flex-1 rounded-xl p-3 border transition-all ${
                    stemCount === 12 ? "border-violet-500 bg-violet-500/5 shadow-sm" : "border-border hover:bg-muted"
                  }`}
                >
                  <p className="text-sm font-bold">12 Stems</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Advanced Pro separation</p>
                </button>
              </div>

              <button
                onClick={() => {
                  setSplittingStems(true);
                  setTimeout(() => {
                    setSplittingStems(false);
                    const link = document.createElement("a");
                    link.href = "data:application/zip;base64,UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA=="; // Mock empty zip
                    link.download = `stems_${stemCount}_${audioFile?.name || "track"}.zip`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }, 2500);
                }}
                disabled={splittingStems}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-violet-500/50 bg-violet-500/10 hover:bg-violet-500/20 py-3 text-sm font-semibold text-violet-500 transition-colors disabled:opacity-50"
              >
                {splittingStems ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Splitting {stemCount} stems...</>
                ) : (
                  <><Music className="h-4 w-4" /> Download {stemCount} Stems (ZIP)</>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
