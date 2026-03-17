"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6 animate-fadeInUp [animation-delay:0.1s]">
          <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            cursor
          </span>
          <span className="bg-gradient-to-br from-violet-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
            X
          </span>
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

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white/70 border border-white/10 hover:border-white/20 hover:bg-white/5 hover:text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Star on GitHub
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 mt-16 animate-fadeInUp [animation-delay:0.5s]">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              16+
            </div>
            <div className="text-xs sm:text-sm text-white/30 mt-1">
              Cursors
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              7
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
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent font-bold tracking-[0.2em]">
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
