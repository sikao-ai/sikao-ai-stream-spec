/**
 * Turn contract. Prototype truth for “same input state draws this tree”.
 * Product runtime, ACL, billing and recovery live in sikao — not here.
 */

export const TURN_CONTRACT_VERSION = "1068.turn.v1" as const;

export const DENSITY_IDS = ["short", "tool", "teach", "gate"] as const;
export type DensityId = (typeof DENSITY_IDS)[number];

export const STREAM_PHASES = [
  "waiting",
  "live",
  "streaming",
  "settled",
  "stop",
  "error",
  "recover",
  "halt",
] as const;
export type StreamPhase = (typeof STREAM_PHASES)[number];

export const STANDARD_PHASES = ["waiting", "live", "streaming", "settled", "stop"] as const;
export type StandardPhase = (typeof STANDARD_PHASES)[number];

export const DOT_STATE_IDS = ["wait", "tool", "stream", "recover", "halt", "done", "stop", "error"] as const;
export type DotsState = (typeof DOT_STATE_IDS)[number];

export const TURN_VIEWS = ["live", "persisted", "replay"] as const;
export type TurnView = (typeof TURN_VIEWS)[number];

export type ProseSegment = { readonly text: string } | { readonly cite: number };
export type ProseParagraph = { readonly segments: readonly ProseSegment[] };

export const TURN_STATUS = {
  title: "TurnStatus",
  file: "Dots + 已完成 · 右时间",
  does: "点阵贴着回合文案。思考时间在行右。绿给完成点阵和「已完成」。",
  not: "不当每步绿勾，不是第六族 pill。时间不插在点阵和已完成中间。",
} as const;

export const AGENT_STREAM = {
  title: "回合渲染器",
  live: "工作时：回合态（Dots）自己一行；专家栈 lucide 自己一行。不展开多步骤。gate 活时是 Approval，不是专家栈。",
  streaming: "出字：专家栈收起。回合态 stream。正文通栏无框，现网 StreamingProse。",
  settled:
    "正文结束后：回合态「已完成」可折叠。点开是多步骤（思考块 / 工具调用），不对每步打勾。专家栈不删数据，折进多步骤。",
  stop: "停止：回合态 stop。已写出的正文保留。多步骤仍可打开。脚印仍出（有正文）。",
  error: "失败：回合态 error + 重试。不对已成功工具调用打叉。无正文则无脚印。",
  footprint:
    "脚印在落定控件之后、来源列表之前。不进多步骤。有帮助/没帮助/复制/重新生成/回放；有引用才出来源。点来源才展开列表。桌面默认淡，hover/focus 拉满。streaming 不出脚印。脚印下方只允许来源列表，禁止再挂方法卡 / 到你了 / PromptList。",
  order: "用户泡 →（讲题：题面/教具表）→ 回合态 →（专家栈 | Approval）→ 正文 → 多步骤折叠 → 落定控件（方法/到你了默认折叠）→ 脚印 →（点来源后的列表）",
} as const;

/** 落定控件与脚印前后。方法/到你了默认折叠，避免正文后一堆卡抢走注意。 */
export const BELOW_ANSWER: ReadonlyArray<{
  id: string;
  where: "脚印之前" | "脚印下方";
  appear: string;
}> = [
  { id: "lookback", where: "脚印之前", appear: "settled 且有已有笔记。0–2 张。不是本轮 [n]。" },
  { id: "method", where: "脚印之前", appear: "teach settled。默认折叠，只露 KindTag「方法」+ 标题。" },
  { id: "youtry", where: "脚印之前", appear: "teach settled。默认折叠，只露 KindTag「到你了」+ 标题「下一空自己选」。" },
  { id: "action-chips", where: "脚印之前", appear: "Tutor 诊断导航。ActionChip 竖叠，不是第六族 pill。" },
  { id: "prompt-list", where: "脚印之前", appear: "settled 下一问。不是脚印下方。" },
  { id: "insight/filter/rec", where: "脚印之前", appear: "按密度：发现/筛选/推荐。" },
  { id: "source-list", where: "脚印下方", appear: "唯一允许出现在脚印下的块。点「来源 N」才展开。默认不占注意力。" },
];

export const WIDGET_FOLD = {
  method: "default-collapsed",
  youtry: "default-collapsed",
  reason: "落定控件太多会抢走正文。先露卡头，点开再看方法或选项。",
} as const;

