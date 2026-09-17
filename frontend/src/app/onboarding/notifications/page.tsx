"use client";

import type { User } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sun, Zap, Pin } from "lucide-react";
import { OnboardingHeader } from "@/components/ui/OnboardingHeader";
import { StepHeading } from "@/components/ui/StepHeading";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AppProviders";

const items = [
  {
    icon: Sun,
    title: "Morning brief ready",
    desc: "Your daily audio briefing is waiting",
    when: "Daily · 7:00 AM",
  },
  {
    icon: Zap,
    title: "Breaking story",
    desc: "A major story just broke in your niches",
    when: "When it happens",
  },
  {
    icon: Pin,
    title: "Weekly digest",
    desc: "The most-saved stories from this week",
    when: "Sundays · 9:00 AM",
  },
];

export default function NotificationsStep() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();
  const { setUser } = useAuth();
  const [saving, setSaving] = useState(false);

  if (loading || !user) return null;

  async function finish(enabled: boolean) {
    setSaving(true);
    try {
      const updated = await api.put("/onboarding/notifications", { notificationsEnabled: enabled });
      setUser(updated as User);
      router.push("/onboarding/ready");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col pb-8 auth-card">
      <OnboardingHeader step={5} />
      <StepHeading title="Stay in" accent="the loop." subtitle="Turn on notifications so you never miss your brief." />

      <div className="px-6 mt-6">
        <div className="rounded-2xl border border-border bg-surface px-4 py-3.5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent-grad)" }}>
            <Logo />
          </div>
          <div className="flex-1 min-w-0 -ml-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold">Nuzio</span>
              <span className="text-[11px] text-text-faint">NOW</span>
            </div>
            <p className="text-[13px] mt-0.5">
              <span>☀️</span> Your morning brief is ready
            </p>
            <p className="text-xs text-text-dim mt-0.5">6 stories · AI & Tech, Startups · Voice: Aria · 18:30</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-7">
        <p className="text-[11px] font-semibold tracking-[0.15em] text-text-faint">WHAT YOU&apos;LL RECEIVE</p>
        <div className="mt-3 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-2 flex-shrink-0">
                <item.icon size={17} style={{ color: "var(--accent-1)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold">{item.title}</p>
                <p className="text-xs text-text-dim truncate">{item.desc}</p>
              </div>
              <p className="text-[11px] text-text-faint text-right flex-shrink-0">{item.when}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />
      <div className="px-6 mt-8 flex flex-col gap-3">
        <Button disabled={saving} onClick={() => finish(true)}>
          Allow notifications
        </Button>
        <Button variant="outline" disabled={saving} onClick={() => finish(false)}>
          Not now
        </Button>
      </div>
    </div>
  );
}
