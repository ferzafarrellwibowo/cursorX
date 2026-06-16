"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CATEGORIES, COLORS, CursorCategory, CursorColor, CursorData } from "../data/cursors";

interface PendingSubmission {
  id: string;
  asset_id: string;
  created_at: string;
  image_base64?: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  submission: PendingSubmission | null;
  onClose: () => void;
  onAccept: (cursor: Omit<CursorData, "id">) => Promise<void>;
  onReject: () => Promise<void>;
}

export default function ReviewModal({
  isOpen,
  submission,
  onClose,
  onAccept,
  onReject,
}: ReviewModalProps) {
  const [name, setName] = useState("");
  const [imageId, setImageId] = useState("");
  const [textureId, setTextureId] = useState("");
  const [category, setCategory] = useState<CursorCategory>("circle");
  const [color, setColor] = useState<CursorColor>("white");
  const [creator, setCreator] = useState("");
  const [isLoadingRobloxData, setIsLoadingRobloxData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  // Fetch Roblox Data when opened
  useEffect(() => {
    if (isOpen && submission) {
      // Reset state
      setErrorMessage("");
      setName("");
      setCreator("");
      setImageId(submission.image_base64 || "");
      setTextureId(submission.asset_id);
      
      const fetchRobloxData = async () => {
        setIsLoadingRobloxData(true);
        try {
          const res = await fetch(`/api/roblox-asset?assetId=${submission.asset_id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.Name) setName(data.Name);
            if (data.Creator?.Name) setCreator(data.Creator.Name);
          } else {
            console.warn("Failed to fetch Roblox data");
          }
        } catch (error) {
          console.error("Error fetching Roblox data", error);
        } finally {
          setIsLoadingRobloxData(false);
        }
      };

      fetchRobloxData();
    }
  }, [isOpen, submission]);

  const handleAcceptClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageId || !textureId) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await onAccept({
        name,
        image: imageId,
        imageId: imageId,
        textureId,
        category,
        color,
        creator: creator || "Unknown",
      });
      onClose();
    } catch (err: unknown) {
      setErrorMessage("Failed to accept submission.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = async () => {
    setIsRejecting(true);
    setErrorMessage("");
    try {
      await onReject();
      onClose();
    } catch (err: unknown) {
      setErrorMessage("Failed to reject submission.");
      console.error(err);
    } finally {
      setIsRejecting(false);
    }
  };

  if (!isOpen || !submission) return null;

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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Review Submission</h2>
                  <p className="text-xs text-white/30">Asset ID: {submission.asset_id}</p>
                </div>
              </div>
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

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6">
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 animate-fadeInUp">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-400">{errorMessage}</span>
              </div>
            )}

            {isLoadingRobloxData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="w-8 h-8 animate-spin text-violet-500 mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-sm text-white/40 animate-pulse">Fetching Roblox data...</p>
              </div>
            ) : (
              <form onSubmit={handleAcceptClick} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                    Cursor Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:border-violet-500/50 transition-all duration-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                    Image Link (Base64) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={imageId}
                    onChange={(e) => setImageId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono text-xs focus:border-violet-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                    Texture ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={textureId}
                    onChange={(e) => setTextureId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:border-violet-500/50 transition-all duration-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CursorCategory)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:border-violet-500/50 transition-all duration-300 text-sm appearance-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#12121a] capitalize">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                      Color <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value as CursorColor)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:border-violet-500/50 transition-all duration-300 text-sm appearance-none"
                    >
                      {COLORS.map((col) => (
                        <option key={col} value={col} className="bg-[#12121a] capitalize">
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                      Creator
                    </label>
                    <input
                      type="text"
                      value={creator}
                      onChange={(e) => setCreator(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:border-violet-500/50 transition-all duration-300 text-sm"
                    />
                  </div>
                </div>

                {name && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-[10px] uppercase tracking-wider text-white/25 mb-3">Preview</p>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/[0.04] flex items-center justify-center overflow-hidden">
                        {imageId && imageId.startsWith('data:image/') ? (
                          <Image src={imageId} alt={name} width={40} height={40} className="object-contain" unoptimized />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{name}</p>
                        <p className="text-xs text-white/30">{category} · {creator || "Unknown"}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleRejectClick}
                    disabled={isRejecting || isSubmitting}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isRejecting ? "Rejecting..." : "Reject"}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isRejecting || !name || !imageId || !textureId}
                    className="flex-[2] py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Accepting..." : "Accept"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
