"use client";

import { useState, useCallback } from "react";

export function useCopyToClipboard() {
 const [copied, setCopied] = useState(false);

 const copy = useCallback(async (text: string) => {
 try {
 await navigator.clipboard.writeText(text);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 return true;
 } catch {
 // Fallback
 const textArea = document.createElement("textarea");
 textArea.value = text;
 textArea.style.position = "fixed";
 textArea.style.left = "-9999px";
 document.body.appendChild(textArea);
 textArea.select();
 document.execCommand("copy");
 document.body.removeChild(textArea);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 return true;
 }
 }, []);

 return { copied, copy };
}
