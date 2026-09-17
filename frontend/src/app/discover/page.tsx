"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Search, Play, Star } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { AppShell } from "@/components/AppShell";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { api } from "@/lib/api";
import type { StoryCard } from "@/lib/types";
import { nicheShort } from "@/lib/icons";

const TABS = ["All", "AI & Technology", "Financial Markets", "Startups", "Science"];

export default function DiscoverPage() {
  const { user, loading } = useRequireAuth();
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [stories, setStories] = useState<StoryCard[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicks off a fresh fetch whenever the filters change
    setFetching(true);
    const params = new URLSearchParams();
    if (tab !== "All") params.set("niche", tab);
    if (query) params.set("q", query);
    api
      .get<{ stories: StoryCard[] }>(`/discover?${params.toString()}`)
      .then((res) => setStories(res.stories))
      .finally(() => setFetching(false));
  }, [tab, query, user]);

  const filtered = useMemo(() => stories, [stories]);

  if (loading || !user) return null;

  async function toggleSave(story: StoryCard) {
    setStories((prev) => prev.map((s) => (s.id === story.id ? { ...s, saved: !s.saved } : s)));
    if (!story.saved) await api.post(`/stories/${story.id}/save`);
    else await api.del(`/stories/${story.id}/save`);
  }

  return (
    <AppShell>
    <div className="min-h-dvh flex flex-col">
      <TopBar />

      <div className="lg:max-w-6xl lg:mx-auto lg:w-full lg:px-10">
      <div className="px-5 sm:px-6 lg:px-0 mt-6">
        <h1 className="text-2xl lg:text-[28px] font-semibold">Discover</h1>
        <p className="text-text-dim text-sm mt-1">Inshorts-style — swipe the world.</p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-3 lg:max-w-md">
          <Search size={16} className="text-text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, sources, topics…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-faint"
          />
        </div>
      </div>

      <div className="mt-4 px-5 sm:px-6 lg:px-0 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors",
              tab === t ? "text-black" : "bg-surface text-text-dim border border-border"
            )}
            style={tab === t ? { background: "var(--success-grad)" } : undefined}
          >
            {t === "All" ? "All" : nicheShort[t] ?? t}
          </button>
        ))}
      </div>

      <div className="px-5 sm:px-6 lg:px-0 mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        {fetching && <p className="text-sm text-text-dim sm:col-span-2 lg:col-span-3">Loading stories…</p>}
        {!fetching && filtered.length === 0 && (
          <p className="text-sm text-text-dim sm:col-span-2 lg:col-span-3">No stories found.</p>
        )}

        {filtered.map((story) => (
          <div key={story.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[rgba(139,124,246,0.16)]" style={{ color: "var(--accent-1)" }}>
                {(nicheShort[story.niche] ?? story.niche).toUpperCase()}
              </span>
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-surface-2 text-text-dim">
                {story.source.toUpperCase()}
              </span>
            </div>

            <p className="font-semibold text-[15px] leading-snug mt-2.5">{story.title}</p>
            <p className="text-xs text-text-dim mt-1.5 leading-relaxed">{story.summary}</p>

            <div className="flex items-center justify-between mt-3.5">
              <span className="text-[11px] text-text-faint">{story.readMinutes} MIN READ</span>
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "var(--success-grad)" }}
                >
                  <Play size={13} className="text-black ml-0.5" fill="black" />
                </button>
                <button
                  onClick={() => toggleSave(story)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-2"
                >
                  <Star size={14} fill={story.saved ? "var(--accent-1)" : "none"} style={{ color: story.saved ? "var(--accent-1)" : "#9a9aa6" }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>

      <div className="flex-1" />
      <BottomNav />
    </div>
    </AppShell>
  );
}
