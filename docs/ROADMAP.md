# image-compare Fork 开发路线图

> 基座：`https://github.com/ZiDongLai/image-compare`（MIT，Electron + React + TypeScript）
> 目标：小团队、零预算、可长期自持的桌面 A/B + 多图视觉对比工具
> 原则：**人眼主导比对，机器只做辅助高亮**；不把自动像素 diff / CI 视觉回归作为团队评审流程

---

## 0. 当前进度（2026-11-22）

| 阶段        | 状态        | 说明                                                                                       |
| ----------- | ----------- | ------------------------------------------------------------------------------------------ |
| M0 基线     | ✅ 完成     | fork、`baseline-1.2.1` tag、lint/test/build/smoke 全绿                                     |
| 准备期      | ✅ 完成     | TS strict、Prettier、路径别名、PR CI、Playwright、设计系统与原型、版本冻结 `v1.3.0-team.0` |
| M1 审计     | ⬜ 待开始   | Electron 安全/依赖/性能审计                                                                |
| M2 核心加固 | ⬜ 待开始   | AB/Multi 单测、ABCompareView 拆分                                                          |
| UI 重设计   | 🟡 原型已出 | 视觉方向已定，等待原型确认后迁移真实界面                                                   |

> 准备期的产物详见 `docs/BASELINE.md`、`docs/ARCHITECTURE.md`、`docs/UI_DESIGN.md`、`docs/TESTING.md`。

---

## 1. 现状与差距

### 已有能力（fork 后可直接用）

- 单图查看：自适应、缩放、拖动、旋转、方向键切图
- A/B 对比：左右并排 + 重叠滑块；A/B 同步或独立校准
- 多图对比：3 张横排、4 张 2×2，更多图自动排列；同步缩放/平移/旋转，`Alt` 单独调一张
- 管理：拖拽导入、排序/撤销、文件名筛选、3 套主题、中英文、快捷键
- 工程：Electron 44 + React 19 + TS + Vite + Vitest + oxlint；20 个测试文件；CI；electron-builder
- 平台：Windows x64、macOS ARM64
- 许可：MIT

### 主要缺口

| 类别     | 缺口                                                               | 影响                    |
| -------- | ------------------------------------------------------------------ | ----------------------- |
| 测试     | `ABCompareView`、`MultiCompareView` 两个核心视图没有单测；没有 e2e | 改核心交互容易回归      |
| 安全     | Electron 安全配置需逐项核验；安装包未签名                          | 团队分发有信任成本      |
| 架构     | `ABCompareView.tsx` 约 797 行，职责偏重                            | AI 改动容易牵一发动全身 |
| 团队功能 | 无会话保存、无 CLI 打开、无导出、无闪烁/洋葱皮/像素信息            | 日常评审效率不足        |
| 平台     | macOS 仅 ARM64；无 Intel Mac / Linux 构建                          | 团队机器可能覆盖不全    |
| 维护     | 单人维护、社区极小、README/版本信息有滞后                          | 不能依赖上游，必须自持  |

---

## 2. 范围冻结（Scope）

### Must（首个团队版必须有）

- A/B 并排 + 滑块叠加（已有）
- 多图 3/4+ 网格 + 同步变换（已有）
- Windows + macOS 可重复构建
- 会话保存/恢复（一组图 + 布局 + 变换）
- 核心视图单测 + 8 条 e2e
- Electron 安全基线达标
- 团队使用文档 + 构建/发布 runbook

### Should（第二优先级）

- 闪烁对比（A/B 快速切换）、洋葱皮透明度、阈值差异高亮（人来调、人来看）
- 像素信息面板：尺寸、格式、缩放比例、鼠标处颜色
- CLI/argv 直接打开 A/B 或文件夹
- 当前视图导出 PNG
- 自定义布局 / 单图锁定
- 大图性能优化与内存上限可配置

### Could（有余力再做）

- AVIF / HEIC / JPEG XL 支持
- 文件夹递归导入
- 标注、箭头、文字说明
- Linux AppImage/deb
- 插件式图片加载器

### Won't（明确不做，防止跑偏）

- 自动像素 diff 报告、批量比对、CI 视觉回归
- 云同步、账号体系、团队协作服务
- 批量修图、格式转换、复杂工作流
- 插件市场、自动更新服务（首版不做）

---

## 3. 里程碑总览

