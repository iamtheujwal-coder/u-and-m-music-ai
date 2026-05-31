"use client";

import { SplashScreen } from "@/components/shared/splash-screen";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesSection } from "@/components/landing/features-section";
import { DemoSection } from "@/components/landing/demo-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SafetySection } from "@/components/landing/safety-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { useUIStore } from "@/lib/store";

export default function LandingPage() {
  const splashDone = useUIStore((s) => s.splashDone);

  return (
    <>
      <SplashScreen />
      {splashDone && (
        <main className="min-h-screen">
          <LandingNavbar />
          <HeroSection />
          <HowItWorks />
          <FeaturesSection />
          <DemoSection />
          <PricingSection />
          <SafetySection />
          <FAQSection />
          <CTASection />
          <Footer />
        </main>
      )}
    </>
  );
}
