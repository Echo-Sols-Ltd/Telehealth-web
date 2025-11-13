import type { LucideIcon } from "lucide-react";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  position: string;
}

interface FeatureCardProps {
  feature: Feature;
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div
      className="rounded-[20px] p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
      style={{
        background: "rgba(255, 255, 255, 0.47)",
        border: "0.4px solid #6685FF",
      }}
    >
      {/* Icon Circle */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110"
        style={{
          background: "rgba(102, 133, 255, 0.61)",
        }}
      >
        <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3
        className="mb-3 text-black"
        style={{
          fontFamily: "Roboto",
          fontWeight: 400,
          fontSize: "24px",
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        className="text-black"
        style={{
          fontFamily: "Roboto",
          fontWeight: 300,
          fontSize: "17px",
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      >
        {feature.description}
      </p>
    </div>
  );
}
