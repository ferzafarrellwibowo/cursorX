"use client";

import { useState, useMemo, useEffect } from "react";
import { CursorCategory, CursorColor, CursorData } from "../data/cursors";
import { useFavorites } from "../hooks/useFavorites";
import SearchBar from "./SearchBar";
import CursorCard from "./CursorCard";
import SkeletonCard from "./SkeletonCard";
import Modal from "./Modal";

interface CursorGalleryProps {
  cursors: CursorData[];
}

export default function CursorGallery({ cursors }: CursorGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CursorCategory | "All"
  >("All");
  const [selectedColor, setSelectedColor] = useState<
    CursorColor | "All"
  >("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedCursor, setSelectedCursor] = useState<CursorData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredCursors = useMemo(() => {
    return cursors.filter((cursor) => {
      const matchesSearch = cursor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || cursor.category === selectedCategory;
      const matchesColor = 
        selectedColor === "All" || cursor.color === selectedColor;
      const matchesFavorite = !showFavoritesOnly || isFavorite(cursor.id);
      return matchesSearch && matchesCategory && matchesColor && matchesFavorite;
    });
  }, [cursors, searchQuery, selectedCategory, selectedColor, showFavoritesOnly, isFavorite]);

  const handleViewDetail = (cursor: CursorData) => {
    setSelectedCursor(cursor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCursor(null), 300);
  };

  return (
    <section id="gallery" className="relative py-20 sm:py-28">
      {/* Section background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Cursor{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Gallery
            </span>
          </h2>
          <p className="text-white/30 text-sm sm:text-base max-w-lg mx-auto">
            Browse our curated collection of Roblox cursors. Click on any cursor
            to view details and copy the image ID.
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
          />
        </div>

        {/* Grid */}
        {isLoading || !isLoaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredCursors.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.04] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white/20"
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
            <p className="text-white/30 text-sm">No cursors found</p>
            <p className="text-white/15 text-xs mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredCursors.map((cursor, index) => (
              <CursorCard
                key={cursor.id}
                cursor={cursor}
                isFavorite={isFavorite(cursor.id)}
                onToggleFavorite={() => toggleFavorite(cursor.id)}
                onViewDetail={() => handleViewDetail(cursor)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        cursor={selectedCursor}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFavorite={selectedCursor ? isFavorite(selectedCursor.id) : false}
        onToggleFavorite={() =>
          selectedCursor && toggleFavorite(selectedCursor.id)
        }
      />
    </section>
  );
}
