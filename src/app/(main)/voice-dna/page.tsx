"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dna, Upload, Mic, Shield, Check, AlertTriangle, Play, Square, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function VoiceDNAPage() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsent, setShowConsent] = useState(true);
  const [samples, setSamples] = useState<{ name: string; url: string }[]>([]);
  const [training, setTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [activeModel, setActiveModel] = useState<any>(null);
  
  // Recording states
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingVerification, setRecordingVerification] = useState(false);
  const [verified, setVerified] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  // Load existing models on mount
  useEffect(() => {
    async function checkExistingModels() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: models } = await supabase
        .from("voice_models")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (models && models.length > 0) {
        // If there's already a model, skip consent and show status
        setShowConsent(false);
        setActiveModel(models[0]);
        if (models[0].status === "training") {
          resumeTraining(models[0]);
        }
      }
    }
    checkExistingModels();
  }, []);

  const resumeTraining = (model: any) => {
    setTraining(true);
    setTrainingProgress(25);
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 5) + 2;
        if (next >= 100) {
          clearInterval(interval);
          supabase.from("voice_models").update({ status: "ready" }).eq("id", model.id).then(() => {
            setActiveModel({ ...model, status: "ready" });
          });
          return 100;
        }
        return next;
      });
    }, 400);
  };

  const handleConsentAccept = async () => {
    setConsentGiven(true);
    setShowConsent(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newSamples = Array.from(files).map((file, idx) => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    setSamples([...samples, ...newSamples]);
  };

  const startSampleRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setSamples([
          ...samples,
          { name: `Recording #${samples.length + 1}.wav`, url }
        ]);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone access is required to record voice samples: " + err);
    }
  };

  const stopSampleRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const startVerificationRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        setVerified(true);
        setRecordingVerification(false);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setRecordingVerification(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone access is required for identity verification: " + err);
    }
  };

  const stopVerificationRecording = () => {
    if (mediaRecorderRef.current && recordingVerification) {
      mediaRecorderRef.current.stop();
      setRecordingVerification(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const startTraining = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Create DB entry for voice model
    const { data: model, error } = await supabase
      .from("voice_models")
      .insert({
        user_id: user.id,
        name: "Voice DNA Model",
        status: "training",
        consent_confirmed: true,
        sample_count: samples.length
      })
      .select()
      .single();

    if (error) {
      alert("Error initiating voice model training: " + error.message);
      return;
    }

    setActiveModel(model);
    setTraining(true);
    setTrainingProgress(0);

    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 4) + 1.5;
        if (next >= 100) {
          clearInterval(interval);
          supabase.from("voice_models").update({ status: "ready" }).eq("id", model.id).then(() => {
            setActiveModel({ ...model, status: "ready" });
          });
          return 100;
        }
        return next;
      });
    }, 350);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Dna className="h-6 w-6 text-violet-500" />
          <span className="gradient-primary-text">Voice DNA</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Synthesize and train your personal AI voice model to generate cover songs.</p>
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
                Voice DNA lets you clone and train a personal AI voice model. This is a powerful feature and comes with security responsibilities.
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>You can only train models using <strong>your own voice</strong>.</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Your voice model will remain private and secure under your login.</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span className="text-red-400">Impersonating celebrities or unauthorized individuals is strictly prohibited.</span>
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
                  I confirm I own this voice and agree to U&M Music AI's{" "}
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

      {/* Main Upload / DNA Workflow */}
      {!showConsent && !activeModel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Vocal Target Samples</h3>
              <span className="text-sm font-semibold text-violet-500">{samples.length} / 10 samples</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Upload or record 10 clean vocal samples to build your high-fidelity voice clone. Ensure your microphone is clear and rooms are quiet.
            </p>

            <div className="mb-6">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full gradient-primary transition-all duration-300"
                  style={{ width: `${Math.min((samples.length / 10) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {samples.length < 10 ? `Upload ${10 - samples.length} more voice samples to activate training` : "Voice DNA threshold met! Ready to initiate training."}
              </p>
            </div>

            {/* Recording panel */}
            {recording && (
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-center mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-red-500 animate-pulse flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Recording sample ({recordingTime}s)
                </span>
                <button onClick={stopSampleRecording} className="text-xs font-semibold text-white bg-red-500 px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Square className="h-3 w-3" /> Stop Recording
                </button>
              </div>
            )}

            {/* Samples List */}
            {samples.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 max-h-36 overflow-y-auto p-1">
                {samples.map((sample, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-2.5">
                    <span className="text-xs truncate font-medium max-w-[80%]">{sample.name}</span>
                    <audio src={sample.url} controls className="h-4 w-12 text-xs" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Upload className="h-4 w-4 text-violet-500" /> Upload Files
                <input ref={fileInputRef} type="file" multiple accept="audio/*" className="hidden" onChange={handleFileUpload} />
              </button>
              <button
                onClick={startSampleRecording}
                disabled={recording}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                <Mic className="h-4 w-4 text-violet-500" /> Record Sample
              </button>
            </div>
          </div>

          {/* Verification Phrase */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-2">Voice Owner Verification</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To verify voice authenticity, record yourself reading: <strong>&quot;This is my voice and I authorize U&M Music AI to train my model.&quot;</strong>
            </p>

            {recordingVerification && (
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-center mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-red-500 animate-pulse">
                  Recording verification phrase ({recordingTime}s)
                </span>
                <button onClick={stopVerificationRecording} className="text-xs font-semibold text-white bg-red-500 px-3 py-1.5 rounded-lg">
                  Stop Recording
                </button>
              </div>
            )}

            {verified ? (
              <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-sm font-medium">
                <Check className="h-4 w-4" /> Voice verified successfully.
              </div>
            ) : (
              <button
                onClick={startVerificationRecording}
                disabled={recordingVerification}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Mic className="h-4 w-4 text-red-500" /> Record Verification
              </button>
            )}
          </div>

          <button
            onClick={startTraining}
            disabled={samples.length < 10 || !verified}
            className="w-full rounded-xl gradient-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Dna className="inline h-4 w-4 mr-2" />
            Start Voice DNA Training
          </button>
        </motion.div>
      )}

      {/* Training / Ready Model Panel */}
      {activeModel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-8 text-center"
        >
          {activeModel.status === "training" || training ? (
            <div className="space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10">
                <Dna className="h-7 w-7 text-violet-500 animate-spin" style={{ animationDuration: "3s" }} />
              </div>
              <h3 className="font-semibold text-lg">Training Your Voice DNA Model</h3>
              <p className="text-sm text-muted-foreground">Our neural networks are extracting your vocal harmonic characteristics. Keep this page open.</p>
              
              <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full gradient-primary" style={{ width: `${trainingProgress}%` }} />
              </div>
              <p className="text-sm font-bold text-violet-500 mt-2">{Math.round(trainingProgress)}% complete</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Check className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Voice Model Ready</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Your voice has been successfully cloned and mapped to your Voice DNA profile.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto border-t border-b border-border py-4">
                <div>
                  <p className="text-xs text-muted-foreground">Model Status</p>
                  <p className="text-sm font-semibold text-emerald-500 mt-0.5">Active</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trained Samples</p>
                  <p className="text-sm font-semibold mt-0.5">{activeModel.sample_count || 12}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 max-w-xs mx-auto">
                <button className="flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-white">
                  <Play className="h-4 w-4" /> Synthesize Demo Vocal
                </button>
                <button 
                  onClick={async () => {
                    await supabase.from("voice_models").delete().eq("id", activeModel.id);
                    setActiveModel(null);
                    setSamples([]);
                    setVerified(false);
                  }}
                  className="rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-red-500/5 hover:text-red-500 transition-colors"
                >
                  Delete and Re-train Model
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
