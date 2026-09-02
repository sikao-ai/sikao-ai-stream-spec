import type { DensityId, SectionId } from "./app-store";

export type NavGroupId = "guide" | "turn" | "parts" | "rules";

export const NAV_GROUPS: ReadonlyArray<{
  id: NavGroupId;
  label: string;
  hint: string;
}> = [
  { id: "guide", label: "导览", hint: "从哪读起" },
  { id: "turn", label: "回合渲染器", hint: "Claude 式一轮怎么画" },
  { id: "parts", label: "组件", hint: "零件细节，不是整轮" },
  { id: "rules", label: "规则", hint: "红线、色板、矩阵" },
];

export const SECTIONS: ReadonlyArray<{
  id: SectionId;
  label: string;
  kicker: string;
  group: NavGroupId;
}> = [
  { id: "overview", label: "总览", kicker: "SSOT", group: "guide" },
  { id: "playground", label: "回合", kicker: "Turn", group: "turn" },
  { id: "density", label: "四密", kicker: "Density", group: "turn" },
  { id: "dock", label: "壳", kicker: "Dock", group: "turn" },
  { id: "families", label: "五族", kicker: "Chips", group: "parts" },
  { id: "entry", label: "入口", kicker: "AiMark", group: "parts" },
  { id: "sources", label: "来源", kicker: "Ground", group: "parts" },
  { id: "rules", label: "红线", kicker: "Contract", group: "rules" },
  { id: "tokens", label: "色板", kicker: "1040", group: "rules" },
  { id: "matrix", label: "矩阵", kicker: "Canon", group: "rules" },
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
    flow: "活时审批卡挡住回合：Agent 停住等点，正文还没出。落定后推荐卡提案，不阻塞下一问。",
    note: "审批只出现在活时。落定写计划用推荐卡，不用审批。导航 CTA 继续炭黑。",
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

export const FAMILIES = [
  {
    id: "prompt",
    title: "PromptList",
    file: "promptList.module.css",
    does: "下一问预选项。lucide + 文字，列、全宽。",
    not: "不当数据标签，不画描边 pill，不秃行纯字。",
  },
  {
    id: "status",
    title: "StatusTag",
    file: "AiStatusTag",
    does: "命中要点、卷况、风险。只读 pill。",
    not: "不当按钮，不当预选项。",
  },
  {
    id: "action",
    title: "ActionChip",
    file: "aiActionChipStack",
    does: "材料导航、probe 多选。竖叠圆角行，填色无描边。",
    not: "不当下一问预选项。",
  },
  {
    id: "kind",
    title: "KindTag",
    file: "KindTag",
    does: "卡头类型：建议 / 输入 / 操作 / 数据。无 soft fill。",
    not: "不当入口，不当回合态。",
  },
  {
    id: "entity",
    title: "EntityChip",
    file: "文字链 + file-lines",
    does: "正文笔记跳转。继承字号，AI 蓝下划线。点击浮出 Context Card。",
    not: "不当 pill，不当 ActionChip 壳。",
  },
] as const;

export const TURN_STATUS = {
  title: "TurnStatus",
  file: "Dots + 已完成 · 右时间",
  does: "点阵贴着回合文案。思考时间在行右。绿给完成点阵和「已完成」。",
  not: "不当每步绿勾，不是第六族 pill。时间不插在点阵和已完成中间。",
} as const;

/**
 * 完整 AI agent 对话骨架（四密同一套，只加减块）。
 * 活时专家栈（lucide chips）保留；正文结束后同一状态行折叠出多步骤。
 */
export const AGENT_STREAM = {
  title: "回合渲染器",
  live: "工作时：回合态（Dots）自己一行；专家栈 lucide 自己一行。不展开多步骤。gate 活时是 Approval，不是专家栈。",
  streaming: "出字：专家栈收起。回合态 stream。正文通栏无框，现网 StreamingProse。",
  settled:
    "正文结束后：回合态「已完成」可折叠。点开是多步骤（思考块 / 工具调用），不对每步打勾。专家栈不删数据，折进多步骤。",
  stop: "停止：回合态 stop。已写出的正文保留。多步骤仍可打开。",
  error: "失败：回合态 error + 重试。不对已成功工具调用打叉。",
  order: "用户泡 →（讲题：题面）→ 回合态 →（专家栈 | Approval）→ 正文 → 多步骤折叠 → 落定控件 → 脚印",
} as const;

/** 回合渲染器词表。与产品 CONTEXT.md「AI and billing」同锁。Claude content block 对齐。 */
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

/**
 * Beautiful UI → 司考回合渲染器。先偷几何/交互，再按四密场景裁。
 * land: spec = 原型已标本；product = sikao 仓可落地程度。
 */
export const BUI_TO_SIKAO: ReadonlyArray<{
  bui: string;
  steal: string;
  leave: string;
  sikao: string;
  role: string;
  product: string;
  land: "spec" | "partial" | "gap";
}> = [
  {
    bui: "01 Loading State · Dots",
    steal: "3×3 圆点、opacity 波、elapsed 在行右",
    leave: "Drive / Orbit / Surfer 扫光",
    sikao: "回合态 Dots",
    role: "每回合常驻。8 态着色。几何 4px / gap 2px / 槽 16×16。",
    product: "TurnStatus.tsx 仍 1.5px/15，行列不对称",
    land: "partial",
  },
  {
    bui: "02 Thinking · traces",
    steal: "可折叠思考步骤、弱一档文案",
    leave: "英文 Thought for Ns 当产品文案",
    sikao: "思考块 → 活时进专家栈；正文后进多步骤",
    role: "Claude thinking block。不对思考打绿勾。",
    product: "LiveStepFeed 当芯片，无折叠步骤列",
    land: "gap",
  },
  {
    bui: "03 Streaming Text",
    steal: "通栏无框、角标旁浮出引用、Follow-ups",
    leave: "英文 follow-up pill",
    sikao: "正文 StreamingProse + 引用 + 落定 PromptList",
    role: "Claude text block。出字时专家栈已收。",
    product: "StreamingProse 有；未接专家栈收起/多步骤展开",
    land: "partial",
  },
  {
    bui: "04 Approval Card",
    steal: "一问、选项行、点选即提交、页脚点阵",
    leave: "480ms picked 窗、铺满奶黄、普通按钮条",
    sikao: "Approval · 活时门",
    role: "未点选挡住正文。柔黄只给主钮。",
    product: "HitlCards + GenericApprovalCard 适配器；invalid/reopen 无 DTO",
    land: "partial",
  },
  {
    bui: "05 Tool Chips",
    steal: "lucide 小芯片、活时一行",
    leave: "当整轮过程 UI；落定后仍挂一排头像",
    sikao: "专家栈",
    role: "仅 waiting/tool 活时。新图标从右顶走。gate 活时用 Approval 不用芯片。",
    product: "StatusToolsRow 芯片行常驻，未按出字收起",
    land: "partial",
  },
  {
    bui: "06 Task Rows",
    steal: "running / failed / completed 行、耗时",
    leave: "逐步绿勾、任务管理器皮肤",
    sikao: "多步骤 · 工具调用行 OpRow",
    role: "正文后折叠展开。工具结果退成 meta lucide。",
    product: "无 Turn 级折叠；ProcessStepRow 仍是旧过程条",
    land: "gap",
  },
  {
    bui: "07 Chat",
    steal: "用户浅泡、助手非泡、composer",
    leave: "桌面三栏当默认、人设侧栏",
    sikao: "回合渲染器",
    role: "MessageList 只排 回合。四密加减块不换皮。",
    product: "InFlight + MessageList 拼盘，不是单一 Turn 骨架",
    land: "gap",
  },
  {
    bui: "08 Prompt Bar",
    steal: "@来源 / 命令 / 模型条的壳位",
    leave: "把 PromptList 做成 composer",
    sikao: "输入条 + 壳",
    role: "Composer 在回合底。Dock/⌘J 归 SIK-1072。",
    product: "AiPanel composer 在；Prompt Bar 形态未按 1072 契约",
    land: "partial",
  },
  {
    bui: "09 Recommendation Card",
    steal: "主建议 + 推荐度 + 其他方案格子",
    leave: "柔黄主钮、挡住下一问",
    sikao: "Recommendation · 落定提案",
    role: "不挡正文。查看笔记炭黑。",
    product: "HitlCards Recommendation；计划卡仍走 ProposalCard 适配",
    land: "partial",
  },
  {
    bui: "10 Context Cards",
    steal: "检索块 + 来源脚",
    leave: "网页 favicon 引用条塞进气泡",
    sikao: "引用 + 你记过 Context Card + 结果页扫卡",
    role: "对话里 [n] 旁浮出；脚印才展开列表。结果页不进回合。",
    product: "来源归 SIK-1070，回合内未按契约",
    land: "gap",
  },
  {
    bui: "11 Diff Table",
    steal: "无。不进回合。",
    leave: "整张 diff 当对话皮肤",
    sikao: "Filter Table 仅工具流落定对照",
    role: "落定控件，不是内容块。",
    product: "无 Filter Table 产品面",
    land: "gap",
  },
  {
    bui: "12 Records Table",
    steal: "无。CRM 表不进流。",
    leave: "记录网格当 AI 列",
    sikao: "—",
    role: "不实现。",
    product: "n/a",
    land: "spec",
  },
];

/** 回合渲染器要能开执行，还必须补的契约。缺任一项产品不得当 1068 Done。 */
export const LANDING_GAPS: ReadonlyArray<{
  id: string;
  need: string;
  why: string;
}> = [
  {
    id: "turn-tree",
    need: "单一 Turn 树：用户泡 → 回合态 → 专家栈|Approval → 正文 → 多步骤 → 控件 → 脚印",
    why: "现网 InFlight/MessageList/StatusToolsRow 拼盘，执行者无法对照 DensityStream 抄",
  },
  {
    id: "event-map",
    need: "SSE/内容块对照表：phase/delta/tool/cancelled → 思考块/工具调用/正文/回合态",
    why: "没有事件映射，视觉标本不能接 AgentRuntime",
  },
  {
    id: "dots-px",
    need: "产品 Dots 与原型同几何：4px / gap 2px / 16×16",
    why: "产品仍 1.5px/15，落地即歪",
  },
  {
    id: "rail-fold",
    need: "活时专家栈、出字收起、正文后同一行折叠出多步骤",
    why: "产品芯片行常驻；无 OpRow 折叠",
  },
  {
    id: "copy-1066",
    need: "1066.v4 文案锁进回合态/HITL，不用 BUI 英文",
    why: "落地会混 Churning / Worked for",
  },
  {
    id: "hosts",
    need: "Home dock / Teach / Essay / Guided / Tutor / Review 共用同一 Turn renderer",
    why: "只换 StatusBadge 不够，各宿主仍自绘过程条",
  },
  {
    id: "vc-sync",
    need: "1067 契约改写专家栈/多步骤，废止「一出正文芯片消失」",
    why: "产品执行仍会按旧 1067 删芯片",
  },
];

/**
 * Dots 投影 1040 DurableAttachmentState + ExecutionTerminal。
 * 几何：4px 点、gap 2px、槽 16×16 整数格；色相按终态/中断/失败分。
 * 不新造 run 机，不把点阵画上 DurableRunStatusBar。
 */
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
    from: "provider_unknown / failed / stop_failed",
    take: "err X · 不当成功、不当普通停止",
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
  { state: "provider_unknown / failed / stop_failed", user: "条「生成未确认」", dots: "error · err X" },
  { state: "completed", user: "「已完成」", dots: "done · ok 绿" },
  { state: "auth_required / status_reconcile", user: "只读条", dots: "recover · 不另造" },
];

