"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { api } from "@/lib/api";
import { useAuth } from "./AppProviders";
import type { Brief } from "@/lib/types";

interface PlayerContextValue {
  brief: Brief | null;
  loading: boolean;
  currentIndex: number;
  positionSec: number;
  isPlaying: boolean;
  refresh: () => Promise<void>;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seekToStory: (index: number) => void;
  toggleSaveCurrent: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [positionSec, setPositionSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setBrief(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<Brief>("/briefs/today");
      setBrief(data);
      setCurrentIndex(data.progress.currentStoryIndex || 0);
      setPositionSec(data.progress.currentPositionSec || 0);
      setIsPlaying(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial brief load once the user is known
    refresh();
  }, [refresh]);

  const persist = useCallback(
    (patch: Partial<{ currentStoryIndex: number; currentPositionSec: number; isPlaying: boolean }>) => {
      if (!brief) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        api.patch(`/briefs/${brief.id}/progress`, patch).catch(() => null);
      }, 400);
    },
    [brief]
  );

  const currentStory = brief?.stories[currentIndex] ?? null;
  const duration = currentStory?.durationSec ?? 0;

  // There's no real hosted audio for the mock stories, so narration is done
  // with the browser's built-in text-to-speech instead — Play genuinely
  // reads the story aloud rather than just animating a silent progress bar.
  const currentStoryId = currentStory?.id;
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    if (!isPlaying || !currentStory) return;

    const utterance = new SpeechSynthesisUtterance(`${currentStory.title}. ${currentStory.summary}`);
    utterance.lang = user?.onboarding.language === "hi-IN" ? "hi-IN" : "en-US";
    utterance.rate = 0.98;
    synth.speak(utterance);

    return () => synth.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on story id, not the object reference
  }, [isPlaying, currentStoryId, user?.onboarding.language]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isPlaying || !currentStory) return;

    intervalRef.current = setInterval(() => {
      setPositionSec((prev) => {
        const nextPos = prev + 1;
        if (nextPos >= duration) {
          setCurrentIndex((i) => Math.min(i + 1, (brief?.stories.length ?? 1) - 1));
          return 0;
        }
        return nextPos;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStory, duration, brief]);

  useEffect(() => {
    persist({ currentStoryIndex: currentIndex, currentPositionSec: positionSec, isPlaying });
  }, [currentIndex, positionSec, isPlaying, persist]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const toggle = () => setIsPlaying((p) => !p);
  const next = () => {
    if (!brief) return;
    setCurrentIndex((i) => Math.min(i + 1, brief.stories.length - 1));
    setPositionSec(0);
  };
  const prev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
    setPositionSec(0);
  };
  const seekToStory = (index: number) => {
    setCurrentIndex(index);
    setPositionSec(0);
  };

  const toggleSaveCurrent = useCallback(async () => {
    if (!brief || !currentStory) return;
    const saved = !currentStory.saved;
    setBrief({
      ...brief,
      stories: brief.stories.map((s, i) => (i === currentIndex ? { ...s, saved } : s)),
    });
    if (saved) await api.post(`/stories/${currentStory.id}/save`);
    else await api.del(`/stories/${currentStory.id}/save`);
  }, [brief, currentStory, currentIndex]);

  return (
    <PlayerContext.Provider
      value={{
        brief,
        loading,
        currentIndex,
        positionSec,
        isPlaying,
        refresh,
        play,
        pause,
        toggle,
        next,
        prev,
        seekToStory,
        toggleSaveCurrent,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
