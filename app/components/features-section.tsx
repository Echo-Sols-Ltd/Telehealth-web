"use client";

import { useEffect, useState } from "react";
import FeatureCard from "./feature-card";
import {
  HeartPulse,
  Stethoscope,
  Clock,
  TabletSmartphone,
  MessageSquareText,
  Brain,
} from "lucide-react";

const features = [
  {
    id: 1,
    title: "Track Your Health in One Place",
    description:
      "Monitor vital metrics like blood pressure, blood sugar, and weight with simple charts and trends.",
    icon: HeartPulse,
    position: "left",
  },
  {
    id: 2,
    title: "AI-Powered Insights",
    description:
      "Get smart alerts and lifestyle recommendations tailored to your health data, helping you make better daily choices.",
    icon: MessageSquareText,
    position: "top",
  },
  {
    id: 3,
    title: "Connect With Doctors Anytime",
    description:
      "Book secure video or chat consultations with healthcare providers at your convenience.",
    icon: Stethoscope,
    position: "right",
  },
  {
    id: 4,
    title: "Sync With Your Devices",
    description:
      "Connect glucose monitors and smartwatches to update your health data in real time.",
    icon: Brain,
    position: "right",
  },
  {
    id: 5,
    title: "Book & Manage Appointments",
    description:
      "Schedule and receive reminders for upcoming visits—all in one simple calendar.",
    icon: Clock,
    position: "bottom",
  },
  {
    id: 6,
    title: "Inclusive Access",
    description:
      "Whether you have a smartphone or not, access TelHealth through our app, SMS, or USSD codes.",
    icon: TabletSmartphone,
    position: "right",
  },
];

export default function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    // Animate cards on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = Number.parseInt(
              entry.target.getAttribute("data-card-id") || "0"
            );
            setVisibleCards((prev) =>
              prev.includes(cardId) ? prev : [...prev, cardId]
            );
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll("[data-card-id]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      className="py-20 px-4 relative overflow-x-hidden scroll-mt-24"
      style={{
        background:
          "linear-gradient(0deg, #C1C9EB, #C1C9EB), linear-gradient(0deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75))",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-32 opacity-30">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,40 Q 360,0 720,40 T 1440,40 L 1440,0 L 0,0 Z"
            fill="currentColor"
            className="text-[#C1C9EB]"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <h1
          className="text-5xl md:text-6xl font-black text-[#5F5656] mb-16"
          style={{
            fontFamily: "Roboto",
            fontWeight: 800,
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Our features
        </h1>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              data-card-id={feature.id}
              className={`transition-all duration-700 transform ${
                visibleCards.includes(feature.id)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
