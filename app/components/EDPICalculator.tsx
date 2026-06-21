"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface EDPICalculatorProps {
 isOpen: boolean;
 onClose: () => void;
}

// Cursor Speed multipliers (1/20 to 20/20)
const CURSOR_SPEED_MULTIPLIERS: Record<number, number> = {
 1: 0.03125,
 2: 0.0625,
 3: 0.125,
 4: 0.25,
 5: 0.375,
 6: 0.5,
 7: 0.625,
 8: 0.75,
 9: 0.875,
 10: 1.0,
 11: 1.25,
 12: 1.5,
 13: 1.75,
 14: 2.0,
 15: 2.25,
 16: 2.5,
 17: 2.75,
 18: 3.0,
 19: 3.25,
 20: 3.5,
};

// Windows Sensitivity multipliers (1/11 to 11/11)
const WINDOWS_SENSITIVITY_MULTIPLIERS: Record<number, number> = {
 1: 0.0625,
 2: 0.125,
 3: 0.25,
 4: 0.5,
 5: 0.75,
 6: 1.0,
 7: 1.5,
 8: 2.0,
 9: 2.5,
 10: 3.0,
 11: 3.5,
};

export default function EDPICalculator({ isOpen, onClose }: EDPICalculatorProps) {
 const [dpi, setDpi] = useState<string>("800");
 const [cursorSpeed, setCursorSpeed] = useState<number>(10);
 const [windowsSensitivity, setWindowsSensitivity] = useState<number>(6);
 const [calculationType, setCalculationType] = useState<"cursor" | "windows">("cursor");
 const [showHelp, setShowHelp] = useState(false);

 const handleEscape = useCallback(
 (e: KeyboardEvent) => {
 if (e.key === "Escape") {
 if (showHelp) {
 setShowHelp(false);
 } else {
 onClose();
 }
 }
 },
 [onClose, showHelp]
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

 // Close help when switching tabs
 useEffect(() => {
 setShowHelp(false);
 }, [calculationType]);

 const getMultiplier = () => {
 if (calculationType === "cursor") {
 return CURSOR_SPEED_MULTIPLIERS[cursorSpeed] || 1.0;
 }
 return WINDOWS_SENSITIVITY_MULTIPLIERS[windowsSensitivity] || 1.0;
 };

 const calculateEDPI = () => {
 const dpiValue = parseFloat(dpi) || 0;
 const multiplier = getMultiplier();
 const result = multiplier * dpiValue;
 // Remove trailing zeros (e.g., 800.00 → 800)
 return result % 1 === 0 ? result.toString() : result.toFixed(2);
 };

 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 {/* Backdrop */}
 <div
 className="absolute inset-0 bg-zinc-950/90 animate-fadeIn"
 onClick={onClose}
 />

 {/* Modal */}
 <div className="relative w-full max-w-lg animate-modalIn">
 <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl">
 {/* Header */}
 <div className="border-b border-zinc-800 p-6 bg-zinc-900">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-xl font-bold text-zinc-100">eDPI Calculator</h2>
 <p className="text-xs text-zinc-500">Calculate your effective DPI</p>
 </div>
 <button
 onClick={onClose}
 className="p-2 rounded-full bg-zinc-800 border border-zinc-800 hover:bg-zinc-800 transition-all duration-300"
 >
 <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 </div>

 {/* Content */}
 <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
 {/* Calculation Type Toggle */}
 <div>
 <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
 Sensitivity Type
 </label>
 <div className="flex gap-1 p-1 rounded-xl bg-zinc-900">
 <button
 onClick={() => setCalculationType("cursor")}
 className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all duration-300 ${
 calculationType === "cursor"
 ? "bg-zinc-100 text-zinc-900 shadow-none"
 : "text-zinc-500 hover:text-zinc-400"
 }`}
 >
 Pointer Speed
 </button>
 <button
 onClick={() => setCalculationType("windows")}
 className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all duration-300 ${
 calculationType === "windows"
 ? "bg-zinc-100 text-zinc-900 shadow-none"
 : "text-zinc-500 hover:text-zinc-400"
 }`}
 >
 Windows Sensitivity
 </button>
 </div>
 </div>

 {/* Help Button */}
 <button
 onClick={() => setShowHelp(!showHelp)}
 className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-100/70 hover:bg-zinc-900 hover:border-zinc-800 transition-all duration-300"
 >
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 {calculationType === "cursor" ? "What is Cursor Speed?" : "What is Windows Sensitivity?"}
 </button>

 {/* Help Content */}
 {showHelp && (
 <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden animate-fadeInUp">
 {calculationType === "cursor" ? (
 <div className="p-4 space-y-3">
 <h4 className="text-sm font-semibold text-zinc-100">How to find Cursor Speed</h4>
 <div className="space-y-2 text-xs text-zinc-400">
 <p className="flex items-start gap-2">
 <span className="text-zinc-400 font-bold">1.</span>
 Open <span className="text-zinc-100/70 font-medium">Windows Settings</span>
 </p>
 <p className="flex items-start gap-2">
 <span className="text-zinc-400 font-bold">2.</span>
 Go to <span className="text-zinc-100/70 font-medium">Bluetooth & devices</span> → <span className="text-zinc-100/70 font-medium">Mouse</span>
 </p>
 <p className="flex items-start gap-2">
 <span className="text-zinc-400 font-bold">3.</span>
 Find <span className="text-zinc-100/70 font-medium">Mouse pointer speed</span> slider
 </p>
 </div>
 <div className="mt-4 rounded-xl overflow-hidden border border-zinc-800">
 <Image
 src="/cuSpeed.png"
 alt="Cursor Speed Settings"
 width={400}
 height={200}
 loading="lazy"
 className="w-full h-auto"
 />
 </div>
 </div>
 ) : (
 <div className="p-4 space-y-3">
 <h4 className="text-sm font-semibold text-zinc-100">How to find Windows Sensitivity</h4>
 <div className="space-y-2 text-xs text-zinc-400">
 <p className="flex items-start gap-2">
 <span className="text-zinc-400 font-bold">1.</span>
 Press <span className="text-zinc-100/70 font-medium px-1.5 py-0.5 bg-zinc-800 rounded">Win + R</span> and type <span className="text-zinc-100/70 font-medium px-1.5 py-0.5 bg-zinc-800 rounded font-mono">main.cpl</span>
 </p>
 <p className="flex items-start gap-2">
 <span className="text-zinc-400 font-bold">2.</span>
 Go to <span className="text-zinc-100/70 font-medium">Pointer Options</span> tab
 </p>
 <p className="flex items-start gap-2">
 <span className="text-zinc-400 font-bold">3.</span>
 Find <span className="text-zinc-100/70 font-medium">Select a pointer speed</span> slider in Motion section
 </p>
 </div>
 <div className="mt-4 rounded-xl overflow-hidden border border-zinc-800">
 <Image
 src="/mS.png"
 alt="Windows Sensitivity Settings"
 width={400}
 height={200}
 loading="lazy"
 className="w-full h-auto"
 />
 </div>
 </div>
 )}
 </div>
 )}

 {/* DPI Input */}
 <div>
 <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
 Mouse DPI
 </label>
 <input
 type="number"
 value={dpi}
 onChange={(e) => setDpi(e.target.value)}
 placeholder="e.g. 800"
 className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/20 transition-all duration-300 text-sm"
 />
 </div>

 {/* Cursor Speed or Windows Sensitivity */}
 {calculationType === "cursor" ? (
 <div>
 <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
 Cursor Speed ({cursorSpeed}/20)
 <span className="ml-2 text-zinc-400">
 Multiplier: {CURSOR_SPEED_MULTIPLIERS[cursorSpeed]}x
 </span>
 </label>
 <input
 type="range"
 min="1"
 max="20"
 value={cursorSpeed}
 onChange={(e) => setCursorSpeed(parseInt(e.target.value))}
 className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-100"
 />
 <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
 <span>1</span>
 <span className={cursorSpeed === 10 ? "text-zinc-100 font-medium" : ""}>10 (Default)</span>
 <span>20</span>
 </div>
 </div>
 ) : (
 <div>
 <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
 Windows Sensitivity ({windowsSensitivity}/11)
 <span className="ml-2 text-zinc-400">
 Multiplier: {WINDOWS_SENSITIVITY_MULTIPLIERS[windowsSensitivity]}x
 </span>
 </label>
 <input
 type="range"
 min="1"
 max="11"
 value={windowsSensitivity}
 onChange={(e) => setWindowsSensitivity(parseInt(e.target.value))}
 className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-100"
 />
 <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
 <span>1</span>
 <span className={windowsSensitivity === 6 ? "text-zinc-100 font-medium" : ""}>6 (Default)</span>
 <span>11</span>
 </div>
 </div>
 )}

 {/* Result */}
 <div className="p-6 rounded-2xl bg-zinc-800/5 border border-zinc-700">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-xs text-zinc-300/60 uppercase tracking-wider mb-1">Your eDPI</p>
 <p className="text-4xl font-bold text-zinc-100">
 {calculateEDPI()}
 </p>
 </div>
 <div className="text-right">
 <p className="text-xs text-zinc-500 mb-1">Formula</p>
 <p className="text-xs text-zinc-400 font-mono">
 {getMultiplier()} × {dpi || 0} = {calculateEDPI()}
 </p>
 </div>
 </div>
 </div>

 {/* Reference Tables Toggle */}
 <details className="group">
 <summary className="cursor-pointer text-xs text-zinc-500 hover:text-zinc-400 transition-colors flex items-center gap-2">
 <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
 </svg>
 View Reference Tables
 </summary>
 <div className="mt-3 grid grid-cols-2 gap-3">
 {/* Cursor Speed Table */}
 <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
 <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Cursor Speed</p>
 <div className="space-y-0.5 text-[10px] max-h-32 overflow-y-auto">
 {Object.entries(CURSOR_SPEED_MULTIPLIERS).map(([speed, mult]) => (
 <div
 key={speed}
 className={`flex justify-between py-0.5 px-1 rounded ${
 parseInt(speed) === cursorSpeed && calculationType === "cursor"
 ? "bg-zinc-800 text-zinc-100"
 : "text-zinc-500"
 }`}
 >
 <span>{speed}/20</span>
 <span>{mult}x</span>
 </div>
 ))}
 </div>
 </div>
 {/* Windows Sensitivity Table */}
 <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
 <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Windows Sens</p>
 <div className="space-y-0.5 text-[10px] max-h-32 overflow-y-auto">
 {Object.entries(WINDOWS_SENSITIVITY_MULTIPLIERS).map(([sens, mult]) => (
 <div
 key={sens}
 className={`flex justify-between py-0.5 px-1 rounded ${
 parseInt(sens) === windowsSensitivity && calculationType === "windows"
 ? "bg-zinc-800 text-zinc-100"
 : "text-zinc-500"
 }`}
 >
 <span>{sens}/11</span>
 <span>{mult}x</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </details>
 </div>
 </div>
 </div>
 </div>
 );
}
