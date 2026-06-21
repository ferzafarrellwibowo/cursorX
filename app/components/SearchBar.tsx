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
 onAddClick: () => void;
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
 onAddClick,
}: SearchBarProps) {
 return (
 <div className="space-y-4 sm:space-y-5">
 {/* Search Input & Add Button */}
 <div className="flex items-center gap-3 max-w-xl mx-auto">
 <div className="relative flex-1">
 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
 <svg
 className="w-5 h-5 text-zinc-500"
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
 className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 focus:ring-1 focus:ring-zinc-500/20 transition-all duration-300 text-sm"
 />
 {searchQuery && (
 <button
 onClick={() => onSearchChange("")}
 className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-400 transition-colors"
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
 
 {/* Add Button */}
 <button
 onClick={onAddClick}
 className="p-3.5 rounded-2xl bg-zinc-100 text-zinc-900 shadow-none hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center shrink-0 group"
 title="Submit your cursor"
 >
 <svg 
 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" 
 fill="none" 
 viewBox="0 0 24 24" 
 stroke="currentColor" 
 strokeWidth={3}
 >
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
 </svg>
 </button>
 </div>

 {/* Filters Row */}
 <div className="flex flex-col gap-4">
 {/* Category & Right Controls */}
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
 {/* Category Pills */}
 <div className="flex flex-wrap items-center gap-2">
 <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mr-1">Category</span>
 <button
 onClick={() => onCategoryChange("All")}
 className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
 selectedCategory === "All"
 ? "bg-zinc-100 text-zinc-900 shadow-none"
 : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-400"
 }`}
 >
 All
 </button>
 {CATEGORIES.map((cat) => (
 <button
 key={cat}
 onClick={() => onCategoryChange(cat)}
 className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 capitalize ${
 selectedCategory === cat
 ? "bg-zinc-100 text-zinc-900 shadow-none"
 : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-400"
 }`}
 >
 {cat}
 </button>
 ))}
 </div>

 {/* Right side controls */}
 <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
 {/* Favorites toggle */}
 <button
 onClick={onToggleFavorites}
 className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
 showFavoritesOnly
 ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
 : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-400"
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
 <span className="text-xs text-zinc-400 whitespace-nowrap ml-auto">{resultCount} cursors</span>
 </div>
 </div>

 {/* Color Pills */}
 <div className="flex flex-wrap items-center gap-2">
 <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mr-1">Color</span>
 <button
 onClick={() => onColorChange("All")}
 className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 border ${
 selectedColor === "All"
 ? "bg-zinc-100 text-zinc-900 shadow-none border-transparent"
 : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-400"
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
 className={`relative px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 border flex items-center gap-1.5 ${
 isSelected
 ? "bg-zinc-800 text-zinc-100 border-zinc-700 shadow-none"
 : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-400"
 }`}
 >
 <span className={`w-2 h-2 rounded-full ring-1 ring-white/10 ${
 col === 'green' ? 'bg-emerald-500' :
 col === 'white' ? 'bg-white' :
 col === 'red' ? 'bg-rose-500' :
 col === 'yellow' ? 'bg-amber-400' :
 col === 'purple' ? 'bg-violet-500' :
 col === 'blue' ? 'bg-indigo-400' :
 col === 'pink' ? 'bg-pink-400' :
 col === 'black' ? 'bg-black' :
 col === 'orange' ? 'bg-orange-400' :
 col === 'brown' ? 'bg-amber-700' : 'bg-transparent'
 }`} />
 <span className="capitalize">{col}</span>
 </button>
 );
 })}
 </div>
 </div>
 </div>
 );
}
