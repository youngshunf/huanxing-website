# CLAUDE.md

> 本文件只保存官网专属实现规则；共享品牌、注释、验证与 Git 规则继承父仓 [`../CLAUDE.md`](../CLAUDE.md)。产品与视觉事实源为 `HUANXING-BRAND.md`、`HUANXING-VISION.md`、`HUANXING-UI-SPEC.md` 及现有源码；发生冲突时，以父仓当前规则和代码 token 为准。

## 视觉与体验

- 用户界面使用“唤星”，英文品牌使用 “Astra”；不要继续产出 “HuanXing” 拼音品牌名。
- 默认 Light；品牌动作色为 `#2563EB`，hover/按下为 `#1D4ED8`。`#FFD93D` 只用于评分、高亮或进度点缀。
- 品牌门面禁止蓝紫/青色渐变；需要层次时只使用皇家蓝同色深浅。存量 `star-purple`/`star-blue` 是兼容类名，不代表恢复旧配色。
- 页面内容、价格、CTA 与栏目结构以当前产品文档和源码为准，禁止把本文件当成固定营销文案清单。
- 动效应服务于层级和反馈，保持自然、可降级并尊重 reduced-motion；避免持续高负载粒子、过度发光和无目的装饰。
- 使用响应式与语义化 HTML；图片懒加载，动画优先 `transform/opacity`，关键流程覆盖移动端和桌面端。
- 字体栈：`Inter, PingFang SC, Microsoft YaHei, Noto Sans SC, system-ui, sans-serif`。

## 实现与 Git

- 新增或修改的 React/TS 注释、JSDoc/TSDoc、TODO/FIXME 一律中文；标识符和技术术语可保留英文。
- 构建门槛为 `npm run build`；涉及交互时补相应类型、Lint 与 E2E 验证。
- 本仓是独立原生仓，主分支为 `main`。主 clone 始终停在 `main`；小修复/文档可直接完成，新分支必须使用 worktree。
- 禁止从 worktree push。完成后回主 clone，fetch/整合 `origin/main`、合并分支，再由主 clone push；禁止 force-push，只提交本任务文件。
