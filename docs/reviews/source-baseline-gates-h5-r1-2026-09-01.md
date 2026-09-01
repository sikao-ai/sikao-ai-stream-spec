---
schema: 1
doc_class: review
type: review
status: active
owner: codex-reviewer-source-baseline
created: 2026-09-01
last_reviewed: 2026-09-01
title: source-baseline-gates-h5-r1
reviewed_commit: c011fbfaa92d1c64f72bd42672d1d1dc4bb8ce18
reviewed_parent: 245b47937075d57a3892f08a6808424add44cf97
verdict: PASS
independent_subagent_review: true
author_neq_reviewer: true
round: 1
tags:
  - review/h5
  - app-builder
  - baseline
---

# H5 Review R1 — App Builder 基线门禁修复

```text
Mode: Reviewer
Independent subagent review: true
author ≠ reviewer: true
verdict: PASS
```

## Verdict

`PASS`

被审 SHA 完整修复已授权的 11 项 lint error 与 16 项 test failure。没有发现 Critical、Important 或 Nit finding。

修复没有放松 lint、测试断言或错误语义，也没有改变 SIK-1067 的无特性开关基础设施单路径契约。

## Review Scope

- Repository: `sikao-ai/sikao-ai-stream-spec`
- Commit: `c011fbfaa92d1c64f72bd42672d1d1dc4bb8ce18`
- Parent: `245b47937075d57a3892f08a6808424add44cf97`
- Diff: 10 files，`+92/-15`
- 审查种类 / 时点：风险类基线修复 / 实现与收口
- 用户授权来源：当前线程 lhr 明确授权“用独立提交修复这 11/16 项基线”
- 前置问题源：`docs/reviews/sik-1067-wave0-prototype-h5-r1-2026-09-01.md:77-86,115-119`
- 不在范围：脏工作区、前后其它 SHA、部署与 push

审查者理解的目标是：真实清除既有门禁失败，同时保持 Approval、Recommendation、Prompt Bar、认证、连接器错误路径、PWA 注入和 SIK-1067 发布语义不变；不得通过禁用规则、跳过测试或削弱断言取得全绿。

## Standards

| Gate / 不变量 | 独立核验 | 结果 |
|---|---|---|
| H5 单 SHA | 独立读取该 SHA、父 SHA、源仓 `AGENTS.md`、相关实现及测试；未审并发脏工作区 | PASS |
| H7 错误语义 | `src/lib/app-data/client.server.ts:194-218` 只为空 catch 补充明确意图；解析失败仍按完整 opaque token 做 SHA-256，没有扩大静默降级 | PASS |
| H8 lint | Node 24 `npm run lint`，exit 0、0 warning | PASS |
| H8 typecheck | Node 24 `npm run typecheck`，exit 0 | PASS |
| H8 tests | Node 24 `npm test`：scripts `196/196`、TypeScript `32/32` | PASS |
| H8 build | Node 24 `npm run build`，client、SSR、Nitro/Vercel 构建均 PASS | PASS |
| 技能有效性 | `quick_validate.py .grok/skills/og` 返回 `Skill is valid!`；brand-check 与 write-atomic 契约测试均通过 | PASS |
| Diff hygiene | `git diff --check` PASS；新增代码无 `eslint-disable`、skip、only 或 `ts-ignore` | PASS |
| H9 | 10 files，`+92/-15`，低于 15 files / 400 lines，单一基线修复目的 | PASS |
| H9 功能行 | 该提交是经授权的源仓门禁基线修复，不实现或实质改变 SIK-1067 功能表中的命名功能 | N/A |
| H11 | 没有新增视觉规格或用户可见拓扑；作者提供的开发态及生产态 1440/390 smoke 均无横溢、console 0，关键交互正常 | PASS |
| H12 | SIK-1067 契约文件在该 SHA 中零 diff；禁用 key 与旧 flag 文案未重新进入产品源码 | PASS |
| 凭据安全 | `.grok/app-env.json:1-3` 仅含公开的 `VITE_AUTH_ENABLED=false`，无口令、token 或密钥 | PASS |
| H14 | reviewer 未启动服务、未修改被审代码；共享工作区随后出现主控并发修改的旧 review 文件，已通知主控在最终收口前处理 | REVIEWER PASS / MASTER PENDING |

## Spec

