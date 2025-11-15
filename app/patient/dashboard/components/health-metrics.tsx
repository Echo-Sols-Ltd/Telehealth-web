"use client";

import { Activity, Syringe, Droplet, Thermometer } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "1", value: 30 },
  { name: "2", value: 50 },
  { name: "3", value: 70 },
];

const metrics = [
  {
    icon: Activity,
    label: "Heart rate",
    value: "97 bpm",
    color: "#2C37E1",
    chartColor: "#2C37E1",
  },
  {
    icon: Syringe,
    label: "Glucose level",
    value: "110.3 mg/dL",
    color: "#34A853",
    chartColor: "#34A853",
  },
  {
    icon: Droplet,
    label: "Blood pressure",
    value: "112/52 mmHg",
    chartColor: "#FF0000",
  },
  {
    icon: Thermometer,
    label: "Temperature",
    value: "35.2°C",
    chartColor: "#000000CF",
  },
];

export function HealthMetrics() {
  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6 font-roboto">
        Health metrics overview
      </h3>
      <div className="space-y-3 sm:space-y-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-md flex items-center justify-between gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="p-2 sm:p-3 bg-gray-100 rounded-lg text-gray-500 shrink-0">
                <metric.icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 font-roboto">
                  {metric.label}
                </p>
                <p className="text-base sm:text-lg font-semibold text-gray-900 font-roboto">
                  {metric.value}
                </p>
              </div>
            </div>
            <div className="w-16 sm:w-24 h-12 sm:h-16 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Bar
                    dataKey="value"
                    fill={metric.chartColor}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