/**
 * 完整 agent 前端渲染器必须交付的块。开发 agent 按编号抄总览标本，禁止漏态。
 * 票面：SIK-1066 文案 · 1067 密度 · 1068 Turn · 1070 来源 · 1072 壳 · 1086 双轴/讲题卡 · 1040 运行时 · 1045 Dots · 1050 Path A。
 */
export const RENDERER_PACK: ReadonlyArray<{
  n: string;
  id: string;
  name: string;
  ticket: string;
  must: string;
}> = [
  { n: "01", id: "status", name: "回合态 Dots", ticket: "1045 / 1086", must: "wait/tool/stream/recover/halt/done/stop/error。几何 4px/gap 2px/槽 16×16。elapsed 在行右。" },
  { n: "02", id: "expert-rail", name: "专家栈", ticket: "1068", must: "仅 live 且非 short/gate。lucide 一行，新芯片从右顶走。" },
  { n: "03", id: "prose", name: "正文 + 角标", ticket: "1068 / 1070", must: "streaming 无 [n]。settled 才出。点 [n] 浮层 popover，不占流、不顶脚印。同时一张。失效卡写「这条已经没了」。列表只在脚印下。" },
  { n: "04", id: "step-log", name: "多步骤", ticket: "1068 / 1086", must: "settled|stop 折叠。不对思考/工具打绿勾。" },
  { n: "05", id: "approval", name: "确认门", ticket: "1068 / 1086", must: "idle/picked/submit/ok/skip/fail/invalid/reopen。活时挡住正文。纯色 sunk 无发丝。KindTag+问句同一行，选项通栏。顶条无左缘色条。" },
  { n: "06", id: "recommend", name: "推荐卡", ticket: "1068", must: "fold/open/accepting/written/skipped/fail。落定不挡下一问。纯色 sunk 无发丝。问句 16/600。" },
  { n: "07", id: "context", name: "Context Card", ticket: "1070", must: "对话 [n] 浮出、你记过、失效「这条已经没了」。不是网页 favicon 条。" },
  { n: "08", id: "insight", name: "发现卡", ticket: "1068", must: "bars/progress/curve/compare + 空态「这一轮没有新的错因」。" },
  { n: "09", id: "filter", name: "筛选表", ticket: "1068", must: "落定对照。空态「没有这类错题」。390 改卡片，禁止整页横滚。" },
  { n: "10", id: "method-youtry", name: "方法卡 / 到你了", ticket: "1086", must: "teach settled。默认折叠 hug 沉底。KindTag「方法」「到你了」。标题「下一空自己选」。拼装与标本同一皮。" },
  { n: "11", id: "prompt-list", name: "PromptList", ticket: "1068", must: "下一问。全宽 lucide 行。脚印之前。" },
  { n: "12", id: "footprint", name: "脚印", ticket: "1068", must: "有帮助/没帮助/复制/重新生成/回放/来源 N。仅 settled|stop 且有正文。" },
  { n: "13", id: "error", name: "ErrorBand", ticket: "1040 / 1032", must: "生成未确认 / 这一轮没有写完。已出字只读。不当成功。" },
  { n: "14", id: "composer", name: "Prompt Bar", ticket: "1072", must: "芯片行：BAR_STATUS（正在看 AI 蓝呼吸点）+ @来源。加 kind 不另造皮。不进顶栏。" },
  { n: "15", id: "turn", name: "回合组装", ticket: "1068", must: "同一 Turn 树。间距只准 TURN_RHYTHM 四档。题面是引用块，你记过是笔记卡。方法/到你了/下一问 hug 沉底与 10 同一皮。每回合最多 1 张数据卡。" },
  { n: "16", id: "entry", name: "入口 AiMark", ticket: "421 / 1072", must: "32/36/44。无可见「AI」字。" },
  { n: "17", id: "families", name: "五族", ticket: "1066", must: "PromptList/StatusTag/ActionChip/KindTag/EntityChip 职责不许串。" },
  { n: "18", id: "motion", name: "出现动画", ticket: "1068 / 1086", must: "卡片 280ms y12 scale.98；widgets 错开 60ms；确认门点选 480ms；折叠 200ms；reduced-motion 全关。" },
  { n: "19", id: "product-widget", name: "产品 widget 帧", ticket: "395 / 756", must: "13 kind 共用 KindTag「数据」壳。每回合 1 张。未知 kind fail-soft。settled 默认折。" },
  { n: "20", id: "viewport", name: "1440 / 390 壳", ticket: "1067 / 1072 / 1086", must: "只换 LAYOUT_SCALE 行。歪了先修 X 再修 Y。390 不降正文到 13。" },
  { n: "21", id: "open", name: "点开", ticket: "1072 / 421", must: "Scene 32 / Seed 36 / Rail 32 / TopBar 44。aria-expanded 跟壳。不是 FAB。" },
  { n: "22", id: "welcome", name: "欢迎与预选项", ticket: "1072 / 741 / 1050", must: "空会话欢迎在 composer 之上。预选项全宽 lucide 行。每场景一份。" },
  { n: "23", id: "session-mgr", name: "会话管理器", ticket: "1072 / 459 / 1050", must: "标题整块可点。下拉 popover 贴标题，不铺满面板。今天/更早。当前 sunk。新对话置顶。" },
  { n: "24", id: "places", name: "浮层 / 右栏 / sheet", ticket: "1072", must: "float 右下不占主列；rail 占宽；sheet handle + 底。流内皮同一 Turn。" },
  { n: "25", id: "scenes", name: "各场景欢迎", ticket: "1072 / 1050", must: "总览/讲题/笔记/Tutor/Guided/Path A 各有欢迎语、占位、预选项。Guided 只在对话轨。" },
  { n: "26", id: "path-a-390", name: "Path A 390 门", ticket: "1050", must: "AiMark +「请在桌面端使用」。不挂 Host、会话、预选项、composer。" },
];

