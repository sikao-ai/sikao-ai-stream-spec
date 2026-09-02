import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Compass,
  Layers,
  LayoutGrid,
  MessageSquare,
  Moon,
  Palette,
  Play,
  ShieldAlert,
  Sparkles,
  Sun,
  Tag,
  Quote,
} from "lucide-react";
import { hydrateTheme, useAppStore, type DensityId, type SectionId } from "@/lib/app-store";
import {
  AGENT_STREAM,
  BANNED,
  BUI_TO_SIKAO,
  BUI_WIDGETS,
  DENSITIES,
  DENSITY_CHROME,
  DOT_MACHINE,
  DOT_STATES,
  ENTRIES,
  EVENT_TO_BLOCK,
  FAMILIES,
  HOST_MOUNT,
  TIMING_MATRIX,
  TURN_SLOTS,
  TYPE_SCALE,
  TYPE_STACK,
  FOOTPRINT_ACTIONS,
  GAP_CONTRAST,
  HITL,
  LOOKBACK_SOURCE,
  NAV_GROUPS,
  RENDERER_TERMS,
  RULES,
  SAP_SOURCES,
  SECTIONS,
  STEALS,
  TOKENS,
  TURN_STATUS,
} from "@/lib/spec-catalog";
import {
  CONTRACT_PATH,
  CONTRACT_VERSION,
  HITL_APPROVE_STATES,
  HITL_REC_STATES,
  RUNTIME_MATRIX,
  SCENE_MATRIX,
  SHAPE_MATRIX,
  SHAPE_TABS,
  SOURCE_STATES,
  SUPERSESSION,
  SURFACES,
  TOOL_RESULT_RULES,
  WAVE_PLAN,
  WORD_INHERITANCE,
  WORD_SUPERSESSION,
  WORD_VERSION,
} from "@/lib/spec-matrix";
import { AiDock } from "@/components/ai-dock";
import { DOCK_HOSTS } from "@/lib/dock-catalog";
import type { DockHost } from "@/lib/ask-sikao";
import {
  ActionChip,
  AiMark,
  AnswerFootprint,
  AssistantProse,
  BanLoader,
  ComposerBar,
  ContextCard,
  DensityStream,
  EntityChip,
  ErrorBand,
  KindTag,
  LiveExpertPlayback,
  OpRow,
  PplxResult,
  PplxSources,
  PromptList,
  ProposalCard,
  RecommendCard,
  FilterTable,
  InsightCards,
  SceneAiChip,
  StatusTag,
  TurnStatusLine,
  UserBubble,
  WaitingNode,
} from "./stream/primitives";

const ICONS: Record<SectionId, ReactNode> = {
  overview: <Compass />,
  density: <Layers />,
  families: <Tag />,
  entry: <Sparkles />,
  sources: <Quote />,
  matrix: <LayoutGrid />,
  rules: <ShieldAlert />,
  tokens: <Palette />,
  playground: <Play />,
  dock: <MessageSquare />,
};

function GlassesMark() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13.5" cy="5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.7 5h2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function Frame({
  title,
  kicker,
  children,
}: {
  readonly title: string;
  readonly kicker?: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="spec-preview-frame">
      <div className="spec-preview-head">
        {kicker ? (
          <span className="spec-chip" data-tone="ai">
            {kicker}
          </span>
        ) : null}
        <span className="spec-preview-title">{title}</span>
      </div>
      <div className="spec-preview-body">{children}</div>
    </div>
  );
}

function DensityPicker({
  value,
  onChange,
}: {
  readonly value: DensityId;
  readonly onChange: (id: DensityId) => void;
}) {
  return (
    <div className="spec-seg" role="tablist" aria-label="密度">
      {DENSITIES.map((d) => (
        <button
          key={d.id}
          type="button"
          role="tab"
          aria-selected={d.id === value}
          data-active={d.id === value}
          onClick={() => onChange(d.id)}
        >
          {d.title}
        </button>
      ))}
    </div>
  );
}

function StealSpecimen({ id }: { readonly id: (typeof STEALS)[number]["id"] }) {
  switch (id) {
    case "dots":
      return <WaitingNode label="正在检索考点" />;
    case "claude":
      return <UserBubble content="这道题为什么不能选遏制？" />;
    case "linear":
      return (
        <div className="spec-hairline-demo">
          单一 AI 蓝 · 无描边
        </div>
      );
    case "pplx":
      return (
        <div className="sk-result-band">
          <span className="sk-stem-kicker">结果页扫描</span>
          <PplxSources items={SAP_SOURCES.slice(0, 2)} />
        </div>
      );
    case "hitl":
      return (
        <div className="sk-stack-gap">
          <TurnStatusLine state="wait" copy="等待确认" time="4s" />
          <ProposalCard
            blocking
            title="写入笔记前先确认"
            reason="接下来会把「遏制势头 / 抑制萌芽」记进今日计划。"
          />
        </div>
      );
    default:
      return null;
  }
}

function FootprintSpecimen() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sk-answer-shell sk-answer-stack">
      <AssistantProse>
        <p>「遏制」管已起的势头，语气偏硬。</p>
      </AssistantProse>
      <AnswerFootprint
        sourceCount={SAP_SOURCES.length}
        sourcesOn={open}
        onSources={() => setOpen((v) => !v)}
      />
      {open ? (
        <div className="sk-src-after">
          <span className="sk-stem-kicker">来源</span>
          <PplxSources items={SAP_SOURCES} />
        </div>
      ) : null}
    </div>
  );
}

