import { useState } from "react";
import { Check, Download, Heart, Search, Settings2, Trash2 } from "lucide-react";
import { Button, Dialog, IconButton, Panel, SegmentedControl, StatusItem } from "@/ui";

const swatches = [
  { name: "app-bg", className: "bg-app-bg" },
  { name: "app-surface", className: "bg-app-surface" },
  { name: "app-surface-raised", className: "bg-app-surface-raised" },
  { name: "app-surface-hover", className: "bg-app-surface-hover" },
  { name: "app-border", className: "bg-app-border" },
  { name: "app-border-strong", className: "bg-app-border-strong" },
  { name: "app-text", className: "bg-app-text" },
  { name: "app-muted", className: "bg-app-muted" },
  { name: "app-subtle", className: "bg-app-subtle" },
  { name: "app-accent", className: "bg-app-accent" },
  { name: "role-a", className: "bg-role-a" },
  { name: "role-b", className: "bg-role-b" },
  { name: "app-danger", className: "bg-app-danger" },
  { name: "app-success", className: "bg-app-success" },
  { name: "app-warning", className: "bg-app-warning" },
  { name: "app-canvas", className: "bg-app-canvas" },
];

export function PrimitiveGallery() {
  const [segmented, setSegmented] = useState("side");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-2">
      <Panel title="按钮">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" leadingIcon={<Download size={14} />}>
            主要
          </Button>
          <Button variant="secondary">次要</Button>
          <Button variant="ghost">幽灵</Button>
          <Button variant="danger" leadingIcon={<Trash2 size={14} />}>
            危险
          </Button>
          <Button disabled>禁用</Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button size="sm">小号</Button>
          <Button size="md">中号</Button>
        </div>
      </Panel>

      <Panel title="图标按钮">
        <div className="flex flex-wrap items-center gap-2">
          <IconButton label="搜索">
            <Search size={16} aria-hidden="true" />
          </IconButton>
          <IconButton label="收藏" active>
            <Heart size={16} aria-hidden="true" />
          </IconButton>
          <IconButton label="设置" disabled>
            <Settings2 size={16} aria-hidden="true" />
          </IconButton>
          <IconButton label="小号" size="sm">
            <Check size={14} aria-hidden="true" />
          </IconButton>
        </div>
        <p className="mt-3 text-ui-sm text-app-subtle">
          图标按钮必须传 label，自动生成 aria-label 与 title。
        </p>
      </Panel>

      <Panel title="分段控件与状态项">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            label="对比布局"
            options={[
              { value: "side", label: "并排" },
              { value: "overlay", label: "叠加" },
            ]}
            value={segmented}
            onChange={setSegmented}
          />
          <SegmentedControl
            label="网格列数"
            options={[
              { value: "2", label: "2 列" },
              { value: "3", label: "3 列" },
            ]}
            value="2"
            onChange={() => undefined}
          />
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-md border border-app-border bg-app-bg px-3 py-2 text-ui-sm">
          <StatusItem label="图片" value="12 张" />
          <StatusItem value="100%" />
          <StatusItem label="同步" value="开" />
          <StatusItem value="hero-banner@2x.png" className="max-w-40 truncate" />
        </div>
      </Panel>

      <Panel title="对话框">
        <Button onClick={() => setDialogOpen(true)}>打开对话框</Button>
        <p className="mt-3 text-ui-sm text-app-subtle">
          支持 Escape、点击遮罩关闭、Tab 焦点陷阱与关闭后焦点恢复。
        </p>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="确认清空"
          description="此操作会移除当前所有图片"
          footer={
            <>
              <Button onClick={() => setDialogOpen(false)}>取消</Button>
              <Button variant="danger" onClick={() => setDialogOpen(false)}>
                清空
              </Button>
            </>
          }
        >
          <p className="text-ui text-app-muted">
            图片只在本地内存中，清空后会立即释放 object URL 与缩略图缓存。
          </p>
        </Dialog>
      </Panel>

      <Panel title="颜色令牌" className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {swatches.map((swatch) => (
            <div key={swatch.name} className="min-w-0">
              <div
                className={`h-10 rounded-md border border-app-border ${swatch.className}`}
              />
              <p className="mt-1 truncate text-ui-xs text-app-subtle" title={swatch.name}>
                {swatch.name}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="字体层级" className="lg:col-span-2">
        <div className="space-y-2">
          <p className="text-display font-semibold">Display 20 / 标题</p>
          <p className="text-title font-semibold">Title 16 / 面板标题</p>
          <p className="text-body text-app-text">Body 13 / 主要正文</p>
          <p className="text-ui text-app-muted">UI 12 / 控件文字</p>
          <p className="text-ui-sm text-app-subtle">UI small 11 / 辅助信息</p>
          <p className="text-ui-xs text-app-subtle">UI xsmall 10 / 上限与角标</p>
        </div>
      </Panel>
    </div>
  );
}
