# CONTRIBUTING

## 环境准备

- Node.js **24.15.0+**（`.nvmrc` 已锁定；本机 Node 24.12 会有 jsdom engine 警告）
- npm 11.6.2（`packageManager` 已声明）
- Windows 10/11 或 macOS 13+；本仓库主力开发/验证平台是 Windows x64

```bash
npm run deps     # 等价于 npm ci，并注入 ELECTRON_MIRROR
npm run check    # 提交前必须全绿
npm run dev      # 启动 Electron 开发环境
```

> 直接 `npm ci` 在部分网络下会卡在 Electron 二进制下载；用 `npm run deps`。

## 分支与提交

- `main` 保持可发布；所有改动走分支 + PR。
- 分支命名：`feat/<topic>`、`fix/<topic>`、`chore/<topic>`、`docs/<topic>`、`test/<topic>`。
- 提交信息使用 Conventional Commits：
  - `feat: add session restore`
  - `fix: release object URLs on failed decode`
  - `chore: pin toolchain versions`
  - `docs: document UI tokens`
- 一个提交只做一件事；格式化/重命名单独提交；单个 PR 尽量 < 400 行。
- 大改拆成「测试先行 → 重构 → 功能」三个 PR。

## Definition of Done

- [ ] `npm run check` 全绿（format / lint / strict typecheck / UI 规范 / 单测 / build）
- [ ] 涉及交互的改动 `npm run e2e` 全绿
- [ ] 新增逻辑有单测；核心视图改动有组件测试
- [ ] 新 UI 只用 `src/ui` primitives 与设计令牌；无裸色值、无 `!important`、无 Tailwind 任意值
- [ ] 没有新增 `any`、没有放宽 Electron 安全开关
- [ ] 更新 `CHANGELOG.md` 与相关文档
- [ ] 至少一台目标平台手动验证（主力 Windows；macOS 改动需 macOS 冒烟）

## UI 改动流程

1. 先改 `src/dev` 下的 UI Kit / 原型，`npm run ui` 浏览器确认。
2. `npm run ui:shots` 生成深/浅主题与各视图截图，检查对比度、截断、原生控件残留。
3. 视觉确认后再迁移真实组件；一次只迁一个区域。
4. 迁移完成删除对应旧 CSS；全部迁完后启用 Tailwind preflight。

## 测试

- 单测与源码同目录：`src/**/*.test.ts(x)`；e2e 在 `e2e/`。
- 测试环境默认 jsdom；需要 node 环境的用例在文件顶部写 `// @vitest-environment node`。
- e2e 优先使用角色 + 可访问名称；结构性根节点才用 class（如 `.ab-side-view`）。
- 修 bug 先写失败用例。

## 上游同步

```bash
git fetch upstream
git log --oneline main..upstream/main
# 只 cherry-pick 安全/关键修复，不整包合并；所有改动必须过本地 e2e
```

每季度评估一次；上游停更则归档 `upstream`，不再期待。

## 许可

- 上游代码版权归 `ZiDongLai/image-compare`，MIT；`LICENSE` 不得删除。
- 新增修改版权归 JiuZhang-9，按私有/保留所有权利处理；对外分发前确认 MIT 声明随附。
- 不引入 GPL/AGPL 依赖，除非明确只内部使用并接受义务。