/**
 * 出现动画锁。开发禁止自造弹跳、弹性、扫光。只许这一套。
 * prefers-reduced-motion：动画全关，瞬间到位。
 */
export const ENTER_MOTION: ReadonlyArray<{
  id: string;
  dur: string;
  ease: string;
  from: string;
  when: string;
}> = [
  { id: "user", dur: "180ms", ease: "cubic-bezier(0.15, 0.85, 0.25, 1)", from: "opacity .4 → 1；y 52 → 0", when: "用户泡进场" },
  { id: "expert", dur: "380ms", ease: "var(--ease-out)", from: "opacity 0；y 10 → 0", when: "专家芯片进栈" },
  { id: "chip-slide", dur: "480ms", ease: "var(--ease-out)", from: "track 平移一个 stride", when: "新芯片从右顶走" },
  { id: "card", dur: "280ms", ease: "var(--ease-out)", from: "opacity 0；y 12；scale .98", when: "确认门 / 推荐 / 发现 / 筛选 / Context / 方法 / 到你了 首次出现。拼装不换皮。" },
  { id: "stagger", dur: "60ms × n", ease: "delay only", from: "第 n 张 delay n*60ms", when: "widgets 栈：方法 → 到你了 → 下一问 → 脚印。" },
  { id: "row", dur: "200ms", ease: "var(--ease-out)", from: "opacity 0；y 6", when: "PromptList 行、多步骤行" },
  { id: "cite", dur: "160ms", ease: "var(--ease-out)", from: "opacity 0；y 6", when: "角标旁浮出 Context" },
  { id: "fold", dur: "200ms", ease: "var(--ease-out)", from: "grid-template-rows 0fr → 1fr", when: "方法 / 到你了 / 推荐格子展开" },
  { id: "picked", dur: "480ms", ease: "hold then commit", from: "aria-pressed 后等待", when: "确认门点选，480ms 内可改" },
  { id: "foot", dur: "200ms", ease: "var(--ease-out)", from: "opacity 0", when: "脚印出现，delay 在 widgets 之后" },
  { id: "error", dur: "200ms", ease: "var(--ease-out)", from: "opacity 0；y 6", when: "ErrorBand" },
  { id: "source-list", dur: "200ms", ease: "var(--ease-out)", from: "opacity 0；y 8", when: "点脚印「来源 N」后列表" },
];

export const FOOTPRINT_ACTIONS: ReadonlyArray<{
  id: string;
  label: string;
  when: string;
}> = [
  { id: "up", label: "有帮助", when: "settled | stop，有正文" },
  { id: "down", label: "没帮助", when: "同上" },
  { id: "copy", label: "复制", when: "同上" },
  { id: "regen", label: "重新生成", when: "同上" },
  { id: "replay", label: "回放", when: "有过程可回放时" },
  { id: "sources", label: "来源 N", when: "本回合有引用；点开才在脚印下展开列表。inline [n] 仍是旁浮出" },
];

