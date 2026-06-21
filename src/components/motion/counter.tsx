"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  to: number;
  duration?: number;
  /** Suffix appended after the number (e.g. "+", "%"). */
  suffix?: string;
  /** Prefix shown before the number. */
  prefix?: string;
  /** Locale used for grouping separators. Defaults to `uz-UZ`. */
  locale?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Numeric counter that animates from 0 to `to` once it enters the viewport.
 * Always renders the final value on first paint to avoid layout shift, then
 * animates back to it after intersection.
 */
export function Counter({
  to,
  duration = 1600,
  suffix = "",
  prefix = "",
  locale = "uz-UZ",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        setValue(0);
        let raf = 0;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setValue(Math.round(to * easeOutCubic(p)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        obs.disconnect();
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString(locale).replace(/,/g, "\u00a0")}
      {suffix}
    </span>
  );
}
