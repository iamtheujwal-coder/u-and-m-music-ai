"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Music } from "lucide-react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Demo Mode Bypass
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 800);
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Demo Mode Bypass
      if (!otpSent) {
        setTimeout(() => {
          setOtpSent(true);
          setLoading(false);
        }, 800);
      } else {
        setTimeout(() => {
          window.location.href = "/onboarding";
        }, 800);
      }
      return;
    }

    if (!otpSent) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setOtpSent(true);
      }
    } else {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        window.location.href = "/onboarding";
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden gradient-primary">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md text-center text-white px-8">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Music className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold">Your AI Music Studio</h2>
          <p className="mt-4 text-lg text-white/80">
            Turn your raw vocals into studio-quality songs. No technical skills needed.
          </p>

          {/* Animated waveform */}
          <div className="mt-10 flex items-end justify-center gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full bg-white/40"
                animate={{
                  height: [
                    Math.random() * 20 + 5,
                    Math.random() * 50 + 10,
                    Math.random() * 20 + 5,
                  ],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex w-full items-center justify-center px-4 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-primary-text">U&M Music AI</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your AI music studio
          </p>
          
          {errorMsg && (
            <div className="mt-4 p-3 text-sm text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
              {errorMsg}
            </div>
          )}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-all hover:bg-muted hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or continue with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email / OTP Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  disabled={otpSent || loading}
                  className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
                />
              </div>
            </div>

            {otpSent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label htmlFor="otp" className="text-sm font-medium">
                  Verification code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  disabled={loading}
                  className="mt-1.5 w-full rounded-xl border border-border bg-card py-3 px-4 text-sm text-center tracking-[0.5em] font-mono transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  We sent a verification code to {email}
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <>
                  {otpSent ? "Verify & Sign In" : "Send Verification Code"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/legal/terms" className="text-violet-500 hover:underline">Terms</Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-violet-500 hover:underline">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
