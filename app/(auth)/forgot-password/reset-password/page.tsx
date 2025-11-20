"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingScreenContent from "@/app/components/LoadingScreenContent";
import { mockStorage } from "@/types/mockData";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Update password in mock storage
      if (email) {
        mockStorage.set(`auth:${email}`, password);
      }

      setIsLoading(false);
      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }, 1000);
  };

  if (success) {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Left side - Loading Screen Content (hidden on mobile) */}
        <div className="hidden lg:flex w-2/5 bg-[#6685FF] items-center justify-center">
          <LoadingScreenContent />
        </div>

        {/* Right side - Success Message */}
        <div className="w-full lg:w-3/5 bg-white flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-md text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2
              className="text-3xl sm:text-2xl md:text-4xl font-bold mb-4 font-roboto-flex"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "30px",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#6685FF",
              }}
            >
              Password Reset Successful
            </h2>
            <p
              className="mb-6 font-roboto-flex"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: 300,
                fontSize: "16px",
                lineHeight: "27px",
                letterSpacing: "0%",
                color: "#000000",
              }}
            >
              Your password has been successfully reset. Redirecting to login...
            </p>
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

      {/* Right side - Reset Password Form */}
      <div className="w-full lg:w-3/5 bg-white flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Heading */}
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
            Reset Password
          </h2>

          {/* Instructional Text */}
          <p
            className="text-center mb-8 sm:mb-10 font-roboto-flex"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 300,
              fontSize: "16px",
              lineHeight: "27px",
              letterSpacing: "0%",
              color: "#000000",
            }}
          >
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label
                htmlFor="password"
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
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6685FF] focus:border-[#6685FF] font-roboto-flex text-black"
                placeholder="Enter your new password"
                minLength={8}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
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
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                required
                className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6685FF] focus:border-[#6685FF] font-roboto-flex text-black"
                placeholder="Confirm your new password"
                minLength={8}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center font-roboto-flex">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
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
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/login")}
              className="text-sm sm:text-base font-roboto-flex hover:underline cursor-pointer"
              style={{ color: "#6685FF" }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordContent />
    </Suspense>
  );
}

