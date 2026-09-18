"use client";

import type { User } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "@/components/ui/OnboardingHeader";
import { useSkipOnboarding } from "@/lib/useSkipOnboarding";
import { StepHeading } from "@/components/ui/StepHeading";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { useCatalog } from "@/lib/useCatalog";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { professionIcons } from "@/lib/icons";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AppProviders";

export default function ProfessionStep() {
  const router = useRouter();
  const { catalog } = useCatalog();
  const { user, loading } = useRequireAuth();
  const { setUser } = useAuth();
  const { skip, skipping } = useSkipOnboarding();
  const [profession, setProfession] = useState<string | null>(user?.onboarding.profession ?? null);
  const [saving, setSaving] = useState(false);

  if (loading || !user) return null;

  async function handleContinue() {
    if (!profession) return;
    setSaving(true);
    try {
      const updated = await api.put("/onboarding/profession", { profession });
      setUser(updated as User);
      router.push("/onboarding/niches");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col pb-8 auth-card">
      <OnboardingHeader step={1} onSkip={skip} skipping={skipping} />
      <StepHeading
        title="What's your"
        accent="profession?"
        subtitle="We'll tune every brief to what actually moves your day."
      />

      <div className="px-6 mt-6 flex flex-wrap gap-2.5">
        {(catalog?.professions ?? []).map((p) => (
          <Chip
            key={p}
            label={p}
            icon={professionIcons[p]}
            selected={profession === p}
            onClick={() => setProfession(p)}
          />
        ))}
      </div>

      <div className="flex-1" />
      <div className="px-6 mt-8">
        <Button withArrow disabled={!profession || saving} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
