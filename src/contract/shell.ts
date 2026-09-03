/**
 * Shell contract. Prompt Bar and dock chrome (float / rail / web-mobile sheet).
 * Composer is outside the Turn tree (SIK-1072). This file locks layout, not ACL.
 */

export const SHELL_CONTRACT_VERSION = "1072.shell.v1" as const;

export const DOCK_PLACES = ["float", "rail", "ios"] as const;
export type DockPlace = (typeof DOCK_PLACES)[number];

export const DOCK_HOST_IDS = ["overview", "teach", "notes"] as const;
export type DockHostId = (typeof DOCK_HOST_IDS)[number];

export const TYPE_SURFACES: ReadonlyArray<{
  id: "web-desktop" | "web-mobile" | "ios-phone";
  label: string;
  stack: string;
  mono: string;
  note: string;
}> = [
  {
    id: "web-desktop",
    label: "Web 桌面壳",
    stack: "DM Sans → Inter → Noto Sans SC → PingFang SC → YaHei",
    mono: "JetBrains Mono",
    note: ">768。产品 tokens 默认档。",
  },
  {
    id: "web-mobile",
    label: "Web 移动壳",
    stack: "DM Sans → Inter → Noto Sans SC → PingFang SC → YaHei",
    mono: "JetBrains Mono",
    note: "≤768 compact。正文不跟 tokens 把流内正文降到 13。输入视觉 14，text-size-adjust 100%，禁止占位 16。",
  },
  {
    id: "ios-phone",
    label: "iOS Phone",
    stack: "SF Pro Text → PingFang SC → 系统 UI",
    mono: "SF Mono / Menlo",
    note: "H17 功能跟 Web 移动。字栈原生。iPad 未拍板，禁止外推。",
  },
];

export const TYPE_STACK = {
  ui: TYPE_SURFACES[0].stack,
  mono: TYPE_SURFACES[0].mono,
  rules: "CJK 禁止斜体。最小 11px。三壳对照 TYPE_SURFACES。回合不用 display/h1。",
} as const;

export const SHELL_PLACES: ReadonlyArray<{
  id: DockPlace;
  label: string;
  when: string;
  geometry: string;
  note: string;
}> = [
  {
    id: "float",
    label: "浮层",
    when: "桌面默认。Rail ⌘J / SceneAiChip 打开。",
    geometry: "右下浮层，不占主列。会话管理器 popover 贴标题。",
    note: "入口不是 FAB。",
  },
  {
    id: "rail",
    label: "右栏",
    when: "复盘 Cockpit 钉右栏。",
    geometry: "occupied-width 右栏。浮层钮改回 PiP。",
    note: "流内皮仍是同一 Turn，不另起过程条。",
  },
  {
    id: "ios",
    label: "Web 移动 sheet",
    when: "≤720 或显式 iOS 标本。H17：功能 = Web 移动。",
    geometry: "底 sheet + handle。输入行 44，栏内圆钮视觉 32、命中 44。会话列表通栏，行 44。键盘避让。Path A 不挂会话管理器。",
    note: "iPad 未拍板，禁止外推。",
  },
];

/**
 * 390 / iOS 壳单独的尺寸。44 是触控地板，不是把图标画成 44 方块。
 * 视觉胶囊小于命中区（Grok iOS：圆钮约 32，行高 44）。
 */
export const MOBILE_CHROME = {
  hit: 44,
  barRow: 44,
  barType: 14,
  iconVisual: 32,
  sendVisual: 32,
  footVisual: 28,
  radiusBar: 20,
  radiusIcon: 999,
  note: "44 只做命中。+ / 听写 / 发送画 32 圆钮；脚印 lucide 仍 28。禁止 44×44 方块按钮。",
} as const;

export const MOBILE_CHROME_ROWS: ReadonlyArray<{
  slot: string;
  visual: string;
  hit: string;
}> = [
  { slot: "输入行", visual: "44 · 字 14", hit: "行 44" },
  { slot: "栏内圆钮", visual: "32 圆", hit: "格子 44" },
  { slot: "确认主钮", visual: "32 圆", hit: "行 44" },
  { slot: "脚印", visual: "lucide 28", hit: "44 常显" },
];

