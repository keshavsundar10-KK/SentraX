import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#080b10]/80 px-8 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Security Operations
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">
          AI Task Integrity Monitor
        </h2>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 md:flex">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
          />
        </div>

        <button className="relative text-gray-400 hover:text-white">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-semibold text-cyan-400">
          SK
        </div>
      </div>
    </header>
  );
}