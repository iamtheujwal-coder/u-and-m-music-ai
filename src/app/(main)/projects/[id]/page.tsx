"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Play, Pause, Download, Share2, RotateCcw, Music, 
  Volume2, VolumeX, ArrowLeft, Check, Camera, MonitorPlay, Loader2
} from "lucide-react";
import Link from "next/link";
import { MASTERING_STYLES, PROCESSING_STAGES } from "@/lib/constants";

// ============================================================
// Deterministic Waveform Generator for visual aesthetics
// ============================================================
const BAR_COUNT = 80;

function generateWaveformData(mode: "before" | "after"): number[] {
  const bars: number[] = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    const t = i / BAR_COUNT;
    if (mode === "after") {
      const base = Math.sin(t * Math.PI * 6) * 0.3;
      const melody = Math.sin(t * Math.PI * 14) * 0.2;
      const envelope = Math.sin(t * Math.PI) * 0.8 + 0.2;
      bars.push(Math.abs(base + melody) * envelope * 100 + 8);
    } else {
      const seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const noise = (seed - Math.floor(seed)) * 0.5;
      const base = Math.sin(t * Math.PI * 4) * 0.2;
      bars.push(Math.abs(base + noise) * 60 + 5);
    }
  }
  return bars;
}

const beforeWaveform = generateWaveformData("before");
const afterWaveform = generateWaveformData("after");

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === Infinity) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface AudioPlayerProps {
  vocalFileUrl: string | null;
  outputFileUrl: string | null;
  playing: boolean;
  setPlaying: (p: boolean) => void;
  beforeAfter: "before" | "after";
  setBeforeAfter: (v: "before" | "after") => void;
  selectedMastering: string;
}

