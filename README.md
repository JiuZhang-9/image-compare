# 图片对比工具（Image Compare）

完全本地运行的桌面图片查看与 A/B / 多图对比工具。基于 [ZiDongLai/image-compare](https://github.com/ZiDongLai/image-compare)（MIT）的团队 fork，当前处于 `1.3.0-team.0` 准备期基线。

> 私有开发仓库。上游代码版权与 MIT 声明见 [`LICENSE`](./LICENSE)、[`NOTICE.md`](./NOTICE.md)。

## 功能

### 单图

- 自适应窗口，缩放 / 拖动 / 旋转 / 复位
- 方向键切换图片
- 文件名显示开关

### A/B 对比

- 左右并排 + 重叠滑块
- A/B 同步或独立校准
- 缩放、平移、旋转、复位

### 多图

- 3 张横排、4 张 2×2，更多图自动排列
- 全局同步变换，`Alt` 单独校准一张

### 管理

- 按钮 / 拖拽导入；拖拽与键盘排序；撤销、恢复导入顺序
- 文件名筛选、定位当前图片
- 中文 / 英文；深色 / 浅色主题（gray 主题将在 UI 迁移时移除）
- 导入上限：100 张、单张 50 MiB、总量 500 MiB

## 快捷键

| 模式     | 操作                                                   |
| -------- | ------------------------------------------------------ |
| 单图     | `←` / `→` 切图，`+` / `-` 缩放，`0` 复位，`R` 旋转     |
| A/B      | `+` / `-` 缩放当前对象，`0` 复位，`R` 旋转             |
| 多图     | `+` / `-` 同步缩放，`0` 全部复位，`R` 全部旋转         |
| 多图鼠标 | `Ctrl/Cmd + 滚轮` 同步缩放，`Alt + 滚轮/拖动` 调整单图 |
| 图片列表 | `Ctrl/Cmd + F` 定位筛选框，`Esc` 清除筛选              |

## 隐私

- 图片只在本地内存处理，不上传、无遥测、无网络请求。
- 删除 / 清空 / 关闭时释放 object URL。
- 无法解码的图片会被隔离，不影响其他图片。
- 错误页不显示图片内容、本地路径或堆栈。

## 技术栈

| 层     | 选型                                            |
| ------ | ----------------------------------------------- |
| 运行时 | Electron 44（精确锁定）                         |
| UI     | React 19 + TypeScript 6（strict）               |
| 构建   | Vite 8 + electron-builder 26                    |
| 新样式 | Tailwind CSS 4 + 设计令牌 + `src/ui` primitives |
| 测试   | Vitest 5 + RTL；Playwright 1.65                 |
| 质量   | oxlint + Prettier + GitHub Actions              |

旧界面仍使用全局 CSS（5,700+ 行），正在按「Shell → Single → A/B → Multi」逐屏迁移到设计系统。当前设计系统与可交互原型见 `ui-kit.html`。

## 本地开发

需要 **Node.js 24.15+**（`.nvmrc` 已锁定）与 npm 11.6。

```bash
npm run deps     # npm ci + ELECTRON_MIRROR（本机直连 GitHub 会卡）
npm run dev      # Vite + Electron
npm run check    # format / lint / typecheck / UI 规范 / 单测 / build
npm run e2e      # Playwright（浏览器 + Windows Electron shell）
npm run ui       # http://127.0.0.1:5173/ui-kit.html 设计系统与原型
```

常用脚本：

| 命令                         | 说明                                   |
| ---------------------------- | -------------------------------------- |
| `npm run dev:renderer`       | 只起 Vite（浏览器调试 / e2e）          |
| `npm run check:all`          | `check` + e2e + Electron smoke         |
| `npm run coverage`           | 覆盖率（阈值 60%）                     |
| `npm run ui:shots`           | 原型 9 状态截图 → `artifacts/ui/`      |
| `npm run smoke:electron`     | 打包前 Electron 冒烟                   |
| `npm run electron:build:win` | Windows NSIS 安装包                    |
| `npm run electron:build:mac` | macOS ARM64 DMG/ZIP（需在 macOS 构建） |

## 文档

- [AGENTS.md](./AGENTS.md) — AI 开发上下文与硬约束
- [CONTRIBUTING.md](./CONTRIBUTING.md) — 分支、提交、DoD
- [SECURITY.md](./SECURITY.md) — 安全基线、报告方式、已知限制
- [docs/ROADMAP.md](./docs/ROADMAP.md) — 里程碑与任务
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — 进程模型、数据流、样式/测试架构
- [docs/UI_DESIGN.md](./docs/UI_DESIGN.md) — 设计令牌、布局、组件与迁移计划
- [docs/TESTING.md](./docs/TESTING.md) — 测试分层与规则
- [docs/RELEASE.md](./docs/RELEASE.md) — 构建与发布 runbook
- [docs/BASELINE.md](./docs/BASELINE.md) — 版本冻结记录
- [CHANGELOG.md](./CHANGELOG.md)

## 打包与分发

- Windows x64：NSIS 安装包，未签名（SmartScreen 提示属预期）。
- macOS ARM64：ad-hoc 签名、未公证；首次打开需在「隐私与安全性」中确认。DMG 必须由 macOS 生成。
- 不启用自动更新；对外分发附 SHA256 与安装说明。

## 许可

上游部分采用 [MIT License](./LICENSE)。新增修改按私有/保留所有权利处理，详见 [NOTICE.md](./NOTICE.md) 与 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
