"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AccessibilitySection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("accessibility");
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="accessibility"
      className="w-full py-20 px-4 bg-white scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading with animation */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-roboto font-extrabold text-6xl md:text-5xl text-black mb-4">
            Healthcare for Everyone, Everywhere
          </h2>
          <p className="font-roboto font-normal text-xl text-black max-w-2xl mx-auto">
            TeleHealth is designed to be inclusive, accessible, and easy to use
            across all devices and abilities.
          </p>
        </div>

        {/* Image container with animation */}
        <div
          className={`flex justify-center transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="w-full max-w-6xl h-64 md:h-80 relative">
            <Image
              src="/images/accessible.png"
              alt="Healthcare accessibility illustration"
              fill
              className="object-contain"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
