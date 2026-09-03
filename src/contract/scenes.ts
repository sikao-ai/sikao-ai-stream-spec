/**
 * Scene fixtures catalog: hosts, densities, exception states.
 * These are product-state labels the prototype can project — not a second runtime.
 */

import type { DensityId } from "./turn";

export const SCENE_CONTRACT_VERSION = "1067.scene.v1" as const;

export const SURFACES = {
  "web-desktop": "changed",
  "web-mobile": "changed",
  admin: "out-of-scope",
  ios: "out-of-scope",
  themes: "light + dark 都是验收主题",
  viewports: "1440×900 与 390×844 进入状态、几何、命中与截图矩阵",
} as const;

export const WORD_INHERITANCE = [
  {
    from: "SIK-741 Turn 壳",
    keep: "槽位名：用户泡 / Dots 状态行 / 散文 / 脚印。不改槽位拓扑。",
  },
  {
    from: "SIK-1031 / 1040 运行时",
    keep: "DurableAttachmentState + ExecutionTerminal。本规范只投影，不另造 run 机。",
  },
  {
    from: "SIK-1032 Typed Answer",
    keep: "生成契约：Direct / Decision / Structured、validate-before-display、「整理答案」。不继承 1032 原型可见 chrome。",
  },
  {
    from: "SIK-1037 ProgressAtom",
    keep: "长任务例外。闭集 phase + elapsed。本规范不重画、不改文案。",
  },
  {
    from: "SIK-1045 Dots",
    keep: "3×3 几何。色相按 1040 终态分。",
  },
  {
    from: "现网 StreamingProse",
    keep: "出字节奏 / caret / 字号冻结。词表不收录打字机文案。",
  },
] as const;

export const WORD_SUPERSESSION = [
  { old: "可回看", now: "你记过", scope: "落定笔记 kicker。不是功能名。" },
  { old: "高信心", now: "推荐度 1–5", scope: "推荐卡。禁止信心措辞。" },
  { old: "你来", now: "到你了", scope: "KindTag.input。标题仍「下一空自己选」，禁止把「到你了」当标题。" },
  { old: "思考了 Ns", now: "时间在行右，不插点阵和已完成中间", scope: "回合态。" },
  { old: "回答已验证", now: "禁止 pill。正文出现即验证成功", scope: "1032 chrome。" },
  { old: "整理答案（当第四形态）", now: "正交校验态，不是形态", scope: "1032。" },
  { old: "处理了 0s", now: "短答无过程则零 chrome", scope: "回合态。elapsed 在 >0 才出现。" },
] as const;

export const WAVE_PLAN = [
  {
    wave: "W0",
    ticket: "SIK-1067",
    do: "本文 + 规格 App 矩阵页 + H11 1440/390 浅/深静帧。词表仍归 SIK-1066。",
    dont: "不改 apps/web。不把规格 App 当生产代码合入。",
  },
  {
    wave: "W1",
    ticket: "SIK-1067 子票（契约入仓后开）",
    do: "统一 Turn primitives 直接走 canonical renderer：Dots 完成态、PromptList、ActionChip、StatusTag、活时审批、落定推荐、你记过。随正常 Web 部署直接上线。",
    dont: "不改 ProgressAtom。不改 StreamingProse。不保留旧 renderer 或双皮肤；宿主业务 capability flag 不控制 chrome 版本。",
  },
  {
    wave: "W2+",
    ticket: "每宿主一票",
    do: "Consult dock / Cockpit / Teach / Guided / Notes / Plan 各自对照场景矩阵验收。mobile 390 必过。",
    dont: "embedding / eval / worker 禁止套本规范。",
  },
] as const;

export const HOST_MOUNT: ReadonlyArray<{
  host: string;
  density: string;
  extra: string;
}> = [
  { host: "Home dock", density: "short | tool | gate", extra: "默认挂 DensityStream；壳归 1072" },
  { host: "Teach / Guided", density: "teach", extra: "加 stem；方法卡/到你了走 widgets，默认折叠" },
  { host: "Essay", density: "tool | teach", extra: "同一 Turn，禁止自绘 StatusBadge/过程条" },
  { host: "Tutor", density: "teach", extra: "诊断 ActionChip + 方法/到你了（默认折叠）+ 脚印" },
  { host: "Review Path A", density: "teach", extra: "SIK-1050：桌面 Modal+同一 dock；stem 挂资料题教具；Dots「正在想」。390 只留桌面门" },
];

