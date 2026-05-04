# Ralph Loop M3 — website Agent UI 接通真后端 + 模板选择 + SSE chat + 用量

> 你是 M3 ralph 的执行体。每次迭代你看到的都是这同一份 PROMPT.md。
> 你的工作产物（代码、`NOTES.md`、commit）会在文件系统和 git history 中持续累积。

---

## 1. 一句话目标

把 `huanxing-website` 的 Agent 管理 UI 从"骨架 + mock fallback"推到"MVP 端到端真后端可用"：

1. **`src/api/agent.ts` 加 2 个方法** — `listTemplates()` / `getUsageSummary(agentId)`；`sendChatCompletion` 改造为 SSE 流式
2. **CreateAgentModal 改造** — 模板选择从硬编码改为调 `listTemplates()` 拉真数据；UI 用卡片形式展示（emoji + name + description）
3. **AgentChatPage 改造** — 用 EventSource 或 fetch + ReadableStream 真流式接收 chunks，边到达边渲染
4. **AgentDetailPage 加用量 tab/卡片** — 调 `getUsageSummary(agentId)` 展示 LLM 计费（model_name / total_tokens / total_cost）
5. **关闭 mock fallback**（VITE_HERMES_AGENT_MOCK env 默认 true 改为 false，让 dev 默认连真后端；保留环境变量可关闭以便离线测试）
6. **测试**：补 vitest 组件/hook 单测覆盖关键路径

**不做**：渠道绑定 polling 优化、工作区文件浏览（设计文档说"第一版不做"）、BYOK 切换 UI、Agent 列表分页（假设 < 20 个）、SOP 应用 UI。

> 顺序约束：M3 是 MVP 三连环（M2/M1/M3）的第三环。**依赖 M1 已完成**（backend 仓 commit `M1_DONE` 之后），4 个 backend 改动（runtime client 4 方法 + create/delete 编排 + templates list + chat SSE）已就位。M3 完成后即进入 S0 跨仓联调。

---

## 2. 必读输入（每轮迭代前重读）

| 路径 | 用途 |
|---|---|
| `huanxing-website/HUANXING-BRAND.md` | 品牌色/语气/字体规范 |
| `huanxing-website/HUANXING-UI-SPEC.md` | UI 组件规范 |
| `huanxing-website/CLAUDE.md` | 仓库自身约定 |
| `docs/agent-management-ui-design.md`（仓内 docs/ 目录） | Agent 管理 UI 设计文档 |
| `src/api/agent.ts` | 17 个现有方法；本任务加 2 个 + 改 1 个 |
| `src/api/client.ts` | HTTP 客户端约定（auth header / base URL / 错误处理） |
| `src/pages/dashboard/agents/AgentsPage.tsx` (88 行) | 列表页范式 |
| `src/pages/dashboard/agents/AgentDetailPage.tsx` (215 行，5 tabs) | 详情页范式；本任务加用量 tab |
| `src/pages/dashboard/agents/AgentChatPage.tsx` (81 行) | 聊天页范式；本任务改 SSE |
| `src/components/agents/CreateAgentModal.tsx` | 创建向导；本任务改模板选择 UI |
| `src/components/agents/ChannelBindingPanel.tsx` | 渠道绑定（不动） |
| `src/stores/useAuthStore.ts` | auth store 范式（参考做 useAgentStore 如需要） |
| `vitest.config.ts` 或 `package.json` | 测试框架配置 |
| `.ralph/M3/NOTES.md` | 自己上一轮的进度笔记（首轮可空） |

**不要读**：marketing 页面 (`Home.tsx` / `About.tsx` / `Pricing.tsx`)、creator center、doc editor 等无关模块。

---

## 3. 入口快照（项目当前状态）

执行 M3 前的现状（baseline = website main HEAD；假设 M1 backend 已就位）：