export const ENTRIES = [
  { id: "scene", title: "SceneAiChip", size: "32 / 36 / 44", note: "场景顶栏。icon-only，无可见「AI」。" },
  { id: "seed", title: "Seed / welcome", size: "avatar 36+", note: "欢迎态身份标。pencil 跟正文色，spark 走 AI 蓝。" },
  { id: "context", title: "Context entry", size: "32 sunken", note: "上下文条上的入口。展开态 ai-soft 洗。" },
  { id: "rail", title: "Rail ⌘J", size: "32 sunken", note: "全局轨。与 dock 开合同步 aria-expanded。" },
  { id: "top", title: "TopBar", size: "36 / 44 touch", note: "移动顶栏。触控地板 44，半径跟着上台阶。" },
] as const;

export const BANNED = [
  { title: "Drive / Orbit / 扫光", body: "SIK-1045 只偷 Beautiful UI 的 3×3 点阵。另外三种 loader 不进会话。" },
  { title: "生产打字机冻结", body: "现网 StreamingProse 出字节奏 / caret 形状 / 字号不改。规格 App 的 blink caret 只是占位，落地沿用现网，禁止另做一套打字机。" },
  { title: "第六族控件", body: "GuidedSelectionChips、筛选 Chip、题型 tag 不进 AI 流。TurnStatus 是回合态，不是新 pill。" },
  { title: "按场景换肤", body: "四密共用同一套 token。密度改 chrome 数量，不改色相。暗色只开 token 换肤。" },
  { title: "空 0s 处理行", body: "短答无过程时零 chrome。elapsed 在 >0 才出现。" },
  { title: "Linear 发丝边", body: "统一无描边。面用填色和凹陷区分，不靠 1px 发丝。" },
] as const;

