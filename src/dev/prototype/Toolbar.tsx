import {
  Files,
  HelpCircle,
  Link2,
  Maximize,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
  Unlink2,
} from "lucide-react";
import { IconButton, SegmentedControl } from "@/ui";

export type PrototypeViewMode = "single" | "compare" | "grid";
export type CompareLayout = "side" | "overlay";

type ToolbarProps = {
  mode: PrototypeViewMode;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  synced: boolean;
  onToggleSync: () => void;
  compareLayout: CompareLayout;
  onCompareLayoutChange: (layout: CompareLayout) => void;
  gridColumns: 2 | 3;
  onGridColumnsChange: (columns: 2 | 3) => void;
  showFileNames: boolean;
  onToggleFileNames: () => void;
};

function Divider() {
  return <span className="mx-1 h-5 w-px shrink-0 bg-app-border" aria-hidden="true" />;
}

export function Toolbar({
  mode,
  zoom,
  onZoomIn,
  onZoomOut,
  onFit,
  synced,
  onToggleSync,
  compareLayout,
  onCompareLayoutChange,
  gridColumns,
  onGridColumnsChange,
  showFileNames,
  onToggleFileNames,
}: ToolbarProps) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-1 border-b border-app-border bg-app-surface px-2.5">
      <div className="flex items-center gap-0.5">
        <IconButton size="sm" label="缩小" onClick={onZoomOut}>
          <Minus size={15} aria-hidden="true" />
        </IconButton>
        <span className="w-12 text-center text-ui tabular-nums text-app-text">
          {zoom}%
        </span>
        <IconButton size="sm" label="放大" onClick={onZoomIn}>
          <Plus size={15} aria-hidden="true" />
        </IconButton>
        <IconButton size="sm" label="适应窗口" onClick={onFit}>
          <Maximize size={15} aria-hidden="true" />
        </IconButton>
      </div>

      <Divider />

      <div className="flex items-center gap-0.5">
        <IconButton size="sm" label="向左旋转">
          <RotateCcw size={15} aria-hidden="true" />
        </IconButton>
        <IconButton size="sm" label="向右旋转">
          <RotateCw size={15} aria-hidden="true" />
        </IconButton>
      </div>

      <div className="mx-auto flex items-center gap-2">
        {mode === "compare" ? (
          <>
            <SegmentedControl
              label="对比布局"
              options={[
                { value: "side", label: "并排" },
                { value: "overlay", label: "叠加" },
              ]}
              value={compareLayout}
              onChange={onCompareLayoutChange}
            />
            <IconButton
              size="sm"
              label={synced ? "取消同步" : "同步缩放"}
              active={synced}
              onClick={onToggleSync}
            >
              {synced ? (
                <Link2 size={15} aria-hidden="true" />
              ) : (
                <Unlink2 size={15} aria-hidden="true" />
              )}
            </IconButton>
          </>
        ) : null}

        {mode === "grid" ? (
          <SegmentedControl
            label="网格列数"
            options={[
              { value: "2", label: "2 列" },
              { value: "3", label: "3 列" },
            ]}
            value={gridColumns === 3 ? "3" : "2"}
            onChange={(value) => onGridColumnsChange(value === "3" ? 3 : 2)}
          />
        ) : null}
      </div>

      <div className="flex items-center gap-0.5">
        <IconButton
          size="sm"
          label="显示文件名"
          active={showFileNames}
          onClick={onToggleFileNames}
        >
          <Files size={15} aria-hidden="true" />
        </IconButton>
        <IconButton size="sm" label="快捷键帮助">
          <HelpCircle size={15} aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
}
