"use client";
import Image from "next/image";
import React from "react";
import { Stethoscope, MapPinCheckInside } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white overflow-hidden relative">
      {/* Navigation */}
      <nav className="container mx-auto px-8 py-8 flex items-center justify-between">
        <div className="text-4xl font-bold text-[#0c1e66]">
          Tele<span className="text-[#6685FF]">Health</span>
        </div>
        <div className="flex gap-12 text-lg font-medium">
          <a
            href="#home"
            className="text-[#000000] hover:text-[#6685FF] transition font-roboto"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-[#000000] hover:text-[#6685FF] transition font-roboto"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-[#000000] hover:text-[#6685FF] transition font-roboto"
          >
            How it works
          </a>
          <a
            href="#accessibility"
            className="text-[#000000] hover:text-[#6685FF] transition font-roboto"
          >
            Accessibility
          </a>
          <a
            href="#contacts"
            className=" text-[#000000] hover:text-[#6685FF] transition font-roboto"
          >
            Contacts
          </a>
        </div>
      </nav>

      {/* Main Hero Content */}
      <div className="container mx-auto px-8 mt-20 relative">
        <div className="grid grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <h5 className="text-[50px] font-bold leading-[74px] mb-6 text-[#000000] font-roboto">
              Manage Your Chronic Conditions Easily.
            </h5>
            <p className="text-[28px] font-light leading-[44px] text-[#000000] mb-12">
              Take charge of your health with TeleHealth Anytime, anywhere, care
              is always within your reach.
            </p>
            <div className="flex gap-6">
              <button className="px-20 py-6 bg-white border border-[#D1DAFF] rounded-[20px] text-[#6685FF] font-semibold text-lg hover:bg-[#6685FF] hover:text-white transition shadow-sm">
                Get Started
              </button>
              <button className="px-20 py-6 bg-[#6685FF] rounded-[20px] text-white font-semibold text-lg hover:bg-[#5575EE] transition shadow-lg">
                Learn more
              </button>
            </div>
          </div>

          {/* Right Content - Phone Illustration */}
          <div className="relative h-[700px]">
            {/* Background Elements */}
            <Image
              src="/images/ellipsebig.png"
              alt="Ellipse"
              width={512}
              height={20}
              className="absolute top-[12px] left-[200px] opacity-100 bg-[#C4F0EC] rounded-full z-10"
            />
            <Image
              src="/images/ellipse1.png"
              alt="Ellipse2"
              width={380}
              height={350}
              className="absolute top-[160px] left-[120px] opacity-100 rounded-full bg-[#C4F0EC] z-20"
            />

            <Image
              src="/images/mobile.png"
              alt="mobile"
              width={635}
              height={544}
              className="absolute top-[80px] left-[180px] z-30"
            />
            <Image
              src="/images/ellipse2.png"
              alt="Ellipse"
              width={1750}
              height={11120}
              className="absolute top-[520px] left-[200px] z-0"
            />

            {/* Floating Icons */}
            <div className="absolute top-5 left-80 w-[70px] h-[70px] opacity-100 rotate-0 bg-[#F5D88F] z-10 rounded-full flex items-center justify-center animate-orbit">
              <Stethoscope className="text-white w-[30px] h-[30px]" />
            </div>

            <div className="absolute top-[360px] left-44 w-[70px] h-[70px] opacity-100 rotate-0 bg-[#F5D88F] z-30 rounded-full flex items-center justify-center animate-orbit-delayed">
              <MapPinCheckInside className="text-white w-[30px] h-[30px]" />
            </div>
          </div>

          {/* Health Card */}
        </div>

        {/* Upcoming Consultation Card */}

        {/* Doctor Card */}

        {/* Decorative Plus Signs */}
        <div className="absolute top-20 left-8 text-gray-300 text-4xl font-light animate-spin-slow">
          +
        </div>
        <div className="absolute top-40 right-1/3 text-gray-300 text-4xl font-light animate-spin-slow">
          +
        </div>
        <div className="absolute bottom-40 left-1/4 text-gray-300 text-4xl font-light animate-spin-slow">
          +
        </div>
        <div className="absolute top-32 right-48 text-gray-300 text-4xl font-light animate-spin-slow">
          +
        </div>

        {/* Decorative Dots */}
        <div className="absolute top-32 left-20 w-4 h-4 bg-[#C4F0EC] rounded-full animate-pulse"></div>
        <div className="absolute top-64 right-24 w-3 h-3 bg-[#B8D4E8] rounded-full   animate-pulse"></div>
        <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-[#E8F4F2] rounded-full  animate-pulse"></div>
        <div className="absolute top-48 right-1/4 w-3 h-3 bg-[#D1E8E2] rounded-full  animate-pulse"></div>
        <div className="absolute bottom-64 right-12 w-4 h-4 bg-[#C4F0EC] rounded-full animate-pulse "></div>
        <div className="absolute top-96 left-12 w-3 h-3 bg-[#B8D4E8] rounded-full  animate-pulse"></div>
      </div>

      <div className="absolute opacity-10 bg-white">
        <div className="bg-[#EFF1FA] w-[1732px] h-[208px] top-[1640px]"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(15px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(15px) rotate(-360deg);
          }
        }
        @keyframes orbit-delayed {
          0% {
            transform: rotate(0deg) translateX(20px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(20px) rotate(-360deg);
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
        .animate-orbit {
          animation: orbit 8s linear infinite;
        }
        .animate-orbit-delayed {
          animation: orbit-delayed 10s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
