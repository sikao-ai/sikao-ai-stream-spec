import { copyLock, type DensityId } from "@/contract/turn";
import type { Scenario, TurnFrame } from "./types";
import {
  APPROVE_OPTIONS,
  EXPERTS,
  FOLLOWUPS,
  INSIGHTS,
  LOOKBACK_SOURCE,
  REC_CHOICES,
  SAP_SOURCES,
  SHORT_PROSE,
  STEPS_DONE,
  STEPS_LIVE,
  STEPS_PARTIAL,
  TEACH_STEM,
  TOOL_PROSE_SETTLED,
  TOOL_PROSE_STREAM,
  USER_GATE,
  USER_SHORT,
  USER_TEACH,
  USER_TOOL,
} from "./content";

const VIEWS = ["live", "persisted", "replay"] as const;

function toolWidgets(): TurnFrame["widgets"] {
  return [
    { type: "insight", items: INSIGHTS.slice(0, 1) },
    { type: "prompt-list", items: FOLLOWUPS },
  ];
}

function teachWidgets(): TurnFrame["widgets"] {
  return [
    { type: "method", title: "先看宾语，再看语气硬度", reason: "「遏制」管已起的势头；空里要的是还没成形的苗头。" },
    { type: "youtry", title: "下一空自己选", items: ["抑制萌芽", "遏制势头", "遏止蔓延"] },
    { type: "prompt-list", items: FOLLOWUPS },
  ];
}

function gateWidgets(): TurnFrame["widgets"] {
  return [
    {
      type: "recommend",
      question: "要我把这组近义写进今日计划吗？",
      choices: REC_CHOICES,
    },
    { type: "nav-cta", label: copyLock("导航 CTA") },
    { type: "prompt-list", items: FOLLOWUPS },
  ];
}

function shortFrames(): TurnFrame[] {
  const d: DensityId = "short";
  const user = USER_SHORT;
  return [
    {
      id: "waiting",
      phase: "waiting",
      density: d,
      user,
      status: { state: "wait", copy: copyLock("回合态 wait") },
    },
    {
      id: "streaming",
      phase: "streaming",
      density: d,
      user,
      status: { state: "stream", copy: "" },
      prose: { paragraphs: SHORT_PROSE, streaming: true },
    },
    {
      id: "settled",
      phase: "settled",
      density: d,
      user,
      status: { state: "done", copy: "" },
      prose: { paragraphs: SHORT_PROSE },
      widgets: [{ type: "prompt-list", items: FOLLOWUPS }],
      footprint: { sourceCount: 0 },
    },
    {
      id: "stop",
      phase: "stop",
      density: d,
      user,
      status: { state: "stop", copy: "", time: "3s" },
      prose: { paragraphs: SHORT_PROSE },
      footprint: { sourceCount: 0 },
    },
    {
      id: "error",
      phase: "error",
      density: d,
      user,
      status: { state: "error", copy: "" },
      error: { title: "这一轮没有写完" },
    },
  ];
}

function toolFrames(): TurnFrame[] {
  const d: DensityId = "tool";
  const user = USER_TOOL;
  const sources = SAP_SOURCES.slice(0, 2);
  return [
    {
      id: "waiting",
      phase: "waiting",
      density: d,
      user,
      status: { state: "wait", copy: copyLock("回合态 wait"), time: "4s" },
    },
    {
      id: "live",
      phase: "live",
      density: d,
      user,
      status: { state: "tool", copy: copyLock("回合态 tool"), time: "4s" },
      experts: EXPERTS.slice(0, 3),
      steps: STEPS_LIVE,
    },
    {
      id: "streaming",
      phase: "streaming",
      density: d,
      user,
      status: { state: "stream", copy: "" },
      prose: { paragraphs: TOOL_PROSE_STREAM, streaming: true },
    },
    {
      id: "settled",
      phase: "settled",
      density: d,
      user,
      status: { state: "done", copy: "", time: "6s", foldable: true },
      prose: { paragraphs: TOOL_PROSE_SETTLED },
      steps: STEPS_DONE,
      lookback: LOOKBACK_SOURCE,
      widgets: toolWidgets(),
      footprint: { sourceCount: sources.length },
      sources,
    },
    {
      id: "stop",
      phase: "stop",
      density: d,
      user,
      status: { state: "stop", copy: "", time: "3s", foldable: true },
      prose: { paragraphs: TOOL_PROSE_STREAM },
      steps: STEPS_DONE.slice(0, 2),
      footprint: { sourceCount: sources.length },
      sources,
    },
  ];
}

