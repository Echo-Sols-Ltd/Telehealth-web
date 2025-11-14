"use client";

import { Facebook, Linkedin, Twitter, Mail } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Features: [
    { label: "Health tracking", href: "#" },
    { label: "AI-powered insights", href: "#" },
    { label: "Online consultations", href: "#" },
    { label: "IoT integrations", href: "#" },
    { label: "Inclusive Access", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
  Resources: [
    { label: "Online website", href: "#" },
    { label: "Watch a Demo", href: "#" },
    { label: "Browse", href: "#" },
    { label: "Product Glossary", href: "#" },
    { label: "Help Center", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Customers", href: "#" },
    { label: "Community Forum", href: "#" },
    { label: "Terms and privacy", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer
      id="contacts"
      className="w-full bg-[#6685FF] text-white pt-16 pb-8 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="animate-fade-in">
            <h3 className="font-roboto font-extrabold text-2xl mb-4">
              Telehealth
            </h3>
            <p className="font-roboto font-normal text-lg leading-relaxed mb-6 opacity-90">
              Take charge of your health with Telehealth Anytime, anywhere, care
              is always within your reach.
            </p>
            {/* Social Links with hover animation */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Footer Link Columns */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <div
              key={category}
              className={`animate-fade-in transition-all duration-500 font-roboto font-semibold`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <h4 className="font-roboto font-semibold text-lg mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-roboto font-normal text-lg opacity-90 hover:opacity-100 hover:underline transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link
              href="#"
              className="font-roboto text-xl hover:opacity-80 transition-opacity font-semibold"
            >
              www.telehealth.com
            </Link>
            <p className="font-roboto font-normal text-xl opacity-75 text-center">
              © 2025 Telehealth. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </footer>
  );
}
