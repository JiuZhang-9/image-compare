# UI 设计规范 · 专业深色工作台

> 状态：原型已出（`ui-kit.html`），真实界面待迁移。
> 视觉方向：中性深色工作台，单一蓝色强调，A 紫 / B 青，8px 网格，紧凑密度。
> 主题：深色 + 浅色两套；gray 主题在真实 UI 迁移时移除。

## 1. 设计原则

1. **图片优先**：界面 chrome 尽量退后，画布与图片是主角；不使用高饱和大面积装饰。
2. **AI 可维护**：只用令牌对应的 Tailwind 类；组件行为与样式局部化，禁止全局补丁。
3. **低回归**：所有可交互元素有真实语义、可访问名称与稳定测试定位；视觉状态可枚举。
4. **紧凑但不拥挤**：桌面工具密度；常用控件 28–32px，主要操作 32px；点击目标不小于 28×28。
5. **一致**：同一语义只有一种颜色/间距/圆角；新增先加令牌，不在组件里发明。

## 2. 颜色令牌

唯一来源：`src/styles/tokens.css`。组件里禁止裸色值。

| 令牌                    | 深色               | 浅色                  | 用途                       |
| ----------------------- | ------------------ | --------------------- | -------------------------- |
| `--app-bg`              | `#0f1115`          | `#f4f6f8`             | 应用背景                   |
| `--app-surface`         | `#171a1f`          | `#ffffff`             | 顶栏/侧栏/工具栏/状态栏    |
| `--app-surface-raised`  | `#1d2128`          | `#ffffff`             | 弹窗/浮层                  |
| `--app-surface-hover`   | `#232831`          | `#eef2f6`             | hover                      |
| `--app-surface-active`  | `#2a3039`          | `#e4e9ef`             | 选中/按下                  |
| `--app-border`          | `#262a31`          | `#dfe4ea`             | 常规边框                   |
| `--app-border-strong`   | `#343a44`          | `#c9d1da`             | 分隔线/强调边框            |
| `--app-text`            | `#e8eaed`          | `#1a1f26`             | 主文字                     |
| `--app-text-muted`      | `#9aa3af`          | `#5b6572`             | 次要文字                   |
| `--app-text-subtle`     | `#7b8593`          | `#6b7480`             | 辅助/说明                  |
| `--app-accent`          | `#3b82f6`          | `#2563eb`             | 主操作/焦点                |
| `--app-accent-hover`    | `#60a5fa`          | `#1d4ed8`             | 主操作 hover               |
| `--app-accent-contrast` | `#ffffff`          | `#ffffff`             | 强调色上的文字             |
| `--app-role-a`          | `#7c6cf0`          | `#5b4fd6`             | 图片 A                     |
| `--app-role-a-contrast` | `#0b0918`          | `#ffffff`             | A 徽章文字                 |
| `--app-role-b`          | `#1f9bb5`          | `#0f7f99`             | 图片 B                     |
| `--app-role-b-contrast` | `#071116`          | `#ffffff`             | B 徽章文字                 |
| `--app-danger`          | `#ef4444`          | `#dc2626`             | 危险/删除                  |
| `--app-success`         | `#22c55e`          | `#16a34a`             | 成功                       |
| `--app-warning`         | `#f59e0b`          | `#b45309`             | 导入提示                   |
| `--app-canvas`          | `#0b0d10`          | `#e9edf2`             | 画布/图片底色              |
| `--app-checker-a`       | `#14171c`          | `#e2e7ed`             | 透明棋盘格                 |
| `--app-checker-b`       | `#191d23`          | `#eef2f6`             | 透明棋盘格                 |
| `--app-overlay`         | `rgb(0 0 0 / 55%)` | `rgb(15 17 21 / 55%)` | 遮罩/图片信息条            |
| `--app-overlay-text`    | `#ffffff`          | `#ffffff`             | **遮罩上的文字（固定白）** |

Tailwind 映射：`bg-app-surface`、`text-app-muted`、`border-app-border`、`bg-role-a`、`text-app-overlay-text` 等。透明度用 `/xx`（如 `bg-app-accent/10`）。

## 3. 布局尺寸

| 区域                      | 高度/宽度 | 说明                                                |
| ------------------------- | --------- | --------------------------------------------------- |
| Harness 顶栏（仅 UI Kit） | 40px      | 页面/主题切换，不进生产                             |
| 应用 Header               | 56px      | 品牌、视图切换、导入/清空/主题/语言/关于            |
| 导入提示条                | 36px      | Header 下方，参与 flex，不再撑破布局                |
| 工具栏                    | 44px      | 缩放/旋转/同步/布局/文件名                          |
| 侧栏                      | 280px     | 固定宽度，v1 不折叠                                 |
| 状态栏                    | 32px      | 数量、上限、快捷键、缩放、同步、选中文件            |
| 窗口最小                  | 1000×650  | Electron 约束；网页 body 最小 900×600（迁移时统一） |

间距：4px 基础，主要用 8/12/16/24；组件内边距 8–12px。圆角：`xs 4`、`sm 6`、`md 8`（默认）、`lg 10`、`xl 14`。阴影只用 `shadow-panel` / `shadow-popover`。

## 4. 字体