/**
 * 390 / iOS 壳单独的字号。跟 MOBILE_CHROME 配套，不跟桌面 14/12 混用。
 * 输入 ≥16 只为防 Safari 缩放，不是把壳上所有字都拉到 16。
 */
export const MOBILE_TYPE = {
  composerWeb: "14 / 18 / 400",
  composerIos: "17 / 22 / 400",
  chromeMeta: "13 / 18 / 400",
  numeral: "11 / 14 / 400",
  bodyWeb: "14 / 1.75 / 400",
  bodyIos: "16 / 1.75 / 400",
  min: 11,
  note: "Web 390 输入视觉 14，与桌面同号，text-size-adjust: 100%。壳辅文 13。数字 11。正文仍 14。禁止把占位撑到 16。iOS 原生输入才 17。CJK 禁止斜体。",
} as const;

export const MOBILE_TYPE_ROWS: ReadonlyArray<{
  slot: string;
  web: string;
  ios: string;
}> = [
  { slot: "输入", web: "14 / 18 / 400", ios: "17 / 22 / 400" },
  { slot: "壳辅文", web: "13 / 18 / 400", ios: "13 / 18 / 400" },
  { slot: "数字 / kicker", web: "11 / 14 / 400", ios: "11 / 14 / 400" },
  { slot: "流内正文", web: "14 / 1.75 / 400", ios: "16 / 1.75 / 400" },
];

/**
 * Prompt Bar 壳位。来源槽是布局标本，不是「已接通模型上下文」。
 * 真正能否进上下文由主仓 DTO/ACL 决定。
 */
export const PROMPT_BAR = {
  title: "Prompt Bar",
  ticket: "SIK-1072",
  does: "芯片行在输入格之上：页面 locator（正在看）+ @来源槽。/命令、附件、听写、发送。桌面高 40 圆 12 字 14；移动行 44 字 14，圆钮视觉 32。",
  not: "不当 PromptList。locator 不进 dock 顶栏。不把彩色状态点画成「已接入模型」。不在 canonical 页发模型、假听写、localStorage 会话。",
  tokens: ["@", "/"],
  send: "有正文或附件才可发送。busy 时发送位变停止。",
  dictation: "听写是产品能力。原型 canonical 只留壳位，不注入假字。",
} as const;

export const PROMPT_BAR_SLOTS: ReadonlyArray<{
  id: string;
  name: string;
  when: string;
}> = [
  { id: "plus", name: "添加", when: "打开 @ 菜单或选文件" },
  { id: "field", name: "输入", when: "常驻。移动视觉 14。" },
  { id: "mic", name: "听写壳位", when: "布局；canonical 不写假听写" },
  { id: "send", name: "发送 / 停止", when: "可发送或 busy" },
  { id: "status", name: "状态芯片", when: "正在看 / 未保存 / 正在听。芯片行。不进顶栏。可加新 kind。" },
  { id: "source-slot", name: "来源槽", when: "钉住的布局芯片。不是 ACL 接通" },
  { id: "file-slot", name: "附件槽", when: "本轮文件名" },
  { id: "menu", name: "@ / 命令菜单", when: "token 解析后" },
];

/**
 * Prompt Bar 状态芯片。正在看是第一种。加新状态只在本表加一行，不另造芯片皮。
 * 切 Tab / 开题只改 path。不进 dock 顶栏。
 */
export const BAR_STATUS_IDS = ["looking", "dirty", "listening"] as const;
export type BarStatusId = (typeof BAR_STATUS_IDS)[number];

export const BAR_STATUS: Record<
  BarStatusId,
  {
    id: BarStatusId;
    kicker: string;
    tone: "ai" | "warn" | "ok" | "meta";
    mark: "dots" | "none";
    motion: "breathe" | "none";
    note: string;
  }
