"use client";
export default function WaveDivider() {
  return (
    <div className="relative w-full h-32 overflow-x-hidden bg-white">
      <svg
        viewBox="0 0 1440 200"
        className="absolute top-0 left-0 h-full w-[200%]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8ECFF" />
            <stop offset="100%" stopColor="#D4DBFF" />
          </linearGradient>
        </defs>
        <g className="wave-scroll">
          <g className="wave-copy">
            <path
              d="M 0,100 Q 180,50 360,100 T 720,100 T 1080,100 T 1440,100 L 1440,200 L 0,200 Z"
              fill="url(#waveGradient)"
              opacity="0.8"
            />
            <path
              d="M 0,120 Q 180,70 360,120 T 720,120 T 1080,120 T 1440,120 L 1440,200 L 0,200 Z"
              fill="#C1C9EB"
              opacity="0.6"
            />
            <path
              d="M 0,140 Q 180,90 360,140 T 720,140 T 1080,140 T 1440,140 L 1440,200 L 0,200 Z"
              fill="#B8C2E0"
              opacity="0.4"
            />
          </g>
          <g className="wave-copy" transform="translate(1440 0)">
            <path
              d="M 0,100 Q 180,50 360,100 T 720,100 T 1080,100 T 1440,100 L 1440,200 L 0,200 Z"
              fill="url(#waveGradient)"
              opacity="0.8"
            />
            <path
              d="M 0,120 Q 180,70 360,120 T 720,120 T 1080,120 T 1440,120 L 1440,200 L 0,200 Z"
              fill="#C1C9EB"
              opacity="0.6"
            />
            <path
              d="M 0,140 Q 180,90 360,140 T 720,140 T 1080,140 T 1440,140 L 1440,200 L 0,200 Z"
              fill="#B8C2E0"
              opacity="0.4"
            />
          </g>
        </g>
      </svg>

      <style jsx>{`
        .wave-scroll {
          animation: wave-slide 12s linear infinite;
        }

        @keyframes wave-slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-1440px);
          }
        }
      `}</style>
    </div>
  );
}
