"use client";

import { useState } from "react";
import { CursorData } from "../data/cursors";

interface CursorCardProps {
  cursor: CursorData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  index: number;
}

const colorGradients: Record<string, string> = {
  Green: "from-emerald-400 to-green-500",
  White: "from-slate-300 to-white",
  Red: "from-red-400 to-rose-500",
  Yellow: "from-amber-400 to-yellow-500",
  Purple: "from-violet-400 to-purple-500",
  Blue: "from-indigo-400 to-blue-500",
  Pink: "from-pink-400 to-rose-500",
  Black: "from-zinc-400 to-zinc-600",
};

const colorBgClasses: Record<string, string> = {
  Green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  White: "bg-white/10 text-slate-100 border-white/20",
  Red: "bg-red-500/10 text-red-400 border-red-500/20",
  Yellow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Purple: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Blue: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Black: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function CursorCard({
  cursor,
  isFavorite,
  onToggleFavorite,
  index,
}: CursorCardProps) {
  const [copied, setCopied] = useState(false);
  const gradientClass = colorGradients[cursor.color] || "from-gray-400 to-gray-500";
  const badgeClass = colorBgClasses[cursor.color] || "bg-gray-500/10 text-gray-400 border-gray-500/20";

  const copyAssetId = () => {
    navigator.clipboard.writeText(cursor.imageId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="group relative animate-fadeInUp"
      style={{ animationDelay: `${Math.min(index, 11) * 0.03}s` }}
    >
      <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-white/[0.12] hover:bg-white/[0.05] transition-[transform,border-color,background-color] duration-300 ease-out will-change-transform hover:-translate-y-1">
        {/* Gradient top accent */}
          <div
            className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          />

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 border border-white/10 hover:bg-black/70 transition-colors duration-200"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            className={`w-4 h-4 transition-colors duration-200 ${
              isFavorite
                ? "text-pink-400 fill-pink-400"
                : "text-white/40 hover:text-pink-400"
            }`}
            fill={isFavorite ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Cursor Preview */}
        <div className="relative aspect-square flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 group-hover:scale-110 transition-transform duration-300 ease-out will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cursor.image}
              alt={cursor.name}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Info */}
        <div className="p-4 pt-0 space-y-3">
          <div>
            <h3 className="font-semibold text-white/90 text-sm group-hover:text-white transition-colors duration-200">
              {cursor.name}
            </h3>
            <p className="text-xs text-white/30 mt-0.5">by {cursor.creator}</p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${badgeClass}`}
            >
              {cursor.category}
            </span>

            <button
              onClick={copyAssetId}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                copied
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-violet-500/15 text-violet-300 border border-violet-500/25 hover:bg-violet-500/25 hover:text-violet-200"
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy ID
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
