"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import LoadingScreenContent from "../../components/LoadingScreenContent";
import { FormData, FormErrors } from "../../../types";
import { mockStorage } from "../../../types/mockData";
import {
  sendVerificationEmail,
  TELEHEALTH_SENDER_EMAIL,
} from "../../../services/mockEmailService";

export default function TeleHealthSignUp() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    nationalId: "",
    email: "",
    medicalCode: "",
    password: "",
    phoneNumber: "",
    repeatPassword: "",
    role: "patient",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.nationalId.trim()) {
      newErrors.nationalId = "National ID is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.role === "doctor" && !formData.medicalCode.trim()) {
      newErrors.medicalCode = "Medical code is required for doctors";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!formData.repeatPassword) {
      newErrors.repeatPassword = "Please repeat your password";
    } else if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        fullName: formData.fullName,
        nationalId: formData.nationalId,
        email: formData.email,
        medicalCode: formData.medicalCode,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        createdAt: new Date().toISOString(),
      };

      // Use mock storage instead of window.storage
      mockStorage.set(`user:${formData.email}`, JSON.stringify(userData));
      mockStorage.set(`auth:${formData.email}`, formData.password);

      // Send verification email
      const emailMessage = sendVerificationEmail(
        formData.email,
        formData.fullName
      );

      // Store email for verification page
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingVerificationEmail", formData.email);
      }

      setFormData({
        fullName: "",
        nationalId: "",
        email: "",
        medicalCode: "",
        password: "",
        phoneNumber: "",
        repeatPassword: "",
        role: "patient",
      });

      // Navigate to email verification page after successful signup
      setTimeout(() => {
        router.push(
          `/verify-email?email=${encodeURIComponent(formData.email)}`
        );
      }, 500);
    } catch (error) {
      alert("Error signing up. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    alert(`${provider} authentication would be integrated here`);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen lg:overflow-hidden">
      {/* Left side - Loading Screen Content (hidden on mobile) */}
      <div className="hidden lg:flex w-2/5 bg-[#6685FF] items-center justify-center lg:h-screen">
        <LoadingScreenContent />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-3/5 bg-gray-50 p-4 sm:p-8 lg:p-12 lg:overflow-y-auto lg:flex lg:items-center lg:justify-center overflow-y-auto">
        <div className="w-full max-w-2xl lg:py-0 py-8">
          <h2
            className="text-5xl font-bold text-center mb-8 font-roboto-flex"
            style={{ color: "#6685FF" }}
          >
            Sign Up
          </h2>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() =>
                setFormData((prev) => ({ ...prev, role: "patient" }))
              }
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                formData.role === "patient"
                  ? "bg-[#6685FF] text-white shadow-md"
                  : "bg-white text-black/80 border border-gray-300"
              }`}
            >
              Patient
            </button>
            <button
              onClick={() =>
                setFormData((prev) => ({ ...prev, role: "doctor" }))
              }
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                formData.role === "doctor"
                  ? "bg-[#6685FF] text-white shadow-md"
                  : "bg-white text-black/80 border border-gray-300"
              }`}
            >
              Doctor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto-flex">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border font-roboto-flex ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#6685FF]`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1 font-roboto-flex">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto-flex">
                National ID
              </label>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border font-roboto-flex ${
                  errors.nationalId ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#6685FF]`}
              />
              {errors.nationalId && (
                <p className="text-red-500 text-xs mt-1 font-roboto-flex">
                  {errors.nationalId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto-flex">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border font-roboto-flex ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#6685FF]`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-roboto-flex">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto-flex">
                Medical Code {formData.role === "patient" && "(Optional)"}
              </label>
              <input
                type="text"
                name="medicalCode"
                value={formData.medicalCode}
                onChange={handleChange}
                disabled={formData.role === "patient"}
                className={`w-full px-4 py-3 rounded-lg border font-roboto-flex ${
                  errors.medicalCode ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#6685FF] ${
                  formData.role === "patient" ? "bg-gray-100" : ""
                }`}
              />
              {errors.medicalCode && (
                <p className="text-red-500 text-xs mt-1 font-roboto-flex">
                  {errors.medicalCode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto-flex">
                Create Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border font-roboto-flex ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#6685FF]`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-roboto-flex">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto-flex">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border font-roboto-flex ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#6685FF]`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1 font-roboto-flex">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto-flex">
              Repeat Password
            </label>
            <input
              type="password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border font-roboto-flex ${
                errors.repeatPassword ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#6685FF]`}
            />
            {errors.repeatPassword && (
              <p className="text-red-500 text-xs mt-1 font-roboto-flex">
                {errors.repeatPassword}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 font-roboto-flex"
            style={{ backgroundColor: "#6685FF" }}
          >
            {isLoading ? "Creating Account..." : "Finish"}
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm font-roboto-flex">
              Sign up with
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center gap-6 mb-6">
            <button
              onClick={() => handleSocialSignup("Google")}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>
            <button
              onClick={() => handleSocialSignup("Apple")}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </button>
            <button
              onClick={() => handleSocialSignup("LinkedIn")}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0077B5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>
            <button
              onClick={() => handleSocialSignup("Twitter/X")}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
          </div>

          <p className="text-center text-gray-600 text-base sm:text-lg font-roboto-flex">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-semibold hover:underline font-roboto-flex"
              style={{ color: "#6685FF" }}
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