> = {
  looking: {
    id: "looking",
    kicker: "正在看",
    tone: "ai",
    mark: "dots",
    motion: "breathe",
    note: "页面 locator。AI 蓝 + 三点呼吸。切面只改 path。",
  },
  dirty: {
    id: "dirty",
    kicker: "未保存",
    tone: "warn",
    mark: "none",
    motion: "none",
    note: "可叠在 looking 的 extra，或单独一颗。不抢 editor focus。",
  },
  listening: {
    id: "listening",
    kicker: "正在听",
    tone: "ai",
    mark: "dots",
    motion: "breathe",
    note: "听写占用。预留 kind。canonical 不灌假字。",
  },
};

export const PAGE_LOCATOR = {
  kicker: BAR_STATUS.looking.kicker,
  where: "Prompt Bar 芯片行最左，输入格之上。不进 dock 顶栏。",
  type: "kicker 11 · 路径 12/500 · 三点 4px 呼吸 · 底 ai-soft",
  update: "snapshot 一变就改。不等模型。",
  not: "顶栏第二行；第六族 pill；可点进路由；跟 @来源画成同一种芯片；为新状态另造皮。",
} as const;

export const PAGE_LOCATOR_STATES: ReadonlyArray<{
  id: "none" | "page" | "path-a" | "dirty" | "page-source" | "listening";
  see: string;
  rule: string;
}> = [
  { id: "none", see: "无芯片，行不占位", rule: "没有页面上下文时不留空高。" },
  { id: "page", see: "正在看 · 总览", rule: "AI 蓝 + 呼吸点。切面只改路径。" },
  { id: "path-a", see: "正在看 · 资料题同比 · 解析", rule: "题短标题 · 解析/考点/笔记。" },
  { id: "dirty", see: "… · 笔记 · 未保存", rule: "warning 色叠在 looking 上。" },
  { id: "page-source", see: "status 左、@来源右，同一行", rule: "两种芯片，不许合成一颗。" },
  { id: "listening", see: "正在听", rule: "同一套 status 芯片。不灌假字。" },
];

export type BarChip =
  | { type: "status"; status: BarStatusId; path?: string; extra?: string }
  | { type: "source"; label: string; invalid?: boolean };

/**
 * Verified source-slot layouts. Color is a layout token, not a live connector.
 */
export const SOURCE_SLOT_LAYOUT: ReadonlyArray<{
  id: "empty" | "pinned" | "invalid";
  see: string;
  rule: string;
}> = [
  { id: "empty", see: "栏内无来源芯片", rule: "无角标、无「来源」脚印。布局：槽不占位。" },
  {
    id: "pinned",
    see: "芯片写 @错题库 / @笔记本，无接通彩点",
    rule: "只证明「栏能钉一条来源槽」。主仓 DTO/ACL 才决定这条是否进模型上下文。",
  },
  {
    id: "invalid",
    see: "芯片留着，标记已失效",
    rule: "不从布局消失。不假装还能检索。",
  },
];

/**
 * Dock 顶栏会话管理器。布局标本，不写 localStorage、不接会话账本。
 * 产品 CRUD / Subject 过滤在主仓（SIK-459 / 1050）。
 */
export const SESSION_MANAGER = {
  title: "会话管理器",
  ticket: "SIK-1072 / 459 / 1050",
  does: "标题整块可点。下拉 popover 贴标题，宽 260、高不超过 280。今天/更早。当前 sunk。新对话置顶。canonical 只画布局。",
  not: "不当 feed 里第二组切换器。不铺满面板。不 portal 出 dock。不用 role=menu。tooltip 不写「会话管理」。390 Path A 不挂。不写 localStorage。",
} as const;

export const SESSION_MANAGER_STATES: ReadonlyArray<{
  id: "closed" | "open" | "empty" | "long" | "ios";
  see: string;
  rule: string;
}> = [
  { id: "closed", see: "AiMark + 标题 + chevron。ellipsis。", rule: "可及名=可见标题。title 属性=全名。" },
  { id: "open", see: "下拉卡贴标题。thread 仍可见。", rule: "Esc / 点外 / 再点标题关闭。同一时刻只开这一层。" },
  { id: "empty", see: "只有「新对话」，不画空插画。", rule: "不写「暂无会话」。" },
  { id: "long", see: "长名 ellipsis。悬停 title 恢复全名。", rule: "禁止 tooltip 写成「会话管理」。" },
  { id: "ios", see: "sheet 通栏。行命中 44。删除常显。", rule: "圆钮视觉 32。Path A 不挂会话管理器。" },
];

