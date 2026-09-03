/**
 * Product widget frames already in sikao (SIK-395 / 756).
 * Same Insight shell. Unknown kind = fail-soft, no blank card.
 */

export const PRODUCT_WIDGET_IDS = [
  "cause_distribution",
  "trend_compare",
  "weakness_action",
  "confidence_calibration",
  "wrong_book_snapshot",
  "plan_week_strip",
  "module_score_bars",
  "predicted_score_gauge",
  "exam_countdown_card",
  "cause_remedy_checklist",
  "session_result_summary",
  "compare_two_windows",
  "note_outline_card",
] as const;

export type ProductWidgetId = (typeof PRODUCT_WIDGET_IDS)[number];

export const PRODUCT_WIDGETS: ReadonlyArray<{
  id: ProductWidgetId;
  title: string;
  viz: "bars" | "progress" | "curve" | "compare" | "list";
  scope: string;
  ask?: string;
  rows: ReadonlyArray<{ name: string; label: string; value: number }>;
  hero?: { n: string; unit: string };
  series?: readonly number[];
  progress?: number;
  note: string;
}> = [
  {
    id: "cause_distribution",
    title: "错因分布（近 90 天）",
    viz: "bars",
    scope: "47 道",
    ask: "怎么改审题偏差",
    rows: [
      { name: "审题偏差", label: "14", value: 14 },
      { name: "计算失误", label: "9", value: 9 },
    ],
    note: "每回合最多 1 张。样本不足不出卡。",
  },
  {
    id: "trend_compare",
    title: "正确率趋势（近 60 天）",
    viz: "curve",
    scope: "正确率",
    series: [62, 62, 68, 64, 70, 68],
    rows: [
      { name: "前窗", label: "62%", value: 62 },
      { name: "本窗", label: "68%", value: 68 },
    ],
    hero: { n: "+6", unit: "pt" },
    note: "空桶保留，不连假线。",
  },
  {
    id: "weakness_action",
    title: "最该攻的弱项",
    viz: "compare",
    scope: "对平均",
    ask: "去练判断",
    rows: [
      { name: "判断", label: "41%", value: 41 },
      { name: "言语", label: "55%", value: 55 },
    ],
    note: "去练是炭黑 CTA，不是柔黄。点击失败要 toast，不许静默。",
  },
  {
    id: "confidence_calibration",
    title: "信心校准（近 90 天）",
    viz: "bars",
    scope: "42 次自评",
    rows: [
      { name: "蒙", label: "41%", value: 41 },
      { name: "没把握", label: "55%", value: 55 },
      { name: "较有把握", label: "62%", value: 62 },
      { name: "确定", label: "71%", value: 71 },
    ],
    note: "禁止「高信心」措辞。用档位名。",
  },
  {
    id: "wrong_book_snapshot",
    title: "近期错题 TOP",
    viz: "list",
    scope: "2 道",
    rows: [
      { name: "封闭区域数量规律", label: "错 3 次", value: 3 },
      { name: "文段主旨概括", label: "错 2 次", value: 2 },
    ],
    note: "行展开留在卡内，不跳路由。",
  },
  {
    id: "plan_week_strip",
    title: "本周计划",
    viz: "progress",
    scope: "4 / 7",
    progress: 4 / 7,
    rows: [
      { name: "已完成", label: "4", value: 4 },
      { name: "全部", label: "7", value: 7 },
    ],
    hero: { n: "4", unit: "/ 7" },
    note: "七格状态 done/missed/today/empty。不是日历第六族。",
  },
  {
    id: "module_score_bars",
    title: "各模块正确率",
    viz: "bars",
    scope: "行测",
    rows: [
      { name: "判断", label: "41%", value: 41 },
      { name: "言语", label: "55%", value: 55 },
    ],
    note: "与发现卡 bars 同一 DNA。",
  },
  {
    id: "predicted_score_gauge",
    title: "预估分",
    viz: "progress",
    scope: "全部样本",
    progress: 62.5 / 100,
    hero: { n: "62.5", unit: "分" },
    rows: [
      { name: "区间", label: "59.5–65.5", value: 62 },
      { name: "目标", label: "70", value: 70 },
    ],
    note: "没有伪百分比动画、没有 ETA。",
  },
  {
    id: "exam_countdown_card",
    title: "距考试",
    viz: "progress",
    scope: "国考",
    hero: { n: "125", unit: "天" },
    progress: 0.4,
    rows: [{ name: "日均目标", label: "40 题", value: 40 }],
    note: "数字是倒计时，不是 ProgressAtom 长任务。",
  },
  {
    id: "cause_remedy_checklist",
    title: "本周对策",
    viz: "list",
    scope: "审题偏差",
    rows: [{ name: "放慢首读，圈设问", label: "14 道", value: 14 }],
    note: "清单不是 PromptList，不当下一问。",
  },
  {
    id: "session_result_summary",
    title: "本场结果",
    viz: "compare",
    scope: "20 题",
    hero: { n: "65", unit: "%" },
    rows: [
      { name: "对", label: "13", value: 13 },
      { name: "总", label: "20", value: 20 },
    ],
    note: "结果卡不是 ProgressAtom 批改。",
  },
  {
    id: "compare_two_windows",
    title: "前后对比",
    viz: "compare",
    scope: "正确率",
    rows: [
      { name: "近 30 天", label: "68%", value: 68 },
      { name: "近 90 天", label: "61%", value: 61 },
    ],
    hero: { n: "+7", unit: "pt" },
    note: "对照画法，不另起双轴图。",
  },
  {
    id: "note_outline_card",
    title: "削弱题方法论",
    viz: "list",
    scope: "笔记",
    rows: [
      { name: "识别设问类型", label: "", value: 1 },
      { name: "定位论证结构", label: "", value: 1 },
      { name: "常见干扰项", label: "", value: 1 },
    ],
    note: "数据卡，不是方法卡。KindTag 锁「数据」。",
  },
];

