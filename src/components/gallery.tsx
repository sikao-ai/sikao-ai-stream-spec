import { useState } from "react";
import { SpecimenRow } from "@/components/specimen-row";
import { PromptBarSpecimen } from "@/renderer/PromptBarSpecimen";
import { ProductWidget } from "@/renderer/ProductWidget";
import { DensityStream } from "@/renderer/TurnRenderer";
import { ViewportShell } from "@/renderer/ViewportShell";
import { PRODUCT_WIDGETS, type ProductWidgetId } from "@/contract/widgets";
import { MOBILE_CHROME_ROWS, MOBILE_TYPE_ROWS } from "@/contract/shell";
import {
  EXPERTS,
  FOLLOWUPS,
  INSIGHTS,
  LOOKBACK_SOURCE,
  SAP_SOURCES,
} from "@/player/fixtures/content";
import { copyLock, ENTER_MOTION, RENDERER_PACK, type DensityId, type DotsState } from "@/contract/turn";
import { HITL_APPROVE_STATES, HITL_REC_STATES } from "@/contract/scenes";
import type { ApproveSpecimen, RecSpecimen } from "@/components/stream/primitives";
import {
  ActionChip,
  AnswerFootprint,
  AssistantProse,
  Cite,
  ContextCard,
  EntityChip,
  ErrorBand,
  ExpertFeed,
  FillBtn,
  FilterTable,
  InsightCards,
  KindTag,
  MethodCard,
  OpRow,
  PromptList,
  ProposalCard,
  RecommendCard,
  SceneAiChip,
  StatusTag,
  TurnStatusLine,
  YouTryGate,
} from "@/components/stream/primitives";

