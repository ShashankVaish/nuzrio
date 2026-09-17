"use client";

import clsx from "clsx";

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={clsx("w-11 h-6 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0", !checked && "bg-surface-2")}
      style={checked ? { background: "var(--accent-grad)", justifyContent: "flex-end" } : { justifyContent: "flex-start" }}
    >
      <span className="w-5 h-5 rounded-full bg-white" />
    </button>
  );
}
