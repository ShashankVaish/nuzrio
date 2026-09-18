"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Star } from "lucide-react";
import { useRequireOnboarded } from "@/lib/useRequireOnboarded";
import { api } from "@/lib/api";
import type { StoryCard } from "@/lib/types";
import { nicheShort } from "@/lib/icons";
import { AppShell } from "@/components/AppShell";

export default function SavedStoriesPage() {
  const { user, loading } = useRequireOnboarded();
  const [stories, setStories] = useState<StoryCard[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .get<StoryCard[]>("/stories/saved")
      .then(setStories)
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || !user) return null;

  async function unsave(id: string) {
    setStories((prev) => prev.filter((s) => s.id !== id));
    await api.del(`/stories/${id}/save`);
  }

  return (
    <AppShell>
    <div className="min-h-dvh flex flex-col px-5 sm:px-6 lg:px-10 pt-6 pb-8 lg:max-w-4xl">
      <Link href="/settings" className="flex items-center gap-1 text-sm text-text-dim">
        <ChevronLeft size={16} /> Settings
      </Link>
      <h1 className="text-2xl lg:text-[28px] font-semibold mt-4">Saved stories</h1>
      <p className="text-text-dim text-sm mt-1">{stories.length} saved</p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {fetching && <p className="text-sm text-text-dim sm:col-span-2 lg:col-span-3">Loading…</p>}
        {!fetching && stories.length === 0 && (
          <p className="text-sm text-text-dim sm:col-span-2 lg:col-span-3">Nothing saved yet.</p>
        )}
        {stories.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border bg-surface p-4">
            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-surface-2 text-text-dim">
              {(nicheShort[s.niche] ?? s.niche).toUpperCase()}
            </span>
            <p className="font-semibold text-sm mt-2">{s.title}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-text-faint">{s.source} · {s.readMinutes} min</span>
              <button onClick={() => unsave(s.id)}>
                <Star size={16} fill="var(--accent-1)" style={{ color: "var(--accent-1)" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AppShell>
  );
}
