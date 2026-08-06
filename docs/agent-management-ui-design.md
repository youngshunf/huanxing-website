# Agent 管理 Web UI 设计

## 1. 目标

在 `hasn-website` 登录后的控制台中新增 Agent 管理能力，让用户可以在网页端完成：

1. 创建一个或多个托管 Agent；
2. 查看和管理 Agent 状态；
3. 编辑 Agent 的基础设定、`SOUL.md` 和 `USER.md`；
4. 绑定飞书、微信、企业微信等 IM 渠道；
5. 查看 gateway、workspace、执行沙箱、channel 绑定状态；
6. 从 Agent 管理页进入 Web Chat。

Web UI 只接入 `hasn-cloud-backend` 的业务 API，不直接访问 `huanxing-hermes-runtime`。`cloud-backend` 负责鉴权、业务权限和调用 runtime。

---

## 2. 当前前端落点

当前 `hasn-website` 是 React + Vite + Tailwind 项目，登录后页面统一放在 `/dashboard` 下：

- 路由入口：`src/App.tsx`
- Dashboard 布局：`src/pages/dashboard/DashboardLayout.tsx`
- API client：`src/api/client.ts`
- 现有样式 token：`src/index.css`

Agent 管理应直接接入现有 Dashboard，不新建独立后台，不做营销式落地页。

新增路由：

```text
/dashboard/agents                 Agent 列表与创建入口
/dashboard/agents/:agentId         Agent 详情管理
/dashboard/agents/:agentId/chat    Agent Web Chat
```

侧边栏新增一级入口：

```text
AI Agent
```

建议使用 lucide icon：

- `Bot`：Agent 管理；
- `MessageCircle`：Web Chat；
- `Plug`：渠道绑定；
- `Settings`：Agent 设置；
- `Activity`：运行状态；
- `Folder`：工作区状态。

---

## 3. 信息架构

```text
Dashboard
  ├── 概览
  ├── AI Agent
  │   ├── Agent 列表
  │   ├── 创建 Agent
  │   ├── Agent 详情
  │   │   ├── 概览
  │   │   ├── 设定
  │   │   ├── IM 渠道
  │   │   ├── 工作区
  │   │   └── 运行状态
  │   └── Web Chat
  ├── 我的文档
  ├── 订阅管理
  ├── 积分详情
  └── API Keys
```

第一版只需要实现：

1. `/dashboard/agents`；
2. `/dashboard/agents/:agentId`；
3. Agent 创建 modal；
4. IM 渠道绑定区；
5. Web Chat 入口按钮，页面可在下一阶段补。

---

## 4. Agent 列表页

### 4.1 页面结构

```text
┌──────────────────────────────────────────────────────────┐
│ AI Agent                                      + 创建 Agent │
│ 创建和管理你的云端托管 Agent，绑定 IM 后可 7x24 在线。       │
├──────────────────────────────────────────────────────────┤
│ 状态概览: 全部 3 | 在线 2 | 待配置 1 | 异常 0              │
├──────────────────────────────────────────────────────────┤
│ [Agent Card] 福仔                                        │
│ 在线 · 飞书已绑定 · 微信待绑定 · 最近活跃 5 分钟前            │
│ 模型 Claude Sonnet · Workspace 可用 · 执行沙箱正常          │
│ [进入对话] [管理] [绑定渠道]                               │
├──────────────────────────────────────────────────────────┤
│ [Agent Card] 工作助理                                     │
│ 待配置 · 未绑定渠道 · Gateway 未启动                         │
│ [继续配置] [管理]                                        │
└──────────────────────────────────────────────────────────┘
```

### 4.2 卡片字段

每个 Agent card 展示：

| 字段 | 来源 | 展示 |
|---|---|---|
| Agent 名称 | `agent_name` | 主标题 |
| 状态 | `status` + `gateway.status` | 在线、待配置、离线、异常 |
| 绑定渠道 | `channels[]` | 飞书/微信/企业微信/Webhook 状态 badge |
| 最近活跃 | `last_active_at` | 相对时间 |
| 模型 | `llm.model` | 小字 |
| Workspace | `workspace.status` | 可用、运行中、异常 |
| 操作 | 前端路由/API | 进入对话、管理、绑定渠道 |

### 4.3 空状态

用户还没有 Agent 时展示：

