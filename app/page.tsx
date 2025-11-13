import React from "react";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/features-section";
import WaveDivider from "./components/wave-divider";
import HowItWorks from "./components/HowItWorks";
import AccessibilitySection from "./components/availability-section";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <HeroSection />
      <WaveDivider />
      <FeaturesSection />
      <HowItWorks />
      <AccessibilitySection />
      <Footer />
    </main>
  );
}
