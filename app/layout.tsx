import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { GridBackground } from "@/components/ui/grid-background";
import ClickSpark from "@/components/ui/click-spark";

export const metadata: Metadata = {
  title: "cursorX",
  description:
    "Discover and collect custom Roblox cursors. Browse our curated collection, preview in real-time, and copy asset IDs instantly for your Roblox games.",
  keywords: [
    "Roblox",
    "cursor",
    "library",
    "Roblox cursor",
    "custom cursor",
    "game assets",
    "cursorX",
  ],
  authors: [{ name: "cursorX" }],
  openGraph: {
    title: "cursorX | Roblox Cursor Library",
    description:
      "Discover and collect custom Roblox cursors. Browse our curated collection, preview in real-time, and copy asset IDs instantly.",
    type: "website",
    siteName: "cursorX",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "cursorX Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "cursorX |  Roblox Cursor Library",
    description:
      "Discover and collect custom Roblox cursors. Browse our curated collection and copy asset IDs instantly.",
    images: ["/icon.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased relative">
        <GridBackground />
        <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
          {children}
        </ClickSpark>
        <Analytics />
      </body>
    </html>
  );
}
