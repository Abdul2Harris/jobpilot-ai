import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-wide text-[#464554]"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "h-11 w-full px-4 rounded-[0.75rem]",
          "bg-[#f3f4f5] placeholder:text-[#9a9ba8] text-[#191c1d] text-sm",
          "border border-[#c7c4d7]/15",
          "transition-[background,box-shadow] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          "focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4648d4]/20",
          error && "ring-2 ring-[#ba1a1a]/30",
          className,
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-[#ba1a1a]">{error}</p>
      )}
    </div>
  ),
);
Input.displayName = "Input";