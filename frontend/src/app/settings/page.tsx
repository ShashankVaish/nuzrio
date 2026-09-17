"use client";

import Link from "next/link";
import clsx from "clsx";
import { ChevronRight, Bookmark, CreditCard, Moon, Sun, Package, RefreshCw, Bell } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { AppShell } from "@/components/AppShell";
import { Toggle } from "@/components/ui/Toggle";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { useAuth } from "@/context/AppProviders";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const { user, loading } = useRequireAuth();
  const { setUser } = useAuth();

  if (loading || !user) return null;
  const currentUser = user;

  async function updatePreferences(patch: Partial<typeof currentUser.preferences>) {
    const updated = await api.patch<typeof currentUser.preferences>("/settings/preferences", patch);
    setUser({ ...currentUser, preferences: updated });
  }

  const plan = user.subscription.planId === "free" ? "Free" : "Pro";

  return (
    <AppShell>
    <div className="min-h-dvh flex flex-col">
      <TopBar />

      <div className="px-5 sm:px-6 lg:px-10 mt-6 lg:max-w-2xl">
        <h1 className="text-2xl lg:text-[28px] font-semibold">Settings</h1>
        <p className="text-text-dim text-sm mt-1">Tune your morning.</p>

        <div className="mt-5 rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-4">
            <span
              className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"
              style={{ background: "var(--accent-grad)" }}
            >
              {user.name[0]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-text-dim truncate">
                {user.onboarding.profession} · {user.city ?? "—"}
              </p>
            </div>
            <span className="text-xs font-semibold flex items-center gap-0.5" style={{ color: "var(--accent-1)" }}>
              Edit <ChevronRight size={13} />
            </span>
          </div>

          <SettingsRow icon={Bookmark} label="Saved stories" value="View" href="/settings/saved" />
          <Link href="/settings/billing" className="flex items-center gap-3 px-4 py-4">
            <CreditCard size={17} className="text-text-dim" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Plan & billing</p>
              <p className="text-xs text-text-dim">{plan} — upgrade for unlimited</p>
            </div>
            <span className="text-xs font-semibold" style={{ color: "var(--accent-1)" }}>
              {plan} <ChevronRight size={13} className="inline" />
            </span>
          </Link>
        </div>

        <p className="text-[11px] font-semibold tracking-[0.15em] text-text-faint mt-6">APPEARANCE</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {(["dark", "light"] as const).map((theme) => (
            <button
              key={theme}
              onClick={() => updatePreferences({ theme })}
              className={clsx(
                "h-11 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2",
                user.preferences.theme === theme ? "text-white" : "bg-surface text-text-dim border border-border"
              )}
              style={user.preferences.theme === theme ? { background: "var(--accent-grad)" } : undefined}
            >
              {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
              {theme === "dark" ? "Dark" : "Light"}
            </button>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden">
          <ToggleRow
            icon={Package}
            title="Offline mode"
            desc="Download briefs for the commute"
            checked={user.preferences.offlineMode}
            onChange={(v) => updatePreferences({ offlineMode: v })}
          />
          <ToggleRow
            icon={RefreshCw}
            title="Auto-advance"
            desc="Play the next story automatically"
            checked={user.preferences.autoAdvance}
            onChange={(v) => updatePreferences({ autoAdvance: v })}
          />
          <ToggleRow
            icon={Bell}
            title="Push notifications"
            desc="Brief drops & breaking stories"
            checked={user.preferences.pushNotifications}
            onChange={(v) => updatePreferences({ pushNotifications: v })}
          />
        </div>
      </div>

      <div className="flex-1" />
      <BottomNav />
    </div>
    </AppShell>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Bookmark;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-4">
      <Icon size={17} className="text-text-dim" />
      <p className="flex-1 text-sm font-semibold">{label}</p>
      <span className="text-xs text-text-dim flex items-center gap-0.5">
        {value} <ChevronRight size={13} />
      </span>
    </Link>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  desc,
  checked,
  onChange,
}: {
  icon: typeof Package;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <Icon size={17} className="text-text-dim" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-text-dim truncate">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