/** SIK-1050 Path A。原型只画拓扑，不造第二套 AgentRuntime。 */
export const PATH_A = {
  ticket: "SIK-1050",
  desktop:
    "中心 Path A Modal（题面/材料/解析）+ 右侧同一 AIdock 实例。Rail/背景 inert。overlay right = occupied dock width。stem 挂资料题教具表，不是第六族 pill。等待态 Dots「正在想」。",
  mobile:
    "390 Review AI Sheet 只显示 AiMark +「复盘教师 Agent 请在桌面端使用」+「移动端完整适配后续提供」。不挂 Host、会话、PromptList、composer、教具，不发 /runs。",
  dock: "从 1.1 dock-open 打开 Path A 时不得 close/open、不得重挂载 conversation/feed/width。",
  locator: "正在看 · {题目短标题} · 解析/考点/笔记",
} as const;

export const HOST_FIVE: ReadonlyArray<{
  id: string;
  host: string;
  lock: string;
}> = [
  {
    id: "review-path-a",
    host: "复盘教师 Path A",
    lock: "桌面 Modal + dock；stem 挂资料题教具；Dots「正在想」。390 只留「请在桌面端使用」。",
  },
  {
    id: "tutor",
    host: "Tutor",
    lock: "诊断 ActionChip、方法卡、到你了、脚印。方法/到你了默认折叠。",
  },
  {
    id: "guided",
    host: "Guided 申论",
    lock: "材料 | 方向 | 对话。只有对话是 Turn。材料/方向不是回合槽。",
  },
  {
    id: "teach-aid",
    host: "题型教具",
    lock: "表/格在 stem。禁止第六族 pill。renderer 不可用时 typed error，不留空白宿主。",
  },
  {
    id: "cause-act1",
    host: "问诊错因 幕1",
    lock: "回放 = 专家栈、无正文。回合态「正在检索」。不是气泡+数据 chips 当第二套皮。",
  },
];

export const EXCEPTION_STATES: ReadonlyArray<{
  id: string;
  phase: "halt" | "stop" | "error" | "recover";
  from: string;
  draw: string;
  density: DensityId;
}> = [
  {
    id: "stop_pending",
    phase: "halt",
    from: "1040 stop_pending",
    draw: "回合态 halt · warn 冻帧。不是 cancelled。停止钮 disabled。",
    density: "tool",
  },
  {
    id: "cancelled",
    phase: "stop",
    from: "1040 cancelled",
    draw: "回合态 stop。已出字保留。多步骤可折。脚印仍出。",
    density: "tool",
  },
  {
    id: "provider_unknown",
    phase: "error",
    from: "1040 provider_unknown / failed / stop_failed",
    draw: "回合态 error + ErrorBand。不当成功、不当普通停止。已出字只读。",
    density: "tool",
  },
  {
    id: "replay_gap",
    phase: "recover",
    from: "1040 recovering / exhausted / replay_gap",
    draw: "回合态 recover。按 seq 重放，不丢字。禁止重开第二 run。",
    density: "tool",
  },
];

