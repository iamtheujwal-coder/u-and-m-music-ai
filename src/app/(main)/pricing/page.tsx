"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Info, Sparkles, Zap, Music, UploadCloud } from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      id: "pro",
      name: "Pro",
      price: billingCycle === "yearly" ? 680 : 850,
      yearlySavings: 2040,
      description: "Access to our best models and editing tools.",
      color: "from-violet-500 to-fuchsia-500",
      features: [
        "Access to best and most personal v5.5 model",
        "2,500 credits (up to 500 songs), refreshes monthly",
        "Commercial use rights for new songs made",
        "Standard + Pro features (personas and advanced editing)",
        "Split songs into up to 12 vocal and instrument stems",
        "Upload up to 30 min of audio",
        "Add new vocals or instrumentals to existing songs",
        "Early access to new features",
        "Ability to purchase add-on credits",
        "Priority queue, up to 10 songs at once",
        "Record, upload and create with your own voice",
        "Tune custom versions of v5.5 using your own audio",
      ],
      buttonText: "Change Commitment",
      active: true,
    },
    {
      id: "studio",
      name: "Studio",
      price: billingCycle === "yearly" ? 2000 : 2500,
      yearlySavings: 6000,
      description: "Maximum credits and every feature unlocked.",
      color: "from-emerald-500 to-teal-500",
      features: [
        "Access to Suno Studio",
        "Access to best and most personal v5.5 model",
        "10,000 credits (up to 2,000 songs), refreshes monthly",
        "Commercial use rights for new songs made",
        "Standard + Pro features (personas and advanced editing)",
        "Split songs into up to 12 vocal and instrument stems",
        "Upload up to 30 min of audio",
        "Add new vocals or instrumentals to existing songs",
        "Early access to new features",
        "Ability to purchase add-on credits",
        "Priority queue, up to 10 songs at once",
        "Record, upload and create with your own voice",
        "Tune custom versions of v5.5 using your own audio",
      ],
      buttonText: "Upgrade to Studio",
      active: false,
    },
  ];

  const handleSubscribe = (planId: string) => {
    // Mocking subscription upgrade
    const localProfile = localStorage.getItem("demo_profile");
    let profile = localProfile ? JSON.parse(localProfile) : {};
    profile.plan = planId;
    profile.credits = planId === "studio" ? 10000 : 2500;
    localStorage.setItem("demo_profile", JSON.stringify(profile));
    
    // Dispatch an event to update navbar instantly
    window.dispatchEvent(new Event('profileUpdated'));
    alert(`Successfully upgraded to ${planId.toUpperCase()} plan!`);
  };

  return (
    <div className="mx-auto max-w-5xl py-8 space-y-8">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Upgrade your <span className="gradient-primary-text">Creativity</span>
        </motion.h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the right plan to get commercial rights, advanced editing, stem splitting, and thousands of monthly credits.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-muted p-1 rounded-full flex items-center gap-1 border border-border">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              billingCycle === "monthly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              billingCycle === "yearly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-[10px]">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-3xl border p-8 flex flex-col ${
              plan.active ? "border-violet-500/50 bg-violet-500/5" : "border-border bg-card"
            }`}
          >
            {plan.active && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-violet-500/25">
                <Sparkles className="h-3 w-3" /> Current Plan
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">₹{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              {billingCycle === "yearly" && (
                <div className="mt-2 text-sm text-emerald-500 font-medium">
                  Saves ₹{plan.yearlySavings} by billing yearly!
                  <p className="text-xs text-muted-foreground font-normal mt-0.5">Taxes calculated at checkout</p>
                </div>
              )}
            </div>

            <button
              onClick={() => handleSubscribe(plan.id)}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold mb-8 transition-all ${
                plan.active
                  ? "bg-muted text-foreground hover:bg-border"
                  : `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:scale-[1.02] active:scale-[0.98]`
              }`}
            >
              {plan.buttonText}
            </button>

            <div className="space-y-4 flex-1">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className={`h-5 w-5 shrink-0 mt-0.5 ${
                    plan.id === "studio" ? "text-emerald-500" : "text-violet-500"
                  }`} />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
