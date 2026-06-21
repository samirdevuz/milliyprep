import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, hint, error, leadingIcon, trailingIcon, id, ...props },
    ref
  ) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-ink-800"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leadingIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "block w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400",
              "transition focus:outline-none focus:ring-2 focus:ring-brand-500/30",
              error
                ? "border-rose-300 focus:border-rose-400"
                : "border-ink-200 focus:border-brand-400",
              leadingIcon && "pl-10",
              trailingIcon && "pr-10",
              className
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={hint || error ? `${inputId}-help` : undefined}
            {...props}
          />
          {trailingIcon && (
            <span className="absolute inset-y-0 right-3 flex items-center text-ink-400">
              {trailingIcon}
            </span>
          )}
        </div>
        {(hint || error) && (
          <p
            id={`${inputId}-help`}
            className={cn(
              "text-xs",
              error ? "text-rose-600" : "text-ink-500"
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
