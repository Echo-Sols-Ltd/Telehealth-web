"use client";

import { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import {
  Search,
  Bell,
  Menu,
  Plus,
  ArrowLeft,
  ChevronDown,
  MessageCircle,
  Star,
  Calendar,
  Clock,
  CreditCard,
  Mail,
  DollarSign,
} from "lucide-react";
import type { UserData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "../components/sidebar";
import Image from "next/image";

// Doctor data
const doctors = [
  {
    id: 1,
    name: "James Codell",
    specialty: "Cardiologist",
    rating: 4.9,
    fee: 200,
    date: "29 Jul 2025, Sunday",
    time: "10:00 AM - 12:30 AM",
    image: "/images/doc.png",
    status: "available",
  },
  {
    id: 2,
    name: "James Codell",
    specialty: "Cardiologist",
    rating: 4.9,
    fee: 200,
    date: "30 Jul 2025, Monday",
    time: "2:00 PM - 4:30 PM",
    image: "/images/doc.png",
    status: "available",
  },
  {
    id: 3,
    name: "James Codell",
    specialty: "Cardiologist",
    rating: 4.9,
    fee: 200,
    date: "31 Jul 2025, Tuesday",
    time: "10:00 AM - 12:30 AM",
    image: "/images/doc.png",
    status: "pending",
  },
  {
    id: 4,
    name: "James Codell",
    specialty: "Cardiologist",
    rating: 4.9,
    fee: 200,
    date: "1 Aug 2025, Wednesday",
    time: "2:00 PM - 4:30 PM",
    image: "/images/doc.png",
    status: "available",
  },
  {
    id: 5,
    name: "James Codell",
    specialty: "Cardiologist",
    rating: 4.9,
    fee: 200,
    date: "2 Aug 2025, Thursday",
    time: "10:00 AM - 12:30 AM",
    image: "/images/doc.png",
    status: "cancelled",
  },
];

type ConversationPreview = {
  id: number;
  name: string;
  message: string;
  time: string;
  unread: boolean;
  avatar: string;
  status: "active" | "archived";
};

type ChatMessage = {
  id: number;
  sender: "user" | "doctor";
  text: string;
  time: string;
};

const PATIENT_CONVERSATIONS: ConversationPreview[] = [
  {
    id: 1,
    name: "Dr. John Doe",
    message: "These are the prescribed meds for...",
    time: "11:30 PM",
    unread: true,
    avatar: "/images/doc.png",
    status: "active",
  },
  {
    id: 2,
    name: "Dr. Emily Carter",
    message: "Let me know if you still feel dizzy.",
    time: "9:45 PM",
    unread: false,
    avatar: "/images/doc.png",
    status: "active",
  },
  {
    id: 3,
    name: "Dr. Alex Kim",
    message: "See you next week for follow up.",
    time: "Yesterday",
    unread: false,
    avatar: "/images/doc.png",
    status: "archived",
  },
];

const PATIENT_MESSAGES: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      sender: "doctor",
      text: "Thanks for sharing your heart rate. What else are you experiencing today?",
      time: "11:20 PM",
    },
    {
      id: 2,
      sender: "user",
      text: "My heart rate is 97 bpm. What can I do to improve my health?",
      time: "11:25 PM",
    },
    {
      id: 3,
      sender: "doctor",
      text: `Thanks for sharing your heart rate. A resting heart rate of 97 bpm is still within the normal range (60–100 bpm), but it's on the higher side. This can sometimes be influenced by stress, caffeine, dehydration, or lack of sleep.

To help bring it down, I recommend:
• Staying hydrated and limiting caffeine or alcohol.
• Getting enough rest and practicing relaxation techniques like deep breathing.
• Maintaining regular physical activity such as walking or light exercise.

If your heart rate stays elevated over time or you notice symptoms like chest pain, dizziness, or shortness of breath, schedule a check-up so we can rule out any underlying issues.`,
      time: "11:28 PM",
    },
    {
      id: 4,
      sender: "user",
      text: "Ok. Thank you!",
      time: "11:30 PM",
    },
  ],
  2: [
    {
      id: 1,
      sender: "doctor",
      text: "How are you feeling after the new medication?",
      time: "9:30 PM",
    },
    {
      id: 2,
      sender: "user",
      text: "I'm feeling better but still a bit light-headed.",
      time: "9:40 PM",
    },
  ],
  3: [
    {
      id: 1,
      sender: "doctor",
      text: "Reminder: your follow-up is next Wednesday at 10:00 AM.",
      time: "Yesterday",
    },
  ],
};