| 里程碑            | 时间         | 关键交付                              | 退出条件                                |
| ----------------- | ------------ | ------------------------------------- | --------------------------------------- |
| **M0 基线**       | W0（2–3 天） | fork、baseline tag、构建/测试跑通     | `npm run check` + smoke 在 Win/Mac 通过 |
| **M1 审计完成**   | W1           | 安全/依赖/性能审计报告，问题分级      | 无未处理的 P0 安全问题                  |
| **M2 核心加固**   | W2           | 核心视图单测、e2e、ABCompareView 拆分 | 核心视图有测试；8 条 e2e 全绿           |
| **M3 团队 MVP-1** | W3           | 会话保存、CLI、导出                   | Win/Mac 双端演示通过                    |
| **M4 团队 MVP-2** | W4           | 闪烁/洋葱皮/阈值、像素信息、布局      | 团队真实素材评审通过                    |
| **M5 RC**         | W5           | CI 产物、校验和、安装/运行文档        | 干净机器可启动                          |
| **M6 v1.0-team**  | W6           | 试运行修复、正式 tag                  | 无 P0/P1 缺陷                           |

> 周期按“小团队 + AI 辅助、每周 3–5 人日”估算；如果只有 1 人兼职，整体乘以 1.5–2。

---

## 4. 阶段计划

### Phase 0 — Fork 与基线（W0，2–3 天）✅ 已完成

1. GitHub Fork 到团队组织；clone 后添加 `upstream`。
2. 跑通基线：`npm ci` → `npm run lint` → `npm run test` → `npm run build` → `npm run smoke:electron`。
3. 打基线 tag：`baseline-1.2.1`。
4. 仓库治理：保护 `main`、要求 PR + CI、添加 issue 模板、`CONTRIBUTING.md`、`SECURITY.md`、`CHANGELOG.md`。
5. 盘点团队机器：Windows / macOS（Intel/ARM）、屏幕分辨率、常用图片格式与最大尺寸，决定构建矩阵。
6. 写 `docs/AI_CONTEXT.md` / `AGENTS.md`：命令、架构图、不可破坏的约束、测试要求。

**退出条件**：双平台（至少主力平台）构建成功；基线测试结果记录在案。

### Phase 1 — 审计与加固（W1–W2）

**A. Electron 安全**

- 核验 `contextIsolation`、`sandbox`、`nodeIntegration`、`webSecurity`
- preload 只通过 `contextBridge` 暴露最小 API；不暴露裸 `ipcRenderer`
- CSP（生产环境不允许 `unsafe-eval`）；禁止 `webviewTag`
- `setWindowOpenHandler` 一律 deny；`will-navigate` 拦截外链
- 权限请求默认拒绝；`shell.openExternal` 不接受用户可控 URL
- 错误页/日志不暴露本地路径和堆栈
- 对象 URL 在删除/清空/关闭时释放；图片解码有尺寸/内存上限

**B. 依赖与构建**

- `npm audit --omit=dev`；生产依赖只有 3 个（react/react-dom/lucide-react），保持最小
- 锁定 Electron 大版本；建立月度升级节奏
- 检查 asar、sourcemap、打包文件清单；确认不把源码/调试信息打进安装包

**C. 测试**

- 先补 `ABCompareView`、`MultiCompareView` 单测（当前最大空白）
- 引入 Playwright，覆盖 8 条核心流程：
  1. 文件导入（按钮 + 拖拽）
  2. A/B 并排切换
  3. 滑块拖动与 A/B 同步
  4. 缩放/平移/旋转同步
  5. 多图 3 张 / 4 张布局
  6. 排序与撤销
  7. 删除/清空与资源释放
  8. 主题/语言切换
- 用固定 fixtures（含透明 PNG、不同尺寸、损坏文件）

**D. 性能**

- 用 20 张 4K、100 张 1MP、接近 500MiB 上限的真实素材压测
- 记录启动时间、导入时间、峰值内存、滑块拖动 FPS
- 必要时：缩略图用 `createImageBitmap`/OffscreenCanvas；避免 pointermove 触发整树重渲染；保留 `useFrameScheduler`

**E. 可维护性**

- 拆 `ABCompareView.tsx`：`useCompareTransforms`、`useSliderDrag`、`useWheelZoom` + 子组件
- 目标：单文件 < 300 行；核心逻辑有纯函数测试
- 每个视图加独立 error boundary

**退出条件**：安全清单全绿或有书面豁免；核心视图有测试；e2e 8 条通过；性能基线记录。

### Phase 2 — 团队功能（W3–W4）

按 Must/Should 实现，顺序建议：