export const RULES: ReadonlyArray<{ kind: "do" | "dont"; title: string; body: string }> = [
  {
    kind: "do",
    title: "答案是主角",
    body: "Dots 状态行自己一行。工作时专家栈另起一行只露 lucide，新的把旧的顶走。正文结束后芯片收进状态行折叠，点开才是多步骤（思考/检索/读/写），不对每步打勾。短答无过程则零折叠。答案通栏 14/1.75，无框。对话里点 [n] 在角标旁浮出那一张。脚印贴在方法卡 / 你来 / 门之后。",
  },
  {
    kind: "dont",
    title: "用户气泡不要品牌黄",
    body: "浅灰软泡，尾半径 12/12/5/12。无描边。黄已退役。",
  },
  {
    kind: "do",
    title: "工具完成退灰",
    body: "操作列 lucide 退成 text-meta。不对每步打绿勾。绿给完成点阵和状态行「已完成」。",
  },
  {
    kind: "dont",
    title: "审批不要铺满奶黄",
    body: "门卡走 Beautiful UI 04：活时一问、选项行、点阵页脚、发送。Agent 停住等点。落定后的「要不要写」走推荐卡，不把审批卡挂在答案下。导航 CTA 走炭黑。",
  },
  {
    kind: "do",
    title: "来源要诚实",
    body: "只收本轮跑过的工具和正文笔记。对话学 Claude：正文先、点 [n] 在角标旁浮出那一张。「你记过」是把已有笔记带出来的 Context Card，点开看 chunk。列表只出现在整轮之后。结果页才文前扫卡。",
  },
  {
    kind: "dont",
    title: "入口不要描边蓝 pill",
    body: "Scene / Seed / Context / Rail / TopBar 全是 sunken AiMark。无可见「AI」字。",
  },
  {
    kind: "do",
    title: "暗色只换 token",
    body: "近黑平面、单一 AI 蓝、无描边。不按密度另造暗色皮肤。",
  },
  {
    kind: "dont",
    title: "不要第 11 号字",
    body: "tiny = 11px 最小合法。CJK 禁止斜体。点阵 4px，gap 2px，槽 16×16（4×3+2×2 整数像素，行列对称）。",
  },
];

