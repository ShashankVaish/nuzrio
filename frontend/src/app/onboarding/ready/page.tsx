"use client";

import { useRouter } from "next/navigation";
import { Check, Laptop, Sparkles, Mic2, Clock, Sun } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { useCatalog } from "@/lib/useCatalog";
import { nicheShort } from "@/lib/icons";

export default function ReadyStep() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();
  const { catalog } = useCatalog();

  if (loading || !user || !catalog) return null;

  const voice = catalog.voices.find((v) => v.id === user.onboarding.voiceId);
  const lengthDef = catalog.briefLengths.find((l) => l.id === user.onboarding.briefLengthId);
  const minutes = lengthDef?.minutes ?? user.onboarding.customBriefMinutes ?? 5;
  const storyCount = Math.min(10, Math.max(3, Math.round(minutes / 3)));
  const niches = user.onboarding.niches;
  const nicheLabel =
    niches.length <= 2
      ? niches.map((n) => nicheShort[n] ?? n).join(", ")
      : `${niches
          .slice(0, 2)
          .map((n) => nicheShort[n] ?? n)
          .join(", ")} +${niches.length - 2}`;

  const rows = [
    { icon: Laptop, label: "PROFESSION", value: user.onboarding.profession ?? "—" },
    { icon: Sparkles, label: "NICHES", value: nicheLabel },
    { icon: Mic2, label: "VOICE", value: `${voice?.name ?? "—"} — ${voice?.description.split(" · ")[1] ?? ""}` },
    { icon: Clock, label: "LENGTH", value: `${storyCount} stories · ~${minutes} min` },
    {
      icon: Sun,
      label: "DELIVERY",
      value: `Daily at ${user.onboarding.deliveryTime} ${user.onboarding.deliveryPeriod}`,
    },
  ];

  return (
    <div className="min-h-dvh flex flex-col px-5 sm:px-6 pt-8 pb-8 auth-card">
      <div className="flex justify-center">
        <span className="text-[11px] font-semibold tracking-widest flex items-center gap-1.5 text-[var(--success-1)] border border-[var(--success-1)]/40 rounded-full px-3 py-1">
          <Check size={12} strokeWidth={3} /> ALL SET
        </span>
      </div>

      <div className="flex flex-col items-center mt-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ boxShadow: "0 0 0 1px rgba(52,211,153,0.4), 0 0 40px rgba(52,211,153,0.25)" }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "var(--success-grad)" }}>
            <Check size={36} strokeWidth={3} className="text-black" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold mt-6">You&apos;re ready,</h1>
        <p className="accent-text text-[30px] leading-tight">{user.name.split(" ")[0]}.</p>

        <p className="text-text-dim text-sm text-center mt-3 max-w-[280px]">
          Your first brief will be ready tomorrow at {user.onboarding.deliveryTime}{" "}
          {user.onboarding.deliveryPeriod}. We&apos;re already curating.
        </p>
      </div>

      <div className="mt-8">
        <p className="text-[11px] font-semibold tracking-[0.15em] text-text-faint">YOUR BRIEF PROFILE</p>
        <div className="mt-3 flex flex-col gap-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
              <row.icon size={16} style={{ color: "var(--accent-1)" }} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-text-faint tracking-wide">{row.label}</p>
                <p className="text-sm font-semibold truncate">{row.value}</p>
              </div>
              <Check size={15} strokeWidth={3} style={{ color: "var(--success-1)" }} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />
      <button
        onClick={() => router.push("/home")}
        className="w-full h-[52px] rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 text-black mt-8"
        style={{ background: "linear-gradient(135deg, var(--success-1), #38bdf8)" }}
      >
        Start listening <ArrowRight size={17} strokeWidth={2.5} />
      </button>
    </div>
  );
}
