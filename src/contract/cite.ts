/**
 * SIK-1070 引用。对话里 [n] 是角标浮出，不是结果页扫卡，也不是网页 favicon 条。
 * 来源清单只在脚印之后。你记过不是本轮 [n]。
 */

export const CITE_CONTRACT_VERSION = "1070.cite.v1" as const;

export const CITE_STATES: ReadonlyArray<{
  id: "streaming" | "settled" | "open" | "invalid" | "none" | "list";
  see: string;
  rule: string;
}> = [
  { id: "streaming", see: "正文在出，无 [n]", rule: "字没齐不出角标。caret 沿用现网 StreamingProse。" },
  { id: "settled", see: "inline [n]，都关上", rule: "11/700 mono sunken。同时只开一张。" },
  { id: "open", see: "点 [n] 浮层 popover 叠在脚印上", rule: "不占文档流、不顶脚印。贴角标。距边 ≥12。Esc / 再点 / 点外关。" },
  { id: "invalid", see: "角标仍在，卡写「这条已经没了」", rule: "不从布局消失。不空白。" },
  { id: "none", see: "无角标，脚印无「来源」", rule: "N=0 不渲染卡、不渲染钮。" },
  { id: "list", see: "点脚印「来源 N」后列表在脚印下", rule: "不替代 inline 浮出。打开列表关掉浮出。" },
];

export const CITE_ROWS: ReadonlyArray<{ slot: string; do: string; dont: string }> = [
  { slot: "何时", do: "settled 才出 [n]。", dont: "streaming 出角标。" },
  { slot: "形", do: "16 槽、10/700 mono、略抬。idle sunken；on 实心 AI 蓝；失效 err。", dont: "网页 favicon 条；括号字 [1]。" },
  { slot: "浮出", do: "贴角标的浮层 popover，不占文档流、不顶脚印。160ms y6。同时一张。", dont: "展开推进 footer；居中整列；一次开多张。" },
  { slot: "键盘", do: "Esc 关。左右切 n。", dont: "Tab 困在卡里出不去。" },
  { slot: "列表", do: "仅 after-footprint。kicker「来源」。", dont: "排在 prose / 方法 / 到你了 前。" },
  { slot: "你记过", do: "落定笔记 0–2 张。kicker「你记过」。", dont: "可回看；当成 [n]。" },
  { slot: "失效", do: "角标留着。卡文案「这条已经没了」。", dont: "从布局消失。" },
];