function Overview() {
  const setSection = useAppStore((s) => s.setSection);
  const setDensity = useAppStore((s) => s.setDensity);
  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">sikao-ai / sikao · SIK-741</span>
        <h1 className="spec-h1">四密五族，不再发明皮肤</h1>
        <p className="spec-lede">
          左侧：回合渲染器看怎么画一整轮；组件看零件；规则看红线/色板/矩阵。骨架：{AGENT_STREAM.order}
        </p>
      </header>

      <section>
        <h2 className="spec-h2">回合渲染器词表</h2>
        <p className="spec-meta">对齐 Claude content block（thinking / tool_use / text）与 Grok 多步骤折叠。产品 CONTEXT.md 同锁。</p>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>锁定名</th>
                <th>English</th>
                <th>对标</th>
                <th>不要叫</th>
              </tr>
            </thead>
            <tbody>
              {RENDERER_TERMS.map((row) => (
                <tr key={row.en}>
                  <td>
                    <strong>{row.name}</strong>
                  </td>
                  <td>
                    <code>{row.en}</code>
                  </td>
                  <td>{row.maps}</td>
                  <td>{row.not}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="spec-h2">Beautiful UI → 司考组件</h2>
        <p className="spec-meta">
          先从 beautifului.dev 偷几何和交互，再按四密裁。land=spec 只在原型；partial 产品有半套；gap
          产品还不能抄。
        </p>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>Beautiful UI</th>
                <th>偷</th>
                <th>不偷</th>
                <th>司考名</th>
                <th>在回合里干什么</th>
                <th>产品仓</th>
                <th>落地</th>
              </tr>
            </thead>
            <tbody>
              {BUI_TO_SIKAO.map((row) => (
                <tr key={row.bui}>
                  <td>{row.bui}</td>
                  <td>{row.steal}</td>
                  <td>{row.leave}</td>
                  <td>
                    <strong>{row.sikao}</strong>
                  </td>
                  <td>{row.role}</td>
                  <td>{row.product}</td>
                  <td>{row.land}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="spec-h2">SSE → 内容块</h2>
        <p className="spec-meta">产品 decodeConsultStreamItem 必须按此投影，禁止另造机。</p>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>帧</th>
                <th>内容块</th>
                <th>回合渲染</th>
              </tr>
            </thead>
            <tbody>
              {EVENT_TO_BLOCK.map((row) => (
                <tr key={row.frame}>
                  <td>
                    <code>{row.frame}</code>
                  </td>
                  <td>{row.block}</td>
                  <td>{row.chrome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="spec-h2">缺口对照</h2>
        <p className="spec-meta">
          执行只抄「原型」列。产品列是现状，不是第二套设计。缺任一项不得把 1068 当完整回合渲染器 Done。
        </p>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>id</th>
                <th>缺口</th>
                <th>原型（抄这个）</th>
                <th>产品仓现状</th>
              </tr>
            </thead>
            <tbody>
              {GAP_CONTRAST.map((row) => (
                <tr key={row.id}>
                  <td>
                    <code>{row.id}</code>
                  </td>
                  <td>{row.gap}</td>
                  <td>{row.prototype}</td>
                  <td>{row.product}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="spec-h3 spec-h3-gap">脚印动作</h3>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>动作</th>
                <th>何时出现</th>
              </tr>
            </thead>
            <tbody>
              {FOOTPRINT_ACTIONS.map((row) => (
                <tr key={row.id}>
                  <td>{row.label}</td>
                  <td>{row.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="spec-meta spec-h3-gap">{AGENT_STREAM.footprint}</p>
      </section>

      <section>
        <h2 className="spec-h2">四种密度 · 同一套 token</h2>
        <div className="spec-gallery">
          {DENSITIES.map((d) => (
            <article key={d.id} className="spec-preview-frame spec-gallery-card">
              <button
                type="button"
                className="spec-preview-head spec-preview-head-btn"
                onClick={() => {
                  setDensity(d.id);
                  setSection("density");
                }}
              >
                <span className="spec-chip" data-tone="ai">
                  {d.id}
                </span>
                <span className="spec-preview-title">{d.title}</span>
                <span className="spec-meta">{d.chrome}</span>
              </button>
              <div className="spec-preview-body">
                <DensityStream density={d.id} phase="settled" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="spec-h2">从五处偷，各偷一件</h2>
        <div className="spec-steal-grid">
          {STEALS.map((s) => (
            <article key={s.id} className="spec-steal">
              <div className="spec-steal-live">
                <StealSpecimen id={s.id} />
              </div>
              <h3 className="spec-h3">{s.from}</h3>
              <p className="spec-steal-take">要 {s.take}</p>
              <p className="spec-steal-leave">不要 {s.leave}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="spec-h2">五族控件 · 不要第六族</h2>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>族</th>
                <th>组件</th>
                <th>干什么</th>
                <th>不干什么</th>
              </tr>
            </thead>
            <tbody>
              {FAMILIES.map((f) => (
                <tr key={f.id}>
                  <td>
                    <strong>{f.title}</strong>
                  </td>
                  <td>
                    <code>{f.file}</code>
                  </td>
                  <td>{f.does}</td>
                  <td>{f.not}</td>
                </tr>
              ))}
              <tr>
                <td>
                  <strong>{TURN_STATUS.title}</strong>
                </td>
                <td>
                  <code>{TURN_STATUS.file}</code>
                </td>
                <td>{TURN_STATUS.does}</td>
                <td>{TURN_STATUS.not}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="spec-h2">明确不偷</h2>
        <div className="spec-ban-row">
          <BanLoader name="Drive" />
          <BanLoader name="Orbit" />
          <BanLoader name="扫光" />
        </div>
        <div className="spec-rule-list spec-h3-gap">
          {BANNED.map((b) => (
            <div key={b.title} className="spec-rule" data-kind="dont">
              <span className="spec-rule-tag">不要</span>
              <div>
                <h3 className="spec-h3">{b.title}</h3>
                <p className="spec-meta">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DensityPage() {
  const density = useAppStore((s) => s.density);
  const setDensity = useAppStore((s) => s.setDensity);
  const current = DENSITIES.find((d) => d.id === density) ?? DENSITIES[1];
  const [phase, setPhase] = useState<import("./stream/primitives").StreamPhase>("settled");

  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">one token set · four densities</span>
        <h1 className="spec-h1">密度区分场景，不换颜色体系</h1>
        <p className="spec-lede">{current.note}</p>
        <DensityPicker value={density} onChange={setDensity} />
      </header>
      <div className="spec-seg spec-seg-quiet" role="tablist" aria-label="阶段">
        {(["waiting", "live", "streaming", "settled", "stop", "error"] as const).map((p) => (
          <button
            key={p}
            type="button"
            data-active={phase === p}
            onClick={() => setPhase(p)}
            disabled={density === "short" && p === "live"}
          >
            {p}
          </button>
        ))}
      </div>
      <Frame title={`${current.title} · ${current.host}`} kicker={current.chrome}>
        <DensityStream
          density={density}
          phase={density === "short" && phase === "live" ? "waiting" : phase}
          onGateResolved={() => {
            setPhase("streaming");
            window.setTimeout(() => setPhase("settled"), 1400);
          }}
        />
      </Frame>
      <div className="spec-table-wrap">
        <table className="spec-table">
          <thead>
            <tr>
              <th>chrome</th>
              <th>短答</th>
              <th>工具</th>
              <th>讲题</th>
              <th>门卡</th>
            </tr>
          </thead>
          <tbody>
            {DENSITY_CHROME.map((row) => (
              <tr key={row.row}>
                <td>{row.row}</td>
                <td data-on={row.short ? "true" : "false"}>{row.short ? "有" : "无"}</td>
                <td data-on={row.tool ? "true" : "false"}>{row.tool ? "有" : "无"}</td>
                <td data-on={row.teach ? "true" : "false"}>{row.teach ? "有" : "无"}</td>
                <td data-on={row.gate ? "true" : "false"}>{row.gate ? "有" : "无"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="spec-grid">
        {DENSITIES.map((d) => (
          <article key={d.id} className="spec-card" data-active={d.id === density}>
            <h3 className="spec-h3">{d.title}</h3>
            <p className="spec-meta">{d.flow}</p>
            <p className="spec-meta">{d.chrome}</p>
          </article>
        ))}
      </div>
      <div className="spec-card">
        <h3 className="spec-h3">Widget 帧 · 不互相替换</h3>
        <p className="spec-meta">
          审批卡是实时门：Agent 还没写完，必须先问。会话结束后的「要不要写入」用推荐卡。发现卡讲量化错因，筛选表对照错题。方法卡 /
          你来仍是讲题自己的帧——三张 Beautiful UI 卡不能替换它们。
        </p>
        <div className="spec-split spec-h3-gap">
          <Frame title="Approval · 活时挡住" kicker="不点不生成">
            <ProposalCard
              blocking
              title="写入笔记前先确认"
              reason="接下来会把「遏制势头 / 抑制萌芽」记进今日计划。"
            />
          </Frame>
          <Frame title="Recommendation · 落定提案" kicker="不挡下一问">
            <RecommendCard />
          </Frame>
        </div>
        <div className="spec-split spec-h3-gap">
          <Frame title="Insight · 量化发现" kicker="你错在哪">
            <InsightCards />
          </Frame>
          <Frame title="Filter Table · 对照" kicker="芯片重排行">
            <FilterTable />
          </Frame>
        </div>
        <div className="spec-table-wrap spec-h3-gap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>卡</th>
                <th>时机</th>
                <th>司考场景</th>
                <th>为什么比旧帧好 / 为什么留下</th>
              </tr>
            </thead>
            <tbody>
              {BUI_WIDGETS.map((w) => (
                <tr key={w.id}>
                  <td>
                    <strong>{w.title}</strong>
                  </td>
                  <td>{w.when}</td>
                  <td>{w.scene}</td>
                  <td>{w.vs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FamiliesPage() {
  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">five families · no sixth</span>
        <h1 className="spec-h1">五族控件，职责不许串</h1>
        <p className="spec-lede">
          PromptList 是下一问。StatusTag 是只读事实。ActionChip 是导航/多选。KindTag 是卡头类型。EntityChip
          是正文链。TurnStatus 管回合，不是新族。
        </p>
      </header>

      <div className="spec-table-wrap">
        <table className="spec-table">
          <thead>
            <tr>
              <th>族</th>
              <th>组件</th>
              <th>干什么</th>
              <th>不干什么</th>
            </tr>
          </thead>
          <tbody>
            {FAMILIES.map((f) => (
              <tr key={f.id}>
                <td>
                  <strong>{f.title}</strong>
                </td>
                <td>
                  <code>{f.file}</code>
                </td>
                <td>{f.does}</td>
                <td>{f.not}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>{TURN_STATUS.title}</strong>
              </td>
              <td>
                <code>{TURN_STATUS.file}</code>
              </td>
              <td>{TURN_STATUS.does}</td>
              <td>{TURN_STATUS.not}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="spec-split">
        <Frame title="PromptList · 下一问" kicker="lucide + 文字">
          <PromptList items={["为什么不能选遏制", "对比近义", "做成今日计划"]} />
        </Frame>
        <div className="spec-note">
          <p>全宽行，左侧 15px lucide 槽。悬停 elevated + AI 墨。不画描边 pill，不秃行纯字。</p>
        </div>
      </div>

      <div className="spec-split">
        <Frame title="StatusTag · 只读" kicker="ok / ai / neutral / risk">
          <div className="sk-stag-row">
            <StatusTag tone="ok">命中 2</StatusTag>
            <StatusTag tone="ai">言语 · 填空</StatusTag>
            <StatusTag tone="neutral">未作答 1</StatusTag>
            <StatusTag tone="risk">近义干扰</StatusTag>
          </div>
        </Frame>
        <Frame title="ActionChip · 材料导航" kicker="竖叠 pill">
          <div className="sk-achip-stack">
            <ActionChip label="近义干扰表" />
            <ActionChip label="逻辑填空错题" />
            <ActionChip label="今日计划" />
          </div>
        </Frame>
      </div>

      <div className="spec-split">
        <Frame title="KindTag · 卡头" kicker="无 fill">
          <div className="sk-inline-gap">
            <KindTag kind="suggest" />
            <KindTag kind="input" />
            <KindTag kind="action" />
            <KindTag kind="data" />
          </div>
        </Frame>
        <Frame title="EntityChip · 正文链" kicker="不是 pill">
          <p className="sk-prose">
            搭配记在 <EntityChip title="遏制势头 / 抑制萌芽" />，不要做成芯片。
          </p>
        </Frame>
      </div>

      <div className="spec-card">
        <span className="spec-chip">{TURN_STATUS.file}</span>
        <h3 className="spec-h3">{TURN_STATUS.title} · 回合态，不是第六族</h3>
        <p className="spec-meta">{TURN_STATUS.does}</p>
        <p className="spec-meta spec-h3-gap">{AGENT_STREAM.live}</p>
        <div className="spec-h3-gap">
          <TurnStatusLine
            state="tool"
            copy="正在检索"
            time="4s"
            rail={<LiveExpertPlayback />}
          />
        </div>
        <p className="spec-meta spec-h3-gap">{AGENT_STREAM.settled}</p>
        <div className="spec-h3-gap">
          <TurnStatusLine
            state="done"
            copy=""
            status="done"
            time="6s"
            foldable
          >
            <OpRow op="thought" text="先看搭配对象是「势头」，不是「情绪」。" />
            <OpRow op="search" text="检索近义干扰 · 遏制 / 遏止 / 抑制" elapsed="1.2s" />
            <OpRow op="read" text="打开近义干扰表" elapsed="0.4s" />
            <OpRow op="write" text="写入对照笔记" elapsed="0.6s" />
          </TurnStatusLine>
        </div>
        <p className="spec-meta spec-h3-gap">点阵贴着「已完成」。思考时间在行右。点阵槽 16×16 整数格；多步骤 lucide 15px 槽。</p>
        <div className="spec-h3-gap">
          <OpRow op="thought" text="先看搭配对象是「势头」，不是「情绪」。" />
          <OpRow op="search" text="检索近义干扰 · 遏制 / 遏止 / 抑制" elapsed="1.2s" />
          <OpRow op="read" text="打开近义干扰表" elapsed="0.4s" />
          <OpRow op="write" text="写入今日计划" live />
        </div>
        <p className="spec-meta spec-h3-gap">{TURN_STATUS.not} elapsed 在 0 时不渲染。</p>
      </div>

      <div className="spec-rule" data-kind="dont">
        <span className="spec-rule-tag">不要</span>
        <div>
          <h3 className="spec-h3">这些不进 AI 流</h3>
          <p className="spec-meta">
            GuidedSelectionChips、筛选 Chip、题型 tag 留在产品面。不要为它们再开一族流内皮肤。
          </p>
        </div>
      </div>
    </div>
  );
}

function EntryPage() {
  const [open, setOpen] = useState("scene");
  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">entry family · sunken AiMark</span>
        <h1 className="spec-h1">入口另槽，全是 write-spark</h1>
        <p className="spec-lede">
          Scene / Seed / Context / Rail / TopBar 共用 sunken 无边壳。无可见「AI」字。展开走 ai-soft 洗。
        </p>
      </header>

      <Frame title="同一颗标，五个槽" kicker="rev4">
        <div className="sk-entry-row">
          {ENTRIES.map((e) => (
            <button
              key={e.id}
              type="button"
              className="sk-entry-slot"
              data-active={open === e.id}
              aria-pressed={open === e.id}
              onClick={() => setOpen(e.id)}
            >
              <SceneAiChip
                size={e.id === "top" ? 44 : e.id === "seed" ? 36 : 32}
                expanded={open === e.id}
                label={e.title}
                interactive={false}
              />
              <span>{e.title}</span>
            </button>
          ))}
        </div>
      </Frame>

      <div className="spec-grid">
        {ENTRIES.map((e) => (
          <article key={e.id} className="spec-card">
            <span className="spec-chip">{e.size}</span>
            <h3 className="spec-h3">{e.title}</h3>
            <p className="spec-meta">{e.note}</p>
          </article>
        ))}
      </div>

      <div className="spec-split">
        <Frame title="write-spark 解剖" kicker="SIK-421">
          <div className="sk-mark-stage">
            <AiMark size={48} detail="full" />
            <p className="spec-meta">pencil = currentColor · wave/spark = --color-ai</p>
          </div>
        </Frame>
        <div className="spec-note">
          <p>这颗标替换了旧的眼镜笑脸。产品眼镜留在司考品牌；AI 入口只用铅笔写火花。</p>
          <p>32 / 36 / 44 三档。触控地板 44 半径升到 12。</p>
        </div>
      </div>
    </div>
  );
}

function SourcesPage() {
  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">Claude 对话 · Perplexity 结果页</span>
        <h1 className="spec-h1">来源有两套表面，不能混</h1>
        <p className="spec-lede">
          对话学 Claude：正文带 [n]，点角标在旁边浮出那一张 chunk，方法 / 你来仍贴在答案下、位置不动。结果页才先铺本轮工具 /
          笔记卡再读合成——那是检索落地，不是气泡。
        </p>
      </header>
      <div className="spec-split">
        <Frame title="对话流 · 点角标浮出那一张" kicker="Claude">
          <DensityStream density="teach" phase="settled" />
        </Frame>
        <Frame title="结果页 · Perplexity 扫描" kicker="不是气泡">
          <PplxResult related={["为什么不能选遏制", "对比近义"]} />
        </Frame>
      </div>
      <Frame title="脚印上来源图标 · 整轮之后展开列表" kicker="after footer">
        <DensityStream density="tool" phase="settled" sourcesOpen />
      </Frame>
      <div className="spec-card">
        <h3 className="spec-h3">出现机制</h3>
        <table className="spec-table">
          <thead>
            <tr>
              <th>时机 / 表面</th>
              <th>出什么</th>
              <th>不出什么</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>活时 · 对话</td>
              <td>状态行里单行 lucide 图标，新的把旧的顶走</td>
              <td>专家名、「近义 / 注释」这种字、来源卡</td>
            </tr>
            <tr>
              <td>生成 · 对话</td>
              <td>正文出字</td>
              <td>角标、脚印、方法卡、来源卡</td>
            </tr>
            <tr>
              <td>落定 · 对话</td>
              <td>正文 + [n] → 「你记过」Context Card → 方法 / 你来 / 门 → 脚印</td>
              <td>文前扫卡；把来源列表插在「你来」前</td>
            </tr>
            <tr>
              <td>点 [n] · 对话</td>
              <td>那一张 chunk 浮在角标旁（不占文档流）</td>
              <td>推开方法 / 你来；遮罩盖住会话</td>
            </tr>
            <tr>
              <td>点脚印引用 · 对话</td>
              <td>来源列表出现在整轮之后</td>
              <td>卡出现在脚印之前</td>
            </tr>
            <tr>
              <td>落定 · 结果页</td>
              <td>本轮工具 / 笔记卡常开在合成之前，再正文，再相关下一问。点 [n] 只高亮已有的卡</td>
              <td>用户泡、活时图标、脚印、方法卡、你来</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="spec-card">
        <h3 className="spec-h3">结果页 · Perplexity 扫描是干什么的</h3>
        <p className="spec-meta">
          复盘、检索落地、分享一篇写完的答案。上面是本轮真正跑过的工具和笔记 chunk（点开看原文），下面才是合成。它不是对话里的一则
          AI 气泡，所以可以先扫卡——Perplexity 只借这一面。对话里若把同一套卡铺在正文前或「你来」前，就既不像
          Claude，也会挡住下一步。
        </p>
      </div>
    </div>
  );
}

function RulesPage() {
  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">contract</span>
        <h1 className="spec-h1">红线：做新面之前先过这八条</h1>
        <p className="spec-lede">密度、五族、入口、来源、暗色换肤。HITL 走 suggest / confirm / execute 协议，不抄照片。</p>
      </header>
      <div className="spec-rule-list">
        {RULES.map((r) => (
          <div key={r.title} className="spec-rule" data-kind={r.kind}>
            <span className="spec-rule-tag">{r.kind === "do" ? "要" : "不要"}</span>
            <div>
              <h3 className="spec-h3">{r.title}</h3>
              <p className="spec-meta">{r.body}</p>
            </div>
          </div>
        ))}
      </div>
      <Frame title="HITL 协议 · Beautiful UI 04" kicker="活时审批 · 落定推荐">
        <div className="spec-grid">
          {HITL.map((h) => (
            <article key={h.id} className="spec-card">
              <span className="spec-chip" data-tone={h.id === "confirm" ? "warn" : undefined}>
                {h.id}
              </span>
              <h3 className="spec-h3">{h.title}</h3>
              <p className="spec-meta">{h.body}</p>
            </article>
          ))}
        </div>
        <div className="spec-split spec-h3-gap">
          <ProposalCard
            blocking
            title="写入笔记前先确认"
            reason="Agent 还没写完。不点，回合不往下走。"
          />
          <RecommendCard />
        </div>
        <div className="spec-h3-gap">
          <ErrorBand title="写入被打断" />
          <span className="sk-stopped">已停止 · 不当作完成</span>
        </div>
      </Frame>
    </div>
  );
}

function TokensPage() {
  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">1040 状态机 · 点阵着色</span>
        <h1 className="spec-h1">暗色只开 token，统一无描边</h1>
        <p className="spec-lede">
          近黑平面、单一 AI 蓝。点阵按 1040 终态上色。产品黄不进流。确认门深色用 warn-mid 混面。排印与产品 tokens 同栈。
        </p>
      </header>
      <section>
        <h2 className="spec-h2">字体</h2>
        <p className="spec-meta">
          UI：{TYPE_STACK.ui}。等宽：{TYPE_STACK.mono}。{TYPE_STACK.rules}
        </p>
        <div className="spec-type-ladder spec-h3-gap">
          {TYPE_SCALE.map((row) => (
            <div key={row.slot} className="spec-type-row">
              <span className="spec-meta">{row.slot}</span>
              <p
                className="spec-type-sample"
                data-family={row.family}
                style={{
                  fontSize: row.size,
                  lineHeight: row.lh,
                  fontWeight: row.weight,
                  fontFamily: row.family === "mono" ? "var(--font-family-mono)" : "var(--font-family-ui)",
                }}
              >
                遏制势头 · {row.size}/{row.lh}
              </p>
            </div>
          ))}
        </div>
        <div className="spec-table-wrap spec-h3-gap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>槽</th>
                <th>token</th>
                <th>字号</th>
                <th>行高</th>
                <th>字重</th>
                <th>栈</th>
              </tr>
            </thead>
            <tbody>
              {TYPE_SCALE.map((row) => (
                <tr key={row.token}>
                  <td>{row.slot}</td>
                  <td>
                    <code>{row.token}</code>
                  </td>
                  <td>{row.size}</td>
                  <td>{row.lh}</td>
                  <td>{row.weight}</td>
                  <td>{row.family}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="spec-token-grid">
        {TOKENS.map((t) => (
          <div key={t.name} className="spec-swatch">
            <span className="spec-swatch-chip" data-token={t.name} />
            <div>
              <div className="spec-swatch-name">{t.name}</div>
              <div className="spec-swatch-hex">
                {t.hex} · {t.role}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="spec-card">
        <h2 className="spec-h3">Dots ← 1040 状态机</h2>
        <p className="spec-meta">不新造 run 机。点阵常驻回合行，色相投影 attachment + terminal。条仍是 DurableRunStatusBar，不加第二套点阵。</p>
        <div className="spec-table-wrap spec-h3-gap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>1040</th>
                <th>用户看见</th>
                <th>点阵</th>
              </tr>
            </thead>
            <tbody>
              {DOT_MACHINE.map((row) => (
                <tr key={row.state}>
                  <td>
                    <code>{row.state}</code>
                  </td>
                  <td>{row.user}</td>
                  <td>{row.dots}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="spec-card">
        <h2 className="spec-h3">Dots 八态 · 同一 3×3，按态上色</h2>
        <p className="spec-meta">几何仍是 SIK-1045。一态一行。完成绿、中断灰、未确认红、续看/正在停止用 warn。不引入 Drive / Orbit / 扫光，不把芯片塞进状态行。</p>
        <div className="spec-dot-grid spec-h3-gap">
          {DOT_STATES.map((d) => (
            <article key={d.id} className="spec-dot-card">
              <TurnStatusLine
                state={d.id}
                copy={d.copy}
                status={d.status}
                time={d.time}
              />
              <strong>{d.from}</strong>
              <p className="spec-meta">{d.take}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="spec-card">
        <h2 className="spec-h3">几何合同</h2>
        <table className="spec-table">
          <tbody>
            <tr>
              <td>
                <code>3 × 3</code>
              </td>
              <td>4px 圆点 · gap 2px · 槽 16×16 整数格</td>
            </tr>
            <tr>
              <td>
                <code>pixel-on 650ms</code>
              </td>
              <td>wait 用 chevron 延迟；tool 列扫；stream 中心扩</td>
            </tr>
            <tr>
              <td>
                <code>done / stop / error / halt</code>
              </td>
              <td>静帧。完成点阵走 ok 绿；中断 muted；未确认 err X；正在停止 warn 冻。</td>
            </tr>
            <tr>
              <td>
                <code>reduced-motion</code>
              </td>
              <td>停动画，钉在 0.28</td>
            </tr>
            <tr>
              <td>
                <code>Drive / Orbit / 扫光</code>
              </td>
              <td>不进会话面</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Playground() {
  const density = useAppStore((s) => s.density);
  const setDensity = useAppStore((s) => s.setDensity);
  const [input, setInput] = useState("这道题的干扰项是怎么设计的？");
  const [log, setLog] = useState<
    ReadonlyArray<{ role: "user" | "ai"; text: string; density: DensityId }>
  >([]);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<import("./stream/primitives").StreamPhase | "idle">("idle");
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }

  function later(fn: () => void, ms: number) {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    clearTimers();
    setInput("");
    setBusy(true);
    setPhase("waiting");
    setLog((prev) => [...prev, { role: "user", text: trimmed, density }]);
    const gated = density === "gate";
    const steps =
      density === "short"
        ? ([
            ["waiting", 700],
            ["streaming", 1400],
            ["settled", 0],
          ] as const)
        : gated
          ? ([
              ["waiting", 700],
              ["live", -1],
            ] as const)
          : ([
              ["waiting", 700],
              ["live", 3600],
              ["streaming", 1500],
              ["settled", 0],
            ] as const);
    const run = (index: number) => {
      const step = steps[index];
      if (!step) {
        setBusy(false);
        return;
      }
      const [next, ms] = step;
      setPhase(next);
      if (next === "streaming") {
        setLog((prev) => [
          ...prev,
          {
            role: "ai",
            density,
            text:
              density === "short"
                ? "干扰项拿一个「对、但搭配不对」的近义来抢注意力。"
                : "先看宾语，再看语气硬度。对、但搭配不对的近义最容易下手。",
          },
        ]);
      }
      if (next === "settled") {
        setBusy(false);
        return;
      }
      if (ms < 0) return;
      later(() => run(index + 1), ms);
    };
    run(0);
  }

  function stopTurn() {
    if (!busy) return;
    clearTimers();
    setPhase("stop");
    setBusy(false);
  }

  function resumeGate() {
    setPhase("streaming");
    setLog((prev) => [
      ...prev,
      {
        role: "ai",
        density: "gate",
        text: "先看宾语，再看语气硬度。对、但搭配不对的近义最容易下手。",
      },
    ]);
    later(() => {
      setPhase("settled");
      setBusy(false);
    }, 1400);
  }

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const lastAi = [...log].reverse().find((m) => m.role === "ai");

  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">turn renderer</span>
        <h1 className="spec-h1">回合渲染器</h1>
        <p className="spec-lede">
          {AGENT_STREAM.order} 工作时用专家栈 lucide 条；正文结束后同一状态行折叠出多步骤。门卡流活时停住等审批，点完才出正文；落定推荐卡不挡下一问。
        </p>
        <DensityPicker value={density} onChange={setDensity} />
      </header>

      <section>
        <h2 className="spec-h2">抄这一棵（data-turn-slot）</h2>
        <p className="spec-meta">
          产品一行换一行。ticket=SIK-1070/1072 的槽只留位，1068 不画皮。下方 DensityStream 已打这些 slot。
        </p>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>slot</th>
                <th>名称</th>
                <th>票</th>
                <th>何时</th>
              </tr>
            </thead>
            <tbody>
              {TURN_SLOTS.map((row) => (
                <tr key={row.id}>
                  <td>
                    <code>{row.id}</code>
                  </td>
                  <td>{row.name}</td>
                  <td>{row.ticket}</td>
                  <td>{row.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="spec-h3 spec-h3-gap">时序对照</h3>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>槽</th>
                <th>waiting</th>
                <th>live</th>
                <th>streaming</th>
                <th>settled</th>
                <th>stop</th>
              </tr>
            </thead>
            <tbody>
              {TIMING_MATRIX.map((row) => (
                <tr key={row.slot}>
                  <td>
                    <code>{row.slot}</code>
                  </td>
                  <td>{row.waiting}</td>
                  <td>{row.live}</td>
                  <td>{row.streaming}</td>
                  <td>{row.settled}</td>
                  <td>{row.stop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="spec-h3 spec-h3-gap">宿主只挂这一棵</h3>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>宿主</th>
                <th>密度</th>
                <th>额外</th>
              </tr>
            </thead>
            <tbody>
              {HOST_MOUNT.map((row) => (
                <tr key={row.host}>
                  <td>{row.host}</td>
                  <td>{row.density}</td>
                  <td>{row.extra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="spec-gallery">
        <Frame title="等待" kicker="waiting">
          <TurnStatusLine state="wait" copy="正在想" />
        </Frame>
        <Frame title="工作时 · 专家栈" kicker="live">
          <TurnStatusLine state="tool" copy="正在检索" time="4s" rail={<LiveExpertPlayback />} />
        </Frame>
        <Frame title="出字" kicker="streaming">
          <TurnStatusLine state="stream" copy="" status="stream" />
          <AssistantProse streaming>「遏制」管已起的势头，语气偏硬。</AssistantProse>
        </Frame>
        <Frame title="正文后 · 多步骤" kicker="settled">
          <TurnStatusLine state="done" copy="" status="done" time="6s" foldable>
            <OpRow op="thought" text="先看搭配对象是「势头」，不是「情绪」。" />
            <OpRow op="search" text="检索近义干扰 · 遏制 / 遏止 / 抑制" elapsed="1.2s" />
            <OpRow op="read" text="打开近义干扰表" elapsed="0.4s" />
            <OpRow op="write" text="写入对照笔记" elapsed="0.6s" />
          </TurnStatusLine>
        </Frame>
        <Frame title="已停止" kicker="stop">
          <TurnStatusLine state="stop" copy="" status="stop" time="3s" foldable>
            <OpRow op="search" text="检索近义干扰" elapsed="0.8s" />
          </TurnStatusLine>
        </Frame>
        <Frame title="未确认" kicker="error">
          <TurnStatusLine state="error" copy="" status="error" />
          <ErrorBand />
        </Frame>
        <Frame title="正在停止" kicker="halt">
          <TurnStatusLine state="halt" copy="" status="halt" time="4s" />
        </Frame>
        <Frame title="续看" kicker="recover">
          <TurnStatusLine state="recover" copy="" status="recover" />
        </Frame>
        <Frame title="活时门" kicker="gate">
          <TurnStatusLine state="wait" copy="等待确认" time="4s" />
          <ProposalCard
            blocking
            title="写入笔记前先确认"
            reason="接下来会把「遏制势头 / 抑制萌芽」记进今日计划。"
          />
        </Frame>
        <Frame title="脚印" kicker="footer">
          <FootprintSpecimen />
        </Frame>
      </div>

      <div className="spec-preview-frame">
        <div className="spec-preview-head">
          <LayoutGrid size={14} />
          <span className="spec-preview-title">{DENSITIES.find((d) => d.id === density)?.title}</span>
          <span className="spec-chip" data-tone="ai" data-push="end">
            {phase === "idle" ? "静息" : phase}
          </span>
        </div>
        <div className="spec-preview-body spec-play-body">
          {log.length === 0 ? (
            <div className="spec-empty">
              <p className="spec-lede spec-lede-sm">问一句，看当前密度怎么呼吸。</p>
              <PromptList
                items={["为什么错", "对比近义", "做成计划"]}
                onPick={(item) => send(item)}
              />
            </div>
          ) : (
            <DensityStream
              density={lastAi?.density ?? density}
              phase={phase === "idle" ? "settled" : phase}
              question={log.filter((m) => m.role === "user").at(-1)?.text}
              onGateResolved={resumeGate}
            />
          )}
        </div>
        <div data-turn-slot="composer" data-ticket="SIK-1072">
          <ComposerBar
            value={input}
            onChange={setInput}
            onSend={() => send(input)}
            onStop={stopTurn}
            busy={busy}
          />
        </div>
      </div>
      <div className="spec-note">
        <p>{AGENT_STREAM.live}</p>
        <p>{AGENT_STREAM.streaming}</p>
        <p>{AGENT_STREAM.settled}</p>
        <p>{AGENT_STREAM.stop}</p>
        <p>{AGENT_STREAM.error}</p>
        <p>{AGENT_STREAM.footprint}</p>
      </div>
      <Frame title="结果页 · Perplexity 扫描" kicker="不是对话气泡">
        <PplxResult
          related={["为什么不能选遏制", "对比近义", "做成今日计划"]}
          onPick={(item) => send(item)}
        />
      </Frame>
      <div className="spec-note">
        <p>
          结果页不是对话气泡。复盘或检索落地时用：先铺本轮工具 / 笔记卡，再合成，再相关下一问。对话里点 [n] 只在角标旁浮出那一张；脚印引用才在整轮之后展开列表——不要把结果页那套卡插进气泡。
        </p>
      </div>
    </div>
  );
}

function MatrixPage() {
  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">canonical · {CONTRACT_VERSION} · 词表 {WORD_VERSION}</span>
        <h1 className="spec-h1">场景、形态、状态必须先对齐</h1>
        <p className="spec-lede">
          四密是密度，不是产品场景。1032 形态是正文怎么写，不是第四密。1037 长任务不进对话流。
          这是 AI 基础设施单路径：统一 chrome 随正常 Web 部署直接上线，回滚只走代码 revert / roll-forward；宿主自己的业务 capability flag 不控制 chrome 版本。
          web-desktop / web-mobile 都是 {SURFACES["web-desktop"]}。{SURFACES.viewports}。契约入仓路径 {CONTRACT_PATH}。
        </p>
      </header>

      <div className="spec-card">
        <h3 className="spec-h3">波次</h3>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>波</th>
                <th>票</th>
                <th>做</th>
                <th>不做</th>
              </tr>
            </thead>
            <tbody>
              {WAVE_PLAN.map((row) => (
                <tr key={row.wave}>
                  <td>
                    <strong>{row.wave}</strong>
                  </td>
                  <td>{row.ticket}</td>
                  <td>{row.do}</td>
                  <td>{row.dont}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="spec-card">
        <h3 className="spec-h3">覆盖关系</h3>
        <p className="spec-meta">前五项由新原型覆盖，实现者不得自行保留旧皮肤。</p>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>项</th>
                <th>旧</th>
                <th>新</th>
                <th>裁决</th>
              </tr>
            </thead>
            <tbody>
              {SUPERSESSION.map((row) => (
                <tr key={row.item}>
                  <td>
                    <strong>{row.item}</strong>
                  </td>
                  <td>{row.old}</td>
                  <td>{row.now}</td>
                  <td>{row.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="spec-card">
        <h3 className="spec-h3">场景 → 密度 → 族</h3>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>族</th>
                <th>场景</th>
                <th>密度</th>
                <th>五族 / 控件</th>
                <th>入口</th>
                <th>来源</th>
                <th>运行时</th>
                <th>宿主</th>
              </tr>
            </thead>
            <tbody>
              {SCENE_MATRIX.map((row) => (
                <tr key={`${row.family}-${row.scene}`}>
                  <td>{row.family}</td>
                  <td>{row.scene}</td>
                  <td>{row.density}</td>
                  <td>{row.families}</td>
                  <td>{row.entry}</td>
                  <td>{row.source}</td>
                  <td>{row.runtime}</td>
                  <td>{row.host}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="spec-card">
        <h3 className="spec-h3">回答形态 × 四密</h3>
        <p className="spec-meta">
          产品：{SHAPE_TABS.product} 原型：{SHAPE_TABS.proto} {SHAPE_TABS.rail} {SHAPE_TABS.pill}
        </p>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>形态</th>
                <th>密度</th>
                <th>validating</th>
                <th>verified</th>
                <th>typed-error</th>
                <th>缺上下文</th>
                <th>cold</th>
              </tr>
            </thead>
            <tbody>
              {SHAPE_MATRIX.map((row) => (
                <tr key={`${row.shape}-${row.density}`}>
                  <td>{row.shape}</td>
                  <td>{row.density}</td>
                  <td>{row.validating}</td>
                  <td>{row.verified}</td>
                  <td>{row.typedError}</td>
                  <td>{row.missing}</td>
                  <td>{row.cold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="spec-card">
        <h3 className="spec-h3">运行时状态</h3>
        <p className="spec-meta">对话走 1031/1040/1032。长任务走 1037 ProgressAtom，本规范不重画。</p>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>id</th>
                <th>来源</th>
                <th>视觉</th>
                <th>文案</th>
                <th>操作</th>
                <th>内容</th>
                <th>车道</th>
              </tr>
            </thead>
            <tbody>
              {RUNTIME_MATRIX.map((row) => (
                <tr key={row.id}>
                  <td>
                    <code>{row.id}</code>
                  </td>
                  <td>{row.from}</td>
                  <td>{row.visual}</td>
                  <td>{row.copy}</td>
                  <td>{row.action}</td>
                  <td>{row.keep}</td>
                  <td>{row.lane}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="spec-grid">
        <div className="spec-card">
          <h3 className="spec-h3">审批卡状态</h3>
          <div className="spec-table-wrap">
            <table className="spec-table">
              <thead>
                <tr>
                  <th>态</th>
                  <th>看见</th>
                  <th>动作</th>
                  <th>挡住？</th>
                </tr>
              </thead>
              <tbody>
                {HITL_APPROVE_STATES.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <code>{row.id}</code>
                    </td>
                    <td>{row.see}</td>
                    <td>{row.action}</td>
                    <td>{row.block}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="spec-card">
          <h3 className="spec-h3">推荐卡状态</h3>
          <div className="spec-table-wrap">
            <table className="spec-table">
              <thead>
                <tr>
                  <th>态</th>
                  <th>看见</th>
                  <th>动作</th>
                  <th>挡住？</th>
                </tr>
              </thead>
              <tbody>
                {HITL_REC_STATES.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <code>{row.id}</code>
                    </td>
                    <td>{row.see}</td>
                    <td>{row.action}</td>
                    <td>{row.block}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Frame title="审批 · 活时门" kicker="满宽竖列">
        <ProposalCard blocking title="写入笔记前先确认" reason="接下来会把这组近义记进今日计划。" />
      </Frame>
      <Frame title="推荐 · 落定提案" kicker="不挡下一问">
        <RecommendCard />
      </Frame>

      <div className="spec-card">
        <h3 className="spec-h3">审批卡全态（不是只有 happy path）</h3>
        <p className="spec-meta">活时挡住。fail 仍挡。ok / skip 才放开下一问。</p>
        <div className="spec-specimen-grid">
          {HITL_APPROVE_STATES.map((row) => (
            <div key={row.id} className="spec-specimen" data-id={row.id}>
              <span className="spec-chip">{row.id}</span>
              <ProposalCard
                blocking={row.block !== "否"}
                title="写入笔记前先确认"
                reason="接下来会把这组近义记进今日计划。"
                specimen={row.id}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="spec-card">
        <h3 className="spec-h3">推荐卡全态</h3>
        <p className="spec-meta">落定不挡。写入中主钮 disabled。失败幂等重试同一项。</p>
        <div className="spec-specimen-grid">
          {HITL_REC_STATES.map((row) => (
            <div key={row.id} className="spec-specimen" data-id={row.id}>
              <span className="spec-chip">{row.id}</span>
              <RecommendCard specimen={row.id} />
            </div>
          ))}
        </div>
      </div>

      <div className="spec-card">
        <h3 className="spec-h3">来源</h3>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>表面</th>
                <th>N</th>
                <th>规则</th>
              </tr>
            </thead>
            <tbody>
              {SOURCE_STATES.map((row) => (
                <tr key={`${row.surface}-${row.n}`}>
                  <td>{row.surface}</td>
                  <td>{row.n}</td>
                  <td>{row.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="spec-card">
        <h3 className="spec-h3">工具结果（发现卡 / 筛选表，不是近义特例）</h3>
        <p className="spec-meta">筛选芯片是表内筛选，不是第六族。</p>
        <ul className="spec-rule-list">
          {TOOL_RESULT_RULES.map((row) => (
            <li key={row.id} className="spec-rule" data-kind="do">
              <span className="spec-rule-tag">{row.id}</span>
              <p className="spec-meta">{row.rule}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="spec-grid">
        <Frame title="发现 0" kicker="empty">
          <InsightCards empty />
        </Frame>
        <Frame title="筛选 0 行" kicker="filter-0">
          <FilterTable empty />
        </Frame>
      </div>

      <div className="spec-grid">
        <Frame title="来源失效" kicker="对话角标仍在">
          <ContextCard item={SAP_SOURCES[0]} defaultOpen invalid />
        </Frame>
        <Frame title="你记过 · 已失效笔记" kicker="不是本轮 [n]">
          <div className="sk-lookback">
            <span className="sk-lookback-kicker">你记过</span>
            <ContextCard item={LOOKBACK_SOURCE} numbered={false} defaultOpen invalid />
          </div>
        </Frame>
      </div>

      <div className="spec-card">
        <h3 className="spec-h3">词表继承 / 覆盖（SIK-1066）</h3>
        <p className="spec-meta">词表不带视觉。实现对照本表改字，不对照记忆。</p>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>继承自</th>
                <th>保留</th>
              </tr>
            </thead>
            <tbody>
              {WORD_INHERITANCE.map((row) => (
                <tr key={row.from}>
                  <td>
                    <strong>{row.from}</strong>
                  </td>
                  <td>{row.keep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="spec-table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>旧字</th>
                <th>锁定字</th>
                <th>范围</th>
              </tr>
            </thead>
            <tbody>
              {WORD_SUPERSESSION.map((row) => (
                <tr key={row.old}>
                  <td>{row.old}</td>
                  <td>
                    <strong>{row.now}</strong>
                  </td>
                  <td>{row.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DockPage() {
  const host = useAppStore((s) => s.dockHost);
  const setHost = useAppStore((s) => s.setDockHost);
  const setOpen = useAppStore((s) => s.setDockOpen);
  const dockOpen = useAppStore((s) => s.dockOpen);
  const place = useAppStore((s) => s.dockPlace);
  const setPlace = useAppStore((s) => s.setDockPlace);
  const current = DOCK_HOSTS[host];

  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">SIK-1072 · 浮层 / 右栏 / iOS</span>
        <h1 className="spec-h1">栏不另开，入口不靠 FAB</h1>
        <p className="spec-lede">
          入口是 Rail ⌘J / SceneAiChip。会话管理器占满面板，列表可滚，标题和时间各占一列。浮层默认；复盘钉右栏；窄屏
          iOS sheet。
        </p>
        <div className="spec-seg" role="tablist" aria-label="宿主">
          {(Object.keys(DOCK_HOSTS) as DockHost[]).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={id === host}
              data-active={id === host}
              onClick={() => {
                setHost(id);
                setOpen(true);
              }}
            >
              {DOCK_HOSTS[id].label}
            </button>
          ))}
        </div>
        <div className="spec-seg spec-seg-quiet" role="tablist" aria-label="壳">
          {(
            [
              ["float", "浮层"],
              ["rail", "右栏"],
              ["ios", "iOS"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={id === place}
              data-active={id === place}
              onClick={() => {
                setPlace(id);
                setOpen(true);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="spec-preview-frame">
        <div className="spec-preview-head">
          <span className="spec-chip" data-tone="ai">
            {current.kicker}
          </span>
          <span className="spec-preview-title">{current.title}</span>
          <SceneAiChip size={32} expanded={dockOpen} onClick={() => setOpen(!dockOpen)} />
        </div>
        <div className="spec-preview-body">
          <p className="spec-meta">{current.body}</p>
        </div>
      </div>
    </div>
  );
}

function SectionView({ id }: { readonly id: SectionId }) {
  switch (id) {
    case "overview":
      return <Overview />;
    case "density":
      return <DensityPage />;
    case "families":
      return <FamiliesPage />;
    case "entry":
      return <EntryPage />;
    case "sources":
      return <SourcesPage />;
    case "matrix":
      return <MatrixPage />;
    case "rules":
      return <RulesPage />;
    case "tokens":
      return <TokensPage />;
    case "playground":
      return <Playground />;
    case "dock":
      return <DockPage />;
    default:
      return <Overview />;
  }
}

export function SpecApp() {
  const section = useAppStore((s) => s.section);
  const setSection = useAppStore((s) => s.setSection);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const dockOpen = useAppStore((s) => s.dockOpen);
  const setDockOpen = useAppStore((s) => s.setDockOpen);

  useEffect(() => {
    hydrateTheme();
  }, []);

  const current = useMemo(() => SECTIONS.find((s) => s.id === section) ?? SECTIONS[0], [section]);

  return (
    <div className="spec-app">
      <aside className="spec-nav">
        <div className="spec-brand">
          <div className="spec-mark">
            <GlassesMark />
          </div>
          <div className="spec-brand-copy">
            <div className="spec-brand-kicker">Sikao Stream</div>
            <div className="spec-brand-title">AI 流规范</div>
          </div>
        </div>
        <button
          type="button"
          className="spec-rail"
          data-on={dockOpen}
          aria-expanded={dockOpen}
          aria-label="问这一页"
          onClick={() => setDockOpen(!dockOpen)}
        >
          <SceneAiChip size={32} expanded={dockOpen} interactive={false} />
          <span>问这一页</span>
          <kbd>⌘J</kbd>
        </button>
        <nav className="spec-nav-list" aria-label="规范章节">
          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="spec-nav-group">
              <div className="spec-nav-group-label">
                <span>{group.label}</span>
                <span className="spec-nav-group-hint">{group.hint}</span>
              </div>
              {SECTIONS.filter((s) => s.group === group.id).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="spec-nav-item"
                  data-active={s.id === section}
                  onClick={() => setSection(s.id)}
                >
                  {ICONS[s.id]}
                  {s.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="spec-nav-foot">
          <button type="button" className="spec-theme-btn" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            {theme === "dark" ? "浅色" : "深色"}
          </button>
          <p className="spec-meta">回合渲染器 · 组件 · 规则</p>
        </div>
      </aside>
      <header className="spec-topbar">
        <div className="spec-brand spec-brand-compact">
          <div className="spec-mark">
            <GlassesMark />
          </div>
          <div className="spec-brand-title">AI 流规范</div>
        </div>
        <div className="spec-topbar-actions">
          <SceneAiChip size={44} expanded={dockOpen} onClick={() => setDockOpen(!dockOpen)} />
          <button type="button" className="spec-theme-btn" onClick={toggleTheme} aria-label="切换主题">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>
      <main className="spec-main">
        <SectionView id={current.id} />
      </main>
      <nav className="mobile-tabs" aria-label="移动章节">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            data-active={s.id === section}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>
      <AiDock />
    </div>
  );
}
