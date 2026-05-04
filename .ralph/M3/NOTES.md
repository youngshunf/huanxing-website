# M3 NOTES — last updated: 2026-05-04T15:03:00Z

## Iteration 1 (M3_DONE)
- 完成：
  - 5.1 在 `src/api/agent.ts` 加入 `listTemplates`、`getUsageSummary`、`sendChatCompletionStream`；新建 `AgentTemplate` / `UsageSummary` / `UsageByModel` / `UsageSummaryParams` 类型；将 `template` 字段从字符串字面量联合改为 `string`（marketplace `app_id` 语义）。SSE 通过 fetch + `body.getReader()` 按 `\n\n` 切帧解析，支持 `data: [DONE]` 终止与 AbortSignal 取消。
  - 5.2 `CreateAgentModal.tsx` 重写为模板卡片网格（3 列）+ 表单；卡片含 emoji + name + description + version；选中态 `aria-pressed`；加载/失败/重试态完备。
  - 5.3 `AgentChatPage.tsx` 切换到 `sendChatCompletionStream`，每个 chunk 增量更新最后一条 assistant 消息；流式时显示 `▋` 打字机光标；卸载/导航时 `AbortController.abort()`；网络错误显示 "连接中断" + 重试按钮。
  - 5.4 `AgentDetailPage.tsx` 概览 tab 加 `UsageSummaryCard`（总 token、总费用、按模型分布）；用 discriminated-union state 避免 react-hooks/set-state-in-effect lint 错；`key={agentId}` 自然重置。
  - 5.5 mock fallback 默认改为 off：`shouldForceMock` 仅在 `VITE_HERMES_AGENT_MOCK=true|1` 或 `localStorage.huanxing_agent_mock==='1'` 时启用；`shouldUseMock` 同步收紧到必须显式启用。
  - 5.6 vitest@3 + @testing-library/react@16 + jsdom@25 配置完毕；新增 8 个测试（agent-api 5 + CreateAgentModal 3）。
  - 5.7 typecheck/lint/test/build 全绿。
- 验收项进度：5.1 [3/3] / 5.2 [4/4] / 5.3 [5/5] / 5.4 [3/3] / 5.5 [2/2] / 5.6 [8/8] / 5.7 [4/4]
- 卡点：无
- 下轮第一件事：联调阶段 (S0)。

## 已确认决策
- SSE 用 fetch + ReadableStream（不用 EventSource）— 兼容 POST + Authorization header
- 模板选择 = 3 列卡片网格
- 用量 = 概览 tab 加卡片（不开第 6 tab）
- chat 历史不持久化
- mock fallback 默认 off，env / localStorage 显式开启

## TODO 队列（已清空）

## 文件变更（按 commit）
1. `feat(agent): add listTemplates, getUsageSummary, sendChatCompletionStream API` — `src/api/agent.ts`, `src/types/agent.ts`
2. `feat(agent): template grid in CreateAgentModal` — `src/components/agent/CreateAgentModal.tsx`
3. `feat(agent): SSE streaming in AgentChatPage` — `src/pages/dashboard/agents/AgentChatPage.tsx`
4. `feat(agent): usage summary card in AgentDetailPage overview` — `src/pages/dashboard/agents/AgentDetailPage.tsx`
5. `test(agent): vitest setup + 8 tests for new API + modal` — `src/__tests__/*`, `vitest.config.ts`, `package.json`, `package-lock.json`, fix UsageSummaryCard

## 验收命令实测
```
npm run typecheck   # tsc -b --noEmit  → 无错
npm run lint        # eslint .         → 0 error, 9 warning (无新增，全部 doc 模块旧 warning)
npx vitest run      # vitest           → 2 files / 8 tests passed
npm run build       # tsc -b && vite   → built in ~4.5s
```
