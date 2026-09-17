"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Home, Compass, Settings as SettingsIcon, CreditCard, Play, Pause, Sparkles } from "lucide-react";
import { Logo } from "./ui/Logo";
import { useAuth } from "@/context/AppProviders";
import { usePlayer } from "@/context/PlayerContext";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { brief, currentIndex, isPlaying, toggle } = usePlayer();
  const story = brief?.stories[currentIndex];

  if (!user) return null;

  const isFree = user.subscription.planId === "free";

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[272px] lg:shrink-0 lg:h-dvh lg:sticky lg:top-0 border-r border-border px-5 py-6">
      <div className="px-2">
        <Logo size="lg" />
      </div>

      <nav className="mt-9 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                active ? "text-white bg-[rgba(139,124,246,0.14)]" : "text-text-dim hover:text-text"
              )}
            >
              <item.icon size={18} style={active ? { color: "var(--accent-1)" } : undefined} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {story && (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-4">
          <p className="text-[10px] font-semibold tracking-widest text-text-faint">NOW PLAYING</p>
          <p className="text-sm font-semibold mt-2 leading-snug line-clamp-2">{story.title}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-text-dim">{story.source}</span>
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "var(--accent-grad)" }}
            >
              {isPlaying ? (
                <Pause size={14} className="text-white" fill="white" />
              ) : (
                <Play size={14} className="text-white ml-0.5" fill="white" />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1" />

      {isFree && (
        <Link
          href="/settings/billing"
          className="mb-4 rounded-2xl p-4 flex flex-col gap-2"
          style={{ background: "linear-gradient(135deg, rgba(139,124,246,0.16), rgba(52,211,153,0.12))", border: "1px solid var(--border)" }}
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--accent-1)" }}>
            <Sparkles size={13} /> Go Pro
          </span>
          <span className="text-xs text-text-dim">Unlimited briefings, premium voices, offline mode.</span>
        </Link>
      )}

      <Link href="/settings" className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white text-sm flex-shrink-0"
          style={{ background: "var(--accent-grad)" }}
        >
          {user.name[0]}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold truncate">{user.name}</span>
          <span className="flex items-center gap-1 text-[11px] text-text-faint">
            <CreditCard size={11} /> {isFree ? "Free plan" : "Pro"}
          </span>
        </span>
      </Link>
    </aside>
  );
}
