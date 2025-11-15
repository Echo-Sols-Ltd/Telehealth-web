"use client";

import { MoreVertical } from "lucide-react";

const appointments = [
  {
    date: "24",
    month: "Sep",
    doctor: "Dr. KAYIRANGA James",
    specialty: "Cardiologist",
    time: "09:30 am",
  },
  {
    date: "24",
    month: "Sep",
    doctor: "Dr. KAYIRANGA James",
    specialty: "Cardiologist",
    time: "09:30 am",
  },
  {
    date: "24",
    month: "Sep",
    doctor: "Dr. KAYIRANGA James",
    specialty: "Cardiologist",
    time: "09:30 am",
  },
];

export function MyAppointments() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-black">
          My Appointments
        </h3>
        <a
          href="#"
          className="text-xs sm:text-sm hover:underline"
          style={{ color: "#8FA6FF" }}
        >
          View all
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {appointments.map((apt, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-4 sm:p-6 flex flex-col text-white ${
              idx === 0 ? "" : idx === 1 ? "bg-[#061242]" : "bg-[#344482]"
            }`}
            style={idx === 0 ? { backgroundColor: "#6685FF" } : undefined}
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-3xl sm:text-4xl font-bold">{apt.date}</p>
                <p
                  className={`text-sm sm:text-base ${idx === 0 ? "text-white/80" : "text-gray-300"}`}
                >
                  {apt.month}
                </p>
              </div>
              <button className="text-white/70 hover:text-white">
                <MoreVertical size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">{apt.doctor}</p>
              <p className="text-xs sm:text-sm text-white/70">
                {apt.specialty}
              </p>
            </div>
            <p className="text-xs sm:text-sm mt-3 sm:mt-4 text-white/70">
              {apt.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
