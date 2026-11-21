import type { ReactNode } from "react";
import { cn } from "./cn";

type PanelProps = {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function Panel({
  title,
  actions,
  children,
  className,
  bodyClassName,
}: PanelProps) {
  const hasHeader = Boolean(title || actions);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border border-app-border bg-app-surface shadow-panel",
        className,
      )}
    >
      {hasHeader ? (
        <header className="flex h-9 items-center justify-between gap-2 border-b border-app-border px-3">
          <h2 className="truncate text-ui-sm font-semibold tracking-wider text-app-subtle uppercase">
            {title}
          </h2>
          {actions}
        </header>
      ) : null}
      <div className={cn("p-3", bodyClassName)}>{children}</div>
    </section>
  );
}
