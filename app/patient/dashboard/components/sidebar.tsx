"use client";

import {
  Home,
  Stethoscope,
  Activity,
  Watch,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          w-96 bg-white flex-col h-screen
          left-0 top-0 z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex overflow-hidden
        `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4 shrink-0">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="p-6 shrink-0">
          <h1 className="text-3xl font-bold font-roboto-flex">
            <span className="text-[#020d36]">Tele</span>
            <span style={{ color: "#6685FF" }}>Health</span>
          </h1>
        </div>

        {/* Navigation - flex-1 to take available space, scrollable if content overflows */}
        <nav className="flex-1 px-6 space-y-3 flex flex-col pt-16 overflow-y-auto overflow-x-hidden min-h-0">
          <NavItem
            icon={Home}
            label="Home"
            href="/patient/dashboard"
            active={
              pathname === "/patient/dashboard" ||
              pathname === "/patient/dashboard/Home"
            }
            onClick={onClose}
          />
          <NavItem
            icon={Stethoscope}
            label="Health Metrics"
            href="/patient/dashboard/health-metrics"
            active={pathname === "/patient/dashboard/health-metrics"}
            onClick={onClose}
          />
          <NavItem
            icon={Activity}
            label="AI Consultation"
            href="/patient/dashboard/ai-consultation"
            active={pathname === "/patient/dashboard/ai-consultation"}
            onClick={onClose}
          />
          <NavItem
            icon={Watch}
            label="Appointments"
            href="/patient/dashboard/appointments"
            active={pathname === "/patient/dashboard/appointments"}
            onClick={onClose}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            href="/patient/dashboard/settings"
            active={pathname === "/patient/dashboard/settings"}
            onClick={onClose}
          />
        </nav>

        {/* Upgrade and Logout - always at bottom, shrink-0 to prevent shrinking */}
        <div className="p-4 flex flex-col shrink-0 border-t border-gray-100">
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
              className="relative z-10 w-full text-white py-3 rounded-lg text-base font-semibold hover:opacity-90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-roboto-flex"
              style={{ backgroundColor: "#6685FF" }}
            >
              Upgrade
            </button>
          </div>
          <div className="px-6 font-roboto-flex">
            <NavItem icon={LogOut} label="Log Out" onClick={onClose} />
          </div>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }
  };

  const className = `flex items-center gap-4 px-6 py-4 transition-all duration-300 relative rounded-lg hover:scale-[1.02] active:scale-[0.98] ${
    active
      ? "bg-[#E1E6F8] text-[#6685FF]"
      : "text-[#00000069] hover:text-[#6685FF] hover:bg-gray-50"
  }`;

  if (label === "Log Out") {
    return (
      <button
        onClick={() => {
          handleLogout();
          onClick?.();
        }}
        className={className}
      >
        <Icon size={28} />
        <span className="font-medium font-roboto-flex text-lg">{label}</span>
      </button>
    );
  }

  return (
    <Link href={href || "#"} onClick={onClick} className={className}>
      {/* LEFT HIGHLIGHT BAR FOR ACTIVE TAB */}
      {active && (
        <div className="absolute left-0 top-0 h-full w-2 bg-[#526ACC] rounded-r-full" />
      )}

      <Icon size={28} />
      <span className="font-medium font-roboto-flex text-lg">{label}</span>
    </Link>
  );
}
