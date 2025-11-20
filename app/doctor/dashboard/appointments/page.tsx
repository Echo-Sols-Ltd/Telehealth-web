"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Bell, Menu, Search, Check } from "lucide-react";
import { Sidebar } from "../components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type AppointmentStatus = "accepted" | "pending" | "cancelled";

type Appointment = {
  id: number;
  patient: string;
  condition: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  hasPaid: boolean;
  amount: number;
};

const APPOINTMENTS: Appointment[] = Array.from({
  length: 6,
}).map((_, index) => ({
  id: index + 1,
  patient: "John Doe",
  condition: "Hypertension",
  date: "29 Jul 2025, Sunday",
  time: "10:00 AM - 12:30 AM",
  status:
    index % 3 === 0 ? "accepted" : index % 3 === 1 ? "pending" : "cancelled",
  hasPaid: index % 2 === 0,
  amount: 120 + index * 10,
}));

const tabs = ["All", "Accepted", "Pending", "Cancelled"] as const;
type TabKey = (typeof tabs)[number];

export default function AppointmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInitials] = useState("JD");
  const [userProfileImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("All");
  const [appointments, setAppointments] =
    useState<Appointment[]>(APPOINTMENTS);

  const filteredAppointments = useMemo(() => {
    const bySearch = appointments.filter((appointment) =>
      `${appointment.patient} ${appointment.condition}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    if (activeTab === "All") return bySearch;
    return bySearch.filter(
      (appointment) => appointment.status === activeTab.toLowerCase()
    );
  }, [appointments, activeTab, searchTerm]);

  const updateAppointment = (id: number, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id ? { ...appointment, ...updates } : appointment
      )
    );
  };

  const renderAction = (appointment: Appointment) => {
    if (appointment.status === "pending") {
      return (
        <div className="flex items-center gap-3">
          <Button
            className="rounded-full bg-[#6685ff] hover:bg-[#4f6ce0] px-6"
            onClick={() => updateAppointment(appointment.id, { status: "accepted" })}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-[#d7dbf5] text-[#0b1235] hover:bg-[#eef0ff]"
            onClick={() => updateAppointment(appointment.id, { status: "cancelled" })}
          >
            Cancel
          </Button>
        </div>
      );
    }

    if (appointment.status === "accepted") {
      return (
        <div className="flex items-center gap-3">
          <Button className="rounded-full bg-black text-white px-6 hover:bg-[#1b1b1b]">
            Reschedule
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-[#d7dbf5] text-[#0b1235] hover:bg-[#eef0ff]"
            onClick={() => updateAppointment(appointment.id, { status: "cancelled" })}
          >
            Cancel
          </Button>
          <span className="h-12 w-12 rounded-full border-2 border-[#d3d6f2] flex items-center justify-center">
            <span className="h-10 w-10 rounded-full bg-[#6d7bff] flex items-center justify-center text-white">
              <Check className="h-5 w-5" />
            </span>
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Button
          className="rounded-full bg-[#8aa0ff] hover:bg-[#738bff] px-6"
          onClick={() => updateAppointment(appointment.id, { status: "pending" })}
        >
          Recover
        </Button>
        <Button
          variant="outline"
          className="rounded-full border-[#d7dbf5] text-[#0b1235] hover:bg-[#eef0ff]"
          onClick={() => updateAppointment(appointment.id, { status: "cancelled" })}
        >
          Cancel
        </Button>
      </div>
    );
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
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-[#0b1235] font-roboto">
              My Appointments
            </h1>

            <div className="flex flex-wrap gap-4 text-lg font-medium text-[#8c92ad]">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    className={`px-6 py-2 rounded-full transition ${
                      isActive
                        ? "bg-white text-[#0b1235] shadow-md"
                        : "hover:text-[#0b1235]"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          <Card className="rounded-4xl border-none shadow-xl bg-white">
            <CardHeader className="pb-0">
              <CardTitle className="sr-only">Appointments List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 rounded-3xl border border-[#ebedf9] bg-[#f9faff] p-4"
                >
                  <Image
                    src="/images/@profile.png"
                    alt={appointment.patient}
                    width={88}
                    height={88}
                    className="rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-xl font-bold text-[#0b1235]">
                      {appointment.patient}
                    </p>
                    <p className="text-sm text-[#8a91b2]">{appointment.condition}</p>
                    <div className="mt-2 flex flex-col text-sm text-[#8a91b2]">
                      <span className="font-semibold text-[#0b1235]">
                        {appointment.hasPaid ? "Paid" : "Not paid"}
                      </span>
                      <span>
                        {appointment.hasPaid
                          ? `$${appointment.amount.toFixed(2)}`
                          : "Awaiting payment"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#8a91b2]">{appointment.date}</p>
                    <p className="text-sm text-[#8a91b2]">{appointment.time}</p>
                  </div>
                  {renderAction(appointment)}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}