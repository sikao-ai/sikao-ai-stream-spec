---
schema: 1
doc_class: review
type: review
status: active
owner: codex-reviewer-sik1067-prototype
created: 2026-09-01
last_reviewed: 2026-09-01
identifier: SIK-1067
reviewed_commit: b2d785bb6d43e517eb469bc8e229f63fbbf9834e
notion_issue_url: https://app.notion.com/p/3cdfe478db78818d9adeda20b63b6212
verdict: CHANGES_REQUIRED
independent_subagent_review: true
author_neq_reviewer: true
round: 1
wave: Wave 0
title: sik-1067-wave0-prototype-h5-r1
tags:
  - review/h5
  - visual-contract
  - ai/stream
related:
  - "[[sik-1067-ai-stream-density-visual-contract]]"
---

# H5 Review R1 — SIK-1067 Wave 0 规格 App 单路径发布

```text
Mode: Reviewer
document: sikao-ai/sikao-ai-stream-spec
用户意图: 修正 Wave 0 发布规格 App，使统一 AI chrome 明确作为无视觉 flag、无双皮肤的基础设施单路径；正常 Web 部署直接上线，故障只走代码 revert/roll-forward，宿主业务 capability flag 不控制 chrome 版本。
date: 2026-09-01
Independent subagent review: true
author ≠ reviewer: true
verdict: CHANGES_REQUIRED
```

## Verdict

`CHANGES_REQUIRED`

被审 SHA 的产品 Spec 与 SHA-scoped Standards 审查均无 OPEN finding；首轮发现的禁用 key 测试问题已在 amend 后解除。

唯一未解除的收口阻断是 H8：该 workspace 的全仓 lint 与 tests 仍失败。失败均位于本 SHA 未触及的基线路径，不是 `b2d785b` 引入的产品缺陷，但在没有已批准例外时仍阻断 push / Done。

## Review Scope

- Repository: `sikao-ai/sikao-ai-stream-spec`
- Reviewed commit: `b2d785bb6d43e517eb469bc8e229f63fbbf9834e`
- Parent: `b2d785bb6d43e517eb469bc8e229f63fbbf9834e^`
- Diff: 3 files，`+21/-31`
- 直接影响：矩阵页发布说明、Wave 0/1 行为矩阵、对应契约测试
- 未影响：`apps/web`、后端 API、DTO、PostgreSQL、运行时状态机、生产 flag registry
- 审查种类 / 时点：视觉契约 + 行为规格 / 收口

## Spec Sources

1. Notion SIK-1067：`## 特性`、`## 功能`、`## Acceptance`、`## Visual Contract`、`Decision · 2026-08-31 · 基础设施单路径直接上线`。
2. Canonical contract commit `a3ad59eda03f1efa80af58c010a71514b196bba8`：
   - §0.2：`web-desktop`、`web-mobile` 为 `changed`
   - §0.3：`Feature Flag: not required`
   - A-PATH：无视觉 flag、无双皮肤/旧 renderer fallback
   - C06a：1440/390、浅/深、单路径发布说明
3. 当前线程用户决定：“不开 flag，这是属于基建”，并指定源仓库。
4. Notion 唯一功能行：`Wave 0 H11 原型`。

## Standards

| Gate | 核验 | 结果 |
|---|---|---|
| H5 | 外部可观察行为与视觉契约语义发生改变，独立 reviewer 仅审最终 SHA | PASS |
| H9 规模 | 3 files，`+21/-31`，原子修改，无超限 | PASS |
| H9 功能行追踪 | 主控 fetch-after：旧 SHA `30e609d…` count=0；最终 SHA `b2d785bb6d43e517eb469bc8e229f63fbbf9834e` count=1 | PASS |
| H11 | Full 契约声明 desktop/mobile changed；1440/390 浅/深 smoke 证据显示无旧卡、无横溢、主题 token 正常、console error/warning 0 | PASS |
| H12 | 消费既定 `Feature Flag: not required`；删除 flag 数据、卡片和旧发布行为，没有新建运行时选择器 | PASS |
| H8 定向 | Node 24 typecheck、build、定向 eslint、定向 node:test、forbidden-term grep、diff-check | PASS |
| H8 workspace | 全仓 lint 11 errors；全仓 tests 16 failures | BLOCKED |
| H14 | `git status --short` 为空；reviewer 未启动遗留服务 | PASS |

### H8 基线归因

全仓失败不属于本 SHA：

