"use client";

import { motion } from "framer-motion";
import { Shield, Lock, UserCheck, Scale } from "lucide-react";

const items = [
  { icon: Shield, title: "Your Music, Your Rights", description: "Everything you create on U&M belongs to you. We never claim ownership of your work." },
  { icon: Lock, title: "Voice Data Security", description: "Voice models are encrypted and stored securely. Only you can access your voice data." },
  { icon: UserCheck, title: "Consent-First Approach", description: "Voice DNA training requires explicit consent. No unauthorized voice cloning ever." },
  { icon: Scale, title: "Fair Use Policy", description: "Users must only upload content they own or have permission to use." },
];

export function SafetySection() {
  return (
    <section className="relative py-24 px-4" id="safety">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-violet-500">
            Safety & Rights
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Built on trust and transparency
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                  <Icon className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
