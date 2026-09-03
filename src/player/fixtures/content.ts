import type { Expert, FilterRow, InsightSpec, RecChoice, SourceCard } from "./types";

/** Scene copy for fixtures. Components must not hardcode this flow. */

export const SAP_SOURCES: readonly SourceCard[] = [
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
];

export const LOOKBACK_SOURCE: SourceCard = {
  n: 1,
  title: "近义干扰 · 势头/苗头",
  kind: "笔记",
  snippet: "记忆钩子：遏制势头 · 抑制萌芽。本周填空错 3 道，都栽在搭配。",
  body: "逻辑填空先看宾语，再看语气硬度。记忆钩子：遏制势头 · 抑制萌芽。本周填空错 3 道，都栽在「势头 / 苗头」搭配上，不要只记近义本身。对照卷面时把宾语圈出来，再选软硬。",
};

export const EXPERTS: readonly Expert[] = [
  { id: "e1", name: "搭配", op: "thought", text: "宾语是「萌芽」，不是已经起来的势头。" },
  { id: "e2", name: "近义", op: "search", text: "检索遏制 / 遏止 / 抑制。" },
  { id: "e3", name: "卷面", op: "read", text: "对照言语逻辑填空近义表。" },
  { id: "e4", name: "综合", op: "tool", text: "抑制萌芽更贴；遏制语气偏硬。" },
];

export const FILTER_ROWS: readonly FilterRow[] = [
  { name: "遏制 / 抑制萌芽", topic: "言语填空", status: "已订正", cause: "搭配" },
  { name: "蔓延 / 扩散", topic: "言语填空", status: "未做", cause: "近义" },
  { name: "遏止 / 阻止", topic: "言语填空", status: "已订正", cause: "语气" },
  { name: "苗头 / 势头", topic: "逻辑填空", status: "订正中", cause: "搭配" },
  { name: "萌芽 / 端倪", topic: "逻辑填空", status: "已订正", cause: "搭配" },
];

export const INSIGHTS: readonly InsightSpec[] = [
  {
    viz: "bars",
    kicker: "发现",
    title: "本周填空 3 道栽在「势头 / 苗头」搭配。",
    hero: { n: "3", unit: "道" },
    tone: "risk",
    rows: [
      { name: "遏制", label: "2 道", value: 2 },
      { name: "抑制", label: "没错过", value: 0 },
      { name: "遏止", label: "1 道", value: 1 },
    ],
    ask: "对照这 3 道",
  },
  {
    viz: "progress",
    kicker: "发现",
    title: "今日计划还差 2 道「萌芽 / 苗头」旧题。",
    hero: { n: "1", unit: "/ 3" },
    tone: "ai",
    progress: 1 / 3,
    rows: [
      { name: "已做", label: "1 道", value: 1 },
      { name: "还差", label: "2 道", value: 2 },
    ],
    ask: "抽 2 道旧题",
  },
  {
    viz: "curve",
    kicker: "发现",
    title: "近 7 天填空正确率在往上走。",
    hero: { n: "61", unit: "%" },
    tone: "ai",
    series: [48, 50, 47, 52, 55, 58, 61],
    rows: [
      { name: "周一", label: "48%", value: 48 },
      { name: "今天", label: "61%", value: 61 },
    ],
    ask: "看这周填空",
  },
  {
    viz: "compare",
    kicker: "发现",
    title: "填空是唯一掉队的模块。",
    hero: { n: "61", unit: "%" },
    tone: "warn",
    rows: [
      { name: "判断", label: "78%", value: 78 },
      { name: "言语", label: "61%", value: 61 },
      { name: "资料", label: "74%", value: 74 },
    ],
    ask: "先补填空",
  },
];

export const APPROVE_OPTIONS = ["写入今日计划", "只记近义表", "这次先不写"] as const;

export const REC_CHOICES: readonly RecChoice[] = [
  { id: "plan", title: "写入今日计划", detail: "对照本周 3 道错题", score: 5 },
  { id: "drill", title: "先做 2 道旧题", detail: "宾语是萌芽 / 苗头", score: 4 },
  { id: "table", title: "只记近义表", detail: "先不进计划", score: 3 },
  { id: "skip", title: "这次先不写", detail: "先看完这题", score: 1 },
];

export const FOLLOWUPS = ["为什么不能选遏制", "对比近义", "做成今日计划"] as const;

export const TEACH_STEM = "对新生事物，应______其萌芽，而不是等它坐大再去堵。";

export const USER_SHORT = "这空为什么不能选「遏制」？";
export const USER_TOOL = "这道逻辑填空为什么不能选「遏制」？";
export const USER_TEACH = "这道逻辑填空为什么不能选「遏制」？";
export const USER_GATE = "把这组近义写进今日计划？";

export const SHORT_PROSE = [
  {
    segments: [{ text: "空里要的是还没成形的苗头，用「抑制」更贴搭配。" }],
  },
] as const;

export const TOOL_PROSE_STREAM = [
  {
    segments: [{ text: "「遏制」的对象通常是已经起来的势头，语气偏硬。" }],
  },
] as const;

export const TOOL_PROSE_SETTLED = [
  {
    segments: [
      { text: "「遏制」的对象通常是已经起来的势头，语气偏硬" },
      { cite: 1 },
      { text: "。空里要的是还没成形的苗头，用「抑制」更贴搭配" },
      { cite: 2 },
      { text: "。" },
    ],
  },
] as const;

export const STEPS_LIVE = [
  { op: "thought" as const, text: "先看搭配对象是「势头」，不是「情绪」。", live: true },
  { op: "search" as const, text: "检索近义干扰 · 遏制 / 遏止 / 抑制", live: true, status: "running" as const },
];

export const STEPS_DONE = [
  { op: "thought" as const, text: "先看搭配对象是「势头」，不是「情绪」。" },
  { op: "search" as const, text: "检索近义干扰 · 遏制 / 遏止 / 抑制", elapsed: "1.2s" },
  { op: "read" as const, text: "打开近义干扰表", elapsed: "0.4s" },
  { op: "write" as const, text: "写入对照笔记", elapsed: "0.6s" },
];