- **技术栈**：React 18+ / Vite 5+ / TypeScript / Tailwind 4 / react-router-dom / zustand
- `src/api/agent.ts` 已有方法（17 个）：listAgents / createAgent / getAgent / updateAgent / deleteAgent / getSoul / saveSoul / getUserProfile / saveUserProfile / listChannels / startChannelQr / getChannelQrStatus / manualBindChannel / testChannel / unbindChannel / getGatewayStatus / operateGateway / getWorkspaceStatus / sendChatCompletion
- **缺**：`listTemplates` / `getUsageSummary` / SSE chat
- 所有 API 都有 mock fallback 受 `VITE_HERMES_AGENT_MOCK` 控制 + localStorage 数据持久化
- `CreateAgentModal.tsx` 模板选项**硬编码 4 个**（assistant/office/creator/custom），实际后端有 7 个 marketplace agent_template
- `AgentChatPage.tsx` 调 `sendChatCompletion` 一次返回（非 SSE）；MVP 必须改流式
- `AgentDetailPage.tsx` 5 tabs（概览/设定/IM渠道/工作区/运行状态），**没有用量 tab**
- 路由保护：dashboard 走 `<ProtectedRoute>`，已配 LoginModal 触发
- 测试现状：未知（ralph 跑 `pnpm test` 或 `npm test` 看现有 baseline）

---

## 4. owner 拍板的前置决策（不要再改）

1. **SSE chat 实现选择 = `fetch + ReadableStream`**（不用 EventSource）。理由：
   - EventSource 不支持 POST + 自定义 header（auth Bearer 需要塞 header）
   - `fetch + reader.read()` 兼容 POST + Authorization 头 + 流式
   - 实现要点：`response.body.getReader()` + 按 `\n\n` 切分 SSE 帧 + JSON.parse data
2. **模板选择 UI = 卡片网格**（不用 select 下拉）。理由：模板有 emoji + 描述，卡片展示更直观。CreateAgentModal 第一步改成"选模板"网格（3 列），第二步"填基本信息"（agent_name/timezone）。
3. **关闭 mock 默认值**：`VITE_HERMES_AGENT_MOCK` 默认 false（之前默认 true 用于 P0）；保留 env 可手动开。`.env.development` 不动 mock 配置（owner 部署时自己控制）。
4. **用量 tab 位置**：`AgentDetailPage` 现有 5 tabs 后面加第 6 tab "用量"。或者在 "概览" tab 加一个用量卡片。**选 2 加卡片**：避免 tabs 过多，用量在概览里更易看。
5. **删除 Agent 二次确认**：保留现有 `confirm` 系统弹窗，不引入新 modal 组件。
6. **chat 历史 = useState + 退出丢失**：MVP 不做 chat 历史持久化（无后端 API 支持）；用户切走 Agent 再回来 = 新对话。

---

## 5. 必须落地的产物清单（acceptance criteria）

### 5.1 `src/api/agent.ts` 扩展

- [ ] `export interface AgentTemplate { app_id: string; name: string; description: string; emoji?: string; icon_url?: string; version: string }`
- [ ] `export async function listTemplates(): Promise<AgentTemplate[]>`
  - GET `/hermes/app/templates`
  - 响应 schema：`[{app_id, name, description, emoji, icon_url, version}]`（M1 §5.4 已剔除 package_url/file_hash）
  - mock fallback：返回硬编码 7 个（assistant/finance/health/media-creator/office/side-hustle/custom，emoji 与 hub 模板对齐）
- [ ] `export async function getUsageSummary(agentId: string, params?: { startTime?: string; endTime?: string }): Promise<UsageSummary>`
  - GET `/llm/app/usage/summary?agent_id=<id>`（B3-2 已实现）
  - 响应 `{ agent_id, total_tokens, total_cost, by_model: [{model_name, request_count, total_tokens, total_cost}] }`
  - mock fallback：合成数据
- [ ] `export async function sendChatCompletionStream(agentId: string, messages: ChatMessage[], onChunk: (delta: string) => void, signal?: AbortSignal): Promise<void>`
  - POST `/hermes/app/agents/{id}/chat/completions` body 含 `stream: true`
  - 解析 SSE：`fetch(...).body.getReader()` → 按 `\n\n` 切帧 → 每帧 `data: {json}` 提取 delta → 调 `onChunk(delta)`
  - SSE 结束帧 `data: [DONE]` 退出循环
  - 异常（含 signal abort）抛出
  - **保留** `sendChatCompletion`（非流式）作 fallback；新方法名独立

