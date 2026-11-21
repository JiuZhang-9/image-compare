import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "./cn";
import { IconButton } from "./IconButton";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  closeLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  testId?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  closeLabel = "关闭",
  children,
  footer,
  className,
  testId,
}: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const panel = panelRef.current;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) {
        return;
      }

      const focusable = getFocusableElements(panel);

      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-app-overlay p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-testid={testId}
        className={cn(
          "flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface-raised shadow-popover",
          className,
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-app-border px-4 py-3">
          <div className="min-w-0">
            <h2 id={titleId} className="text-title font-semibold text-app-text">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-ui text-app-muted">{description}</p>
            ) : null}
          </div>
          <IconButton label={closeLabel} size="sm" onClick={onClose}>
            <X size={16} aria-hidden="true" />
          </IconButton>
        </header>
        <div className="ui-scrollbar min-h-0 flex-1 overflow-auto p-4">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-app-border px-4 py-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
