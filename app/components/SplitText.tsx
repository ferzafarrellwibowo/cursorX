"use client";

import React from "react";
import { motion } from "framer-motion";

interface SplitTextProps {
 text: string;
 as?: keyof React.JSX.IntrinsicElements;
 className?: string;
 splitBy?: "chars" | "words";
 stagger?: number; // seconds
 duration?: number; // seconds per item
}

export default function SplitText({
 text,
 as = "span",
 className,
 splitBy = "chars",
 stagger = 0.03,
 duration = 0.5,
}: SplitTextProps) {
 const Tag = as as any;
 const parts =
 splitBy === "words" ? text.split(" ").map((w) => w + " ") : Array.from(text);

 return (
 <Tag className={className} aria-label={text} style={{ display: "inline-block" }}>
 {parts.map((part, i) => (
 <motion.span
 key={i}
 className="inline-block"
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{
 duration,
 delay: i * stagger,
 ease: [0.215, 0.61, 0.355, 1], // easeOutCubic untuk nuansa yang halus (mirip GSAP)
 }}
 style={{ display: "inline-block", whiteSpace: "pre" }}
 >
 {part}
 </motion.span>
 ))}
 </Tag>
 );
}
