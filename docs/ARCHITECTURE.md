# 架构说明

## 1. 进程模型

```text
┌────────────────────────────── Electron main ──────────────────────────────┐
│ electron/main.cjs                                                          │
│  BrowserWindow(1440×900, min 1000×650)                                     │
│  webPreferences: contextIsolation / sandbox / no nodeIntegration           │
│  deny: new windows, navigation, webview, permissions                       │
│  load: dev → http://127.0.0.1:5173； packaged/smoke/e2e → dist-renderer     │
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │ preload.cjs（仅 contextBridge 暴露 platform）
┌───────────────────────────────────▼────────────────────────────────────────┐
│ Renderer (React 19 + Vite)                                                 │
│  main.tsx → StrictMode → AppErrorBoundary → I18nProvider → App             │
│  App → useImageLibrary（reducer）→ 视图组件                                  │
└────────────────────────────────────────────────────────────────────────────┘
```

- 没有 IPC 通道；渲染进程不访问文件系统。导入通过 DOM 文件选择/拖拽完成。
- CSP 由 `config/contentSecurityPolicy.ts` 生成，Vite 注入 `index.html` 的 `<meta>`；生产无 `unsafe-eval`。
- `IMAGE_COMPARE_SMOKE_TEST=1`：加载打包产物、打印标记后退出；`IMAGE_COMPARE_E2E=1`：加载产物但不退出，供 Playwright `_electron` 使用。

## 2. 渲染进程数据流

```text
useImageLibrary()                       App 本地状态
├─ images[]                             ├─ theme（localStorage）
├─ selectedId / selectedImage           ├─ viewMode
├─ compareA / compareB                  ├─ showAbout / importNotice
├─ importNotice                         ├─ zoom / rotation / pan（单图）
├─ addImageFiles / selectImage          ├─ showFileNames
├─ setAsImageA / setAsImageB            └─ compareHelp（来自 AB 视图）
├─ reorder / undo / restore
├─ delete / clear / loadError
└─ reducer: src/state/imageLibraryState.ts
```

- `useImageLibrary` 用 `useRef` 镜像 + `useState` 触发渲染，reducer 是纯函数，单测覆盖。
- 图片对象：`{ id, name, size, url, thumbnailUrl }`；`url` 与 `thumbnailUrl` 都是 object URL，必须在删除/清空/卸载时释放。
- 缩略图：`createImageBitmap` → canvas → WebP，最长边 160px，并发 2，`AsyncTaskQueue` 限流。
- 导入校验：MIME、单张 50 MiB、总量 500 MiB、最多 100 张；超限进入 `importNotice`。
- 视图变换：单图在 `App`，A/B 与多图在各自组件内（迁移 UI 时会统一到共享 viewer store）。

## 3. 视图与工具栏

- `ViewerToolbar` 渲染两个空插槽（`#viewer-toolbar-center`、`#viewer-toolbar-actions`）。
- `ABCompareView` / `MultiCompareView` 用 `createPortal` + `document.getElementById` 把控件放进插槽。
  - 这是当前最大的结构耦合；新 UI 迁移时改为 React context/portal 目标，避免渲染期查 DOM。
- A/B 有两种显示：并排（`ab-side-view`）与叠加（`ab-overlay-view`，`clip-path` + 滑块）。
- 多图：`multiGridLayout.ts` 计算列数/卡片尺寸，视图用 flex-wrap + CSS 变量；同步变换通过 `useFrameScheduler` 合并每帧更新。

## 4. 样式架构（迁移中）

| 层    | 现状                                                                 | 目标                         |
| ----- | -------------------------------------------------------------------- | ---------------------------- |
| 令牌  | `src/styles/tokens.css`（唯一色板，深/浅）                           | 保持单一来源                 |
| 新 UI | `src/styles/globals.css` + Tailwind utilities                        | 全部新组件                   |
| 旧 UI | `src/styles/01~04*.css` 共 5,700+ 行、97 个 `!important`             | 逐屏删除，最后启用 preflight |
| 入口  | 旧：`src/App.css` 引 01~04；新：`src/dev/ui-kit-main.tsx` 引 globals | 迁移完成后只保留 globals     |

原则：

- 颜色/间距/圆角/字号/阴影只能来自 tokens；`scripts/check-ui-conventions.mjs` 会拦截裸色值、任意值、`!important`。
- 组件优先使用 `src/ui` primitives；业务组件只负责布局与数据。
- 遮罩上的文字统一用 `app-overlay-text`（浅色主题下也是白字）。
- 深/浅主题通过 `<html data-theme>` 切换；`public/theme-init.js` 在首屏前应用，避免闪烁。

## 5. 测试架构

| 层             | 工具                          | 范围                                        |
| -------------- | ----------------------------- | ------------------------------------------- |
| 纯函数/状态    | Vitest（node/jsdom）          | reducer、导入校验、变换、网格布局、键盘映射 |
| 组件           | Vitest + RTL + jest-dom       | UI primitives、Sidebar、About、Toolbar      |
| 浏览器流程     | Playwright（Vite dev server） | 导入、视图切换、主题/语言                   |
| Electron shell | Playwright `_electron`        | 窗口创建 + 安全 webPreferences              |
| 打包冒烟       | `scripts/electron-smoke.cjs`  | 启动打包产物并等待标记                      |

覆盖率阈值在 `vitest.config.ts`：当前 60% 行/函数/语句、54% 分支，只升不降。

## 6. 已知债务

1. `ABCompareView.tsx`（797 行）、`MultiCompareView.tsx`（623 行）、`App.tsx`（571 行）职责过重，缺单测。
2. 旧 CSS 5,700+ 行、97 个 `!important`、主题 token 重复 5 处。
3. 三个视图的变换状态各自为政；切换视图会重置 A/B/多图变换。
4. 工具栏 portal 通过 DOM id 查找，组件难以独立测试。
5. 侧边栏 14 个 props、Header 7 个 props；迁移时引入更小的 context/store。
6. 单图平移每次 `mousemove` 都 setState，未用 rAF 合并。
7. 图片解码无像素/内存上限。

## 7. 决策记录

| 决策                                      | 理由                                                              |
| ----------------------------------------- | ----------------------------------------------------------------- |
| 保留 React 内置状态，不引入 zustand/redux | 依赖最小；先用拆分/context 解决钻透，必要时再评估                 |
| 新 UI 用 Tailwind + primitives            | AI 易改写、无全局级联、样式局部可预测；配合令牌与规范检查降低回归 |
| 旧 CSS 分阶段替换，不一次性重写           | 降低大爆炸风险；每迁移一屏即可验证                                |
| 不引入 UI 组件库/字体包                   | 体积、许可与可控性；系统字体足够                                  |
| 私有仓库 + 保留 MIT 上游声明              | GitHub 不允许公开 fork 转私有；MIT 允许私有衍生，但需保留声明     |
| 精确锁定依赖版本                          | 可重复构建；升级走显式 PR                                         |

## 8. 扩展点

- 新 primitive：`src/ui` + `PrimitiveGallery` + 单测。
- 新视图：先在 `src/dev` 用 mock 数据做稿，再接入 `useImageLibrary`。
- 新导入格式：扩展 `src/utils/imageImport.ts` 的 MIME 白名单与解码降采样。
- 新设置项：先定义 localStorage key + 类型，再集中到 settings context（迁移时）。