export const TOKENS = [
  { name: "--color-ai", hex: "#4A8CF0", role: "唯一强调 · caret · 回执 · spark · 工具/生成点阵" },
  { name: "--color-ai-strong", hex: "#246BD1", role: "白底上的 AI 字" },
  { name: "--color-ai-soft", hex: "14% mix", role: "入口展开洗、回执底" },
  { name: "--ai-user-bubble-bg", hex: "10% ink", role: "Claude 式浅用户泡" },
  { name: "--color-kind-action", hex: "#A87F1C", role: "操作标签暖褐" },
  { name: "--color-kind-suggest", hex: "#6E7B8A", role: "建议标签冷灰蓝" },
  { name: "--color-approval-bg", hex: "#FBF4D0", role: "确认门奶油" },
  { name: "--color-btn-soft-bg", hex: "#EFDFA0", role: "柔黄主钮 · 只审批" },
  { name: "--color-state-ok", hex: "#3E9068", role: "完成点阵 + 整轮 done 绿" },
  { name: "--color-state-warn", hex: "#BB7A33", role: "续看 / 正在停止 点阵" },
  { name: "--color-state-err", hex: "#D25858", role: "未确认 X / StatusTag risk" },
  { name: "--color-brand-primary", hex: "#FFD200", role: "产品黄 · 不进流" },
  { name: "--color-fill-strong", hex: "#2F333A", role: "导航 CTA 炭填" },
] as const;

