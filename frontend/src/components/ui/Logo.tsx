import { AudioLines } from "lucide-react";

export function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const big = size === "lg";
  return (
    <div className={`flex items-center gap-2 ${big ? "gap-2.5" : "gap-1.5"}`}>
      <div
        className={`flex items-center justify-center rounded-lg ${big ? "w-9 h-9" : "w-6 h-6"}`}
        style={{ background: "var(--accent-grad)" }}
      >
        <AudioLines size={big ? 18 : 13} className="text-white" strokeWidth={2.5} />
      </div>
      <span className={`font-semibold tracking-tight ${big ? "text-xl" : "text-sm"}`}>
        Nuzio<span style={{ color: "var(--accent-1)" }}>AI</span>
      </span>
    </div>
  );
}
