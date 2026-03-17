"use client";

import { CursorCategory, CATEGORIES, CursorColor, COLORS } from "../data/cursors";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CursorCategory | "All";
  onCategoryChange: (category: CursorCategory | "All") => void;
  selectedColor: CursorColor | "All";
  onColorChange: (color: CursorColor | "All") => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  resultCount: number;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedColor,
  onColorChange,
  showFavoritesOnly,
  onToggleFavorites,
  resultCount,
}: SearchBarProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search cursors..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/20 transition-all duration-300 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col gap-4">
        {/* Category & Right Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mr-1">Category</span>
            <button
              onClick={() => onCategoryChange("All")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-white/[0.04] text-white/40 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/60"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                    : "bg-white/[0.04] text-white/40 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
            {/* Favorites toggle */}
            <button
              onClick={onToggleFavorites}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                showFavoritesOnly
                  ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                  : "bg-white/[0.04] text-white/40 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/60"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill={showFavoritesOnly ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Favorites
            </button>

            {/* Result count */}
            <span className="text-xs text-white/20 whitespace-nowrap ml-auto">{resultCount} cursors</span>
          </div>
        </div>

        {/* Color Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mr-1">Color</span>
          <button
            onClick={() => onColorChange("All")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
              selectedColor === "All"
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20 border-transparent"
                : "bg-white/[0.04] text-white/40 border-white/[0.06] hover:bg-white/[0.08] hover:text-white/60"
            }`}
          >
            All
          </button>
          {COLORS.map((col) => {
            const isSelected = selectedColor === col;
            return (
              <button
                key={col}
                onClick={() => onColorChange(col)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-white/[0.1] text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    : "bg-white/[0.02] text-white/40 border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ring-1 ring-white/10 ${
                  col === 'Green' ? 'bg-emerald-400' :
                  col === 'White' ? 'bg-white' :
                  col === 'Red' ? 'bg-rose-500' :
                  col === 'Yellow' ? 'bg-amber-400' :
                  col === 'Purple' ? 'bg-violet-500' :
                  col === 'Blue' ? 'bg-indigo-400' :
                  col === 'Pink' ? 'bg-pink-400' :
                  col === 'Black' ? 'bg-black' : 'bg-transparent'
                }`} />
                {col}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