### 5.2 `CreateAgentModal.tsx` 模板选择改造

- [ ] step 1 "选模板"：网格 3 列卡片，每卡片含 emoji + name + description，点选高亮边框
- [ ] step 2 "基本信息"：保留现有 agent_name + timezone + soul_content + user_content
- [ ] 创建按钮 disabled 当 step 1 未选 + step 2 必填字段空
- [ ] 提交时 payload 含 `template: <selected_app_id>`（用 marketplace app_id 作为 template 字段值，与 hermes_agent.template 字段语义一致）
- [ ] 加载状态：listTemplates() 加载时显示 skeleton；失败显示 "模板加载失败" + 重试按钮

### 5.3 `AgentChatPage.tsx` SSE 改造

- [ ] 调用切到 `sendChatCompletionStream`，每收到 chunk 增量更新最后一条 assistant 消息内容
- [ ] 流式期间显示打字机光标 `▋`（HUANXING-BRAND.md 主品牌色）
- [ ] 用户中途切换页面/卸载组件 → AbortController.abort() 取消请求
- [ ] 错误处理：网络断开显示 "连接中断，点击重试"
- [ ] 保持 auto-scroll 到底部行为

### 5.4 `AgentDetailPage.tsx` 概览 tab 加用量卡片

- [ ] 新组件 `<UsageSummaryCard agentId={...} />`：调 `getUsageSummary` 拉数据
- [ ] 卡片内容：总 token 数（k 单位） + 总费用（人民币 ¥） + 按模型分布（bar 或 list）
- [ ] mount 时拉一次；不做轮询（用户刷新即可）
- [ ] 失败显示 "用量数据加载失败"，不阻塞其他卡片

### 5.5 mock fallback 默认改

- [ ] `src/api/agent.ts` 顶部 `const USE_MOCK = ...` 默认值从 true 改为 false
- [ ] env 控制：`import.meta.env.VITE_HERMES_AGENT_MOCK === 'true'` 才启用
- [ ] `.env.development` / `.env.production` **不动**（owner 部署时自己控制）

### 5.6 测试

新增 `src/__tests__/agent-api.test.ts`（vitest）覆盖：

- [ ] **listTemplates response shape** ：mock fetch 返回 `[{app_id:'assistant',...}]`，断言 await 结果含 7 个字段映射
- [ ] **getUsageSummary by_model**：mock 返回包含 by_model 数组的 payload，断言聚合字段对
- [ ] **sendChatCompletionStream parses SSE frames**：mock fetch 返回 `ReadableStream` 推 3 个 SSE 帧，断言 onChunk 被调 3 次 + 内容拼接对
- [ ] **sendChatCompletionStream handles [DONE]**：第 4 帧 `data: [DONE]`，断言读取循环退出
- [ ] **sendChatCompletionStream abort signal**：触发 abort，断言 Promise reject 且 onChunk 不再被调

新增 `src/__tests__/CreateAgentModal.test.tsx`（vitest + RTL）：

- [ ] **template grid renders 7 cards**：mock listTemplates 返回 7 项，断言 7 个 card 渲染
- [ ] **template selection persists across step**：选第 3 个模板 → 进入 step 2 → 回到 step 1，断言第 3 个仍 highlighted
- [ ] **submit payload contains selected template**：选 'finance' + 填 agent_name → 点提交，断言 createAgent 被调含 `template: 'finance'`

### 5.7 验收命令

```bash
cd huanxing-website
pnpm install              # 或 npm install，按现有 lockfile
pnpm typecheck            # tsc --noEmit 无错
pnpm lint                 # eslint 0 error
pnpm test --run           # vitest，新增测试全过
pnpm build                # tsc -b && vite build 成功
git status                # working tree 干净
```

---

## 6. Hard rules（违反等同验收失败）