export const SCENE_MATRIX = [
  {
    family: "Consult",
    scene: "全局 AI dock",
    density: "short / tool",
    families: "TurnStatus · EntityChip · PromptList",
    entry: "Rail ⌘J / SceneAiChip",
    source: "对话 [n] 浮出",
    runtime: "1031/1040 对话机",
    host: "desktop dock · mobile 全屏",
  },
  {
    family: "Consult",
    scene: "复盘 Cockpit 右栏",
    density: "tool",
    families: "TurnStatus · Insight · Filter · EntityChip",
    entry: "Cockpit 内嵌，无独立 Rail",
    source: "对话 [n] + 你记过",
    runtime: "1031/1040 对话机",
    host: "desktop 右栏 · mobile sheet",
  },
  {
    family: "Consult",
    scene: "Answer Session dock",
    density: "short / tool",
    families: "TurnStatus · PromptList",
    entry: "ExamShell 内嵌 SceneAiChip",
    source: "对话 [n]",
    runtime: "1031/1040 对话机",
    host: "desktop dock · mobile 底栏上叠",
  },
  {
    family: "Consult",
    scene: "笔记检索 / 整理",
    density: "short / gate",
    families: "TurnStatus · Rec · Approval · EntityChip",
    entry: "Notes 内嵌",
    source: "你记过 + [n]",
    runtime: "1031/1040；写库走门卡",
    host: "NoteEditor / peek",
  },
  {
    family: "Teach / Guided",
    scene: "行测讲题 / Tutor",
    density: "teach",
    families: "TurnStatus · ActionChip 诊断 · KindTag 方法/到你了（默认折叠）· 脚印",
    entry: "Tutor 顶栏 SceneAiChip",
    source: "[n] + 你记过",
    runtime: "1031/1040 对话机",
    host: "desktop 主列 · mobile 全屏",
  },
  {
    family: "Teach / Guided",
    scene: "申论引导",
    density: "teach",
    families: "TurnStatus · 方法 · 到你了（默认折叠）",
    entry: "Guided 顶栏",
    source: "[n] + 你记过",
    runtime: "1031/1040 对话机",
    host: "材料 | 方向 | 对话；只有对话是 Turn",
  },
  {
    family: "Review",
    scene: "复盘教师 Path A",
    density: "teach",
    families: "TurnStatus wait · stem 题型教具表",
    entry: "AIdock / Modal header AI讲解",
    source: "题面 renderer；教具在 stem",
    runtime: "SIK-1050 Path A + 1031/1040",
    host: "desktop Modal+dock · 390 桌面门",
  },
  {
    family: "Consult",
    scene: "问诊错因 幕1 回放",
    density: "tool",
    families: "TurnStatus tool · 专家栈 · 无正文",
    entry: "复盘 dock",
    source: "本轮工具 chunk，不出散文",
    runtime: "幕1 非 LLM 回放，投影成专家栈",
    host: "desktop dock · 禁止第二套 chips 皮",
  },
  {
    family: "Teach / Guided",
    scene: "answer hint / continue",
    density: "short",
    families: "TurnStatus · PromptList",
    entry: "题内 hint 入口",
    source: "无，或单条 [n]",
    runtime: "1031/1040；短答零过程则零 chrome",
    host: "作答壳内嵌",
  },
  {
    family: "Teach / Guided",
    scene: "essay drill",
    density: "teach",
    families: "TurnStatus · 方法 · 你来",
    entry: "Drill 顶栏",
    source: "[n]",
    runtime: "1031/1040 对话机",
    host: "desktop 主列 · mobile 全屏",
  },
  {
    family: "Structured",
    scene: "typed answer Direct/Decision/Structured",
    density: "short（形态在正文内）",
    families: "TurnStatus · EntityChip；形态不是 chrome",
    entry: "同 Consult",
    source: "renderer 投影 [n] / EntityChip",
    runtime: "1032 validating → verified；失败 typed-error",
    host: "同 Consult 宿主",
  },
  {
    family: "Structured",
    scene: "申论批改",
    density: "例外 · ProgressAtom",
    families: "不进四密流",
    entry: "grading 既有 CTA",
    source: "不走对话来源卡",
    runtime: "1037 ProgressAtom",
    host: "EssayGradingResult 三 chrome",
  },
  {
    family: "Structured",
    scene: "出题 / 举一反三",
    density: "tool",
    families: "TurnStatus · PromptList · Filter（若列表）",
    entry: "练习中心 / dock",
    source: "[n]",
    runtime: "1031/1040 对话机",
    host: "desktop dock · mobile 全屏",
  },
  {
    family: "Structured",
    scene: "错因分析",
    density: "tool",
    families: "Insight · Filter · TurnStatus",
    entry: "复盘内嵌",
    source: "[n] + 你记过",
    runtime: "1031/1040 对话机",
    host: "Cockpit / dock",
  },
  {
    family: "Structured",
    scene: "整卷诊断",
    density: "例外 · ProgressAtom",
    families: "不进四密流",
    entry: "Review dock CTA",
    source: "不走对话来源卡",
    runtime: "1037 ProgressAtom",
    host: "Review cockpit / dock",
  },
  {
    family: "Notes",
    scene: "summary / polish",
    density: "例外 · ProgressAtom 行 + 既有 preview 卡",
    families: "不新造流内族",
    entry: "Notes 既有 CTA",
    source: "笔记本体，不是对话 [n]",
    runtime: "1037 Notes 双宿主",
    host: "NoteEditor + NoteDetailColumn",
  },
  {
    family: "Notes",
    scene: "weekly review",
    density: "例外 · ProgressAtom",
    families: "不进四密流",
    entry: "Notebook 墙顶 board",
    source: "生成笔记",
    runtime: "1037 weekly board",
    host: "Notebook my-scope",
  },
  {
    family: "Notes",
    scene: "标题 / 标签 / 关联",
    density: "short",
    families: "TurnStatus · EntityChip",
    entry: "Notes 内嵌",
    source: "你记过",
    runtime: "1031 短答",
    host: "NoteEditor",
  },
  {
    family: "Plan",
    scene: "recommendation / 写入计划",
    density: "gate",
    families: "活时 Approval · 落定 Rec",
    entry: "计划 / dock",
    source: "你记过",
    runtime: "1031 门卡真停",
    host: "desktop dock · mobile 全屏",
  },
  {
    family: "Plan",
    scene: "手写识别",
    density: "tool（识别过程）/ short（短结论）",
    families: "TurnStatus",
    entry: "手写入口",
    source: "本轮工具 chunk",
    runtime: "1031/1040",
    host: "练习壳内嵌",
  },
  {
    family: "Exclude",
    scene: "embedding / eval / 离线评分 worker",
    density: "无 UI",
    families: "—",
    entry: "—",
    source: "—",
    runtime: "禁止套本规范",
    host: "非用户可见",
  },
] as const;

