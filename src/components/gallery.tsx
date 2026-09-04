import { useState } from "react";
import { SpecimenRow } from "@/components/specimen-row";
import { PromptBarSpecimen, type PromptBarLayout } from "@/renderer/PromptBarSpecimen";
import { ProductWidget } from "@/renderer/ProductWidget";
import { DensityStream } from "@/renderer/TurnRenderer";
import { ViewportShell } from "@/renderer/ViewportShell";
import { SessionManagerSpecimen, type SessionMgrState } from "@/renderer/SessionManagerSpecimen";
import {
  DockFrame,
  ShellOpenSpecimen,
  ShellPlaceSpecimen,
  type ShellEntry,
  type ShellSceneId,
} from "@/renderer/DockFrame";
import { PRODUCT_WIDGETS, type ProductWidgetId } from "@/contract/widgets";
import {
  MOBILE_CHROME_ROWS,
  MOBILE_TYPE_ROWS,
  BAR_STATUS,
  PAGE_LOCATOR,
  SESSION_MANAGER,
  SESSION_MANAGER_ROWS,
  SESSION_MANAGER_STATES,
  SHELL_OPEN,
  SHELL_PLACES,
  SHELL_PRESET,
  SHELL_SCENES,
  type DockPlace,
} from "@/contract/shell";
import {
  EXPERTS,
  FOLLOWUPS,
  INSIGHTS,
  LOOKBACK_SOURCE,
} from "@/player/fixtures/content";
import { copyLock, ENTER_MOTION, RENDERER_PACK, TURN_RHYTHM_ROWS, type DensityId, type DotsState } from "@/contract/turn";
import { CITE_ROWS, CITE_STATES } from "@/contract/cite";
import { CiteSpecimen, type CiteMode } from "@/renderer/CiteSpecimen";
import { HITL_APPROVE_STATES, HITL_REC_STATES } from "@/contract/scenes";
import type { ApproveSpecimen, RecSpecimen } from "@/components/stream/primitives";
import {
  ActionChip,
  AnswerFootprint,
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
  FollowupFold,
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
  const [bar, setBar] = useState<PromptBarLayout>("locator");
  const [prose, setProse] = useState<CiteMode>("open");
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
  const [sess, setSess] = useState<SessionMgrState>("open");
  const [entry, setEntry] = useState<ShellEntry>("scene");
  const [welcomeHost, setWelcomeHost] = useState<ShellSceneId>("overview");
  const [presetWhere, setPresetWhere] = useState<"empty" | "turn">("empty");
  const [dockPlace, setDockPlace] = useState<DockPlace>("float");
  const [sceneHost, setSceneHost] = useState<ShellSceneId>("overview");
  const widgetSpec = widget === "unknown" ? null : PRODUCT_WIDGETS.find((w) => w.id === widget);
  const sessRow = SESSION_MANAGER_STATES.find((s) => s.id === sess);
  const welcomeMeta = SHELL_SCENES.find((s) => s.id === welcomeHost);
  const sceneMeta = SHELL_SCENES.find((s) => s.id === sceneHost);

  const gateRow = HITL_APPROVE_STATES.find((s) => s.id === gate);
  const recRow = HITL_REC_STATES.find((s) => s.id === rec);

  return (
    <div className="spec-page spec-bui-page">
      <header className="spec-hero">
        <span className="spec-kicker">SIK-1086 及关联票 · 渲染器整包</span>
        <h1 className="spec-h1">Agent 前端渲染器视觉合约</h1>
        <p className="spec-lede">
          开发按编号抄左边标本、右边标准与代码。漏一块、漏一态都不算交付。01–20 是回合内皮；21–26 是壳：点开、欢迎、预选项、会话管理器、三壳、各场景、Path A 390。票面：1066 文案、1067 密度、1068 Turn、1070 来源、1072 壳、1086 双轴/讲题卡、1040 运行时、1045 Dots、1050 Path A。
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
        lede="SIK-1070。点 [n] 是浮层 popover，叠在脚印上，不把 footer 顶下去。列表才在脚印下占流。"
        px="正文 14/1.75 · 角标 16 槽 10/700 略抬 · 浮层 360 · 进场 160ms · 脚印位置开合不变"
        xy={{ x: "正文左 = Dots 左。浮层贴角标，不居中整列", y: "角标与行 baseline 对齐。卡叠在脚印之上，脚印不让位" }}
        forbid="streaming 出 [n]；展开推进 footer；结果页扫卡塞进气泡；favicon 条；列表排在 prose 前"
        checks={[
          "streaming 无角标",
          "settled 才出 [n]",
          "浮层不占文档流",
          "开合时脚印位置不变",
          "同时只开一张",
          "Esc / 再点 / 点外关",
          "左右切 n",
          "失效角标仍在，卡写「这条已经没了」",
          "来源列表只在脚印下占流",
        ]}
        tabs={CITE_STATES.map((s) => ({
          id: s.id,
          label: ({ streaming: "出字", settled: "落定", open: "浮出", invalid: "失效", none: "无引用", list: "脚印列表" } as const)[s.id],
        }))}
        tab={prose}
        onTab={(id) => setProse(id as CiteMode)}
        standard={[
          { k: "see", v: CITE_STATES.find((s) => s.id === prose)?.see ?? "" },
          { k: "rule", v: CITE_STATES.find((s) => s.id === prose)?.rule ?? "" },
          ...CITE_ROWS.map((row) => ({ k: row.slot, v: `${row.do} / 禁止 ${row.dont}` })),
        ]}
        code={`<CiteSpecimen mode="${prose}" />`}
      >
        <CiteSpecimen mode={prose} />
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
        px="纯色 sunk 无发丝 · 问句 16/600 · KindTag 11 白底 · 选项 36 · 圈 16 描边 1.5 · 主钮 32 · 底栏实色块"
        xy={{ x: "KindTag 与问句同一行；选项左齐卡片 inset 16，不缩进问句列", y: "KindTag 与问句垂直中心；选项行高 36" }}
        forbid="铺满奶黄；顶条左缘色条；发丝描边；底栏 1px 线；两列把选项缩进问句下；落定后再挂一张审批；柔黄导航 CTA"
        checks={["八态全画", "480ms 内可改选", "fail 仍挡住", "ok/skip 才放行", "KindTag 写「确认」不是「审批」", "纯色块无发丝、无左缘色条", "KindTag+问句同一行，选项通栏", "进场 280ms y12 scale.98，禁止弹跳"]}
        tabs={HITL_APPROVE_STATES.map((s) => ({
          id: s.id,
          label: ({ idle: "未选", picked: "已选", submit: "提交中", ok: "已写入", skip: "已忽略", fail: "没写上", invalid: "无效", reopen: "再问" } as const)[s.id],
        }))}
        tab={gate}
        onTab={(id) => setGate(id as ApproveSpecimen)}
        standard={[
          { k: "slot", v: "approval · gate + live。15 门卡 tab 默认这一态。" },
          { k: "see", v: gateRow?.see ?? "" },
          { k: "action", v: gateRow?.action ?? "" },
          { k: "挡住", v: gateRow?.block ?? "" },
          { k: "皮", v: "整卡纯色 sunk，禁止 inset 发丝。底栏另铺一块略深实色，不用 1px 线切开。" },
          { k: "顶条", v: "「先选一下，选完才往下写」。奶黄纯色条。禁止左缘色条、禁止铺满整卡。" },
          { k: "布局", v: "KindTag「确认」+ 问句同一行。提示、选项通栏，左齐卡片 inset。不是 KindTag 一列、选项缩进问句下。" },
          { k: "字", v: "问句 16/600。选项 14、行高 36。圈 16、描边 1.5 实色。KindTag 11 白底芯片。" },
          { k: "钮", v: "提交视觉 32。未选灰实色块，已选炭黑填。不要发丝圈。" },
          { k: "copy", v: copyLock("活时门提示") },
          { k: "KindTag", v: copyLock("门卡 KindTag") },
          { k: "不要", v: "铺满奶黄；左缘色条；发丝线；两列缩进；落定后再挂一张审批；KindTag 写成「审批」" },
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
        px="纯色 sunk 无发丝 · 问句 16/600 · KindTag 11 白底 · 推荐度 5 点 · 主建议与推荐度同一行中心"
        xy={{ x: "KindTag 与问句同一行；主建议与推荐度两端", y: "KindTag 与问句中心；推荐度与主标题中心" }}
        forbid="高信心；柔黄主钮；挡住下一问；发丝描边；把 Decision Markdown 再画一张审批"
        checks={["六态全画", "落定不挡", "写入中主钮 disabled", "失败幂等重试同一项", "进场 280ms；格子展开 200ms grid-rows"]}
        tabs={HITL_REC_STATES.map((s) => ({
          id: s.id,
          label: ({ fold: "折叠", open: "展开", accepting: "写入中", written: "已写入", skipped: "已忽略", fail: "没写上" } as const)[s.id],
        }))}
        tab={rec}
        onTab={(id) => setRec(id as RecSpecimen)}
        standard={[
          { k: "slot", v: "widgets · gate settled。15 门卡下一帧才到这张。" },
          { k: "see", v: recRow?.see ?? "" },
          { k: "action", v: recRow?.action ?? "" },
          { k: "挡住", v: recRow?.block ?? "" },
          { k: "皮", v: "纯色 sunk，禁止发丝。主建议/芯片是白实色块，不是描边 pill。" },
          { k: "布局", v: "KindTag「建议」+ 问句同一行。主建议左、推荐度右，推荐度与主标题垂直中心。" },
          { k: "字", v: "问句 16/600。KindTag 11 白底。推荐度 1–5 点，空点用 border-strong 实色。" },
          { k: "CTA", v: "接受炭黑填。查看笔记只在 written，炭黑 FillBtn，禁止柔黄、禁止泄漏实验室文案。" },
          { k: "不要", v: "高信心；柔黄主钮；挡住下一问；发丝线；实验室 meta 进流" },
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
        lede="你记过是已有笔记，不是本轮 [n]。本轮引用浮出见 03。失效卡留着，写「这条已经没了」。"
        px="纯色 sunk 无发丝 · kicker 11 在卡外 · 标题 13/500 · 字数 11 · 内边距 16 · 半径 12 · 卡内标 16"
        xy={{ x: "卡左 = 正文左；卡内笔记标 16。不是 16 列空槽假 ico", y: "kicker 与卡 gap 6；头一行垂直中心" }}
        forbid="可回看；网页 favicon 引用条塞进气泡；失效就从布局消失；把你记过画成本轮 [n]；拼装里改成折叠行"
        checks={["你记过 ≠ 本轮 [n]", "0 条不渲染卡", "失效文案「这条已经没了」", "卡进场 280ms"]}
        tabs={[
          { id: "lookback", label: "你记过" },
          { id: "invalid", label: "失效" },
        ]}
        tab={ctx}
        onTab={setCtx}
        standard={[
          { k: "slot", v: "lookback · 15 讲题/工具/门卡落定都出这一张" },
          { k: "copy", v: ctx === "invalid" ? "这条已经没了" : "你记过" },
          { k: "皮", v: "kicker 在卡外。卡是纯色 sunk 笔记卡，无发丝。拼装不许改成折叠行或裸 stream row。" },
          { k: "要", v: "落定 0–2 张。编号关。不是本轮 [n]。摘录两行 clamp。" },
          { k: "不要", v: "可回看；画成本轮角标；favicon 条；拼装换皮" },
        ]}
        code={
          ctx === "invalid"
            ? `<ContextCard item={LOOKBACK_SOURCE} numbered={false} defaultOpen invalid />`
            : `<ContextCard item={LOOKBACK_SOURCE} numbered={false} />`
        }
      >
        <div className="sk-lookback">
          <span className="sk-lookback-kicker">你记过</span>
          <ContextCard
            item={LOOKBACK_SOURCE}
            numbered={false}
            defaultOpen
            invalid={ctx === "invalid"}
          />
        </div>
      </SpecimenRow>

      <SpecimenRow
        n="08"
        title="发现卡"
        lede="工具流落定。条形 / 进度 / 曲线 / 对照。空态不藏卡。"
        px="纯色 sunk 无发丝 · KindTag 11 白底 · 标题 16/600 · 数字与单位 baseline · 条 6px · CTA 高 32"
        xy={{ x: "KindTag / 标题 / 数字 / 图 / CTA 左齐 inset 16", y: "KindTag 与翻页中心；数字与单位 baseline" }}
        forbid="一次堆所有发现卡；空态把整卡删掉；拿发现卡当方法卡；发丝描边"
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
          { k: "slot", v: "widgets · tool settled。15 工具落定最多 1 张。" },
          { k: "皮", v: "纯色 sunk，禁止发丝。条 6px 实色，不要 4px 半透明。" },
          { k: "布局", v: "KindTag「发现」/ 标题 / 数字 / 图 / CTA 左齐 inset 16。" },
          { k: "字", v: "标题 16/600。KindTag 11 白底。数字与单位同一 baseline。" },
          { k: "空态", v: copyLock("发现卡空态") },
          { k: "翻页", v: "发现 N · 上一则/下一则。不一次堆所有卡。" },
          { k: "不要", v: "方法卡讲怎么做；发现卡只讲你错在哪；发丝线；一回合多张" },
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
        px="纯色 sunk 无发丝 · 表头 16/600 · KindTag 11 白底 · 芯片实色块 · 首列 500 · 390 改卡片"
        xy={{ x: "表左齐正文；KindTag 与表头同一行", y: "芯片与表头垂直中心" }}
        forbid="行跳路由；390 整页横滚；筛芯片做成第六族 pill；发丝描边"
        checks={["空态「没有这类错题」表还在", "点行只展开详情"]}
        tabs={[
          { id: "rows", label: "有行" },
          { id: "empty", label: "0 行" },
        ]}
        tab={filter}
        onTab={setFilter}
        standard={[
          { k: "slot", v: "widgets · tool settled" },
          { k: "皮", v: "纯色 sunk，禁止发丝。筛芯片白实色块，选中炭黑填。" },
          { k: "字", v: "表头 16/600。KindTag 11 白底。首列 500 主色，其余 secondary。" },
          { k: "空态", v: "没有这类错题。表壳还在，不要删卡。" },
          { k: "390", v: "改成卡片列表，筛芯片横滑。禁止整页横滚。" },
          { k: "不要", v: "行跳路由；整页横滚；第六族 pill；发丝线" },
        ]}
        code={filter === "empty" ? `<FilterTable empty />` : `<FilterTable />`}
      >
        <FilterTable empty={filter === "empty"} />
      </SpecimenRow>

      <SpecimenRow
        n="10"
        title="方法卡 / 到你了"
        lede="折叠 hug 沉底。独立标本和回合组装同一皮，拼装不许改成透明通栏。"
        px="折叠 hug 5×8 半径 10 宽≤36ch · KindTag 10 · 标题 13 · 展开才通栏 pad 12"
        xy={{ x: "条左 = 正文左。KindTag 与标题同一行。独立标本 = 15 拼装", y: "KindTag 与标题垂直中心" }}
        forbid="流内改透明通栏；把「到你了」当标题；默认展开抢正文；挂在脚印下方；双 lucide"
        checks={["density=teach 且 settled 才出", "默认折叠 hug 沉底", "15 拼装同一皮，不许透明通栏", "标题锁「下一空自己选」", "KindTag 锁「方法」「到你了」", "展开用 200ms grid-rows，不要 display:none 硬切"]}
        standard={[
          { k: "slot", v: "widgets · teach settled" },
          { k: "皮", v: "折叠 hug 沉底条。pad 5 8、半径 10。独立标本和 15 拼装必须同一皮。" },
          { k: "copy", v: "KindTag「方法」「到你了」。到你了标题锁「下一空自己选」。" },
          { k: "下一问", v: "FollowupFold 同样 hug 沉底，不是全宽透明行。展开才出 PromptList（见 11）。" },
          { k: "出现", v: "density=teach 且 phase=settled。默认折叠。展开 grid-rows 200ms。" },
          { k: "不要", v: "流内改透明通栏；双 lucide；挂在脚印下方；把「到你了」当标题；display:none 硬切" },
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
          { k: "slot", v: "widgets · 展开后的列表" },
          { k: "折叠", v: "流内默认是 FollowupFold hug 条（见 10/15）。本标本只画展开后的全宽行。" },
          { k: "要", v: "全宽无描边 lucide 行。行高约 36。" },
          { k: "不要", v: "把折叠态画成本标本；数据标签；描边 pill；秃行纯字；挂在脚印下" },
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
            : `<CiteSpecimen mode="list" />`
        }
      >
        {foot === "plain" ? (
          <AnswerFootprint sourceCount={0} />
        ) : (
          <CiteSpecimen mode="list" />
        )}
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
        lede="芯片行是可扩展 status + @来源。正在看是第一种：AI 蓝、三点呼吸。加新状态只在 BAR_STATUS 加一行。"
        px="芯片高 24 · kicker 11/600 · 路径 12/500 · 点 4px · 呼吸 1.4s · 输入 40/14"
        xy={{ x: "status 最左，@来源在右。加号/输入/听写/发送同一栅格", y: "芯片与输入格左齐。三点与文案垂直中心" }}
        forbid="status 进 dock 顶栏；两种芯片合成一颗；为新状态另造皮；彩色接通点；假听写"
        checks={[
          "正在看在芯片行，AI 蓝 + 呼吸点",
          "切面只改 path",
          "未保存叠 extra，不另造皮",
          "无芯片则行不占位",
          "新 kind 只加 BAR_STATUS 一行",
        ]}
        tabs={[
          { id: "locator", label: "正在看" },
          { id: "both", label: "看+来源" },
          { id: "dirty", label: "未保存" },
          { id: "listening", label: "正在听" },
          { id: "empty", label: "空" },
          { id: "invalid", label: "失效" },
        ]}
        tab={bar}
        onTab={(id) => setBar(id as PromptBarLayout)}
        standard={[
          { k: "位置", v: PAGE_LOCATOR.where },
          { k: "字", v: PAGE_LOCATOR.type },
          ...Object.values(BAR_STATUS).map((s) => ({
            k: s.id,
            v: `${s.kicker} · ${s.tone} · ${s.mark}/${s.motion} · ${s.note}`,
          })),
        ]}
        code={
          bar === "listening"
            ? `<PromptBarSpecimen chips={[{ type: "status", status: "listening" }]} />`
            : bar === "dirty"
              ? `<PromptBarSpecimen chips={[{ type: "status", status: "looking", path: "资料题同比 · 笔记", extra: "未保存" }]} />`
              : bar === "both"
                ? `<PromptBarSpecimen chips={[{ type: "status", status: "looking", path: "总览" }, { type: "source", label: "@错题库" }]} />`
                : `<PromptBarSpecimen chips={[{ type: "status", status: "looking", path: "总览" }]} />`
        }
      >
        <PromptBarSpecimen layout={bar} />
      </SpecimenRow>

      <SpecimenRow
        n="15"
        title="回合组装"
        lede="题面是引用块，你记过是笔记卡，方法/到你了/下一问是 hug 沉底条，和 10 同一皮。夹具在回合下方。"
        px="stem→Dots 12 · Dots→正文 16 · 正文→你记过 16 · 卡组 12 · 折叠 2 · 脚印 16"
        xy={{
          x: "题面/你记过/折叠条左齐正文。Dots 自己 16 列。折叠条不换皮。",
          y: "每行 ico / 文案 / chevron 垂直中心。用户泡单独一行在上。",
        }}
        forbid="InFlight/MessageList 拼盘；一回合堆多张数据卡；各宿主自绘过程条；按密度换色"
        checks={["short 无过程则零 chrome", "teach 才有 stem", "每回合最多 1 张数据卡", "gate live 是 Approval 不是专家栈", "方法/到你了/下一问与 10 同一 hug 皮", "数据卡纯色无发丝", "夹具在回合下方", "live/persisted/replay 槽序一致"]}
        tabs={[
          { id: "short", label: "短答" },
          { id: "tool", label: "工具" },
          { id: "teach", label: "讲题" },
          { id: "gate", label: "门卡" },
        ]}
        tab={density}
        onTab={(id) => setDensity(id as DensityId)}
        standard={[
          { k: "order", v: "用户泡 → 题面 → Dots → 正文 → 你记过 → 折叠组 → 脚印" },
          { k: "皮", v: "题面引用块、你记过笔记卡、方法/到你了/下一问 hug 沉底，与 07/10 同一皮。数据卡纯色 sunk，禁止发丝。拼装不许换皮。" },
          { k: "夹具", v: "播放/下一帧/重放在回合下方，标「夹具」。禁止放左上角当产品控件。" },
          { k: "门卡", v: "tab 默认 live 确认门（等你选）。落定才是推荐卡。确认门抄 05，不要自造两列缩进。" },
          { k: "工具", v: "落定最多 1 张发现卡。发现卡→下一问 12，不是折叠行距 2。" },
          ...TURN_RHYTHM_ROWS.map((row) => ({
            k: `${row.from}→${row.to}`,
            v: `${row.gap}px · ${row.why}`,
          })),
        ]}
        code={`<DensityStream density="${density}" playable />`}
      >
        <DensityStream density={density} playable />
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
          "确认门/推荐/发现/筛选/Context/方法/到你了 走 sk-card-enter；拼装不换皮",
          "widgets 第 n 张 delay n×60ms",
          "方法/到你了/下一问展开是 grid-rows 200ms，不是 display 切换",
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
                <span className="sk-lookback-kicker">你记过</span>
                <ContextCard item={LOOKBACK_SOURCE} numbered={false} />
              </div>
            ) : (
              <div className="sk-turn-col">
                <div className="sk-turn-widgets">
                  <InsightCards items={[INSIGHTS[0]]} />
                  <MethodCard title="先看宾语，再看语气硬度" reason="「遏制」管已起的势头；空里要的是还没成形的苗头。" />
                  <YouTryGate title="下一空自己选" items={["抑制萌芽", "遏制势头", "遏止蔓延"]} />
                  <FollowupFold items={[...FOLLOWUPS]} />
                  <AnswerFootprint sourceCount={2} onSources={() => undefined} />
                </div>
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

      <SpecimenRow
        n="21"
        title="点开"
        lede={SHELL_OPEN.trigger}
        px="Scene 32 · Seed 36 · Rail 32 · TopBar 44。触控地板 44。"
        xy={{ x: "标在顶栏/轨上，不是 FAB", y: "图标在 sunken 壳内居中" }}
        forbid={SHELL_OPEN.not}
        checks={["五入口同一颗标", "aria-expanded 跟壳", "展开态 ai-soft", "280ms 开合，reduced-motion 关"]}
        tabs={[
          { id: "scene", label: "Scene 32" },
          { id: "seed", label: "Seed 36" },
          { id: "rail", label: "Rail" },
          { id: "top", label: "TopBar 44" },
        ]}
        tab={entry}
        onTab={(id) => setEntry(id as ShellEntry)}
        standard={[
          { k: "动效", v: SHELL_OPEN.motion },
          { k: "展开", v: SHELL_OPEN.expanded },
          { k: "不要", v: SHELL_OPEN.not },
        ]}
        code={
          entry === "seed"
            ? `<DockFrame surface="welcome" />`
            : `<SceneAiChip size={${entry === "top" ? 44 : 32}} expanded />`
        }
      >
        <ShellOpenSpecimen entry={entry} />
      </SpecimenRow>

      <SpecimenRow
        n="22"
        title="欢迎与预选项"
        lede={SHELL_PRESET.emptyWhere}
        px={`${SHELL_PRESET.type} · 空会话 ${SHELL_PRESET.maxEmpty} · 回合 ${SHELL_PRESET.maxTurn}`}
        xy={{ x: "lucide 16 列左齐欢迎文案", y: "欢迎贴 composer 之上，不是贴顶" }}
        forbid={SHELL_PRESET.not}
        checks={[
          "空会话：欢迎 + 预选项在 composer 上",
          "回合下一问在 widgets，脚印前",
          "N−1 条 inset 短线，末行无线",
          "无描边 pill",
          "每场景一份，禁止三处各挂",
        ]}
        tabs={[
          { id: "empty", label: "空会话" },
          { id: "turn", label: "回合下一问" },
        ]}
        tab={presetWhere}
        onTab={(id) => setPresetWhere(id as "empty" | "turn")}
        standard={[
          { k: "空会话", v: SHELL_PRESET.emptyWhere },
          { k: "回合", v: SHELL_PRESET.turnWhere },
          { k: "样式", v: SHELL_PRESET.style },
          { k: "欢迎", v: welcomeMeta ? `${welcomeMeta.hello} · ${welcomeMeta.placeholder}` : "" },
        ]}
        code={`<DockFrame surface="${presetWhere === "turn" ? "thread" : "welcome"}" scene="${welcomeHost}" />`}
      >
        <div className="spec-bui-host-tabs">
          {SHELL_SCENES.map((s) => (
            <button
              key={s.id}
              type="button"
              data-active={welcomeHost === s.id}
              onClick={() => setWelcomeHost(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <DockFrame
          place={welcomeMeta?.defaultPlace ?? "float"}
          scene={welcomeHost}
          surface={presetWhere === "turn" ? "thread" : "welcome"}
        />
      </SpecimenRow>

      <SpecimenRow
        n="23"
        title="会话管理器"
        lede={SESSION_MANAGER.does}
        px="入口高 32 · 标题 14/600 ellipsis · chevron 12 · 行 36/12 · 390 行 44/14 · 删除桌面 hover、窄屏常显"
        xy={{
          x: "AiMark 左 · 标题按钮吃掉中间 · 钉/收起右齐",
          y: "下拉卡顶贴标题底 4px，thread 仍可见。",
        }}
        forbid="feed 里第二组切换器；铺满面板；portal 出 dock；role=menu；tooltip 写「会话管理」；localStorage；390 Path A 挂上"
        checks={[
          "标题整块可点，可及名=可见标题",
          "popover 贴标题，宽 260，不铺满",
          "今天 / 更早；当前 sunk，不是 pill",
          "新对话在列表顶",
          "canonical 不写 localStorage",
          "390 Path A 不挂",
        ]}
        tabs={SESSION_MANAGER_STATES.map((s) => ({
          id: s.id,
          label: ({ closed: "收起", open: "打开", empty: "空", long: "长名", ios: "390" } as const)[s.id],
        }))}
        tab={sess}
        onTab={(id) => setSess(id as SessionMgrState)}
        standard={[
          { k: "see", v: sessRow?.see ?? "" },
          { k: "rule", v: sessRow?.rule ?? "" },
          { k: "票", v: SESSION_MANAGER.ticket },
          ...SESSION_MANAGER_ROWS.map((row) => ({ k: row.slot, v: `${row.do} / 禁止 ${row.dont}` })),
        ]}
        code={`<SessionManagerSpecimen state="${sess}" />`}
      >
        <SessionManagerSpecimen state={sess} />
      </SpecimenRow>

      <SpecimenRow
        n="24"
        title="浮层 / 右栏 / sheet"
        lede="同一套皮，只换壳位。流内皮仍是同一 Turn，不另起过程条。"
        px="float 392×580 右下 · rail occupied-width · sheet 360 底 + handle"
        xy={{ x: "float/rail 不挡主列阅读起点；sheet 通栏左右 16", y: "composer 钉底。键盘避让只在 sheet。" }}
        forbid="两套壳同时开；390 用桌面浮层；FAB；流内皮另画过程条"
        checks={[
          "float 不占主列",
          "rail 浮层钮改 PiP",
          "sheet handle + 底，输入 14",
          "同一时刻一个壳",
        ]}
        tabs={SHELL_PLACES.map((p) => ({ id: p.id, label: p.label }))}
        tab={dockPlace}
        onTab={(id) => setDockPlace(id as DockPlace)}
        standard={SHELL_PLACES.map((p) => ({ k: p.label, v: `${p.geometry} · ${p.note}` }))}
        code={`<DockFrame place="${dockPlace}" surface="welcome" />`}
      >
        <ShellPlaceSpecimen place={dockPlace} />
      </SpecimenRow>

      <SpecimenRow
        n="25"
        title="各场景欢迎"
        lede="换场景只换欢迎语、占位、预选项。不换皮、不另起过程条。"
        px="欢迎 14/600 · 预选项 12/500 · 占位跟 Prompt Bar"
        xy={{ x: "Seed 36 左、欢迎文案中。lucide 左齐。", y: "欢迎贴底，composer 之下不再挂预选项。" }}
        forbid="按场景换肤；Guided 预选项进材料/方向；Path A 390 挂预选项；三处各一份"
        checks={[
          "六场景欢迎语不同",
          "Guided 只在对话轨",
          "Path A 桌面 Modal+同一 dock",
          "占位写在输入条，不写在欢迎里重复",
        ]}
        tabs={SHELL_SCENES.map((s) => ({ id: s.id, label: s.label }))}
        tab={sceneHost}
        onTab={(id) => setSceneHost(id as ShellSceneId)}
        standard={[
          { k: "欢迎", v: sceneMeta?.hello ?? "" },
          { k: "占位", v: sceneMeta?.placeholder ?? "" },
          { k: "预选", v: sceneMeta?.presets.join(" · ") ?? "" },
          { k: "位置", v: sceneMeta?.where ?? "" },
          { k: "默认壳", v: sceneMeta?.defaultPlace ?? "" },
        ]}
        code={`<DockFrame scene="${sceneHost}" place="${sceneMeta?.defaultPlace ?? "float"}" surface="welcome" />`}
      >
        <DockFrame
          place={sceneMeta?.defaultPlace ?? "float"}
          scene={sceneHost}
          surface="welcome"
        />
      </SpecimenRow>

      <SpecimenRow
        n="26"
        title="Path A 390 门"
        lede="复盘教师窄屏只留桌面门。半套比没有更糟。"
        px="AiMark 36 · 标题 16/600 · 说明 13"
        xy={{ x: "标与文案居中", y: "垂直居中于 sheet，无 composer" }}
        forbid="挂 Host；挂会话；挂预选项；挂 composer；发 /runs；写「可以对话但不能操作」"
        checks={[
          "文案「复盘教师 Agent 请在桌面端使用」",
          "说明「移动端完整适配后续提供」",
          "没有输入条",
          "没有会话管理器",
        ]}
        standard={[
          { k: "桌面", v: "Modal + 同一 dock。不得 close/open 重挂。" },
          { k: "390", v: "只留门。不挂 Host / 会话 / 预选项 / composer。" },
        ]}
        code={`<DockFrame surface="gate" />`}
      >
        <DockFrame surface="gate" />
      </SpecimenRow>
    </div>
  );
}