1. **会话保存/恢复**（JSON：图片列表、布局、每图变换、主题、语言）
2. **CLI/argv**：`image-compare A.png B.png` 直接进入 A/B；macOS `open-file` 支持
3. **导出当前视图 PNG**（含滑块位置）
4. **人眼辅助比对**：闪烁（A/B 切换）、洋葱皮透明度、阈值差异高亮（仅视觉辅助，不生成报告）
5. **像素信息面板**：尺寸、格式、缩放、鼠标颜色/坐标
6. **布局增强**：自定义网格、单图锁定、A/B 独立校准的显式开关
7. **配置项**：图片数量/大小上限、默认主题、默认布局
8. **i18n 补全 + 快捷键帮助面板**

**退出条件**：团队用真实素材完整走一遍“导入 → A/B → 多图 → 保存会话 → 导出”流程，无阻塞问题。

### Phase 3 — 打包与分发（W5）

- 构建矩阵：
  - Windows x64：NSIS 安装包 + 便携 zip
  - macOS：ARM64 + x64（或 universal）；dmg + zip
  - Linux（可选）：AppImage
- CI：
  - PR：lint + unit + build（Win/Linux 为主，macOS 按需）
  - Tag：矩阵构建 + 产物上传 + `SHA256SUMS.txt`
- 签名策略（零预算）：
  - Windows：不买证书 → 文档说明 SmartScreen；内部共享附 SHA256
  - macOS：ad-hoc 签名 + Gatekeeper 首次打开说明；或让成员从源码运行
  - 不开启自动更新（避免未签名更新链风险）
- 干净机器验收：Win10/11、macOS 13+（对应架构）各一台

**退出条件**：干净机器安装/启动成功；校验和可验证；发布 runbook 可照做。

### Phase 4 — 试运行与发布（W6）

- 团队 dogfood 1–2 周，收集问题，按 P0/P1/P2 分级
- 只修 P0/P1，冻结新功能
- 发布 `v1.0-team`；打 tag、写 CHANGELOG
- 建立月度维护：依赖升级、Electron 安全公告、上游 cherry-pick 评估

---

## 5. 任务清单

> 估时单位：人日（pd），按 AI 辅助后的有效工时估算。

| ID   | 任务                                 | 优先级 | 估时 | 依赖 | 验收标准             |
| ---- | ------------------------------------ | ------ | ---- | ---- | -------------------- |
| F0-1 | Fork、clone、upstream、baseline tag  | P0     | 0.5  | —    | 远端/标签就绪        |
| F0-2 | 双平台跑通 lint/test/build/smoke     | P0     | 0.5  | F0-1 | 全绿并记录           |
| F0-3 | 仓库治理（保护分支、模板、文档骨架） | P1     | 0.5  | F0-1 | PR 必须过 CI         |
| F0-4 | 团队机器与素材盘点                   | P0     | 0.5  | —    | 构建矩阵确定         |
| A1   | Electron 安全审计与修复              | P0     | 1.5  | F0-2 | 清单全绿/有豁免      |
| A2   | 依赖审计与升级策略                   | P1     | 0.5  | F0-2 | 无高危生产依赖       |
| A3   | AB/Multi 核心视图单测                | P0     | 2.0  | F0-2 | 核心交互有覆盖       |
| A4   | Playwright e2e 8 条                  | P0     | 2.5  | A3   | CI 中稳定通过        |
| A5   | ABCompareView 拆分                   | P1     | 2.0  | A3   | 单文件 < 300 行      |
| A6   | 错误处理/本地日志/损坏文件 fixtures  | P1     | 1.0  | A3   | 坏图不崩、不泄露路径 |
| A7   | 大图性能基线                         | P1     | 1.5  | F0-2 | 数据记录并定目标     |
| A8   | 键盘/可访问性检查                    | P2     | 0.5  | —    | 核心操作全键盘可用   |
| B1   | 会话保存/恢复                        | P0     | 1.5  | A5   | 重启后完整恢复       |
| B2   | CLI/argv + macOS open-file           | P1     | 1.0  | B1   | 命令行直接进 A/B     |
| B3   | 导出当前视图 PNG                     | P1     | 1.0  | B1   | 含滑块位置           |
| B4   | 闪烁/洋葱皮/阈值高亮                 | P1     | 2.0  | A5   | 人可控、无自动报告   |
| B5   | 像素信息面板                         | P1     | 1.0  | —    | 颜色/坐标/缩放准确   |
| B6   | 布局增强 + 单图锁定                  | P1     | 1.5  | A5   | 3/4/6 图稳定         |
| B7   | AVIF/HEIC/JXL 评估                   | P2     | 1.0  | —    | 给出支持结论         |
| B8   | i18n 补全 + 快捷键帮助               | P2     | 0.5  | —    | 中英文无漏项         |
| C1   | 构建矩阵（Win/mac，Linux 可选）      | P0     | 1.5  | F0-4 | 产物可安装           |
| C2   | CI 发布流水线 + 校验和               | P0     | 1.0  | C1   | tag 触发全自动       |
| C3   | 干净机器验收                         | P0     | 1.0  | C2   | Win/Mac 各一台通过   |
| C4   | 签名/公证策略与文档                  | P1     | 0.5  | C1   | 无预算路径可执行     |
| C5   | 发布 runbook + 版本规范              | P1     | 0.5  | C2   | 照文档可发版         |
| D1   | Dogfood 与问题分级                   | P0     | 持续 | C3   | P0/P1 清单           |
| D2   | P0/P1 修复缓冲                       | P0     | 3.0  | D1   | 无阻塞缺陷           |
| D3   | v1.0-team 发布                       | P0     | 0.5  | D2   | tag + CHANGELOG      |
| D4   | 月度维护与上游同步机制               | P2     | 0.5  | D3   | runbook 落地         |

