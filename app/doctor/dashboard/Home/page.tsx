"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  Menu,
  MoreVertical,
  ShieldAlert,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import type { UserData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "../components/sidebar";
import Link from "next/link";

// Chart data types
interface ChartDataPoint {
  time: string;
  value: number;
}

// Payments data for circular chart
// Based on design: 10 total, 2 pending, 8 successful
// Chart shows: Completed (black ~45%), Pending (grey ~20%), Successful (blue ~35%)
const paymentsData = [
  { name: "Completed", value: 45, fill: "#000000" }, // Black
  { name: "Pending", value: 20, fill: "#E5E7EB" }, // Grey
  { name: "Successful", value: 35, fill: "#6685FF" }, // Blue
];

// Emergencies data
const emergencies = [
  {
    id: 1,
    icon: ShieldAlert,
    iconColor: "#3B82F6",
    title:
      "Clara's blood pressure surpassed normal range. Give her advice on how to retain her normal range...",
    time: "11:30 PM",
  },
  {
    id: 2,
    icon: BarChart3,
    iconColor: "#92400E",
    title:
      "Recurring appendicitis in Patient ID: 0012. Here are some suggestions on how to reduce the...",
    time: "11:30 PM",
  },
  {
    id: 3,
    icon: AlertTriangle,
    iconColor: "#EF4444",
    title:
      "Clara's blood pressure surpassed normal range. Give her advice on how to retain her normal range...",
    time: "11:30 PM",
  },
];

// Appointments data
const appointments = [
  {
    id: 1,
    date: "24 Sep",
    patient: "John Doe",
    condition: "Heart Attack",
    time: "09:30 am",
    color: "#6685FF",
  },
  {
    id: 2,
    date: "24 Sep",
    patient: "John Doe",
    condition: "Hypertension",
    time: "09:30 am",
    color: "#061242",
  },
  {
    id: 3,
    date: "24 Sep",
    patient: "John Doe",
    condition: "Diabetes",
    time: "09:30 am",
    color: "#344482",
  },
  {
    id: 4,
    date: "24 Sep",
    patient: "John Doe",
    condition: "Fever",
    time: "09:30 am",
    color: "#FFB9B9",
  },
];

export default function DoctorHome() {
  const [rotation, setRotation] = useState(0);
  const [userInitials, setUserInitials] = useState("JK");
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctorName, setDoctorName] = useState("Dr.KAYIRANGA James");
  const pieChartRef = useRef<HTMLDivElement>(null);
  const [pieChartSize, setPieChartSize] = useState(160);

  // Chart data state - can be updated with real API data
  const [notificationsData, setNotificationsData] = useState<ChartDataPoint[]>([
    { time: "Mon", value: 2 },
    { time: "Tue", value: 4 },
    { time: "Wed", value: 3 },
    { time: "Thu", value: 5 },
    { time: "Fri", value: 3 },
    { time: "Sat", value: 4 },
    { time: "Sun", value: 5 },
  ]);

  const [newPatientsData, setNewPatientsData] = useState<ChartDataPoint[]>([
    { time: "Mon", value: 1 },
    { time: "Tue", value: 2 },
    { time: "Wed", value: 3 },
    { time: "Thu", value: 2 },
    { time: "Fri", value: 4 },
    { time: "Sat", value: 3 },
    { time: "Sun", value: 2 },
  ]);

  const [newMessagesData, setNewMessagesData] = useState<ChartDataPoint[]>([
    { time: "Mon", value: 0 },
    { time: "Tue", value: 1 },
    { time: "Wed", value: 0 },
    { time: "Thu", value: 0 },
    { time: "Fri", value: 1 },
    { time: "Sat", value: 0 },
    { time: "Sun", value: 0 },
  ]);

  // Statistics counts - can be updated with real API data
  const [unreadNotifications, setUnreadNotifications] = useState(5);
  const [newPatientsCount, setNewPatientsCount] = useState(10);
  const [newMessagesCount, setNewMessagesCount] = useState(1);

  // Revolving icons animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Update pie chart size based on container
  useEffect(() => {
    const updateSize = () => {
      if (pieChartRef.current) {
        const size = pieChartRef.current.offsetWidth;
        setPieChartSize(size);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // TODO: Replace this with real API calls when integration is ready
  // Example:
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       const response = await fetch('/api/doctor/dashboard');
  //       const data = await response.json();
  //       setNotificationsData(data.notificationsChart);
  //       setNewPatientsData(data.patientsChart);
  //       setNewMessagesData(data.messagesChart);
  //       setUnreadNotifications(data.unreadNotifications);
  //       setNewPatientsCount(data.newPatientsCount);
  //       setNewMessagesCount(data.newMessagesCount);
  //     } catch (error) {
  //       console.error('Error fetching dashboard data:', error);
  //     }
  //   };
  //   fetchDashboardData();
  //   // Set up polling or websocket for real-time updates
  //   const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
  //   return () => clearInterval(interval);
  // }, []);

  // Get user data from localStorage
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
            return "JK";
          };
          setUserInitials(getInitials(currentUser.fullName));
          if (currentUser.fullName) {
            setDoctorName(`Dr.${currentUser.fullName}`);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
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
    }
  }, []);

  // Icons for revolving animation
  const icons = [
    { src: "/images/pill.png", angle: 0 },
    { src: "/images/pill1.png", angle: 45 },
    { src: "/images/syringe.jpg", angle: 90 },
    { src: "/images/bandage.png", angle: 135 },
    { src: "/images/heart.png", angle: 180 },
    { src: "/images/bottle.jpg", angle: 225 },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main content - Add left margin on desktop to account for fixed sidebar */}
      <main className="flex-1 overflow-auto bg-background w-full lg:ml-96">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 gap-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Hamburger menu for mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex-1 max-w-xs sm:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 sm:h-6 sm:w-6 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search.."
                    className="pl-12 sm:pl-14 bg-blue-100 border-0 text-foreground placeholder:text-muted-foreground text-base sm:text-lg font-roboto h-10 sm:h-12"
                  />
                </div>
              </div>
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
                    <AvatarImage
                      src={userProfileImage || "/placeholder.svg"}
                      alt="Profile"
                    />
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
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Welcome Banner */}
          <Card
            className="relative overflow-hidden"
            style={{ backgroundColor: "#9EB1FE" }}
          >
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-roboto">
                    Hello, {doctorName}
                  </h2>
                  <p className="text-white/90 text-sm sm:text-base mb-4 font-roboto">
                    Your patients are counting on you. Stay on top of your
                    consultations, monitor patient health trends all in one
                    place.
                  </p>
                  <Button
                    className="text-white font-roboto"
                    style={{ backgroundColor: "#6685FF" }}
                  >
                    Chat with a patient
                  </Button>
                </div>
                <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] flex items-center justify-center">
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
                          src={src || "/placeholder.svg"}
                          alt={`icon-${index}`}
                          className="w-8 h-8 object-contain"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).style.display =
                              "none")
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
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Notifications Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm sm:text-base font-roboto font-semibold text-muted-foreground">
                  NOTIFICATIONS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 sm:h-40 mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={notificationsData}>
                      <defs>
                        <linearGradient
                          id="colorNotifications"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#EF4444"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#EF4444"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#EF4444"
                        fillOpacity={1}
                        fill="url(#colorNotifications)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-lg sm:text-xl font-bold font-roboto">
                  {unreadNotifications} Unread notifications
                </p>
              </CardContent>
            </Card>

            {/* New Patients Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm sm:text-base font-roboto font-semibold text-muted-foreground">
                  NEW PATIENTS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 sm:h-40 mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={newPatientsData}>
                      <defs>
                        <linearGradient
                          id="colorPatients"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#colorPatients)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-lg sm:text-xl font-bold font-roboto">
                  {newPatientsCount} New Patients
                </p>
              </CardContent>
            </Card>

            {/* New Messages Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm sm:text-base font-roboto font-semibold text-muted-foreground">
                  NEW MESSAGES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 sm:h-40 mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={newMessagesData}>
                      <defs>
                        <linearGradient
                          id="colorMessages"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#9EB1FE"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#9EB1FE"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#9EB1FE"
                        fillOpacity={1}
                        fill="url(#colorMessages)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-lg sm:text-xl font-bold font-roboto">
                  {newMessagesCount} New Messages
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Emergencies and Payments Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Emergencies Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-roboto font-semibold">
                  EMERGENCIES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {emergencies.map((emergency) => {
                  const IconComponent = emergency.icon;
                  return (
                    <div
                      key={emergency.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${emergency.iconColor}20` }}
                      >
                        <IconComponent
                          size={20}
                          style={{ color: emergency.iconColor }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base text-gray-700 font-roboto mb-1">
                          {emergency.title}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground font-roboto">
                          {emergency.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Payments Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg sm:text-xl font-roboto font-semibold">
                  PAYMENTS
                </CardTitle>
                <Select defaultValue="today">
                  <SelectTrigger className="w-24 sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Pie Chart Container - Must be relative for absolute positioning */}
                  <div
                    ref={pieChartRef}
                    className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0"
                  >
                    <ResponsiveContainer
                      width={pieChartSize}
                      height={pieChartSize}
                    >
                      <PieChart>
                        <Pie
                          data={paymentsData}
                          cx={pieChartSize / 2}
                          cy={pieChartSize / 2}
                          innerRadius={0}
                          outerRadius={pieChartSize / 2 - 5}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {paymentsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Center text overlay - Positioned absolutely within relative container */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold font-roboto text-black">
                          45<span className="text-lg sm:text-xl">%</span>
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground font-roboto mt-1">
                          PAYMENTS
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics Card */}
                  <div className="flex-1 bg-gray-100 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                      <p className="text-2xl sm:text-3xl font-bold font-roboto text-black">
                        10
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground font-roboto">
                        Total payments
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl sm:text-3xl font-bold font-roboto text-black">
                        2
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground font-roboto">
                        Pending payments
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl sm:text-3xl font-bold font-roboto text-black">
                        8
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground font-roboto">
                        Successful payments
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Appointments Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-roboto font-semibold">
                My Appointments
              </CardTitle>
              <Link href="/doctor/dashboard/appointments">
                <Button variant="link" className="text-[#6685FF] font-roboto">
                  View all
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="min-w-[200px] sm:min-w-[250px] rounded-lg p-4 text-white relative"
                      style={{ backgroundColor: appointment.color }}
                    >
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-white hover:bg-white/20"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 mt-4">
                        <p className="text-sm font-roboto font-medium">
                          {appointment.date}
                        </p>
                        <p className="text-base sm:text-lg font-bold font-roboto">
                          {appointment.patient}
                        </p>
                        <p className="text-sm font-roboto">
                          {appointment.condition}
                        </p>
                        <p className="text-sm font-roboto">
                          {appointment.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
