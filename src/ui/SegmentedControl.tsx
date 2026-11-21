import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "./cn";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type SegmentedControlProps<T extends string> = {
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const moveSelection = (index: number, direction: -1 | 1) => {
    const nextIndex = (index + direction + options.length) % options.length;
    const nextOption = options[nextIndex];

    if (!nextOption) {
      return;
    }

    onChange(nextOption.value);
    buttonRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(index, -1);
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection(index, 1);
    }
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-app-border bg-app-surface p-0.5",
        className,
      )}
    >
      {options.map((option, index) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            type="button"
            aria-pressed={active}
            title={option.label}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-sm px-2.5 text-ui font-medium whitespace-nowrap transition-colors duration-150",
              active
                ? "bg-app-surface-active text-app-text"
                : "text-app-muted hover:bg-app-surface-hover hover:text-app-text",
            )}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
