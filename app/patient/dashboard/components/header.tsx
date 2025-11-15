"use client";

import { Search, Bell } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <header className="bg-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
      <div className="flex-1 max-w-2xl min-w-0">
        <div className="relative">
          <Search
            className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5"
            size={18}
          />
          <input
            type="text"
            placeholder="Search.."
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-blue-50 rounded-full text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <button className="text-gray-400 hover:text-gray-600 transition">
          <Bell size={20} className="sm:w-6 sm:h-6 " color="#061242" fill="#061242"/>
        </button>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/profile.png"
            alt="User profile"
            width={40}
            height={40}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
