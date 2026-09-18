"use client";

import type { User } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "@/components/ui/OnboardingHeader";
import { useSkipOnboarding } from "@/lib/useSkipOnboarding";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { useCatalog } from "@/lib/useCatalog";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { nicheIcons } from "@/lib/icons";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AppProviders";

export default function NichesStep() {
  const router = useRouter();
  const { catalog } = useCatalog();
  const { user, loading } = useRequireAuth();
  const { setUser } = useAuth();
  const { skip, skipping } = useSkipOnboarding();
  const [niches, setNiches] = useState<string[]>(user?.onboarding.niches ?? []);
  const [saving, setSaving] = useState(false);

  if (loading || !user || !catalog) return null;

  const max = catalog.maxNiches;

  function toggle(n: string) {
    setNiches((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= max) return prev;
      return [...prev, n];
    });
  }

  async function handleContinue() {
    if (niches.length === 0) return;
    setSaving(true);
    try {
      const updated = await api.put("/onboarding/niches", { niches });
      setUser(updated as User);
      router.push("/onboarding/voice");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col pb-8 auth-card">
      <OnboardingHeader step={2} onSkip={skip} skipping={skipping} />
      <div className="px-6 mt-5 flex items-start justify-between">
        <h1 className="text-[26px] font-semibold leading-tight">
          What moves
          <br />
          <span className="accent-text text-[28px]">your world?</span>
        </h1>
      </div>
      <div className="px-6 mt-2 flex items-center gap-2">
        <p className="text-text-dim text-sm">Pick up to {max} niches.</p>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[var(--success-1)] text-[var(--success-1)]">
          {niches.length}/{max}
        </span>
      </div>

      <div className="px-6 mt-6 flex flex-wrap gap-2.5">
        {catalog.niches.map((n) => (
          <Chip
            key={n}
            label={n}
            icon={nicheIcons[n]}
            selected={niches.includes(n)}
            disabled={!niches.includes(n) && niches.length >= max}
            onClick={() => toggle(n)}
          />
        ))}
      </div>

      <div className="flex-1" />
      <div className="px-6 mt-8">
        <Button withArrow disabled={niches.length === 0 || saving} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