export const SHAPE_MATRIX = [
  {
    shape: "Direct",
    density: "short",
    validating: "TurnStatus「整理答案」，正文不可见",
    verified: "通栏散文，无形态 chrome、无左轨、无「回答已验证」pill",
    typedError: "ErrorBand「这一轮没有写完」",
    missing: "短答直说缺什么，不升 detailed",
    cold: "折叠成一行，点开回放正文",
  },
  {
    shape: "Decision",
    density: "short",
    validating: "同 Direct",
    verified: "renderer 顶层「下一步」在正文内，不是推荐卡",
    typedError: "同 Direct",
    missing: "同 Direct",
    cold: "同 Direct",
  },
  {
    shape: "Decision",
    density: "gate",
    validating: "门卡活时仍先审批；不进入整理答案直到门打开",
    verified: "落定用推荐卡，不把 Decision Markdown 再画一张审批",
    typedError: "门失败走审批失败态，不走 typed-error 正文",
    missing: "不升 gate",
    cold: "回执一行，可再看一次",
  },
  {
    shape: "Structured",
    density: "tool",
    validating: "工具可流；正文仍要等校验完",
    verified: "summary + renderer 拥有的 ## 节；可后挂 Insight/Filter",
    typedError: "ErrorBand；已跑工具日志可折看",
    missing: "safe-missing-context 压成 Direct×short",
    cold: "节默认可折",
  },
  {
    shape: "整理答案",
    density: "正交状态，不是第四形态",
    validating: "任何密度在校验完成前都走这一态",
    verified: "—",
    typedError: "—",
    missing: "—",
    cold: "历史里不出现「整理答案」进行中",
  },
] as const;

export const SHAPE_TABS = {
  product: "不可见。answer_shape 由服务端解析，用户不能切形态。",
  proto: "规格 App / 1032 旧原型顶部形态 tabs 只是调试器。禁止进生产。",
  rail: "禁止左轨。线性无轨，答案是主角。",
  pill: "禁止「回答已验证」状态 pill 当 chrome。验证成功=正文出现。",
} as const;

