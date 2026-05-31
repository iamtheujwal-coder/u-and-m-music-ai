"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl gradient-primary p-12 text-center md:p-16"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to sound professional?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
              Join thousands of singers who are already creating studio-quality music from home.
            </p>
            <Link
              href="/login"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-violet-700 shadow-xl transition-all hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98]"
            >
              Create Your First Song — Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-4 text-sm text-white/60">
              No credit card required • 2 free projects per month
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
