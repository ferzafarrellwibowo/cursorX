"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLoginModal from "../components/AdminLoginModal";
import AdminPanel from "../components/AdminPanel";
import { useAdmin } from "../hooks/useAdmin";
import { useCursorStore } from "../hooks/useCursorStore";
import { supabase } from "../utils/supabase";

import ReviewModal from "../components/ReviewModal";

interface PendingSubmission {
  id: string;
  asset_id: string;
  created_at: string;
  image_base64?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { isLoggedIn, login, logout, isLoaded } = useAdmin();
  const { customCursors, addCursor, deleteCursor } = useCursorStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [reviewingSubmission, setReviewingSubmission] = useState<PendingSubmission | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSubmissions();
    }
  }, [isLoggedIn]);

  const fetchSubmissions = async () => {
    if (!supabase) return;
    setIsLoadingSubmissions(true);
    try {
      const { data, error } = await supabase
        .from("cursor_submissions")
        .select("id, asset_id, created_at, image_base64")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPendingSubmissions(data);
      }
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const handleReviewClick = (sub: PendingSubmission) => {
    setReviewingSubmission(sub);
    setIsReviewModalOpen(true);
  };

  const handleAcceptSubmission = async (cursorData: Omit<any, "id">) => {
    if (!reviewingSubmission || !supabase) return;
    
    // Add to main database
    await addCursor(cursorData);

    // Update submission status
    const { error } = await supabase
      .from("cursor_submissions")
      .update({ status: "accepted" })
      .eq("id", reviewingSubmission.id);

    if (error) {
      console.error("Failed to update submission status", error);
      throw error;
    }

    // Refresh list
    fetchSubmissions();
  };

  const handleRejectSubmission = async () => {
    if (!reviewingSubmission || !supabase) return;

    // Update submission status
    const { error } = await supabase
      .from("cursor_submissions")
      .update({ status: "rejected" })
      .eq("id", reviewingSubmission.id);

    if (error) {
      console.error("Failed to update submission status", error);
      throw error;
    }

    // Refresh list
    fetchSubmissions();
  };

  const handleLoginSuccess = async (username: string, password: string) => {
    return await login(username, password);
  };

  const handleCloseLogin = () => {
    router.push("/");
  };

  const handleLogout = () => {
    setIsPanelOpen(false);
    logout();
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#0a0a0f]" />;

  return (
    <main className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px]" />
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Basic Navbar for Admin */}
      <nav className="relative z-20 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              cursor<span className="text-violet-400">X</span> <span className="text-sm font-normal text-white/40 ml-2">Admin Dashboard</span>
            </span>
          </Link>
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">
                Back to Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
        {!isLoggedIn ? (
          <AdminLoginModal
            isOpen={true}
            onClose={handleCloseLogin}
            onLogin={handleLoginSuccess}
          />
        ) : (
          <div className="max-w-xl w-full text-center space-y-8 animate-fadeInUp">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Welcome, Admin!</h1>
              <p className="text-white/40">You have full control over the cursor library. Add new cursors or manage existing ones.</p>
            </div>

            <div className="p-8 mt-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center">
              <div className="flex gap-4">
                <div className="text-center px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="text-3xl font-bold text-violet-400">{customCursors.length}</div>
                  <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">Custom Cursors</div>
                </div>
              </div>

              <button
                onClick={() => setIsPanelOpen(true)}
                className="mt-8 group relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/25 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Cursor
                </span>
              </button>
            </div>

            {/* Notifications Section */}
            <div className="w-full mx-auto mt-8 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 text-left">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Pending Submissions
                  {pendingSubmissions.length > 0 && (
                    <span className="bg-violet-500/20 text-violet-400 text-xs px-2 py-0.5 rounded-full">
                      {pendingSubmissions.length}
                    </span>
                  )}
                </h2>
                <button onClick={fetchSubmissions} className="p-2 text-white/40 hover:text-white/80 transition-colors" title="Refresh">
                  <svg className={`w-4 h-4 ${isLoadingSubmissions ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {isLoadingSubmissions ? (
                <div className="flex justify-center py-8">
                   <svg className="w-6 h-6 animate-spin text-white/20" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                   </svg>
                </div>
              ) : pendingSubmissions.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-6">No pending cursor submissions.</p>
              ) : (
                <div className="space-y-3">
                  {pendingSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-violet-500/30 transition-all group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                           <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                           </svg>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">
                            Asset ID: <span className="font-mono">{sub.asset_id}</span>
                          </p>
                          <p className="text-xs text-white/30 mt-0.5">
                            Submitted {new Date(sub.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <a
                          href={`https://create.roblox.com/store/asset/${sub.asset_id}/Cursor`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Review
                        </a>
                        <button
                          onClick={() => handleReviewClick(sub)}
                          title="Manage"
                          className="flex items-center justify-center p-2 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {isLoggedIn && (
          <AdminPanel
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            onAddCursor={addCursor}
            onDeleteCursor={deleteCursor}
            customCursors={customCursors}
            onLogout={handleLogout}
          />
        )}

        {isLoggedIn && (
          <ReviewModal
            isOpen={isReviewModalOpen}
            submission={reviewingSubmission}
            onClose={() => setIsReviewModalOpen(false)}
            onAccept={handleAcceptSubmission}
            onReject={handleRejectSubmission}
          />
        )}
      </div>
    </main>
  );
}
