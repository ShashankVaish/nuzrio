"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { AudioLines } from "lucide-react";
import { useAuth } from "@/context/AppProviders";
import { api } from "@/lib/api";
import { getPendingLanguage, clearPendingLanguage } from "@/lib/pendingOnboarding";
import { resumeOnboardingPath } from "@/lib/onboardingSteps";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function WelcomePage() {
  const router = useRouter();
  const { loginWithGoogleIdToken, setUser } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [scriptReady, setScriptReady] = useState(false);
  const buttonBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scriptReady || !GOOGLE_CLIENT_ID || !window.google || !buttonBoxRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      // The One Tap `prompt()` flow relies on FedCM, which throws AbortError /
      // NetworkError in a lot of browser setups (blocked third-party storage,
      // incognito, unauthorized origin). Rendering the real button instead uses
      // the classic OAuth popup, which doesn't depend on FedCM at all.
      use_fedcm_for_prompt: false,
      callback: async (response) => {
        setStatus("loading");
        try {
          const user = await loginWithGoogleIdToken(response.credential);
          const pending = getPendingLanguage();
          if (pending) {
            const updated = await api.put("/onboarding/language", pending);
            setUser(updated as typeof user);
            clearPendingLanguage();
          }
          router.push(resumeOnboardingPath(user.onboarding));
        } catch {
          setStatus("error");
        }
      },
    });

    const box = buttonBoxRef.current;
    const render = () => {
      if (!window.google || !box) return;
      box.innerHTML = "";
      window.google.accounts.id.renderButton(box, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        shape: "pill",
        text: "continue_with",
        logo_alignment: "left",
        width: Math.min(400, Math.floor(box.getBoundingClientRect().width)),
      });
    };

    render();
    const observer = new ResizeObserver(render);
    observer.observe(box);
    return () => observer.disconnect();
  }, [scriptReady, loginWithGoogleIdToken, router, setUser]);

  return (
    <div className="min-h-dvh flex flex-col px-5 sm:px-6 pt-12 sm:pt-16 pb-8 auth-card">
      {GOOGLE_CLIENT_ID && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
        />
      )}

      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--accent-grad)" }}
      >
        <AudioLines size={26} className="text-white" strokeWidth={2.2} />
      </div>

      <div className="mt-10">
        <h1 className="text-[30px] font-semibold leading-tight">Good morning.</h1>
        <p className="accent-text text-[34px] leading-tight -mt-1">News on go.</p>
        <p className="text-text-dim text-sm mt-4 leading-relaxed max-w-[300px]">
          Personalised audio news for Indian professionals — curated every morning.
        </p>
      </div>

      <div className="flex-1" />

      {status === "loading" && <p className="text-xs text-text-dim mb-3 text-center">Signing in…</p>}
      {status === "error" && (
        <p className="text-xs text-red-400 mb-3 text-center">Sign-in failed. Please try again.</p>
      )}

      {GOOGLE_CLIENT_ID ? (
        <div ref={buttonBoxRef} className="w-full flex justify-center [&>div]:w-full!" />
      ) : (
        <>
          <p className="text-xs text-red-400 mb-3 text-center">
            Google sign-in isn&apos;t configured yet. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in
            frontend/.env.local.
          </p>
          <button
            disabled
            className="w-full h-13 rounded-2xl bg-white text-black font-semibold text-[15px] flex items-center justify-center gap-3 opacity-60"
          >
            <GoogleGlyph />
            Continue with Google
          </button>
        </>
      )}

      <p className="text-center text-[11px] text-text-faint mt-4 leading-relaxed px-4">
        By continuing you agree to our <span className="underline">Terms</span> &{" "}
        <span className="underline">Privacy Policy</span>
      </p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}