export const RENDERER_TERMS: ReadonlyArray<{
  name: string;
  en: string;
  maps: string;
  not: string;
}> = [
  { name: "回合渲染器", en: "Turn renderer", maps: "Claude content-block renderer / assistant-ui Message", not: "整页 chat UI；专家栈当整轮" },
  { name: "回合", en: "Turn", maps: "one assistant message with many blocks", not: "Run；activity；Answer Session" },
  { name: "内容块", en: "Content block", maps: "Claude thinking | tool_use | text", not: "Paper Block" },
  { name: "思考块", en: "Thinking block", maps: "Claude thinking", not: "UI 写 chain-of-thought" },
  { name: "工具调用", en: "Tool call", maps: "Claude tool_use", not: "专家芯片当工具名" },
  { name: "工具结果", en: "Tool result", maps: "Claude tool_result", not: "逐步绿勾" },
  { name: "正文", en: "Assistant text", maps: "Claude text / StreamingProse", not: "assistant bubble" },
  { name: "专家栈", en: "Expert rail", maps: "live lucide chips only", not: "落定多步骤；第六族" },
  { name: "多步骤", en: "Step log", maps: "Grok Worked-for fold / Claude tool list", not: "活时专家栈" },
  { name: "回合态", en: "Turn status", maps: "Dots + copy + elapsed", not: "StatusBadge 绿勾" },
  { name: "输入条", en: "Composer", maps: "Claude/ChatGPT composer", not: "PromptList" },
  { name: "脚印", en: "Footprint", maps: "end-of-turn actions", not: "塞进多步骤" },
  { name: "引用", en: "Cite", maps: "inline [n] float", not: "结果页扫卡进回合" },
  { name: "用户泡", en: "User bubble", maps: "user message chrome only", not: "包住正文" },
];

export const EVENT_TO_BLOCK: ReadonlyArray<{
  frame: string;
  block: string;
  chrome: string;
}> = [
  { frame: "phase thinking/gathering · 无 delta", block: "思考块", chrome: "回合态 wait；可有专家栈" },
  { frame: "tool calling · 无正文", block: "工具调用", chrome: "回合态 tool + 专家栈" },
  { frame: "delta / assistantText", block: "正文", chrome: "回合态 stream；专家栈收起" },
  { frame: "cancelled", block: "—", chrome: "回合态 stop；正文保留；多步骤可折" },
  { frame: "provider_unknown / failed", block: "—", chrome: "回合态 error + ErrorBand" },
  { frame: "stop_pending", block: "—", chrome: "回合态 halt" },
  { frame: "recovering / replay_gap", block: "—", chrome: "回合态 recover" },
  { frame: "completed + 有过程", block: "工具结果", chrome: "回合态 done + 多步骤折叠" },
  { frame: "completed 无过程", block: "正文", chrome: "回合态 done，零折叠" },
  { frame: "completed | cancelled 且已有正文", block: "脚印", chrome: "Footprint；点来源展开列表；不进多步骤" },
];

/**
 * Copyable Turn tree. Product must mount nodes in this order.
 * data-turn-slot matches id. ticket=SIK-1070/1072 slots are placeholders only.
 */
export const TURN_SLOTS: ReadonlyArray<{
  id: string;
  name: string;
  ticket: string;
  when: string;
}> = [
  { id: "user", name: "用户泡", ticket: "SIK-1068", when: "每回合" },
  { id: "stem", name: "题面 mark", ticket: "SIK-1068", when: "仅 teach" },
  { id: "status", name: "回合态 Dots", ticket: "SIK-1068", when: "每回合" },
  { id: "expert-rail", name: "专家栈", ticket: "SIK-1068", when: "live 且非 short/gate" },
  { id: "approval", name: "Approval 活时门", ticket: "SIK-1068", when: "gate + live" },
  { id: "prose", name: "正文", ticket: "SIK-1068", when: "streaming | settled | stop" },
  { id: "step-log", name: "多步骤折叠", ticket: "SIK-1068", when: "settled | stop，且有过程" },
  { id: "lookback", name: "你记过", ticket: "SIK-1070", when: "settled 有笔记；1068 只留槽" },
  { id: "widgets", name: "落定控件", ticket: "SIK-1068", when: "settled：方法卡/发现卡/推荐卡/PromptList" },
  { id: "footprint", name: "脚印", ticket: "SIK-1068", when: "settled | stop，有正文" },
  { id: "source-list", name: "来源列表", ticket: "SIK-1070", when: "点脚印来源后；1068 只留槽" },
  { id: "composer", name: "输入条 / 壳", ticket: "SIK-1072", when: "Turn 外；1068 不画 Dock/Prompt Bar" },
];

