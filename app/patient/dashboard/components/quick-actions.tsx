"use client";

import {
  Stethoscope,
  Repeat,
  Activity,
  Lightbulb,
  AmbulanceIcon,
} from "lucide-react";

const actions = [
  { icon: Stethoscope, label: "Log health data", color: "#6685FF" },
  { icon: Repeat, label: "Sync Devices", color: "#656C8A" },
  {
    icon: Activity,
    label: "Consult a Doctor",
    color: "#687C70",
    fill: "#687C70",
  },
  { icon: Lightbulb, label: "Personalized Advice", color: "#75A6F7" },
  {
    icon: AmbulanceIcon,
    label: "Emergency Contact",
    color: "#90A0DF",
    fill: "#90A0DF",
  },
];

export function QuickActions() {
  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-[#000000] mb-4 sm:mb-6 font-roboto">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition flex flex-col items-center gap-3 sm:gap-4 min-h-32 sm:min-h-40"
          >
            <action.icon
              size={28}
              className="sm:w-9 sm:h-9"
              style={{ color: action.color }}
            />
            <span className="text-lg sm:text-sm font-medium text-gray-700 text-center font-roboto">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
