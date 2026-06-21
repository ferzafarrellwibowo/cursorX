"use client";

import { useState, useEffect, useCallback } from "react";

const FEEDBACK_TYPES = [
 { value: "feedback", label: "Feedback", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
 { value: "report", label: "Report Issue", icon: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" },
];

const MAX_CHARS = 500;

export default function FeedbackModal({ isOpen, onClose }) {
 const [text, setText] = useState("");
 const [type, setType] = useState("feedback");
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [status, setStatus] = useState({ type: null, message: "" });

 const handleEscape = useCallback(
 (e) => {
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
 setText("");
 setType("feedback");
 setStatus({ type: null, message: "" });
 }
 }, [isOpen]);

 const handleSubmit = async (e) => {
 e.preventDefault();

 const trimmedText = text.trim();
 if (!trimmedText) {
 setStatus({ type: "error", message: "Please enter your feedback" });
 return;
 }

 if (trimmedText.length > MAX_CHARS) {
 setStatus({ type: "error", message: `Maximum ${MAX_CHARS} characters allowed` });
 return;
 }

 setIsSubmitting(true);
 setStatus({ type: null, message: "" });

 try {
 const res = await fetch("/api/feedback", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ text: trimmedText, type }),
 });

 const data = await res.json();

 if (!res.ok) {
 throw new Error(data.error || "Failed to submit feedback");
 }

 setStatus({ type: "success", message: "Thank you for your feedback!" });
 setText("");

 // Auto close after success
 setTimeout(() => {
 onClose();
 }, 2000);
 } catch (err) {
 setStatus({ type: "error", message: err.message });
 } finally {
 setIsSubmitting(false);
 }
 };

 if (!isOpen) return null;

 const charCount = text.length;
 const isOverLimit = charCount > MAX_CHARS;

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 {/* Backdrop */}
 <div
 className="absolute inset-0 bg-[#0a0a0f]/90 animate-fadeIn"
 onClick={() => !isSubmitting && onClose()}
 />

 {/* Modal */}
 <div className="relative w-full max-w-md animate-modalIn">
 <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl">
 {/* Header */}
 <div className="border-b border-white/[0.04] p-5 bg-white/[0.01]">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-lg font-bold text-white">Send Feedback</h2>
 <p className="text-xs text-white/30">Help us improve cursorX</p>
 </div>
 <button
 onClick={onClose}
 disabled={isSubmitting}
 className="p-2 rounded-full bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.12] transition-all duration-300 disabled:opacity-50"
 >
 <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 </div>

 {/* Content */}
 <form onSubmit={handleSubmit} className="p-5 space-y-4">
 {/* Type Selection */}
 <div>
 <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
 Type
 </label>
 <div className="flex gap-2">
 {FEEDBACK_TYPES.map((t) => (
 <button
 key={t.value}
 type="button"
 onClick={() => setType(t.value)}
 disabled={isSubmitting}
 className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
 type === t.value
 ? "bg-zinc-100 text-zinc-900 text-white shadow-none"
 : "bg-white/[0.04] text-white/40 hover:text-white/60 hover:bg-white/[0.08]"
 }`}
 >
 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
 </svg>
 <span className="hidden sm:inline">{t.label}</span>
 </button>
 ))}
 </div>
 </div>

 {/* Text Input */}
 <div>
 <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
 Message
 </label>
 <textarea
 value={text}
 onChange={(e) => setText(e.target.value)}
 placeholder="Tell us what you think..."
 disabled={isSubmitting}
 rows={4}
 className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/20 transition-all duration-300 text-sm resize-none disabled:opacity-50"
 />
 <div className="flex justify-end mt-1">
 <span className={`text-xs ${isOverLimit ? "text-red-400" : "text-white/30"}`}>
 {charCount}/{MAX_CHARS}
 </span>
 </div>
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
 disabled={isSubmitting || !text.trim() || isOverLimit}
 className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-zinc-100 text-zinc-900 hover:bg-zinc-300 hover:text-zinc-900 transition-all duration-300 hover:shadow-lg hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
 >
 {isSubmitting ? (
 <>
 <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
 </svg>
 Sending...
 </>
 ) : (
 "Send"
 )}
 </button>
 </form>
 </div>
 </div>
 </div>
 );
}
