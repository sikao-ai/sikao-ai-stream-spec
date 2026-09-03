import type { SectionId } from "./app-store";

export type { DensityId } from "@/contract/turn";

export {
  AGENT_STREAM,
  ALIGN_RULES,
  COPY_LOCK,
  DENSITIES,
  DENSITY_CHROME,
  DOT_MACHINE,
  DOT_STATES,
  EVENT_TO_BLOCK,
  FOOTPRINT_ACTIONS,
  LAYOUT_SCALE,
  RENDERER_TERMS,
  TIMING_MATRIX,
  TURN_SLOTS,
  TURN_STATUS,
  TYPE_SCALE,
} from "@/contract/turn";

export { TYPE_STACK, TYPE_SURFACES } from "@/contract/shell";
export { HOST_MOUNT } from "@/contract/scenes";
export {
  EXPERTS,
  FILTER_ROWS,
  INSIGHTS,
  LOOKBACK_SOURCE,
  SAP_SOURCES,
} from "@/player/fixtures/content";

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
  { id: "overview", label: "总览", kicker: "Gallery", group: "guide" },
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
  {
    id: "footprint",
    need: "脚印：有帮助/没帮助/复制/重新生成/回放/来源；点来源才展开；不进多步骤；streaming 不出",
    why: "产品脚印未锁在落定控件之后、来源列表之前",
  },
];

export const GAP_CONTRAST: ReadonlyArray<{
  id: string;
  gap: string;
  prototype: string;
  product: string;
}> = [
  {
    id: "turn-tree",
    gap: "单一 Turn 树",
    prototype: "回合页 TURN_SLOTS + DensityStream data-turn-slot 一行换一行",
    product: "InFlight / MessageList / StatusToolsRow 拼盘",
  },
  {
    id: "event-map",
    gap: "SSE → 内容块",
    prototype: "总览 EVENT_TO_BLOCK；回合页时序表 TIMING_MATRIX",
    product: "decodeConsultStreamItem 未投影到回合块",
  },
  {
    id: "dots-px",
    gap: "Dots 几何",
    prototype: "4px / gap 2px / 槽 16×16 整数格",
    product: "仍 1.5px / 15×15",
  },
  {
    id: "rail-fold",
    gap: "专家栈 / 多步骤时序",
    prototype: "TIMING_MATRIX：live ● expert-rail；streaming —；settled fold step-log",
    product: "芯片行常驻，无多步骤折叠",
  },
  {
    id: "footprint",
    gap: "脚印 footer",
    prototype: "settled|stop 出脚印；来源点击展开；hover 淡入；不进多步骤",
    product: "未按此序锁在控件之后",
  },
  {
    id: "copy-1066",
    gap: "文案",
    prototype: "回合态/HITL 用中文锁定名",
    product: "部分仍 StatusBadge / 英文风险",
  },
  {
    id: "hosts",
    gap: "宿主",
    prototype: "HOST_MOUNT：各宿主只换密度/题面，过程条禁止自绘",
    product: "Teach/Essay/Tutor 只换了 Dots，过程条自绘",
  },
  {
    id: "vc-sync",
    gap: "1067 契约",
    prototype: "与 AGENT_STREAM / 本表一致",
    product: "1067.w0.5 已改文档；代码未跟",
  },
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
    body: "只收本轮跑过的工具和正文笔记。对话学 Claude：正文先、点 [n] 在角标旁浮出那一张。「你记过」是把已有笔记带出来的 Context Card，点开看 chunk。列表只出现在整轮之后。结果页才文前扫卡。原型只画已验证状态与布局；能否进模型上下文由主仓 DTO/ACL 决定。",
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
  {
    kind: "do",
    title: "回合排印锁 token",
    body: "三壳对照色板页：Web 桌面 / Web 移动 / iOS Phone。双轴对齐见 ALIGN_RULES。Web 栈 DM Sans / Inter / Noto SC；iOS SF Pro + PingFang。正文字号只认三壳表。最小 11px。不用 display/h1。",
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

export const LOOKBACK_KICKER = "你记过" as const;

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
    scene: "写入笔记前先确认。先选一下，选完才往下写。",
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
    title: "发现卡",
    when: "工具流 · 落定",
    vs: "方法卡讲怎么做；发现卡讲你错在哪。条形 / 进度 / 曲线 / 对照四种画法。",
    scene: "本周填空 3 道栽在搭配。对照这 3 道。",
  },
  {
    id: "filter",
    title: "Filter Table",
    when: "工具流 · 落定",
    vs: "比 ActionChip 竖叠更适合对照。芯片重排行，不当导航。",
    scene: "近义错题表：全部 / 搭配 / 订正中 / 未做。",
  },
] as const;
