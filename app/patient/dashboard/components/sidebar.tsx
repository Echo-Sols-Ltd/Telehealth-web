"use client";

import {
  Home,
  Stethoscope,
  Activity,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-96 bg-white flex-col h-screen fixed left-0 top-0 z-40 lg:relative lg:z-auto">
      <div className="p-6">
        <h1 className="text-3xl font-bold font-roboto-flex">
          <span className="text-[#020d36]">Tele</span>
          <span style={{ color: "#6685FF" }}>Health</span>
        </h1>
      </div>

      <nav className="flex-1 px-6 space-y-3 flex flex-col pt-16">
        <NavItem
          icon={Home}
          label="Home"
          href="/patient/dashboard"
          active={
            pathname === "/patient/dashboard" ||
            pathname === "/patient/dashboard/Home"
          }
        />
        <NavItem
          icon={Stethoscope}
          label="Health Metrics"
          href="/patient/dashboard/health-metrics"
          active={pathname === "/patient/dashboard/health-metrics"}
        />
        <NavItem
          icon={Activity}
          label="AI Consultation"
          href="/patient/dashboard/ai-consultation"
          active={pathname === "/patient/dashboard/ai-consultation"}
        />
        <NavItem
          icon={Calendar}
          label="Appointments"
          href="/patient/dashboard/appointments"
          active={pathname === "/patient/dashboard/appointments"}
        />
        <NavItem
          icon={Settings}
          label="Settings"
          href="/patient/dashboard/settings"
          active={pathname === "/patient/dashboard/settings"}
        />
      </nav>

      <div className="p-4 flex flex-col">
        <div className="bg-linear-to-br from-blue-100 to-purple-100 rounded-lg p-5 mb-4 text-center relative overflow-hidden flex flex-col items-center gap-4">
          <div className="relative z-10 w-full flex justify-center">
            <Image
              src="/images/upgrade.png"
              alt="Upgrade illustration"
              width={140}
              height={140}
              className="object-contain w-32 h-32"
            />
          </div>
          <div className="relative z-10">
            <p className="text-base text-gray-700 font-medium font-roboto-flex">
              Upgrade to our new version Telehealth-Plus
            </p>
          </div>
          <button
            className="relative z-10 w-full text-white py-3 rounded-lg text-base font-semibold hover:opacity-90 transition font-roboto-flex"
            style={{ backgroundColor: "#6685FF" }}
          >
            Upgrade
          </button>
        </div>
        <div className="px-6 font-roboto-flex">
          <NavItem icon={LogOut} label="Log Out" />
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  active,
}: {
  icon: any;
  label: string;
  href?: string;
  active?: boolean;
}) {
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }
  };

  const className = `flex items-center gap-4 px-6 py-4 transition relative rounded-lg ${
    active
      ? "bg-[#E1E6F8] text-[#6685FF]"
      : "text-[#00000069] hover:text-[#6685FF]"
  }`;

  if (label === "Log Out") {
    return (
      <button onClick={handleLogout} className={className}>
        <Icon size={28} />
        <span className="font-medium font-roboto-flex text-lg">{label}</span>
      </button>
    );
  }

  return (
    <Link href={href || "#"} className={className}>
      {/* LEFT HIGHLIGHT BAR FOR ACTIVE TAB */}
      {active && (
        <div className="absolute left-0 top-0 h-full w-2 bg-[#526ACC] rounded-r-full" />
      )}

      <Icon size={28} />
      <span className="font-medium font-roboto-flex text-lg">{label}</span>
    </Link>
  );
}
