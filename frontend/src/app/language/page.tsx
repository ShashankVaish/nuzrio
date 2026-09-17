"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { MapPin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useCatalog } from "@/lib/useCatalog";
import { setPendingLanguage } from "@/lib/pendingOnboarding";

export default function LanguagePage() {
  const router = useRouter();
  const { catalog } = useCatalog();
  const [selected, setSelected] = useState("en-GB");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  function handleContinue() {
    setPendingLanguage({ language: selected, locationEnabled });
    router.push("/welcome");
  }

  function toggleLocation() {
    if (!locationEnabled && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true);
          setLocationDenied(false);
        },
        () => {
          setLocationDenied(true);
          setLocationEnabled(false);
        }
      );
    } else {
      setLocationEnabled(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col px-5 sm:px-6 pt-8 sm:pt-10 pb-8 auth-card">
      <Logo />

      <div className="mt-10">
        <h1 className="text-[28px] font-semibold leading-tight">
          Choose your
          <br />
          <span className="accent-text text-[30px]">language</span>
        </h1>
        <p className="text-text-dim text-sm mt-2">Select the language for your daily brief.</p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {(catalog?.languages ?? []).map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className={clsx(
              "flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-colors",
              selected === lang.code ? "border-[var(--accent-1)] bg-[rgba(139,124,246,0.1)]" : "border-border bg-surface"
            )}
          >
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-surface-2 text-text-dim">
              {lang.code.split("-")[1]}
            </span>
            <div className="flex-1">
              <p className="font-semibold">{lang.nativeName}</p>
              <p className="text-xs text-text-dim">{lang.tagline}</p>
            </div>
            <span
              className={clsx(
                "w-4 h-4 rounded-full border-2 flex-shrink-0",
                selected === lang.code ? "border-[var(--accent-1)]" : "border-border-strong"
              )}
              style={selected === lang.code ? { background: "var(--accent-grad)" } : undefined}
            />
          </button>
        ))}
      </div>

      <button
        onClick={toggleLocation}
        className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-4 text-left"
      >
        <span className="w-9 h-9 rounded-full flex items-center justify-center bg-[rgba(139,124,246,0.14)]">
          <MapPin size={16} style={{ color: "var(--accent-1)" }} />
        </span>
        <span className="flex-1">
          <p className="font-semibold text-sm">Enable Location</p>
          <p className="text-xs text-text-dim">
            {locationDenied ? "Not allowed" : "Get hyperlocal news tailored to your city."}
          </p>
        </span>
        <span
          className={clsx(
            "w-11 h-6 rounded-full flex items-center px-0.5 transition-colors",
            locationEnabled ? "justify-end" : "justify-start bg-surface-2"
          )}
          style={locationEnabled ? { background: "var(--accent-grad)" } : undefined}
        >
          <span className="w-5 h-5 rounded-full bg-white" />
        </span>
      </button>

      <div className="flex-1" />

      <Button withArrow onClick={handleContinue}>
        Continue
      </Button>
    </div>
  );
}
