"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "./useRequireAuth";
import { resumeOnboardingPath } from "./onboardingSteps";

// Guards Home/Discover/Settings: being logged in isn't enough to land here —
// an account that hit "Skip" partway through onboarding (or hasn't finished
// it at all) has no niches/voice set yet, which used to render a broken,
// permanently-empty Home instead of sending them back to finish setup.
export function useRequireOnboarded() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();

  useEffect(() => {
    if (!loading && user && !user.onboarding.completed) {
      router.replace(resumeOnboardingPath(user.onboarding));
    }
  }, [loading, user, router]);

  return { user: user?.onboarding.completed ? user : null, loading: loading || (!!user && !user.onboarding.completed) };
}
