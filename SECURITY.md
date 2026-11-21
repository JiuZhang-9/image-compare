# SECURITY

## 支持的版本

当前仅维护 `1.3.x-team.*`。上游 `1.2.x` 只作为只读基线（`baseline-1.2.1` tag）。

## 报告问题

- 这是一个私有仓库：请在 GitHub Security → Advisories 中私下报告，或直接联系仓库所有者。
- **不要**在公开 issue、公开 fork 或聊天群中披露未修复的漏洞。
- 请提供：复现步骤、受影响版本/提交、影响面、PoC（如有）。

## 数据与隐私

- 图片只在本地内存处理；不读取用户未选择的文件；无网络上传、无遥测、无账号体系。
- 导入通过 DOM `<input type="file">` / drag & drop，运行时不使用 Node `fs`。
- 日志/错误页不输出本地路径、堆栈或图片内容。

## Electron 安全基线（当前状态）

| 项                                               | 状态                            |
| ------------------------------------------------ | ------------------------------- |
| `contextIsolation: true`                         | ✅                              |
| `sandbox: true`                                  | ✅                              |
| `nodeIntegration: false`                         | ✅                              |
| `webSecurity: true`                              | ✅                              |
| preload 仅 `contextBridge` 暴露 `platform`       | ✅                              |
| 无裸 `ipcRenderer` / 无运行时 IPC                | ✅                              |
| 生产 CSP 无 `unsafe-eval`，`script-src 'self'`   | ✅                              |
| `setWindowOpenHandler` 全部 deny                 | ✅                              |
| `will-navigate` / `will-attach-webview` 全部阻止 | ✅                              |
| 权限请求默认拒绝                                 | ✅                              |
| `webviewTag: false`                              | ✅                              |
| object URL 删除/清空/卸载时释放                  | ✅（单测覆盖）                  |
| 导入上限 100 张 / 50 MiB / 500 MiB               | ✅                              |
| 生产包无 sourcemap / 源码                        | ✅                              |
| 安装包签名                                       | ⚠️ Windows 未签名；macOS ad-hoc |
| 图片解码内存上限（按像素/解码内存）              | ❌ 仅有字节上限                 |
| CSP 以 HTTP header 下发                          | ❌ 仅 `<meta>`                  |
| 单实例锁 / `second-instance`                     | ❌ 未实现                       |

## 已知限制与风险

- **压缩炸弹**：50 MiB 的图片可能解码为数百 MP。当前只限制文件字节数，没有像素/解码内存上限；后续在缩略图与视图加载前加尺寸探测与降采样。
- **CSP `style-src 'unsafe-inline'`**：用于组件内联 transform/clip-path；不允许 `unsafe-eval`。
- **外链**：关于页的 GitHub 链接在 Electron 中会被 `setWindowOpenHandler` 拦截，实际不可点击（功能缺陷，不是安全漏洞）。
- **分发信任**：未签名安装包会触发 SmartScreen/Gatekeeper；对外分发时附 SHA256 与安装说明，不启用自动更新。

## 评审触发条件

以下改动必须人工安全 review：

- `electron/main.cjs`、`electron/preload.cjs`、`config/contentSecurityPolicy.ts`
- 新增 IPC、文件系统访问、`shell.openExternal`、网络请求
- 放宽 CSP / 安全开关 / 导入限制
- 打包配置、签名、发布流程

## 加固待办（roadmap Phase 1）

- 图片像素/解码内存上限与降采样
- `requestSingleInstanceLock`、`will-redirect`、全局 `web-contents-created` 防护
- CSP 改为响应头下发（主进程 `onHeadersReceived`）
- 依赖月度审计与 Electron 安全公告跟踪
- 签名/公证策略文档（零预算路径）
