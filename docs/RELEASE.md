# 构建与发布 Runbook

## 版本规范

- 开发预发布：`1.3.0-team.N`（N 从 0 递增）
- 团队稳定版：`1.3.0`（或按破坏性变更决定 `2.0.0`）
- 每次发布：更新 `CHANGELOG.md` → 提交 → annotated tag `v<version>` → 推送 tag → CI 构建。

## 发布前检查

- [ ] `npm run check:all` 全绿
- [ ] `docs/BASELINE.md` 更新版本与验证结果
- [ ] `CHANGELOG.md` 写入本次变更
- [ ] 无 P0/P1 缺陷
- [ ] 干净机器验证计划已安排

## Windows

```bash
npm run electron:build:win
npm run smoke:packaged
```

产物：`release/Image-Compare-<version>-Windows-x64-Setup.exe`、`release/WINDOWS_SHA256SUMS.txt`。

如果本机 `release/` 目录被占用（Windows 句柄锁）：

```bash
npx electron-builder --win nsis --x64 --publish never -c.directories.output=D:/Temp/image-compare-release
IMAGE_COMPARE_RELEASE_DIR=D:/Temp/image-compare-release npm run smoke:packaged
```

- 未签名；首次运行 SmartScreen 提示属预期。
- 分发时附 SHA256。

## macOS

必须在 macOS 上构建：

```bash
npm run electron:build:mac
npm run smoke:packaged
```

产物：`release/Image-Compare-<version>-macOS-arm64.dmg|zip`、`SHA256SUMS.txt`、`MACOS_INSTALL.txt`。

- ad-hoc 签名（`identity: "-"`），未公证；首次打开需在「隐私与安全性」确认。
- 不启用自动更新。

## CI

- PR / push main：`.github/workflows/ci.yml`（Ubuntu 验证 + Playwright；Windows smoke）。
- tag `v*`：macOS 构建 + Release；Windows 发布工作流构建并创建 Release。
- 私有仓库注意 Actions 分钟数；macOS 仅在 tag/手动触发。

## 发布后

- [ ] 校验 `gh release view` 产物与校验和
- [ ] 干净机器安装/启动
- [ ] 更新 `docs/BASELINE.md`
- [ ] 记录遗留问题与下一版本范围

## 上游同步

```bash
git fetch upstream
git log --oneline main..upstream/main
# cherry-pick 安全/关键修复；过本地 e2e 后再合并
```

每季度评估一次；上游停更则归档 `upstream`。
