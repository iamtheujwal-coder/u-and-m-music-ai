"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { GENRES, LANGUAGES, SKILL_LEVELS, MAIN_GOALS } from "@/lib/constants";

import { createClient } from "@/lib/supabase/client";

const STEPS = ["Artist Name", "Music Style", "Language", "Skill Level", "Main Goal"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    artistName: "",
    musicStyles: [] as string[],
    language: "",
    skillLevel: "",
    mainGoal: "",
  });

  const supabase = createClient();

  const next = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({
          full_name: data.artistName,
          onboarding_completed: true,
          // Store additional data in metadata or specific columns if added to schema
        }).eq('id', user.id);
      }
      setLoading(false);
      router.push("/dashboard");
    }
  };
  const back = () => step > 0 && setStep(step - 1);

  const canProceed = () => {
    switch (step) {
      case 0: return data.artistName.trim().length > 0;
      case 1: return data.musicStyles.length > 0;
      case 2: return data.language.length > 0;
      case 3: return data.skillLevel.length > 0;
      case 4: return data.mainGoal.length > 0;
      default: return false;
    }
  };

  const toggleStyle = (style: string) => {
    setData((d) => ({
      ...d,
      musicStyles: d.musicStyles.includes(style)
        ? d.musicStyles.filter((s) => s !== style)
        : [...d.musicStyles, style],
    }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
            <span className="text-sm font-medium gradient-primary-text">{STEPS[step]}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-primary"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border bg-card p-8"
          >
            {step === 0 && (
              <>
                <h2 className="text-xl font-bold">What should we call you?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose your artist or stage name.</p>
                <input
                  type="text"
                  value={data.artistName}
                  onChange={(e) => setData({ ...data, artistName: e.target.value })}
                  placeholder="Your artist name"
                  className="mt-6 w-full rounded-xl border border-border bg-background py-3 px-4 text-lg font-medium transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  autoFocus
                />
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-xl font-bold">What music do you love?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Select all styles that inspire you.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleStyle(genre)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        data.musicStyles.includes(genre)
                          ? "gradient-primary text-white shadow-sm"
                          : "border border-border bg-muted hover:border-violet-500/30"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-bold">What language do you sing in?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose your primary singing language.</p>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setData({ ...data, language: lang })}
                      className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        data.language === lang
                          ? "gradient-primary text-white shadow-sm"
                          : "border border-border bg-muted hover:border-violet-500/30"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-xl font-bold">What&apos;s your skill level?</h2>
                <p className="mt-1 text-sm text-muted-foreground">This helps us personalize your experience.</p>
                <div className="mt-6 space-y-3">
                  {SKILL_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setData({ ...data, skillLevel: level.value })}
                      className={`flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${
                        data.skillLevel === level.value
                          ? "border-2 border-violet-500 bg-violet-500/5"
                          : "border border-border bg-muted hover:border-violet-500/30"
                      }`}
                    >
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        data.skillLevel === level.value ? "border-violet-500 bg-violet-500" : "border-muted-foreground"
                      }`}>
                        {data.skillLevel === level.value && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium">{level.label}</p>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-xl font-bold">What&apos;s your main goal?</h2>
                <p className="mt-1 text-sm text-muted-foreground">We&apos;ll tailor your dashboard accordingly.</p>
                <div className="mt-6 space-y-3">
                  {MAIN_GOALS.map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => setData({ ...data, mainGoal: goal.value })}
                      className={`flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${
                        data.mainGoal === goal.value
                          ? "border-2 border-violet-500 bg-violet-500/5"
                          : "border border-border bg-muted hover:border-violet-500/30"
                      }`}
                    >
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <p className="font-medium">{goal.label}</p>
                        <p className="text-xs text-muted-foreground">{goal.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed() || loading}
            className="group flex items-center gap-2 rounded-xl gradient-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Saving..." : step === STEPS.length - 1 ? "Start Creating" : "Continue"}
            {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
