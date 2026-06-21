"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { CursorData } from "../data/cursors";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

interface ModalProps {
 cursor: CursorData | null;
 isOpen: boolean;
 onClose: () => void;
 isFavorite: boolean;
 onToggleFavorite: () => void;
}

const colorGradient: Record<string, string> = {
 Green: "from-emerald-500/20 to-green-500/20",
 White: "from-slate-400/20 to-gray-500/20",
 Red: "from-red-500/20 to-rose-500/20",
 Yellow: "from-amber-500/20 to-yellow-500/20",
 Purple: "from-violet-500/20 to-purple-500/20",
 Blue: "from-indigo-500/20 to-blue-500/20",
 Pink: "from-pink-500/20 to-rose-500/20",
 Black: "from-zinc-500/20 to-zinc-500/20",
};

const colorAccent: Record<string, string> = {
 Green: "text-zinc-300",
 White: "text-slate-200",
 Red: "text-red-400",
 Yellow: "text-amber-400",
 Purple: "text-zinc-300",
 Blue: "text-indigo-400",
 Pink: "text-pink-400",
 Black: "text-zinc-400",
};

export default function Modal({
 cursor,
 isOpen,
 onClose,
 isFavorite,
 onToggleFavorite,
}: ModalProps) {
 const { copied, copy } = useCopyToClipboard();
 const overlayRef = useRef<HTMLDivElement>(null);

 const handleEscape = useCallback(
 (e: KeyboardEvent) => {
 if (e.key === "Escape") onClose();
 },
 [onClose]
 );

 useEffect(() => {
 if (isOpen) {
 document.addEventListener("keydown", handleEscape);
 document.body.style.overflow = "hidden";
 }
 return () => {
 document.removeEventListener("keydown", handleEscape);
 document.body.style.overflow = "";
 };
 }, [isOpen, handleEscape]);

 if (!isOpen || !cursor) return null;

 const gradient = colorGradient[cursor.color] || "from-gray-500/20 to-gray-500/20";
 const accent = colorAccent[cursor.color] || "text-gray-400";

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 {/* Backdrop */}
 <div
 ref={overlayRef}
 className="absolute inset-0 bg-zinc-950/90 animate-fadeIn"
 onClick={onClose}
 />

 {/* Modal Content */}
 <div className="relative w-full max-w-lg animate-modalIn">
 <div className="relative rounded-xl overflow-hidden bg-[#12121a] border border-zinc-800 shadow-2xl">
 {/* Close button */}
 <button
 onClick={onClose}
 className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800 border border-zinc-800 hover:bg-zinc-800 transition-all duration-300"
 >
 <svg
 className="w-4 h-4 text-zinc-400"
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 strokeWidth={2.5}
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 d="M6 18L18 6M6 6l12 12"
 />
 </svg>
 </button>

 {/* Cursor Preview Area */}
 <div className={`relative bg-zinc-900 p-12 flex items-center justify-center`}>
 <div className="absolute inset-0 opacity-[0.03]"
 style={{
 backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
 backgroundSize: "20px 20px",
 }}
 />
 <div className="relative w-32 h-32 sm:w-40 sm:h-40">
 <Image
 src={cursor.image}
 alt={cursor.name}
 fill
 sizes="(max-width: 640px) 128px, 160px"
 className="object-contain drop-shadow-xl"
 />
 </div>
 </div>

 {/* Info Section */}
 <div className="p-6 space-y-5">
 {/* Header */}
 <div className="flex items-start justify-between">
 <div>
 <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
 {cursor.name}
 </h2>
 <p className={`text-sm mt-1 ${accent}`}>{cursor.category}</p>
 </div>
 <button
 onClick={onToggleFavorite}
 className={`p-2.5 rounded-xl border transition-all duration-300 ${
 isFavorite
 ? "bg-pink-500/15 border-pink-500/30 text-pink-400"
 : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-100 hover:border-zinc-500/50"
 }`}
 >
 <svg
 className="w-5 h-5"
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
 </div>

 {/* Details Grid */}
 <div className="grid grid-cols-2 gap-3">
 <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
 <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
 Creator
 </p>
 <p className="text-sm text-zinc-300 font-medium">
 {cursor.creator}
 </p>
 </div>
 <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
 <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
 Category
 </p>
 <p className={`text-sm font-medium ${accent}`}>
 {cursor.category}
 </p>
 </div>
 </div>

 {/* Image ID Copy */}
 <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
 <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
 Image ID
 </p>
 <div className="flex items-center gap-3">
 <code className="flex-1 text-sm text-zinc-400 bg-zinc-900 px-3 py-2 rounded-lg font-mono overflow-x-auto">
 {cursor.imageId}
 </code>
 <button
 onClick={() => copy(cursor.imageId)}
 className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
 copied
 ? "bg-zinc-300/20 text-zinc-300 border border-zinc-700"
 : "bg-zinc-100 text-zinc-900 hover:shadow-none"
 }`}
 >
 {copied ? (
 <>
 <svg
 className="w-4 h-4"
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 strokeWidth={2.5}
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 d="M5 13l4 4L19 7"
 />
 </svg>
 Copied!
 </>
 ) : (
 <>
 <svg
 className="w-4 h-4"
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 strokeWidth={2}
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
 />
 </svg>
 Copy
 </>
 )}
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
