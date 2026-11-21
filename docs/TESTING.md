# 测试规范

## 1. 测试分层

| 层             | 工具                         | 位置                                             | 负责什么                            |
| -------------- | ---------------------------- | ------------------------------------------------ | ----------------------------------- |
| 纯函数/状态    | Vitest（node/jsdom）         | `src/**/*.test.ts`                               | reducer、校验、变换、布局、键盘映射 |
| 组件           | Vitest + RTL + jest-dom      | `src/components/*.test.tsx`、`src/ui/*.test.tsx` | 渲染、交互、可访问名称、状态        |
| 浏览器流程     | Playwright                   | `e2e/*.spec.ts`                                  | 导入、视图切换、主题/语言           |
| Electron shell | Playwright `_electron`       | `e2e/electron-shell.spec.ts`                     | 窗口创建与安全 webPreferences       |
| 打包冒烟       | `scripts/electron-smoke.cjs` | CI / 本地                                        | 打包产物能启动并加载                |

## 2. 命令

```bash
npm test              # vitest run（jsdom 默认）
npm run test:watch
npm run coverage      # v8 覆盖率 + 阈值
npm run e2e           # 浏览器 + Electron shell（Windows）
npm run e2e:ui        # Playwright UI 模式
npm run smoke:electron
npm run check         # 提交前：format/lint/typecheck/UI 规范/单测/build
npm run check:all     # check + e2e + smoke
```

本地 Playwright 默认使用系统 Edge（`PLAYWRIGHT_CHANNEL` 可覆盖）；CI 使用自带 Chromium（`npx playwright install --with-deps chromium`）。

## 3. 覆盖率

- 配置：`vitest.config.ts`；阈值：行/函数/语句 60%，分支 54%。
- 当前基线：行 62.07%、语句 62.33%、分支 56.28%、函数 62.92%。
- 只升不降；新增核心逻辑应带测试。`src/dev`、`src/ui/index.ts`、`vite-env.d.ts` 不计入。

## 4. 写测试的规则

1. 修 bug 先写失败用例，再修。
2. 断言行为与可访问性，不断言 class 字符串（除非测试 primitive 的变体映射）。
3. 使用 `getByRole` / `getByLabelText` / `getByText`；`data-testid` 用于无合适语义的结构。
4. 异步交互用 `userEvent` + `await`；不要用固定 `sleep`。
5. 每个测试独立：清除 localStorage、清理 DOM；`src/test/setup.ts` 已统一 `cleanup`。
6. 需要 node 环境的用例在文件首行写 `// @vitest-environment node`。
7. 新增 primitive 必须有：默认、active/选中、disabled、键盘行为（如适用）。

## 5. e2e 规则

- 选择器优先级：角色 + 名称 > label/placeholder > `data-testid` > 结构 class。
- 结构性根节点可用 class：`.single-view`、`.ab-side-view`、`.multi-compare-shell`。
- 固定素材在 `e2e/fixtures/`（红/蓝/透明/损坏 PNG），由 `npm run fixtures` 生成。
- 测试之间不共享状态：Playwright 每个 test 独立 context。
- Electron shell 测试仅 Windows 且需要 `dist-renderer`（先 `npm run build`）；其他平台自动 skip。
- 不要截断式等待动画；用 `expect(...).toBeVisible()` 自动重试。

## 6. 常见场景清单

| 改动              | 必测                                                         |
| ----------------- | ------------------------------------------------------------ |
| 导入校验/上限     | `src/utils/imageImport.test.ts` + `useImageLibrary.test.tsx` |
| 删除/清空/卸载    | object URL revoke 断言                                       |
| 排序/撤销         | reducer + Sidebar 键盘测试                                   |
| 变换/缩放/旋转    | `imageTransforms.test.ts` + 组件测试                         |
| 网格布局          | `multiGridLayout.test.ts`                                    |
| 主题/语言         | `theme-language.spec.ts`                                     |
| 视图切换          | `compare.spec.ts`                                            |
| Electron 安全开关 | `electron-shell.spec.ts`                                     |

## 7. 调试

- 单测失败：`npx vitest run <file> --reporter=verbose`；DOM 断言失败会打印整棵树。
- e2e 失败：`npm run e2e:ui` 或查看 `test-results/` 的 trace/screenshot。
- 覆盖率异常：`npm run coverage` 后看 `coverage/index.html`。
- jsdom 缺少 API：在 `src/test/setup.ts` 补 stub（如 `matchMedia`、`ResizeObserver`）。
- Playwright 浏览器下载失败：本地用 Edge（默认），CI 用 `npx playwright install --with-deps chromium`。

## 8. CI

- PR（Ubuntu）：`npm run check` → 安装 Chromium → `npm run e2e`。
- push main + Windows：`npm run check` → e2e（Edge）→ `smoke:electron`。
- tag：Windows NSIS / macOS ARM64 构建 + 校验和 + Release（见 `docs/RELEASE.md` 待补）。
