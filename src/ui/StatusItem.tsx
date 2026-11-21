import type { ReactNode } from "react";
import { cn } from "./cn";

type StatusItemProps = {
  label?: ReactNode;
  value: ReactNode;
  title?: string;
  className?: string;
};

export function StatusItem({ label, value, title, className }: StatusItemProps) {
  return (
    <span
      title={title}
      className={cn("inline-flex items-center gap-1.5 whitespace-nowrap", className)}
    >
      {label ? <span className="text-app-subtle">{label}</span> : null}
      <span className="text-app-text tabular-nums">{value}</span>
    </span>
  );
}
