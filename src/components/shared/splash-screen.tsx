"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const setSplashDone = useUIStore((s) => s.setSplashDone);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setSplashDone(true), 600);
    }, 2800);
    return () => clearTimeout(timer);
  }, [setSplashDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-2xl">
              <span className="text-3xl font-bold text-white">U&M</span>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 opacity-30 blur-xl" />
            </div>
          </motion.div>

          {/* App Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-2 text-2xl font-bold tracking-tight"
          >
            <span className="gradient-primary-text">U&M Music AI</span>
          </motion.h1>

          {/* Waveform Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-6 flex h-10 items-end justify-center"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="waveform-bar" />
            ))}
          </motion.div>

          {/* Loading Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            Preparing your AI studio...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
