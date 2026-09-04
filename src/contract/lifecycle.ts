/**
 * Agent nouns. Prototype projects these; sikao owns persistence, ACL, billing, restore.
 * One send: Conversation → Turn → Run → frames(seq) → Effect* / Artifact? → terminal Turn.
 */

export const LIFECYCLE_CONTRACT_VERSION = "1040.life.v1" as const;

export const AGENT_NOUNS = [
  {
    id: "conversation",
    name: "Conversation",
    zh: "会话",
    owns: "主仓：持久化 transcript、标题、来源、会话列表。",
    draws: "原型：1072 会话管理器壳。不造第二套 chat store。",
    card: "1 个会话装着 N 个回合。切会话不得把旧 Run 接到新会话。",
    not: "不是 Turn，不是 Dock，不是 Answer Session。",
  },
  {
    id: "turn",
    name: "Turn",
    zh: "回合",
    owns: "主仓：一条 user + assistant 逻辑消息、HITL 停住点。",
    draws: "原型：Turn 树（TURN_SLOTS）。同一输入状态画成同一槽序。",
    card: "1 个回合 0..1 个活 Run。重连挂回同一 Run，禁止开第二 run。",
    not: "不是 Run，不是 activity，不是整页 chat UI。",
  },
  {
    id: "run",
    name: "Run",
    zh: "一次执行",
    owns: "主仓：ai_run 控制面 queued → claimed → running → recovering / stop_pending → terminal。",
    draws: "原型：只投影 attachment → Dots / 例外态。不跑 graph，不扣费。",
    card: "1 个 Run 产出单调 seq 的 Frame。离开可续看；点停止才取消。",
    not: "不是 Conversation。一次用户任务多次模型调用仍是同一 Run 的 activity。",
  },
  {
    id: "effect",
    name: "Effect",
    zh: "副作用",
    owns: "主仓：卷面 op（emphasis/logic/underline/strike/note）与 page action 入队执行。",
    draws: "原型：不画卷面高亮皮。活时只露专家栈；写库必须走门卡。",
    card: "1 个 Run 可有 0..N 个 Effect。确认门挡住正文，直到用户点选。",
    not: "不是正文，不是 widget，不是工具结果绿勾。",
  },
  {
    id: "artifact",
    name: "Artifact",
    zh: "产物",
    owns: "主仓：1037 长任务结果、widget 服务端 payload、已写入的笔记/计划。",
    draws: "原型：落定控件 / KindTag「数据」widget / ProgressAtom 例外（不重画）。",
    card: "对话回合每轮最多 1 张 product widget。长任务走 artifact_ready，不进四密流。",
    not: "不是思考块，不是临时 tool_result 文本。",
  },
] as const;

export type AgentNounId = (typeof AGENT_NOUNS)[number]["id"];

export const AGENT_CARDINALITY: ReadonlyArray<{
  from: string;
  to: string;
  card: string;
  rule: string;
}> = [
  { from: "Conversation", to: "Turn", card: "1 : N", rule: "会话列表点开仍是同一 Conversation。新对话才 mint 新 id。" },
  { from: "Turn", to: "Run", card: "1 : 0..1 活", rule: "reattach 同一 runId。replay_gap 按 seq 重放，禁止开第二 run。" },
  { from: "Run", to: "Frame", card: "1 : N", rule: "seq 单调。重复 seq 忽略，不重画、不闪。" },
  { from: "Run", to: "Effect", card: "1 : 0..N", rule: "写库类 Effect 必须 HITL。卷面 5 kind 不问门。" },
  { from: "Turn", to: "Artifact", card: "1 : 0..1 对话产物", rule: "widget 每回合 1 张。批改/周报走 1037 Artifact，不是 Turn 槽。" },
];

export const SEND_SEQUENCE: ReadonlyArray<{
  n: string;
  actor: string;
  step: string;
  proto: string;
}> = [
  { n: "1", actor: "Host", step: "保证 Conversation id（已知或 lazy-create single-flight）", proto: "会话管理器只展示；不在原型里 create。" },
  { n: "2", actor: "Host", step: "开一个 Turn：用户泡进树，Dots wait", proto: "waiting 帧。" },
  { n: "3", actor: "sikao", step: "POST …/runs mint Run，立刻回同一 runId", proto: "原型不打接口。" },
  { n: "4", actor: "Runner", step: "认领 → 图外 lifecycle 过门 → graph.invoke", proto: "live / streaming 帧。" },
  { n: "5", actor: "SSE", step: "Frame 按 seq 到达：phase / tool / delta / widget / hitl…", proto: "Frame 对照页逐条投影。" },
  { n: "6", actor: "Host", step: "Effect 入队；写库先停在 Approval", proto: "gate 活时门。" },
  { n: "7", actor: "Run", step: "terminal：completed / cancelled / failed / provider_unknown", proto: "settled | stop | error。脚印只在有正文的 settled|stop。" },
];

export const NOUN_BOUNDARIES: ReadonlyArray<{
  do: string;
  dont: string;
}> = [
  { do: "原型只回答「这一帧该画什么」。", dont: "在规格站里跑模型、持久化会话、或假装扣费。" },
  { do: "同一 Turn 在 live / persisted / replay 槽序一致。", dont: "回放时重开第二 Run 或重播「正在想」。" },
  { do: "Run 的例外态投影成 halt / recover / error / stop。", dont: "stop_failed 画成已停止；replay_gap 画成新等待。" },
  { do: "Effect 写库走门卡；卷面 op 走宿主页，不进 Turn 槽。", dont: "把 mark_emphasis 画成第六族 pill。" },
  { do: "Artifact：对话用 widget 卡；长任务用 ProgressAtom。", dont: "把批改结果塞进回合正文当打字机。" },
];
