import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

// Wraps every authenticated screen (home/discover/settings/billing/saved).
// Below `lg` it's a no-op passthrough (mobile keeps its single-column layout
// with the bottom nav). At `lg` and up it adds the persistent sidebar and
// lets each page's own content decide how to use the extra width.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="lg:flex lg:min-h-dvh lg:items-start">
      <Sidebar />
      <div className="flex-1 min-w-0 lg:h-dvh lg:overflow-y-auto">{children}</div>
    </div>
  );
}
