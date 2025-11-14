"use client";

import { useState, useEffect } from "react";
import { User, Lightbulb, Calendar, Radical } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: User,
    title: "Sign Up & Create Your Profile",
    description:
      "User downloads the app (or uses SMS/USSD), creates an account, and fills in basic health info.",
  },
  {
    id: 2,
    icon: Radical,
    title: "Track & Sync Your Health Data",
    description:
      "Enter data manually or connect IoT devices like glucose monitors or smartwatches to sync automatically.",
  },
  {
    id: 3,
    icon: Lightbulb,
    title: "Get Personalized Insights & Alerts",
    description:
      "AI reviews your health data and sends smart tips, reminders, and warnings if anything looks off.",
  },
  {
    id: 4,
    icon: Calendar,
    title: "Consult & Manage Appointments",
    description:
      "Book video/chat consultations or manage visits with healthcare providers—backed by your tracked health records.",
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      className="w-full bg-[#FFFFFF] py-20 px-6 sm:px-8 lg:px-12 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="font-roboto font-extrabold text-5xl text-center text-black mb-6">
          How it works
        </h2>

        {/* Subtitle */}
        <p className="font-roboto font-normal text-4xl text-center text-black mb-16">
          Getting Started is Simple in these 4 easy steps.
        </p>

        {/* Steps Container */}
        <div className="bg-linear-to-b rounded-3xl p-12 w-full bg-[#EFF1FA]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;

              return (
                <div
                  key={step.id}
                  className={`transition-all duration-1000 ${
                    isActive
                      ? "bg-[#6685FF] text-[#FFFFFF] rounded-3xl px-10 py-8 shadow-lg scale-105 w-full min-h-[240px]"
                      : "bg-white border-[#DCE1F5] rounded-2xl px-10 py-20 text-black hover:shadow-lg min-h-[240px]"
                  }`}
                >
                  {/* Icon */}
                  <Icon
                    className={`w-12 h-12 mb-4 transition-all duration-1000 ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  />

                  {/* Title */}
                  <h3 className="font-roboto font-extrabold text-2xl mb-4 leading-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`font-roboto font-normal text-sm leading-relaxed ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === index
                    ? "bg-[#6685FF] w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