export const SESSION_MANAGER_ROWS: ReadonlyArray<{
  slot: string;
  do: string;
  dont: string;
}> = [
  { slot: "入口", do: "AiMark 18 + 标题按钮 flex 1 + chevron 12。", dont: "独立四字「会话管理」钮。" },
  { slot: "面板", do: "absolute 贴标题下，宽 260 max-height 280，shadow-l3。", dont: "铺满面板；portal 出 dock。" },
  { slot: "分组", do: "今天 / 更早。kicker 11。", dont: "按科目把别人的会话混进来。" },
  { slot: "行", do: "标题 12/600 + 相对时间 11。当前 sunk。", dont: "「当前」第六族 pill。" },
  { slot: "新对话", do: "列表顶，Plus 14。", dont: "顶栏再放一颗 +。" },
  { slot: "删除", do: "桌面 hover 显；390 常显，命中 44。", dont: "滑删才露出。" },
  { slot: "390", do: "行 44。字 14。Path A 不挂。", dont: "桌面浮层菜单；把图标画成 44 方块。" },
];

export const SESSION_FIXTURES: ReadonlyArray<{
  id: string;
  title: string;
  when: string;
  group: "今天" | "更早";
  preview: string;
}> = [
  { id: "a", title: "遏制 vs 抑制", when: "刚刚", group: "今天", preview: "「遏制」管已起的势头" },
  { id: "b", title: "近义对比", when: "2 小时前", group: "今天", preview: "宾语决定语气" },
  { id: "c", title: "本周订正计划", when: "昨天", group: "更早", preview: "先看错因再排计划" },
];

export const SESSION_LONG_TITLE =
  "为什么这道逻辑填空不能选遏制而要选抑制萌芽还要把近义记进今日计划";

/**
 * 完整壳。开发按编号抄：点开 → 欢迎/预选项 → 会话管理器 → 三壳 → 各场景 → Path A 390。
 * Prompt Bar / 会话管理器细节见上方专表。这里锁位置、文案、禁止项。
 */
export const SHELL_PACK: ReadonlyArray<{
  n: string;
  id: string;
  name: string;
  ticket: string;
  must: string;
}> = [
  { n: "21", id: "open", name: "点开", ticket: "1072 / 421", must: "Scene 32 / Seed 36 / Rail 32 / TopBar 44。aria-expanded 跟壳。不是 FAB。" },
  { n: "22", id: "welcome", name: "欢迎与预选项", ticket: "1072 / 741 / 1050", must: "空会话：欢迎在 composer 之上。预选项全宽 lucide 行。每场景一份，禁止 Welcome/feed/header 各挂一份。" },
  { n: "23", id: "session-mgr", name: "会话管理器", ticket: "1072 / 459 / 1050", must: "标题整块可点。下拉 popover 贴标题，不铺满面板。今天/更早。当前 sunk。新对话置顶。canonical 不写 localStorage。390 Path A 不挂。" },
  { n: "24", id: "places", name: "浮层 / 右栏 / sheet", ticket: "1072", must: "float 右下不占主列；rail 占宽，浮层钮改 PiP；sheet handle + 底。流内皮同一 Turn。" },
  { n: "25", id: "scenes", name: "各场景欢迎", ticket: "1072 / 1050", must: "总览/讲题/笔记/Tutor/Guided/Path A 各有欢迎语、占位、预选项。Guided 只在对话轨。" },
  { n: "26", id: "path-a-390", name: "Path A 390 门", ticket: "1050", must: "AiMark +「请在桌面端使用」。不挂 Host、会话、预选项、composer。" },
];

export const SHELL_OPEN = {
  trigger: "同一颗 SceneAiChip。Scene 32 · Seed/welcome 36 · Rail 32 · TopBar 44。",
  expanded: "aria-expanded 跟 dock 开合。展开态 ai-soft 洗。",
  motion: "280ms ease-out。float 从右下；rail 占 occupied-width；sheet 从底上。reduced-motion 瞬间到位。",
  not: "FAB；第二颗入口；描边蓝 pill；可见「AI」字。",
} as const;

