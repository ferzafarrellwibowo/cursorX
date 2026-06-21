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
 green: "from-emerald-400 to-green-500",
 white: "from-slate-300 to-white",
 red: "from-red-400 to-rose-500",
 yellow: "from-amber-400 to-yellow-500",
 purple: "from-violet-400 to-purple-500",
 blue: "from-indigo-400 to-blue-500",
 pink: "from-pink-400 to-rose-500",
 black: "from-zinc-400 to-zinc-600",
 orange: "from-orange-400 to-orange-500",
 brown: "from-amber-700 to-amber-900"
};

const colorBgClasses: Record<string, string> = {
 green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
 white: "bg-zinc-800 text-slate-100 border-zinc-700",
 red: "bg-red-500/10 text-red-400 border-red-500/20",
 yellow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
 purple: "bg-violet-500/10 text-violet-400 border-violet-500/20",
 blue: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
 pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
 black: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
 orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
 brown: "bg-amber-500/10 text-amber-700 border-amber-700/20"
};

const colorHoverBorderClasses: Record<string, string> = {
 green: "hover:border-emerald-500/50",
 white: "hover:border-slate-300/50",
 red: "hover:border-red-500/50",
 yellow: "hover:border-amber-500/50",
 purple: "hover:border-violet-500/50",
 blue: "hover:border-indigo-500/50",
 pink: "hover:border-pink-500/50",
 black: "hover:border-zinc-500/50",
 orange: "hover:border-orange-500/50",
 brown: "hover:border-amber-700/50"
};


export default function CursorCard({
 cursor,
 isFavorite,
 onToggleFavorite,
 index,
}: CursorCardProps) {
 const [copied, setCopied] = useState(false);
 
 // Karena warna bisa kombinasi (cth: 'green purple'), kita ambil kata pertama sebagai warna utama untuk UI
 const primaryColor = cursor.color.split(' ')[0] || '';
 const gradientClass = colorGradients[primaryColor] || "from-gray-400 to-gray-500";
 const badgeClass = colorBgClasses[primaryColor] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
 const hoverBorderClass = colorHoverBorderClasses[primaryColor] || "hover:border-white/[0.12]";

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
 <div className={`relative rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden ${hoverBorderClass} hover:bg-zinc-900 transition-[transform,border-color,background-color] duration-300 ease-out will-change-transform hover:-translate-y-1`}>

 {/* Favorite button */}
 <button
 onClick={(e) => {
 e.stopPropagation();
 onToggleFavorite();
 }}
 className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 border border-zinc-800 hover:bg-black/70 transition-colors duration-200"
 aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
 >
 <svg
 className={`w-4 h-4 transition-colors duration-200 ${
 isFavorite
 ? "text-pink-400 fill-pink-400"
 : "text-zinc-500 hover:text-zinc-100"
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
 <div className="relative aspect-square flex items-center justify-center p-6 sm:p-8">
 <div className="absolute inset-0 bg-transparent" />
 <div className="relative w-16 h-16 sm:w-24 sm:h-24 group-hover:scale-110 transition-transform duration-300 ease-out will-change-transform">
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
 <h3 className="font-semibold text-zinc-100/90 text-sm group-hover:text-zinc-100 transition-colors duration-200">
 {cursor.name}
 </h3>
 <p className="text-xs text-zinc-500 mt-0.5">by {cursor.creator}</p>
 </div>

 <div className="flex items-center justify-between gap-2 flex-wrap mt-1 sm:mt-0">
 <span
 className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border capitalize ${badgeClass}`}
 >
 {cursor.category}
 </span>

 <button
 onClick={copyAssetId}
 className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
 copied
 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
 : "bg-zinc-300/15 text-zinc-300 border border-zinc-700 hover:bg-zinc-300 hover:bg-zinc-800/25 hover:text-zinc-300"
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
