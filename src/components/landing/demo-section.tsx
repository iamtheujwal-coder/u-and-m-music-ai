"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function DemoSection() {
  const [mode, setMode] = useState<"before" | "after">("before");

  return (
    <section className="relative py-24 px-4" id="demo">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-violet-500">
            Hear the difference
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Before & After AI Processing
          </h2>
          <p className="mt-3 text-muted-foreground">
            Drag the slider or toggle to compare raw vocals with AI-processed output.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 rounded-2xl border border-border bg-card p-8"
        >
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setMode("before")}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all ${
                mode === "before"
                  ? "bg-red-500/10 text-red-500 border border-red-500/30"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <VolumeX className="h-4 w-4" />
              Before (Raw)
            </button>
            <button
              onClick={() => setMode("after")}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all ${
                mode === "after"
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Volume2 className="h-4 w-4" />
              After (AI)
            </button>
          </div>

          {/* Waveform Visualization */}
          <div className="relative h-32 rounded-xl bg-muted/50 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-4">
              {Array.from({ length: 80 }).map((_, i) => {
                const rawHeight = Math.sin(i * 0.3) * 30 + Math.random() * 20 + 10;
                const processedHeight = Math.sin(i * 0.3) * 40 + 15;
                return (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full"
                    animate={{
                      height: mode === "before" ? rawHeight : processedHeight,
                      backgroundColor: mode === "before" ? "#ef4444" : "#10b981",
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                );
              })}
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                mode === "before"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${mode === "before" ? "bg-red-400" : "bg-emerald-400"} animate-pulse`} />
                {mode === "before" ? "Raw Recording" : "AI Processed"}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Noise", before: "High", after: "Removed", improvement: "98%" },
              { label: "Pitch", before: "Off-key", after: "Corrected", improvement: "95%" },
              { label: "Clarity", before: "Muffled", after: "Crystal", improvement: "90%" },
              { label: "Loudness", before: "-18 LUFS", after: "-14 LUFS", improvement: "Optimized" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-muted/50 p-3 text-center">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`mt-1 text-sm font-semibold ${mode === "before" ? "text-red-400" : "text-emerald-400"}`}>
                  {mode === "before" ? stat.before : stat.after}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
