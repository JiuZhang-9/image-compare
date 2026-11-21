import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
  size?: "sm" | "md";
  children: ReactNode;
};

const sizeClasses = {
  sm: "size-7",
  md: "size-8",
} as const;

export function IconButton({
  label,
  active = false,
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-md transition-colors duration-150 disabled:pointer-events-none disabled:opacity-45",
        sizeClasses[size],
        active
          ? "bg-app-surface-active text-app-text"
          : "text-app-muted hover:bg-app-surface-hover hover:text-app-text",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
