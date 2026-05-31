"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dna, Upload, Mic, Shield, Check, AlertTriangle, Play } from "lucide-react";

export default function VoiceDNAPage() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsent, setShowConsent] = useState(true);
  const [samples, setSamples] = useState<string[]>([]);
  const [training, setTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const handleConsentAccept = () => {
    setConsentGiven(true);
    setShowConsent(false);
  };

  const addSample = () => {
    setSamples([...samples, `Sample ${samples.length + 1}`]);
  };

  const startTraining = () => {
    setTraining(true);
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 200);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-primary-text">Voice DNA</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Train your personal AI voice model.</p>
      </motion.div>

      {/* Consent Modal */}
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Voice Consent Required</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Voice DNA lets you create a personal AI voice model. This is a powerful feature and comes with responsibilities.
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>You can only train models using <strong>your own voice</strong></span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Or voices you have <strong>legal permission</strong> to use</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span className="text-red-400">Impersonation of celebrities or other singers is <strong>strictly prohibited</strong></span>
                </div>
              </div>

              <label className="mt-6 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-violet-500"
                />
                <span className="text-sm">
                  I confirm I own this voice or have explicit permission to use it. I agree to the{" "}
                  <a href="/legal/voice-consent" className="text-violet-500 hover:underline">Voice Consent Policy</a>.
                </span>
              </label>

              <button
                onClick={handleConsentAccept}
                disabled={!consentGiven}
                className="mt-6 rounded-xl gradient-primary px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                I Agree — Continue
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upload Samples */}
      {!showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Upload Vocal Samples</h3>
              <span className="text-sm text-muted-foreground">{samples.length} / 30 samples</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Upload 10–30 clean vocal samples for best results. Each sample should be 10–60 seconds of clean singing.
            </p>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full gradient-primary transition-all"
                  style={{ width: `${Math.min((samples.length / 10) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {samples.length < 10 ? `Need at least ${10 - samples.length} more samples` : "Ready to train!"}
              </p>
            </div>

            {/* Samples Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
              {samples.map((sample, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-muted p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-violet-500/10">
                    <Mic className="h-3.5 w-3.5 text-violet-500" />
                  </div>
                  <span className="text-xs truncate">{sample}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={addSample}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Upload className="h-4 w-4" /> Upload File
              </button>
              <button
                onClick={addSample}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Mic className="h-4 w-4" /> Record
              </button>
            </div>
          </div>

          {/* Verification */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-2">Voice Verification</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Record this phrase to verify your identity: <strong>&quot;This is my voice and I authorize its use for AI training.&quot;</strong>
            </p>
            <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">
              <Mic className="h-4 w-4 text-red-500" /> Record Verification
            </button>
          </div>

          {/* Training */}
          {!training ? (
            <button
              onClick={startTraining}
              disabled={samples.length < 10}
              className="w-full rounded-xl gradient-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Dna className="inline h-4 w-4 mr-2" />
              Start Voice DNA Training
            </button>
          ) : (
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10">
                <Dna className="h-7 w-7 text-violet-500 animate-spin" style={{ animationDuration: "3s" }} />
              </div>
              <h3 className="font-semibold">Training Your Voice Model</h3>
              <p className="mt-1 text-sm text-muted-foreground">This may take a few minutes...</p>
              <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  animate={{ width: `${trainingProgress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{trainingProgress}%</p>
              {trainingProgress >= 100 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                  <p className="text-emerald-500 font-medium">✓ Voice DNA training complete!</p>
                  <button className="mt-3 inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-2.5 text-sm font-semibold text-white">
                    <Play className="h-4 w-4" /> Generate Demo Vocal
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
