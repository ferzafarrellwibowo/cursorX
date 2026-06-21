"use client";

import { CursorData } from "../data/cursors";
import SplitText from "./SplitText";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/flow-hover-button";
import { ArrowRight } from "lucide-react";

function useCountUp(end: number, duration: number = 2000) {
 const [count, setCount] = useState(0);
 const countRef = useRef(0);

 useEffect(() => {
 countRef.current = count;
 }, [count]);

 useEffect(() => {
 if (end === 0) {
 const loadingInterval = setInterval(() => {
 setCount(Math.floor(Math.random() * 99));
 }, 50);
 return () => clearInterval(loadingInterval);
 }

 let startTimestamp: number | null = null;
 let animationFrame: number;
 const startValue = countRef.current;

 const step = (timestamp: number) => {
 if (!startTimestamp) startTimestamp = timestamp;
 const progress = Math.min((timestamp - startTimestamp) / duration, 1); 
 const easeProgress = 1 - Math.pow(1 - progress, 3);
 
 setCount(Math.floor(startValue + (end - startValue) * easeProgress)); 
 
 if (progress < 1) {
 animationFrame = window.requestAnimationFrame(step);
 } else {
 setCount(end);
 }
 };
 animationFrame = window.requestAnimationFrame(step);
 return () => window.cancelAnimationFrame(animationFrame);
 }, [end, duration]);

 return count;
}

function useTypingEffect(text: string, speed: number = 150, delay: number = 1000) {
 const [displayedText, setDisplayedText] = useState("");
 const [isDone, setIsDone] = useState(false);

 useEffect(() => {
 let i = 0;
 let intervalId: NodeJS.Timeout;
 
 const startTyping = () => {
 intervalId = setInterval(() => {
 setDisplayedText(text.substring(0, i + 1));
 i++;
 if (i === text.length) {
 clearInterval(intervalId);
 setIsDone(true);
 }
 }, speed);
 };

 const timeoutId = setTimeout(startTyping, delay);

 return () => {
 clearTimeout(timeoutId);
 if (intervalId) clearInterval(intervalId);
 };
 }, [text, speed, delay]);

 return { displayedText, isDone };
}

interface HeroProps {
 cursors?: CursorData[];
}

export default function Hero({ cursors = [] }: HeroProps) {
 // Hitung jumlah unik category yang ada di dalam cursors
 const activeCategories = new Set(cursors.map(c => c.category)).size;
 const cursorsCount = cursors.length;
 
 const animatedCursorsCount = useCountUp(cursorsCount, 1500);
 const animatedCategoriesCount = useCountUp(activeCategories, 1500);
 const { displayedText: typingFree, isDone: typingFreeDone } = useTypingEffect("Free", 200, 500);
 
 const [discordCopied, setDiscordCopied] = useState(false);

 const handleCopyDiscord = () => {
 navigator.clipboard.writeText("slippp.");
 setDiscordCopied(true);
 setTimeout(() => setDiscordCopied(false), 2000);
 };

 return (
 <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-10">
 {/* Background elements */}
 <div className="absolute inset-0">
 </div>

 <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">

 {/* Title */}
 <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6 flex flex-wrap justify-center items-end animate-fadeInUp [animation-delay:0.1s]">
 <SplitText
 as="span"
 text="cursor"
 className="text-zinc-100 pb-3"
 splitBy="chars"
 stagger={0.04}
 duration={0.6}
 />
 <SplitText
 as="span"
 text="X"
 className="text-violet-500 pb-3 animate-neon-blink"
 splitBy="chars"
 stagger={0.05}
 duration={0.7}
 />
 </h1>

 {/* Description */}
 <p className="text-sm sm:text-base text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed animate-fadeInUp [animation-delay:0.3s]">
 Discover and collect custom Roblox cursors. Browse our curated
 collection, preview in real-time, and copy asset IDs instantly for your
 Roblox games.
 </p>

 {/* CTA Buttons */}
 <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp [animation-delay:0.4s]">
 <a href="#gallery" className="outline-none">
 <Button>
 Browse Cursors
 </Button>
 </a>
 </div>

 {/* Stats */}
 <div className="flex items-center justify-center gap-3 sm:gap-12 mt-12 sm:mt-16 animate-fadeInUp [animation-delay:0.5s]">
 <div className="text-center w-24">
 <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
 {animatedCursorsCount}
 </div>
 <div className="text-xs sm:text-sm text-zinc-500 mt-1">
 Cursors
 </div>
 </div>
 <div className="w-px h-8 bg-zinc-800" />
 <div className="text-center w-24">
 <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
 {animatedCategoriesCount}
 </div>
 <div className="text-xs sm:text-sm text-zinc-500 mt-1">
 Categories
 </div>
 </div>
 <div className="w-px h-8 bg-zinc-800" />
 <div className="text-center w-24">
 <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100 relative inline-block">
 {typingFree}
 {!typingFreeDone && (
 <span className="animate-pulse absolute -right-2 top-0 bottom-0 text-zinc-500 font-normal opacity-50">|</span>
 )}
 </div>
 <div className="text-xs sm:text-sm text-zinc-500 mt-1">
 Forever
 </div>
 </div>
 </div>

 {/* Made By Credit */}
 <div className="mt-12 animate-fadeInUp flex flex-col items-center [animation-delay:0.6s]">
 <p className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-5 font-mono">
 Made by{" "}
 <span className="text-zinc-300 font-bold tracking-[0.2em]">
 UXTITLED
 </span>
 </p>

 <div className="flex items-center justify-center gap-6 sm:gap-10 text-zinc-500">
 {/* Roblox Link */}
 <a
 href="https://www.roblox.com/users/4698580085/profile"
 target="_blank"
 rel="noopener noreferrer"
 className="hover:-translate-y-1 transform transition-all duration-300 relative flex items-center justify-center group"
 title="Roblox Profile"
 >
 <img 
 src="/rblxIMG.svg" 
 alt="Roblox" 
 className="h-9 w-auto object-contain brightness-0 invert opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
 />
 </a>

 {/* Discord Copy */}
 <button
 onClick={handleCopyDiscord}
 className="hover:-translate-y-1 transform transition-all duration-300 relative flex items-center justify-center group"
 title="Copy Discord Tag"
 >
 <img 
 src="/discordIMG.svg" 
 alt="Discord" 
 className="h-9 w-auto object-contain brightness-0 invert opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
 />
 {discordCopied && (
 <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[11px] font-medium bg-zinc-800/80 px-2.5 py-1 rounded shadow-lg backdrop-blur-sm whitespace-nowrap">
 Copied!
 </span>
 )}
 </button>

 {/* YouTube Link */}
 <a
 href="https://www.youtube.com/@slip_3197"
 target="_blank"
 rel="noopener noreferrer"
 className="hover:-translate-y-1 transform transition-all duration-300 relative flex items-center justify-center group outline-none"
 title="YouTube Channel"
 >
 <img 
 src="/ytIMG.svg" 
 alt="YouTube" 
 className="h-9 w-auto object-contain brightness-0 invert opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
 />
 </a>
 </div>
 </div>
 </div>

 {/* Bottom fade removed */}
 </section>
 );
}
