import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  "bg-[#e7e8e9] text-[#464554]",
  primary:  "bg-[#4648d4]/10 text-[#4648d4]",
  success:  "bg-[#386a20]/10 text-[#386a20]",
  warning:  "bg-[#7d4e00]/10 text-[#7d4e00]",
  error:    "bg-[#ba1a1a]/10 text-[#ba1a1a]",
};

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}