function teachFrames(): TurnFrame[] {
  const d: DensityId = "teach";
  const user = USER_TEACH;
  const sources = SAP_SOURCES.slice(0, 2);
  return [
    {
      id: "waiting",
      phase: "waiting",
      density: d,
      user,
      stem: TEACH_STEM,
      status: { state: "wait", copy: copyLock("回合态 wait"), time: "4s" },
    },
    {
      id: "live",
      phase: "live",
      density: d,
      user,
      stem: TEACH_STEM,
      status: { state: "tool", copy: copyLock("回合态 tool"), time: "4s" },
      experts: EXPERTS.slice(0, 3),
    },
    {
      id: "streaming",
      phase: "streaming",
      density: d,
      user,
      stem: TEACH_STEM,
      status: { state: "stream", copy: "" },
      prose: { paragraphs: TOOL_PROSE_STREAM, streaming: true },
    },
    {
      id: "settled",
      phase: "settled",
      density: d,
      user,
      stem: TEACH_STEM,
      status: { state: "done", copy: "", time: "6s", foldable: true },
      prose: { paragraphs: TOOL_PROSE_SETTLED },
      steps: STEPS_DONE,
      lookback: LOOKBACK_SOURCE,
      widgets: teachWidgets(),
      footprint: { sourceCount: sources.length },
      sources,
    },
  ];
}

function gateFrames(): TurnFrame[] {
  const d: DensityId = "gate";
  const user = USER_GATE;
  return [
    {
      id: "waiting",
      phase: "waiting",
      density: d,
      user,
      status: { state: "wait", copy: copyLock("回合态 wait"), time: "4s" },
    },
    {
      id: "live",
      phase: "live",
      density: d,
      user,
      status: { state: "wait", copy: copyLock("回合态 gate"), time: "4s" },
      approval: {
        title: "写入笔记前先确认",
        reason: "接下来会把「遏制势头 / 抑制萌芽」记进今日计划，并对照本周 3 道错题。",
        blocking: true,
        options: APPROVE_OPTIONS,
      },
    },
    {
      id: "streaming",
      phase: "streaming",
      density: d,
      user,
      status: { state: "stream", copy: "" },
      prose: { paragraphs: TOOL_PROSE_STREAM, streaming: true },
    },
    {
      id: "settled",
      phase: "settled",
      density: d,
      user,
      status: { state: "done", copy: "", time: "6s", foldable: true },
      prose: { paragraphs: TOOL_PROSE_SETTLED },
      steps: STEPS_DONE,
      lookback: LOOKBACK_SOURCE,
      widgets: gateWidgets(),
      footprint: { sourceCount: 2 },
      sources: SAP_SOURCES.slice(0, 2),
    },
  ];
}

