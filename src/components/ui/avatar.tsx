"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  ring?: boolean;
}

/**
 * Round photo avatar with graceful fallback to initials on image error.
 */
export function Avatar({ src, alt, size = 40, className, ring = true }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const initials = alt
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      className={cn(
        "relative inline-block overflow-hidden rounded-full bg-ink-100",
        ring && "ring-2 ring-white",
        className
      )}
      style={{ width: size, height: size }}
    >
      {!errored ? (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
          draggable={false}
          unoptimized
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-300 to-accent-400 text-xs font-bold text-white">
          {initials}
        </span>
      )}
    </span>
  );
}