```text
还没有 Agent
创建你的第一个云端 Agent，绑定飞书或微信后，它可以在你常用的 IM 中持续在线。
[创建 Agent]
```

不要做大面积 hero。空状态保持在 Dashboard 内容区内，使用图标 + 简短说明 + 主按钮。

---

## 5. 创建 Agent 流程

创建使用 modal 或右侧 drawer，第一版推荐 modal，避免引入复杂路由。

### Step 1：基础信息

字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `agent_name` | 是 | 展示名，例如“福仔”“工作助理” |
| `template` | 否 | `personal-assistant`、`work-assistant`、`creator-assistant` |
| `timezone` | 是 | 默认 `Asia/Shanghai` |

用户不可见或不需要填写：

- LLM API Key：默认由 cloud-backend 下发平台 endpoint；
- 执行沙箱配置：runtime 默认写入；
- profile name：runtime 生成。

### Step 2：Agent 设定

字段：

| 字段 | 写入位置 | 说明 |
|---|---|---|
| 角色描述 | `SOUL.md` | Agent 是谁、主要帮用户做什么 |
| 用户偏好 | `memories/USER.md` | 用户希望 Agent 记住的基本信息 |

初始文案建议：

```text
它应该如何称呼你？
你希望它主要帮你做什么？
它说话应该更简洁、温和，还是更像工作助理？
```

这一步可跳过。跳过时 runtime 写默认模板，用户可在详情页继续编辑。

### Step 3：创建完成

创建成功后展示：

```text
Agent 已创建
你可以先在网页中对话，也可以绑定飞书、微信或企业微信。
[进入管理] [绑定 IM 渠道]
```

如果创建后 gateway 启动失败，Agent 仍进入详情页，并在运行状态区显示错误，不让用户卡在 modal。

---

## 6. Agent 详情页

详情页使用顶部标题 + tabs，不使用多层嵌套卡片。

```text
福仔                         在线       [进入对话] [重启 Gateway]
个人助理 · Claude Sonnet · Workspace 可用

[概览] [设定] [IM 渠道] [工作区] [运行状态]
```

### 6.1 概览

展示四个摘要块：

1. Gateway：运行中、离线、异常；
2. IM 渠道：已绑定数量；
3. Workspace：挂载状态、最近执行时间；
4. 最近消息：最近活跃时间。

下方展示最近事件列表：

```text
11:20 飞书绑定成功
11:18 Gateway 已重启
11:17 Workspace 挂载就绪
```

### 6.2 设定

分两块：

1. 基础信息：名称、模板、时区；
2. Persona：`SOUL.md` 和 `USER.md` 编辑器。

第一版编辑器可以用普通 textarea，不需要引入 Tiptap/Vditor。保存时分别调用：

```http
PUT /agents/{agent_id}/soul
PUT /agents/{agent_id}/user-profile
```

保存后提示“已保存，下一轮对话生效”。如果需要立即生效，由 backend 决定是否重启 gateway。

### 6.3 IM 渠道

IM 渠道页是第一版重点。

渠道卡片：

```text
飞书
适合团队通知、群聊 @、个人 DM
状态：未绑定
[扫码绑定] [手动配置]

微信
适合个人私聊
状态：待扫码
[查看二维码] [取消]

企业微信
适合企业内部机器人
状态：已绑定
[测试] [解绑]
```

状态模型沿用 runtime bind session：

```text
created
qr_ready
waiting_scan
scanned
confirmed
writing_config
restarting_gateway
testing_connection
bound
expired
failed
cancelled
```

前端展示分组：

| 后端状态 | 前端文案 | UI |
|---|---|---|
| `bound` | 已绑定 | 绿色 badge，显示测试/解绑 |
| `waiting_scan` | 等待扫码 | QR + 倒计时 |
| `writing_config` | 写入配置 | loading |
| `restarting_gateway` | 正在重启 | loading |
| `expired` | 二维码已过期 | 重新生成按钮 |
| `failed` | 绑定失败 | 错误提示 + 重试 |
| `cancelled` | 已取消 | 回到未绑定 |

QR 绑定流程：

```text
用户点击扫码绑定
  ↓
POST /agents/{agent_id}/channels/{channel}/qr/start
  ↓
显示二维码、过期倒计时
  ↓
每 2 秒 poll status
  ↓
confirmed -> writing_config -> restarting_gateway -> bound
  ↓
刷新渠道列表和 Agent 状态
```

