"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CursorGallery from "./components/CursorGallery";
import Footer from "./components/Footer";
import { useCursorStore } from "./hooks/useCursorStore";

export default function Home() {
  const { cursors } = useCursorStore();

  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <Hero />
      <CursorGallery cursors={cursors} />
      <Footer />
    </main>
  );
}
