"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Mic, Upload, Loader2, Play, Pause, Download, RotateCcw,
  Music, Check, Zap, Star
} from "lucide-react";

const DREAM_ANALYSIS_STEPS = [
  { label: "Analyzing vocal characteristics", icon: "🎤" },
  { label: "Mapping vocal range & timbre", icon: "📊" },
  { label: "Identifying emotional patterns", icon: "❤️" },
  { label: "Selecting perfect genre", icon: "🎭" },
  { label: "Choosing ideal scale & tempo", icon: "🎹" },
  { label: "Designing arrangement", icon: "🎸" },
  { label: "Composing your dream song", icon: "✨" },
  { label: "Final production & mastering", icon: "💎" },
];

export default function DreamSongPage() {
  const [step, setStep] = useState(0); // 0=upload, 1=analyzing, 2=result
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [voiceAnalysis, setVoiceAnalysis] = useState({
    vocal_range: "C3 – A5 (2.6 octaves)",
    timbre: "Warm, Breathy",
    strength: "Medium-High",
    emotion: "Romantic, Melancholic",
  });

  const [aiChoices, setAiChoices] = useState({
    genre: "Indie Acoustic Bollywood",
    scale: "D Minor Pentatonic",
    tempo: 92,
    mood: "Romantic Nostalgia",
    arrangement: "Acoustic Guitar, Soft Strings, Light Percussion, Piano Accents",
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        setAudioFile(new File([blob], "voice_sample.wav", { type: "audio/wav" }));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch { alert("Microphone access required."); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleGenerate = () => {
    setStep(1);
    setProgress(0);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 2 + 0.8;
        const step = Math.min(Math.floor(next / (100 / DREAM_ANALYSIS_STEPS.length)), DREAM_ANALYSIS_STEPS.length - 1);
        setCurrentStep(step);
        if (next >= 100) {
          clearInterval(interval);
          setStep(2);
          return 100;
        }
        return next;
      });
    }, 300);
  };

  const demoWaveform: number[] = [];
  for (let i = 0; i < 80; i++) {
    const t = i / 80;
    const envelope = Math.sin(t * Math.PI) * 0.7 + 0.3;
    const wave = Math.sin(t * Math.PI * 10) * 0.3 + Math.sin(t * Math.PI * 5) * 0.25;
    demoWaveform.push(Math.abs(wave) * envelope * 100 + 5);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">Dream Song Engine</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Let AI analyze your voice and create the <strong>perfect song</strong> — built specifically for your vocal DNA.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 0: Upload Voice */}
        {step === 0 && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
            <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-blue-500/5 p-8">
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-violet-500/10">
                  <Star className="h-8 w-8 text-violet-500" />
                </div>
                <h3 className="text-lg font-bold">How It Works</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Sing anything — a few lines, a warm-up, or your favorite song. Our AI will analyze your voice and automatically choose the perfect genre, scale, tempo, mood, and arrangement — creating a song that&apos;s uniquely yours.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
                {["🎤 Sing", "🧠 AI Analyzes", "🎵 Dream Song"].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl mb-1">{s.split(" ")[0]}</div>
                    <p className="text-xs font-medium">{s.split(" ").slice(1).join(" ")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload/Record */}
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              {recording ? (
                <div className="py-4">
                  <div className="relative mx-auto mb-4 h-20 w-20 flex items-center justify-center rounded-full bg-red-500/10">
                    <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                    <Mic className="h-8 w-8 text-red-500" />
                  </div>
                  <p className="text-lg font-bold text-red-500">Recording... {recordingTime}s</p>
                  <p className="text-xs text-muted-foreground mt-1">Sing freely — any song, any style</p>
                  <button onClick={stopRecording} className="mt-4 rounded-xl bg-red-500 px-6 py-2.5 text-sm font-semibold text-white">
                    Stop Recording
                  </button>
                </div>
              ) : audioFile ? (
                <div>
                  <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <Check className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-semibold">{audioFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{(audioFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  <button onClick={() => setAudioFile(null)} className="mt-2 text-xs text-red-500 hover:underline">Remove</button>
                </div>
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={e => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setAudioFile(e.dataTransfer.files[0]); }}
                  className={`py-6 ${dragActive ? "opacity-70" : ""}`}
                >
                  <Mic className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">Record your voice or upload a sample</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">30 seconds to 3 minutes recommended</p>
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={startRecording} className="flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md">
                      <Mic className="h-4 w-4" /> Record Voice
                    </button>
                    <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">
                      <Upload className="h-4 w-4" /> Upload File
                      <input type="file" accept="audio/*" className="hidden" onChange={e => e.target.files?.[0] && setAudioFile(e.target.files[0])} />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {audioFile && (
              <button
                onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 rounded-xl gradient-primary py-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-xl transition-all hover:scale-[1.01]"
              >
                <Sparkles className="h-4 w-4" /> Generate My Dream Song
              </button>
            )}
          </motion.div>
        )}

        {/* Step 1: Analyzing & Generating */}
        {step === 1 && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card p-10 text-center">
            <div className="mx-auto mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20">
              <Sparkles className="h-10 w-10 text-violet-500 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold mb-1">Creating Your Dream Song</h3>
            <p className="text-sm text-muted-foreground mb-8">Analyzing your unique vocal characteristics...</p>

            <div className="max-w-sm mx-auto space-y-3 mb-8 text-left">
              {DREAM_ANALYSIS_STEPS.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${
                  i < currentStep ? "opacity-40" : i === currentStep ? "opacity-100" : "opacity-20"
                }`}>
                  <span className="text-lg w-6">{s.icon}</span>
                  <span className="text-sm flex-1">{s.label}</span>
                  {i < currentStep && <Check className="h-3 w-3 text-emerald-500" />}
                  {i === currentStep && <Loader2 className="h-3 w-3 animate-spin text-violet-500" />}
                </div>
              ))}
            </div>

            <div className="h-2 rounded-full bg-muted overflow-hidden max-w-xs mx-auto">
              <motion.div className="h-full gradient-primary" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
          </motion.div>
        )}

        {/* Step 2: Result */}
        {step === 2 && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {/* Success Banner */}
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-violet-500/5 p-6 text-center">
              <div className="mx-auto mb-3 h-14 w-14 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold">Your Dream Song is Ready!</h3>
              <p className="text-sm text-muted-foreground mt-1">Built uniquely for your voice</p>
            </div>

            {/* Voice Analysis */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Mic className="h-4 w-4 text-violet-500" /> Your Voice Analysis
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(voiceAnalysis).map(([key, value]) => (
                  <div key={key} className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
                    <p className="text-sm font-semibold mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI's Choices */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-500" /> AI&apos;s Perfect Choices For You
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(aiChoices).map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-violet-500/20 bg-background p-3">
                    <p className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
                    <p className="text-sm font-bold text-violet-500 mt-0.5">
                      {typeof value === "number" ? `${value} BPM` : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Waveform & Player */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-end gap-[2px] h-20 mb-4">
                {demoWaveform.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-gradient-to-t from-violet-500 to-pink-400"
                    style={{ height: `${h}%`, minWidth: 2 }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setPlaying(!playing)}
                  className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-white shadow-lg shadow-violet-500/20 hover:scale-105 transition-all"
                >
                  {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20">
                <Download className="h-4 w-4" /> Download Song
              </button>
              <button
                onClick={() => { setStep(0); setAudioFile(null); setProgress(0); }}
                className="flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" /> Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
