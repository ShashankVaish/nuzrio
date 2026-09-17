"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AudioLines } from "lucide-react";
import { useAuth } from "@/context/AppProviders";

export default function SplashPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      if (!user) router.replace("/language");
      else if (!user.onboarding.completed) router.replace("/onboarding/profession");
      else router.replace("/home");
    }, 1600);
    return () => clearTimeout(timer);
  }, [loading, user, router]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between py-16 sm:py-20 px-6 sm:px-8 auth-card">
      <div />

      <div className="flex flex-col items-center gap-6">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--accent-grad)", boxShadow: "0 20px 60px -15px rgba(107,92,246,0.6)" }}
        >
          <AudioLines size={36} className="text-white" strokeWidth={2.2} />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold tracking-tight">
            Nuzio<span style={{ color: "var(--accent-1)" }}>AI</span>
          </p>
        </div>

        <div className="text-center mt-2">
          <p className="accent-text text-3xl">News on go</p>
          <p className="text-[11px] tracking-[0.25em] text-text-faint mt-3 uppercase">
            Your audio brief, every morning
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-text-faint text-[11px] tracking-[0.2em] uppercase">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent-1)" }} />
        Curating your brief_
      </div>
    </div>
  );
}
