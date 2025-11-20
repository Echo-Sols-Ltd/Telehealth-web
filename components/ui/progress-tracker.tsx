"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type ProgressSegment = {
  label?: string;
  value: number;
  color: string;
};

interface ProgressTrackerProps {
  segments: ProgressSegment[];
  size?: number;
  thickness?: number;
  backgroundColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressTracker({
  segments,
  size = 160,
  thickness = 18,
  backgroundColor = "#FFFFFF",
  className,
  children,
}: ProgressTrackerProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const positiveSegments = segments.filter((segment) => segment.value > 0);
  const totalValue =
    positiveSegments.reduce((sum, segment) => sum + segment.value, 0) || 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  let accumulated = 0;
  const gradientStops =
    positiveSegments.length > 0
      ? positiveSegments
          .map((segment) => {
            const start = (accumulated / totalValue) * 100;
            accumulated += segment.value;
            const end = (accumulated / totalValue) * 100;
            return `${segment.color} ${start}% ${end}%`;
          })
          .join(", ")
      : "#E5E7EB 0% 100%";

  const insetAmount = Math.min(thickness, size / 2 - 1);

  return (
    <div
      className={cn("relative flex items-center justify-center animate-chart-entrance", className)}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full transition-all duration-1500 ease-out"
        style={{
          background: `conic-gradient(${gradientStops})`,
          transform: `rotate(${animatedValue * 360}deg)`,
          opacity: animatedValue,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute rounded-full transition-opacity duration-1000 ease-out"
        style={{
          top: insetAmount,
          right: insetAmount,
          bottom: insetAmount,
          left: insetAmount,
          backgroundColor,
          opacity: animatedValue,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
}

