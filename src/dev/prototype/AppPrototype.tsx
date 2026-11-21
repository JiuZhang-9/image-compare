import { useState } from "react";
import {
  AlertTriangle,
  Columns2,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  Moon,
  Sun,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button, Dialog, IconButton, SegmentedControl } from "@/ui";
import { mockImages } from "./data";
import { Canvas } from "./Canvas";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { Toolbar, type CompareLayout, type PrototypeViewMode } from "./Toolbar";

type AppPrototypeProps = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

const modeOptions = [
  { value: "single", label: "单图", icon: <ImageIcon size={14} aria-hidden="true" /> },
  { value: "compare", label: "对比", icon: <Columns2 size={14} aria-hidden="true" /> },
  { value: "grid", label: "多图", icon: <LayoutGrid size={14} aria-hidden="true" /> },
] as const;

export function AppPrototype({ theme, onToggleTheme }: AppPrototypeProps) {
  const [mode, setMode] = useState<PrototypeViewMode>("compare");
  const [zoom, setZoom] = useState(100);
  const [synced, setSynced] = useState(true);
  const [compareLayout, setCompareLayout] = useState<CompareLayout>("side");
  const [gridColumns, setGridColumns] = useState<2 | 3>(3);
  const [showFileNames, setShowFileNames] = useState(true);
  const [showNotice, setShowNotice] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [selectedId, setSelectedId] = useState(mockImages[0]?.id ?? "");

  const selectedName =
    mockImages.find((image) => image.id === selectedId)?.name ?? "未选择图片";

  return (
    <div className="flex h-full flex-col overflow-hidden bg-app-bg text-app-text">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-app-border bg-app-surface px-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <img src="/app-logo.svg" alt="" className="size-8 rounded-md" />
          <div className="hidden min-w-0 sm:block">
            <div className="truncate text-body font-semibold">图片对比</div>
            <div className="text-ui-sm text-app-subtle">Image Compare</div>
          </div>
        </div>

        <div className="flex flex-1 justify-center">
          <SegmentedControl
            label="视图模式"
            options={modeOptions}
            value={mode}
            onChange={setMode}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="primary" size="sm" leadingIcon={<Upload size={14} />}>
            导入
          </Button>
          <IconButton size="sm" label="清空图片">
            <Trash2 size={15} aria-hidden="true" />
          </IconButton>
          <IconButton
            size="sm"
            label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
            onClick={onToggleTheme}
          >
            {theme === "dark" ? (
              <Sun size={15} aria-hidden="true" />
            ) : (
              <Moon size={15} aria-hidden="true" />
            )}
          </IconButton>
          <Button variant="ghost" size="sm">
            EN
          </Button>
          <IconButton size="sm" label="关于" onClick={() => setShowAbout(true)}>
            <Info size={15} aria-hidden="true" />
          </IconButton>
        </div>
      </header>

      {showNotice ? (
        <div className="flex h-9 shrink-0 items-center gap-2 border-b border-app-warning/30 bg-app-warning/10 px-3 text-ui text-app-warning">
          <AlertTriangle size={14} aria-hidden="true" />
          <span className="flex-1 truncate">已跳过 2 个超过 50 MiB 的文件</span>
          <IconButton size="sm" label="关闭导入提示" onClick={() => setShowNotice(false)}>
            <X size={14} aria-hidden="true" />
          </IconButton>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        <Sidebar images={mockImages} selectedId={selectedId} onSelect={setSelectedId} />

        <main className="flex min-w-0 flex-1 flex-col">
          <Toolbar
            mode={mode}
            zoom={zoom}
            onZoomIn={() => setZoom((value) => Math.min(500, value + 10))}
            onZoomOut={() => setZoom((value) => Math.max(10, value - 10))}
            onFit={() => setZoom(100)}
            synced={synced}
            onToggleSync={() => setSynced((value) => !value)}
            compareLayout={compareLayout}
            onCompareLayoutChange={setCompareLayout}
            gridColumns={gridColumns}
            onGridColumnsChange={setGridColumns}
            showFileNames={showFileNames}
            onToggleFileNames={() => setShowFileNames((value) => !value)}
          />

          <Canvas
            mode={mode}
            images={mockImages}
            selectedId={selectedId}
            onSelect={setSelectedId}
            compareLayout={compareLayout}
            gridColumns={gridColumns}
            showFileNames={showFileNames}
            zoom={zoom}
          />

          <StatusBar
            count={mockImages.length}
            zoom={zoom}
            synced={synced}
            selectedName={selectedName}
          />
        </main>
      </div>

      <Dialog
        open={showAbout}
        onClose={() => setShowAbout(false)}
        title="关于图片对比工具"
        description="v1.3.0-team.0 · MIT"
        footer={
          <Button variant="primary" onClick={() => setShowAbout(false)}>
            知道了
          </Button>
        }
      >
        <div className="space-y-3 text-ui text-app-muted">
          <p>所有图片只在本地处理，不上传、不包含遥测。</p>
          <dl className="grid grid-cols-2 gap-2 text-ui-sm">
            <div className="rounded-md bg-app-surface p-2">
              <dt className="text-app-subtle">支持格式</dt>
              <dd className="text-app-text">PNG · JPEG · WebP · GIF · SVG</dd>
            </div>
            <div className="rounded-md bg-app-surface p-2">
              <dt className="text-app-subtle">导入上限</dt>
              <dd className="text-app-text">100 张 · 50 MiB/张</dd>
            </div>
            <div className="rounded-md bg-app-surface p-2">
              <dt className="text-app-subtle">上游项目</dt>
              <dd className="text-app-text">ZiDongLai/image-compare</dd>
            </div>
            <div className="rounded-md bg-app-surface p-2">
              <dt className="text-app-subtle">运行平台</dt>
              <dd className="text-app-text">Windows x64 · macOS ARM64</dd>
            </div>
          </dl>
          <p className="text-ui-sm text-app-subtle">
            原型使用 mock 数据，不代表最终功能范围。
          </p>
        </div>
      </Dialog>
    </div>
  );
}
