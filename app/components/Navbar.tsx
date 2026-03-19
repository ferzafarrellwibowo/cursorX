"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import EDPICalculator from "./EDPICalculator";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

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
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-white/70 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] transition-all duration-300"
              >
                <span className="hidden sm:inline">eDPI Calculator</span>
                <span className="sm:hidden">eDPI</span>
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
    </>
  );
}
