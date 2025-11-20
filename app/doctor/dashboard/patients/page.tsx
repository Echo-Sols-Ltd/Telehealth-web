"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Video,
  UserRound,
  MessageSquare,
} from "lucide-react";
import { Sidebar } from "../components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Patient = {
  id: number;
  name: string;
  condition: string;
  status: "online" | "offline";
  email: string;
  phone: string;
  age: number;
  location: string;
  lastVisit: string;
};

const PATIENTS: Patient[] = Array.from({ length: 18 }).map((_, idx) => ({
  id: idx + 1,
  name: "John Doe",
  condition:
    idx % 3 === 0
      ? "Heart attack"
      : idx % 3 === 1
        ? "Hypertension"
        : "Diabetes",
  status: idx % 2 === 0 ? "online" : "offline",
  email: "johndoe@example.com",
  phone: "+1 (555) 012-3456",
  age: 42,
  location: "New York, USA",
  lastVisit: "24 Sep 2025",
}));

const appointmentModes = [
  { id: "video", label: "Video consultation", icon: Video },
  { id: "in-person", label: "In-Person", icon: UserRound },
  { id: "chat", label: "Chat", icon: MessageSquare },
];

type PanelType = "appointment" | "profile" | null;

export default function PatientsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("JD");
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMode, setSelectedMode] = useState("video");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const patientsPerPage = 8;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentUserStr = localStorage.getItem("currentUser");
    const savedProfileImage = localStorage.getItem("userProfileImage");

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
      } catch (error) {
        console.error("Unable to parse user data", error);
      }
    }

    if (savedProfileImage) {
      setUserProfileImage(savedProfileImage);
    }

    const handleProfileImageUpdate = (e: CustomEvent) => {
      setUserProfileImage(e.detail);
    };

    window.addEventListener(
      "profileImageUpdated",
      handleProfileImageUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "profileImageUpdated",
        handleProfileImageUpdate as EventListener
      );
    };
  }, []);

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return PATIENTS;
    return PATIENTS.filter((patient) =>
      `${patient.name} ${patient.condition}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * patientsPerPage;
    return filteredPatients.slice(start, start + patientsPerPage);
  }, [filteredPatients, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setActivePanel("appointment");
  };

  const handleViewProfile = (
    patient: Patient,
    event?: MouseEvent<HTMLButtonElement>
  ) => {
    event?.stopPropagation();
    setSelectedPatient(patient);
    setActivePanel("profile");
  };

  return (
    <div className="flex min-h-screen bg-[#f5f6fb]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-96 bg-[#f5f6fb] min-h-screen">
        <header className="sticky top-0 z-30 bg-[#f5f6fb]/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7b8ab0]" />
                  <Input
                    placeholder="Search.."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-12 bg-[#dfe4ff] border-0 text-base font-roboto h-12 placeholder:text-[#7b8ab0]"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Bell className="h-6 w-6 sm:h-7 sm:w-7 fill-[#061242]" />
              </Button>
              <Avatar className="h-11 w-11 border border-[#e0e6ff]">
                {userProfileImage ? (
                  <AvatarImage src={userProfileImage} alt="Profile" />
                ) : null}
                <AvatarFallback className="bg-[#6685ff] text-white font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-10 space-y-8">
          <section className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div className="bg-white rounded-[32px] p-6 shadow-lg border border-[#f0f2fb] flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#b0b3c7]">
                    Patients
                  </p>
                  <h2 className="text-3xl font-bold text-[#0b1235] font-roboto">
                    Make an appointment
                  </h2>
                </div>
                <span className="text-sm text-[#8c92ad] hidden sm:block">
                  {filteredPatients.length} patients
                </span>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {PATIENTS.slice(0, 6).map((patient) => {
                  const isSelected =
                    selectedPatient?.id === patient.id && activePanel === "appointment";
                  return (
                    <div
                      key={patient.id}
                      role="button"
                      onClick={() => handleSelectPatient(patient)}
                      className={`flex items-center gap-4 rounded-2xl border p-4 bg-[#f9faff] transition cursor-pointer ${
                        isSelected ? "border-[#6685ff] shadow-lg" : "border-[#f0f2fb] hover:border-[#cfd7ff]"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <Image
                          src="/images/@profile.png"
                          alt={patient.name}
                          width={70}
                          height={70}
                          className="rounded-2xl object-cover"
                        />
                        <span
                          className={`absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white ${
                            patient.status === "online" ? "bg-[#4ade80]" : "bg-[#c4c8dd]"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-[#1b224b]">{patient.name}</p>
                        <p className="text-sm text-[#8a91b2]">{patient.condition}</p>
                        <div className="mt-2 flex items-center gap-4 text-sm font-medium">
                          <button
                            onClick={(event) => handleViewProfile(patient, event)}
                            className="text-[#6685ff] hover:underline"
                          >
                            View profile
                          </button>
                          <span className="flex items-center text-[#9ea3bf] text-xs">
                            <span className="h-2 w-2 rounded-full bg-[#9ea3bf] mr-1" />
                            Last active 1h ago
                          </span>
                        </div>
                      </div>
                      <Button className="rounded-full px-6 bg-[#e3e8ff] text-[#4d5fc9] hover:bg-[#d7ddff]">
                        Appointment
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <Card className="rounded-[32px] border-none shadow-xl bg-white min-h-[520px]">
              <CardContent className="p-6 h-full">
                {selectedPatient && activePanel === "profile" ? (
                  <PatientProfilePanel
                    patient={selectedPatient}
                    onCreateAppointment={() => setActivePanel("appointment")}
                  />
                ) : selectedPatient && activePanel === "appointment" ? (
                  <CreateAppointmentPanel
                    patient={selectedPatient}
                    selectedMode={selectedMode}
                    onModeChange={setSelectedMode}
                    onViewProfile={() => setActivePanel("profile")}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-[#8a91b2]">
                    <Image
                      src="/images/@profile.png"
                      alt="No patient selected"
                      width={120}
                      height={120}
                      className="rounded-full mb-4 opacity-70"
                    />
                    <p className="text-lg font-semibold text-[#0b1235]">
                      No patient selected
                    </p>
                    <p className="text-sm mt-1">
                      Choose a patient on the left to start an appointment or view the profile.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <Card className="rounded-[32px] border-none shadow-xl bg-white">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-3xl font-bold text-[#0b1235] font-roboto">
                  Patient List
                </CardTitle>
                <p className="text-sm text-[#8a91b2] mt-1">
                  Browse and filter through your patient records
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-full border-[#d7dbf5] font-medium text-[#0b1235] hover:bg-[#eef0ff]"
              >
                All
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedPatients.map((patient) => {
                  const isSelected =
                    selectedPatient?.id === patient.id && activePanel === "appointment";
                  return (
                    <div
                      key={patient.id}
                      className={`rounded-3xl border bg-[#f9faff] p-4 flex items-center gap-4 transition cursor-pointer ${
                        isSelected ? "border-[#6685ff] shadow-md" : "border-[#edf0ff] hover:border-[#cfd7ff]"
                      }`}
                      onClick={() => handleSelectPatient(patient)}
                    >
                      <Image
                        src="/images/@profile.png"
                        alt={patient.name}
                        width={64}
                        height={64}
                        className="rounded-2xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-[#1b224b]">{patient.name}</p>
                          <span className="text-[11px] font-semibold text-[#8a91b2] bg-white rounded-full px-2 py-1 border border-[#e0e4fb]">
                            {patient.status === "online" ? "NEW" : "FOLLOW"}
                          </span>
                        </div>
                        <p className="text-sm text-[#8a91b2]">{patient.condition}</p>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <button
                            onClick={(event) => handleViewProfile(patient, event)}
                            className="text-[#6685ff] hover:underline"
                          >
                            View profile
                          </button>
                          <Button
                            variant="ghost"
                            className="text-[#4d5fc9] rounded-full border border-[#d6dbff] px-4 py-1 h-auto bg-white hover:bg-[#e8ecff]"
                          >
                            Appointment
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-[#8a91b2]">
                  Showing {(currentPage - 1) * patientsPerPage + 1}-
                  {Math.min(currentPage * patientsPerPage, filteredPatients.length)} of{" "}
                  {filteredPatients.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full border-[#d7dbf5] text-[#0b1235] hover:bg-[#eef0ff]"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    ‹
                  </Button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    const isActive = page === currentPage;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-10 w-10 rounded-full border transition ${
                          isActive
                            ? "bg-[#6685ff] text-white border-[#6685ff]"
                            : "border-[#d7dbf5] text-[#0b1235] hover:bg-[#eef0ff]"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <Button
                    variant="outline"
                    className="rounded-full border-[#d7dbf5] text-[#0b1235] hover:bg-[#eef0ff]"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
                    ›
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

type CreateAppointmentPanelProps = {
  patient: Patient;
  selectedMode: string;
  onModeChange: (mode: string) => void;
  onViewProfile: () => void;
};

function CreateAppointmentPanel({
  patient,
  selectedMode,
  onModeChange,
  onViewProfile,
}: CreateAppointmentPanelProps) {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#b0b3c7]">Create</p>
          <h3 className="text-2xl font-bold text-[#0b1235]">
            Appointment for {patient.name}
          </h3>
        </div>
        <button
          className="text-sm text-[#6685ff] hover:underline font-medium"
          onClick={onViewProfile}
        >
          View profile
        </button>
      </div>

      <div className="rounded-2xl bg-[#f6f7fb] p-4 flex items-center gap-4">
        <Image
          src="/images/@profile.png"
          alt={patient.name}
          width={64}
          height={64}
          className="rounded-2xl object-cover"
        />
        <div>
          <p className="font-semibold text-[#1b224b]">{patient.name}</p>
          <p className="text-sm text-[#8a91b2]">{patient.condition}</p>
          <p className="text-xs text-[#8a91b2] mt-1">Last visit: {patient.lastVisit}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-[#7b7f95]">Patient Name / ID</label>
        <Input
          placeholder="Enter patient name"
          defaultValue={patient.name}
          className="h-12 rounded-2xl bg-[#f6f7fb] border-0"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-[#7b7f95]">Email</label>
        <Input
          type="email"
          placeholder="name@email.com"
          defaultValue={patient.email}
          className="h-12 rounded-2xl bg-[#f6f7fb] border-0"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-[#7b7f95]">Condition / Reason for visit</label>
        <textarea
          rows={3}
          className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent px-4 py-3 text-sm focus:outline-none focus:border-[#cdd2ef]"
          placeholder="Describe the symptoms or goal for this appointment"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-[#7b7f95]">Time</label>
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <Input type="date" className="h-12 rounded-2xl bg-[#f6f7fb] border-0" />
          <Input type="time" className="h-12 rounded-2xl bg-[#f6f7fb] border-0" />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm text-[#7b7f95]">Consultation Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {appointmentModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onModeChange(mode.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-[#6685ff] bg-[#edf0ff] text-[#1b224b]"
                    : "border-[#e4e7f8] text-[#8a91b2] hover:border-[#c9cff2]"
                }`}
              >
                <Icon className="h-5 w-5 mb-2 text-current" />
                <p className="text-sm font-semibold">{mode.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="ghost" className="rounded-full px-6 text-[#7b7f95] hover:text-[#0b1235]">
          Cancel
        </Button>
        <Button className="rounded-full px-8 bg-[#6685ff] hover:bg-[#516de0] shadow-md">
          Create
        </Button>
      </div>
    </div>
  );
}

type PatientProfilePanelProps = {
  patient: Patient;
  onCreateAppointment: () => void;
};

function PatientProfilePanel({ patient, onCreateAppointment }: PatientProfilePanelProps) {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-4">
        <Image
          src="/images/@profile.png"
          alt={patient.name}
          width={96}
          height={96}
          className="rounded-3xl object-cover"
        />
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#b0b3c7]">Profile</p>
          <h3 className="text-2xl font-bold text-[#0b1235]">{patient.name}</h3>
          <p className="text-sm text-[#8a91b2]">{patient.condition}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ProfileStat label="Status" value={patient.status === "online" ? "Online" : "Offline"} />
        <ProfileStat label="Age" value={`${patient.age} yrs`} />
        <ProfileStat label="Phone" value={patient.phone} />
        <ProfileStat label="Email" value={patient.email} />
      </div>

      <div className="rounded-2xl bg-[#f6f7fb] p-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b0b3c7]">Last Visit</p>
        <p className="text-lg font-semibold text-[#1b224b]">{patient.lastVisit}</p>
        <p className="text-sm text-[#8a91b2]">Location: {patient.location}</p>
      </div>

      <div className="rounded-2xl border border-dashed border-[#d7dbf5] p-4 text-sm text-[#8a91b2]">
        <p className="font-semibold text-[#1b224b] mb-1">Care Notes</p>
        <p>
          Maintain regular cardio checkups, review medication adherence, and promote a low sodium diet.
        </p>
      </div>

      <div className="mt-auto flex items-center justify-end gap-3 pt-2">
        <Button variant="ghost" className="rounded-full px-6 text-[#7b7f95] hover:text-[#0b1235]">
          Chat
        </Button>
        <Button
          className="rounded-full px-8 bg-[#6685ff] hover:bg-[#516de0] shadow-md"
          onClick={onCreateAppointment}
        >
          Create appointment
        </Button>
      </div>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f9faff] p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-[#b0b3c7]">{label}</p>
      <p className="text-sm font-semibold text-[#1b224b] mt-1">{value}</p>
    </div>
  );
}

