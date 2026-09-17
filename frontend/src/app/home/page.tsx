"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Play, Pause, SkipBack, SkipForward, Bookmark, ExternalLink } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { AppShell } from "@/components/AppShell";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { usePlayer } from "@/context/PlayerContext";
import { waveformBars, formatDuration } from "@/lib/waveform";
import { nicheShort } from "@/lib/icons";

export default function HomePage() {
  const { user, loading } = useRequireAuth();
  const { brief, loading: briefLoading, currentIndex, positionSec, isPlaying, toggle, next, prev, seekToStory, toggleSaveCurrent } =
    usePlayer();
  const [tab, setTab] = useState("All");
  const [rate, setRate] = useState(1);

  const niches = useMemo(() => ["All", ...(brief?.niches ?? [])], [brief]);
  const story = brief?.stories[currentIndex];
  const nextStory = brief?.stories[currentIndex + 1];
  const bars = useMemo(() => waveformBars(story?.id ?? "seed"), [story?.id]);
  const progressPct = story?.durationSec ? Math.min(100, (positionSec / story.durationSec) * 100) : 0;

  if (loading || !user) return null;

  const dateLabel = brief
    ? new Date(brief.date)
        .toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "long" })
        .toUpperCase()
    : "";

  return (
    <AppShell>
    <div className="min-h-dvh flex flex-col">
      <TopBar />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:px-10 lg:pt-2 lg:max-w-6xl lg:mx-auto lg:items-start">
      <div>
      <div className="mt-5 px-5 sm:px-6 lg:px-0 pb-3 border-b border-border">
        <div className="flex gap-2 overflow-x-auto">
          {niches.map((n) => (
            <button
              key={n}
              onClick={() => setTab(n)}
              className={clsx(
                "shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors",
                tab === n ? "text-black" : "bg-surface text-text-dim border border-border"
              )}
              style={tab === n ? { background: "var(--success-grad)" } : undefined}
            >
              {n === "All" ? "All" : nicheShort[n] ?? n}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 sm:px-6 lg:px-0 mt-6">
        <p className="text-[11px] font-semibold tracking-[0.15em]" style={{ color: "var(--accent-1)" }}>
          {dateLabel} · MORNING BRIEF
        </p>
        <h1 className="text-[24px] lg:text-[28px] font-semibold leading-snug mt-1">
          Good morning, {user.name.split(" ")[0]} —<br />
          <span className="accent-text text-[26px] lg:text-[30px]">{brief?.stories.length ?? 0} things.</span>
        </h1>
        <div className="flex items-center gap-2 mt-2 text-xs text-text-dim flex-wrap">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--success-1)" }} />
          <span>Audio live</span>
          <span>·</span>
          <span>Voice: {user.onboarding.voiceId ? user.onboarding.voiceId[0].toUpperCase() + user.onboarding.voiceId.slice(1) : "—"}</span>
          <span>·</span>
          <span>
            {brief?.stories.length ?? 0} stories · {formatDuration(brief?.totalDurationSec ?? 0)}
          </span>
        </div>
      </div>

      {briefLoading && <p className="px-5 sm:px-6 lg:px-0 mt-8 text-sm text-text-dim">Curating your brief…</p>}

      {story && (
        <div className="px-5 sm:px-6 lg:px-0 mt-5">
          <div className="rounded-3xl border border-border bg-surface p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-text-dim bg-surface-2 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--success-1)" }} />
                NOW PLAYING · {(nicheShort[story.niche] ?? story.niche).toUpperCase()}
              </span>
              <span className="text-[11px] text-text-faint">
                {(currentIndex + 1).toString().padStart(2, "0")} / {brief!.stories.length.toString().padStart(2, "0")}
              </span>
            </div>

            <p className="font-semibold text-[17px] leading-snug mt-3">{story.title}</p>

            <div className="flex items-center justify-between mt-2 text-[11px] text-text-dim">
              <span className="flex items-center gap-2 uppercase tracking-wide">
                {story.source} · {story.readMinutes} min ·{" "}
                <a href={story.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-0.5">
                  source <ExternalLink size={10} />
                </a>
              </span>
              <button onClick={toggleSaveCurrent} className="flex items-center gap-1 uppercase tracking-wide font-semibold" style={story.saved ? { color: "var(--accent-1)" } : undefined}>
                <Bookmark size={12} fill={story.saved ? "var(--accent-1)" : "none"} /> Save
              </button>
            </div>

            {nextStory && <p className="mt-2 text-xs text-text-faint truncate">{nextStory.title}</p>}

            <div className="mt-4 h-10 flex items-end gap-[3px]">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    height: `${h * 100}%`,
                    background: i / bars.length <= progressPct / 100 ? "var(--accent-1)" : "var(--border-strong)",
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-text-faint mt-1">
              <span>{formatDuration(positionSec)}</span>
              <span>-{formatDuration((story.durationSec || 0) - positionSec)}</span>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <button onClick={prev} className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center">
                <SkipBack size={15} className="text-text" fill="currentColor" />
              </button>
              <button
                onClick={toggle}
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "var(--accent-grad)" }}
              >
                {isPlaying ? (
                  <Pause size={22} className="text-white" fill="white" />
                ) : (
                  <Play size={22} className="text-white ml-0.5" fill="white" />
                )}
              </button>
              <button onClick={next} className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center">
                <SkipForward size={15} className="text-text" fill="currentColor" />
              </button>
              <button
                onClick={() => setRate((r) => (r === 1 ? 1.5 : r === 1.5 ? 2 : 1))}
                className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-[11px] font-bold"
              >
                {rate}x
              </button>
            </div>
          </div>

          {isPlaying && (
            <p className="mt-3 text-[13px] text-center lg:text-left" style={{ color: "var(--success-1)" }}>
              🔊 Now narrating — {story.title.slice(0, 40)}…
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2 lg:hidden">
            {brief!.stories.map((s, i) => (
              <button
                key={s.id}
                onClick={() => seekToStory(i)}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left border",
                  i === currentIndex ? "border-[var(--accent-1)] bg-[rgba(139,124,246,0.08)]" : "border-transparent"
                )}
              >
                <span className="w-6 text-[11px] text-text-faint">{i + 1}</span>
                <span className="flex-1 min-w-0 text-sm truncate">{s.title}</span>
                <span className="text-[10px] text-text-faint">{formatDuration(s.durationSec)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      </div>

      {story && (
        <div className="hidden lg:block lg:sticky lg:top-6">
          <p className="text-[11px] font-semibold tracking-widest text-text-faint">UP NEXT</p>
          <div className="mt-3 flex flex-col gap-2">
            {brief!.stories.map((s, i) => (
              <button
                key={s.id}
                onClick={() => seekToStory(i)}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left border",
                  i === currentIndex ? "border-[var(--accent-1)] bg-[rgba(139,124,246,0.08)]" : "border-transparent bg-surface"
                )}
              >
                <span className="w-6 text-[11px] text-text-faint">{i + 1}</span>
                <span className="flex-1 min-w-0 text-sm truncate">{s.title}</span>
                <span className="text-[10px] text-text-faint">{formatDuration(s.durationSec)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      </div>

      <div className="flex-1" />
      <BottomNav />
    </div>
    </AppShell>
  );
}
