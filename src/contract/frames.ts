/**
 * Main-repo SSE frame tags → Turn phase / slot / error / terminal.
 * Arrays pin sikao contracts/*.json. Unknown tag = fail-soft, no invented skin.
 */

export const FRAME_CONTRACT_VERSION = "w8b.frame.v1" as const;

/** sikao contracts/engine-frame-tags.json */
export const ENGINE_FRAME_TAGS = [
  "action",
  "delta",
  "discard",
  "done",
  "error",
  "hitl_interrupt",
  "op",
  "phase",
  "proposal",
  "reasoning",
  "surface",
  "suspended",
  "terminal",
  "tool",
  "widget",
] as const;

export type EngineFrameTag = (typeof ENGINE_FRAME_TAGS)[number];

/** sikao contracts/consult-frames.json */
export const CONSULT_FRAME_TAGS = [
  "action",
  "delta",
  "discard",
  "done",
  "error",
  "hitl_interrupt",
  "phase",
  "proposal",
  "reasoning",
  "tool",
  "widget",
] as const;

/** sikao contracts/teach-frames.json */
export const TEACH_FRAME_TAGS = [
  "ai",
  "choice",
  "choiceVerdict",
  "done",
  "error",
  "gate",
  "op",
  "steps",
  "summary",
  "variantVerdict",
  "youtry",
] as const;

/** sikao contracts/guided-frames.json */
export const GUIDED_FRAME_TAGS = ["done", "error", "op"] as const;

/** sikao contracts/essay-drill-frames.json */
export const DRILL_FRAME_TAGS = [
  "action",
  "delta",
  "done",
  "drill_unit",
  "drill_verdict",
  "error",
  "focus_suggest",
  "phase",
  "reasoning",
  "tool",
] as const;

/** sikao contracts/agentic-frame-tags.json */
export const AGENTIC_FRAME_TAGS = [
  "action",
  "error",
  "op",
  "phase",
  "reasoning",
  "surface",
  "suspended",
  "terminal",
  "tool",
] as const;

export const FRAME_FAMILIES: ReadonlyArray<{
  id: string;
  file: string;
  tags: readonly string[];
  density: string;
}> = [
  { id: "engine", file: "engine-frame-tags.json", tags: ENGINE_FRAME_TAGS, density: "并集。未知 tag fail-soft。" },
  { id: "consult", file: "consult-frames.json", tags: CONSULT_FRAME_TAGS, density: "short / tool / gate" },
  { id: "teach", file: "teach-frames.json", tags: TEACH_FRAME_TAGS, density: "teach · 旧讲题 SSE" },
  { id: "guided", file: "guided-frames.json", tags: GUIDED_FRAME_TAGS, density: "teach · 只有对话是 Turn" },
  { id: "drill", file: "essay-drill-frames.json", tags: DRILL_FRAME_TAGS, density: "tool · 部分进 ProgressAtom" },
  { id: "agentic", file: "agentic-frame-tags.json", tags: AGENTIC_FRAME_TAGS, density: "teach · Tutor/复盘教师" },
];

