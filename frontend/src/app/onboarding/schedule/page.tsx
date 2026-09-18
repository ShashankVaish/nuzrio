"use client";

import type { User } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { OnboardingHeader } from "@/components/ui/OnboardingHeader";
import { useSkipOnboarding } from "@/lib/useSkipOnboarding";
import { StepHeading } from "@/components/ui/StepHeading";
import { Button } from "@/components/ui/Button";
import { useCatalog } from "@/lib/useCatalog";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AppProviders";

function formatTime(slot: string) {
  const [h, m] = slot.split(":");
  const hour = Number(h) % 12 || 12;
  return `${hour}:${m}`;
}

export default function ScheduleStep() {
  const router = useRouter();
  const { catalog } = useCatalog();
  const { user, loading } = useRequireAuth();
  const { setUser } = useAuth();
  const { skip, skipping } = useSkipOnboarding();
  const [period, setPeriod] = useState<"AM" | "PM">(user?.onboarding.deliveryPeriod ?? "AM");
  const [time, setTime] = useState(user?.onboarding.deliveryTime ?? "07:00");
  const [saving, setSaving] = useState(false);

  if (loading || !user || !catalog) return null;

  async function handleContinue() {
    setSaving(true);
    try {
      const updated = await api.put("/onboarding/schedule", { deliveryPeriod: period, deliveryTime: time });
      setUser(updated as User);
      router.push("/onboarding/notifications");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col pb-8 auth-card">
      <OnboardingHeader step={4} onSkip={skip} skipping={skipping} />
      <StepHeading
        title="When do you"
        accent="want your brief?"
        subtitle="Nuzio will have your brief ready and waiting each morning."
      />

      <div className="px-6 mt-6 grid grid-cols-2 gap-2.5">
        {(["AM", "PM"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={clsx(
              "h-12 rounded-2xl font-semibold text-sm transition-colors",
              period === p ? "text-white" : "bg-surface text-text-dim border border-border"
            )}
            style={period === p ? { background: "var(--accent-grad)" } : undefined}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-col items-stretch">
        {catalog.deliveryTimeSlots.map((slot) => {
          const selected = slot === time;
          return (
            <button
              key={slot}
              onClick={() => setTime(slot)}
              className={clsx(
                "py-3 text-center transition-all",
                selected ? "text-[32px] font-bold text-white" : "text-lg text-text-faint"
              )}
            >
              {formatTime(slot)}
              {selected && <span className="text-sm font-semibold text-text-dim ml-2">{period}</span>}
            </button>
          );
        })}
      </div>

      <div className="flex-1" />
      <div className="px-6 mt-8">
        <Button withArrow disabled={saving} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