export const SHELL_PRESET = {
  emptyWhere: "空会话欢迎下方、composer 上方。margin-top:auto 贴底。不是顶栏 chips。",
  turnWhere: "回合 widgets 槽，脚印之前。",
  style: "全宽 lucide 行。图标列 16。N−1 条 inset 短线。末行无线。无描边 pill。",
  type: "桌面 12/1.4/500。390 行命中 44，字 13。",
  maxEmpty: "3–5",
  maxTurn: "≤3",
  not: "Welcome、feed、Modal header 各一份；材料/方向轨；脚印下；Path A 390；描边 pill。",
} as const;

export const SHELL_SCENES: ReadonlyArray<{
  id: "overview" | "teach" | "notes" | "tutor" | "guided" | "review-path-a";
  label: string;
  defaultPlace: DockPlace;
  hello: string;
  sessionTitle: string;
  locator: string;
  placeholder: string;
  presets: readonly string[];
  where: string;
}> = [
  {
    id: "overview",
    label: "总览",
    defaultPlace: "float",
    hello: "从这一页接着问",
    sessionTitle: "本周订正",
    locator: "总览",
    placeholder: "问这轮要看什么…",
    presets: ["本周先订哪几道", "/计划 写入这 3 道", "/复盘 看错因"],
    where: "Home dock。默认浮层。",
  },
  {
    id: "teach",
    label: "讲题",
    defaultPlace: "float",
    hello: "问这道题",
    sessionTitle: "这一空",
    locator: "这一空",
    placeholder: "问这道题，或把题面拖进来…",
    presets: ["/讲题 这一空怎么拆", "/近义 对比选项", "干扰项怎么设计"],
    where: "题面在主列。栏不复制题面。",
  },
  {
    id: "notes",
    label: "笔记",
    defaultPlace: "float",
    hello: "整理这条，或补一句",
    sessionTitle: "近义干扰",
    locator: "近义干扰",
    placeholder: "整理这条，或补一句…",
    presets: ["对上本周错题", "/复盘 筛一筛"],
    where: "对着已有笔记。来源槽钉 @笔记本。",
  },
  {
    id: "tutor",
    label: "Tutor",
    defaultPlace: "float",
    hello: "从诊断接着问",
    sessionTitle: "诊断这一步",
    locator: "诊断这一步",
    placeholder: "问这步，或让我换种拆法…",
    presets: ["先看宾语再看语气", "下一空自己选", "为什么不能选遏制"],
    where: "诊断 ActionChip 在主列。栏只对话。",
  },
  {
    id: "guided",
    label: "Guided",
    defaultPlace: "rail",
    hello: "从对话开始",
    sessionTitle: "这篇材料",
    locator: "这篇材料",
    placeholder: "问这篇材料…",
    presets: ["标关键句", "对照要点", "整理成段"],
    where: "材料 | 方向 | 对话。预选项只在对话轨。",
  },
  {
    id: "review-path-a",
    label: "Path A",
    defaultPlace: "rail",
    hello: "讲这题",
    sessionTitle: "资料题同比",
    locator: "资料题同比 · 解析",
    placeholder: "问这题…",
    presets: ["讲这题", "标关键条件", "找同类错题"],
    where: "桌面 Modal + 同一 dock。390 只留桌面门。",
  },
];

export const SHELL_COMMANDS = [
  { key: "compare", name: "/近义", desc: "对比易混" },
  { key: "plan", name: "/计划", desc: "写入本周订正" },
  { key: "teach", name: "/讲题", desc: "方法卡 + 到你了" },
  { key: "review", name: "/复盘", desc: "发现卡" },
] as const;

export const SHELL_SOURCE_KEYS = [
  { key: "attach", name: "添加图片和文件", desc: "直接进这一轮", attach: true },
  { key: "bank", name: "错题库", desc: "本周错题 / 订正中。布局槽，不是已接通。" },
  { key: "note", name: "笔记本", desc: "你记过。布局槽，不是已接通。" },
  { key: "cal", name: "日历", desc: "今日截止。布局槽，不是已接通。" },
] as const;
