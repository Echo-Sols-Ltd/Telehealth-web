"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Ellipsis, ChevronDown, Menu } from "lucide-react";
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

// Overall metrics chart data
const overallMetricsData = [
  { month: "Jan", metric1: 40, metric2: 60, metric3: 50, metric4: 45 },
  { month: "Feb", metric1: 50, metric2: 70, metric3: 55, metric4: 50 },
  { month: "Mar", metric1: 45, metric2: 65, metric3: 60, metric4: 55 },
  { month: "Apr", metric1: 60, metric2: 80, metric3: 65, metric4: 60 },
  { month: "May", metric1: 55, metric2: 75, metric3: 70, metric4: 65 },
  { month: "Jun", metric1: 70, metric2: 90, metric3: 75, metric4: 70 },
  { month: "Jul", metric1: 65, metric2: 85, metric3: 80, metric4: 75 },
];

// Progress metrics data
const progressMetrics = [
  {
    name: "Temperature",
    status: "Highly Stable",
    progress: 69,
    description: "Highly Stable-69% Progress",
    colors: [
      { value: 40, color: "#6685FF" }, // Blue
      { value: 25, color: "#455A64" }, // Red
      { value: 35, color: "#FBBC05AB" }, // Yellow
    ],
  },
  {
    name: "Blood Pressure",
    status: "Mild Stability",
    progress: 30,
    description: "Mild Stability-30% Progress",
    colors: [
      { value: 20, color: "#6685FF" }, // Blue
      { value: 10, color: "#455A64" }, // Red
      { value: 70, color: "#FBBC05AB" }, // Yellow
    ],
  },
  {
    name: "Heart Rate",
    status: "Critical",
    progress: 15,
    description: "Critical-15% Progress",
    colors: [
      { value: 5, color: "#6685FF" }, // Blue
      { value: 80, color: "#455A64" }, // Red
      { value: 15, color: "#FBBC05AB" }, // Yellow
    ],
  },
  {
    name: "Glucose levels",
    status: "Slightly Stable",
    progress: 45,
    description: "Slightly Stable-45% Progress",
    colors: [
      { value: 30, color: "#6685FF" }, // Blue
      { value: 25, color: "#455A64" }, // Red
      { value: 45, color: "#FBBC05AB" }, // Yellow
    ],
  },
];

export default function HealthMetrics() {
  const [userInitials, setUserInitials] = useState("JD");
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState("6months");
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
              {/* <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32 sm:w-40 text-sm sm:text-base font-roboto border-0 bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month" className="font-roboto">
                    Last 1 month
                  </SelectItem>
                  <SelectItem value="3months" className="font-roboto">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="6months" className="font-roboto">
                    Last 6 months
                  </SelectItem>
                  <SelectItem value="1year" className="font-roboto">
                    Last 1 year
                  </SelectItem>
                </SelectContent>
              </Select> */}
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
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12"
              ></Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Overall Metrics Section */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pb-3 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl font-roboto font-semibold text-[#000000]">
                Overall metrics
              </CardTitle>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-full sm:w-40 text-sm sm:text-base font-roboto text-[#0000007D]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month" className="font-roboto">
                    Last 1 month
                  </SelectItem>
                  <SelectItem value="3months" className="font-roboto">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="6months" className="font-roboto">
                    Last 6 months
                  </SelectItem>
                  <SelectItem value="1year" className="font-roboto">
                    Last 1 year
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400} minWidth={0}>
                <LineChart data={overallMetricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" fontSize={14} fontFamily="Roboto" />
                  <YAxis
                    domain={[20, 120]}
                    ticks={[20, 40, 60, 80, 100, 120]}
                    fontSize={14}
                    fontFamily="Roboto"
                  />
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
                    dataKey="metric1"
                    stroke="#455A64"
                    name="Temperature"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="metric2"
                    stroke="#34A853"
                    name="Blood Pressure"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="metric3"
                    stroke="#526ACC"
                    name="Heart Rate"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="metric4"
                    stroke="#C99604"
                    name="Glucose Levels"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Description Section */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pb-3 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl font-roboto font-semibold text-[#000000]">
                Description
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="percentage">
                  <SelectTrigger className="w-full sm:w-40 text-sm sm:text-base font-roboto text-[#0000007D]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage" className="font-roboto">
                      Percentage
                    </SelectItem>
                    <SelectItem value="value" className="font-roboto">
                      Value
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 text-[#0000005E]"
                >
                  <Ellipsis className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {progressMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-medium font-roboto text-[#000000]">
                      {metric.name}
                    </span>
                    <span className="text-sm sm:text-base font-roboto text-[#00000087]">
                      {metric.description}
                    </span>
                  </div>
                  <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden flex">
                    {metric.colors.map((colorSegment, idx) => (
                      <div
                        key={idx}
                        className="h-full"
                        style={{
                          width: `${colorSegment.value}%`,
                          backgroundColor: colorSegment.color,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