export const STEALS = [
  {
    id: "dots",
    from: "Beautiful UI · Dots",
    take: "3×3 点阵、4px、opacity 波",
    leave: "Drive / Orbit / 扫光",
  },
  {
    id: "claude",
    from: "Claude 对话面",
    take: "浅用户泡、正文无框、点角标在旁边浮出引用、脚印在整轮末。正文后的多步骤折叠参考 Grok / Beautiful UI thinking traces。",
    leave: "侧栏人设、附件卡皮肤",
  },
  {
    id: "linear",
    from: "Linear.app",
    take: "单一强调色、近黑平面",
    leave: "发丝边、产品紫、重投影",
  },
  {
    id: "pplx",
    from: "Perplexity + Beautiful UI Context Cards",
    take: "文前扫卡只给结果页。对话里的「你记过」是一张可点开的 Context Card，不是角标列表。",
    leave: "网页搜索引用外观、favicon 域名",
  },
  {
    id: "hitl",
    from: "Beautiful UI · Approval Card",
    take: "活时一问、选项行、点阵页脚。提交后绿勾回执。落定提案走推荐卡。",
    leave: "铺满奶黄、把审批做成普通按钮条、落定后再挂一张审批",
  },
] as const;

export const HITL = [
  { id: "suggest", title: "只提案", body: "推荐卡、方法卡。没有副作用，不挡回合。" },
  { id: "confirm", title: "先问再写", body: "审批卡只出现在活时。Agent 停住等点。落定后的选择用推荐卡。" },
  { id: "execute", title: "已授权才跑", body: "蓝 pill 回执。进度可见，不默默后台。" },
] as const;

export const SAP_SOURCES = [
  {
    n: 1,
    title: "近义干扰表",
    kind: "工具",
    snippet: "「遏制」管已起的势头，语气偏硬。",
    body: "「遏制」的对象通常是已经起来的势头，语气偏硬，常配「蔓延」「势头」「通胀」。空里要的是还没成形的苗头，用「抑制」更贴搭配。近义干扰常拿一个「对、但搭配不对」的词来抢注意力，先看宾语再看语气硬度。",
  },
  {
    n: 2,
    title: "言语 · 逻辑填空",
    kind: "笔记",
    snippet: "记忆钩子：遏制势头 · 抑制萌芽。",
    body: "逻辑填空先看宾语，再看语气硬度。记忆钩子：遏制势头 · 抑制萌芽。本周填空错 3 道，都栽在「势头 / 苗头」搭配上，不要只记近义本身。对照卷面时把宾语圈出来，再选软硬。",
  },
  {
    n: 3,
    title: "今日计划",
    kind: "笔记",
    snippet: "本周填空错 3 道，都栽在搭配。",
    body: "把「遏制 / 抑制」这组近义写进今日计划：先做 2 道宾语是萌芽或苗头的旧题，再对照近义干扰表。错因记在搭配，不记在词义。完成后再用「你来」空走一遍。",
  },
] as const;

export const LOOKBACK_KICKER = "你记过" as const;

