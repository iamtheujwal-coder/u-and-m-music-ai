"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music, FileText, Mic, MessageSquare, Wand2, Play, Pause, Download,
  Loader2, Sparkles, Settings2, ChevronRight, RotateCcw, Upload
} from "lucide-react";
import { COMPOSER_GENRES, MOODS, SONG_STRUCTURES, KEY_SIGNATURES } from "@/lib/constants";
import { useComposerStore } from "@/lib/store";
import { processProjectLocally } from "@/lib/audio/mockProcessor";

const INPUT_MODES = [
  { id: "lyrics" as const, icon: FileText, label: "From Lyrics", description: "Paste or write lyrics", color: "from-violet-500 to-purple-500" },
  { id: "humming" as const, icon: Mic, label: "From Humming", description: "Hum your melody idea", color: "from-blue-500 to-cyan-500" },
  { id: "voice_note" as const, icon: Mic, label: "From Voice Note", description: "Describe vocally", color: "from-pink-500 to-rose-500" },
  { id: "upload_vocals" as const, icon: Upload, label: "Upload Raw Vocals", description: "Upload your raw singing recording", color: "from-emerald-500 to-teal-500" },
  { id: "text_prompt" as const, icon: MessageSquare, label: "From Text Prompt", description: "Describe your dream song", color: "from-amber-500 to-orange-500" },
];

const GENERATION_STEPS = [
  { label: "Analyzing input", icon: "🔍" },
  { label: "Composing melody", icon: "🎵" },
  { label: "Generating chords", icon: "🎹" },
  { label: "Arranging instruments", icon: "🎸" },
  { label: "Building structure", icon: "🏗️" },
  { label: "Final mixing", icon: "🎛️" },
];

function generateDemoWaveform(count: number): number[] {
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const envelope = Math.sin(t * Math.PI) * 0.7 + 0.3;
    const melody = Math.sin(t * Math.PI * 12) * 0.3 + Math.sin(t * Math.PI * 6) * 0.2;
    bars.push(Math.abs(melody) * envelope * 100 + 5);
  }
  return bars;
}

