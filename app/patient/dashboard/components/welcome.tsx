"use client";

import { useEffect, useState } from "react";

export function WelcomeBanner() {
  const [userName, setUserName] = useState("User");
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUserStr = localStorage.getItem("currentUser");
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser.fullName) {
            setUserName(currentUser.fullName);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Icons revolving around doctor
  const icons = [
    { src: "/images/pill.png", angle: 0 },
    { src: "/images/pill1.png", angle: 45 },
    { src: "/images/syringe.jpg", angle: 90 },
    { src: "/images/bandage.png", angle: 135 },
    { src: "/images/heart.png", angle: 180 },
    { src: "/images/bottle.jpg", angle: 225 },
  ];

  return (
    <div
      className="rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden"
      style={{ backgroundColor: "#9EB1FE" }}
    >
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-roboto mb-2">
          Hello, {userName}
        </h2>
        <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base font-roboto font-normal">
          Take charge of your health with TeleHealth Anytime, anywhere, care is
          always within your reach.
        </p>
        <button
          className="text-white font-semibold px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg hover:opacity-90 transition"
          style={{ backgroundColor: "#6685FF" }}
        >
          Take a medical test
        </button>
      </div>

      {/* Doctor illustration with revolving icons */}
      <div className="absolute right-4 sm:right-8 top-0 bottom-0 w-40 sm:w-60 lg:w-80 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Revolving icons */}
          {icons.map(({ src, angle }, index) => {
            const currentAngle = (angle + rotation) * (Math.PI / 180);
            const radius = 80; // Adjusted for banner size
            const x = Math.cos(currentAngle) * radius;
            const y = Math.sin(currentAngle) * radius;

            return (
              <div
                key={index}
                className="absolute bg-white rounded-full p-2 shadow-lg"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  transition: "transform 0.03s linear",
                }}
              >
                <img
                  src={src}
                  alt={`icon-${index}`}
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              </div>
            );
          })}

          {/* Doctor image */}
          <div className="relative z-10 flex items-center justify-center">
            <img
              src="/images/doctor.png"
              alt="Doctor"
              className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 object-contain"
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