/** 不对齐时按序修。禁止用 translate 补。 */
export const MISALIGN_PLAYBOOK: ReadonlyArray<{
  step: string;
  do: string;
  dont: string;
}> = [
  { step: "0 圆角", do: "卡内边距 16 ≥ 外壳半径 12。内嵌面半径 8。黄条/底栏 inset，不满铺到外圆角。", dont: "内容贴着 12 圆角；内嵌白块半径 ≥ 外壳。" },
  { step: "1 X", do: "量 --turn-icon 16 列。Dots / 专家栈 / 多步骤 lucide 左齐这一列。", dont: "左边再垫 padding 把歪的「推回去」。" },
  { step: "2 Y", do: "Dots / 文案 / elapsed / chevron 同一行 align-items: center。", dont: "用 margin-top: 1px 微调。" },
  { step: "3 双轴都歪", do: "先修 X，再修 Y。对照 ALIGN_RULES 那一行。", dont: "transform: translate 对齐。" },
  { step: "4 换壳", do: "只换 LAYOUT_SCALE / TYPE_SCALE 对应行。", dont: "整列 scale(0.9) 适配 390。" },
  { step: "5 390 横溢", do: "表改卡片，筛芯片横滑。", dont: "把正文降到 13；小于 11px。" },
  { step: "6 HITL 过高", do: "卡在 Turn 内滚。选项保持 44 触控。", dont: "压缩 KindTag 或改成横排 pill。" },
  { step: "7 壳挡住", do: "1440 float/rail；390 sheet。", dont: "两套壳同时开；390 用桌面浮层。" },
  { step: "8 未知 widget", do: "fail-soft 不渲染。", dont: "画空白卡或 invent 新 kind 皮肤。" },
  { step: "9 多张 widget", do: "每回合最多 1 张 product widget。", dont: "堆 3 张发现卡。" },
  { step: "10 折叠", do: "hydrate/settled 默认折；live 首次展开。", dont: "和讲题方法卡抢默认展开。" },
];

export const VIEWPORT_RULES: ReadonlyArray<{
  slot: string;
  vp1440: string;
  vp390: string;
}> = [
  { slot: "Turn 列", vp1440: "max 720 居中", vp390: "通栏，左右 16。禁止整页横滚" },
  { slot: "用户泡", vp1440: "max 82%，半径 12/12/5/12", vp390: "max 88%，触控不改色" },
  { slot: "回合态", vp1440: "高 28，Dots 16", vp390: "高 28，Dots 16，不放大点" },
  { slot: "专家栈", vp1440: "芯片 22，间距 6", vp390: "芯片 28，横滑，不换行叠两排过程" },
  { slot: "确认门 / 推荐", vp1440: "主钮视觉 32", vp390: "主钮视觉 32 · 命中 44。卡内滚动。禁止 44 方块" },
  { slot: "脚印", vp1440: "lucide 28，hover 拉满", vp390: "lucide 28 · 命中 44，常显" },
  { slot: "输入条", vp1440: "高 40，字 14，圆 12，栏内钮 32", vp390: "行 44，字 14，圆钮视觉 32 · 命中 44。禁止占位 16" },
  { slot: "筛选表", vp1440: "表", vp390: "卡片列表 + 芯片横滑" },
  { slot: "壳", vp1440: "float 或 rail", vp390: "底 sheet + handle。Path A 只留桌面门" },
  { slot: "字号", vp1440: "正文 14/1.75 · 输入 14 · 辅文 12", vp390: "正文仍 14。输入 14/18/400。壳辅文 13。数字 11。禁止占位 16、正文 13" },
];
