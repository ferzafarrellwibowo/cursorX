"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import EDPICalculator from "./EDPICalculator";
import FeedbackModal from "./FeedbackModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-purple-500/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                cursor
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  X
                </span>
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="group relative flex items-center gap-2 px-1 py-2 text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors duration-300"
              >
                <span className="hidden sm:inline">eDPI Calculator</span>
                <span className="sm:hidden">eDPI</span>
                <span className="absolute bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-transform duration-300 group-hover:scale-x-100" />
              </button>

              {/* Feedback Button */}
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="group"
                title="Send Feedback"
              >
                <Image
                  src="/SUPPic.png"
                  alt="Feedback"
                  width={24}
                  height={24}
                  className="w-6 h-6 brightness-0 invert opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* eDPI Calculator Modal */}
      <EDPICalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}
