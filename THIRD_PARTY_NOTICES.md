# THIRD_PARTY_NOTICES

本项目使用以下第三方软件。版本以 `package.json` / `package-lock.json` 为准。

## 随应用分发的运行时依赖

| 包                      | 许可证 | 用途                                                              |
| ----------------------- | ------ | ----------------------------------------------------------------- |
| Electron 44             | MIT    | 桌面运行时（内含 Chromium/Node 各自的许可证，见 Electron 发行包） |
| React 19 / React DOM 19 | MIT    | UI                                                                |
| lucide-react            | ISC    | 图标                                                              |
| clsx                    | MIT    | className 组合                                                    |
| tailwind-merge          | MIT    | className 冲突合并                                                |

## 构建/测试工具（不随应用分发）

| 包                                             | 许可证     |
| ---------------------------------------------- | ---------- |
| Vite                                           | MIT        |
| Vitest                                         | MIT        |
| @vitest/coverage-v8                            | MIT        |
| Playwright / @playwright/test                  | Apache-2.0 |
| electron-builder                               | MIT        |
| sharp                                          | Apache-2.0 |
| oxlint                                         | MIT        |
| Prettier                                       | MIT        |
| jsdom                                          | MIT        |
| @testing-library/react / user-event / jest-dom | MIT        |
| Tailwind CSS / @tailwindcss/vite               | MIT        |
| TypeScript                                     | Apache-2.0 |
| png-to-ico                                     | MIT        |

## 说明

- 以上为直接依赖概览；完整传递依赖清单可通过 `npx license-checker --summary` 生成。
- 对外分发安装包前，应生成并随附完整许可证文本；当前私有开发阶段仅保留本清单。
- 上游 `LICENSE` 与 `NOTICE.md` 必须随任何包含上游代码的副本一同提供。
