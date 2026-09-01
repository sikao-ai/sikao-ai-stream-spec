import type { DockHost } from "./ask-sikao";

export type SourceKey = "bank" | "note" | "cal";
export type SourceStatus = "ready" | "sync" | "stale" | "err";
export type SourceChip = { key: SourceKey; st: SourceStatus };

export const DOCK_SOURCES: ReadonlyArray<{
  key: SourceKey | "attach";
  name: string;
  desc: string;
  attach?: boolean;
}> = [
  { key: "attach", name: "添加图片和文件", desc: "直接进这一轮", attach: true },
  { key: "bank", name: "错题库", desc: "本周错题 / 订正中" },
  { key: "note", name: "笔记本", desc: "你记过" },
  { key: "cal", name: "日历", desc: "今日截止" },
];

export const DOCK_COMMANDS = [
  { key: "compare", name: "/近义", desc: "对比易混" },
  { key: "plan", name: "/计划", desc: "写入本周订正" },
  { key: "teach", name: "/讲题", desc: "方法卡 + 到你了" },
  { key: "review", name: "/复盘", desc: "发现卡" },
] as const;

export const DOCK_HOSTS: Record<
  DockHost,
  {
    label: string;
    title: string;
    kicker: string;
    body: string;
    place: string;
    sources: readonly SourceChip[];
    qs: readonly string[];
  }
> = {
  overview: {
    label: "总览",
    title: "本周 3 道待订正",
    kicker: "总览",
    body: "周五模考。点右下角问这轮，或把错题钉进栏里。",
    place: "问这轮要看什么…",
    sources: [{ key: "bank", st: "ready" }],
    qs: ["本周先订哪几道", "/计划 写入这 3 道", "/复盘 看错因"],
  },
  teach: {
    label: "讲题",
    title: "言语 · 近义　势头 / 苗头",
    kicker: "讲题",
    body: "方法卡仍在答案里。栏只收题面和来源。",
    place: "问这道题，或把题面拖进来…",
    sources: [{ key: "bank", st: "ready" }],
    qs: ["/讲题 这一空怎么拆", "/近义 对比选项"],
  },
  notes: {
    label: "笔记",
    title: "近义干扰 · 势头 / 苗头",
    kicker: "笔记 · 你记过",
    body: "已有记忆钩子。对上错题库，或补一句。",
    place: "整理这条，或补一句…",
    sources: [{ key: "note", st: "ready" }],
    qs: ["对上本周错题", "/复盘 筛一筛"],
  },
};

export function sourceName(key: string) {
  return DOCK_SOURCES.find((s) => s.key === key)?.name ?? key;
}
