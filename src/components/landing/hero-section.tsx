"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-glow" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Animated Waveform Background */}
      <div className="absolute bottom-20 left-0 right-0 flex items-end justify-center gap-1 opacity-10">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-gradient-to-t from-violet-500 to-blue-500"
            animate={{
              height: [
                Math.random() * 40 + 10,
                Math.random() * 80 + 20,
                Math.random() * 40 + 10,
              ],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.05,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Your AI Music Studio at Home
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Turn your raw voice into a{" "}
          <span className="gradient-primary-text">studio-quality song.</span>
        </motion.h1>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Record from home. Upload your vocals. Let AI clean, mix, master, and produce your music.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-xl gradient-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Your First Song
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="group inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-base font-medium transition-all hover:bg-muted hover:scale-[1.02] active:scale-[0.98]">
            <Play className="h-4 w-4 text-violet-500" />
            Hear Demo
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            No technical skills needed
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            Your voice, your rights
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            Free to start
          </span>
        </motion.div>
      </div>
    </section>
  );
}