export const RUNTIME_MATRIX = [
  {
    id: "wait",
    from: "1031 attached 等待 / silent<500ms",
    visual: "Dots ink 波",
    copy: "正在想 / 场景句",
    action: "可停止",
    keep: "无正文",
    lane: "对话",
  },
  {
    id: "tool",
    from: "1031 attached + live tools",
    visual: "Dots AI 蓝 + 图标 chips",
    copy: "正在检索",
    action: "可停止",
    keep: "无正文",
    lane: "对话",
  },
  {
    id: "stream",
    from: "1031 已出 token",
    visual: "StreamingProse 现网打字机（冻结）",
    copy: "生成中",
    action: "可停止",
    keep: "已出字保留",
    lane: "对话",
  },
  {
    id: "validating",
    from: "1032 validate-before-display",
    visual: "Dots +「整理答案」；禁止出正文",
    copy: "整理答案",
    action: "可停止 / 取消",
    keep: "无正文；工具日志可折",
    lane: "对话",
  },
  {
    id: "auth_required",
    from: "1031",
    visual: "只读条，Dots recover",
    copy: "需要登录后继续",
    action: "去登录；禁止当失败重试",
    keep: "已出字只读",
    lane: "对话",
  },
  {
    id: "status_reconcile",
    from: "1031",
    visual: "只读条",
    copy: "正在核对状态",
    action: "无 CTA",
    keep: "不闪 idle",
    lane: "对话",
  },
  {
    id: "detached",
    from: "1031",
    visual: "无 Dots",
    copy: "无",
    action: "禁止本地伪造进度",
    keep: "不渲染进行中壳",
    lane: "对话",
  },
  {
    id: "recover",
    from: "1040 recovering / exhausted / replay_gap",
    visual: "Dots warn + DurableRunStatusBar",
    copy: "恢复中",
    action: "可停止；禁止重开第二 run",
    keep: "按 seq 重放，不丢字",
    lane: "对话",
  },
  {
    id: "halt",
    from: "1040 stop_pending",
    visual: "Dots warn 冻帧",
    copy: "正在停止",
    action: "停止钮 disabled",
    keep: "不是 cancelled",
    lane: "对话",
  },
  {
    id: "stop",
    from: "1040 cancelled",
    visual: "Dots muted + 气泡",
    copy: "已停止生成",
    action: "可重新生成",
    keep: "已出字保留",
    lane: "对话",
  },
  {
    id: "error",
    from: "1040 provider_unknown / failed / stop_failed",
    visual: "Dots err X + ErrorBand",
    copy: "生成未确认 / 未能停止",
    action: "重试；provider_unknown 不当成功",
    keep: "已出字只读",
    lane: "对话",
  },
  {
    id: "typed-error",
    from: "1032 TypedAnswerError",
    visual: "ErrorBand",
    copy: "这一轮没有写完",
    action: "重试；禁止静默 fallback",
    keep: "无假正文",
    lane: "对话",
  },
  {
    id: "done",
    from: "1040 completed",
    visual: "Dots 绿十字 +「已完成」",
    copy: "已完成",
    action: "脚印",
    keep: "正文 + 落定控件",
    lane: "对话",
  },
  {
    id: "progress-*",
    from: "1037 accepted→queued→phase→heartbeat→artifact→terminal",
    visual: "ProgressAtom（不改）",
    copy: "闭集 phase + elapsed",
    action: "停止 / 重试 / 查看结果",
    keep: "无伪百分比、无 ETA",
    lane: "长任务例外",
  },
] as const;

export const HITL_APPROVE_STATES = [
  { id: "idle", see: "满宽竖列，无选中", action: "点一项", block: "是" },
  { id: "picked", see: "该项 aria-pressed，480ms 内可改", action: "等待自动提交", block: "是" },
  { id: "submit", see: "选项 disabled + 脚「提交中」", action: "不可点", block: "是" },
  { id: "ok", see: "绿回执「已写入计划」", action: "再填一次", block: "否" },
  { id: "skip", see: "回执「已忽略」", action: "再填一次", block: "否" },
  { id: "fail", see: "ErrorBand「没写上」+ 重试", action: "重试原选择，幂等", block: "是" },
  { id: "invalid", see: "自定义空/过长，提交禁用", action: "改输入", block: "是" },
  { id: "reopen", see: "收起后「打开审批」", action: "打开回到 idle/picked", block: "活时仍是" },
] as const;

export const HITL_REC_STATES = [
  { id: "fold", see: "主建议 + 推荐度；其他方案折叠", action: "接受 / 跳过 / 展开", block: "否" },
  { id: "open", see: "2×2 格子带推荐度", action: "点格=接受该项", block: "否" },
  { id: "accepting", see: "主钮 disabled「写入中」", action: "不可重复点", block: "否" },
  { id: "written", see: "回执「已写入计划」", action: "再看一次", block: "否" },
  { id: "skipped", see: "回执「已忽略」", action: "再看一次", block: "否" },
  { id: "fail", see: "「没写上」+ 重试", action: "幂等重试同一项", block: "否" },
] as const;

