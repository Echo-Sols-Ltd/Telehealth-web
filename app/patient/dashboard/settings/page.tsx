"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Lock,
  User,
  Heart,
  Calendar,
  Grid3x3,
  Wrench,
  Monitor,
  Expand,
  Bell,
  Camera,
  ArrowRight,
  Check,
} from "lucide-react";
import type { UserData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "../components/sidebar";
import Image from "next/image";
import toast from "react-hot-toast";

type SettingsTab =
  | "account-security"
  | "personalization"
  | "health-data"
  | "appointments-consultations"
  | "app-preferences"
  | "support-info"
  | "connected-devices"
  | "accessibility"
  | "emergency";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("JD");
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("account-security");
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    nationalId: "09403299085",
    email: "johndoe@gmail.com",
    medicalCode: "48903708B",
    password: "••••••••",
    phoneNumber: "+250 | 0788345465",
  });

  // Toggle states
  const [rememberMe, setRememberMe] = useState(true);
  const [faceId, setFaceId] = useState(false);
  const [scanQRCode, setScanQRCode] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUserStr = localStorage.getItem("currentUser");
      const savedProfileImage = localStorage.getItem("userProfileImage");

      if (currentUserStr) {
        try {
          const currentUser: UserData = JSON.parse(currentUserStr);
          setFormData({
            fullName: currentUser.fullName || "John Doe",
            nationalId: currentUser.nationalId || "09403299085",
            email: currentUser.email || "johndoe@gmail.com",
            medicalCode: currentUser.medicalCode || "48903708B",
            password: "••••••••",
            phoneNumber: currentUser.phoneNumber || "+250 | 0788345465",
          });

          const getInitials = (fullName: string): string => {
            const names = fullName.trim().split(/\s+/);
            if (names.length >= 2) {
              return (
                names[0].charAt(0).toUpperCase() +
                names[names.length - 1].charAt(0).toUpperCase()
              );
            } else if (names.length === 1) {
              return names[0].charAt(0).toUpperCase();
            }
            return "JD";
          };
          setUserInitials(getInitials(currentUser.fullName));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }

      if (savedProfileImage) {
        setUserProfileImage(savedProfileImage);
      }
    }
  }, []);

  // Save profile image to localStorage and update header
  useEffect(() => {
    if (userProfileImage && typeof window !== "undefined") {
      localStorage.setItem("userProfileImage", userProfileImage);
      // Dispatch custom event to update header avatar
      window.dispatchEvent(
        new CustomEvent("profileImageUpdated", { detail: userProfileImage })
      );
    }
  }, [userProfileImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUserProfileImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);

    // Update localStorage with new user data
    if (typeof window !== "undefined") {
      const currentUserStr = localStorage.getItem("currentUser");
      if (currentUserStr) {
        try {
          const currentUser: UserData = JSON.parse(currentUserStr);
          const updatedUser: UserData = {
            ...currentUser,
            fullName: formData.fullName,
            nationalId: formData.nationalId,
            email: formData.email,
            medicalCode: formData.medicalCode,
            phoneNumber: formData.phoneNumber,
          };
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));

          // Save toggle states
          localStorage.setItem("rememberMe", String(rememberMe));
          localStorage.setItem("faceId", String(faceId));
          localStorage.setItem("scanQRCode", String(scanQRCode));

          // Update initials
          const getInitials = (fullName: string): string => {
            const names = fullName.trim().split(/\s+/);
            if (names.length >= 2) {
              return (
                names[0].charAt(0).toUpperCase() +
                names[names.length - 1].charAt(0).toUpperCase()
              );
            } else if (names.length === 1) {
              return names[0].charAt(0).toUpperCase();
            }
            return "JD";
          };
          setUserInitials(getInitials(formData.fullName));

          // Show success message
          setTimeout(() => {
            setIsSaving(false);
            toast.success("Settings saved successfully!");
          }, 500);
        } catch (error) {
          console.error("Error saving user data:", error);
          setIsSaving(false);
          toast.error("Error saving settings. Please try again.");
        }
      }
    }
  };

  const settingsTabs = [
    {
      category: "GENERAL",
      tabs: [
        {
          id: "account-security" as SettingsTab,
          label: "Account & Security",
          icon: Lock,
        },
        {
          id: "personalization" as SettingsTab,
          label: "Personalization",
          icon: User,
        },
        {
          id: "health-data" as SettingsTab,
          label: "Health & Data",
          icon: Heart,
        },
        {
          id: "appointments-consultations" as SettingsTab,
          label: "Appointments & Consultations",
          icon: Calendar,
        },
        {
          id: "app-preferences" as SettingsTab,
          label: "App Preferences",
          icon: Grid3x3,
        },
        {
          id: "support-info" as SettingsTab,
          label: "Support & Info",
          icon: Wrench,
        },
      ],
    },
    {
      category: "MEDICAL",
      tabs: [
        {
          id: "connected-devices" as SettingsTab,
          label: "Connected Devices",
          icon: Monitor,
        },
        {
          id: "accessibility" as SettingsTab,
          label: "Accessibility",
          icon: Expand,
        },
        {
          id: "emergency" as SettingsTab,
          label: "Emergency",
          icon: Bell,
        },
      ],
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "account-security":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold font-roboto text-gray-900">
              Edit Profile
            </h2>

            {/* Profile Picture Upload */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {userProfileImage ? (
                  <Image
                    src={userProfileImage}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full object-cover w-[120px] h-[120px]"
                  />
                ) : (
                  <div className="w-[120px] h-[120px] rounded-full bg-[#6685FF] flex items-center justify-center">
                    <span className="text-white text-3xl font-roboto font-semibold">
                      {userInitials}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-[#6685FF] text-white rounded-full p-2 hover:bg-[#526ACC] transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  Full Name
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="h-12 font-roboto transition-all duration-200 focus:ring-2 focus:ring-[#6685FF]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  National ID
                </label>
                <Input
                  value={formData.nationalId}
                  onChange={(e) =>
                    handleInputChange("nationalId", e.target.value)
                  }
                  className="h-12 font-roboto transition-all duration-200 focus:ring-2 focus:ring-[#6685FF]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 font-roboto transition-all duration-200 focus:ring-2 focus:ring-[#6685FF]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  Medical Code
                </label>
                <Input
                  value={formData.medicalCode}
                  onChange={(e) =>
                    handleInputChange("medicalCode", e.target.value)
                  }
                  className="h-12 font-roboto transition-all duration-200 focus:ring-2 focus:ring-[#6685FF]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  Password
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="h-12 font-roboto transition-all duration-200 focus:ring-2 focus:ring-[#6685FF]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  Phone Number
                </label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  className="h-12 font-roboto transition-all duration-200 focus:ring-2 focus:ring-[#6685FF]/50"
                />
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-4 pt-4">
              <ToggleSwitch
                label="Remember me"
                checked={rememberMe}
                onChange={setRememberMe}
              />
              <ToggleSwitch
                label="Face ID"
                checked={faceId}
                onChange={setFaceId}
              />
              <ToggleSwitch
                label="Scan QR Code"
                checked={scanQRCode}
                onChange={setScanQRCode}
              />
            </div>

            {/* Google Authenticator */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
              <span className="font-roboto text-gray-900">
                Google Authenticator
              </span>
              <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#6685FF] hover:bg-[#526ACC] text-white px-8 py-6 text-base font-roboto font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Saving...
                  </span>
                ) : (
                  "SAVE"
                )}
              </Button>
            </div>
          </div>
        );

      case "personalization":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold font-roboto text-gray-900">
              Personalization
            </h2>
            <p className="text-gray-600 font-roboto">
              Customize your app experience and preferences.
            </p>
            {/* Add personalization content here */}
          </div>
        );

      case "health-data":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold font-roboto text-gray-900">
              Health & Data
            </h2>
            <p className="text-gray-600 font-roboto">
              Manage your health data and privacy settings.
            </p>
            {/* Add health data content here */}
          </div>
        );

      case "appointments-consultations":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold font-roboto text-gray-900">
              Appointments & Consultations
            </h2>
            <p className="text-gray-600 font-roboto">
              Configure your appointment and consultation preferences.
            </p>
            {/* Add appointments content here */}
          </div>
        );

      case "app-preferences":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold font-roboto text-gray-900">
              App Preferences
            </h2>
            <p className="text-gray-600 font-roboto">
              Adjust app settings and preferences.
            </p>
            {/* Add app preferences content here */}
          </div>
        );

      case "support-info":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold font-roboto text-gray-900">
              Support & Info
            </h2>
            <p className="text-gray-600 font-roboto">
              Get help and information about the app.
            </p>
            {/* Add support content here */}
          </div>
        );

      case "connected-devices":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold font-roboto text-gray-900">
              Connected Devices
            </h2>
            <p className="text-gray-600 font-roboto">
              Manage your connected medical devices.
            </p>
            {/* Add connected devices content here */}
          </div>
        );

      case "accessibility":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold font-roboto text-gray-900">
              Accessibility
            </h2>
            <p className="text-gray-600 font-roboto">
              Configure accessibility features and options.
            </p>
            {/* Add accessibility content here */}
          </div>
        );

      case "emergency":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold font-roboto text-gray-900">
              Emergency
            </h2>
            <p className="text-gray-600 font-roboto">
              Set up emergency contacts and information.
            </p>
            {/* Add emergency content here */}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-auto bg-background w-full lg:ml-96">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
          <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold font-roboto text-gray-900">
                Settings
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12"
              >
                <Avatar className="h-9 w-9 sm:h-11 sm:w-11">
                  {userProfileImage ? (
                    <AvatarImage src={userProfileImage} alt="Profile" />
                  ) : (
                    <AvatarFallback className="font-roboto text-sm sm:text-base bg-[#6685FF] text-white">
                      {userInitials}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Settings Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-6">
                {settingsTabs.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-roboto mb-3">
                      {category.category}
                    </h3>
                    {category.tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-roboto overflow-hidden hover:scale-[1.02] active:scale-[0.98] ${
                            activeTab === tab.id
                              ? "bg-[#E1E6F8] text-[#6685FF]"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {activeTab === tab.id && (
                            <span className="absolute left-0 top-0 h-full w-2 bg-[#526ACC] rounded-r-full" />
                          )}
                          <Icon className="h-5 w-5 relative z-10" />
                          <span className="text-sm font-medium relative z-10">
                            {tab.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Tab Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-roboto text-gray-900">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6685FF] focus:ring-offset-2 hover:scale-105 active:scale-95 ${
          checked ? "bg-[#6685FF]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
