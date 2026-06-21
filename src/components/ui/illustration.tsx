"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface IllustrationProps {
  /** Path under /public, e.g. "/illustrations/checklist.png" */
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Tailwind classes for the gradient fallback shape. */
  fallbackClassName?: string;
  priority?: boolean;
}

/**
 * Renders a 2.5D illustration. If the image fails to load (asset not yet
 * placed in /public), a soft gradient blob is shown so layout is preserved.
 */
export function Illustration({
  src,
  alt,
  width,
  height,
  className,
  fallbackClassName,
  priority,
}: IllustrationProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        aria-label={alt}
        role="img"
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100 via-white to-accent-100",
          fallbackClassName,
          className
        )}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <span
          aria-hidden="true"
          className="absolute h-2/3 w-2/3 rounded-full bg-gradient-to-br from-brand-400/40 to-accent-400/40 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="absolute right-6 top-6 h-3 w-3 rounded-full bg-brand-300/70"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-8 left-10 h-2 w-2 rounded-full bg-accent-400/70"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("h-auto w-full select-none", className)}
      priority={priority}
      onError={() => setErrored(true)}
      draggable={false}
    />
  );
}