**合计约 30–35 pd**（不含 dogfood 等待时间）。

---

## 6. 审计清单

### 6.1 Electron 安全

- [ ] `contextIsolation: true`
- [ ] `sandbox: true`（确认 preload 兼容）
- [ ] `nodeIntegration: false`
- [ ] `webSecurity: true`
- [ ] preload 仅通过 `contextBridge` 暴露白名单 API
- [ ] 生产 CSP 无 `unsafe-eval`；`script-src` 最小化
- [ ] `setWindowOpenHandler` 拒绝新窗口
- [ ] `will-navigate` 阻止导航到外部 URL
- [ ] 权限请求默认拒绝
- [ ] 不使用 `webviewTag`
- [ ] `shell.openExternal` 不接受用户可控输入
- [ ] 错误界面/日志不包含本地路径、堆栈、图片内容
- [ ] 删除/清空/关闭时释放 object URL
- [ ] 图片解码有尺寸/内存保护
- [ ] asar 打包；生产包不含 sourcemap/源码
- [ ] 安装包签名状态有文档说明

### 6.2 代码与测试

- [ ] 核心视图（AB/Multi）有单测
- [ ] 8 条 e2e 在 CI 稳定通过
- [ ] TypeScript 严格模式；无新增 `any`
- [ ] 单文件目标 < 300 行（至少核心视图）
- [ ] 每个视图有 error boundary
- [ ] i18n key 无缺失
- [ ] 无未使用依赖/死代码
- [ ] lockfile 提交；构建可重复

### 6.3 性能目标（首版）

| 指标           | 目标                             |
| -------------- | -------------------------------- |
| 冷启动         | < 3s（普通开发机）               |
| 导入 20×4K     | < 10s                            |
| 20×4K 峰值内存 | < 2GB                            |
| 缩放/平移      | ≥ 50 FPS                         |
| 滑块拖动       | 无明显卡顿（> 100ms 长任务为 0） |

> 先测基线，再按实际硬件调整；不要为了指标牺牲稳定性。

### 6.4 许可与合规

- [ ] 保留上游 MIT LICENSE 与版权声明
- [ ] 新增 `THIRD_PARTY_NOTICES.md`
- [ ] `npx license-checker --summary` 扫描依赖
- [ ] 不引入 GPL/AGPL 依赖（除非确定只内部使用且接受义务）

---

## 7. 工程规范

### 分支与提交

- `main` 保护：PR + CI 必过 + 至少 1 人 review
- 分支：`feat/...`、`fix/...`、`chore/...`、`docs/...`
- 提交：Conventional Commits（`feat:`、`fix:`、`chore:`）
- PR 尽量 < 400 行；大改拆成“测试先行 + 重构 + 功能”三个 PR

### 版本与发布

- 沿用上游版本线，从 `1.3.0-team.1` 开始
- 首个团队稳定版：`1.3.0`（或 `2.0.0`，取决于是否接受破坏性变更）
- 每个 release：CHANGELOG + 产物 + `SHA256SUMS.txt`

### CI

- PR：`lint` + `test` + `build`（Windows + Linux；macOS 按需）
- Tag：Windows x64、macOS arm64/x64 矩阵构建，上传产物与校验和
- 公共仓库可用免费 Actions；私有仓库注意 macOS runner 计费倍率，尽量只在 release 时跑 macOS

### 上游同步

