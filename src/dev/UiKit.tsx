import { useEffect, useState } from "react";
import { SegmentedControl } from "@/ui";
import { PrimitiveGallery } from "./PrimitiveGallery";
import { AppPrototype } from "./prototype/AppPrototype";

type Theme = "dark" | "light";
type Tab = "prototype" | "components";

export function UiKit() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [tab, setTab] = useState<Tab>("prototype");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-app-bg text-app-text">
      <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-app-border bg-app-surface px-3">
        <span className="truncate text-ui font-semibold text-app-text">
          UI Kit · 设计系统
        </span>
        <div className="flex items-center gap-2">
          <SegmentedControl
            label="页面"
            options={[
              { value: "prototype", label: "界面原型" },
              { value: "components", label: "组件库" },
            ]}
            value={tab}
            onChange={setTab}
          />
          <SegmentedControl
            label="主题"
            options={[
              { value: "dark", label: "深色" },
              { value: "light", label: "浅色" },
            ]}
            value={theme}
            onChange={setTheme}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {tab === "prototype" ? (
          <AppPrototype
            theme={theme}
            onToggleTheme={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
          />
        ) : (
          <div className="ui-scrollbar h-full overflow-auto p-6">
            <div className="mx-auto mb-4 w-full max-w-5xl">
              <h1 className="text-display font-semibold">组件库</h1>
              <p className="mt-1 text-ui text-app-muted">
                所有 primitive 的状态全集，供实现与截图回归使用。
              </p>
            </div>
            <PrimitiveGallery />
          </div>
        )}
      </div>
    </div>
  );
}
