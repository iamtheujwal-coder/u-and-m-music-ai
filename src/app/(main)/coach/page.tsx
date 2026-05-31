"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Mic, BarChart3, TrendingUp, AlertCircle } from "lucide-react";

const mockAnalysis = {
  pitch_accuracy: 82,
  breath_control: 75,
  vocal_stability: 88,
  emotion_score: 91,
  timing: 78,
  clarity: 85,
  room_noise_level: 35,
  tips: [
    "Your chorus sounds emotional, but pitch stability drops slightly on higher notes. Try lowering the key by 1 semitone.",
    "Breath control is good but can improve in longer phrases. Practice diaphragm breathing exercises.",
    "Your tone clarity is excellent — keep using this mic positioning.",
    "Room noise is moderate. Try recording in a closet or with soft furnishings around you.",
  ],
  overall: "Strong emotional delivery with room for technical improvement. You have a naturally appealing vocal tone.",
};

const scoreItems = [
  { key: "pitch_accuracy", label: "Pitch Accuracy", color: "from-violet-500 to-purple-500" },
  { key: "breath_control", label: "Breath Control", color: "from-blue-500 to-cyan-500" },
  { key: "vocal_stability", label: "Vocal Stability", color: "from-emerald-500 to-teal-500" },
  { key: "emotion_score", label: "Emotion Score", color: "from-pink-500 to-rose-500" },
  { key: "timing", label: "Timing", color: "from-amber-500 to-orange-500" },
  { key: "clarity", label: "Clarity", color: "from-indigo-500 to-blue-500" },
];

export default function CoachPage() {
  const [analyzed, setAnalyzed] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-primary-text">AI Vocal Coach</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Get personalized feedback to improve your singing.</p>
      </motion.div>

      {!analyzed ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-8"
        >
          <h3 className="font-semibold text-center mb-2">Upload a vocal recording for analysis</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Our AI will analyze your pitch, timing, clarity, and more.
          </p>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); setAnalyzed(true); }}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
              dragActive ? "border-violet-500 bg-violet-500/5" : "border-border"
            }`}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm font-medium">Drop your vocal file here</p>
            <p className="mt-1 text-xs text-muted-foreground">MP3, WAV, M4A</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setAnalyzed(true)}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Upload className="h-4 w-4" /> Browse
              </button>
              <button
                onClick={() => setAnalyzed(true)}
                className="flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Mic className="h-4 w-4" /> Record Now
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Score */}
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Overall Vocal Score</p>
            <div className="relative mx-auto h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                <motion.circle
                  cx="60" cy="60" r="52"
                  stroke="url(#grad)" strokeWidth="8" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - 0.83) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold gradient-primary-text">83</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">{mockAnalysis.overall}</p>
          </div>

          {/* Individual Scores */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-violet-500" /> Detailed Analysis
            </h3>
            <div className="space-y-4">
              {scoreItems.map((item, i) => {
                const score = mockAnalysis[item.key as keyof typeof mockAnalysis] as number;
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm font-bold">{score}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Room Noise */}
            <div className="mt-6 rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Room Noise Level: {mockAnalysis.room_noise_level}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Moderate noise detected. Consider recording in a quieter environment for better results.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Improvement Tips
            </h3>
            <div className="space-y-3">
              {mockAnalysis.tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex gap-3 rounded-xl bg-muted/50 p-4"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-500">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setAnalyzed(false)}
            className="w-full rounded-xl border border-border py-3 text-sm font-medium hover:bg-muted"
          >
            Analyze Another Recording
          </button>
        </motion.div>
      )}
    </div>
  );
}
