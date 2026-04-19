import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?:    ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-gradient-to-br from-[#4648d4] to-[#6063ee]",
    "text-white font-semibold",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
    "hover:opacity-90 active:opacity-80",
  ].join(" "),

  secondary: [
    "bg-white text-[#191c1d] font-medium",
    "border border-[#c7c4d7]/20",
    "hover:bg-[#e7e8e9]",
  ].join(" "),

  ghost: [
    "bg-transparent text-[#464554] font-medium",
    "hover:bg-[#e7e8e9] hover:text-[#191c1d]",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8  px-3 text-xs  rounded-md gap-1.5",
  md: "h-10 px-4 text-sm  rounded-md gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap",
        "transition-all duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4648d4]/40 focus-visible:ring-offset-2",
        "disabled:opacity-40 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = "Button";