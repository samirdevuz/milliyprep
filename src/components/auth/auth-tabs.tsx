"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

export function AuthTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);

  if (tabs.length === 1) {
    return <div>{tabs[0]?.content}</div>;
  }

  return (
    <div className="space-y-5">
      <div
        className="grid grid-cols-2 border-b border-ink-200"
        role="tablist"
        aria-label="Kirish usulini tanlang"
      >
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.id)}
              className={cn(
                "-mb-px min-w-0 border-b-2 px-2 py-2.5 text-center text-xs font-semibold leading-snug transition min-[380px]:text-sm sm:px-4",
                isActive
                  ? "border-brand-500 text-brand-700"
                  : "border-transparent text-ink-500 hover:text-ink-800"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{current?.content}</div>
    </div>
  );
}
