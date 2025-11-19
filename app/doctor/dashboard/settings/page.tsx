"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Bell,
  Check,
  Menu,
  Save,
  Shield,
  User,
  Heart,
  Calendar,
  Settings2,
  Info,
  MonitorSmartphone,
  Accessibility,
  Siren,
  Camera,
  ChevronRight,
} from "lucide-react";
import { Sidebar } from "../components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

type FormState = {
  fullName: string;
  nationalId: string;
  email: string;
  medicalCode: string;
  password: string;
  phonePrefix: string;
  phoneNumber: string;
  rememberMe: boolean;
  faceId: boolean;
  scanQr: boolean;
};

const initialFormState: FormState = {
  fullName: "James KAYIRANGA",
  nationalId: "09403299085",
  email: "jkayiranga@gmail.com",
  medicalCode: "48903708B",
  password: "********",
  phonePrefix: "+250",
  phoneNumber: "0788345465",
  rememberMe: true,
  faceId: false,
  scanQr: true,
};

const generalSections = [
  { icon: Shield, label: "Account & Security" },
  { icon: Settings2, label: "Personalization" },
  { icon: Heart, label: "Health & Data" },
  { icon: Calendar, label: "Appointments & Consultations" },
  { icon: Settings2, label: "App Preferences" },
  { icon: Info, label: "Support & Info" },
];

const medicalSections = [
  { icon: MonitorSmartphone, label: "Connected Devices" },
  { icon: Accessibility, label: "Accessibility" },
  { icon: Siren, label: "Emergency" },
];

export default function DoctorSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState("JK");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedImage = localStorage.getItem("doctorSettingsProfile");
    if (savedImage) {
      setProfileImage(savedImage);
    }

    const currentUserStr = localStorage.getItem("currentUser");
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr) as { fullName?: string };
        if (currentUser.fullName) {
          const names = currentUser.fullName.trim().split(/\s+/);
          const initials =
            names.length >= 2
              ? `${names[0][0]}${names[names.length - 1][0]}`
              : names[0][0];
          setUserInitials(initials.toUpperCase());
        }
      } catch {
        setUserInitials("JK");
      }
    }
  }, []);

  const handleChange = (
    field: keyof FormState,
    value: string | boolean
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
        localStorage.setItem("doctorSettingsProfile", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f6fb]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-96 p-4 sm:p-6 lg:p-10 space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-sm text-gray-500 font-roboto">Doctor</p>
              <h1 className="text-3xl font-bold text-[#0b1235] font-roboto">
                Settings
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Bell className="h-5 w-5 text-[#0c1a3f]" />
            </Button>
            <Avatar className="h-10 w-10 border border-[#e0e6ff]">
              {profileImage ? (
                <AvatarImage src={profileImage} alt="Profile" />
              ) : (
                <AvatarFallback className="bg-[#6685ff] text-white">
                  {userInitials}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
          <section className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 tracking-[0.3em] mb-4">
                GENERAL
              </p>
              <div className="space-y-3">
                {generalSections.map((section, index) => (
                  <button
                    key={section.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border ${
                      index === 0
                        ? "border-[#dfe4ff] bg-[#eef1ff] text-[#6685ff] shadow-sm"
                        : "border-transparent bg-gray-50 text-gray-700 hover:border-gray-200"
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="flex-1 text-left font-medium">
                      {section.label}
                    </span>
                    {index === 0 && (
                      <span className="text-xs text-white bg-[#6685ff] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 tracking-[0.3em] mb-4">
                MEDICAL
              </p>
              <div className="space-y-3">
                {medicalSections.map((section) => (
                  <button
                    key={section.label}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-transparent bg-gray-50 text-gray-700 hover:border-gray-200"
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="flex-1 text-left font-medium">
                      {section.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-4xl p-6 sm:p-8 shadow-lg border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#0b1235] font-roboto">
                Edit Profile
              </h2>
              {saveSuccess && (
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  Saved
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#eef1ff]">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image
                      src="/images/doc.png"
                      alt="Profile placeholder"
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <button
                  className="absolute -bottom-2 -right-2 bg-[#6685ff] text-white p-2 rounded-full shadow-lg"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-sm text-gray-500">
                Click the camera icon to upload a new profile picture. The photo
                will be saved locally until backend integration is ready.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-500 font-medium">
                  Full Name
                </label>
                <Input
                  value={formState.fullName}
                  onChange={(event) =>
                    handleChange("fullName", event.target.value)
                  }
                  className="h-12 rounded-2xl bg-[#f7f7fb] border-0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500 font-medium">
                  National ID
                </label>
                <Input
                  value={formState.nationalId}
                  onChange={(event) =>
                    handleChange("nationalId", event.target.value)
                  }
                  className="h-12 rounded-2xl bg-[#f7f7fb] border-0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500 font-medium">
                  Email
                </label>
                <Input
                  type="email"
                  value={formState.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  className="h-12 rounded-2xl bg-[#f7f7fb] border-0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500 font-medium">
                  Medical Code
                </label>
                <Input
                  value={formState.medicalCode}
                  onChange={(event) =>
                    handleChange("medicalCode", event.target.value)
                  }
                  className="h-12 rounded-2xl bg-[#f7f7fb] border-0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500 font-medium">
                  Password
                </label>
                <Input
                  type="password"
                  value={formState.password}
                  onChange={(event) =>
                    handleChange("password", event.target.value)
                  }
                  className="h-12 rounded-2xl bg-[#f7f7fb] border-0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500 font-medium">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formState.phonePrefix}
                    onChange={(event) =>
                      handleChange("phonePrefix", event.target.value)
                    }
                    className="h-12 rounded-2xl bg-[#f7f7fb] border-0 w-24"
                  />
                  <Input
                    value={formState.phoneNumber}
                    onChange={(event) =>
                      handleChange("phoneNumber", event.target.value)
                    }
                    className="h-12 rounded-2xl bg-[#f7f7fb] border-0 flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleRow
                label="Remember me"
                value={formState.rememberMe}
                onChange={(value) => handleChange("rememberMe", value)}
              />
              <ToggleRow
                label="Face ID"
                value={formState.faceId}
                onChange={(value) => handleChange("faceId", value)}
              />
              <ToggleRow
                label="Scan QR Code"
                value={formState.scanQr}
                onChange={(value) => handleChange("scanQr", value)}
              />
              <button className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition">
                <span className="font-medium">Google Authenticator</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <Button
              className="w-full h-14 text-lg font-semibold bg-[#6685ff] hover:bg-[#516de0]"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save
                </>
              )}
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-2xl bg-gray-50">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

