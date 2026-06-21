import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  leadingIcon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      hint,
      error,
      options,
      placeholder,
      id,
      value,
      leadingIcon,
      ...props
    },
    ref
  ) => {
    const selectId = id ?? props.name;
    const messageId = selectId && (hint || error) ? `${selectId}-message` : undefined;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            ref={ref}
            id={selectId}
            value={value}
            className={cn(
              "block w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 text-sm text-ink-900",
              "transition focus:outline-none focus:ring-2 focus:ring-brand-500/30",
              error
                ? "border-rose-300 focus:border-rose-400"
                : "border-ink-200 focus:border-brand-400",
              !value && "text-ink-400",
              leadingIcon && "pl-10",
              className
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={messageId}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        </div>
        {(hint || error) && (
          <p
            id={messageId}
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
Select.displayName = "Select";