export type TurnSlotId = (typeof TURN_SLOTS)[number]["id"];

export const TURN_SLOT_IDS: readonly TurnSlotId[] = TURN_SLOTS.map((s) => s.id);

/** Phase × slot. ● draw; — omit; fold collapsed until opened. */
export const TIMING_MATRIX: ReadonlyArray<{
  slot: string;
  waiting: string;
  live: string;
  streaming: string;
  settled: string;
  stop: string;
}> = [
  { slot: "status", waiting: "● wait", live: "● tool/wait", streaming: "● stream", settled: "● done", stop: "● stop" },
  { slot: "expert-rail", waiting: "—", live: "● 非 gate", streaming: "—", settled: "—", stop: "—" },
  { slot: "approval", waiting: "—", live: "● 仅 gate", streaming: "—", settled: "—", stop: "—" },
  { slot: "prose", waiting: "—", live: "—", streaming: "●", settled: "●", stop: "● 已写部分" },
  { slot: "step-log", waiting: "—", live: "—", streaming: "—", settled: "fold", stop: "fold" },
  { slot: "widgets", waiting: "—", live: "—", streaming: "—", settled: "●", stop: "—" },
  { slot: "footprint", waiting: "—", live: "—", streaming: "—", settled: "●", stop: "●" },
  { slot: "source-list", waiting: "—", live: "—", streaming: "—", settled: "点开", stop: "—" },
];

/** Exception phases not in TIMING_MATRIX columns. */
export const EXCEPTION_TIMING: ReadonlyArray<{
  slot: string;
  halt: string;
  recover: string;
  error: string;
}> = [
  { slot: "status", halt: "● halt", recover: "● recover", error: "● error" },
  { slot: "expert-rail", halt: "—", recover: "—", error: "—" },
  { slot: "approval", halt: "—", recover: "—", error: "—" },
  { slot: "prose", halt: "● 已写部分", recover: "● 已写部分", error: "● 已写只读" },
  { slot: "step-log", halt: "fold", recover: "fold", error: "fold" },
  { slot: "widgets", halt: "—", recover: "—", error: "—" },
  { slot: "footprint", halt: "—", recover: "—", error: "—" },
  { slot: "source-list", halt: "—", recover: "—", error: "—" },
];

export const DENSITIES: ReadonlyArray<{
  id: DensityId;
  title: string;
  host: string;
  flow: string;
  note: string;
  chrome: string;
}> = [
  {
    id: "short",
    title: "短答流",
    host: "咨询 · 笔记 · hint",
    flow: "Waiting Dots → StreamingProse。无过程则零 chrome。",
    note: "禁止空「处理了 0s」。答案通栏无框，Claude 式浅用户泡。",
    chrome: "用户泡 · Dots 状态行 · 散文 · 脚印",
  },
  {
    id: "tool",
    title: "工具流",
    host: "通用 dock · 复盘 Agent · 计划",
    flow: "工作时：Dots 状态行 + 专家栈 lucide chips 自己一行。出字后芯片收起。正文结束：状态行「已完成」可折叠，点开看多步骤。落定后发现卡 / 筛选表。",
    note: "专家栈是活时过程 UI（简洁 lucide 条）。多步骤是正文后的折叠日志（Grok 式步骤列）。不是两套对话皮。绿给完成点阵和「已完成」，不对每步打勾。",
    chrome: "+ 活时专家栈 · 正文后多步骤折叠 · 发现卡 · 筛选表",
  },
  {
    id: "teach",
    title: "讲题流",
    host: "Teach · Guided",
    flow: "同工具流（活时专家栈 → 正文后多步骤折叠），外加题面 mark。方法卡 / 你来在正文后。",
    note: "方法卡 KindTag.suggest；你来门 KindTag.input。脚印贴在两张卡之后。",
    chrome: "+ 题面 · 方法卡 · 你来",
  },
  {
    id: "gate",
    title: "门卡流",
    host: "写笔记 · 整理 · 提案 · HITL",
    flow: "活时确认卡挡住：先问你，选完才往下写。落定后推荐卡提案，不挡下一问。",
    note: "确认卡只出现在活时。落定写计划用推荐卡。导航 CTA 炭黑。",
    chrome: "+ 活时审批 · 落定推荐卡",
  },
];

