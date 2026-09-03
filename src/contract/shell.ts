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
    geometry: "右下浮层，不占主列。会话管理器 popover 占满面板。",
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
    geometry: "底 sheet + handle。输入行 44，栏内圆钮视觉 32、命中 44。键盘避让。",
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
  does: "@来源槽 / 命令菜单 / 附件 / 发送或停止。桌面高 40 圆 12 字 14/18/400；移动行高 44 字 14/18/400，栏内圆钮视觉 32、命中 44。",
  not: "不当 PromptList。不把彩色状态点画成「已接入模型」。不在 canonical 页发模型、假听写、localStorage 会话。不把移动钮画成 44 方块。不把占位撑到 16。",
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
  { id: "source-slot", name: "来源槽", when: "钉住的布局芯片。不是 ACL 接通" },
  { id: "file-slot", name: "附件槽", when: "本轮文件名" },
  { id: "menu", name: "@ / 命令菜单", when: "token 解析后" },
];

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
