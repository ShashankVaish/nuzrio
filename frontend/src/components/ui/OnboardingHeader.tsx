import { Logo } from "./Logo";

interface OnboardingHeaderProps {
  step: number;
  totalSteps?: number;
  onSkip: () => void;
  skipping?: boolean;
}

export function OnboardingHeader({ step, totalSteps = 6, onSkip, skipping }: OnboardingHeaderProps) {
  return (
    <div className="px-6 pt-6">
      <div className="flex items-center justify-between">
        <Logo />
        <button
          onClick={onSkip}
          disabled={skipping}
          className="text-xs font-medium text-text-dim tracking-wide disabled:opacity-50"
        >
          {skipping ? "SKIPPING…" : "SKIP →"}
        </button>
      </div>

      <div className="mt-5 flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-surface-2">
            {i < step && <div className="h-full w-full" style={{ background: "var(--accent-grad)" }} />}
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11px] font-semibold tracking-[0.15em] text-accent-1" style={{ color: "var(--accent-1)" }}>
        STEP {step} OF {totalSteps}
      </p>
    </div>
  );
}
