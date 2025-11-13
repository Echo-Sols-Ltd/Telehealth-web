"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const menuItems = [
    "Home",
    "Features",
    "How it works",
    "Accessibility",
    "Contacts",
  ];

  const getSectionId = (label: string) =>
    label.toLowerCase().replace(/\s+/g, "-");

  const handleMenuItemClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    event.preventDefault();

    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white overflow-x-hidden">
      <nav className="relative top-0 left-0 right-0 z-50 bg-white/80">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-20 py-6">
          <div className="flex items-center justify-between">
            <div
              className={`transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}
            >
              <h1 className="text-3xl lg:text-[24px] font-bold leading-none">
                <span className="text-[#080f2b]">Tele</span>
                <span className="text-[#6685FF]">Health</span>
              </h1>
            </div>

            <div className="hidden lg:flex items-center gap-12 xl:gap-[72px]">
              {menuItems.map((item, index) => {
                const sectionId = getSectionId(item);

                return (
                  <a
                    key={item}
                    href={`#${sectionId}`}
                    onClick={(event) => handleMenuItemClick(event, sectionId)}
                    className={`text-xl font-normal font-roboto text-black hover:text-[#6685FF] transition-all duration-300 transform hover:scale-105 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
                    style={{ transitionDelay: `${100 + index * 50}ms` }}
                  >
                    {item}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <button
                className={`hidden sm:block px-8 lg:px-12 py-4 lg:py-5 text-xl lg:text-2xl font-semibold font-roboto-flex text-[#061242] bg-white border-2 border-gray-200 rounded-4xl hover:border-[#6685FF] hover:text-[#6685FF] transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
                style={{ transitionDelay: "400ms" }}
              >
                Login
              </button>
              <button
                className={`hidden lg:block px-6 sm:px-8 lg:px-12 py-4 lg:py-5 text-xl lg:text-2xl font-semibold font-roboto-flex text-white bg-[#6685FF] rounded-4xl hover:bg-[#5574ee] transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
                style={{ transitionDelay: "500ms" }}
              >
                Sign Up
              </button>
            </div>

            <button
              className="lg:hidden p-2 text-[#6685FF] transition-transform duration-300"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 6l12 12M18 6l-12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden mt-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-xl">
              <div className="flex flex-col gap-4">
                {menuItems.map((item) => {
                  const sectionId = getSectionId(item);

                  return (
                    <a
                      key={item}
                      href={`#${sectionId}`}
                      onClick={(event) => handleMenuItemClick(event, sectionId)}
                      className="text-lg font-medium text-[#080f2b] transition-colors duration-200 hover:text-[#6685FF]"
                    >
                      {item}
                    </a>
                  );
                })}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full rounded-2xl border-2 border-gray-200 px-6 py-3 text-lg font-semibold text-[#061242] transition-all duration-200 hover:border-[#6685FF] hover:text-[#6685FF]"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full rounded-2xl bg-[#6685FF] px-6 py-3 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#5574ee]"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2
            className={`text-2xl sm:text-4xl lg:text-[60px] font-bold font-roboto leading-tight lg:leading-[114px] mb-6 sm:mb-8 lg:mb-10 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="text-black">Manage Your </span>
            <span className="text-[#9EB1FE] block sm:inline animate-pulse">
              Chronic Conditions
            </span>
            <span className="text-black block mt-2 sm:mt-0">Easily.</span>
          </h2>

          <p
            className={`text-lg sm:text-xl lg:text-[28px] font-light font-roboto-flex leading-relaxed lg:leading-[44px] text-black max-w-[1100px] mx-auto mb-10 sm:mb-12 lg:mb-16 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
            style={{ transitionDelay: "400ms" }}
          >
            Take charge of your health with TeleHealth Anytime, anywhere,{" "}
            <br className="hidden sm:block" />
            care is always within your reach
          </p>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
            style={{ transitionDelay: "600ms" }}
          >
            <button className="w-full sm:w-auto min-w-[250px] sm:min-w-[200px] h-[90px] bg-[#6685FF] text-white text-xl font-semibold font-roboto-flex rounded-[40px] hover:bg-[#5574ee] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 group ">
              <span className="inline-block group-hover:animate-bounce">
                Get Started
              </span>
            </button>
            <button className="w-full sm:w-auto min-w-[250px] sm:min-w-[200px] h-[80px] sm:h-[90px] bg-white text-black text-2xl font-semibold font-roboto-flex rounded-[40px] border border-black hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95">
              Learn More
            </button>
          </div>
        </div>

        <div className="absolute top-1/4 left-10 w-16 h-16 bg-[#6685FF]/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-[#9EB1FE]/10 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-[#6685FF]/10 rounded-full blur-xl animate-float-slow"></div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-30px) scale(1.15);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};
export default HeroSection;