export const DENSITY_CHROME: ReadonlyArray<{
  row: string;
  short: boolean;
  tool: boolean;
  teach: boolean;
  gate: boolean;
}> = [
  { row: "Dots 状态行", short: true, tool: true, teach: true, gate: true },
  { row: "专家栈（工作时 lucide 条）", short: false, tool: true, teach: true, gate: false },
  { row: "多步骤折叠（正文后点开）", short: false, tool: true, teach: true, gate: true },
  { row: "角标浮出 chunk", short: false, tool: true, teach: true, gate: true },
  { row: "题面 mark", short: false, tool: false, teach: true, gate: false },
  { row: "方法卡 / 你来", short: false, tool: false, teach: true, gate: false },
  { row: "审批卡 · 活时挡住", short: false, tool: false, teach: false, gate: true },
  { row: "推荐卡 · 落定提案", short: false, tool: false, teach: false, gate: true },
  { row: "发现卡 / 筛选表", short: false, tool: true, teach: false, gate: false },
  { row: "炭黑导航 CTA", short: false, tool: false, teach: false, gate: true },
];

export const TYPE_SCALE: ReadonlyArray<{
  slot: string;
  desktop: string;
  mobile: string;
  ios: string;
}> = [
  { slot: "正文", desktop: "14 / 1.75 / 400", mobile: "14 / 1.75 / 400", ios: "16 / 1.75 / 400" },
  { slot: "用户泡", desktop: "14 / 1.7 / 400", mobile: "13 / 1.65 / 400", ios: "16 / 1.7 / 400" },
  { slot: "卡头", desktop: "16 / 1.5 / 600", mobile: "14 / 1.45 / 600", ios: "17 / 1.4 / 600" },
  { slot: "回合态 · 多步骤 · PromptList", desktop: "12 / 1.4 / 500", mobile: "12 / 1.4 / 500", ios: "13 / 1.4 / 500" },
  { slot: "KindTag · kicker · 脚印数字", desktop: "11 / 1.4 / 400", mobile: "11 / 1.4 / 400", ios: "11 / 1.4 / 400" },
  { slot: "elapsed", desktop: "11 mono", mobile: "11 mono", ios: "11 SF Mono" },
  { slot: "输入条", desktop: "14 / 18 / 400", mobile: "14 / 18 / 400", ios: "17 / 22 / 400" },
  { slot: "壳辅文", desktop: "12 / 16 / 400", mobile: "13 / 18 / 400", ios: "13 / 18 / 400" },
];

export const LAYOUT_SCALE: ReadonlyArray<{
  slot: string;
  desktop: string;
  mobile: string;
  ios: string;
}> = [
  { slot: "Turn 列宽", desktop: "主列 max 720，居中", mobile: "通栏，左右 16", ios: "通栏，左右 16，避开 Home Indicator" },
  { slot: "用户泡", desktop: "max 82%，右对齐，pad 8 12，r 12/12/5/12", mobile: "max 88%，pad 8 12", ios: "max 88%，pad 8 12" },
  { slot: "回合态行", desktop: "高 28，Dots 16，gap 6", mobile: "高 28，Dots 16", ios: "高 32，Dots 16" },
  { slot: "专家栈", desktop: "芯片 22，间距 6，自己一行", mobile: "同左，可横滑", ios: "芯片 28 触控，横滑" },
  { slot: "多步骤行", desktop: "高 22，lucide 槽 16，列 gap 6", mobile: "高 24", ios: "高 28，lucide 槽 16" },
  { slot: "正文", desktop: "通栏无框，段间距 8", mobile: "同左", ios: "同左" },
  { slot: "Approval / 推荐卡", desktop: "sunken，内边距 16，主钮视觉 32", mobile: "通栏，主钮视觉 32 · 命中 44", ios: "通栏，主钮视觉 32 · 命中 44" },
  { slot: "脚印", desktop: "lucide 28，hover 才拉满对比", mobile: "lucide 28 · 命中 44，常显", ios: "lucide 28 · 命中 44，常显" },
  { slot: "输入条", desktop: "高 40，圆 12，栏内钮 32", mobile: "行 44 字 14，栏内圆钮视觉 32 · 命中 44", ios: "行 44，圆钮 32 · 命中 44，输入 17，键盘避让" },
];

/**
 * 回合垂直节奏。只准用这四个档，禁止在槽之间发明 10 / 14 / 18。
 * 16 列与 6 是横向；这里只管块与块的上下气口。
 */
export const TURN_RHYTHM = {
  user: 12,
  module: 12,
  section: 16,
  cluster: 2,
  prose: 8,
} as const;

