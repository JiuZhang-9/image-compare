# AGENTS.md

面向 AI 编码助手的项目上下文。修改代码前先读本文件与 `docs/ARCHITECTURE.md`；改 UI 前再读 `docs/UI_DESIGN.md`。

## 1. 项目定位

Electron + React 桌面图片查看器，核心是 **A/B 并排/叠加对比** 与 **多图网格同步对比**。所有图片只在本地内存处理，不上传、无遥测、无云服务。

当前版本：`1.3.0-team.0`（准备期基线，见 `docs/BASELINE.md`）。上游：`ZiDongLai/image-compare`（MIT）。

## 2. 技术栈

- Electron 44.0.0（精确锁定）、React 19.2、TypeScript 6（`strict: true`）
- Vite 8 + electron-builder 26
- Tailwind CSS 4.3 + CSS 变量令牌（新 UI）；旧 UI 仍是全局 CSS，正在逐屏迁移
- Vitest 5 + React Testing Library；Playwright 1.65
- oxlint + Prettier；GitHub Actions（Node 24.15）

## 3. 常用命令

| 命令                            | 用途                                                                       |
| ------------------------------- | -------------------------------------------------------------------------- |
| `npm run deps`                  | 安装依赖（自动注入 `ELECTRON_MIRROR`，本机 GitHub 下载会卡）               |
| `npm run dev`                   | Vite + Electron 开发                                                       |
| `npm run dev:renderer`          | 只起 Vite（浏览器调试 / e2e）                                              |
| `npm run check`                 | format:check + lint + typecheck + UI 规范 + 单测 + build（提交前必须全绿） |
| `npm run check:all`             | `check` + e2e + Electron smoke                                             |
| `npm test` / `npm run coverage` | 单测 / 覆盖率（阈值 60% 行）                                               |
| `npm run e2e`                   | Playwright（浏览器 3 条 + Windows Electron shell 1 条）                    |
| `npm run ui`                    | 打开 `http://127.0.0.1:5173/ui-kit.html` 设计系统与原型                    |
| `npm run ui:shots`              | 截取原型 9 个状态到 `artifacts/ui/`（gitignored）                          |
| `npm run smoke:electron`        | 打包前 Electron 冒烟                                                       |
| `npm run electron:build:win`    | Windows NSIS 安装包                                                        |
| `npm run fixtures`              | 重新生成 e2e 图片素材                                                      |

## 4. 目录结构

```text
electron/           主进程 main.cjs、preload.cjs
config/             CSP 生成与测试
src/
  App.tsx           应用壳与视图状态（待拆分）
  components/       业务视图：ABCompareView、MultiCompareView、Sidebar…
  hooks/            useImageLibrary、useFrameScheduler
  state/            reducer 与纯函数状态逻辑
  utils/            导入校验、变换、网格布局、键盘映射
  ui/               设计系统 primitives（新 UI 只从这里取组件）
  dev/              dev-only UI Kit 与可交互原型（不进生产包）
  styles/           tokens.css（唯一色板）+ globals.css（Tailwind）
  test/             Vitest setup
e2e/                Playwright specs + fixtures
scripts/            smoke、图标、依赖安装、截图、规范检查
docs/               ROADMAP / ARCHITECTURE / UI_DESIGN / TESTING / BASELINE
```

## 5. 数据流

```text
main.tsx
└─ StrictMode > AppErrorBoundary > I18nProvider > App
   ├─ useImageLibrary()  → images / A/B 选择 / 导入 / 排序 / 删除
   ├─ App 本地状态       → theme / viewMode / 单图 zoom·rotation·pan
   ├─ AppHeader / ImageSidebar
   └─ ViewerToolbar + SingleImageView | ABCompareView | MultiCompareView + StatusBar
```

`ABCompareView` 与 `MultiCompareView` 通过 portal 往 `ViewerToolbar` 的插槽渲染控件（`document.getElementById`）；迁移 UI 时优先改成 React portal/上下文，不要继续扩大这种耦合。

## 6. 不可破坏的约束

