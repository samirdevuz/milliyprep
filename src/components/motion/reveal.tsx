"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Initial transform direction. */
  from?: "up" | "down" | "left" | "right" | "fade";
  /** Once true, the element stays revealed even after leaving the viewport. */
  once?: boolean;
  /** Reveal threshold as a fraction of element height. */
  threshold?: number;
  /** Custom HTML tag, defaults to `div`. */
  as?: "div" | "li";
}

const FROM_CLS: Record<NonNullable<RevealProps["from"]>, string> = {
  up: "translate-y-6",
  down: "-translate-y-6",
  left: "translate-x-6",
  right: "-translate-x-6",
  fade: "translate-y-0",
};

/**
 * Lightweight scroll-reveal wrapper using IntersectionObserver.
 * Adds a fade-and-slide effect once the element enters the viewport.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  from = "up",
  once = true,
  threshold = 0.15,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, threshold]);

  const props = {
    ref: setRef,
    style: { transitionDelay: `${delay}ms` },
    className: cn(
      "transition-all duration-700 ease-out will-change-transform",
      visible
        ? "opacity-100 translate-x-0 translate-y-0"
        : `opacity-0 ${FROM_CLS[from]}`,
      className
    ),
  };

  if (as === "li") {
    return <li {...props}>{children}</li>;
  }

  return (
    <div {...props}>
      {children}
    </div>
  );
}
