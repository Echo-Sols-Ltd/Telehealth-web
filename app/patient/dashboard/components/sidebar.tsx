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

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-96 bg-white flex-col h-screen fixed left-0 top-0 z-40 lg:relative lg:z-auto">
      <div className="p-6">
        <h1 className="text-3xl font-bold font-roboto-flex">
          <span className="text-[#020d36]">Tele</span>
          <span style={{ color: "#6685FF" }}>Health</span>
        </h1>
      </div>

      <nav className="flex-1 px-6 space-y-3 flex flex-col pt-16">
        <NavItem icon={Home} label="Home" active />
        <NavItem icon={Stethoscope} label="Health Metrics" />
        <NavItem icon={Activity} label="AI Consultation" />
        <NavItem icon={Calendar} label="Appointments" />
        <NavItem icon={Settings} label="Settings" />
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
  active,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href="#"
      className={`flex items-center gap-4 px-6 py-4 transition relative rounded-lg ${
        active
          ? "bg-[#E1E6F8] text-[#6685FF]"
          : "text-[#00000069] hover:[#00000069]"
      }`}
    >
      {/* LEFT HIGHLIGHT BAR FOR ACTIVE TAB */}
      {active && (
        <div className="absolute left-0 top-0 h-full w-2 bg-[#526ACC] rounded-r-full" />
      )}

      <Icon size={28} />
      <span className="font-medium font-roboto-flex text-lg">{label}</span>
    </Link>
  );
}