function AudioPlayer({
  vocalFileUrl,
  outputFileUrl,
  playing,
  setPlaying,
  beforeAfter,
  setBeforeAfter,
  selectedMastering,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Web Audio Context & Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dryGainRef = useRef<GainNode | null>(null);
  const wetGainRef = useRef<GainNode | null>(null);
  const eqLowRef = useRef<BiquadFilterNode | null>(null);
  const eqHighRef = useRef<BiquadFilterNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const delayRef = useRef<DelayNode | null>(null);
  const feedbackRef = useRef<GainNode | null>(null);
  const [webAudioActive, setWebAudioActive] = useState(false);

  // Determine current active URL to load
  const activeUrl = beforeAfter === "before" 
    ? vocalFileUrl 
    : (outputFileUrl || vocalFileUrl);

  // When activeUrl changes, update audio src
  useEffect(() => {
    if (!audioRef.current) return;
    const wasPlaying = playing;
    const prevTime = audioRef.current.currentTime;
    
    audioRef.current.src = activeUrl || "";
    audioRef.current.load();
    
    if (prevTime && !isNaN(prevTime)) {
      audioRef.current.currentTime = prevTime;
    }
    
    if (wasPlaying && activeUrl) {
      audioRef.current.play().catch(err => console.log("Play failed:", err));
    }
  }, [activeUrl]);

  // Handle play/pause toggles
  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(err => {
          console.log("Play failed on trigger:", err);
          setPlaying(false);
        });
      }
      if (!audioCtxRef.current && vocalFileUrl) {
        initAudio();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [playing]);

  // Update mix when mode or style changes
  useEffect(() => {
    updateMix(beforeAfter, selectedMastering);
  }, [beforeAfter, selectedMastering, webAudioActive]);

  const initAudio = () => {
    if (!audioRef.current || audioCtxRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaElementSource(audioRef.current);
      sourceRef.current = source;

      // Dry Gain path
      const dryGain = ctx.createGain();
      dryGainRef.current = dryGain;

      // Wet path nodes
      const eqLow = ctx.createBiquadFilter();
      eqLow.type = "lowshelf";
      eqLow.frequency.value = 150;
      eqLowRef.current = eqLow;

      const eqHigh = ctx.createBiquadFilter();
      eqHigh.type = "highshelf";
      eqHigh.frequency.value = 5000;
      eqHighRef.current = eqHigh;

      const compressor = ctx.createDynamicsCompressor();
      compressorRef.current = compressor;

      const delay = ctx.createDelay();
      delay.delayTime.value = 0.22;
      delayRef.current = delay;

      const feedback = ctx.createGain();
      feedback.gain.value = 0.15;
      feedbackRef.current = feedback;

      const wetGain = ctx.createGain();
      wetGainRef.current = wetGain;

      // Connect dry
      source.connect(dryGain);
      dryGain.connect(ctx.destination);

      // Connect wet
      source.connect(eqLow);
      eqLow.connect(eqHigh);
      eqHigh.connect(compressor);
      
      compressor.connect(wetGain);
      compressor.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      feedback.connect(wetGain);

      wetGain.connect(ctx.destination);
      
      setWebAudioActive(true);
    } catch (err) {
      console.warn("Web Audio API processing setup failed (likely CORS or browser security):", err);
    }
  };

  const updateMix = (mode: "before" | "after", style: string) => {
    if (!audioCtxRef.current || !webAudioActive) return;
    const ctx = audioCtxRef.current;

    if (compressorRef.current && eqHighRef.current && eqLowRef.current && delayRef.current) {
      if (style === "warm") {
        eqLowRef.current.gain.value = 3; 
        eqHighRef.current.gain.value = 1; 
        compressorRef.current.threshold.value = -24;
        compressorRef.current.ratio.value = 3.5;
        delayRef.current.delayTime.value = 0.28;
      } else if (style === "clean") {
        eqLowRef.current.gain.value = -6; 
        eqHighRef.current.gain.value = 4; 
        compressorRef.current.threshold.value = -18;
        compressorRef.current.ratio.value = 4;
        delayRef.current.delayTime.value = 0.15;
      } else if (style === "commercial_loud") {
        eqLowRef.current.gain.value = -2;
        eqHighRef.current.gain.value = 7; 
        compressorRef.current.threshold.value = -28; 
        compressorRef.current.ratio.value = 6;
        delayRef.current.delayTime.value = 0.2;
      } else { 
        eqLowRef.current.gain.value = -4;
        eqHighRef.current.gain.value = 3;
        compressorRef.current.threshold.value = -20;
        compressorRef.current.ratio.value = 4;
        delayRef.current.delayTime.value = 0.2;
      }
    }

    if (dryGainRef.current && wetGainRef.current) {
      const isUsingFallbackAfter = mode === "after" && !outputFileUrl;
      
      if (isUsingFallbackAfter) {
        dryGainRef.current.gain.setTargetAtTime(0.0, ctx.currentTime, 0.01);
        wetGainRef.current.gain.setTargetAtTime(1.0, ctx.currentTime, 0.01);
      } else {
        dryGainRef.current.gain.setTargetAtTime(1.0, ctx.currentTime, 0.01);
        wetGainRef.current.gain.setTargetAtTime(0.0, ctx.currentTime, 0.01);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTo = ratio * duration;
    audioRef.current.currentTime = seekTo;
    setCurrentTime(seekTo);
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const waveform = beforeAfter === "after" ? afterWaveform : beforeWaveform;

  return (
    <>
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setBeforeAfter("before")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-medium transition-all ${
            beforeAfter === "before"
              ? "bg-red-500/10 text-red-500 border border-red-500/30"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <VolumeX className="h-4 w-4" /> Before (Raw)
        </button>
        <button
          onClick={() => setBeforeAfter("after")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-medium transition-all ${
            beforeAfter === "after"
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Volume2 className="h-4 w-4" /> After (AI Mastered)
        </button>
      </div>

      <div
        className="relative h-24 rounded-xl bg-muted/50 overflow-hidden mb-4 cursor-pointer group"
        onClick={handleSeek}
      >
        <div
          className="absolute inset-y-0 left-0 bg-violet-500/10 pointer-events-none"
          style={{ width: `${progressRatio * 100}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)] pointer-events-none z-10"
          style={{ left: `${progressRatio * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-2">
          {waveform.map((h, i) => {
            const barPos = i / BAR_COUNT;
            const isPast = barPos < progressRatio;
            return (
              <div
                key={i}
                className={`w-[2px] rounded-full transition-colors duration-150 ${
                  isPast
                    ? beforeAfter === "after"
                      ? "bg-violet-500"
                      : "bg-red-400/70"
                    : "bg-muted-foreground/30 group-hover:bg-muted-foreground/40"
                }`}
                style={{
                  height: `${Math.min(h, 95)}%`,
                  opacity: isPast ? 1 : 0.5,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setPlaying(!playing)}
          disabled={!activeUrl}
          className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-white shadow-lg shadow-violet-500/20 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {formatTime(currentTime)} / {formatTime(duration)}
      </p>
    </>
  );
}

function ProjectDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [beforeAfter, setBeforeAfter] = useState<"before" | "after">("after");
  const [selectedMastering, setSelectedMastering] = useState("clean");

  // Load project details
  useEffect(() => {
    if (!id) return;
    
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        if (data.project) {
          setProject(data.project);
          setSelectedMastering(data.project.mastering_style || "clean");
          
          if (data.project.status === "processing") {
            setProcessing(true);
          } else {
            setProcessing(false);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Handle client-side processing simulation
  useEffect(() => {
    if (!processing || !project) return;
    
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 4 + 1.5;
        if (next >= 100) {
          clearInterval(interval);
          
          // Trigger DB update
          fetch(`/api/projects/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "completed",
              output_file_url: project.vocal_file_url,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.project) {
                setProject(data.project);
              }
              setProcessing(false);
              setLoading(false);
            })
            .catch((err) => {
              console.error(err);
              setProcessing(false);
              setLoading(false);
            });
            
          return 100;
        }
        
        setCurrentStage(
          Math.min(
            Math.floor(next / (100 / PROCESSING_STAGES.length)),
            PROCESSING_STAGES.length - 1
          )
        );
        return next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [processing, id, project?.vocal_file_url]);

  const handleDownload = (type: "mp3" | "wav") => {
    const fileUrl = project?.output_file_url || project?.vocal_file_url;
    if (!fileUrl) return;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = `${project.title || "audio"}.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center flex-col gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <p className="text-sm text-muted-foreground">Loading studio setup...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center flex-col gap-3">
        <p className="text-sm text-red-500 font-medium">Project not found</p>
        <Link href="/projects" className="text-sm text-violet-500 hover:underline">
          Go back to projects
        </Link>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg text-center"
        >
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

  const projectModeLabel = project.mode ? project.mode.replace("_", " ") : "cover";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold capitalize">{project.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground capitalize">
              {projectModeLabel} • {project.genre || "Pop"} • {project.mood || "Energetic"} • {selectedMastering} mastering
            </p>
          </div>
          <span className="inline-flex items-center self-start rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500">
            <Check className="mr-1.5 h-3.5 w-3.5" /> Completed
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <AudioPlayer
          vocalFileUrl={project.vocal_file_url}
          outputFileUrl={project.output_file_url}
          playing={playing}
          setPlaying={setPlaying}
          beforeAfter={beforeAfter}
          setBeforeAfter={setBeforeAfter}
          selectedMastering={selectedMastering}
        />
      </motion.div>

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="text-sm font-semibold mb-4">Export & Share</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button 
            onClick={() => handleDownload("mp3")}
            className="flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:border-violet-500/20 hover:bg-muted/50"
          >
            <Download className="h-5 w-5 text-violet-500" />
            <div className="text-left">
              <p className="text-sm font-medium">MP3</p>
              <p className="text-xs text-muted-foreground">320kbps</p>
            </div>
          </button>
          <button 
            onClick={() => handleDownload("wav")}
            className="flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:border-violet-500/20 hover:bg-muted/50"
          >
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
            href={`/release-kit/${project.id}`}
            className="flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Music className="h-4 w-4" /> Generate Release Kit
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>}>
      <ProjectDetailContent />
    </Suspense>
  );
}
