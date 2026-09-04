import { useMemo, useState, type ReactNode } from "react";
import {
  AGENT_CARDINALITY,
  AGENT_NOUNS,
  NOUN_BOUNDARIES,
  SEND_SEQUENCE,
  type AgentNounId,
} from "@/contract/lifecycle";
import { ENGINE_FRAME_TAGS, FRAME_FAMILIES, FRAME_MAP, FRAME_RULES } from "@/contract/frames";
import {
  CONSULT_TOOL_ACL,
  EFFECT_ACL,
  HOST_PERMISSIONS,
  PERMISSION_RULES,
  type HostPermissionId,
} from "@/contract/permissions";
import { FAILURE_CASES, FAILURE_SCENARIO_IDS, type FailureCaseId } from "@/contract/failures";
import { PRODUCT_WIDGETS } from "@/contract/widgets";
import { FOLLOWUPS } from "@/player/fixtures/content";
import { getFrame, getScenario, overlayFrame } from "@/player/fixtures";
import { ScenarioPlayer } from "@/player/ScenarioPlayer";
import { TurnRenderer } from "@/renderer/TurnRenderer";
import type { TurnFrame } from "@/player/fixtures/types";

function Frame({
  title,
  kicker,
  note,
  children,
}: {
  readonly title: string;
  readonly kicker?: string;
  readonly note?: string;
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
      {note ? <p className="spec-preview-note">{note}</p> : null}
    </div>
  );
}

function specimenForFrame(id: string): TurnFrame | null {
  const row = FRAME_MAP.find((r) => r.id === id);
  if (!row?.specimen) return null;
  const frame = getFrame(getScenario(row.specimen.scenario), row.specimen.phase);
  if (id === "widget") {
    return overlayFrame(frame, {
      widgets: [
        { type: "product", kind: "cause_distribution", folded: false },
        { type: "prompt-list", items: FOLLOWUPS },
      ],
    });
  }
  return frame;
}