| 用户意图 / 契约条款 | Commit 实现 | 验证证据 | 结果 |
|---|---|---|---|
| 修正 conditional Hooks，且 specimen/live 行为不变 | `ProposalCard` 和 `RecommendCard` 的 Hooks 移到 specimen 返回前，所有渲染路径 Hook 顺序一致 | `src/components/stream/primitives.tsx:875-916,1238-1248`；lint PASS；Approval 自动落定及 Recommendation 展开 smoke PASS | PASS |
| 保持认证 Hook 顺序稳定 | `authEnabled` 仍是模块加载时固定常量；删除无效 lint suppression，没有改变 auth-on/off 返回值 | `src/lib/auth/use-current-user.ts:54-72`；typecheck/lint PASS | PASS |
| 修复不稳定引用而不改变数据 | AI Dock 仅 memoize 当前 chat 的 thread；Prompt Bar token 仅随 `plus/value` 重算 | `src/components/ai-dock.tsx:126-172`；`src/components/prompt-bar.tsx:52-63`；依赖完整；Prompt Bar `@` 菜单 smoke PASS | PASS |
| malformed JWT 保持稳定 opaque fallback | JSON/base64 解析失败后仍 hash 原 token，没有转为空身份、共享身份或抛出新异常 | `src/lib/app-data/client.server.ts:194-218`；独立定向探针连续两次相同 malformed token 只请求一次，`calls=1` | PASS |
| 恢复 auth-off 模板默认值 | 提交正式 `.grok/app-env.json`，与源仓 `AGENTS.md` 及现有 wrapper/test 契约一致 | `.grok/app-env.json:1-3`；`scripts/with-app-env.test.mjs`、`check-auth-invariant.test.mjs` PASS；build 使用同一 wrapper | PASS |
| OG 技能必须真实可执行 | 技能明确触发边界、pending 生命周期、输出尺寸、失败口径、自检命令；reference 提供三个原子 hand-over 命令 | `.grok/skills/og/SKILL.md:8-44`；`.grok/skills/og/references/asset-contract.md:3-15`；quick_validate、brand-check、write-atomic tests PASS | PASS |
| PWA 测试不得受当前 workspace 品牌资产污染 | 默认 helper 使用空 workspace；每个显式 `ctx.cwd` 仍可覆盖隔离目录，原有断言正文未删除或放宽 | `scripts/grok-pwa-plugin.test.mjs:22-27`；自定义卡、磁盘优先、baked identity、placeholder、注入幂等断言全部 PASS | PASS |
| `.gitignore` 只恢复正式模板契约范围 | 放行 app-env 和 OG skill 子树；pending marker、其它 `.grok` 状态及未批准技能仍忽略 | `.gitignore:4-9`；`git check-ignore`：app-env/OG trackable，`og-pending`、private state、其它 skill ignored | PASS |
| 不改变 SIK-1067 单路径语义 | 该提交未修改 `spec-app.tsx`、`spec-matrix.ts` 或 stream foundation 契约测试 | SHA diff 对三条 SIK-1067 契约路径为空；全量测试中的 flagless infrastructure 契约 PASS | PASS |
| 清除完整 11/16 基线而非定向绕过 | 全仓 lint 与完整 tests 全绿，没有禁用规则、删除测试或新增 skip | Node 24 lint PASS；scripts 196/196；TS 32/32 | PASS |

## Findings

无。

## What Is Good

- Hook 修复处理了运行路径本身，而非增加 lint 忽略。
- PWA 测试通过依赖注入隔离 workspace 状态，保留了全部自定义卡与 placeholder 断言。
- OG 技能恢复包含可执行 hand-over 与自检链路，不是只满足正则的空壳。
- 认证默认配置只含公开构建标志，符合 auth-off 模板契约。
- 基线修复与 SIK-1067 产品提交保持原子分离。

## Verification Evidence

```text
Node: v24.19.0
npm run lint: PASS
npm run typecheck: PASS
npm test: PASS
  scripts: 196 passed / 196
  TypeScript: 32 passed / 32
npm run build: PASS
skill quick_validate: PASS
git diff --check: PASS
malformed JWT stable-memo probe: PASS (calls=1)
```

H5: triggered（认证默认配置、Hook 顺序、错误路径、测试隔离及 10 文件变更）

DocFM: n/a（审查者返回可落档报告内容，未写治理文档）

FuncRow: n/a（审查对象为经授权的源仓基线修复，不实现或实质改变命名功能行）
