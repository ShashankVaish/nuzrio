"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Compass, Settings as SettingsIcon, Pause, Play } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

export function BottomNav() {
  const pathname = usePathname();
  const { isPlaying, toggle, brief } = usePlayer();

  return (
    <div className="sticky bottom-0 left-0 right-0 mt-6 lg:hidden">
      <div className="relative flex items-center justify-around border-t border-border bg-bg/95 backdrop-blur px-6 pt-8 pb-6">
        <button
          onClick={toggle}
          disabled={!brief}
          className="absolute -top-7 w-14 h-14 rounded-full flex items-center justify-center disabled:opacity-40 transition-shadow"
          style={{
            background: "var(--accent-grad)",
            boxShadow: isPlaying
              ? "0 0 0 3px rgba(52,211,153,0.5), 0 10px 30px -8px rgba(52,211,153,0.6)"
              : "0 10px 30px -8px rgba(107,92,246,0.7)",
          }}
        >
          {isPlaying ? (
            <Pause size={20} className="text-white" fill="white" />
          ) : (
            <Play size={20} className="text-white ml-0.5" fill="white" />
          )}
        </button>

        <NavItem href="/discover" active={pathname === "/discover"} icon={Compass} label="Discover" />
        <div className="w-14" />
        <NavItem href="/settings" active={pathname.startsWith("/settings")} icon={SettingsIcon} label="Settings" />
      </div>
    </div>
  );
}

function NavItem({
  href,
  active,
  icon: Icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: typeof Compass;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex flex-col items-center gap-1 text-[10px] font-semibold tracking-wide",
        active ? "text-text" : "text-text-faint"
      )}
    >
      <Icon size={19} style={active ? { color: "var(--accent-1)" } : undefined} />
      {label.toUpperCase()}
    </Link>
  );
}
