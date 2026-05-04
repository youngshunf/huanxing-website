# `.ralph/` — Hermes Website Ralph 任务存档

> 参考 `hasn-node/webui/.ralph/` 与 `huanxing-hermes-runtime/.ralph/` 的约定。每个 ralph wiggum 任务独占一个子目录，PROMPT.md 落盘以便追溯。

## 目录约定

```
.ralph/
├── README.md             # 本文件
├── <CODE>/
│   ├── PROMPT.md         # 给 ralph 的提示词原文（10 节标准结构）
│   ├── NOTES.md          # ralph 自己每轮迭代结束更新的进度笔记
│   └── RETRO.md          # （可选）人类回头写的复盘
```

## `<CODE>` 命名

- `M3` — Agent UI 接通真后端 + 模板选择 + SSE chat + 用量
- 后续可能扩号：渠道绑定 polling 优化 / chat 历史持久化 / Agent 分页 / BYOK UI 等

## 待跑 wiggum

| Code | 状态 | 一句话 | 依赖 |
|---|---|---|---|
| M3 | 待 owner 审 PROMPT | website Agent UI 接通真后端 + 模板选择 + SSE chat + 用量 | M1 backend 已完成 |

## 启动方式

```bash
# 在 website 仓根目录
/ralph-loop "$(cat .ralph/M3/PROMPT.md)" --completion-promise "M3_DONE" --max-iterations 30
```

## 跑前 checklist

1. baseline 测试通过（`pnpm test --run`）
2. typecheck + lint 干净（`pnpm typecheck && pnpm lint`）
3. working tree 干净
4. **M1 已完成**（backend 提供的 4 个新 endpoint 已就位：`/templates` / `/credential/install` / chat SSE / `/template/apply`）
5. ralph 跑完后人类验收：
   - `pnpm test --run` 新增测试全过
   - `pnpm build` 成功
   - 启 backend dev server，浏览器手测创建 Agent / 跟 Agent 对话 / 看用量
   - **不轻信 commit message 里的"Tested: ..."**（详见 hermes-runtime 仓 `.ralph/A1/RETRO.md` proxy 假阳性事故；前端环境也有类似 fetch-not-implemented 假阳性）
