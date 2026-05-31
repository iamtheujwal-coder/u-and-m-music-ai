"use client";

import { motion } from "framer-motion";
import {
  Sparkles, AudioWaveform, Music2, Mic2, Settings2, Palette,
  Brain, Shield
} from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Vocal Cleanup", description: "Remove background noise, room echo, and imperfections automatically.", color: "text-violet-500" },
  { icon: AudioWaveform, title: "Smart Pitch Correction", description: "Natural-sounding tuning that preserves your unique voice character.", color: "text-blue-500" },
  { icon: Music2, title: "AI Mix & Master", description: "Professional-grade mixing and mastering at the click of a button.", color: "text-cyan-500" },
  { icon: Mic2, title: "Stem Separation", description: "Separate vocals, drums, bass, and instruments from any track.", color: "text-emerald-500" },
  { icon: Settings2, title: "AI Instrumental Generation", description: "Generate background music from text prompts in any genre.", color: "text-amber-500" },
  { icon: Palette, title: "Multiple Mastering Styles", description: "Choose from Warm, Clean, Bollywood Pop, Lo-fi, and more.", color: "text-rose-500" },
  { icon: Brain, title: "Voice DNA Training", description: "Train your own voice model for AI-powered vocal generation.", color: "text-purple-500" },
  { icon: Shield, title: "Your Rights Protected", description: "You own everything you create. Your voice data stays yours.", color: "text-teal-500" },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4" id="features">
      <div className="absolute inset-0 gradient-glow opacity-50" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-violet-500">
            Features
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to sound professional
          </h2>
          <p className="mt-3 text-muted-foreground">
            Powered by cutting-edge AI models designed for real singers.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1"
              >
                <Icon className={`h-8 w-8 ${feature.color} mb-4`} />
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
