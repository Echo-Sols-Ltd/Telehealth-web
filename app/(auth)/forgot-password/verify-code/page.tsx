"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingScreenContent from "@/app/components/LoadingScreenContent";
import {
  verifyEmailWithCode,
  sendVerificationEmail,
} from "@/services/mockEmailService";

function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [searchParams]);

  const maskEmail = (email: string): string => {
    if (!email || !email.includes("@")) return email;
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) return email;
    const masked = localPart[0] + "*".repeat(localPart.length - 1);
    return `${masked}@${domain}`;
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData
        .split("")
        .concat(Array(6 - pastedData.length).fill(""));
      setCode(newCode.slice(0, 6));
      // Focus the last filled input or the last input
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      const nextInput = document.getElementById(`code-${lastFilledIndex}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    // Verify the code
    const isValid = verifyEmailWithCode(email, fullCode);

    setTimeout(() => {
      setIsLoading(false);
      if (isValid) {
        // Show confirmation screen
        setIsVerified(true);
      } else {
        setError("Invalid verification code. Please try again.");
      }
    }, 1000);
  };

  // Show confirmation screen after successful verification
  if (isVerified) {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Left side - Loading Screen Content (hidden on mobile) */}
        <div className="hidden lg:flex w-2/5 bg-[#6685FF] items-center justify-center">
          <LoadingScreenContent />
        </div>

        {/* Right side - Confirmation Screen */}
        <div className="w-full lg:w-3/5 bg-white flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Confirmation successful text */}
            <h4
              className="text-3xl sm:text-2xl md:text-4xl font-bold text-center mb-8 sm:mb-12 font-roboto-flex text-[#6685FF] px-4 py-2 rounded-lg"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "30px",
                lineHeight: "100%",
                letterSpacing: "0%",
               
              }}
            >
              Confirmation successful
            </h4>

            {/* Checkmark (Yes Sign) */}
            <div
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mb-8 sm:mb-12"
              style={{
                background: `linear-gradient(0deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), linear-gradient(0deg, #9EB1FE, #9EB1FE)`,
              }}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:w-20 sm:h-20"
              >
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  fill="white"
                />
              </svg>
            </div>

            {/* Finish Button */}
            <button
              onClick={() => {
                router.push(
                  `/forgot-password/reset-password?email=${encodeURIComponent(email)}&code=${code.join("")}`
                );
              }}
              className="w-full max-w-[638px] rounded-[10px] font-semibold text-white transition-all shadow-md hover:shadow-lg font-roboto-flex"
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
              Finish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left side - Loading Screen Content (hidden on mobile) */}
      <div className="hidden lg:flex w-2/5 bg-[#6685FF] items-center justify-center">
        <LoadingScreenContent />
      </div>

      {/* Right side - Verification Code Form */}
      <div className="w-full lg:w-3/5 bg-white flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Heading */}
          <h4
            className="text-3xl sm:text-2xl md:text-5xl font-bold text-center mb-4 sm:mb-6"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "30px",
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#6685FF",
            }}
          >
            Verification
          </h4>

          {/* Instructional Text */}
          <p
            className="text-center mb-2 sm:mb-4 font-roboto-flex"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 300,
              fontSize: "16px",
              lineHeight: "27px",
              letterSpacing: "0%",
              color: "#000000",
            }}
          >
            Enter the code we sent to your email to verify your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Verification Code Inputs */}
            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6685FF] focus:border-[#6685FF] font-roboto-flex text-black"
                  required
                />
              ))}
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center font-roboto-flex">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || code.join("").length !== 6}
              className="w-full max-w-[638px] rounded-[10px] font-semibold text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 font-roboto-flex"
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
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          </form>

          {/* Resend Code Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                if (email) {
                  sendVerificationEmail(email);
                  setCode(["", "", "", "", "", ""]);
                  setError("");
                }
              }}
              className="text-sm sm:text-base font-roboto-flex hover:underline"
              style={{ color: "#6685FF" }}
            >
              Resend Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-roboto-flex mb-4">
              <span style={{ color: "#01061c" }}>Tele</span>
              <span style={{ color: "#6685FF" }}>Health</span>
            </h1>
            <p className="text-gray-600 font-roboto-flex">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyCodeContent />
    </Suspense>
  );
}
