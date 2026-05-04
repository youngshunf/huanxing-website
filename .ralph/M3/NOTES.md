# M3 NOTES — last updated: 2026-05-04 (placeholder)

> 首轮起点占位。ralph 第 1 轮迭代开始时把本文件覆盖为真实进度笔记。

## Iteration 0 (placeholder)
- 完成：—（owner 起草 PROMPT.md，等待 ralph 启动）
- 验收项进度：5.1 [0/3] / 5.2 [0/?] / 5.3 [0/?] / 5.4 [0/?] / 5.5 [0/?] / 5.6 [0/8] / 5.7 [0/6]
- 卡点：无
- 下轮第一件事：跑 `pnpm typecheck && pnpm test --run` 拿到 baseline；再读 `src/api/agent.ts` 现有 17 个方法，加 `listTemplates` / `getUsageSummary` / `sendChatCompletionStream`

## 已确认决策
- 决策 1/2/3/4/5/6（owner 拍板，详见 PROMPT.md §4）
- SSE 用 fetch + ReadableStream（不用 EventSource）
- 模板选择 = 3 列卡片网格
- 用量 = 概览 tab 加卡片（不开第 6 tab）
- chat 历史不持久化

## TODO 队列（按优先级）
1. `agent.ts` 加 listTemplates + getUsageSummary + sendChatCompletionStream
2. `CreateAgentModal.tsx` 改卡片网格选模板 + 调真 listTemplates
3. `AgentChatPage.tsx` 改 SSE 流式
4. `AgentDetailPage.tsx` 加 UsageSummaryCard
5. mock fallback 默认改 false
6. vitest 配置（如缺）+ 写 8 个测试
7. typecheck + lint + test + build 全绿
