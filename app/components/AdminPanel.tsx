"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CATEGORIES, COLORS, CursorCategory, CursorColor, CursorData } from "../data/cursors";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCursor: (cursor: Omit<CursorData, "id">) => Promise<CursorData> | CursorData;
  onDeleteCursor: (id: string) => void;
  customCursors: CursorData[];
  onLogout: () => void;
}

const DEFAULT_CURSOR_IMAGE = "/cursors/default-arrow.svg";

export default function AdminPanel({
  isOpen,
  onClose,
  onAddCursor,
  onDeleteCursor,
  customCursors,
  onLogout,
}: AdminPanelProps) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [imageId, setImageId] = useState("");
  const [category, setCategory] = useState<CursorCategory>("Circle");
  const [color, setColor] = useState<CursorColor>("White");
  const [creator, setCreator] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);


  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
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

  const resetForm = () => {
    setName("");
    setImageUrl("");
    setFileName("");
    setImageId("");
    setCategory("Circle");
    setColor("White");
    setCreator("");
    setErrorMessage("");
  };

  // Check if Asset ID already exists
  const isAssetIdDuplicate = (assetId: string): boolean => {
    return customCursors.some(
      (cursor) => cursor.imageId.toLowerCase() === assetId.toLowerCase()
    );
  };

  // Validate Asset ID on blur
  const handleAssetIdBlur = () => {
    if (imageId && !imageId.startsWith('data:image/')) {
      setErrorMessage("Image ID must be a valid Base64 image link (e.g. data:image/png;base64,...).");
    } else if (imageId && isAssetIdDuplicate(imageId)) {
      setErrorMessage("This Base64 image already exists.");
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageId.startsWith('data:image/')) {
      setErrorMessage("Image ID must be a valid Base64 image link.");
      return;
    }

    // Check for duplicate Asset ID
    if (isAssetIdDuplicate(imageId)) {
      setErrorMessage("This Base64 image already exists.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    await new Promise((r) => setTimeout(r, 500));

    onAddCursor({
      name,
      image: imageId,
      imageId: imageId,
      category,
      color,
      creator: creator || "Admin",
    });

    setIsSubmitting(false);
    setSuccessMessage(`"${name}" has been added successfully!`);
    resetForm();

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDelete = (id: string) => {
    onDeleteCursor(id);
    setShowDeleteConfirm(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[90vh] animate-modalIn">
        <div className="relative rounded-3xl overflow-hidden bg-[#12121a] border border-white/[0.08] shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="shrink-0 border-b border-white/[0.06] p-6 bg-gradient-to-r from-violet-600/5 to-fuchsia-600/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Add Cursor</h2>
                  <p className="text-xs text-white/30">Add a new cursor to your collection</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.12] transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>


          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6">
            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-fadeInUp">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-emerald-400">{successMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 animate-fadeInUp">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-400">{errorMessage}</span>
              </div>
            )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Cursor Name */}
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                    Cursor Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Diamond Blade"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-300 text-sm"
                  />
                </div>


                {/* Image ID */}
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                    Image ID (Base64) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={imageId}
                    onChange={(e) => {
                      setImageId(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    onBlur={handleAssetIdBlur}
                    placeholder="data:image/png;base64,..."
                    required
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-white/20 focus:outline-none focus:ring-1 transition-all duration-300 text-sm font-mono ${
                      errorMessage && imageId
                        ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                        : "border-white/[0.08] focus:border-violet-500/50 focus:ring-violet-500/20"
                    }`}
                  />
                </div>

                {/* Category, Color & Creator Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CursorCategory)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-300 text-sm appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        backgroundSize: "16px",
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#12121a] capitalize">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                      Color <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value as CursorColor)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-300 text-sm appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        backgroundSize: "16px",
                      }}
                    >
                      {COLORS.map((col) => (
                        <option key={col} value={col} className="bg-[#12121a] capitalize">
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Creator */}
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                      Creator
                    </label>
                    <input
                      type="text"
                      value={creator}
                      onChange={(e) => setCreator(e.target.value)}
                      placeholder="e.g. User"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-300 text-sm"
                    />
                  </div>
                </div>

                {/* Preview */}
                {name && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-[10px] uppercase tracking-wider text-white/25 mb-3">
                      Preview
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/[0.04] flex items-center justify-center overflow-hidden">
                        {imageId && imageId.startsWith('data:image/') ? (
                          <Image
                            src={imageId}
                            alt={name}
                            width={40}
                            height={40}
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <Image
                            src={DEFAULT_CURSOR_IMAGE}
                            alt="default"
                            width={40}
                            height={40}
                            className="object-contain opacity-40"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{name}</p>
                        <p className="text-xs text-white/30">
                          {category} · {creator || "Admin"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !imageId || !!errorMessage}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Cursor
                    </>
                  )}
                </button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}
