"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Upload, Loader2, BarChart3, TrendingUp, Music, AlertCircle,
  Check, Star, Target, Zap, ArrowRight, RotateCcw
} from "lucide-react";
import type { ProducerFeedback } from "@/lib/types";

const ANALYSIS_STEPS = [
  { label: "Decoding audio file", icon: "🔊" },
  { label: "Analyzing harmonic content", icon: "🎵" },
  { label: "Detecting genre characteristics", icon: "🎭" },
  { label: "Evaluating arrangement", icon: "🎸" },
  { label: "Assessing commercial potential", icon: "💰" },
  { label: "Generating recommendations", icon: "💡" },
];

export default function AIProducerPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState<ProducerFeedback | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    setAudioFile(file);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setProgress(0);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 3 + 1.5;
        const step = Math.min(Math.floor(next / (100 / ANALYSIS_STEPS.length)), ANALYSIS_STEPS.length - 1);
        setCurrentStep(step);
        if (next >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setFeedback({
            song_title: audioFile?.name?.replace(/\.[^.]+$/, "") || "Untitled",
            genre_fit: [
              { genre: "Bollywood Pop", confidence: 87 },
              { genre: "Indie Pop", confidence: 72 },
              { genre: "R&B", confidence: 58 },
              { genre: "Lo-fi", confidence: 41 },
            ],
            key_recommendation: "Consider shifting from E Minor to G Minor for a warmer, more emotive feel that suits the vocal range better.",
            bpm_detected: 112,
            arrangement_suggestions: [
              "Add a pre-chorus build with rising synth pads to create tension before the hook.",
              "The bridge section could benefit from a key modulation — try going up a half step for emotional lift.",
              "Consider adding a counter-melody in the chorus using a female backing vocal or synth lead.",
              "The outro feels abrupt — extend it with a fade-out or a reprise of the hook melody.",
              "Add subtle percussion fills at transition points between verse and chorus.",
            ],
            commercial_potential: 74,
            overall_feedback: "This track shows strong melodic instincts and a clear sense of structure. The vocal performance is emotionally engaging, though the production could benefit from more dynamic contrast between sections. The chorus hook is memorable — with refined arrangement and professional mastering, this song has genuine commercial potential in the Indian indie-pop market.",
            strengths: [
              "Strong, memorable chorus melody",
              "Emotionally authentic vocal delivery",
              "Good verse-chorus contrast in energy",
              "Lyrics are relatable and well-structured",
            ],
            improvements: [
              "Increase dynamic range between verse and chorus",
              "Add harmonic variation to avoid repetitive chord progression",
              "Improve low-end presence for streaming platforms",
              "Consider adding backing vocals for fuller sound",
            ],
          });
          return 100;
        }
        return next;
      });
    }, 200);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 55) return "Average";
    return "Needs Work";
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Brain className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">AI Producer</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Get professional AI feedback on your songs — genre analysis, arrangement suggestions, and commercial potential score.</p>
      </motion.div>

      {/* Upload */}
      {!feedback && !analyzing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={e => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            className={`rounded-2xl border-2 border-dashed p-16 text-center transition-colors ${
              dragActive ? "border-violet-500 bg-violet-500/5" : audioFile ? "border-emerald-500/30 bg-emerald-500/5" : "border-border hover:border-muted-foreground/30"
            }`}
          >
            {audioFile ? (
              <div>
                <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-xl bg-emerald-500/10">
                  <Music className="h-7 w-7 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold">{audioFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{(audioFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                <button onClick={() => setAudioFile(null)} className="mt-3 text-xs text-red-500 hover:underline">Remove</button>
              </div>
            ) : (
              <div>
                <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Upload your song for AI analysis</h3>
                <p className="text-sm text-muted-foreground mt-1">MP3, WAV, FLAC — your mixed or demo track</p>
                <label className="mt-6 inline-flex items-center gap-2 cursor-pointer rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-md">
                  <Upload className="h-4 w-4" /> Browse Files
                  <input type="file" accept="audio/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </label>
              </div>
            )}
          </div>

          {audioFile && (
            <button
              onClick={handleAnalyze}
              className="w-full flex items-center justify-center gap-2 rounded-xl gradient-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-xl transition-all hover:scale-[1.01]"
            >
              <Brain className="h-4 w-4" /> Analyze with AI Producer <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      )}

      {/* Analyzing */}
      {analyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-violet-500/10">
            <Brain className="h-8 w-8 text-violet-500 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold mb-6">AI Producer is analyzing your track</h3>

          <div className="max-w-sm mx-auto space-y-3 mb-6 text-left">
            {ANALYSIS_STEPS.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 transition-all ${
                i < currentStep ? "opacity-50" : i === currentStep ? "opacity-100" : "opacity-30"
              }`}>
                <span className="text-lg w-6">{s.icon}</span>
                <span className="text-sm">{s.label}</span>
                {i < currentStep && <Check className="ml-auto h-3 w-3 text-emerald-500" />}
                {i === currentStep && <Loader2 className="ml-auto h-3 w-3 animate-spin text-violet-500" />}
              </div>
            ))}
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden max-w-xs mx-auto">
            <div className="h-full gradient-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </motion.div>
      )}

      {/* Results */}
      {feedback && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Commercial Potential Score */}
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Commercial Potential</p>
            <div className="relative mx-auto h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                <motion.circle
                  cx="60" cy="60" r="52"
                  stroke="url(#prodGrad)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - feedback.commercial_potential / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="prodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold gradient-primary-text">{feedback.commercial_potential}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
            <p className={`mt-3 text-sm font-semibold ${getScoreColor(feedback.commercial_potential)}`}>
              {getScoreLabel(feedback.commercial_potential)}
            </p>
          </div>

          {/* Overall Feedback */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-500" /> Producer&apos;s Note
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feedback.overall_feedback}</p>
          </div>

          {/* Genre Analysis */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" /> Genre Analysis
            </h3>
            <div className="space-y-3">
              {feedback.genre_fit.map((g, i) => (
                <motion.div key={g.genre} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{g.genre}</span>
                    <span className="text-sm font-bold">{g.confidence}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${g.confidence}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">BPM Detected:</span> {feedback.bpm_detected}
              </p>
            </div>
          </div>

          {/* Key Recommendation */}
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-500" /> Key Recommendation
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feedback.key_recommendation}</p>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-emerald-500" /> Strengths
              </h3>
              <div className="space-y-2">
                {feedback.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-muted-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" /> Areas to Improve
              </h3>
              <div className="space-y-2">
                {feedback.improvements.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span className="text-sm text-muted-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Arrangement Suggestions */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Music className="h-4 w-4 text-pink-500" /> Arrangement Suggestions
            </h3>
            <div className="space-y-3">
              {feedback.arrangement_suggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex gap-3 rounded-xl bg-muted/50 p-4"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-500">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setFeedback(null); setAudioFile(null); }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" /> Analyze Another Song
          </button>
        </motion.div>
      )}
    </div>
  );
}