手动配置流程：

```text
用户点击手动配置
  ↓
输入 AppID / Secret / token 等字段
  ↓
POST /agents/{agent_id}/channels/{channel}/manual
  ↓
后端写入 profile 并重启 gateway
  ↓
返回 bound 或 failed
```

Secret 输入要求：

- 密码框；
- 不回显旧值；
- 保存后只展示“已配置”；
- 错误信息不包含 secret 明文。

### 6.4 工作区

展示：

- host workspace 路径的脱敏展示，例如 `/workspaces/hx-u7f3a9-dev`；
- 容器内工作目录：`/workspace`；
- 挂载状态：可用、运行中、异常；
- 最近执行时间；
- 当前是否有 active run。

操作：

```http
GET  /agents/{agent_id}/workspace/status
```

第一版不做文件浏览器。文件浏览可后续接入文档/文件管理系统。

### 6.5 运行状态

展示：

- gateway status；
- API Server status；
- Docker 执行沙箱配置状态；
- 工具网络隔离状态；
- 最近错误；
- 日志 tail；
- 操作：启动、停止、重启。

操作需要二次确认：

- 停止 gateway；
- 删除 Agent；
- 解绑渠道。

重启 gateway 不需要二次确认，但按钮必须显示 loading，并避免重复点击。

---

## 7. 前端 API Facade

新增文件：

```text
src/api/agent.ts
src/types/agent.ts
```

前端只调用 cloud-backend：

```text
VITE_API_BASE_URL=/api/v1
```

cloud-backend 暴露给 website 的正式 API 以前缀 `/api/v1/hermes/app/agents` 为准。下列表格省略了 `VITE_API_BASE_URL=/api/v1` 的前缀时，实际请求仍应使用 `/hermes/app/agents`。

```http
GET    /hermes/app/agents
POST   /hermes/app/agents
GET    /hermes/app/agents/{agent_id}
PATCH  /hermes/app/agents/{agent_id}
DELETE /hermes/app/agents/{agent_id}

PUT    /hermes/app/agents/{agent_id}/soul
GET    /hermes/app/agents/{agent_id}/soul
PUT    /hermes/app/agents/{agent_id}/user-profile
GET    /hermes/app/agents/{agent_id}/user-profile

GET    /hermes/app/agents/{agent_id}/channels
POST   /hermes/app/agents/{agent_id}/channels/{channel}/qr/start
GET    /hermes/app/agents/{agent_id}/channels/{channel}/qr/{session_id}/status
POST   /hermes/app/agents/{agent_id}/channels/{channel}/manual
POST   /hermes/app/agents/{agent_id}/channels/{channel}/test
POST   /hermes/app/agents/{agent_id}/channels/{channel}/unbind

GET    /hermes/app/agents/{agent_id}/gateway/status
POST   /hermes/app/agents/{agent_id}/gateway/start
POST   /hermes/app/agents/{agent_id}/gateway/restart
POST   /hermes/app/agents/{agent_id}/gateway/stop

GET    /hermes/app/agents/{agent_id}/workspace/status
```

这些接口由 cloud-backend 鉴权后转发或编排 `huanxing-hermes-runtime`，不要让浏览器直接访问 runtime 内网地址。

---

## 8. TypeScript 类型草案

```ts
export type AgentStatus = 'created' | 'ready' | 'running' | 'stopped' | 'error' | 'deleted'
export type GatewayStatus = 'stopped' | 'starting' | 'running' | 'unhealthy' | 'stopping' | 'error'
export type ChannelType = 'feishu' | 'weixin' | 'qq'
export type ReservedChannelType = 'wecom' | 'webhook'
export type ChannelStatus =
  | 'unbound'
  | 'created'
  | 'qr_ready'
  | 'waiting_scan'
  | 'scanned'
  | 'confirmed'
  | 'writing_config'
  | 'restarting_gateway'
  | 'testing_connection'
  | 'bound'
  | 'expired'
  | 'failed'
  | 'cancelled'

export interface AgentItem {
  agent_id: string
  agent_name: string
  profile_name: string
  status: AgentStatus
  gateway_status: GatewayStatus
  terminal_backend: 'docker'
  container_workspace: string
  llm_model: string
  channel_summary: ChannelBindingSummary[]
  workspace_status: 'ready' | 'active' | 'error'
  last_active_at?: string
  created_at: string
  updated_at: string
}

export interface ChannelBindingSummary {
  channel: ChannelType
  status: ChannelStatus
  display_name?: string
  last_error?: string
  updated_at?: string
}
```

