"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
            <Sparkles className="h-3.5 w-3.5" /> Simple, transparent pricing
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Plans for every <span className="gradient-primary-text">creator</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Start free, upgrade when you&apos;re ready. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-violet-500 bg-gradient-to-b from-violet-500/10 to-transparent shadow-lg shadow-violet-500/10"
                  : "border-border bg-card hover:border-violet-500/20"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-4 py-1 text-xs font-bold text-white shadow-lg">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                {plan.price === 0 ? (
                  <span className="text-4xl font-bold">Free</span>
                ) : (
                  <>
                    <span className="text-lg text-muted-foreground">{plan.currency}</span>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </>
                )}
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  plan.highlighted
                    ? "gradient-primary text-white shadow-lg shadow-violet-500/20"
                    : "border border-border bg-muted hover:bg-muted/80"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Have questions?{" "}
            <Link href="/#faq" className="text-violet-500 hover:underline">Check our FAQ</Link>
            {" "}or{" "}
            <Link href="/support" className="text-violet-500 hover:underline">contact support</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
