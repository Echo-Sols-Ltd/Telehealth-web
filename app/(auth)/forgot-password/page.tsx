"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreenContent from "@/app/components/LoadingScreenContent";
import { sendVerificationEmail } from "@/services/mockEmailService";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Send verification code
    sendVerificationEmail(email);

    setTimeout(() => {
      setIsLoading(false);
      // Navigate to verification code page
      router.push(
        `/forgot-password/verify-code?email=${encodeURIComponent(email)}`
      );
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left side - Loading Screen Content (hidden on mobile) */}
      <div className="hidden lg:flex w-2/5 bg-[#6685FF] items-center justify-center">
        <LoadingScreenContent />
      </div>

      {/* Right side - Forgot Password Form */}
      <div className="w-full lg:w-3/5 bg-white flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Forgot password? Heading */}
          <h2
            className="text-3xl sm:text-2xl md:text-5xl font-bold text-center mb-6 sm:mb-8"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "30px",
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#6685FF",
            }}
          >
            Forgot password?
          </h2>

          {/* Instructional Text */}
          <p
            className="text-center justify-center mb-8 sm:mb-10 font-roboto-flex"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 300,
              fontSize: "20px",
              lineHeight: "27px",
              letterSpacing: "0%",
              color: "#000000",
            }}
          >
            Enter your email below and enter the verification code from your
            email
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-roboto-flex"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: 300,
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#000000",
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6685FF] font-roboto-flex text-black"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full max-w-[638px] rounded-[10px] font-semibold text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-roboto-flex cursor-pointer"
              style={{
                backgroundColor: "#6685FF",
                height: "40px",
                fontSize: "24px",
                fontWeight: 600,
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#FFFFFF",
              }}
            >
              {isLoading ? "Sending..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