- 系统栈：`Inter, "Microsoft YaHei", "PingFang SC", system-ui, -apple-system, "Segoe UI"`；不打包字体。
- 层级：
  - `text-display` 20px / 标题
  - `text-title` 16px / 面板标题
  - `text-body` 13px / 主要正文
  - `text-ui` 12px / 控件
  - `text-ui-sm` 11px / 辅助信息
  - `text-ui-xs` 10px / 角标、kbd
- 正文最小 11px；10px 只用于非关键角标。数字用 `tabular-nums`。

## 5. 组件清单（`src/ui`）

| 组件               | 变体/状态                                               | 规则                                                       |
| ------------------ | ------------------------------------------------------- | ---------------------------------------------------------- |
| `Button`           | primary / secondary / ghost / danger；sm / md；disabled | 必须 `type="button"`；主操作每屏最多 1 个                  |
| `IconButton`       | normal / active / disabled；sm / md                     | `label` 必填，自动 `aria-label` + `title` + `aria-pressed` |
| `SegmentedControl` | 2–4 项；方向键切换                                      | 容器 `role="group"`，按钮 `aria-pressed`；标签必填         |
| `Panel`            | 有/无 header；actions                                   | 用于侧栏分组、组件展示                                     |
| `Dialog`           | open/close；footer 可选                                 | 焦点陷阱、Escape、遮罩点击、关闭后焦点恢复                 |
| `StatusItem`       | 有/无 label                                             | 状态栏与信息行                                             |

常见组合：Header = 品牌 + `SegmentedControl` + 操作；Sidebar = 搜索 + 列表 + 底部提示；Toolbar = 图标组 + 分段控件；Canvas = 棋盘格 + 图片/网格 + 遮罩信息条。

## 6. 交互与视觉状态

- hover：背景 `app-surface-hover`，文字提升到 `app-text`。
- active/选中：背景 `app-surface-active`；选中项可加 `app-accent` 边框或 `app-accent/10` 底色。
- focus：统一 `:focus-visible` 2px `app-focus` 外描边；不要移除 outline。
- disabled：`opacity-45` + `pointer-events-none`。
- 过渡：`transition-colors duration-150`；尊重 `prefers-reduced-motion`（旧 CSS 已有，迁移时保留）。
- 遮罩条：背景 `app-overlay`，文字 `app-overlay-text`；不得使用 `app-text`（浅色主题会不可读）。
- A/B 徽章：`bg-role-a` + `text-role-a-contrast` / `bg-role-b` + `text-role-b-contrast`。

## 7. 无障碍

- 所有图标按钮有 `aria-label`；装饰图标 `aria-hidden`。
- 视图模式/分段控件用 `aria-pressed`；对话框 `aria-modal` + `aria-labelledby`。
- 导入必须可键盘触发（迁移时把 `<label>` 改为可聚焦按钮 + 隐藏 input）。
- A/B 分隔条应升级为 `role="slider"` + `aria-valuenow` + 方向键。
- 全局快捷键在对话框打开时暂停；`Home` 冲突需 `stopPropagation`。
- 对比度目标：正文 ≥ 4.5:1，大字/粗体 ≥ 3:1；当前令牌已按此调整。
- 触控目标 ≥ 28×28；粗指针设备 ≥ 40×40（迁移时补齐）。

## 8. 原型与截图

```bash
npm run ui        # 打开 /ui-kit.html
npm run ui:shots  # 输出到 artifacts/ui/
```

截图状态：深/浅 × 对比、深/浅 × 单图、深/浅 × 多图、深色关于弹窗、组件库深/浅。

评审重点：

- 深浅主题下文字/图标对比度
- 中文长文件名截断与英文断词
- 图片信息条在浅色主题的可读性
- 无原生按钮/输入框外观残留
- 侧栏 280px、工具栏 44px、状态栏 32px 是否符合紧凑预期

## 9. 迁移计划

1. **Shell**：Header/Sidebar/Toolbar/StatusBar 用 primitives 重做；修复 ImportNotice 撑破布局、主题闪烁、焦点陷阱、键盘导入、`aria-pressed`。
2. **Single**：迁移单图视图与文件名遮罩；拆 `usePanZoom`。
3. **A/B**：迁移并排/叠加；拆 `useSliderDrag`、`useCompareTransforms`；补单测。
4. **Multi**：迁移网格与同步变换；拆 `useGridLayout`、`useWheelZoom`。
5. **收尾**：删除 01~04 旧 CSS，启用 preflight，删除死样式，补齐 8 条 e2e 与视觉基线。

每步验收：`npm run check` + `npm run e2e` + `npm run ui:shots` 对照 + 手动验证深/浅主题。

## 10. Do / Don't

```tsx
// ✅ 用令牌
<div className="rounded-md border border-app-border bg-app-surface text-app-text" />

// ❌ 裸色值
<div className="rounded-md bg-[#171a1f] text-[#e8eaed]" />

// ✅ 遮罩文字
<span className="bg-app-overlay text-app-overlay-text">hero.png</span>

// ❌ 浅色主题下不可读
<span className="bg-app-overlay text-app-text">hero.png</span>

// ✅ 角色徽章
<span className="bg-role-b text-role-b-contrast">B</span>
```
