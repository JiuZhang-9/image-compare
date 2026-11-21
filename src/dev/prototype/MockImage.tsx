import { cn } from "@/ui";

type MockImageVariant = "a" | "b" | "c" | "d";

const variantClasses: Record<MockImageVariant, string> = {
  a: "bg-linear-to-br from-role-a/50 via-role-a/10 to-app-canvas",
  b: "bg-linear-to-br from-role-b/50 via-role-b/10 to-app-canvas",
  c: "bg-linear-to-tr from-app-accent/40 via-app-accent/5 to-app-canvas",
  d: "bg-linear-to-bl from-app-success/35 via-app-success/5 to-app-canvas",
};

type MockImageProps = {
  variant?: MockImageVariant;
  label?: string;
  watermark?: string;
  className?: string;
};

export function MockImage({
  variant = "a",
  label,
  watermark,
  className,
}: MockImageProps) {
  return (
    <div
      role="img"
      aria-label={label ?? "示例图片"}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-app-canvas",
        variantClasses[variant],
        className,
      )}
    >
      <div className="absolute top-1/4 -left-6 size-24 rounded-full border border-app-text/10 bg-app-text/5" />
      <div className="absolute right-6 bottom-6 size-16 rounded-xl border border-app-text/10 bg-app-text/5" />
      <div className="absolute top-1/3 right-1/4 size-20 rotate-12 rounded-lg border border-app-text/10 bg-app-text/5" />
      <div className="absolute bottom-1/4 left-1/3 h-1.5 w-1/3 rounded-full bg-app-text/10" />
      <div className="absolute top-1/2 left-1/4 h-px w-1/4 bg-app-text/10" />
      {watermark ? (
        <span
          aria-hidden="true"
          className="absolute text-9xl font-bold text-app-text/5 select-none"
        >
          {watermark}
        </span>
      ) : null}
      {label ? (
        <span className="relative z-10 rounded-sm bg-app-overlay px-2 py-0.5 text-ui-sm font-medium text-app-overlay-text/90">
          {label}
        </span>
      ) : null}
    </div>
  );
}