---

## 9. 组件拆分

建议新增：

```text
src/pages/dashboard/agents/AgentsPage.tsx
src/pages/dashboard/agents/AgentDetailPage.tsx
src/pages/dashboard/agents/AgentChatPage.tsx

src/components/agent/AgentCard.tsx
src/components/agent/CreateAgentModal.tsx
src/components/agent/AgentStatusBadge.tsx
src/components/agent/ChannelBindingPanel.tsx
src/components/agent/ChannelCard.tsx
src/components/agent/ChannelQrDialog.tsx
src/components/agent/ManualChannelForm.tsx
src/components/agent/WorkspacePanel.tsx
src/components/agent/GatewayStatusPanel.tsx
```

第一版可不引入全局 store，页面内 `useState/useEffect` + `src/api/agent.ts` 足够。等 Web Chat 和跨页面刷新需求明确后，再补 `useAgentStore`。

---

## 10. 视觉规范

沿用现有 Dashboard 风格：

- 背景：`bg-space-black`；
- 面板：`bg-space-panel`；
- 边框：`border-divider`；
- 主按钮：`bg-star-purple` 或星紫到星蓝渐变；
- 状态色：成功、警告、错误使用现有语义色；
- 卡片圆角控制在 `rounded-lg` 或 `rounded-xl`，不要使用过度圆角；
- 管理页以信息密度和可扫读为主，不做营销 hero；
- 不使用装饰性渐变球、背景光斑或大面积插画；
- 操作按钮优先使用 lucide icon + 文案，例如 `Plus 创建 Agent`、`Plug 绑定渠道`、`MessageCircle 进入对话`。

移动端：

- Agent 列表从两列/三列降为单列；
- tabs 横向滚动；
- 渠道绑定 QR dialog 居中展示；
- 表格信息改为卡片字段，不强行横向滚动。

---

## 11. 安全与权限

1. 页面必须在 `ProtectedRoute` 后。
2. 前端不保存、不展示：
   - Docker socket / 宿主机真实挂载细节
   - `API_SERVER_KEY`
   - channel secret 明文
   - LLM API Key 明文
3. 所有 agent API 都由 cloud-backend 根据登录用户过滤。
4. 删除 Agent、解绑渠道、停止 gateway 需要确认。
5. QR bind session 过期后立即停止 polling。
6. 页面错误提示只展示可行动信息，不显示内部路径、端口、secret。

---

## 12. 开发顺序

1. 新增 `src/types/agent.ts` 和 `src/api/agent.ts`；
2. 在 `DashboardLayout.tsx` 侧边栏加入 `AI Agent`；
3. 在 `App.tsx` 增加 `/dashboard/agents` 和 `/dashboard/agents/:agentId`；
4. 实现 `AgentsPage` 列表、loading、empty、error；
5. 实现 `CreateAgentModal`；
6. 实现 `AgentDetailPage` 的概览、设定、IM 渠道 tabs；
7. 实现 QR 绑定流程与 polling；
8. 实现手动绑定、测试、解绑；
9. 接入 workspace status；
10. 接入 gateway status/start/restart/stop；
11. 跑 `npm run build` 和基础手测。

---

## 13. 第一版验收标准

1. 登录用户能在侧边栏看到 `AI Agent`。
2. 没有 Agent 时能看到空状态并创建 Agent。
3. 一个用户可以创建多个 Agent。
4. Agent 列表能展示每个 Agent 的 gateway、渠道、workspace 状态。
5. Agent 详情页能编辑 `SOUL.md` 和 `USER.md`。
6. 飞书、微信、企业微信至少有统一渠道卡片和绑定状态展示。
7. QR 渠道能发起绑定、展示二维码、轮询状态、处理过期和失败。
8. 绑定成功后渠道状态变为 `已绑定`，并能测试和解绑。
9. 删除 Agent、解绑渠道、停止 gateway 有确认。
10. 页面在桌面和移动端都不出现文字溢出、按钮挤压或内容重叠。
