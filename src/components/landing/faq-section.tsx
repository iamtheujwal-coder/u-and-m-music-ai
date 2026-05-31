"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Do I need any music production experience?", a: "Not at all! U&M Music AI is designed for singers who don't know mixing, mastering, or DAWs. Just upload your voice, and our AI handles everything." },
  { q: "What audio quality do I need to upload?", a: "You can record on your phone or laptop microphone. Our AI is trained to clean up room noise, echo, and low-quality recordings. Better input = better output, but we work with anything." },
  { q: "Who owns the music I create?", a: "You do. 100%. U&M Music AI never claims ownership of your songs, vocals, or voice models. You retain all rights to everything you create." },
  { q: "Can I use AI-generated music commercially?", a: "Yes! Songs created on our platform can be released on Spotify, YouTube, Instagram, and all major platforms. Check our license terms for specific details." },
  { q: "What is Voice DNA?", a: "Voice DNA is our advanced feature that lets you train a personal AI voice model using your own vocal samples. This model can help generate demo vocals in your voice style. Only available with Pro Artist plan and above." },
  { q: "Is my voice data safe?", a: "Absolutely. All voice data is encrypted, stored securely, and only accessible by you. We never share or sell your voice data. You can delete it anytime." },
  { q: "Can I cancel my subscription anytime?", a: "Yes. You can cancel or change your plan anytime. If you cancel, you keep access until the end of your billing period." },
  { q: "What payment methods do you accept?", a: "We accept all major Indian payment methods through Razorpay: UPI, credit/debit cards, net banking, and wallets." },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 px-4" id="faq">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-violet-500">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Questions? Answered.
          </h2>
        </motion.div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left text-sm font-medium transition-colors hover:bg-muted/50"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
