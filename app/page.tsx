"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/features-section";
import WaveDivider from "./components/wave-divider";
import HowItWorks from "./components/HowItWorks";
import AccessibilitySection from "./components/availability-section";
import Footer from "./components/Footer";
import TeleHealthLoading from "./components/loadingScreen";

export default function Home() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Show loading screen for 10 seconds on initial load
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return <TeleHealthLoading />;
  }

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