export default function ComposerPage() {
  const {
    inputMode, inputText, genre, bpm, keySignature, structure,
    generating, progress,
    setInputMode, setInputText, setGenre, setBpm, setKeySignature,
    setStructure, setGenerating, setProgress
  } = useComposerStore();

  const [step, setStep] = useState(0); // 0=mode, 1=input, 2=config, 3=generating, 4=result
  const [currentGenStep, setCurrentGenStep] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const demoWaveform = generateDemoWaveform(80);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setInputText(url);
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

  const handleGenerate = async () => {
    setStep(3);
    setGenerating(true);
    setProgress(0);
    setCurrentGenStep(0);

    try {
      // Create a project entry so it shows up in their list
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Composer Idea",
          mode: inputMode,
          genre,
          bpm,
          key: keySignature,
          vocal_file_url: (inputMode === "upload_vocals" || inputMode === "humming" || inputMode === "voice_note") ? inputText : null,
          prompt: inputMode === "text_prompt" ? inputText : "",
          lyrics: inputMode === "lyrics" ? inputText : "",
        }),
      });
      const data = await res.json();
      const projectId = data.project?.id || "temp-composer-id";

      await processProjectLocally({
        projectId,
        genre,
        mood: "Happy", // We can add mood to state later if needed
        bpm,
        keySignature,
        duration: 20,
        mode: inputMode,
        onProgress: (p, stageIdx) => {
          setProgress(p);
          setCurrentGenStep(stageIdx);
        },
        onComplete: (urls) => {
          setAudioUrl(urls.output_file_url);
          setGenerating(false);
          setStep(4);
        },
        onError: (err) => {
          console.error(err);
          setGenerating(false);
          setStep(4);
        }
      });
    } catch (err) {
      console.error("Composition error", err);
      setGenerating(false);
      setStep(4);
    }
  };

  const handlePlayResult = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Play error:", err));
    }
    setPlaying(!playing);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <audio
        ref={audioRef}
        src={audioUrl || ""}
        onEnded={() => setPlaying(false)}
      />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Music className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">UANM Composer</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Create original music from lyrics, humming, voice notes, or text prompts.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 0: Input Mode Selection */}
        {step === 0 && (
          <motion.div key="mode" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
            {INPUT_MODES.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => { setInputMode(mode.id); setStep(1); }}
                  className={`group flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all hover:border-violet-500/30 hover:shadow-lg hover:-translate-y-0.5 ${
                    inputMode === mode.id ? "border-violet-500 bg-violet-500/5" : "border-border bg-card"
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${mode.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{mode.label}</h3>
                    <p className="text-sm text-muted-foreground">{mode.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Step 1: Input */}
        {step === 1 && (
          <motion.div key="input" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-3">
                {inputMode === "lyrics" && "Write or Paste Your Lyrics"}
                {inputMode === "text_prompt" && "Describe Your Song"}
                {inputMode === "humming" && "Hum Your Melody"}
                {inputMode === "voice_note" && "Record Your Voice Note"}
                {inputMode === "upload_vocals" && "Upload Raw Vocals"}
              </h3>

              {(inputMode === "lyrics" || inputMode === "text_prompt") && (
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={
                    inputMode === "lyrics"
                      ? "Verse 1:\nDil ke armaan, aankhon mein hai...\n\nChorus:\nTu hi mera sapna, tu hi meri dhadkan..."
                      : "Create a dreamy romantic Bollywood ballad with soft piano, gentle strings, and emotional male vocals in Hindi. Tempo around 85 BPM."
                  }
                  rows={8}
                  className="w-full rounded-xl border border-border bg-background py-3 px-4 text-sm resize-none focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              )}

              {(inputMode === "humming" || inputMode === "voice_note") && (
                <div className="text-center py-8">
                  {recording ? (
                    <div>
                      <div className="relative mx-auto mb-4 h-20 w-20 flex items-center justify-center rounded-full bg-red-500/10">
                        <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                        <Mic className="h-8 w-8 text-red-500" />
                      </div>
                      <p className="text-sm font-medium text-red-500">Recording... {recordingTime}s</p>
                      <button onClick={stopRecording} className="mt-4 rounded-xl bg-red-500 px-6 py-2.5 text-sm font-semibold text-white">
                        Stop Recording
                      </button>
                    </div>
                  ) : inputText ? (
                    <div>
                      <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                        <Mic className="h-7 w-7" />
                      </div>
                      <p className="text-sm font-medium text-emerald-500">Recording captured!</p>
                      <div className="flex justify-center gap-2 mt-3">
                        <button
                          onClick={() => {
                            if (!audioRef.current) return;
                            if (playing) {
                              audioRef.current.pause();
                              setPlaying(false);
                            } else {
                              if (audioRef.current.src !== inputText) {
                                audioRef.current.src = inputText;
                              }
                              audioRef.current.play().catch(e => console.log(e));
                              setPlaying(true);
                            }
                          }}
                          className="rounded-lg bg-muted px-4 py-2 text-xs font-medium hover:bg-muted/80 flex items-center gap-1.5"
                        >
                          {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          {playing ? "Pause" : "Listen Preview"}
                        </button>
                        <button
                          onClick={() => {
                            if (audioRef.current) audioRef.current.pause();
                            setPlaying(false);
                            setInputText("");
                          }}
                          className="rounded-lg border border-border px-4 py-2 text-xs font-medium hover:bg-muted"
                        >
                          Re-record
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Mic className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        {inputMode === "humming" ? "Hum your melody idea clearly" : "Describe your song idea vocally"}
                      </p>
                      <button onClick={startRecording} className="rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-white">
                        <Mic className="inline h-4 w-4 mr-2" />Start Recording
                      </button>
                    </div>
                  )}
                </div>
              )}

              {inputMode === "upload_vocals" && (
                <div className="text-center py-8">
                  {inputText ? (
                    <div>
                      <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                        <Music className="h-7 w-7" />
                      </div>
                      <p className="text-sm font-medium text-emerald-500">Vocal file uploaded successfully!</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs mx-auto">
                        {inputText.startsWith("blob:") ? "vocal_recording.wav" : "vocal.mp3"}
                      </p>
                      <div className="flex justify-center gap-2 mt-3">
                        <button
                          onClick={() => {
                            if (!audioRef.current) return;
                            if (playing) {
                              audioRef.current.pause();
                              setPlaying(false);
                            } else {
                              if (audioRef.current.src !== inputText) {
                                audioRef.current.src = inputText;
                              }
                              audioRef.current.play().catch(e => console.log(e));
                              setPlaying(true);
                            }
                          }}
                          className="rounded-lg bg-muted px-4 py-2 text-xs font-medium hover:bg-muted/80 flex items-center gap-1.5"
                        >
                          {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          {playing ? "Pause" : "Listen Preview"}
                        </button>
                        <button
                          onClick={() => {
                            if (audioRef.current) audioRef.current.pause();
                            setPlaying(false);
                            setInputText("");
                          }}
                          className="rounded-lg border border-border px-4 py-2 text-xs font-medium hover:bg-muted"
                        >
                          Remove file
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload raw vocal recordings (MP3, WAV, etc.)
                      </p>
                      <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-500/20 hover:shadow-lg transition-all">
                        <Upload className="h-4 w-4" /> Browse Audio
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setInputText(url);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(0)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm hover:bg-muted">
                ← Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!inputText}
                className="flex items-center gap-2 rounded-xl gradient-primary px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                Configure <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Configuration */}
        {step === 2 && (
          <motion.div key="config" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {/* Genre */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold mb-3">Genre</h3>
              <div className="flex flex-wrap gap-2">
                {COMPOSER_GENRES.map(g => (
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

            {/* BPM */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Tempo (BPM)</h3>
                <span className="text-sm font-mono font-bold text-violet-500">{bpm} BPM</span>
              </div>
              <input
                type="range"
                min={60}
                max={200}
                value={bpm}
                onChange={e => setBpm(Number(e.target.value))}
                className="w-full h-2 appearance-none rounded-full bg-muted accent-violet-500"
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Slow (60)</span><span>Medium (120)</span><span>Fast (200)</span>
              </div>
            </div>

            {/* Advanced Settings */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-violet-500 hover:underline"
            >
              <Settings2 className="h-4 w-4" />
              {showAdvanced ? "Hide" : "Show"} Advanced Settings
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                  {/* Key Signature */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-3">Key Signature</h3>
                    <select
                      value={keySignature}
                      onChange={e => setKeySignature(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm focus:border-violet-500 focus:outline-none"
                    >
                      {KEY_SIGNATURES.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>

                  {/* Structure */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-3">Song Structure</h3>
                    <div className="space-y-2">
                      {SONG_STRUCTURES.map(s => (
                        <button
                          key={s}
                          onClick={() => setStructure(s)}
                          className={`w-full text-left rounded-xl p-3 text-xs font-mono transition-all ${
                            structure === s ? "border-2 border-violet-500 bg-violet-500/5" : "border border-border hover:border-violet-500/20"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mood */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-3">Mood</h3>
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map(m => (
                        <button key={m} className="rounded-full px-3 py-1.5 text-xs font-medium border border-border hover:border-violet-500/30">
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm hover:bg-muted">
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                className="group flex items-center gap-2 rounded-xl gradient-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                <Wand2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                Generate Music
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Generating */}
        {step === 3 && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card p-12 text-center">
            <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-violet-500/10">
              <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
            </div>
            <h3 className="text-lg font-bold mb-2">Composing Your Music</h3>
            <p className="text-sm text-muted-foreground mb-6">{genre} • {bpm} BPM • {keySignature}</p>

            <div className="max-w-sm mx-auto space-y-3 mb-6">
              {GENERATION_STEPS.map((gs, i) => (
                <div key={i} className={`flex items-center gap-3 transition-all ${
                  i < currentGenStep ? "opacity-50" : i === currentGenStep ? "opacity-100" : "opacity-30"
                }`}>
                  <span className="text-lg">{gs.icon}</span>
                  <span className="text-sm">{gs.label}</span>
                  {i < currentGenStep && <span className="ml-auto text-emerald-500 text-xs">✓</span>}
                  {i === currentGenStep && <Loader2 className="ml-auto h-3 w-3 animate-spin text-violet-500" />}
                </div>
              ))}
            </div>

            <div className="h-2 rounded-full bg-muted overflow-hidden max-w-xs mx-auto">
              <motion.div className="h-full gradient-primary" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
          </motion.div>
        )}

        {/* Step 4: Result */}
        {step === 4 && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
              <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold">Your Composition is Ready!</h3>
              <p className="text-sm text-muted-foreground mt-1">{genre} • {bpm} BPM • {keySignature}</p>
            </div>

            {/* Waveform preview */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-end gap-[2px] h-20 mb-4">
                {demoWaveform.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-gradient-to-t from-violet-500 to-blue-400"
                    style={{ height: `${h}%`, minWidth: 2 }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePlayResult}
                  className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-white shadow-lg shadow-violet-500/20 hover:scale-105 transition-all"
                >
                  {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (!audioUrl) return;
                  const link = document.createElement("a");
                  link.href = audioUrl;
                  link.target = "_blank";
                  link.download = `composed_track_${genre.toLowerCase().replace(/\s+/g, "_")}.wav`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
              >
                <Download className="h-4 w-4" /> Download
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                  setPlaying(false);
                  setAudioUrl(null);
                  setStep(0);
                  setInputText("");
                  setProgress(0);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" /> Compose Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
