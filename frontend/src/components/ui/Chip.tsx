"use client";

import clsx from "clsx";
import { Check } from "lucide-react";

interface ChipProps {
  label: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function Chip({ label, icon, selected, onClick, disabled }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "flex items-center gap-1.5 rounded-2xl border px-3.5 py-3 text-[13px] font-medium transition-colors",
        selected
          ? "border-[var(--accent-1)] bg-[rgba(139,124,246,0.14)] text-white"
          : "border-border bg-surface text-text-dim",
        disabled && !selected && "opacity-40"
      )}
    >
      {icon && <span className="text-[15px] leading-none">{icon}</span>}
      <span className="truncate">{label}</span>
      {selected && <Check size={13} strokeWidth={3} style={{ color: "var(--accent-1)" }} />}
    </button>
  );
}
