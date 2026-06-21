"use client";

import { useState, useMemo, useEffect } from "react";
import { CursorCategory, CursorColor, CursorData } from "../data/cursors";
import { useFavorites } from "../hooks/useFavorites";
import SearchBar from "./SearchBar";
import CursorCard from "./CursorCard";
import SkeletonCard from "./SkeletonCard";
import SubmitCursorModal from "./SubmitCursorModal";
import ShinyText from "@/components/ui/shiny-text";

interface CursorGalleryProps {
 cursors: CursorData[];
 isLoaded?: boolean;
}

export default function CursorGallery({ cursors, isLoaded: dataLoaded = false }: CursorGalleryProps) {
 const [searchQuery, setSearchQuery] = useState("");
 const [selectedCategory, setSelectedCategory] = useState<
 CursorCategory | "All"
 >("All");
 const [selectedColor, setSelectedColor] = useState<
 CursorColor | "All"
 >("All");
 const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
 const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

 const [visibleCount, setVisibleCount] = useState(24);

 const { isFavorite, toggleFavorite, isLoaded: favoritesLoaded } = useFavorites();

 const filteredCursors = useMemo(() => {
 return cursors.filter((cursor) => {
 const matchesSearch = cursor.name
 .toLowerCase()
 .includes(searchQuery.toLowerCase());
 const matchesCategory =
 selectedCategory === "All" || cursor.category.toLowerCase() === selectedCategory.toLowerCase();
 // Handle multi-colors (e.g. 'green purple') by checking array inclusions
 const matchesColor = 
 selectedColor === "All" || cursor.color.toLowerCase().includes(selectedColor.toLowerCase());
 const matchesFavorite = !showFavoritesOnly || isFavorite(cursor.id);
 return matchesSearch && matchesCategory && matchesColor && matchesFavorite;
 });
 }, [cursors, searchQuery, selectedCategory, selectedColor, showFavoritesOnly, isFavorite]);

 // Reset visible count when filters change
 useEffect(() => {
 setVisibleCount(24);
 }, [searchQuery, selectedCategory, selectedColor, showFavoritesOnly]);

 const displayedCursors = filteredCursors.slice(0, visibleCount);

 const handleLoadMore = () => {
 setVisibleCount((prev) => prev + 24);
 };

 return (
 <section id="gallery" className="relative py-20 sm:py-28">
 {/* Section background accent */}
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-800/5 rounded-full blur-[150px]" />

 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Section Header */}
 <div className="text-center mb-12 sm:mb-16">
 <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
 <ShinyText text="Cursor Gallery" color="#52525b" shineColor="#ffffff" speed={2} />
 </h2>
 <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto">
 Browse our curated collection of Roblox cursors. Use the Copy ID
 button to get the asset ID instantly.
 </p>
 </div>

 {/* Search & Filter */}
 <div className="mb-10">
 <SearchBar
 searchQuery={searchQuery}
 onSearchChange={setSearchQuery}
 selectedCategory={selectedCategory}
 onCategoryChange={setSelectedCategory}
 selectedColor={selectedColor}
 onColorChange={setSelectedColor}
 showFavoritesOnly={showFavoritesOnly}
 onToggleFavorites={() => setShowFavoritesOnly((p) => !p)}
 resultCount={filteredCursors.length}
 onAddClick={() => setIsSubmitModalOpen(true)}
 />
 </div>

 {/* Grid */}
 {!dataLoaded || !favoritesLoaded ? (
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
 {Array.from({ length: 8 }).map((_, i) => (
 <SkeletonCard key={i} />
 ))}
 </div>
 ) : filteredCursors.length === 0 ? (
 <div className="text-center py-20">
 <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
 <svg
 className="w-8 h-8 text-zinc-400"
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 strokeWidth={1.5}
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
 />
 </svg>
 </div>
 <p className="text-zinc-500 text-sm">No cursors found</p>
 <p className="text-zinc-100/15 text-xs mt-1">
 Try adjusting your search or filters
 </p>
 </div>
 ) : (
 <>
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
 {displayedCursors.map((cursor, index) => (
 <CursorCard
 key={cursor.id}
 cursor={cursor}
 isFavorite={isFavorite(cursor.id)}
 onToggleFavorite={() => toggleFavorite(cursor.id)}
 index={index}
 />
 ))}
 </div>
 
 {visibleCount < filteredCursors.length && (
 <div className="mt-12 flex justify-center">
 <button
 onClick={handleLoadMore}
 className="px-8 py-3 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 transition-colors duration-200"
 >
 Load More Cursors ({filteredCursors.length - visibleCount} remaining)
 </button>
 </div>
 )}
 </>
 )}
 </div>

 <SubmitCursorModal
 isOpen={isSubmitModalOpen}
 onClose={() => setIsSubmitModalOpen(false)}
 />
 </section>
 );
}
