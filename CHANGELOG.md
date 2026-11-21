# Changelog

本文件记录团队 fork 的变更。上游历史见 `ZiDongLai/image-compare`。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本遵循 `1.3.0-team.N` 预发布序列。

## [Unreleased]

### 计划中

- UI Shell 迁移（Header / Sidebar / Toolbar / StatusBar）
- Single → A/B → Multi 视图迁移，拆分 `ABCompareView` / `MultiCompareView` / `App`
- Electron 安全与性能审计（roadmap Phase 1）

## [1.3.0-team.0] - 2026-11-22

准备期基线：把工程从「能跑」升级为「可长期 AI 开发」。

### Added

- 私有开发仓库 `JiuZhang-9/image-compare`；公开 fork 改名 `image-compare-baseline` 并冻结。
- 精确版本锁定：Node 24.15、npm 11.6.2、Electron 44.0.0、Vite 8、Vitest 5、Playwright 1.65。
- `npm run deps`：自动注入 `ELECTRON_MIRROR`，规避 GitHub 二进制下载停滞。
- TypeScript `strict: true` 与 `@/*` 路径别名（全量 import 迁移）。
- Prettier + EditorConfig + 一次性格式化；`check` 加入 `format:check` 与 UI 规范检查。
- PR CI（Ubuntu lint/typecheck/test/build + Playwright）与 Windows smoke job；修复过期 macOS/Windows 发布工作流。
- 治理文档：`AGENTS.md`、`CONTRIBUTING.md`、`SECURITY.md`、`NOTICE.md`、`THIRD_PARTY_NOTICES.md`、`docs/*`。
- 设计系统：Tailwind v4 + `tokens.css`（深/浅两套）、`src/ui` primitives、`ui-kit.html` 可交互原型、9 状态截图脚本。
- 测试地基：Vitest jsdom 默认 + jest-dom + coverage 阈值；Playwright 3 条浏览器流程 + 1 条 Electron shell 安全参数测试。
- 构建时版本注入 `__APP_VERSION__`；`theme-init.js` 在首屏前应用主题，消除闪烁。
- 遮罩文字、A/B 角色徽章对比度令牌；浅色主题警告色加深。

### Changed

- 版本从 `1.2.1` 升为 `1.3.0-team.0`；About 版本不再硬编码。
- README 重写为当前私有开发项目说明；上游链接改为 `ZiDongLai/image-compare`。
- Electron/main 支持 `IMAGE_COMPARE_E2E=1`（加载打包产物但不自动退出）。

### Fixed

- About 对话框显示的版本落后于 `package.json`。
- About 中失效的第三方 GitHub 链接。
- 浅色主题下遮罩条文字使用深色导致不可读。

### Known issues

- 真实界面仍是旧全局 CSS；设计系统目前只在 `src/dev` 原型生效。
- Windows 安装包未签名；macOS 为 ad-hoc。
- `npm audit` 报告 20 个 devDependency 漏洞（生产依赖 0 个）；随 electron-builder 工具链升级处理。
- 本机 Node 24.12 低于 `engines` 要求的 24.15，安装 jsdom 时会有 EBADENGINE 警告（不影响测试）。
- 图片解码只有字节上限，没有像素/内存上限（roadmap A1 范围）。

## [baseline-1.2.1]

上游 `ZiDongLai/image-compare` v1.2.1，commit `49644e0`。作为只读基线，tag `baseline-1.2.1` 保留在公开 fork 与私有仓库中。
