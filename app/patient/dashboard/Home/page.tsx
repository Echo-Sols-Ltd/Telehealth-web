"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  User,
  TrendingUp,
  TrendingDown,
  Eye,
  Trash2,
  Menu,
} from "lucide-react";
import type { UserData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "../components/sidebar";

// Metric data
const metrics = [
  {
    title: "Blood Pressure",
    value: "112.5",
    unit: "sys",
    trend: "down",
    icon: TrendingDown,
    color: "text-red-500",
  },
  {
    title: "Heart Rate",
    value: "97.0",
    unit: "bpm",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    title: "Temperature",
    value: "35.2",
    unit: "°c",
    trend: "up",
    icon: TrendingUp,
    color: "text-red-500",
  },
  {
    title: "Glucose Levels",
    value: "112.5",
    unit: "mg/dl",
    trend: "down",
    icon: TrendingDown,
    color: "text-blue-500",
  },
];

// Chart data
const weekChartData = [
  { day: "Mon", heartRate: 75, bloodPressure: 65 },
  { day: "Tue", heartRate: 82, bloodPressure: 72 },
  { day: "Wed", heartRate: 68, bloodPressure: 58 },
  { day: "Thu", heartRate: 85, bloodPressure: 75 },
  { day: "Fri", heartRate: 72, bloodPressure: 62 },
  { day: "Sat", heartRate: 78, bloodPressure: 68 },
  { day: "Sun", heartRate: 65, bloodPressure: 55 },
];

const monthChartData = [
  { month: "Jan", heartRate: 20, bloodPressure: 10 },
  { month: "Feb", heartRate: 85, bloodPressure: 75 },
  { month: "Mar", heartRate: 60, bloodPressure: 50 },
  { month: "Apr", heartRate: 30, bloodPressure: 45 },
  { month: "May", heartRate: 60, bloodPressure: 75 },
  { month: "June", heartRate: 30, bloodPressure: 45 },
];

// Progress data
const progressData = [
  { name: "Completed", value: 10, fill: "#3B82F6" },
  { name: "Remaining", value: 90, fill: "#FCD34D" },
];

// Appointments data
const appointments = [
  {
    id: 1,
    name: "John Doe",
    department: "Cardiologist",
    time: "Mon, 10:00 am",
    status: "Pending",
    image: "/images/doc.png",
  },
  {
    id: 2,
    name: "John Doe",
    department: "Ophthalmologist",
    time: "Wed, 10:00 am",
    status: "Cancelled",
    image: "/images/doc.png",
  },
  {
    id: 3,
    name: "John Doe",
    department: "Cardiologist",
    time: "Thu, 10:00 am",
    status: "Done",
    image: "/images/doc.png",
  },
  {
    id: 4,
    name: "John Doe",
    department: "Gynecologist",
    time: "Fri, 10:00 am",
    status: "Pending",
    image: "/images/doc.png",
  },
  {
    id: 5,
    name: "John Doe",
    department: "Psychiatrist",
    time: "Sun, 10:00 am",
    status: "Pending",
    image: "/images/doc.png",
  },
];

export default function Dashboard() {
  // State management for chart filter and appointments
  const [chartPeriod, setChartPeriod] = useState("month");
  const [appointmentFilter, setAppointmentFilter] = useState("week");
  const [appointmentsList, setAppointmentsList] = useState(appointments);
  const [userInitials, setUserInitials] = useState("JD");
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      window.addEventListener("profileImageUpdated", handleProfileImageUpdate as EventListener);
      
      return () => {
        window.removeEventListener("profileImageUpdated", handleProfileImageUpdate as EventListener);
      };
    }
  }, []);

  const chartData = chartPeriod === "week" ? weekChartData : monthChartData;

  const handleDeleteAppointment = (id: number) => {
    setAppointmentsList(appointmentsList.filter((apt) => apt.id !== id));
  };

  const getFilteredAppointments = () => {
    if (appointmentFilter === "all") return appointmentsList;
    if (appointmentFilter === "week") return appointmentsList.slice(0, 3);
    if (appointmentFilter === "month") return appointmentsList.slice(0, 4);
    return appointmentsList;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background w-full">
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
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <Card key={index} className="bg-card border border-border">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base font-medium text-muted-foreground font-roboto">
                        {metric.title}
                      </p>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl sm:text-3xl font-bold font-roboto">
                            {metric.value}
                            <span className="text-sm sm:text-base ml-1 font-roboto">
                              {metric.unit}
                            </span>
                          </p>
                        </div>
                        <IconComponent
                          className="h-6 w-6 sm:h-7 sm:w-7"
                          style={{ color: metric.color.split("-")[1] }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Line Chart */}
            <Card className="lg:col-span-2 col-span-1">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-xl sm:text-2xl font-roboto font-semibold">
                  Blood Pressure & Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-2">
                  <Button
                    variant={chartPeriod === "week" ? "default" : "outline"}
                    className={`rounded-full text-sm sm:text-base font-roboto px-4 py-2 ${
                      chartPeriod === "week"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : ""
                    }`}
                    onClick={() => setChartPeriod("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={chartPeriod === "month" ? "default" : "outline"}
                    className={`rounded-full text-sm sm:text-base font-roboto px-4 py-2 ${
                      chartPeriod === "month"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : ""
                    }`}
                    onClick={() => setChartPeriod("month")}
                  >
                    Month
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={250} minWidth={0}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey={chartPeriod === "week" ? "day" : "month"}
                      fontSize={14}
                      fontFamily="Roboto"
                    />
                    <YAxis fontSize={14} fontFamily="Roboto" />
                    <Tooltip />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "20px",
                        fontSize: "14px",
                        fontFamily: "Roboto",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      stroke="#3B82F6"
                      name="Heart Rate"
                      strokeWidth={2.5}
                      dot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bloodPressure"
                      stroke="#000000"
                      name="Blood Pressure"
                      strokeWidth={2.5}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card className="col-span-1">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-xl sm:text-2xl font-roboto font-semibold">
                  Progress Tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={200} minWidth={0}>
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <p className="text-3xl sm:text-4xl font-bold font-roboto">
                    10%
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground font-roboto">
                    Progress
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pb-3 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl font-roboto font-semibold">
                Appointments
              </CardTitle>
              <Select
                value={appointmentFilter}
                onValueChange={setAppointmentFilter}
              >
                <SelectTrigger className="w-full sm:w-40 text-sm sm:text-base font-roboto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week" className="font-roboto">
                    This Week
                  </SelectItem>
                  <SelectItem value="month" className="font-roboto">
                    This Month
                  </SelectItem>
                  <SelectItem value="all" className="font-roboto">
                    All
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm sm:text-base font-roboto font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="text-sm sm:text-base font-roboto font-semibold hidden sm:table-cell">
                      Department
                    </TableHead>
                    <TableHead className="text-sm sm:text-base font-roboto font-semibold">
                      Time
                    </TableHead>
                    <TableHead className="text-sm sm:text-base font-roboto font-semibold hidden md:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="text-sm sm:text-base font-roboto font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredAppointments().map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                          <AvatarImage
                            src={appointment.image || "/placeholder.svg"}
                            alt={appointment.name}
                          />
                          <AvatarFallback className="font-roboto">
                            JD
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm sm:text-base text-muted-foreground truncate font-roboto">
                          {appointment.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm sm:text-base text-muted-foreground hidden sm:table-cell font-roboto">
                        {appointment.department}
                      </TableCell>
                      <TableCell className="text-sm sm:text-base text-muted-foreground font-roboto">
                        {appointment.time}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={`inline-block px-3 sm:px-4 py-1.5 rounded-full text-sm sm:text-base font-medium font-roboto ${
                            appointment.status === "Done"
                              ? "bg-green-100 text-green-700"
                              : appointment.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 sm:h-10 sm:w-10 p-0"
                          >
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 sm:h-10 sm:w-10 p-0"
                            onClick={() =>
                              handleDeleteAppointment(appointment.id)
                            }
                          >
                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
