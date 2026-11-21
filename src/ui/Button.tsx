import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-app-accent text-app-accent-contrast hover:bg-app-accent-hover active:bg-app-accent-hover",
  secondary:
    "border border-app-border bg-app-surface text-app-text hover:bg-app-surface-hover active:bg-app-surface-active",
  ghost:
    "text-app-muted hover:bg-app-surface-hover hover:text-app-text active:bg-app-surface-active",
  danger: "bg-app-danger text-app-accent-contrast hover:brightness-110",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-7 gap-1.5 px-2.5 text-ui",
  md: "h-8 gap-2 px-3 text-body",
};

export function Button({
  variant = "secondary",
  size = "md",
  leadingIcon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-45",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {leadingIcon}
      {children}
    </button>
  );
}