export const TURN_RHYTHM_ROWS: ReadonlyArray<{
  from: string;
  to: string;
  gap: number;
  why: string;
}> = [
  { from: "用户泡", to: "助手列", gap: 12, why: "泡自己一行，不和题面抢同一带。" },
  { from: "题面 kicker", to: "题面句", gap: 2, why: "引用块之内。" },
  { from: "题面", to: "Dots", gap: 12, why: "题面是引用块，Dots 才开助手流。" },
  { from: "Dots", to: "正文", gap: 16, why: "点阵不是正文行首。禁止负 margin 贴上。" },
  { from: "正文段", to: "下一段", gap: 8, why: "只在 prose 内。" },
  { from: "正文", to: "你记过", gap: 16, why: "笔记卡不是正文续写。" },
  { from: "你记过 kicker", to: "笔记卡", gap: 6, why: "标签贴着卡，不是再开一段。" },
  { from: "你记过", to: "折叠组", gap: 12, why: "卡换成折叠行。" },
  { from: "数据卡", to: "折叠组", gap: 12, why: "发现/推荐是模块卡，不是折叠行。" },
  { from: "推荐卡", to: "导航 CTA", gap: 12, why: "炭黑钮跟卡，不和折叠行挤 2。" },
  { from: "方法", to: "到你了", gap: 2, why: "同一组折叠行。" },
  { from: "到你了", to: "下一问", gap: 2, why: "同一组折叠行。" },
  { from: "折叠组", to: "脚印", gap: 16, why: "脚印是回合收口。" },
];

export const ALIGN_RULES: ReadonlyArray<{
  slot: string;
  x: string;
  y: string;
}> = [
  { slot: "回合态", x: "Dots 左 = 正文左；时长右 = 列右", y: "Dots / 文案 / 时长 / chevron 同一行垂直中心" },
  { slot: "专家栈", x: "首芯片左 = Dots 左（--turn-icon 列）", y: "芯片垂直中心对齐" },
  { slot: "多步骤", x: "lucide 槽 16 = Dots 列；耗时右齐时长", y: "lucide / 文案 / 耗时垂直中心" },
  { slot: "确认卡", x: "KindTag 与问句同一行；选项左齐卡片 inset。禁止发丝线，纯色块。", y: "KindTag 与问句垂直中心；选项行高 36" },
  { slot: "发现卡", x: "KindTag / 标题 / 数字 / 图 / CTA 左齐 inset 16。纯色块，无描边。", y: "KindTag 与翻页中心；数字与单位 baseline" },
  { slot: "推荐卡", x: "KindTag 与问句同一行；主建议与推荐度两端。纯色块，无描边。", y: "KindTag 与问句中心；推荐度与主标题中心" },
  { slot: "脚印", x: "图标行左齐正文；按钮等距", y: "图标垂直中心；来源数字与图标中心" },
  { slot: "题面", x: "块左 = 正文左（列缘），不是 16 列空槽", y: "kicker 上、句下，块内 gap 2" },
  { slot: "你记过", x: "卡左 = 正文左；卡内笔记标 16", y: "kicker 与卡 gap 6；头一行中心" },
  { slot: "方法/到你了", x: "折叠 hug 沉底，条左 = 正文左。独立标本与拼装同一皮，禁止流内改透明通栏。", y: "KindTag 与标题垂直中心。头行 标题 13。" },
  { slot: "下一问", x: "同样 hug 沉底，与方法/到你了同一行皮。条左 = 正文左。", y: "ico / 标题 / 计数 / chevron 垂直中心。" },
];

export const COPY_LOCK: ReadonlyArray<{
  slot: string;
  copy: string;
  avoid: string;
}> = [
  { slot: "回合态 wait", copy: "正在想", avoid: "Churning / Thinking" },
  { slot: "回合态 tool", copy: "正在检索", avoid: "Running tools" },
  { slot: "回合态 stream", copy: "（空，点阵说话）", avoid: "生成中 badge" },
  { slot: "回合态 done", copy: "已完成", avoid: "Done / 绿色勾" },
  { slot: "回合态 stop", copy: "已停止生成", avoid: "Cancelled" },
  { slot: "回合态 error", copy: "未确认 / 重试", avoid: "Failed" },
  { slot: "KindTag", copy: "到你了 · 你记过", avoid: "可回看" },
  { slot: "推荐度", copy: "1–5", avoid: "高信心" },
  { slot: "导航 CTA", copy: "查看笔记", avoid: "柔黄主钮" },
  { slot: "脚印", copy: "有帮助 / 没帮助 / 复制 / 重新生成 / 来源 N", avoid: "Worked for" },
  { slot: "活时门提示", copy: "先选一下，选完才往下写", avoid: "回合停住 · 确认后才生成" },
  { slot: "回合态 gate", copy: "等你选", avoid: "等待确认" },
  { slot: "门卡 KindTag", copy: "确认", avoid: "审批" },
  { slot: "发现卡空态", copy: "这一轮没有新的错因", avoid: "没有量化发现" },
  { slot: "额度不够", copy: "额度不够", avoid: "Quota exceeded / 生成未确认" },
  { slot: "需要登录后继续", copy: "需要登录后继续", avoid: "Unauthorized / 当失败重试" },
  { slot: "未能停止", copy: "未能停止", avoid: "已停止生成" },
  { slot: "未知 widget", copy: "fail-soft 不渲染", avoid: "空白卡" },
];

