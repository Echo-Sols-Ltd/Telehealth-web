"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useReducer } from "react";
import { useSearchParams } from "next/navigation";
import {
  emailVerificationReducer,
  initialEmailVerificationState,
} from "@/reducers/emailVerificationReducer";
import {
  sendVerificationEmail,
  TELEHEALTH_SENDER_EMAIL,
} from "@/services/mockEmailService";

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(
    emailVerificationReducer,
    initialEmailVerificationState
  );
  const [rotation, setRotation] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const maskEmail = (email: string): string => {
    if (!email || !email.includes("@")) return email;
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) return email;
    const masked = localPart[0] + "*".repeat(localPart.length - 1);
    return `${masked}@${domain}`;
  };

  // Get email from URL params or localStorage
  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    const emailFromStorage =
      typeof window !== "undefined"
        ? localStorage.getItem("pendingVerificationEmail")
        : null;

    const email = emailFromParams || emailFromStorage || "";
    if (email) {
      const maskedEmail = maskEmail(email);
      dispatch({ type: "SET_EMAIL", payload: maskedEmail });
    }
  }, [searchParams]);

  // Rotating icons animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const icons = [
    { src: "/images/pill.png", angle: 0 },
    { src: "/images/pill1.png", angle: 45 },
    { src: "/images/syringe.jpg", angle: 90 },
    { src: "/images/bandage.png", angle: 135 },
    { src: "/images/heart.png", angle: 180 },
    { src: "/images/bottle.jpg", angle: 225 },
  ];

  const handleResendEmail = async () => {
    setIsResending(true);

    const originalEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("pendingVerificationEmail")
        : null;

    if (originalEmail) {
      sendVerificationEmail(originalEmail);
      setTimeout(() => {
        setIsResending(false);
        alert(
          `Verification email has been resent from ${TELEHEALTH_SENDER_EMAIL}!`
        );
      }, 1000);
    } else {
      setIsResending(false);
      alert("Unable to resend email. Please try signing up again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl flex flex-col items-center text-center">
        {/* TeleHealth Logo */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-roboto-flex">
            <span style={{ color: "#01061c" }}>Tele</span>
            <span style={{ color: "#6685FF" }}>Health</span>
          </h1>
        </div>

        {/* Doctor Illustration with Wavy Background */}
        <div className="relative w-full max-w-xs sm:max-w-md aspect-square flex items-center justify-center mb-8 sm:mb-12">
          {/* Wavy background circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="320"
              height="380"
              viewBox="0 0 320 380"
              fill="none"
              className="absolute"
            >
              <path
                d="M160 20C100 20 50 50 30 100C10 150 20 200 30 250C40 300 70 350 120 370C170 390 220 380 260 350C300 320 310 270 310 220C310 170 290 120 250 80C210 40 180 20 160 20Z"
                fill="#A8B8FF"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Revolving icons */}
          {icons.map(({ src, angle }, index) => {
            const currentAngle = (angle + rotation) * (Math.PI / 180);
            const radius = 140;
            const x = Math.cos(currentAngle) * radius;
            const y = Math.sin(currentAngle) * radius;

            return (
              <div
                key={index}
                className="absolute bg-white rounded-full p-3 shadow-lg"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  transition: "transform 0.03s linear",
                }}
              >
                <img
                  src={src}
                  alt={`icon-${index}`}
                  className="w-8 h-8 object-contain"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              </div>
            );
          })}

          {/* Doctor illustration */}
          <div className="relative z-10 flex flex-col items-center">
            <img
              src="/images/doctor.png"
              alt="Doctor"
              className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
            />
          </div>
        </div>

        {/* Email Verification Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 font-roboto-flex text-black">
          Email Verification
        </h2>

        {/* Description Text */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center mb-8 sm:mb-12 px-4 max-w-3xl font-roboto-flex text-black leading-snug">
          The email has been sent to {state.email || "your email"} from{" "}
          <span style={{ fontWeight: 600 }}>{TELEHEALTH_SENDER_EMAIL}</span>.
          Make sure to click on the verification link before it expires.
        </p>

        {/* Resend Email Button */}
        <button
          onClick={handleResendEmail}
          disabled={isResending}
          className="w-full max-w-md px-6 sm:px-10 py-4 sm:py-5 rounded-[10px] font-bold text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 font-roboto-flex text-base sm:text-lg bg-[#6685FF]"
        >
          {isResending ? "Sending..." : "Resend Email"}
        </button>
      </div>
    </div>
  );
}
