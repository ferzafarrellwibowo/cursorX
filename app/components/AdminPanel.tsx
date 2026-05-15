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
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add");

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
        alert("Please upload a PNG or JPG image");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    if (imageId && isAssetIdDuplicate(imageId)) {
      setErrorMessage(`Asset ID "${imageId}" already exists. Please use a different Asset ID.`);
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for duplicate Asset ID
    if (isAssetIdDuplicate(imageId)) {
      setErrorMessage(`Asset ID "${imageId}" already exists. Please use a different Asset ID.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    await new Promise((r) => setTimeout(r, 500));

    onAddCursor({
      name,
      image: imageUrl || DEFAULT_CURSOR_IMAGE,
      imageId: imageId || `rbxassetid://${Date.now()}`,
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                  <p className="text-xs text-white/30">Manage your cursor collection</p>
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

            {/* Tabs */}
            <div className="flex gap-1 mt-5 p-1 rounded-xl bg-white/[0.04]">
              <button
                onClick={() => setActiveTab("add")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  activeTab === "add"
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                + Add Cursor
              </button>
              <button
                onClick={() => setActiveTab("manage")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  activeTab === "manage"
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                Manage
                {customCursors.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                    {customCursors.length}
                  </span>
                )}
              </button>
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

            {activeTab === "add" ? (
              /* ── Add Cursor Form ── */
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

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                    Cursor Image (.png, .jpg)
                    <span className="text-white/20 normal-case ml-1">(optional, uses default if empty)</span>
                  </label>
                  <label className="flex items-center justify-center w-full px-4 py-5 rounded-xl border-2 border-dashed border-white/[0.08] hover:border-violet-500/50 hover:bg-white/[0.02] cursor-pointer transition-all duration-300">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 text-white/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span className="text-sm text-white/70">
                        {fileName ? fileName : "Click to upload image"}
                      </span>
                      <span className="text-xs text-white/30 mt-1">Max 2MB</span>
                    </div>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image ID */}
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                    Image ID (Roblox Asset ID) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={imageId}
                    onChange={(e) => {
                      setImageId(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    onBlur={handleAssetIdBlur}
                    placeholder="rbxassetid://123456789"
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
                        <option key={cat} value={cat} className="bg-[#12121a]">
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
                        <option key={col} value={col} className="bg-[#12121a]">
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
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
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
            ) : (
              /* ── Manage Cursors Tab ── */
              <div className="space-y-3">
                {customCursors.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/[0.04] flex items-center justify-center">
                      <svg className="w-7 h-7 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p className="text-white/30 text-sm">No custom cursors yet</p>
                    <p className="text-white/15 text-xs mt-1">
                      Switch to the &quot;Add Cursor&quot; tab to create one
                    </p>
                  </div>
                ) : (
                  customCursors.map((cursor) => (
                    <div
                      key={cursor.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all duration-300"
                    >
                      <div className="w-12 h-12 shrink-0 rounded-lg bg-white/[0.04] flex items-center justify-center overflow-hidden">
                        <Image
                          src={cursor.image}
                          alt={cursor.name}
                          width={32}
                          height={32}
                          className="object-contain"
                          unoptimized={cursor.image.startsWith("http")}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {cursor.name}
                        </p>
                        <p className="text-xs text-white/30">
                          {cursor.category} · {cursor.creator}
                        </p>
                      </div>
                      {showDeleteConfirm === cursor.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(cursor.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/15 border border-red-500/25 hover:bg-red-500/25 transition-all"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(cursor.id)}
                          className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