- `contextIsolation: true`、`sandbox: true`、`nodeIntegration: false`、`webSecurity: true` 不得放宽。
- preload 只能通过 `contextBridge` 暴露最小 API；禁止暴露裸 `ipcRenderer` / `fs`。
- 所有 object URL 必须在删除、清空、卸载时 `revokeObjectURL`。
- 导入上限（100 张 / 50 MiB 单张 / 500 MiB 总量）必须保留且可配置。
- 生产 CSP 不允许 `unsafe-eval`；不引入远程脚本、遥测、上传。
- 不做自动像素 diff 报告、CI 视觉回归、云同步、账号体系。
- 上游 MIT 声明与 `LICENSE` 不得删除。

## 7. 编码规则

- TypeScript strict；禁止新增 `any`（用 `unknown` + 收窄）。`tsc -b` 必须 0 错误。
- 跨目录 import 一律用 `@/...`；同目录可用 `./`。
- 组件必须是函数组件 + hooks；单文件目标 < 300 行，超出就拆 hooks/子组件。
- 交互元素必须是真实 `button` / `input` / `label`，有可访问名称；图标按钮用 `IconButton`（强制 `label`）。
- 统一 `data-testid="area-name"`；优先用角色与 aria 名称定位。
- 新 UI **只用** `src/ui` primitives 与设计令牌对应的 Tailwind 类：
  - 禁止裸 `#hex` / `rgb()` / `hsl()`（唯一例外：`src/styles/tokens.css`）。
  - 禁止 Tailwind 任意值 `[...]`；需要新尺寸/颜色先加令牌。
  - 禁止 `!important`。
  - 复杂效果放 `@layer components`，不要在 JSX 里堆伪元素。
- 状态更新不要阻塞主线程：高频拖动用 `useFrameScheduler` 或 rAF 合并。

## 8. 测试要求

- 改纯函数/状态逻辑：补 `*.test.ts`。
- 改核心交互（视图切换、A/B、缩放、排序、导入）：补 `*.test.tsx`。
- 改用户流程：补 `e2e/*.spec.ts`；优先用角色/名称，结构性根节点才用 class。
- 新 primitive：必须同时更新 `PrimitiveGallery` 与 `docs/UI_DESIGN.md`。
- 覆盖率不得低于 `vitest.config.ts` 阈值（当前 60% 行/函数/语句，54% 分支）。
- 修 bug 先写失败用例，再修。

## 9. UI 开发循环（重要）

1. 改 `src/ui` 或 `src/dev`。
2. `npm run ui` 在浏览器打开原型（深/浅主题、界面原型/组件库两个页签）。
3. `npm run ui:shots` 生成 9 张状态图到 `artifacts/ui/`，逐张检查：
   - 深/浅主题对比度
   - 中文截断与换行
   - 没有原生按钮/输入框外观残留
   - 遮罩上的文字使用 `app-overlay-text`
4. 视觉确认后再改真实组件；一次只迁移一个区域（Shell → Single → A/B → Multi）。
5. 迁移完成后删除对应旧 CSS，启用 preflight。

## 10. 提交与分支

- 分支：`feat/...`、`fix/...`、`chore/...`、`docs/...`。
- Conventional Commits：`feat:`、`fix:`、`chore:`、`docs:`、`test:`、`refactor:`。
- 一个提交只做一件事；格式化单独提交；禁止顺手大重构。
- PR 前必须 `npm run check`；涉及交互再跑 `npm run e2e`。
- 版本从 `1.3.0-team.N` 递增；发版更新 `CHANGELOG.md` 并打 annotated tag。

## 11. 常见任务

**加一个 primitive**：`src/ui/X.tsx` → 导出到 `src/ui/index.ts` → 单测 → 在 `PrimitiveGallery` 展示全状态 → 更新 `docs/UI_DESIGN.md`。

**加一个视图**：先在 `src/dev` 用 mock 数据做视觉稿 → 确认后接入真实状态 → 补单测与 e2e → 删除旧实现。

**修样式 bug**：先判断是令牌问题还是用法问题；不要在组件里写死颜色或 `!important`。

**升级依赖**：单独 PR；精确版本；跑 `npm run check:all` 与打包冒烟；记录 CHANGELOG。

## 12. 禁止事项

- 不要改 `electron/main.cjs` 的安全开关来「让功能跑起来」。
- 不要引入新的运行时状态库、UI 组件库、CSS-in-JS、字体包（先讨论）。
- 不要提交 `artifacts/`、`coverage/`、`release/`、`dist-renderer/`。
- 不要把私有代码、内部路径、版本信息发到公网仓库或外部服务。
