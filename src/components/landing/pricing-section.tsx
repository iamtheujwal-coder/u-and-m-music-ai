"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { PRICING_PLANS } from "@/lib/constants";

export function PricingSection() {
  return (
    <section className="relative py-24 px-4" id="pricing">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-violet-500">
            Pricing
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Plans for every creator
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-violet-500 bg-gradient-to-b from-violet-500/10 to-transparent shadow-lg shadow-violet-500/10"
                  : "border-border bg-card hover:border-violet-500/20"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-4 py-1 text-xs font-bold text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-4 flex items-baseline gap-1">
                {plan.price === 0 ? (
                  <span className="text-3xl font-bold">Free</span>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground">{plan.currency}</span>
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </>
                )}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`mt-6 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  plan.highlighted
                    ? "gradient-primary text-white shadow-md shadow-violet-500/20"
                    : "border border-border bg-muted hover:bg-muted/80"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
