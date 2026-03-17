export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05] bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center">
          {/* Copyright */}
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} cursorX. Open source & free forever.
          </p>
        </div>
      </div>
    </footer>
  );
}
