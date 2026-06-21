"use client";

import { useState, useEffect, useCallback } from "react";

interface SubmitCursorModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export default function SubmitCursorModal({ isOpen, onClose }: SubmitCursorModalProps) {
 const [assetId, setAssetId] = useState("");
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

 const handleEscape = useCallback(
 (e: KeyboardEvent) => {
 if (e.key === "Escape" && !isSubmitting) {
 onClose();
 }
 },
 [onClose, isSubmitting]
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

 // Reset form when modal opens
 useEffect(() => {
 if (isOpen) {
 setAssetId("");
 setStatus({ type: null, message: "" });
 }
 }, [isOpen]);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();

 const trimmedId = assetId.trim();
 if (!trimmedId) {
 setStatus({ type: "error", message: "Please enter an Asset ID" });
 return;
 }

 setIsSubmitting(true);
 setStatus({ type: null, message: "" });

 // Submit to API
 try {
 const res = await fetch("/api/submit-cursor", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ asset_id: trimmedId }),
 });

 const data = await res.json();

 if (!res.ok) {
 throw new Error(data.error || "Failed to submit cursor");
 }

 setStatus({ type: "success", message: "Cursor submitted! It will be reviewed shortly." });
 setAssetId("");

 // Auto close after success
 setTimeout(() => {
 onClose();
 }, 2000);
 } catch (err: any) {
 setStatus({ type: "error", message: err.message || "Failed to submit cursor." });
 } finally {
 setIsSubmitting(false);
 }
 };

 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 {/* Backdrop */}
 <div
 className="absolute inset-0 bg-zinc-950/90 animate-fadeIn"
 onClick={() => !isSubmitting && onClose()}
 />

 {/* Modal */}
 <div className="relative w-full max-w-md animate-modalIn">
 <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl">
 {/* Header */}
 <div className="border-b border-zinc-800 p-5 bg-zinc-900">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-lg font-bold text-zinc-100">Submit Cursor</h2>
 <p className="text-xs text-zinc-500">Share your cursor with the community</p>
 </div>
 <button
 onClick={onClose}
 disabled={isSubmitting}
 className="p-2 rounded-full bg-zinc-800 border border-zinc-800 hover:bg-zinc-800 transition-all duration-300 disabled:opacity-50"
 >
 <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 </div>

 {/* Content */}
 <form onSubmit={handleSubmit} className="p-5 space-y-4">
 <div className="p-4 rounded-xl bg-zinc-300/10 border border-zinc-700 mb-4">
 <div className="flex gap-3">
 <svg className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <p className="text-sm text-zinc-300/80 leading-relaxed">
 The cursor you input will be reviewed first to determine whether it is appropriate or not before it appears in the gallery.
 </p>
 </div>
 </div>

 {/* Text Input */}
 <div>
 <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
 Asset ID
 </label>
 <input
 type="text"
 value={assetId}
 onChange={(e) => setAssetId(e.target.value)}
 placeholder="e.g. 1234567890"
 disabled={isSubmitting}
 className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-700 transition-all duration-300 text-sm disabled:opacity-50"
 />
 </div>

 {/* Status Message */}
 {status.message && (
 <div
 className={`p-3 rounded-xl text-sm ${
 status.type === "success"
 ? "bg-green-500/10 border border-green-500/20 text-green-400"
 : "bg-red-500/10 border border-red-500/20 text-red-400"
 }`}
 >
 {status.message}
 </div>
 )}

 {/* Submit Button */}
 <button
 type="submit"
 disabled={isSubmitting || !assetId.trim()}
 className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-semibold hover:opacity-90 shadow-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
 >
 {isSubmitting ? (
 <>
 <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
 </svg>
 Submitting...
 </>
 ) : (
 "Submit Cursor"
 )}
 </button>
 </form>
 </div>
 </div>
 </div>
 );
}
