"use client";

import { motion } from "framer-motion";
import { Upload, Wand2, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Voice",
    description: "Record or upload your raw vocals. Any quality, any device. We handle the rest.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Wand2,
    title: "AI Does the Magic",
    description: "Our AI cleans noise, corrects pitch, mixes, masters — all automatically.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Download,
    title: "Download Your Song",
    description: "Get your studio-quality track. Ready for Spotify, YouTube, Instagram, and more.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 px-4" id="how-it-works">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-violet-500">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps to your first song
          </h2>
          <p className="mt-3 text-muted-foreground">
            No studio. No expensive gear. No audio engineering degree.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] right-[-40%] h-px bg-gradient-to-r from-border to-transparent" />
                )}

                <div className="relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5">
                  {/* Step number */}
                  <span className="absolute -top-3 right-6 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>

                  {/* Icon */}
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