export const LOOKBACK_SOURCE = {
  n: 1,
  title: "近义干扰 · 势头/苗头",
  kind: "笔记",
  snippet: "记忆钩子：遏制势头 · 抑制萌芽。本周填空错 3 道，都栽在搭配。",
  body: "逻辑填空先看宾语，再看语气硬度。记忆钩子：遏制势头 · 抑制萌芽。本周填空错 3 道，都栽在「势头 / 苗头」搭配上，不要只记近义本身。对照卷面时把宾语圈出来，再选软硬。",
} as const;

export const EXPERTS = [
  { id: "e1", name: "搭配", op: "thought", text: "宾语是「萌芽」，不是已经起来的势头。" },
  { id: "e2", name: "近义", op: "search", text: "检索遏制 / 遏止 / 抑制。" },
  { id: "e3", name: "卷面", op: "read", text: "对照言语逻辑填空近义表。" },
  { id: "e4", name: "综合", op: "tool", text: "抑制萌芽更贴；遏制语气偏硬。" },
] as const;

export const BUI_WIDGETS = [
  {
    id: "method",
    title: "方法卡 / 你来",
    when: "讲题流 · 落定",
    vs: "留着。推荐卡不会教方法，筛选表不会让你选空。",
    scene: "先看宾语，再看语气硬度。下一空自己选。",
  },
  {
    id: "approve",
    title: "Approval Card",
    when: "门卡流 · 活时",
    vs: "只在 Agent 还没写完、必须先问时出现。落定后再挂一张就没意义。",
    scene: "写入笔记前先确认。不点，回合不往下走。",
  },
  {
    id: "rec",
    title: "Recommendation Card",
    when: "门卡流 · 落定",
    vs: "替换落定后的审批卡。主建议带推荐度，其他方案可展开成格子。不挡下一问。",
    scene: "要我把这组近义写进今日计划吗？推荐度 5 · 接受。",
  },
  {
    id: "insight",
    title: "Insight Cards",
    when: "工具流 · 落定",
    vs: "比方法卡更适合量化发现。方法卡讲「怎么做」，发现卡讲「你错在哪」。",
    scene: "本周填空错 3 道，都栽在搭配。遏制 −2 · 抑制 0 · 遏止 −1。",
  },
  {
    id: "filter",
    title: "Filter Table",
    when: "工具流 · 落定",
    vs: "比 ActionChip 竖叠更适合对照。芯片重排行，不当导航。",
    scene: "近义错题表：全部 / 搭配 / 订正中 / 未做。",
  },
] as const;

export const FILTER_ROWS = [
  { name: "遏制 / 抑制萌芽", topic: "言语填空", status: "已订正", cause: "搭配" },
  { name: "蔓延 / 扩散", topic: "言语填空", status: "未做", cause: "近义" },
  { name: "遏止 / 阻止", topic: "言语填空", status: "已订正", cause: "语气" },
  { name: "苗头 / 势头", topic: "逻辑填空", status: "订正中", cause: "搭配" },
  { name: "萌芽 / 端倪", topic: "逻辑填空", status: "已订正", cause: "搭配" },
] as const;

export const INSIGHTS = [
  {
    kicker: "错因",
    title: "本周逻辑填空错 3 道，都栽在「势头 / 苗头」搭配。",
    delta: "搭配 −3",
    tone: "risk" as const,
    rows: [
      { name: "遏制", delta: "−2" },
      { name: "抑制", delta: "0" },
      { name: "遏止", delta: "−1" },
    ],
    ask: "要不要对照近义干扰表？",
  },
  {
    kicker: "卷况",
    title: "言语正确率 61%，低于判断 78%。填空是唯一掉队的模块。",
    delta: "填空 61%",
    tone: "warn" as const,
    rows: [
      { name: "判断", delta: "78%" },
      { name: "言语", delta: "61%" },
      { name: "资料", delta: "74%" },
    ],
    ask: "先补填空还是继续混练？",
  },
  {
    kicker: "计划",
    title: "今日计划还差 2 道宾语是「萌芽 / 苗头」的旧题。",
    delta: "还差 2 道",
    tone: "ai" as const,
    rows: [
      { name: "已做", delta: "1" },
      { name: "待做", delta: "2" },
      { name: "对照表", delta: "开" },
    ],
    ask: "现在抽 2 道旧题？",
  },
] as const;