const DEFAULT_AUTO_REPLY =
  "Thanks for the update! I'll review this and follow up shortly.";

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

type Step = "booking" | "payment" | "messages";

export default function Appointments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("JD");
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("booking");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<
    (typeof doctors)[0] | null
  >(null);
  const [appointmentDate, setAppointmentDate] = useState("23");
  const [appointmentMonth, setAppointmentMonth] = useState("11");
  const [appointmentTime, setAppointmentTime] = useState("10:30 PM");
  const [appointmentType, setAppointmentType] = useState<
    "online" | "in-person"
  >("online");
  const [reason, setReason] = useState("Regular checkup");

  // Get user initials and profile image from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUserStr = localStorage.getItem("currentUser");
      const savedProfileImage = localStorage.getItem("userProfileImage");

      if (currentUserStr) {
        try {
          const currentUser: UserData = JSON.parse(currentUserStr);
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

      // Listen for profile image updates
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
    }
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    if (selectedTab === "all") return true;
    return doctor.status === selectedTab;
  });

  const handleBookNow = () => {
    if (selectedDoctor) {
      setCurrentStep("payment");
    }
  };

  const handlePayment = () => {
    setCurrentStep("messages");
  };

  const doctorFee = selectedDoctor?.fee || 100;
  const platformFee = 10;
  const totalFee = doctorFee + platformFee;

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
                {currentStep === "booking" && "Book An Appointment"}
                {currentStep === "payment" && "Payment"}
                {currentStep === "messages" && "Messages"}
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {currentStep === "messages" && (
                <div className="flex-1 max-w-xs sm:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 sm:h-6 sm:w-6 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations"
                      className="pl-12 sm:pl-14 bg-blue-50 border-0 text-foreground placeholder:text-muted-foreground text-base sm:text-lg font-roboto h-10 sm:h-12"
                    />
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12"
              >
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
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
                  ) : null}
                  <AvatarFallback className="font-roboto text-sm sm:text-base bg-[#6685FF] text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {currentStep === "booking" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Left Column - Doctor List */}
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200">
                  {["all", "available", "pending", "cancelled"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative ${
                        selectedTab === tab
                          ? "text-[#6685FF]"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {selectedTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6685FF] animate-in slide-in-from-left duration-300" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Doctor Cards */}
                <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  {filteredDoctors.map((doctor, index) => (
                    <div
                      key={doctor.id}
                      className={`bg-white rounded-xl p-4 border border-gray-200 hover:border-[#6685FF] hover:shadow-lg transition-all duration-300 cursor-pointer ${
                        selectedDoctor?.id === doctor.id
                          ? "border-[#6685FF] shadow-lg ring-2 ring-[#6685FF]/20"
                          : ""
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Image
                            src={doctor.image}
                            alt={doctor.name}
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm text-gray-500 font-roboto">
                                {doctor.specialty}
                              </p>
                              <h3 className="text-lg font-semibold font-roboto text-gray-900">
                                {doctor.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-roboto">
                                {doctor.rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span className="font-roboto">{doctor.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span className="font-roboto">{doctor.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold font-roboto text-[#6685FF]">
                              ${doctor.fee}/h
                            </span>
                            <Button
                              size="sm"
                              className="rounded-full bg-[#6685FF] hover:bg-[#526ACC] text-white h-10 w-10 p-0 transition-all duration-300 hover:scale-110"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDoctor(doctor);
                              }}
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Appointment Form */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-in fade-in slide-in-from-right duration-500">
                <div className="flex items-center gap-2 mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedDoctor(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl font-bold font-roboto text-gray-900">
                    Appointment Form
                  </h2>
                </div>

                {selectedDoctor ? (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Image
                          src={selectedDoctor.image}
                          alt={selectedDoctor.name}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold font-roboto text-gray-900">
                            {selectedDoctor.name}, {selectedDoctor.specialty}
                          </h3>
                          <p className="text-sm text-gray-600 font-roboto">
                            Fees: ${selectedDoctor.fee}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Date & Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 font-roboto">
                          Select Date & Time
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            placeholder="Date"
                            className="text-center text-lg font-roboto bg-blue-50 border-0 h-14"
                          />
                          <Input
                            value={appointmentMonth}
                            onChange={(e) =>
                              setAppointmentMonth(e.target.value)
                            }
                            placeholder="Month"
                            className="text-center text-lg font-roboto bg-blue-50 border-0 h-14"
                          />
                          <Input
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            placeholder="Time"
                            className="text-center text-lg font-roboto bg-blue-50 border-0 h-14"
                          />
                        </div>
                      </div>

                      {/* Reason */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 font-roboto">
                          Reason for appointment
                        </label>
                        <Select value={reason} onValueChange={setReason}>
                          <SelectTrigger className="h-14 bg-blue-50 border-0 font-roboto text-base">
                            <SelectValue />
                            <ChevronDown className="h-5 w-5 text-[#6685FF]" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Regular checkup">
                              Regular checkup
                            </SelectItem>
                            <SelectItem value="Follow-up">Follow-up</SelectItem>
                            <SelectItem value="Consultation">
                              Consultation
                            </SelectItem>
                            <SelectItem value="Emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Appointment Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 font-roboto">
                          Appointment type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            type="button"
                            onClick={() => setAppointmentType("online")}
                            className={`h-14 text-base font-roboto transition-all duration-300 ${
                              appointmentType === "online"
                                ? "bg-[#6685FF] text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Online
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setAppointmentType("in-person")}
                            className={`h-14 text-base font-roboto transition-all duration-300 ${
                              appointmentType === "in-person"
                                ? "bg-[#6685FF] text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            In-Person
                          </Button>
                        </div>
                      </div>

                      {/* Fee Breakdown */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm font-roboto">
                          <span className="text-gray-600">Doctor fee</span>
                          <span className="text-gray-900">${doctorFee}</span>
                        </div>
                        <div className="flex justify-between text-sm font-roboto">
                          <span className="text-gray-600">Platform fee</span>
                          <span className="text-gray-900">${platformFee}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold font-roboto pt-2 border-t border-gray-200">
                          <span className="text-gray-900">Total fee</span>
                          <span className="text-[#6685FF]">${totalFee}</span>
                        </div>
                      </div>

                      {/* Book Now Button */}
                      <Button
                        onClick={handleBookNow}
                        className="w-full h-14 text-base font-roboto bg-[#6685FF] hover:bg-[#526ACC] text-white transition-all duration-300 hover:scale-105"
                      >
                        Book Now
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <p className="font-roboto">
                      Select a doctor to book an appointment
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === "payment" && (
            <PaymentPage
              selectedDoctor={selectedDoctor}
              appointmentDate={appointmentDate}
              appointmentMonth={appointmentMonth}
              appointmentTime={appointmentTime}
              appointmentType={appointmentType}
              totalFee={totalFee}
              onPayment={handlePayment}
              onBack={() => setCurrentStep("booking")}
            />
          )}

          {currentStep === "messages" && (
            <MessagesPage
              onBack={() => setCurrentStep("payment")}
              userAvatar={userProfileImage}
              userInitials={userInitials}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Payment Page Component
function PaymentPage({
  selectedDoctor,
  appointmentDate,
  appointmentMonth,
  appointmentTime,
  appointmentType,
  totalFee,
  onPayment,
  onBack,
}: {
  selectedDoctor: (typeof doctors)[0] | null;
  appointmentDate: string;
  appointmentMonth: string;
  appointmentTime: string;
  appointmentType: "online" | "in-person";
  totalFee: number;
  onPayment: () => void;
  onBack: () => void;
}) {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Column - Payment Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Payment Method Tabs */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedPaymentMethod("card")}
              className={`flex-1 p-4 rounded-lg transition-all duration-300 ${
                selectedPaymentMethod === "card"
                  ? "bg-[#6685FF] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <CreditCard className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-roboto">Card</span>
            </button>
            <button
              onClick={() => setSelectedPaymentMethod("email")}
              className={`flex-1 p-4 rounded-lg transition-all duration-300 ${
                selectedPaymentMethod === "email"
                  ? "bg-[#6685FF] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Mail className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-roboto">Email</span>
            </button>
            <button
              onClick={() => setSelectedPaymentMethod("cash")}
              className={`flex-1 p-4 rounded-lg transition-all duration-300 ${
                selectedPaymentMethod === "cash"
                  ? "bg-[#6685FF] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <DollarSign className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-roboto">Cash</span>
            </button>
          </div>

          {selectedPaymentMethod === "card" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  Name on Card
                </label>
                <Input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="h-12 font-roboto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  Card Number
                </label>
                <Input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="h-12 font-roboto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    Expiry
                  </label>
                  <Input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="h-12 font-roboto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    CVV
                  </label>
                  <Input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    className="h-12 font-roboto"
                    type="password"
                  />
                </div>
              </div>
              <Button
                onClick={onPayment}
                className="w-full h-14 text-base font-roboto bg-[#6685FF] hover:bg-[#526ACC] text-white transition-all duration-300 hover:scale-105"
              >
                Pay Now
              </Button>
            </div>
          )}
        </div>

        {/* Booking Details */}
        {selectedDoctor && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-roboto text-gray-900">
                Booking ID: 0012
              </h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold font-roboto text-gray-900">
                  {selectedDoctor.name}, {selectedDoctor.specialty}
                </h4>
                <p className="text-sm text-gray-600 font-roboto">
                  Fees: ${selectedDoctor.fee}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm font-roboto">
              <div className="flex justify-between">
                <span className="text-gray-600">Your Name:</span>
                <span className="text-gray-900">John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Appointment:</span>
                <span className="text-gray-900">
                  {appointmentDate} November {appointmentMonth}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Appointment Type:</span>
                <span className="text-gray-900 capitalize">
                  {appointmentType}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Payment Summary with Animated Curvy Lines */}
      <div className="bg-linear-to-br from-purple-100 to-blue-100 rounded-xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
        {/* Animated Curvy Lines Background */}
        <AnimatedCurvyLines />

        {/* Card Display */}
        <div className="relative z-10 bg-white rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-roboto text-gray-600">
              Cardholder
            </span>
            <Image
              src="/images/paypal.png"
              alt="PayPal"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-bold font-roboto text-gray-900 mb-2">
              John Doe
            </h4>
            <p className="text-2xl font-roboto text-gray-700 tracking-wider">
              .... 3456
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-roboto text-gray-500">Expires</span>
              <p className="text-sm font-roboto text-gray-900">09/12</p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="relative z-10 space-y-3 mb-6">
          <div className="flex justify-between text-sm font-roboto">
            <span className="text-gray-600">Company:</span>
            <span className="text-gray-900">TeleHealth</span>
          </div>
          <div className="flex justify-between text-sm font-roboto">
            <span className="text-gray-600">Appointment ID:</span>
            <span className="text-gray-900">0012</span>
          </div>
          <div className="flex justify-between text-sm font-roboto">
            <span className="text-gray-600">Amount:</span>
            <span className="text-gray-900">${totalFee}</span>
          </div>
          <div className="flex justify-between text-sm font-roboto">
            <span className="text-gray-600">App fee:</span>
            <span className="text-gray-900">$10</span>
          </div>
        </div>

        {/* Success Message */}
        <div className="relative z-10">
          <p className="text-2xl font-bold font-roboto text-gray-400 text-center">
            Payment successful!
          </p>
        </div>
      </div>
    </div>
  );
}

// Animated Curvy Lines Component
function AnimatedCurvyLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 600"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        {/* First Curvy Line - appears first */}
        <path
          d="M-50,80 Q50,30 150,80 T350,80 T550,80"
          fill="none"
          stroke="#6685FF"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-draw-line-1"
          style={{ filter: "blur(1px)" }}
        />
        {/* Second Curvy Line - appears second */}
        <path
          d="M-50,180 Q100,130 250,180 T450,180 T650,180"
          fill="none"
          stroke="#6685FF"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-draw-line-2"
          style={{ filter: "blur(1px)" }}
        />
        {/* Third Curvy Line - appears third */}
        <path
          d="M-50,280 Q80,230 200,280 T400,280 T600,280"
          fill="none"
          stroke="#6685FF"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-draw-line-3"
          style={{ filter: "blur(1px)" }}
        />
        {/* Fourth Curvy Line - appears fourth */}
        <path
          d="M-50,380 Q130,330 280,380 T480,380 T680,380"
          fill="none"
          stroke="#6685FF"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-draw-line-4"
          style={{ filter: "blur(1px)" }}
        />
        {/* Fifth Curvy Line - appears last */}
        <path
          d="M-50,480 Q90,430 200,480 T400,480 T600,480"
          fill="none"
          stroke="#6685FF"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-draw-line-5"
          style={{ filter: "blur(1px)" }}
        />
      </svg>
    </div>
  );
}

// Messages Page Component
function MessagesPage({
  onBack,
  userAvatar,
  userInitials,
}: {
  onBack: () => void;
  userAvatar: string | null;
  userInitials: string;
}) {
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState(PATIENT_CONVERSATIONS);
  const [messagesByConversation, setMessagesByConversation] =
    useState<Record<number, ChatMessage[]>>(PATIENT_MESSAGES);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(PATIENT_CONVERSATIONS[0]?.id ?? null);
  const [messageInput, setMessageInput] = useState("");

  const patientAvatar = userAvatar || "/images/@profile.png";

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.status === tab &&
      conversation.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  );

  const selectedMessages =
    (selectedConversationId &&
      messagesByConversation[selectedConversationId]) ||
    [];

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unread: false }
          : conversation
      )
    );
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversationId) {
      return;
    }

    const trimmed = messageInput.trim();
    const timestamp = formatTime(new Date());
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
      time: timestamp,
    };
    const conversationId = selectedConversationId;

    setMessagesByConversation((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] ?? []), newMessage],
    }));

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              message: trimmed,
              time: timestamp,
              unread: false,
            }
          : conversation
      )
    );

    setMessageInput("");

    setTimeout(() => {
      const reply: ChatMessage = {
        id: Date.now(),
        sender: "doctor",
        text: DEFAULT_AUTO_REPLY,
        time: formatTime(new Date()),
      };
      setMessagesByConversation((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), reply],
      }));

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                message: "Thanks for the update! I'll reply shortly.",
                time: formatTime(new Date()),
                unread: conversationId !== selectedConversationId,
              }
            : conversation
        )
      );
    }, 1500);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Left Column */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations"
                className="pl-10 bg-gray-50 border-0 h-11 rounded-full text-sm"
              />
            </div>
            <div className="flex border border-gray-200 rounded-full overflow-hidden text-sm font-semibold">
              {(["active", "archived"] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setTab(value)}
                  className={`flex-1 py-2 transition ${
                    tab === value
                      ? "bg-[#6685FF] text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {value.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`w-full p-4 flex items-start gap-3 border-b border-gray-100 text-left transition ${
                  conversation.id === selectedConversationId
                    ? "bg-[#eef1ff]"
                    : "hover:bg-gray-50"
                }`}
              >
                <Image
                  src={conversation.avatar}
                  alt={conversation.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {conversation.name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.message}
                  </p>
                  {conversation.unread && (
                    <span className="inline-block w-2 h-2 bg-[#6685FF] rounded-full mt-2" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <Image
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {selectedConversation.name}
                  </h3>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="text-center">
                  <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                    Today
                  </span>
                </div>
                <div className="space-y-4">
                  {selectedMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.sender === "doctor" && (
                        <Image
                          src={selectedConversation.avatar}
                          alt={selectedConversation.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover shrink-0"
                        />
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          message.sender === "user"
                            ? "bg-[#6685FF] text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <span
                          className={`text-xs mt-2 block ${
                            message.sender === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {message.time}
                        </span>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="h-10 w-10 border border-[#dfe4ff] shrink-0">
                          <AvatarImage
                            src={patientAvatar}
                            alt="Patient avatar"
                          />
                          <AvatarFallback className="bg-[#6685FF] text-white">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Input
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Type something..."
                    className="flex-1 bg-blue-50 border-0 h-12 rounded-full px-4"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={handleSendMessage}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