export const FRAME_MAP: ReadonlyArray<{
  id: string;
  family: string;
  from: string;
  phase: string;
  ui: string;
  error: string;
  terminal: string;
  specimen: { scenario: string; phase: string } | null;
}> = [
  {
    id: "phase",
    family: "consult / agentic / drill",
    from: "thinking / gathering / tool 阶段名",
    phase: "waiting | live",
    ui: "status wait/tool；可有专家栈",
    error: "—",
    terminal: "否",
    specimen: { scenario: "tool", phase: "waiting" },
  },
  {
    id: "reasoning",
    family: "consult / agentic / drill",
    from: "思考块",
    phase: "live → settled 折进多步骤",
    ui: "live：专家栈。settled：step-log 思考行。不对思考打绿勾。",
    error: "—",
    terminal: "否",
    specimen: { scenario: "tool", phase: "live" },
  },
  {
    id: "tool",
    family: "consult / agentic / drill",
    from: "tool_use / tool_result",
    phase: "live",
    ui: "回合态 tool + 专家栈。落定折进多步骤。",
    error: "单工具失败 → 该行 rejected，不当整轮 error",
    terminal: "否",
    specimen: { scenario: "tool", phase: "live" },
  },
  {
    id: "delta",
    family: "consult / drill",
    from: "assistantText / token",
    phase: "streaming",
    ui: "prose 通栏。专家栈收起。无 [n]。",
    error: "—",
    terminal: "否",
    specimen: { scenario: "tool", phase: "streaming" },
  },
  {
    id: "widget",
    family: "consult",
    from: "ai-widget-frames.json 13 kind",
    phase: "settled",
    ui: "widgets · KindTag「数据」。每回合 1 张。默认折。",
    error: "未知 kind fail-soft，不画空白卡",
    terminal: "随 done",
    specimen: { scenario: "tool", phase: "settled" },
  },
  {
    id: "proposal",
    family: "consult",
    from: "计划/笔记提案",
    phase: "live 门 / settled 推荐",
    ui: "approval 挡住正文；落定 RecommendCard",
    error: "没写上 + 幂等重试。不当 typed-error 正文",
    terminal: "否（门开后才继续）",
    specimen: { scenario: "gate", phase: "live" },
  },
  {
    id: "hitl_interrupt",
    family: "consult",
    from: "1031 真停",
    phase: "live + gate",
    ui: "Approval · 等你选。停止钮仍可。",
    error: "invalid 禁用提交；fail 留在门上",
    terminal: "否 · suspended",
    specimen: { scenario: "gate", phase: "live" },
  },
  {
    id: "action",
    family: "consult / agentic / drill",
    from: "AiActionFrame：actionId / args / name / round / type",
    phase: "live",
    ui: "入队后由宿主页执行。confirm 由 FE registry 静态字段决定，不骑线。",
    error: "未知 name fail-soft，不 invent 皮肤",
    terminal: "否",
    specimen: { scenario: "cause-act1", phase: "live" },
  },
  {
    id: "op",
    family: "teach / guided / agentic",
    from: "EffectKind emphasis/logic/underline/strike/note",
    phase: "live",
    ui: "卷面 Effect，不进 Turn 槽。禁止第六族 pill。",
    error: "OpReject 退灰该步，回合继续",
    terminal: "否",
    specimen: { scenario: "tutor", phase: "settled" },
  },
  {
    id: "surface",
    family: "agentic",
    from: "讲题面切换",
    phase: "live",
    ui: "Host stem / 教具。不是回合槽。",
    error: "renderer 不可用 → typed error，不留空白宿主",
    terminal: "否",
    specimen: { scenario: "review-path-a", phase: "waiting" },
  },
  {
    id: "suspended",
    family: "agentic",
    from: "opaque hold / HITL",
    phase: "halt 或 gate",
    ui: "只读条或活时门。不是 cancelled。",
    error: "不得清成 idle",
    terminal: "否",
    specimen: { scenario: "stop_pending", phase: "halt" },
  },
  {
    id: "discard",
    family: "consult",
    from: "作废该帧",
    phase: "—",
    ui: "不画。不闪。不占槽。",
    error: "—",
    terminal: "否",
    specimen: null,
  },
  {
    id: "done",
    family: "全族",
    from: "1040 completed",
    phase: "settled",
    ui: "status done + 正文 + 落定控件 + 脚印（有正文）",
    error: "—",
    terminal: "completed",
    specimen: { scenario: "tool", phase: "settled" },
  },
  {
    id: "error",
    family: "全族",
    from: "provider_unknown / failed / typed-error",
    phase: "error",
    ui: "status error + ErrorBand。已出字只读。无正文则无脚印。",
    error: "生成未确认 / 这一轮没有写完。不当成功、不当普通停止。",
    terminal: "failed",
    specimen: { scenario: "provider_unknown", phase: "error" },
  },
  {
    id: "terminal",
    family: "agentic",
    from: "Run 终态汇总",
    phase: "settled | stop | error",
    ui: "按 ExecutionTerminal 投影，不另造第四终态。",
    error: "stop_failed ≠ cancelled；provider_unknown ≠ done",
    terminal: "是",
    specimen: { scenario: "tool", phase: "settled" },
  },
  {
    id: "ai",
    family: "teach",
    from: "讲题正文流",
    phase: "streaming",
    ui: "prose。题面在 stem。",
    error: "—",
    terminal: "否",
    specimen: { scenario: "teach", phase: "streaming" },
  },
  {
    id: "gate",
    family: "teach",
    from: "讲题确认",
    phase: "live + gate",
    ui: "Approval。与 consult hitl 同一皮。",
    error: "同 hitl_interrupt",
    terminal: "否",
    specimen: { scenario: "gate", phase: "live" },
  },
  {
    id: "choice",
    family: "teach",
    from: "选项",
    phase: "settled",
    ui: "到你了。默认折叠。标题「下一空自己选」。",
    error: "—",
    terminal: "随 done",
    specimen: { scenario: "teach", phase: "settled" },
  },
  {
    id: "choiceVerdict",
    family: "teach",
    from: "选项判定",
    phase: "settled",
    ui: "到你了内回执，不另起 StatusTag 绿勾。",
    error: "—",
    terminal: "随 done",
    specimen: { scenario: "teach", phase: "settled" },
  },
  {
    id: "youtry",
    family: "teach",
    from: "到你了",
    phase: "settled",
    ui: "widgets youtry · KindTag「到你了」",
    error: "—",
    terminal: "随 done",
    specimen: { scenario: "tutor", phase: "settled" },
  },
  {
    id: "steps",
    family: "teach",
    from: "步骤列",
    phase: "settled | stop",
    ui: "step-log 折叠。不对每步打勾。",
    error: "失败步 rejected 退灰",
    terminal: "随 done/stop",
    specimen: { scenario: "teach", phase: "settled" },
  },
  {
    id: "summary",
    family: "teach",
    from: "收束",
    phase: "settled",
    ui: "prose。不是发现卡。",
    error: "—",
    terminal: "completed",
    specimen: { scenario: "teach", phase: "settled" },
  },
  {
    id: "variantVerdict",
    family: "teach",
    from: "变式判定",
    phase: "settled",
    ui: "正文内，不是第六族 pill。",
    error: "—",
    terminal: "随 done",
    specimen: { scenario: "teach", phase: "settled" },
  },
  {
    id: "drill_unit",
    family: "drill",
    from: "申论 drill 单元",
    phase: "live / 例外 ProgressAtom",
    ui: "进对话则 tool 密度；批改单元不进四密流。",
    error: "—",
    terminal: "视单元",
    specimen: { scenario: "essay", phase: "settled" },
  },
  {
    id: "drill_verdict",
    family: "drill",
    from: "drill 判定",
    phase: "settled",
    ui: "正文或卡片，不另造族。",
    error: "—",
    terminal: "随 done",
    specimen: { scenario: "essay", phase: "settled" },
  },
  {
    id: "focus_suggest",
    family: "drill",
    from: "W4 焦点建议",
    phase: "settled",
    ui: "PromptList / 到你了。不是第六族。",
    error: "—",
    terminal: "否",
    specimen: { scenario: "essay", phase: "settled" },
  },
];

export const FRAME_RULES: ReadonlyArray<{ do: string; dont: string }> = [
  { do: "按 tag 投影到已有槽。未知 tag 与未知 widget kind 一样 fail-soft。", dont: "为新 tag 发明第六族或空白卡。" },
  { do: "错误列只写这一帧自己的失败。", dont: "把 partial-fail 升成整轮 error。" },
  { do: "终态只认 completed / cancelled / failed / provider_unknown。", dont: "stop_failed 画成已停止；quota 画成生成未确认同一句。" },
  { do: "同一 Turn 换 1440 / 390 只改 LAYOUT_SCALE。", dont: "整列 scale 或 translate 纠偏。" },
];
