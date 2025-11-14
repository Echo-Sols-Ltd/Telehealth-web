"use client";

import React, { useState, useEffect } from "react";

export default function LoadingScreenContent() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const icons = [
    { src: "/images/pill.png", angle: 0 },
    { src: "/images/pill1.png", angle: 45 },
    { src: "/images/syringe.jpg", angle: 90 },
    { src: "/images/bandage.png", angle: 135 },
    { src: "/images/heart.png", angle: 180 },
    { src: "/images/bottle.jpg", angle: 225 },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold font-roboto-flex">
          <span className="text-white">Tele</span>
          <span className="text-[#2C37E1]">Health</span>
        </h1>
      </div>

      <div className="relative w-[400px] h-[400px] flex items-center justify-center">
        {/* Wavy background circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="320"
            height="380"
            viewBox="0 0 320 380"
            fill="none"
            className="absolute"
          >
            <path
              d="M160 20C100 20 50 50 30 100C10 150 20 200 30 250C40 300 70 350 120 370C170 390 220 380 260 350C300 320 310 270 310 220C310 170 290 120 250 80C210 40 180 20 160 20Z"
              fill="#A8B8FF"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Revolving icons */}
        {icons.map(({ src, angle }, index) => {
          const currentAngle = (angle + rotation) * (Math.PI / 180);
          const radius = 140;
          const x = Math.cos(currentAngle) * radius;
          const y = Math.sin(currentAngle) * radius;

          return (
            <div
              key={index}
              className="absolute bg-white rounded-full p-3 shadow-lg"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: "transform 0.03s linear",
              }}
            >
              <img
                src={src}
                alt={`icon-${index}`}
                className="w-8 h-8 object-contain"
                onError={(e) =>
                  ((e.target as HTMLImageElement).style.display = "none")
                }
              />
            </div>
          );
        })}

        {/* Doctor illustration */}
        <div className="relative z-10 flex flex-col items-center">
          <img
            src="/images/doctor.png"
            alt="Doctor"
            className="w-64 h-64 object-contain"
            onError={(e) =>
              ((e.target as HTMLImageElement).style.display = "none")
            }
          />
        </div>
      </div>
    </div>
  );
}