```bash
git fetch upstream
git log --oneline main..upstream/main
# 只 cherry-pick 安全/关键修复，不做整包合并
```

- 每季度评估一次；上游停更就把 `upstream` 归档，不再期待
- 所有上游改动必须过本地 e2e

---

## 8. 风险登记

| 风险                   | 概率 | 影响 | 缓解                                                  |
| ---------------------- | ---- | ---- | ----------------------------------------------------- |
| 上游停更/代码质量不足  | 高   | 中   | fork 自持；第一周审计；核心测试补齐                   |
| Electron 安全漏洞      | 中   | 高   | 锁大版本；月度 `npm audit`；关注 Electron 公告        |
| 大图导致内存爆炸       | 中   | 高   | 尺寸/内存上限；降采样；懒加载；压测                   |
| macOS 签名/公证无预算  | 高   | 中   | 源码运行或 ad-hoc 签名 + 文档；不做自动更新           |
| 范围蔓延               | 高   | 中   | Won't 清单；里程碑冻结；只修 P0/P1                    |
| 核心视图无测试导致回归 | 高   | 高   | W2 必须补齐；e2e 进 CI                                |
| AI 生成代码的隐蔽 bug  | 中   | 中   | 测试先行；小 PR；固定 fixtures；人工 review 安全/打包 |
| GPL 依赖污染           | 低   | 中   | license 扫描；依赖白名单                              |

---

## 9. 验收指标（Definition of Done）

一个任务算完成，必须同时满足：

- [ ] 代码通过 `npm run lint`、`npm run test`、`npm run build`
- [ ] 新增/修改逻辑有测试；核心交互有 e2e
- [ ] Windows 与 macOS 手动验证（至少主力平台 + 另一平台冒烟）
- [ ] 不引入新的安全豁免；不降低现有安全配置
- [ ] 文档/CHANGELOG 已更新
- [ ] PR 已 review，CI 全绿

版本发布算完成：

- [ ] 干净机器安装/启动成功
- [ ] 8 条 e2e + 核心单测全绿
- [ ] 无 P0/P1 缺陷
- [ ] 产物有 SHA256；发布说明完整
- [ ] 团队 dogfood 通过

---

## 10. 新工作区启动命令

```bash
# 1) 先在 GitHub 上 Fork 到团队组织，然后：
git clone https://github.com/<your-org>/image-compare.git
cd image-compare
git remote add upstream https://github.com/ZiDongLai/image-compare.git
git fetch upstream --tags
git tag baseline-1.2.1 upstream/main
git push origin baseline-1.2.1

# 2) 工具链（建议 Node 22/24 LTS）
node -v
npm ci
npm run lint
npm run test
npm run build
npm run smoke:electron   # 需要图形环境；CI 里用 xvfb（Linux）

# 3) 建立审计分支
git checkout -b chore/baseline-audit
```

建议第一批创建的文档：

```
docs/
  ROADMAP.md            # 本文件
  AUDIT.md              # 审计发现（ID/严重级别/文件/结论/状态）
  TEAM_USAGE.md         # 团队使用手册
  RELEASE.md            # 构建与发布 runbook
AGENTS.md               # 给 AI 的项目上下文与约束
CHANGELOG.md
CONTRIBUTING.md
SECURITY.md
THIRD_PARTY_NOTICES.md
```

### `AGENTS.md` 建议内容

- 常用命令（dev/build/test/lint/smoke）
- 目录结构与数据流（App → hooks → state → components）
- 不可破坏的约束：
  - 保持 `contextIsolation`/`sandbox`，不暴露裸 `ipcRenderer`
  - 所有 object URL 必须释放
  - 图片数量/大小上限必须可配置且有提示
  - 不引入自动上传、遥测、云服务
- 测试要求：改核心视图必须补单测；改交互必须补 e2e
- PR 规范：小步、测试先行、禁止顺手大重构

---

## 11. 每周节奏建议

| 时间   | 内容                                 |
| ------ | ------------------------------------ |
| 周一   | 选本周 3–5 个任务，确认验收标准      |
| 周三   | 中期检查：构建/测试是否绿，有无阻塞  |
| 周五   | Demo + 合并 + 更新 CHANGELOG/ROADMAP |
| 每两周 | 依赖审计 + 性能回归 + 风险复盘       |

---

## 12. 一句话执行策略

**先让基线可重复（M0），再把核心交互锁进测试（M2），然后只做团队真正每天用的功能（M3–M4），最后用零预算可执行的方式打包分发（M5–M6）。** 不追求功能大而全，追求“改得动、测得准、发得出、用得久”。
