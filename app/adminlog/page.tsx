"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLoginModal from "../components/AdminLoginModal";
import AdminPanel from "../components/AdminPanel";
import { useAdmin } from "../hooks/useAdmin";
import { useCursorStore } from "../hooks/useCursorStore";

export default function AdminPage() {
  const router = useRouter();
  const { isLoggedIn, login, logout, isLoaded } = useAdmin();
  const { customCursors, addCursor, deleteCursor } = useCursorStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleLoginSuccess = (username: string, password: string) => {
    return login(username, password);
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
                  Open Admin Panel
                </span>
              </button>
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
      </div>
    </main>
  );
}