export const SCENARIOS: readonly Scenario[] = [
  {
    id: "short",
    title: "短答流",
    density: "short",
    host: "Home dock",
    runtime: "1031/1040 短答零过程",
    views: VIEWS,
    frames: shortFrames(),
  },
  {
    id: "tool",
    title: "工具流",
    density: "tool",
    host: "Home dock",
    runtime: "1031/1040 对话机",
    views: VIEWS,
    frames: toolFrames(),
  },
  {
    id: "teach",
    title: "讲题流",
    density: "teach",
    host: "Teach",
    runtime: "1031/1040 对话机",
    views: VIEWS,
    frames: teachFrames(),
  },
  {
    id: "gate",
    title: "门卡流",
    density: "gate",
    host: "Plan",
    runtime: "1031 门卡真停",
    views: VIEWS,
    frames: gateFrames(),
  },
  {
    id: "stop_pending",
    title: "正在停止",
    density: "tool",
    host: "Home dock",
    runtime: "1040 stop_pending",
    views: VIEWS,
    frames: [
      {
        id: "halt",
        phase: "halt",
        density: "tool",
        user: USER_TOOL,
        status: { state: "halt", copy: "", time: "4s" },
        prose: { paragraphs: TOOL_PROSE_STREAM },
        steps: STEPS_LIVE,
      },
    ],
  },
  {
    id: "cancelled",
    title: "已停止",
    density: "tool",
    host: "Home dock",
    runtime: "1040 cancelled",
    views: VIEWS,
    frames: [
      {
        id: "stop",
        phase: "stop",
        density: "tool",
        user: USER_TOOL,
        status: { state: "stop", copy: "", time: "3s", foldable: true },
        prose: { paragraphs: TOOL_PROSE_STREAM },
        steps: STEPS_DONE.slice(0, 2),
        footprint: { sourceCount: 2 },
        sources: SAP_SOURCES.slice(0, 2),
      },
    ],
  },
  {
    id: "provider_unknown",
    title: "生成未确认",
    density: "tool",
    host: "Home dock",
    runtime: "1040 provider_unknown",
    views: VIEWS,
    frames: [
      {
        id: "error",
        phase: "error",
        density: "tool",
        user: USER_TOOL,
        status: { state: "error", copy: "" },
        prose: { paragraphs: TOOL_PROSE_STREAM },
        steps: STEPS_DONE.slice(0, 2),
        error: { title: "生成未确认" },
      },
    ],
  },
  {
    id: "replay_gap",
    title: "续看 / replay_gap",
    density: "tool",
    host: "Home dock",
    runtime: "1040 recovering / replay_gap",
    views: VIEWS,
    frames: [
      {
        id: "recover",
        phase: "recover",
        density: "tool",
        user: USER_TOOL,
        status: { state: "recover", copy: "" },
        prose: { paragraphs: TOOL_PROSE_STREAM },
        steps: STEPS_DONE.slice(0, 2),
      },
    ],
  },
  {
    id: "hitl",
    title: "HITL 活时门",
    density: "gate",
    host: "Plan",
    runtime: "1031 门卡真停",
    views: VIEWS,
    frames: gateFrames(),
  },
  {
    id: "review-teacher",
    title: "Review teacher",
    density: "teach",
    host: "Review",
    runtime: "1031/1040 · SIK-1050 Teach ModeProfile",
    views: VIEWS,
    frames: [
      {
        id: "settled",
        phase: "settled",
        density: "teach",
        user: "这卷填空错在哪一组近义？",
        stem: TEACH_STEM,
        status: { state: "done", copy: "", time: "6s", foldable: true },
        prose: { paragraphs: TOOL_PROSE_SETTLED },
        steps: STEPS_DONE,
        lookback: LOOKBACK_SOURCE,
        widgets: [
          { type: "method", title: "先看宾语，再看语气硬度", reason: "错因在搭配，不在词义。" },
          { type: "insight", items: INSIGHTS.slice(0, 1) },
          { type: "youtry", title: "下一空自己选", items: ["抑制萌芽", "遏制势头", "遏止蔓延"] },
        ],
        footprint: { sourceCount: 2 },
        sources: SAP_SOURCES.slice(0, 2),
      },
    ],
  },
  {
    id: "guided",
    title: "Guided 申论引导",
    density: "teach",
    host: "Guided · 材料 | 方向 | 对话",
    runtime: "1031/1040 对话机 · 只有对话是 Turn",
    views: VIEWS,
    frames: [
      {
        id: "settled",
        phase: "settled",
        density: "teach",
        user: "这一段对策怎么收束？",
        stem: "给定资料指出基层治理要______苗头，避免问题坐大。请提出对策。",
        status: { state: "done", copy: "", time: "8s", foldable: true },
        prose: {
          paragraphs: [
            {
              segments: [
                { text: "先写「谁来做、做什么、做到什么程度」。这一空仍是搭配：抑制萌芽，不是遏制势头" },
                { cite: 1 },
                { text: "。" },
              ],
            },
          ],
        },
        steps: STEPS_DONE,
        widgets: [
          { type: "method", title: "对策三件套", reason: "主体 · 动作 · 程度。不要只堆口号。" },
          { type: "youtry", title: "下一空自己选", items: ["明确责任单位", "列出可验收指标", "先写态度句"] },
        ],
        footprint: { sourceCount: 1 },
        sources: SAP_SOURCES.slice(0, 1),
      },
    ],
  },
  {
    id: "review-path-a",
    title: "复盘教师 Path A",
    density: "teach",
    host: "Review Path A",
    runtime: "SIK-1050 Path A + 1031/1040",
    views: VIEWS,
    frames: [
      {
        id: "waiting",
        phase: "waiting",
        density: "teach",
        user: "讲这道资料题",
        stem: "根据下表，2024 年产值同比约是？",
        stemAid: {
          caption: "资料题教具 · 表在 stem，不是第六族 pill",
          columns: ["年份", "产值", "同比"],
          rows: [
            ["2022", "1.2 万", "+4%"],
            ["2023", "1.3 万", "+8%"],
            ["2024", "1.4 万", "+7%"],
          ],
        },
        status: { state: "wait", copy: copyLock("回合态 wait"), time: "4s" },
      },
    ],
  },
  {
    id: "tutor",
    title: "Tutor 讲题",
    density: "teach",
    host: "Tutor",
    runtime: "1031/1040 对话机",
    views: VIEWS,
    frames: [
      {
        id: "settled",
        phase: "settled",
        density: "teach",
        user: "这空为什么不能选遏制？",
        stem: TEACH_STEM,
        status: { state: "done", copy: "", time: "6s", foldable: true },
        prose: { paragraphs: TOOL_PROSE_SETTLED },
        steps: STEPS_DONE,
        widgets: [
          { type: "action-chips", items: ["诊断：搭配干扰", "诊断：语气硬度"] },
          { type: "method", title: "先看宾语，再看语气硬度", reason: "「遏制」管已起的势头；空里要的是还没成形的苗头。" },
          { type: "youtry", title: "下一空自己选", items: ["抑制萌芽", "遏制势头", "遏止蔓延"] },
        ],
        footprint: { sourceCount: 2 },
        sources: SAP_SOURCES.slice(0, 2),
      },
    ],
  },
  {
    id: "teach-aid",
    title: "题型教具在 stem",
    density: "teach",
    host: "Review Path A / Teach",
    runtime: "SIK-1010 renderer 复用；不可用则 typed error",
    views: VIEWS,
    frames: [
      {
        id: "settled",
        phase: "settled",
        density: "teach",
        user: "这张表怎么读同比？",
        stem: "根据下表，2024 年产值同比约是？",
        stemAid: {
          caption: "资料题教具",
          columns: ["年份", "产值", "同比"],
          rows: [
            ["2022", "1.2 万", "+4%"],
            ["2023", "1.3 万", "+8%"],
            ["2024", "1.4 万", "+7%"],
          ],
        },
        status: { state: "done", copy: "", time: "5s", foldable: true },
        prose: { paragraphs: [{ segments: [{ text: "同比看「今年相对去年」，不要把累计增速当成当年同比。" }] }] },
        steps: STEPS_DONE.slice(0, 2),
        widgets: [
          { type: "method", title: "先读表头，再对年份", reason: "教具是 stem 里的表，不是题型 pill。" },
        ],
        footprint: { sourceCount: 0 },
      },
    ],
  },
  {
    id: "cause-act1",
    title: "问诊错因 幕1",
    density: "tool",
    host: "Review dock",
    runtime: "幕1 非 LLM 回放，投影成专家栈",
    views: VIEWS,
    frames: [
      {
        id: "live",
        phase: "live",
        density: "tool",
        user: "这题错在哪？",
        status: { state: "tool", copy: copyLock("回合态 tool"), time: "4s" },
        experts: [
          { id: "c1", name: "次数", op: "read", text: "做 4 次 · 错 3 次" },
          { id: "c2", name: "把握", op: "search", text: "2 次自信却错" },
          { id: "c3", name: "用时", op: "tool", text: "96s · 均 52s" },
        ],
      },
    ],
  },
  {
    id: "essay",
    title: "Essay drill",
    density: "teach",
    host: "Essay",
    runtime: "1031/1040 对话机 · 批改走 ProgressAtom 不进本流",
    views: VIEWS,
    frames: [
      {
        id: "settled",
        phase: "settled",
        density: "teach",
        user: "开头这段能不能直接点题？",
        stem: "结合给定资料，以「治未病」为话题写一篇文章。",
        status: { state: "done", copy: "", time: "7s", foldable: true },
        prose: {
          paragraphs: [
            {
              segments: [
                { text: "开头先点「治未病」再落到基层治理，不要先堆排比。材料里的搭配仍是抑制萌芽" },
                { cite: 1 },
                { text: "。" },
              ],
            },
          ],
        },
        steps: STEPS_DONE,
        widgets: [
          { type: "method", title: "开头先判断，再展开", reason: "点题一句 + 材料一句。不要第三句再起炉灶。" },
          { type: "youtry", title: "下一空自己选", items: ["先点题再举例", "先排比再点题", "先表态再转折"] },
        ],
        footprint: { sourceCount: 1 },
        sources: SAP_SOURCES.slice(0, 1),
      },
    ],
  },
  {
    id: "offline",
    title: "断网",
    density: "tool",
    host: "Home dock",
    runtime: "1031 detached · 不发 /runs",
    views: VIEWS,
    frames: [
      {
        id: "settled",
        phase: "settled",
        density: "tool",
        seq: 7,
        user: USER_TOOL,
        status: { state: "done", copy: "", time: "6s", foldable: true },
        prose: { paragraphs: TOOL_PROSE_SETTLED },
        steps: STEPS_DONE,
        widgets: toolWidgets(),
        footprint: { sourceCount: 2 },
        sources: SAP_SOURCES.slice(0, 2),
      },
    ],
  },
  {
    id: "duplicate_seq",
    title: "重复 seq",
    density: "tool",
    host: "Home dock",
    runtime: "SSE seq=7 第二次到达 · 忽略",
    views: VIEWS,
    frames: [
      {
        id: "first",
        phase: "settled",
        density: "tool",
        seq: 7,
        user: USER_TOOL,
        status: { state: "done", copy: "", time: "6s", foldable: true },
        prose: { paragraphs: TOOL_PROSE_SETTLED },
        steps: STEPS_DONE,
        widgets: toolWidgets(),
        footprint: { sourceCount: 2 },
        sources: SAP_SOURCES.slice(0, 2),
      },
      {
        id: "dup",
        phase: "settled",
        density: "tool",
        seq: 7,
        user: USER_TOOL,
        status: { state: "done", copy: "", time: "6s", foldable: true },
        prose: { paragraphs: TOOL_PROSE_SETTLED },
        steps: STEPS_DONE,
        widgets: toolWidgets(),
        footprint: { sourceCount: 2 },
        sources: SAP_SOURCES.slice(0, 2),
      },
    ],
  },
  {
    id: "partial_fail",
    title: "partial-fail",
    density: "tool",
    host: "Home dock",
    runtime: "多工具 · 写失败不当整轮 error",
    views: VIEWS,
    frames: [
      {
        id: "settled",
        phase: "settled",
        density: "tool",
        seq: 9,
        user: USER_TOOL,
        status: { state: "done", copy: "", time: "6s", foldable: true, defaultOpen: true },
        prose: { paragraphs: TOOL_PROSE_SETTLED },
        steps: STEPS_PARTIAL,
        widgets: toolWidgets(),
        footprint: { sourceCount: 2 },
        sources: SAP_SOURCES.slice(0, 2),
      },
    ],
  },
  {
    id: "stop_failed",
    title: "停止失败",
    density: "tool",
    host: "Home dock",
    runtime: "1040 stop_failed",
    views: VIEWS,
    frames: [
      {
        id: "error",
        phase: "error",
        density: "tool",
        seq: 4,
        user: USER_TOOL,
        status: { state: "error", copy: copyLock("未能停止") },
        prose: { paragraphs: TOOL_PROSE_STREAM },
        steps: STEPS_DONE.slice(0, 2),
        error: { title: copyLock("未能停止"), action: "重试停止" },
      },
    ],
  },
  {
    id: "quota",
    title: "额度不足",
    density: "short",
    host: "Home dock",
    runtime: "billing quota · 不进 Run",
    views: VIEWS,
    frames: [
      {
        id: "error",
        phase: "error",
        density: "short",
        user: USER_SHORT,
        status: { state: "error", copy: copyLock("额度不够") },
        error: { title: copyLock("额度不够"), action: "查看额度" },
      },
    ],
  },
  {
    id: "auth_expired",
    title: "权限过期",
    density: "tool",
    host: "Home dock",
    runtime: "1031 auth_required",
    views: VIEWS,
    frames: [
      {
        id: "recover",
        phase: "recover",
        density: "tool",
        seq: 3,
        user: USER_TOOL,
        status: { state: "recover", copy: copyLock("需要登录后继续") },
        prose: { paragraphs: TOOL_PROSE_STREAM },
        steps: STEPS_DONE.slice(0, 2),
      },
    ],
  },
  {
    id: "unknown_widget",
    title: "未知 widget",
    density: "tool",
    host: "Home dock",
    runtime: "type:widget kind 不在 13 闭集",
    views: VIEWS,
    frames: [
      {
        id: "settled",
        phase: "settled",
        density: "tool",
        seq: 8,
        user: USER_TOOL,
        status: { state: "done", copy: "", time: "6s", foldable: true },
        prose: { paragraphs: TOOL_PROSE_SETTLED },
        steps: STEPS_DONE,
        widgets: [
          { type: "product", kind: "unknown" },
          { type: "prompt-list", items: FOLLOWUPS },
        ],
        footprint: { sourceCount: 2 },
        sources: SAP_SOURCES.slice(0, 2),
      },
    ],
  },
];

export function getScenario(id: string): Scenario {
  const found = SCENARIOS.find((s) => s.id === id);
  if (!found) throw new Error(`unknown scenario: ${id}`);
  return found;
}

export function getFrame(scenario: Scenario, phaseOrId: string): TurnFrame {
  return (
    scenario.frames.find((f) => f.id === phaseOrId) ??
    scenario.frames.find((f) => f.phase === phaseOrId) ??
    scenario.frames[scenario.frames.length - 1]
  );
}

export function overlayFrame(frame: TurnFrame, patch: Partial<TurnFrame>): TurnFrame {
  return { ...frame, ...patch };
}