export function LifecyclePage() {
  const [noun, setNoun] = useState<AgentNounId>("turn");
  const current = AGENT_NOUNS.find((n) => n.id === noun) ?? AGENT_NOUNS[1];

  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">Conversation · Turn · Run · Effect · Artifact</span>
        <h1 className="spec-h1">Agent 生命周期</h1>
        <p className="spec-lede">
          五个名词的基数和边界。原型只投影「这一帧该画什么」；会话如何产生、有没有权限、扣不扣费、能不能恢复，都在主仓。
        </p>
      </header>

      <div className="spec-life-chain" role="tablist" aria-label="五个名词">
        {AGENT_NOUNS.map((n) => (
          <button
            key={n.id}
            type="button"
            className="spec-card"
            data-clickable="true"
            data-active={n.id === noun}
            role="tab"
            aria-selected={n.id === noun}
            onClick={() => setNoun(n.id)}
          >
            <span className="spec-chip" data-tone="ai">
              {n.name}
            </span>
            <strong>{n.zh}</strong>
            <p className="spec-meta">{n.card}</p>
          </button>
        ))}
      </div>

      <div className="spec-card spec-h3-gap">
        <h3 className="spec-h3">
          {current.name} · {current.zh}
        </h3>
        <p className="spec-meta">{current.owns}</p>
        <p className="spec-meta">{current.draws}</p>
        <p className="spec-meta">不是：{current.not}</p>
      </div>

      <section>
        <h2 className="spec-h2">基数</h2>
        <div className="spec-table-wrap" tabIndex={0}>
          <table className="spec-table">
            <thead>
              <tr>
                <th>从</th>
                <th>到</th>
                <th>基数</th>
                <th>锁</th>
              </tr>
            </thead>
            <tbody>
              {AGENT_CARDINALITY.map((row) => (
                <tr key={`${row.from}-${row.to}`}>
                  <td>{row.from}</td>
                  <td>{row.to}</td>
                  <td>
                    <code>{row.card}</code>
                  </td>
                  <td>{row.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="spec-h2">一次发送</h2>
        <p className="spec-meta">用户点发送之后，主仓走 1–7；原型只准备对应夹具帧。</p>
        <div className="spec-table-wrap" tabIndex={0}>
          <table className="spec-table">
            <thead>
              <tr>
                <th>#</th>
                <th>谁</th>
                <th>做</th>
                <th>原型</th>
              </tr>
            </thead>
            <tbody>
              {SEND_SEQUENCE.map((row) => (
                <tr key={row.n}>
                  <td>{row.n}</td>
                  <td>{row.actor}</td>
                  <td>{row.step}</td>
                  <td>{row.proto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="spec-note">
        {NOUN_BOUNDARIES.map((row) => (
          <p key={row.do}>
            <strong>要</strong> {row.do} <strong>不要</strong> {row.dont}
          </p>
        ))}
      </div>

      <Frame title="这一棵是 Turn" kicker="不是 Run" note="Run 的 attachment 只投影成 Dots 八态。会话壳在 1072。">
        <TurnRenderer frame={getFrame(getScenario("tool"), "settled")} view="persisted" />
      </Frame>
    </div>
  );
}

export function FramesPage() {
  const [tag, setTag] = useState<string>("delta");
  const current = FRAME_MAP.find((r) => r.id === tag) ?? FRAME_MAP[0];
  const specimen = useMemo(() => specimenForFrame(current.id), [current.id]);
  const engine = FRAME_MAP.filter((r) => (ENGINE_FRAME_TAGS as readonly string[]).includes(r.id));

  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">sikao contracts/*-frames.json</span>
        <h1 className="spec-h1">真实 Frame 对照</h1>
        <p className="spec-lede">
          主仓每一帧 tag 对应回合态、UI 槽、错误和终态。未知 tag、未知 widget kind 都 fail-soft，不画空白卡。
        </p>
      </header>

      <div className="spec-card">
        <h3 className="spec-h3">族</h3>
        <div className="spec-table-wrap" tabIndex={0}>
          <table className="spec-table">
            <thead>
              <tr>
                <th>族</th>
                <th>文件</th>
                <th>tags</th>
                <th>密度</th>
              </tr>
            </thead>
            <tbody>
              {FRAME_FAMILIES.map((row) => (
                <tr key={row.id}>
                  <td>
                    <code>{row.id}</code>
                  </td>
                  <td>{row.file}</td>
                  <td>{row.tags.join(" · ")}</td>
                  <td>{row.density}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="spec-seg spec-seg-quiet spec-h3-gap" role="tablist" aria-label="engine 帧">
        {engine.map((row) => (
          <button
            key={row.id}
            type="button"
            role="tab"
            aria-selected={tag === row.id}
            data-active={tag === row.id}
            onClick={() => setTag(row.id)}
          >
            {row.id}
          </button>
        ))}
      </div>
      <div className="spec-seg spec-seg-quiet" role="tablist" aria-label="讲题 / drill 帧">
        {FRAME_MAP.filter((row) => !engine.some((e) => e.id === row.id)).map((row) => (
          <button
            key={row.id}
            type="button"
            role="tab"
            aria-selected={tag === row.id}
            data-active={tag === row.id}
            onClick={() => setTag(row.id)}
          >
            {row.id}
          </button>
        ))}
      </div>

      <div className="spec-card spec-h3-gap">
        <h3 className="spec-h3">
          <code>{current.id}</code> · {current.family}
        </h3>
        <p className="spec-meta">主仓：{current.from}</p>
        <p className="spec-meta">状态：{current.phase}</p>
        <p className="spec-meta">UI：{current.ui}</p>
        <p className="spec-meta">错误：{current.error}</p>
        <p className="spec-meta">终态：{current.terminal}</p>
      </div>

      {specimen ? (
        <Frame title={`投影 · ${current.id}`} kicker={current.phase}>
          <TurnRenderer
            frame={specimen}
            view={
              current.specimen && ["settled", "error", "stop"].includes(current.specimen.phase)
                ? "persisted"
                : "live"
            }
          />
        </Frame>
      ) : (
        <p className="spec-meta spec-h3-gap">discard：这一帧不渲染，不占槽，不闪。</p>
      )}

      <section>
        <h2 className="spec-h2">逐帧表</h2>
        <div className="spec-table-wrap" tabIndex={0}>
          <table className="spec-table">
            <thead>
              <tr>
                <th>tag</th>
                <th>族</th>
                <th>主仓</th>
                <th>状态</th>
                <th>UI</th>
                <th>错误</th>
                <th>终态</th>
              </tr>
            </thead>
            <tbody>
              {FRAME_MAP.map((row) => (
                <tr
                  key={row.id}
                  data-active={row.id === tag}
                  onClick={() => setTag(row.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <code>{row.id}</code>
                  </td>
                  <td>{row.family}</td>
                  <td>{row.from}</td>
                  <td>{row.phase}</td>
                  <td>{row.ui}</td>
                  <td>{row.error}</td>
                  <td>{row.terminal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="spec-h2">13 个 widget kind</h2>
        <p className="spec-meta">
          共用 KindTag「数据」壳。每回合最多 1 张。不在此表的 kind = 未知，fail-soft。
        </p>
        <div className="spec-table-wrap" tabIndex={0}>
          <table className="spec-table">
            <thead>
              <tr>
                <th>kind</th>
                <th>标题</th>
                <th>画法</th>
                <th>锁</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCT_WIDGETS.map((w) => (
                <tr key={w.id}>
                  <td>
                    <code>{w.id}</code>
                  </td>
                  <td>{w.title}</td>
                  <td>{w.viz}</td>
                  <td>{w.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="spec-note">
        {FRAME_RULES.map((row) => (
          <p key={row.do}>
            <strong>要</strong> {row.do} <strong>不要</strong> {row.dont}
          </p>
        ))}
      </div>
    </div>
  );
}

export function PermissionsPage() {
  const [host, setHost] = useState<HostPermissionId>("home-dock");
  const current = HOST_PERMISSIONS.find((h) => h.id === host) ?? HOST_PERMISSIONS[0];

  return (
    <div className="spec-page">
      <header className="spec-hero">
        <span className="spec-kicker">context · write · approval</span>
        <h1 className="spec-h1">Context / Permission Matrix</h1>
        <p className="spec-lede">
          每个宿主能读什么、能写什么、何时审批。原型画门卡；主仓 ACL 决定来源能不能进模型。工具 schema 禁止 user_id。
        </p>
      </header>

      <div className="spec-seg spec-seg-quiet" role="tablist" aria-label="宿主">
        {HOST_PERMISSIONS.map((row) => (
          <button
            key={row.id}
            type="button"
            role="tab"
            aria-selected={host === row.id}
            data-active={host === row.id}
            onClick={() => setHost(row.id)}
          >
            {row.host}
          </button>
        ))}
      </div>

      <div className="spec-card spec-h3-gap">
        <h3 className="spec-h3">{current.host}</h3>
        <p className="spec-meta">
          capability <code>{current.capability}</code> · context <code>{current.context}</code>
        </p>
        <p className="spec-meta">读：{current.read}</p>
        <p className="spec-meta">写：{current.write}</p>
        <p className="spec-meta">
          审批：<span className="spec-chip" data-tone={current.approval === "活时门" || current.approval === "用户已确认" ? "warn" : current.approval === "禁止" ? "err" : "ok"}>{current.approval}</span>
          {" · "}
          {current.when}
        </p>
      </div>

      {current.approval === "活时门" ? (
        <Frame title="写库先停在门上" kicker="Approval" note="点选才继续。落定改用推荐卡，不把审批挂在答案下。">
          <TurnRenderer frame={getFrame(getScenario("gate"), "live")} view="live" />
        </Frame>
      ) : current.id === "review-path-a" ? (
        <p className="spec-meta spec-h3-gap">390 只留「请在桌面端使用」。不发 /runs。</p>
      ) : current.id === "teach" ? (
        <Frame title="卷面 Effect 不问门" kicker="Tutor" note="save-note 才走门卡。mark_* 不进 Turn 槽。">
          <TurnRenderer frame={getFrame(getScenario("tutor"), "settled")} view="persisted" />
        </Frame>
      ) : null}

      <section>
        <h2 className="spec-h2">宿主矩阵</h2>
        <div className="spec-table-wrap" tabIndex={0}>
          <table className="spec-table">
            <thead>
              <tr>
                <th>宿主</th>
                <th>capability</th>
                <th>读</th>
                <th>写</th>
                <th>审批</th>
                <th>何时</th>
              </tr>
            </thead>
            <tbody>
              {HOST_PERMISSIONS.map((row) => (
                <tr key={row.id} data-active={row.id === host} onClick={() => setHost(row.id)} style={{ cursor: "pointer" }}>
                  <td>
                    <strong>{row.host}</strong>
                  </td>
                  <td>
                    <code>{row.capability}</code>
                  </td>
                  <td>{row.read}</td>
                  <td>{row.write}</td>
                  <td>{row.approval}</td>
                  <td>{row.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="spec-h2">Consult 工具</h2>
        <div className="spec-table-wrap" tabIndex={0}>
          <table className="spec-table">
            <thead>
              <tr>
                <th>工具</th>
                <th>kind</th>
                <th>审批</th>
                <th>锁</th>
              </tr>
            </thead>
            <tbody>
              {CONSULT_TOOL_ACL.map((row) => (
                <tr key={row.name}>
                  <td>
                    <code>{row.name}</code>
                  </td>
                  <td>{row.kind}</td>
                  <td>{row.approval ? "活时门" : "否"}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="spec-h2">卷面 Effect</h2>
        <div className="spec-table-wrap" tabIndex={0}>
          <table className="spec-table">
            <thead>
              <tr>
                <th>工具</th>
                <th>kind</th>
                <th>审批</th>
                <th>宿主</th>
              </tr>
            </thead>
            <tbody>
              {EFFECT_ACL.map((row) => (
                <tr key={row.name}>
                  <td>
                    <code>{row.name}</code>
                  </td>
                  <td>{row.kind}</td>
                  <td>{row.approval ? "门" : "不问"}</td>
                  <td>{row.host}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="spec-note">
        {PERMISSION_RULES.map((row) => (
          <p key={row.do}>
            <strong>要</strong> {row.do} <strong>不要</strong> {row.dont}
          </p>
        ))}
      </div>
    </div>
  );
}

export function FailureLabPage() {
  const [id, setId] = useState<FailureCaseId>("offline");
  const current = FAILURE_CASES.find((c) => c.id === id) ?? FAILURE_CASES[0];

  return (
    <div className="spec-page" data-lab="failure">
      <header className="spec-hero">
        <span className="spec-kicker">fixtures · 不重连、不扣费</span>
        <h1 className="spec-h1">Failure & Recovery Lab</h1>
        <p className="spec-lede">
          断网、重复 seq、replay gap、partial-fail、停止失败、额度不足、权限过期、未知 widget。每一案都是夹具，不是第二套 AgentRuntime。
        </p>
      </header>

      <div className="spec-seg spec-seg-quiet" role="tablist" aria-label="失败案">
        {FAILURE_CASES.map((row) => (
          <button
            key={row.id}
            type="button"
            role="tab"
            aria-selected={id === row.id}
            data-active={id === row.id}
            onClick={() => setId(row.id)}
          >
            {row.title}
          </button>
        ))}
      </div>

      <div className="spec-card spec-h3-gap">
        <h3 className="spec-h3">{current.title}</h3>
        <p className="spec-meta">来源：{current.from}</p>
        <p className="spec-meta">状态：{current.phase}</p>
        <p className="spec-meta">画：{current.draw}</p>
        <p className="spec-meta">恢复：{current.recover}</p>
        <p className="spec-meta">禁止：{current.forbid}</p>
      </div>

      <div className="spec-preview-frame">
        <div className="spec-preview-head">
          <span className="spec-chip" data-tone={id === "offline" || id === "duplicate_seq" || id === "auth_expired" ? "warn" : id === "quota" || id === "stop_failed" ? "err" : "ai"}>
            {current.scenario}
          </span>
          <span className="spec-preview-title">{current.title}</span>
        </div>
        <div className="spec-preview-body spec-play-body">
          <ScenarioPlayer key={current.scenario} initialId={current.scenario} ids={FAILURE_SCENARIO_IDS} />
        </div>
      </div>

      <section>
        <h2 className="spec-h2">八案</h2>
        <div className="spec-table-wrap" tabIndex={0}>
          <table className="spec-table">
            <thead>
              <tr>
                <th>案</th>
                <th>来源</th>
                <th>画</th>
                <th>恢复</th>
                <th>禁止</th>
              </tr>
            </thead>
            <tbody>
              {FAILURE_CASES.map((row) => (
                <tr key={row.id} data-active={row.id === id} onClick={() => setId(row.id)} style={{ cursor: "pointer" }}>
                  <td>
                    <strong>{row.title}</strong>
                  </td>
                  <td>{row.from}</td>
                  <td>{row.draw}</td>
                  <td>{row.recover}</td>
                  <td>{row.forbid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