export function copyLock(slot: string): string {
  return COPY_LOCK.find((row) => row.slot === slot)?.copy ?? "";
}

export const DOT_STATES = [
  {
    id: "wait",
    title: "等待",
    from: "attached 等待 / silent <500ms",
    take: "ink chevron 波",
    color: "ink",
    copy: "正在想",
    status: null,
    time: "4s",
  },
  {
    id: "tool",
    title: "工具",
    from: "attached + live tools",
    take: "AI 蓝列扫",
    color: "ai",
    copy: "正在检索",
    status: null,
    time: "4s",
  },
  {
    id: "stream",
    title: "生成",
    from: "attached 已出 token",
    take: "AI 蓝扩环",
    color: "ai",
    copy: "",
    status: "stream",
    time: undefined,
  },
  {
    id: "recover",
    title: "续看",
    from: "recovering / exhausted / replay_gap",
    take: "warn 慢波 · 条仍是 DurableRunStatusBar",
    color: "warn",
    copy: "",
    status: "recover",
    time: undefined,
  },
  {
    id: "halt",
    title: "正在停止",
    from: "stop_pending",
    take: "warn 冻帧 · 不是 cancelled",
    color: "warn",
    copy: "",
    status: "halt",
    time: undefined,
  },
  {
    id: "stop",
    title: "已停止",
    from: "cancelled",
    take: "muted rest · 气泡「已停止生成」",
    color: "muted",
    copy: "",
    status: "stop",
    time: "3s",
  },
  {
    id: "error",
    title: "未确认",
    from: "provider_unknown / failed",
    take: "err X · 不当成功、不当普通停止。stop_failed 同色，文案「未能停止」",
    color: "err",
    copy: "",
    status: "error",
    time: undefined,
  },
  {
    id: "done",
    title: "完成",
    from: "completed",
    take: "ok 绿十字",
    color: "ok",
    copy: "",
    status: "done",
    time: "6s",
  },
] as const;

export const DOT_MACHINE: ReadonlyArray<{
  state: string;
  user: string;
  dots: string;
}> = [
  { state: "attached + 等待 / silent<500ms", user: "等待行", dots: "wait · 开 · ink" },
  { state: "attached + live tools", user: "状态行下一行 chip 上顶", dots: "tool · 开 · AI 蓝" },
  { state: "attached + 已出 token", user: "生成中", dots: "stream · 开 · AI 蓝" },
  { state: "recovering / exhausted / replay_gap", user: "条「恢复中」", dots: "recover · warn" },
  { state: "stop_pending", user: "条「正在停止」", dots: "halt · warn 冻" },
  { state: "cancelled", user: "气泡「已停止生成」", dots: "stop · muted" },
  { state: "provider_unknown / failed", user: "条「生成未确认」", dots: "error · err X" },
  { state: "stop_failed", user: "条「未能停止」", dots: "error · err X · 不是 cancelled" },
  { state: "completed", user: "「已完成」", dots: "done · ok 绿" },
  { state: "auth_required / status_reconcile", user: "只读条", dots: "recover · 不另造" },
];

export function timingMark(slot: string, phase: StreamPhase): string {
  if (phase === "halt" || phase === "recover" || phase === "error") {
    const row = EXCEPTION_TIMING.find((r) => r.slot === slot);
    return row ? row[phase] : "—";
  }
  const row = TIMING_MATRIX.find((r) => r.slot === slot);
  if (!row) return "—";
  return row[phase];
}

export function markDrawn(mark: string): boolean {
  return mark.startsWith("●") || mark === "fold" || mark === "点开";
}
