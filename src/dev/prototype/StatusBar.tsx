import { StatusItem } from "@/ui";

type StatusBarProps = {
  count: number;
  zoom: number;
  synced: boolean;
  selectedName: string;
};

export function StatusBar({ count, zoom, synced, selectedName }: StatusBarProps) {
  return (
    <footer className="flex h-8 shrink-0 items-center justify-between gap-4 border-t border-app-border bg-app-surface px-3 text-ui-sm">
      <div className="flex min-w-0 items-center gap-3">
        <StatusItem label="图片" value={`${count} 张`} />
        <span className="text-app-border" aria-hidden="true">
          |
        </span>
        <span className="hidden text-app-subtle lg:inline">上限 100 张 · 50 MiB/张</span>
      </div>

      <div className="hidden items-center gap-2 text-app-subtle md:flex">
        <kbd className="rounded-xs border border-app-border bg-app-bg px-1 text-ui-xs">
          空格
        </kbd>
        闪烁
        <kbd className="rounded-xs border border-app-border bg-app-bg px-1 text-ui-xs">
          ← →
        </kbd>
        切换 A/B
        <kbd className="rounded-xs border border-app-border bg-app-bg px-1 text-ui-xs">
          滚轮
        </kbd>
        缩放
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <StatusItem value={`${zoom}%`} />
        <StatusItem label="同步" value={synced ? "开" : "关"} />
        <StatusItem value={selectedName} className="max-w-40 truncate" />
      </div>
    </footer>
  );
}
