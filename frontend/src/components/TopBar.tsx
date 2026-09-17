"use client";

import { Search, Bell } from "lucide-react";
import { Logo } from "./ui/Logo";

export function TopBar() {
  return (
    <div className="flex items-center px-5 sm:px-6 lg:px-10 pt-6 lg:max-w-5xl lg:mx-auto">
      <div className="lg:hidden">
        <Logo />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c6cf6, #4f8bf0)" }}
        >
          <Search size={16} className="text-white" />
        </button>
        <button
          className="relative w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #f6b545, #f0854f)" }}
        >
          <Bell size={16} className="text-white" />
          <span
            className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2"
            style={{ background: "var(--accent-1)", borderColor: "var(--bg)" }}
          />
        </button>
      </div>
    </div>
  );
}