export function Gallery() {
  const [dots, setDots] = useState<DotsState>("wait");
  const [bar, setBar] = useState("pinned");
  const [prose, setProse] = useState("settled");
  const [density, setDensity] = useState<DensityId>("teach");
  const [gate, setGate] = useState<ApproveSpecimen>("idle");
  const [rec, setRec] = useState<RecSpecimen>("fold");
  const [ctx, setCtx] = useState("lookback");
  const [insight, setInsight] = useState("bars");
  const [filter, setFilter] = useState("rows");
  const [foot, setFoot] = useState("sources");
  const [motion, setMotion] = useState("settled");
  const [motionTick, setMotionTick] = useState(0);
  const [widget, setWidget] = useState<ProductWidgetId | "unknown">("cause_distribution");
  const widgetSpec = widget === "unknown" ? null : PRODUCT_WIDGETS.find((w) => w.id === widget);

  const gateRow = HITL_APPROVE_STATES.find((s) => s.id === gate);
  const recRow = HITL_REC_STATES.find((s) => s.id === rec);

  return (
    <div className="spec-page spec-bui-page">
      <header className="spec-hero">
        <span className="spec-kicker">SIK-1086 及关联票 · 渲染器整包</span>
        <h1 className="spec-h1">Agent 前端渲染器视觉合约</h1>
        <p className="spec-lede">
          开发按编号抄左边标本、右边标准与代码。漏一块、漏一态都不算交付。票面：1066 文案、1067 密度、1068 Turn、1070 来源、1072 壳、1086 双轴/讲题卡、1040 运行时、1045 Dots、1050 Path A。
        </p>
      </header>

      <div className="spec-table-wrap" tabIndex={0}>
        <table className="spec-table">
          <thead>
            <tr>
              <th>#</th>
              <th>块</th>
              <th>票</th>
              <th>必须做到</th>
            </tr>
          </thead>
          <tbody>
            {RENDERER_PACK.map((row) => (
              <tr key={row.id}>
                <td>{row.n}</td>
                <td>
                  <a href={`#bui-${row.n}`}>
                    <strong>{row.name}</strong>
                  </a>
                </td>
                <td>{row.ticket}</td>
                <td>{row.must}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SpecimenRow
        n="01"
        title="回合态 Dots"
        lede="3×3 点阵。八态都要画。绿只给完成点阵和「已完成」。"
        px="桌面高 28 · Dots 槽 16×16 · 点 4px · gap 2px · 行 gap 6 · elapsed 11 mono"
        xy={{ x: "Dots 左 = 正文左；时长右 = 列右", y: "Dots / 文案 / 时长 / chevron 同一行垂直中心" }}
        forbid="Drive / Orbit / 扫光；时间插在点阵和已完成中间；逐步绿勾；elapsed=0 还渲染"
        checks={["8 态着色抄 DOT_STATES", "wait 文案「正在想」", "tool 文案「正在检索」", "stream 不写「生成中」badge"]}
        tabs={[
          { id: "wait", label: "等待" },
          { id: "tool", label: "工具" },
          { id: "stream", label: "出字" },
          { id: "recover", label: "续看" },
          { id: "halt", label: "正在停" },
          { id: "done", label: "完成" },
          { id: "stop", label: "已停" },
          { id: "error", label: "未确认" },
        ]}
        tab={dots}
        onTab={(id) => setDots(id as DotsState)}
        standard={[
          { k: "slot", v: "status" },
          { k: "copy", v: dots === "wait" ? "正在想" : dots === "tool" ? "正在检索" : dots === "done" ? "已完成" : dots === "stop" ? "已停止生成" : "（点阵说话，无 badge）" },
          { k: "色", v: dots === "wait" ? "ink" : dots === "tool" || dots === "stream" ? "AI 蓝" : dots === "done" ? "ok 绿" : dots === "error" ? "err" : dots === "stop" ? "muted" : "warn" },
        ]}
        code={`<TurnStatusLine state="${dots}" copy="${dots === "wait" ? "正在想" : dots === "tool" ? "正在检索" : ""}"${dots === "done" || dots === "stop" ? ` status="${dots}" time="${dots === "stop" ? "3s" : "6s"}"` : dots === "wait" || dots === "tool" || dots === "halt" ? ` time="4s"` : dots === "stream" || dots === "recover" || dots === "error" ? ` status="${dots === "stream" ? "stream" : dots === "recover" ? "recover" : "error"}"` : ""} />`}
      >
        <TurnStatusLine
          state={dots}
          copy={dots === "wait" ? "正在想" : dots === "tool" ? "正在检索" : ""}
          status={dots === "wait" || dots === "tool" ? null : dots === "stream" ? "stream" : dots === "recover" ? "recover" : dots === "halt" ? "halt" : dots === "done" ? "done" : dots === "stop" ? "stop" : "error"}
          time={dots === "wait" || dots === "tool" || dots === "halt" ? "4s" : dots === "done" ? "6s" : dots === "stop" ? "3s" : undefined}
          foldable={dots === "done" || dots === "stop"}
        />
      </SpecimenRow>

      <SpecimenRow
        n="02"
        title="专家栈"
        lede="lucide 小芯片、活时自己一行。新图标从右顶走。"
        px="芯片高 22 · 间距 6 · lucide 15 · 触控壳 28 · 自己一行可横滑"
        xy={{ x: "首芯片左 = Dots 左（--turn-icon 16 列）", y: "芯片垂直中心对齐" }}
        forbid="落定后仍挂一排头像；gate 活时用芯片代替 Approval；把专家栈当整轮过程条"
        checks={["只在 live 且非 short/gate 出现", "streaming 立刻收起", "数据折进多步骤，不删"]}
        standard={[
          { k: "slot", v: "expert-rail · live 且非 short/gate" },
          { k: "要", v: "首芯片左 = Dots 左" },
          { k: "不要", v: "落定后仍挂一排；gate 活时用 Approval" },
        ]}
        code={`<TurnStatusLine
  state="tool"
  copy="正在检索"
  time="4s"
  rail={<ExpertFeed experts={EXPERTS} liveId="e3" />}
/>`}
      >
        <TurnStatusLine
          state="tool"
          copy="正在检索"
          time="4s"
          rail={<ExpertFeed experts={EXPERTS.slice(0, 3)} liveId="e3" instant />}
        />
      </SpecimenRow>

      <SpecimenRow
        n="03"
        title="正文 + 角标"
        lede="通栏无框。出字时无角标。字出齐后点 [n] 在角标旁浮出。"
        px="正文 14/1.75/400 · 段间距 8 · 角标 11 · 浮出卡不超出 12px 边"
        xy={{ x: "正文左 = Dots 左", y: "角标与所在行 baseline 对齐" }}
        forbid="assistant bubble；结果页扫卡塞进气泡；streaming 就出 [n]"
        checks={["streaming 无角标", "settled 才出 [n]", "同时只开一张浮出", "Esc / 再点关闭"]}
        tabs={[
          { id: "streaming", label: "出字" },
          { id: "settled", label: "落定" },
        ]}
        tab={prose}
        onTab={setProse}
        standard={[
          { k: "slot", v: "prose" },
          { k: "streaming", v: "角标不出现，caret 沿用现网 StreamingProse" },
          { k: "settled", v: "inline [n]，同时只开一张" },
        ]}
        code={
          prose === "streaming"
            ? `<AssistantProse streaming>空里要的是还没成形的苗头。</AssistantProse>`
            : `<AssistantProse>语气偏硬<Cite n={1} />。用「抑制」更贴<Cite n={2} />。</AssistantProse>`
        }
      >
        {prose === "streaming" ? (
          <AssistantProse streaming>空里要的是还没成形的苗头，用「抑制」更贴搭配。</AssistantProse>
        ) : (
          <AssistantProse>
            「遏制」的对象通常是已经起来的势头，语气偏硬
            <Cite n={1} />
            。空里要的是还没成形的苗头，用「抑制」更贴搭配
            <Cite n={2} />。
          </AssistantProse>
        )}
      </SpecimenRow>

      <SpecimenRow
        n="04"
        title="多步骤"
        lede="活时进专家栈；正文后折进多步骤。不对思考打绿勾。"
        px="行高 22 · lucide 槽 16 · 列 gap 6 · 文案 12/1.4/500 · 耗时 11 mono"
        xy={{ x: "lucide 槽 16 = Dots 列；耗时右齐时长", y: "lucide / 文案 / 耗时垂直中心" }}
        forbid="逐步绿勾；英文 Thought for Ns；活时展开成任务管理器"
        checks={["只在 settled|stop 且有过程", "默认 fold", "完成 lucide 退成 text-meta"]}
        standard={[
          { k: "slot", v: "step-log · fold" },
          { k: "要", v: "lucide 槽 16 = Dots 列；耗时右齐时长" },
          { k: "不要", v: "逐步绿勾；英文 Thought for Ns" },
        ]}
        code={`<TurnStatusLine state="done" status="done" time="6s" foldable defaultOpen>
  <OpRow op="thought" text="先看宾语。" />
  <OpRow op="search" text="检索近义" elapsed="1.2s" />
</TurnStatusLine>`}
      >
        <TurnStatusLine state="done" copy="" status="done" time="6s" foldable defaultOpen>
          <OpRow op="thought" text="先看搭配对象是「势头」，不是「情绪」。" />
          <OpRow op="search" text="检索近义干扰 · 遏制 / 遏止 / 抑制" elapsed="1.2s" />
          <OpRow op="read" text="打开近义干扰表" elapsed="0.4s" />
        </TurnStatusLine>
      </SpecimenRow>

      <SpecimenRow
        n="05"
        title="确认门"
        lede="活时一问、选项行、点选即提交。未点选挡住正文。八态都要画。"
        px="sunken 内边距 16 · 选项行高 36 · 主钮视觉 32（移动命中 44）· KindTag 11 · 问句 16/600"
        xy={{ x: "KindTag 与问句同一行；选项左齐问句", y: "KindTag 与问句垂直中心；选项等高" }}
        forbid="铺满奶黄；落定后再挂一张审批；柔黄用在导航 CTA"
        checks={["八态全画", "480ms 内可改选", "fail 仍挡住", "ok/skip 才放行", "KindTag 写「确认」不是「审批」", "进场 280ms y12 scale.98，禁止弹跳"]}
        tabs={HITL_APPROVE_STATES.map((s) => ({
          id: s.id,
          label: ({ idle: "未选", picked: "已选", submit: "提交中", ok: "已写入", skip: "已忽略", fail: "没写上", invalid: "无效", reopen: "再问" } as const)[s.id],
        }))}
        tab={gate}
        onTab={(id) => setGate(id as ApproveSpecimen)}
        standard={[
          { k: "slot", v: "approval · gate + live" },
          { k: "see", v: gateRow?.see ?? "" },
          { k: "action", v: gateRow?.action ?? "" },
          { k: "挡住", v: gateRow?.block ?? "" },
          { k: "copy", v: copyLock("活时门提示") },
          { k: "KindTag", v: copyLock("门卡 KindTag") },
          { k: "不要", v: "铺满奶黄；落定后再挂一张审批" },
        ]}
        code={`<ProposalCard
  blocking
  specimen="${gate}"
  title="写入笔记前先确认"
  reason="接下来会把这组近义记进今日计划。"
/>`}
      >
        <ProposalCard
          blocking
          specimen={gate}
          title="写入笔记前先确认"
          reason="接下来会把这组近义记进今日计划。"
        />
      </SpecimenRow>

      <SpecimenRow
        n="06"
        title="推荐卡"
        lede="落定提案。主建议 + 推荐度 1–5。不挡下一问。六态都要画。"
        px="内边距 16 · 推荐度 5 点 · 格子 2×2 · 查看笔记炭黑填高 32（移动视觉 32 · 命中 44）"
        xy={{ x: "KindTag 与问句同一行；主建议与推荐度两端", y: "KindTag 与问句中心；推荐度与标题中心" }}
        forbid="高信心；柔黄主钮；挡住下一问；把 Decision Markdown 再画一张审批"
        checks={["六态全画", "落定不挡", "写入中主钮 disabled", "失败幂等重试同一项", "进场 280ms；格子展开 200ms grid-rows"]}
        tabs={HITL_REC_STATES.map((s) => ({
          id: s.id,
          label: ({ fold: "折叠", open: "展开", accepting: "写入中", written: "已写入", skipped: "已忽略", fail: "没写上" } as const)[s.id],
        }))}
        tab={rec}
        onTab={(id) => setRec(id as RecSpecimen)}
        standard={[
          { k: "slot", v: "widgets · gate settled" },
          { k: "see", v: recRow?.see ?? "" },
          { k: "action", v: recRow?.action ?? "" },
          { k: "挡住", v: recRow?.block ?? "" },
          { k: "copy", v: "推荐度 1–5；导航 CTA「查看笔记」炭黑" },
          { k: "不要", v: "高信心；柔黄主钮；挡住下一问" },
        ]}
        code={`<RecommendCard specimen="${rec}" />
<FillBtn>查看笔记</FillBtn>`}
      >
        <div className="sk-stack-gap">
          <RecommendCard specimen={rec} />
          {rec === "written" ? <FillBtn>查看笔记</FillBtn> : null}
        </div>
      </SpecimenRow>

      <SpecimenRow
        n="07"
        title="Context Card"
        lede="对话 [n] 旁浮出；你记过是已有笔记。失效卡留着，写「这条已经没了」。"
        px="kicker 11 · 标题 14 · 浮出 max 宽度列内 · 窄屏右对齐，距边 ≥12"
        xy={{ x: "浮出贴角标，不居中整列", y: "卡顶对齐角标行" }}
        forbid="可回看；网页 favicon 引用条塞进气泡；失效就从布局消失"
        checks={["你记过 ≠ 本轮 [n]", "同时只开一张", "失效文案「这条已经没了」", "0 条不渲染卡", "卡进场 280ms；角标浮出 160ms"]}
        tabs={[
          { id: "lookback", label: "你记过" },
          { id: "cite", label: "引用 [n]" },
          { id: "invalid", label: "失效" },
        ]}
        tab={ctx}
        onTab={setCtx}
        standard={[
          { k: "slot", v: ctx === "lookback" ? "lookback" : "source-list / 浮出" },
          { k: "copy", v: ctx === "invalid" ? "这条已经没了" : ctx === "lookback" ? "你记过" : "角标 [n]" },
          { k: "要", v: "同时只开一张。窄屏右对齐不超出 12px 边。" },
          { k: "不要", v: "可回看；网页 favicon 引用条塞进气泡" },
        ]}
        code={
          ctx === "lookback"
            ? `<ContextCard item={LOOKBACK_SOURCE} numbered={false} />`
            : ctx === "invalid"
              ? `<ContextCard item={SAP_SOURCES[0]} defaultOpen invalid />`
              : `<ContextCard item={SAP_SOURCES[0]} numbered defaultOpen />`
        }
      >
        {ctx === "lookback" ? (
          <div className="sk-lookback">
            <span className="sk-stem-kicker">你记过</span>
            <ContextCard item={LOOKBACK_SOURCE} numbered={false} />
          </div>
        ) : ctx === "invalid" ? (
          <ContextCard item={SAP_SOURCES[0]} numbered defaultOpen invalid />
        ) : (
          <ContextCard item={SAP_SOURCES[0]} numbered defaultOpen />
        )}
      </SpecimenRow>

      <SpecimenRow
        n="08"
        title="发现卡"
        lede="工具流落定。条形 / 进度 / 曲线 / 对照。空态不藏卡。"
        px="KindTag 11 · 标题 16/600 · 数字与单位同一 baseline · CTA 高 32"
        xy={{ x: "KindTag / 标题 / 数字 / 图 / CTA 左齐", y: "KindTag 与翻页中心；数字与单位 baseline" }}
        forbid="一次堆所有发现卡；空态把整卡删掉；拿发现卡当方法卡"
        checks={["四画法 + 空态", "单则藏翻页", "空态文案「这一轮没有新的错因」", "进场 280ms，widgets 里 delay 0"]}
        tabs={[
          { id: "bars", label: "条形" },
          { id: "progress", label: "进度" },
          { id: "curve", label: "曲线" },
          { id: "compare", label: "对照" },
          { id: "empty", label: "空" },
        ]}
        tab={insight}
        onTab={setInsight}
        standard={[
          { k: "slot", v: "widgets · tool settled" },
          { k: "KindTag", v: "发现" },
          { k: "空态", v: copyLock("发现卡空态") },
          { k: "翻页", v: "发现 N · 上一则/下一则。不一次堆所有卡。" },
          { k: "不要", v: "方法卡讲怎么做；发现卡只讲你错在哪" },
        ]}
        code={
          insight === "empty"
            ? `<InsightCards empty />`
            : `<InsightCards items={[INSIGHTS[${["bars", "progress", "curve", "compare"].indexOf(insight)}]]} />`
        }
      >
        {insight === "empty" ? (
          <InsightCards empty />
        ) : (
          <InsightCards items={[INSIGHTS[["bars", "progress", "curve", "compare"].indexOf(insight)]]} />
        )}
      </SpecimenRow>

      <SpecimenRow
        n="09"
        title="筛选表"
        lede="工具流落定对照。芯片重排行，不当导航、不当第六族。"
        px="表内筛芯片 · 单元格 ellipsis · 390 改卡片列表"
        xy={{ x: "表左齐正文", y: "芯片与表头中心" }}
        forbid="行跳路由；390 整页横滚；筛芯片做成第六族 pill"
        checks={["空态「没有这类错题」表还在", "点行只展开详情"]}
        tabs={[
          { id: "rows", label: "有行" },
          { id: "empty", label: "0 行" },
        ]}
        tab={filter}
        onTab={setFilter}
        standard={[
          { k: "slot", v: "widgets · tool settled" },
          { k: "空态", v: "没有这类错题" },
          { k: "390", v: "改成卡片列表，筛芯片横滑" },
          { k: "不要", v: "行跳路由；整页横滚" },
        ]}
        code={filter === "empty" ? `<FilterTable empty />` : `<FilterTable />`}
      >
        <FilterTable empty={filter === "empty"} />
      </SpecimenRow>

      <SpecimenRow
        n="10"
        title="方法卡 / 到你了"
        lede="讲题流落定。默认折叠。SIK-1086 COPY_LOCK：到你了 · 下一空自己选。"
        px="卡头 16/600 · KindTag 11 · 折叠只露一行 · 脚印在两张卡之后"
        xy={{ x: "KindTag 与标题同一行", y: "KindTag 与标题垂直中心" }}
        forbid="把「到你了」当标题；默认展开抢正文；挂在脚印下方"
        checks={["density=teach 且 settled 才出", "默认折叠", "标题锁「下一空自己选」", "KindTag 锁「方法」「到你了」", "展开用 200ms grid-rows，不要 display:none 硬切"]}
        standard={[
          { k: "slot", v: "widgets · teach settled" },
          { k: "copy", v: "方法 · 到你了 · 标题「下一空自己选」" },
          { k: "出现", v: "density=teach 且 phase=settled 且夹具有卡" },
          { k: "不要", v: "挂在脚印下方；把「到你了」当标题" },
        ]}
        code={`<MethodCard title="先看宾语，再看语气硬度" reason="…" />
<YouTryGate title="下一空自己选" items={["抑制萌芽", "遏制势头"]} />`}
      >
        <div className="sk-stack-gap">
          <MethodCard title="先看宾语，再看语气硬度" reason="「遏制」管已起的势头；空里要的是还没成形的苗头。" />
          <YouTryGate title="下一空自己选" items={["抑制萌芽", "遏制势头", "遏止蔓延"]} />
        </div>
      </SpecimenRow>

      <SpecimenRow
        n="11"
        title="PromptList"
        lede="下一问预选项。lucide + 文字，列、全宽。脚印之前。"
        px="行 12/1.4/500 · lucide 15 · 全宽无描边 · 行高约 36"
        xy={{ x: "lucide 左齐正文", y: "图标与文字垂直中心" }}
        forbid="描边 pill；秃行纯字；当数据标签；挂在脚印下"
        checks={["只出现在 widgets", "不是 composer"]}
        standard={[
          { k: "slot", v: "widgets" },
          { k: "要", v: "全宽无描边行" },
          { k: "不要", v: "数据标签；描边 pill；秃行纯字；挂在脚印下" },
        ]}
        code={`<PromptList items={["为什么不能选遏制", "对比近义", "做成今日计划"]} />`}
      >
        <PromptList items={[...FOLLOWUPS]} />
      </SpecimenRow>

      <SpecimenRow
        n="12"
        title="脚印"
        lede="落定控件之后。有帮助/没帮助/复制/重新生成/回放；有引用才出来源。"
        px="桌面 lucide 28 hover 才拉满 · 移动视觉 28 · 命中 44 常显 · 来源数字 11"
        xy={{ x: "图标行左齐正文；按钮等距", y: "图标垂直中心；来源数字与图标中心" }}
        forbid="streaming 出脚印；方法卡/到你了/PromptList 挂在脚印下"
        checks={["settled|stop 且有正文才出", "无引用不出来源钮", "点来源才展开列表"]}
        tabs={[
          { id: "plain", label: "无来源" },
          { id: "sources", label: "来源 N" },
        ]}
        tab={foot}
        onTab={setFoot}
        standard={[
          { k: "slot", v: "footprint · settled|stop 且有正文" },
          { k: "下方", v: "只允许点「来源 N」后的来源列表" },
          { k: "不要", v: "streaming 出脚印；把方法卡/到你了挂在脚印下" },
        ]}
        code={
          foot === "plain"
            ? `<AnswerFootprint sourceCount={0} />`
            : `<AnswerFootprint sourceCount={2} sourcesOn={false} onSources={() => {}} />`
        }
      >
        <AnswerFootprint
          sourceCount={foot === "plain" ? 0 : 2}
          sourcesOn={false}
          onSources={foot === "plain" ? undefined : () => undefined}
        />
      </SpecimenRow>

      <SpecimenRow
        n="13"
        title="ErrorBand"
        lede="失败不是停止。provider_unknown 不当成功。已出字只读。"
        px="条高约 36 · 重试钮 32 · 与 Dots error 同行块，不替代 Dots"
        xy={{ x: "左齐正文", y: "文案与重试垂直中心" }}
        forbid="当 cancelled；静默 fallback；已成功工具打叉"
        checks={["Dots 仍是 error", "已出字只读", "文案「生成未确认」或「这一轮没有写完」"]}
        standard={[
          { k: "copy", v: "生成未确认 / 这一轮没有写完 / 没写上" },
          { k: "要", v: "Dots error + 重试" },
          { k: "不要", v: "当 cancelled；静默 fallback" },
        ]}
        code={`<ErrorBand title="生成未确认" action="重试" />`}
      >
        <div className="sk-stack-gap">
          <TurnStatusLine state="error" copy="" status="error" />
          <ErrorBand title="生成未确认" action="重试" />
        </div>
      </SpecimenRow>

      <SpecimenRow
        n="14"
        title="Prompt Bar"
        lede="Composer：@来源、/命令、听写壳位、发送或停止。"
        px="桌面高 40 圆 12 字 14 栏内钮 32 · 移动行 44 字 14 · 圆钮视觉 32 命中 44"
        xy={{ x: "加号 / 输入 / 听写 / 发送同一栅格", y: "图标垂直中心" }}
        forbid="彩色接通点；假听写灌字；把 PromptList 做成 composer；canonical 发模型"
        checks={["来源槽只是布局", "空槽不占位", "失效芯片留着", "busy 发送位变停止"]}
        tabs={[
          { id: "pinned", label: "钉住" },
          { id: "empty", label: "空" },
          { id: "invalid", label: "失效" },
        ]}
        tab={bar}
        onTab={setBar}
        standard={[
          { k: "ticket", v: "SIK-1072" },
          { k: "要", v: "来源槽是布局。能否进上下文由主仓 DTO/ACL 决定。" },
          { k: "不要", v: "彩色接通点；假听写；把 PromptList 做成 composer" },
        ]}
        code={`<PromptBarSpecimen layout="${bar}" />`}
      >
        <PromptBarSpecimen layout={bar as "pinned" | "empty" | "invalid"} />
      </SpecimenRow>

      <SpecimenRow
        n="15"
        title="回合组装"
        lede="用户浅泡、助手非泡。四密加减块，不换皮。"
        px="主列 max 720 居中 · 用户泡 max 82% pad 8 12 半径 12/12/5/12"
        xy={{ x: "用户泡右对齐；助手通栏", y: "槽位严格按 TURN_SLOTS 顺序" }}
        forbid="InFlight/MessageList 拼盘；各宿主自绘过程条；按密度换色"
        checks={["short 无过程则零 chrome", "teach 才有 stem", "gate live 是 Approval 不是专家栈", "live/persisted/replay 槽序一致"]}
        tabs={[
          { id: "short", label: "短答" },
          { id: "tool", label: "工具" },
          { id: "teach", label: "讲题" },
          { id: "gate", label: "门卡" },
        ]}
        tab={density}
        onTab={(id) => setDensity(id as DensityId)}
        standard={[
          { k: "order", v: "用户泡 → 题面 → 回合态 → 专家栈|Approval → 正文 → 控件 → 脚印" },
          { k: "phase", v: "标本默认 settled；门卡看 live 才有确认门" },
        ]}
        code={`<DensityStream density="${density}" phase="${density === "gate" ? "live" : "settled"}" />`}
      >
        <DensityStream density={density} phase={density === "gate" ? "live" : "settled"} />
      </SpecimenRow>

      <SpecimenRow
        n="16"
        title="入口 AiMark"
        lede="Scene / Seed / Context / Rail / TopBar 共用 sunken 无边壳。无可见「AI」字。"
        px="32 / 36 / 44 三档。触控地板 44，半径升到 12。pencil=currentColor，spark=AI 蓝"
        xy={{ x: "标在顶栏/轨上，不是 FAB", y: "图标在 sunken 壳内居中" }}
        forbid="描边蓝 pill；可见「AI」字；眼镜笑脸当入口"
        checks={["五入口同一颗标", "展开态 ai-soft 洗"]}
        standard={[
          { k: "size", v: "32 / 36 / 44。触控地板 44。" },
          { k: "不要", v: "描边蓝 pill；可见「AI」字" },
        ]}
        code={`<SceneAiChip size={32} />
<SceneAiChip size={36} expanded />
<SceneAiChip size={44} />`}
      >
        <div className="sk-entry-row">
          <SceneAiChip size={32} label="Scene" interactive={false} />
          <SceneAiChip size={36} expanded label="Seed" interactive={false} />
          <SceneAiChip size={44} label="TopBar" interactive={false} />
        </div>
      </SpecimenRow>

      <SpecimenRow
        n="17"
        title="五族"
        lede="PromptList / StatusTag / ActionChip / KindTag / EntityChip。职责不许串。"
        px="StatusTag / ActionChip 填色无描边 · KindTag 11 无 soft fill · Entity 继承正文字号"
        xy={{ x: "各族按自己槽位左齐", y: "标签与相邻文字中心对齐" }}
        forbid="第六族 pill；PromptList 当筛选；ActionChip 当下一问；KindTag 当入口"
        checks={["五族职责表抄左边标本", "TurnStatus 不是第六族"]}
        standard={[
          { k: "PromptList", v: "下一问。全宽 lucide 行。" },
          { k: "StatusTag", v: "只读事实。不当按钮。" },
          { k: "ActionChip", v: "材料导航。填色无描边。" },
          { k: "KindTag", v: "卡头类型。无 soft fill。" },
          { k: "EntityChip", v: "正文链。不当 pill。" },
        ]}
        code={`<StatusTag tone="risk">近义干扰</StatusTag>
<ActionChip label="近义干扰表" />
<KindTag kind="suggest" />
<EntityChip title="遏制势头 / 抑制萌芽" />`}
      >
        <div className="sk-stack-gap">
          <div className="sk-stag-row">
            <StatusTag tone="ok">命中 2</StatusTag>
            <StatusTag tone="risk">近义干扰</StatusTag>
          </div>
          <div className="sk-achip-stack">
            <ActionChip label="近义干扰表" />
            <ActionChip label="逻辑填空错题" />
          </div>
          <div className="sk-inline-gap">
            <KindTag kind="suggest" />
            <KindTag kind="input" />
            <KindTag kind="action" />
            <KindTag kind="data" />
          </div>
          <p className="sk-prose">
            搭配记在 <EntityChip title="遏制势头 / 抑制萌芽" />。
          </p>
        </div>
      </SpecimenRow>

      <SpecimenRow
        n="18"
        title="出现动画"
        lede="卡片怎么进场、怎么错开、怎么展开。禁止弹跳、弹性、扫光。点「重放出现」核对。"
        px="卡片 280ms · 行 200ms · 浮出 160ms · 折叠 200ms · 点选等待 480ms · 错开 60ms×n"
        xy={{ x: "只在 Y 上移入，不左右晃", y: "scale .98 → 1，不要 overshoot" }}
        forbid="弹跳 bounce；弹簧 spring；扫光 shimmer 进场；自造时长"
        checks={[
          "确认门/推荐/发现/筛选/方法/到你了/Context 都走 sk-card-enter",
          "widgets 第 n 张 delay n×60ms",
          "方法/到你了展开是 grid-rows 200ms，不是 display 切换",
          "prefers-reduced-motion 全关",
        ]}
        tabs={[
          { id: "gate", label: "活时门" },
          { id: "settled", label: "落定栈" },
          { id: "lookback", label: "你记过" },
        ]}
        tab={motion}
        onTab={setMotion}
        standard={ENTER_MOTION.map((row) => ({ k: row.id, v: `${row.dur} · ${row.when}` }))}
        code={`/* 卡片进场 */
animation: sk-card-enter 280ms var(--ease-out) both;
/* widgets 错开 */
.sk-turn-widgets > *:nth-child(n) { animation-delay: calc((n - 1) * 60ms); }
/* 折叠 */
grid-template-rows: 0fr → 1fr; transition: 200ms;`}
      >
        <div className="spec-bui-motion">
          <button type="button" className="spec-bui-replay" onClick={() => setMotionTick((n) => n + 1)}>
            重放出现
          </button>
          <div key={`${motion}-${motionTick}`}>
            {motion === "gate" ? (
              <ProposalCard blocking specimen="idle" title="写入笔记前先确认" reason="接下来会把这组近义记进今日计划。" />
            ) : motion === "lookback" ? (
              <div className="sk-lookback">
                <span className="sk-stem-kicker">你记过</span>
                <ContextCard item={LOOKBACK_SOURCE} numbered={false} />
              </div>
            ) : (
              <div className="sk-turn-widgets">
                <InsightCards items={[INSIGHTS[0]]} />
                <MethodCard title="先看宾语，再看语气硬度" reason="「遏制」管已起的势头；空里要的是还没成形的苗头。" />
                <YouTryGate title="下一空自己选" items={["抑制萌芽", "遏制势头", "遏止蔓延"]} />
                <PromptList items={[...FOLLOWUPS]} />
                <AnswerFootprint sourceCount={2} onSources={() => undefined} />
              </div>
            )}
          </div>
        </div>
      </SpecimenRow>

      <SpecimenRow
        n="19"
        title="产品 widget 帧"
        lede="sikao 已有的 type:widget 帧。共用 KindTag「数据」壳，不是第六族，也不是发现卡换皮。"
        px="壳 pad 12 radius 12 · 头 KindTag 数据 + title 12/600 · dock 内容约 340–360"
        xy={{ x: "KindTag / 标题左齐；scope 右对齐 tiny", y: "头一行垂直中心" }}
        forbid="未知 kind 画空白卡；一回合堆多张；给 widget 另造皮肤；柔黄去练"
        checks={["13 kind 全在 tab 里", "每回合最多 1 张", "未知 fail-soft", "settled 默认折，live 首次开", "去练炭黑 CTA"]}
        tabs={[
          ...PRODUCT_WIDGETS.map((w) => ({ id: w.id, label: w.title.replace(/（.*）/, "").slice(0, 6) })),
          { id: "unknown", label: "未知" },
        ]}
        tab={widget}
        onTab={(id) => setWidget(id as ProductWidgetId | "unknown")}
        standard={[
          { k: "kind", v: widget },
          { k: "tag", v: widget === "unknown" ? "—" : "KindTag「数据」" },
          { k: "CTA", v: widgetSpec?.ask ? `${widgetSpec.ask} · 炭黑填` : "无 CTA。不是每张都去练" },
          { k: "viz", v: widgetSpec?.viz ?? "—" },
          { k: "note", v: widgetSpec?.note ?? "fail-soft 不渲染" },
          { k: "ticket", v: "SIK-395 / 756 · 帧在 sikao contracts/ai-widget-frames.json" },
        ]}
        code={
          widget === "unknown"
            ? `{ "type": "widget", "widget": "not_a_kind" } // 不渲染`
            : `<ProductWidget kind="${widget}" folded={false} />`
        }
      >
        <ProductWidget kind={widget} folded={false} />
      </SpecimenRow>

      <SpecimenRow
        n="20"
        title="1440 / 390 壳"
        lede="左边上下两壳对读。390 走 MOBILE_CHROME + MOBILE_TYPE：44 是命中，输入仍 14，不要撑到 16。"
        px="1440：40/14 · 32/12 · 28/11  ·  390：44/14 · 32/44 · 13 辅文 · 28/44 · 11"
        xy={{
          x: "Dots 16 列左齐正文。换壳不改这条 X。",
          y: "Dots / 文案 / 时长同一行中心。390 不放大点阵。",
        }}
        forbid="整列 scale；正文降到 13；占位撑到 16；390 用桌面浮层；44 方块钮；translate 补齐"
        checks={[
          "先 X 16 列，再 Y 中心",
          "只换 LAYOUT_SCALE / TYPE_SCALE，禁止 scale",
          "390 正文仍 14，输入 14/18/400，辅文 13",
          "390 用 sheet，不用浮层",
          "44 是命中，不是 44×44 方块",
        ]}
        standard={[
          ...MOBILE_CHROME_ROWS.map((row) => ({
            k: row.slot,
            v: `${row.visual}  /  ${row.hit}`,
          })),
          ...MOBILE_TYPE_ROWS.map((row) => ({
            k: row.slot,
            v: `Web ${row.web}  ·  iOS ${row.ios}`,
          })),
        ]}
        code={`<ViewportShell />`}
      >
        <ViewportShell />
      </SpecimenRow>
    </div>
  );
}
