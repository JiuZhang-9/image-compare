import { useState } from "react";
import { GripVertical, Search } from "lucide-react";
import { cn } from "@/ui";
import { MockImage } from "./MockImage";
import type { MockImageItem } from "./data";

type SidebarProps = {
  images: MockImageItem[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function Sidebar({ images, selectedId, onSelect }: SidebarProps) {
  const [query, setQuery] = useState("");
  const filtered = images.filter((image) =>
    image.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <aside className="flex w-70 shrink-0 flex-col border-r border-app-border bg-app-surface">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-app-border px-3">
        <span className="text-ui font-semibold text-app-text">图片</span>
        <span className="rounded-sm bg-app-surface-active px-1.5 py-0.5 text-ui-sm text-app-muted">
          {images.length}
        </span>
      </div>

      <div className="shrink-0 border-b border-app-border p-2">
        <label className="flex h-8 items-center gap-2 rounded-md border border-app-border bg-app-bg px-2">
          <Search size={14} className="shrink-0 text-app-subtle" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="筛选文件名"
            aria-label="筛选文件名"
            className="min-w-0 flex-1 bg-transparent text-ui outline-none placeholder:text-app-subtle"
          />
        </label>
      </div>

      <div className="ui-scrollbar min-h-0 flex-1 overflow-auto p-2">
        <ul className="flex flex-col gap-1">
          {filtered.map((image) => {
            const selected = image.id === selectedId;

            return (
              <li key={image.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(image.id)}
                  className={cn(
                    "group flex w-full items-center gap-2 rounded-md border p-1.5 text-left transition-colors duration-150",
                    selected
                      ? "border-app-accent/60 bg-app-accent/10"
                      : "border-transparent hover:bg-app-surface-hover",
                  )}
                >
                  <MockImage
                    variant={image.variant}
                    className="size-12 shrink-0 rounded-sm"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-ui font-medium text-app-text">
                      {image.name}
                    </span>
                    <span className="block text-ui-sm text-app-subtle">
                      {image.dimensions}
                    </span>
                  </span>
                  {image.role ? (
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-sm text-ui-xs font-bold",
                        image.role === "A"
                          ? "bg-role-a text-role-a-contrast"
                          : "bg-role-b text-role-b-contrast",
                      )}
                    >
                      {image.role}
                    </span>
                  ) : null}
                  <GripVertical
                    size={13}
                    aria-hidden="true"
                    className="shrink-0 text-app-subtle opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </button>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 ? (
          <p className="px-2 py-6 text-center text-ui text-app-subtle">没有匹配的图片</p>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-app-border px-3 py-2 text-ui-sm text-app-subtle">
        拖拽、点击或粘贴导入
      </div>
    </aside>
  );
}