1. **不引入新依赖**——已有 react / react-router-dom / tailwind / @tanstack/react-query (如有) / zustand 等够用。SSE 用 stdlib `fetch`，不加 sse-eventsource 之类。
2. **不动 marketing 页面 / creator center / doc editor 等无关模块**——只动 `src/api/agent.ts` + `src/pages/dashboard/agents/` + `src/components/agents/` + `src/__tests__/`
3. **不实现** 渠道绑定优化 / 工作区文件浏览 / Agent 分页 / BYOK / chat 历史持久化（owner 决策）
4. **TypeScript strict + tsc --noEmit 必须通过**——Agent / Template / UsageSummary 等类型严格定义
5. **HUANXING-BRAND.md 视觉规范必须遵守**——卡片高亮用主品牌色、字体用规范定义；不擅自加新色
6. **chat 流式不准 buffer 全部内容再渲染**——必须 onChunk 即时更新 state；用户能看到打字机效果
7. **每个原子改动一个 commit**：`feat(agent): add listTemplates and getUsageSummary api` / `refactor(agent): change sendChatCompletion to SSE stream` / `feat(agent): template grid in CreateAgentModal` / `feat(agent): SSE streaming in AgentChatPage` / `feat(agent): usage summary card in AgentDetailPage` / `chore(agent): default mock fallback off` / `test(agent): vitest coverage for new api + components`
8. **不调 `--no-verify` / `--force`、不动 git 远程**
9. **mock fallback 关闭后 dev 默认连 `localhost:8000`（或 backend dev port）**——确保 owner 启动 backend 进程后 dev server 能联通

---

## 7. 失败降级策略

- 若 `vite.config` 没配 backend proxy（dev `localhost:8000` 转发），加一个 proxy 规则：`{ '/api': 'http://127.0.0.1:8000' }`；NOTES 记
- 若现有 `client.ts` 不支持流式 fetch（封装太死），**直接**用 stdlib `fetch` 在 `sendChatCompletionStream` 里发请求，不强行套现有 client；NOTES 记
- 若 `vitest` 还未配置（package.json 无 test script），加 vitest 依赖 + 最小 vitest.config.ts；NOTES 详记
- 若 `CreateAgentModal` 现有结构是单 step，整体改成 2 step 工作量大 → 简化为"卡片选择放在表单顶部，下面跟着填字段"，不做 wizard 步骤切换；NOTES 记
- 若 backend `/templates` endpoint 还没真上线（M1 未跑），mock fallback 数据保证 UI 仍能跑通；ralph 跑测试通过即可

---

## 8. NOTES.md 维护

`.ralph/M3/NOTES.md` 同前轮结构：

```
# M3 NOTES — last updated: <UTC ISO8601>

## Iteration <N>
- 完成：<本轮做了什么>
- 验收项进度：5.1 [x/3] / 5.2 [x/?] / 5.3 [x/?] / 5.4 [x/?] / 5.5 [x/?] / 5.6 [x/8] / 5.7 [x/6]
- 卡点：<本轮没解决的具体错误信息>
- 下轮第一件事：<具体到文件 + 函数>

## 已确认决策
- ...

## TODO 队列
1. ...
```

---

## 9. 完成判定

§5.1 / §5.2 / §5.3 / §5.4 / §5.5 / §5.6 / §5.7 全部 √，git working tree 干净，输出：

```
<promise>M3_DONE</promise>
```

不满足任意一项不准 emit promise。pnpm typecheck / pnpm lint / pnpm test / pnpm build 任一不过即不通过。

---

## 10. 单轮迭代 SOP

每轮固定流程：

1. `git status` —— 起点干净
2. 读 `.ralph/M3/NOTES.md`
3. 读必读输入变化部分
4. 跑 `pnpm typecheck && pnpm lint && pnpm test --run` —— 看哪些验收项在炸
5. 选**一项** §5.x checklist 推进
6. 改文件 + 跑对应测试
7. `git add ... && git commit`（conventional commit）
8. 更新 NOTES.md
9. 检查 §9 → 满足则 emit `<promise>M3_DONE</promise>`，否则静默结束本轮