- lint：`src/components/stream/primitives.tsx:900` 起的 conditional hooks、`src/lib/app-data/client.server.ts:214` 的 `no-empty` 等；均不在三文件 diff。
- tests：`scripts/brand-check.test.mjs:308`、`scripts/check-auth-invariant.test.mjs:93`、`scripts/grok-pwa-plugin.test.mjs:105`、`scripts/with-app-env.test.mjs:62`、`scripts/write-atomic.test.mjs:167` 等共 16 项；本 SHA 新增的定向契约测试通过。
- 结论：这些失败不是 `b2d785b` 的回归，但 H8 没有“既有基线失败可忽略”的通用例外，因此仍阻断收口。修复应进入独立、已授权的基线修复提交，不应塞回本 SHA。

## Spec

审查者理解的预期外部行为是：规格 App 的矩阵页不再展示或暗示禁用 flag key、默认 OFF、视觉开关或双皮肤；它应明确说明统一 chrome 是随正常 Web 部署直接上线的基础设施单路径，故障通过代码回退，宿主现有业务 capability flag 不参与 chrome 版本选择。

| 用户意图 / 功能 / 契约条款 | Commit | 验证证据 | Acceptance / 设计符合性 | 结果 |
|---|---|---|---|---|
| 发布版本保持 `1067.w0.4 / 1066.v4` | `b2d785bb…` | `src/lib/spec-matrix.ts:3-4`；四态矩阵页 smoke | 与功能行及 C06a 一致 | PASS |
| 删除旧 flag 卡和运行时视觉开关表达 | `b2d785bb…` | `src/components/spec-app.tsx:1041-1050`；旧 `matrix-flag` 卡被删除；forbidden grep 0 命中 | 符合 A-PATH 和 Acceptance | PASS |
| 不保留 flag 定义、默认 OFF 或双皮肤 | `b2d785bb…` | `src/lib/spec-matrix.ts:53-64`；`FEATURE_FLAG` 常量删除；W1 明确不保留旧 renderer/双皮肤 | 符合 §0.3 | PASS |
| 正常部署直接走 canonical renderer | `b2d785bb…` | `src/components/spec-app.tsx:1045`；`src/lib/spec-matrix.ts:63` | 符合 Rollout | PASS |
| rollback 只走代码 revert/roll-forward | `b2d785bb…` | `src/components/spec-app.tsx:1045`；`scripts/stream-foundation-contract.test.mjs:15` | 符合 Rollback | PASS |
| 宿主业务 flag 不控制 chrome 版本 | `b2d785bb…` | `src/components/spec-app.tsx:1045`；`src/lib/spec-matrix.ts:64`；契约测试第 16 行 | 符合 1050/1047 边界 | PASS |
| 1440/390、浅/深、无横向溢出与无 console 异常 | `b2d785bb…` | 四态浏览器 smoke：旧术语 0、单路径说明存在、390 无横溢、主题 token 切换正常、console 0 | 符合 C06a/A-THEME | PASS |
| 禁用 key 不进入代码、fixture 或测试 | `b2d785bb…` | `git grep` 对 `src` 与定向测试 0 命中；测试改为断言旧结构名不存在 | 符合 §0.3 禁令 | PASS |

## Findings

### Open SHA findings

无。

### Re-review history

| ID | Severity | 状态 | 位置 | 说明 |
|---|---|---|---|---|
| F-01 | Important | RESOLVED | `scripts/stream-foundation-contract.test.mjs:10` | 初始 SHA `30e609d…` 的测试本身包含并测试禁用 key，违反“测试均无该 key”。amend 后最终 SHA 改为检查 `FEATURE_FLAG`、`matrix-flag`、`defaultOff` 旧结构，禁用 key 全仓目标范围 0 命中。 |

## Closure Blocker

| ID | Gate | 证据 | 归因 | 解除条件 |
|---|---|---|---|---|
| B-01 | H8 | `npm run lint`：11 errors；`npm test`：196 tests / 180 pass / 16 fail | 全部位于本 SHA 未触及路径，不是产品 diff finding | 在独立基线修复中清零后，针对同一最终 SHA 更新本报告证据；或取得适用的明确硬规则例外 |

## What Is Good

- 改动范围严格限定在规格 App 的展示与契约测试，没有侵入生产 `apps/web`。
- 删除的是完整 flag 数据模型和卡片，而非只隐藏文案。
- 正常部署、代码 rollback、业务 capability flag 边界三项均有正向测试。
- amend 后禁用 key 不再以“负向测试”为名重新进入测试源码。

H5: triggered（视觉契约、交互语义及外部可观察行为定义发生改变）

DocFM: n/a（审查者仅返回可落档报告内容；未改 `docs/plan/**`、`docs/engineering/**` 或 `docs/vault/**`）

FuncRow: written（`Wave 0 H11 原型`；fetch-after 最终 SHA 唯一命中）
