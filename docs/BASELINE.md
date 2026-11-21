# 版本冻结记录 · v1.3.0-team.0

> 本文件记录准备期基线的可重复环境与验证结果。每次发版新建对应章节。

## 标识

| 项       | 值                                                                     |
| -------- | ---------------------------------------------------------------------- |
| 版本     | `1.3.0-team.0`                                                         |
| Git tag  | `v1.3.0-team.0`（annotated）                                           |
| Commit   | `1b2d5d8`（`chore: establish engineering, design, and test baseline`） |
| 分支     | `main`                                                                 |
| 仓库     | `JiuZhang-9/image-compare`（private）                                  |
| Release  | https://github.com/JiuZhang-9/image-compare/releases/tag/v1.3.0-team.0 |
| 基线上游 | `baseline-1.2.1` / `ZiDongLai/image-compare@49644e0`                   |
| 冻结日期 | 2026-11-22                                                             |

## 工具链

| 项                | 版本                                                  |
| ----------------- | ----------------------------------------------------- |
| Node（CI）        | 24.15.0                                               |
| Node（本机）      | 24.12.0（低于 engines，jsdom 安装有 EBADENGINE 警告） |
| npm               | 11.6.2                                                |
| Electron          | 44.0.0                                                |
| React / React DOM | 19.2.8                                                |
| TypeScript        | 6.0.3                                                 |
| Vite              | 8.2.2                                                 |
| Vitest            | 5.0.0                                                 |
| Playwright        | 1.65.1                                                |
| Tailwind CSS      | 4.3.5                                                 |
| electron-builder  | 26.15.3                                               |

依赖版本全部精确锁定（`.npmrc` `save-exact=true`），lockfile 提交。

## 验证结果

| 项                           | 结果                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| `npm run check`              | 通过（format / lint / strict tsc / UI 规范 / 97 单测 / build）                                    |
| `npm run e2e`                | 4/4 通过（导入、视图切换、主题/语言、Electron shell）                                             |
| `npm run coverage`           | 行 62.07% / 语句 62.33% / 分支 56.28% / 函数 62.92%                                               |
| `npm run smoke:electron`     | 通过                                                                                              |
| `npm run ui:shots`           | 9 张状态截图（deep/light × compare/single/grid + about + components ×2）                          |
| `npm run electron:build:win` | 通过（本次输出到 `D:\Temp\image-compare-release`，见下方说明）                                    |
| `npm run smoke:packaged`     | 通过（`IMAGE_COMPARE_RELEASE_DIR=D:/Temp/image-compare-release`）                                 |
| GitHub Actions CI            | 全绿：Ubuntu verify（3 e2e + 1 skip）；Windows smoke（4 e2e + Electron smoke）；run `44935722492` |

Windows 产物：`Image-Compare-1.3.0-team.0-Windows-x64-Setup.exe`（约 109 MB）。

## 已知环境/网络问题

- GitHub Electron 二进制下载在本机停滞：使用 `npm run deps`（注入 `ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/`）。
- Playwright Chromium 1255 在本机下载失败：本地 e2e 使用系统 Edge；CI 使用 `playwright install chromium`。
- 本机工作区的 `release/` 目录被外部句柄锁定（清理后仍复现），electron-builder 无法把 `win-unpacked.tmp` 重命名；改用 `-c.directories.output=D:/Temp/image-compare-release` 验证，产物启动正常。CI 干净 runner 不受影响（Windows job 已通过）。
- `npm audit` 的 20 个漏洞全部来自 devDependencies（electron-builder 工具链）；`npm audit --omit=dev` 为 0。
- 版本注入：Vite `define` 的 `__APP_VERSION__` 在 Vitest 中未替换，AboutModal 回退到 `0.0.0-dev`，测试用正则匹配。

## 复现步骤

```bash
npm run deps
npm run check
npm run e2e
npm run coverage
npm run smoke:electron
npm run ui:shots
npm run electron:build:win
npm run smoke:packaged
```
