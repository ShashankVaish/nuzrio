"use client";

import type { User } from "@/lib/types";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Play, Pause, Check } from "lucide-react";
import { OnboardingHeader } from "@/components/ui/OnboardingHeader";
import { StepHeading } from "@/components/ui/StepHeading";
import { Button } from "@/components/ui/Button";
import { useCatalog } from "@/lib/useCatalog";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AppProviders";

export default function VoiceStep() {
  const router = useRouter();
  const { catalog } = useCatalog();
  const { user, loading } = useRequireAuth();
  const { setUser } = useAuth();
  const [voiceId, setVoiceId] = useState<string | null>(user?.onboarding.voiceId ?? "aria");
  const [lengthId, setLengthId] = useState<string | null>(user?.onboarding.briefLengthId ?? "5min");
  const [customMinutes, setCustomMinutes] = useState<number>(user?.onboarding.customBriefMinutes ?? 12);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (loading || !user || !catalog) return null;

  function playSample(id: string, url: string) {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch(() => null);
    audio.onended = () => setPlayingId(null);
    setPlayingId(id);
  }

  const selectedLength = catalog.briefLengths.find((l) => l.id === lengthId);
  const minutes = lengthId === "custom" ? customMinutes : selectedLength?.minutes ?? 5;
  const storyCount = Math.min(10, Math.max(3, Math.round(minutes / 3)));
  const voiceName = catalog.voices.find((v) => v.id === voiceId)?.name ?? "";

  async function handleContinue() {
    if (!voiceId || !lengthId) return;
    setSaving(true);
    try {
      const updated = await api.put("/onboarding/voice", {
        voiceId,
        briefLengthId: lengthId,
        customBriefMinutes: lengthId === "custom" ? customMinutes : undefined,
      });
      setUser(updated as User);
      router.push("/onboarding/schedule");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col pb-8 auth-card">
      <OnboardingHeader step={3} />
      <StepHeading title="Pick a" accent="narrator voice." subtitle="Tap ▶ to hear a 10-second sample." />

      <div className="px-6 mt-6 flex flex-col gap-3">
        {catalog.voices.map((v) => {
          const selected = voiceId === v.id;
          const initial = v.name[0];
          return (
            <button
              key={v.id}
              onClick={() => setVoiceId(v.id)}
              className={clsx(
                "flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors",
                selected ? "border-[var(--accent-1)] bg-[rgba(139,124,246,0.1)]" : "border-border bg-surface"
              )}
            >
              <span
                className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"
                style={{ background: "var(--accent-grad)" }}
              >
                {initial}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold text-[15px]">{v.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-2 text-text-dim">
                    {v.languageLabel}
                  </span>
                </span>
                <span className="block text-xs text-text-dim mt-0.5 truncate">
                  {v.description}, {v.accent}
                </span>
              </span>
              {selected ? (
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--success-grad)" }}
                >
                  <Check size={13} strokeWidth={3} className="text-black" />
                </span>
              ) : null}
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playSample(v.id, v.sampleUrl);
                }}
                className={clsx(
                  "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                  selected ? "bg-[var(--accent-1)]" : "bg-surface-2"
                )}
              >
                {playingId === v.id ? (
                  <Pause size={14} className="text-white" fill="white" />
                ) : (
                  <Play size={14} className="text-white ml-0.5" fill="white" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="px-6 mt-7">
        <p className="text-[11px] font-semibold tracking-[0.15em]" style={{ color: "var(--accent-1)" }}>
          BRIEF LENGTH
        </p>
        <h2 className="text-xl font-semibold mt-1">
          How long is
          <br />
          <span className="accent-text text-2xl">your morning?</span>
        </h2>
        <p className="text-text-dim text-sm mt-1">Set your ideal brief length.</p>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {catalog.briefLengths.map((l) => (
            <button
              key={l.id}
              onClick={() => setLengthId(l.id)}
              className={clsx(
                "h-11 rounded-xl text-[13px] font-semibold transition-colors",
                lengthId === l.id ? "text-white" : "bg-surface text-text-dim border border-border"
              )}
              style={lengthId === l.id ? { background: "var(--accent-grad)" } : undefined}
            >
              {l.label}
            </button>
          ))}
        </div>

        {lengthId === "custom" && (
          <div className="mt-4 flex items-center gap-3">
            <input
              type="range"
              min={3}
              max={30}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Number(e.target.value))}
              className="flex-1 accent-[var(--accent-1)]"
            />
            <span className="text-sm font-semibold w-16 text-right">{customMinutes} min</span>
          </div>
        )}
      </div>

      <div className="flex-1" />
      <div className="px-6 mt-8">
        <Button withArrow disabled={!voiceId || !lengthId || saving} onClick={handleContinue}>
          Continue with {voiceName} · {storyCount} stories
        </Button>
      </div>
    </div>
  );
}
