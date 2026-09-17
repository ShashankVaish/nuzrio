import type { Onboarding } from "./types";

export function resumeOnboardingPath(onboarding: Onboarding): string {
  if (onboarding.completed) return "/onboarding/ready";
  if (onboarding.currentStep <= 2) return "/onboarding/profession";
  if (onboarding.currentStep === 3) return "/onboarding/niches";
  if (onboarding.currentStep === 4) return "/onboarding/voice";
  if (onboarding.currentStep === 5) return "/onboarding/schedule";
  return "/onboarding/notifications";
}
