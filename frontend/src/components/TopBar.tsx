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
      <div className="flex items-center gap-4">
        <Search size={19} className="text-text-dim" />
        <div className="relative">
          <Bell size={19} className="text-text-dim" />
          <span
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
            style={{ background: "var(--accent-1)" }}
          />
        </div>
      </div>
    </div>
  );
}
