"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AppProviders";
import { useCatalog } from "./useCatalog";
import { api } from "./api";
import type { User } from "./types";

// "Skip" is meant to fast-track a user to Home with sensible defaults, not
// leave their profile half-filled. Previously it just navigated to /home
// without saving anything, so an account that skipped early ended up with
// no niches/voice and an empty, broken-looking brief forever.
export function useSkipOnboarding() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { catalog } = useCatalog();
  const [skipping, setSkipping] = useState(false);

  async function skip() {
    if (!user || !catalog || skipping) return;
    setSkipping(true);
    try {
      const profession = user.onboarding.profession ?? catalog.professions[0];
      const niches = user.onboarding.niches.length ? user.onboarding.niches : catalog.niches.slice(0, 3);
      const voiceId = user.onboarding.voiceId ?? catalog.voices[0].id;
      const briefLengthId = user.onboarding.briefLengthId ?? catalog.briefLengths[0].id;
      const deliveryPeriod = user.onboarding.deliveryPeriod ?? "AM";
      const deliveryTime = user.onboarding.deliveryTime ?? "07:00";

      await api.put("/onboarding/profession", { profession });
      await api.put("/onboarding/niches", { niches });
      await api.put("/onboarding/voice", { voiceId, briefLengthId });
      await api.put("/onboarding/schedule", { deliveryPeriod, deliveryTime });
      const updated = await api.put<User>("/onboarding/notifications", { notificationsEnabled: false });

      setUser(updated);
      router.push("/home");
    } finally {
      setSkipping(false);
    }
  }

  return { skip, skipping };
}
