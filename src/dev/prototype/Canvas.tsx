import { GripVertical } from "lucide-react";
import { cn } from "@/ui";
import { MockImage } from "./MockImage";
import type { CompareLayout, PrototypeViewMode } from "./Toolbar";
import type { MockImageItem } from "./data";

type CanvasProps = {
  mode: PrototypeViewMode;
  images: MockImageItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  compareLayout: CompareLayout;
  gridColumns: 2 | 3;
  showFileNames: boolean;
  zoom: number;
};

export function Canvas({
  mode,
  images,
  selectedId,
  onSelect,
  compareLayout,
  gridColumns,
  showFileNames,
  zoom,
}: CanvasProps) {
  const selectedImage = images.find((image) => image.id === selectedId) ?? images[0];
  const imageA = images[0];
  const imageB = images[1];

  return (
    <div className="checkerboard relative min-h-0 flex-1 overflow-hidden">
      {mode === "single" && selectedImage ? (
        <div className="flex h-full items-center justify-center p-10">
          <div
            className="h-full w-full max-w-4xl overflow-hidden rounded-md shadow-popover"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <MockImage variant={selectedImage.variant} className="h-full w-full" />
            <ImageLabel role={null} name={selectedImage.name} showName={showFileNames} />
          </div>
        </div>
      ) : null}

      {mode === "compare" && imageA && imageB ? (
        compareLayout === "side" ? (
          <div className="grid h-full grid-cols-2">
            <ComparePanel image={imageA} role="A" showName={showFileNames} />
            <ComparePanel image={imageB} role="B" showName={showFileNames} />
            <DividerHandle />
          </div>
        ) : (
          <div className="relative h-full overflow-hidden">
            <MockImage
              variant={imageB.variant}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0" style={{ clipPath: "inset(0 50% 0 0)" }}>
              <MockImage variant={imageA.variant} className="h-full w-full" />
            </div>
            <ImageLabel role="A" name={imageA.name} showName={showFileNames} />
            <span className="absolute top-3 right-3 rounded-sm bg-app-overlay px-2 py-0.5 text-ui-sm font-semibold text-app-overlay-text">
              B
            </span>
            <DividerHandle />
          </div>
        )
      ) : null}

      {mode === "grid" ? (
        <div
          className={cn(
            "grid h-full gap-0.5 p-0.5",
            gridColumns === 3 ? "grid-cols-3 grid-rows-2" : "grid-cols-2 grid-rows-3",
          )}
        >
          {images.slice(0, 6).map((image) => {
            const selected = image.id === selectedId;

            return (
              <button
                key={image.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(image.id)}
                className={cn(
                  "relative min-h-0 overflow-hidden rounded-xs border text-left transition-colors",
                  selected ? "border-app-accent" : "border-transparent",
                )}
              >
                <MockImage variant={image.variant} className="h-full w-full" />
                <span className="absolute top-2 left-2 rounded-sm bg-app-overlay px-1.5 py-0.5 text-ui-xs font-semibold text-app-overlay-text">
                  {image.dimensions}
                </span>
                {showFileNames ? (
                  <span className="absolute bottom-2 left-2 right-2 truncate rounded-sm bg-app-overlay px-2 py-1 text-ui-sm text-app-overlay-text">
                    {image.name}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ComparePanel({
  image,
  role,
  showName,
}: {
  image: MockImageItem;
  role: "A" | "B";
  showName: boolean;
}) {
  return (
    <div className="relative min-h-0 overflow-hidden">
      <MockImage variant={image.variant} watermark={role} className="h-full w-full" />
      <span
        className={cn(
          "absolute top-3 left-3 grid size-6 place-items-center rounded-sm text-ui-sm font-bold",
          role === "A"
            ? "bg-role-a text-role-a-contrast"
            : "bg-role-b text-role-b-contrast",
        )}
      >
        {role}
      </span>
      {showName ? (
        <span className="absolute bottom-3 left-3 right-14 truncate rounded-sm bg-app-overlay px-2 py-0.5 text-ui-sm text-app-overlay-text">
          {image.name}
        </span>
      ) : null}
    </div>
  );
}

function ImageLabel({
  role,
  name,
  showName,
}: {
  role: "A" | "B" | null;
  name: string;
  showName: boolean;
}) {
  if (!showName) {
    return null;
  }

  return (
    <span className="absolute bottom-4 left-4 right-16 flex items-center gap-1.5 truncate rounded-sm bg-app-overlay px-2 py-1 text-ui-sm text-app-overlay-text">
      {role ? (
        <span
          className={cn(
            "grid size-4 shrink-0 place-items-center rounded-xs text-ui-xs font-bold",
            role === "A"
              ? "bg-role-a text-role-a-contrast"
              : "bg-role-b text-role-b-contrast",
          )}
        >
          {role}
        </span>
      ) : null}
      <span className="truncate">{name}</span>
    </span>
  );
}

function DividerHandle() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-app-border-strong">
      <span className="absolute top-1/2 left-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-app-border-strong bg-app-surface text-app-muted shadow-popover">
        <GripVertical size={15} aria-hidden="true" />
      </span>
    </div>
  );
}