export const SOURCE_STATES = [
  {
    surface: "对话",
    n: "加载",
    rule: "正文先出。角标在字出齐前不出现。",
  },
  {
    surface: "对话",
    n: "0",
    rule: "无角标、无你记过、脚印无「来源」。",
  },
  {
    surface: "对话",
    n: "1",
    rule: "单角标。点开浮出那一张。窄屏右对齐，不超出 12px 边。",
  },
  {
    surface: "对话",
    n: "N",
    rule: "多角标。同时只开一张。Esc / 再点关闭。键盘左右切。",
  },
  {
    surface: "对话",
    n: "失效",
    rule: "角标仍在，浮出卡写「这条已经没了」，不空白。",
  },
  {
    surface: "对话",
    n: "你记过",
    rule: "落定后 0–2 张已有笔记。不是本轮 [n]。",
  },
  {
    surface: "结果页",
    n: "加载",
    rule: "文前扫卡骨架，不高出合成正文。",
  },
  {
    surface: "结果页",
    n: "0",
    rule: "无扫卡，直接结论。",
  },
  {
    surface: "结果页",
    n: "1 / N",
    rule: "文前工具/笔记扫描卡，默认可折。展开看 chunk。",
  },
  {
    surface: "结果页",
    n: "失效",
    rule: "卡留着，标记「已失效」，不从布局消失。",
  },
] as const;

export const TOOL_RESULT_RULES = [
  { id: "empty", rule: "发现卡「这一轮没有新的错因」；筛选表不渲染。" },
  { id: "one", rule: "发现卡单则，藏翻页。" },
  { id: "page", rule: "发现 N · 上一则/下一则。不一次堆所有卡。" },
  { id: "chain", rule: "多工具只留本轮跑过的；活时 chips 上顶，落定进发现/表/引用。" },
  { id: "part-fail", rule: "成功块照常；失败工具进操作列退灰 + 一条失败句。不当整轮 error。" },
  { id: "filter-0", rule: "表还在，空态「没有这类错题」。芯片不是第六族。" },
  { id: "long", rule: "单元格 ellipsis；点开看全文，不撑破窄屏。" },
  { id: "row", rule: "行不是导航。点行可展开详情，不跳路由。" },
  { id: "mobile", rule: "390：表改成卡片列表，筛芯片横滑。禁止横向整页滚动。" },
] as const;

export const SUPERSESSION = [
  {
    item: "完成态",
    old: "StatusBadge 绿色勾",
    now: "Dots 落阵 +「已完成」",
    verdict: "新原型覆盖",
  },
  {
    item: "PromptList",
    old: "SIK-741 短分割线",
    now: "全宽无描边行",
    verdict: "新原型覆盖",
  },
  {
    item: "ActionChip",
    old: "1px 描边 pill",
    now: "填色、无描边、竖叠",
    verdict: "新原型覆盖",
  },
  {
    item: "StatusTag neutral",
    old: "subtle border",
    now: "填色无描边",
    verdict: "新原型覆盖",
  },
  {
    item: "审批黄",
    old: "approval border/line/button-border",
    now: "sunken 卡 + 柔黄只给主钮。旧 token 弃用，不删变量名直到清引用",
    verdict: "新原型覆盖",
  },
  {
    item: "Typed answer chrome",
    old: "1032 原型左轨 + 形态 tabs + 验证 pill",
    now: "线性无轨。形态在正文。tabs 仅调试器",
    verdict: "新原型覆盖 1032 视觉；不改 1032 生成契约",
  },
  {
    item: "长任务",
    old: "1037 ProgressAtom",
    now: "继续 ProgressAtom。本规范不重画",
    verdict: "明确例外",
  },
  {
    item: "打字机",
    old: "现网 StreamingProse",
    now: "冻结",
    verdict: "旧决定保留",
  },
  {
    item: "等待点阵",
    old: "SIK-1045 AiWaitingNode",
    now: "沿用 3×3",
    verdict: "旧决定保留",
  },
  {
    item: "入口 AiMark",
    old: "sunken 无边壳",
    now: "沿用",
    verdict: "旧决定保留",
  },
] as const;
