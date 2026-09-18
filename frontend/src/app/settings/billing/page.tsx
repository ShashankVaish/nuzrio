"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, Check } from "lucide-react";
import { useRequireOnboarded } from "@/lib/useRequireOnboarded";
import { useAuth } from "@/context/AppProviders";
import { api } from "@/lib/api";
import type { Plan } from "@/lib/types";
import { AppShell } from "@/components/AppShell";

export default function BillingPage() {
  const { user, loading } = useRequireOnboarded();
  const { setUser } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    api.get<Plan[]>("/billing/plans").then(setPlans);
  }, []);

  if (loading || !user) return null;
  const currentUser = user;

  async function upgrade(planId: string) {
    setUpgrading(planId);
    try {
      const order = await api.post<{ orderId: string }>("/billing/upgrade", { planId });
      const subscription = await api.post<typeof currentUser.subscription>("/billing/confirm", {
        orderId: order.orderId,
      });
      setUser({ ...currentUser, subscription });
    } finally {
      setUpgrading(null);
    }
  }

  return (
    <AppShell>
    <div className="min-h-dvh flex flex-col px-5 sm:px-6 lg:px-10 pt-6 pb-8 lg:max-w-5xl">
      <Link href="/settings" className="flex items-center gap-1 text-sm text-text-dim">
        <ChevronLeft size={16} /> Settings
      </Link>
      <h1 className="text-2xl lg:text-[28px] font-semibold mt-4">Plan & billing</h1>
      <p className="text-text-dim text-sm mt-1">Start free. Upgrade when mornings pay for themselves.</p>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {plans.map((plan) => {
          const isCurrent = user.subscription.planId === plan.id;
          const isPro = plan.id !== "free";
          return (
            <div
              key={plan.id}
              className={clsx(
                "rounded-3xl border p-5",
                isCurrent && isPro ? "border-[var(--success-1)]" : "border-border",
                "bg-surface"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{plan.name}</p>
                {plan.launchOffer && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "rgba(52,211,153,0.16)", color: "var(--success-1)" }}>
                    LAUNCH OFFER
                  </span>
                )}
              </div>
              <p className="mt-2">
                <span className="text-3xl font-bold" style={{ color: plan.id === "free" ? undefined : "var(--accent-1)" }}>
                  ₹{plan.priceInr}
                </span>
                <span className="text-text-dim text-sm">/{plan.interval === "month" ? "mo" : "yr"}</span>
              </p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-text-dim flex items-center gap-2">
                    <Check size={12} style={{ color: "var(--success-1)" }} /> {f}
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrent || upgrading === plan.id}
                onClick={() => upgrade(plan.id)}
                className={clsx(
                  "w-full h-11 rounded-2xl font-semibold text-sm mt-4 disabled:opacity-60",
                  isCurrent ? "bg-surface-2 text-text-dim" : plan.id === "free" ? "bg-surface-2 text-text" : "text-black"
                )}
                style={!isCurrent && plan.id !== "free" ? { background: "var(--success-grad)" } : undefined}
              >
                {isCurrent ? "Current plan" : upgrading === plan.id ? "Upgrading…" : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
    </AppShell>
  );
}
