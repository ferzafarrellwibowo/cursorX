"use client";

import { CursorData } from "../data/cursors";
import SplitText from "./SplitText";

interface HeroProps {
  cursors?: CursorData[];
}

export default function Hero({ cursors = [] }: HeroProps) {
  // Hitung jumlah unik category yang ada di dalam cursors
  const activeCategories = new Set(cursors.map(c => c.category)).size;
  const cursorsCount = cursors.length;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/15 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse [animation-delay:2s]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-violet-400/60 rounded-full animate-float" />
        <div className="absolute top-[60%] left-[80%] w-2 h-2 bg-fuchsia-400/40 rounded-full animate-float [animation-delay:1.5s]" />
        <div className="absolute top-[40%] left-[70%] w-1 h-1 bg-cyan-400/50 rounded-full animate-float [animation-delay:3s]" />
        <div className="absolute top-[75%] left-[25%] w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-float [animation-delay:2s]" />
        <div className="absolute top-[30%] left-[50%] w-1 h-1 bg-pink-400/60 rounded-full animate-float [animation-delay:4s]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-fadeInUp">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-white/60">
            Open Source Roblox Cursor Library
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6 flex flex-wrap justify-center items-end animate-fadeInUp [animation-delay:0.1s]">
          <SplitText
            as="span"
            text="cursor"
            className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent pb-3"
            splitBy="chars"
            stagger={0.04}
            duration={0.6}
          />
          <SplitText
            as="span"
            text="X"
            className="bg-gradient-to-br from-violet-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent pb-3"
            splitBy="chars"
            stagger={0.05}
            duration={0.7}
          />
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/40 font-light mb-4 animate-fadeInUp [animation-delay:0.2s]">
          Roblox Cursor Library
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base text-white/30 max-w-xl mx-auto mb-10 leading-relaxed animate-fadeInUp [animation-delay:0.3s]">
          Discover and collect custom Roblox cursors. Browse our curated
          collection, preview in real-time, and copy asset IDs instantly for your
          Roblox games.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp [animation-delay:0.4s]">
          <a
            href="#gallery"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/25 hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              Browse Cursors
              <svg
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </span>
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 mt-16 animate-fadeInUp [animation-delay:0.5s]">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {cursorsCount}
            </div>
            <div className="text-xs sm:text-sm text-white/30 mt-1">
              Cursors
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              {activeCategories}
            </div>
            <div className="text-xs sm:text-sm text-white/30 mt-1">
              Categories
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Free
            </div>
            <div className="text-xs sm:text-sm text-white/30 mt-1">
              Forever
            </div>
          </div>
        </div>

        {/* Made By Credit */}
        <div className="mt-12 animate-fadeInUp [animation-delay:0.6s]">
          <p className="text-xs tracking-[0.3em] uppercase text-white/20">
            Made by{" "}
            <span className="text-white font-bold tracking-[0.2em] drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]">
              UXTITLED
            </span>
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
}
