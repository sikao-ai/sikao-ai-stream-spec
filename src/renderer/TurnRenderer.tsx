import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import type { TurnView } from "@/contract/turn";
import { LOOKBACK_KICKER } from "@/lib/spec-catalog";
import { getFrame, getScenario, overlayFrame } from "@/player/fixtures";
import { visibleSlotIds } from "@/player/slot-order";
import type { TurnFrame, WidgetSpec } from "@/player/fixtures/types";
import { ProductWidget } from "@/renderer/ProductWidget";
import {
  AnswerBody,
  ContextCard,
  ExpertFeed,
  ActionChip,
  FillBtn,
  FilterTable,
  InsightCards,
  MethodCard,
  FollowupFold,
  ProposalCard,
  RecommendCard,
  StemMark,
  TurnBlock,
  TurnStatusLine,
  TurnStream,
  UserBubble,
  YouTryGate,
  OpRow,
  ErrorBand,
  type ApproveSpecimen,
} from "@/components/stream/primitives";

export function TurnRenderer({
  frame,
  view = "live",
  onGateResolved,
}: {
  readonly frame: TurnFrame;
  readonly view?: TurnView;
  readonly onGateResolved?: (kind: "ok" | "skip") => void;
}) {
  const slots = visibleSlotIds(frame, view);
  const instant = view === "persisted";
  const liveId = frame.experts?.at(-1)?.id;
  const foldable = Boolean(frame.status.foldable);
  const showStepFold = slots.includes("step-log");

  const userSlot = slots.includes("user") ? (
    <TurnBlock key="user" kind="user">
      <div data-turn-slot="user">
        <UserBubble content={frame.user} />
      </div>
    </TurnBlock>
  ) : null;

  const stemSlot =
    slots.includes("stem") && frame.stem ? (
      <TurnBlock key="stem" kind="process">
        <div data-turn-slot="stem">
          <StemMark text={frame.stem} aid={frame.stemAid} />
        </div>
      </TurnBlock>
    ) : null;

  return (
    <TurnStream>
      <div data-turn-view={view} data-scenario-density={frame.density} data-testid="turn-renderer">
        {userSlot}
        <div className="sk-turn-col">
        {stemSlot}
        {slots.map((id) => {
          if (id === "user" || id === "stem") return null;
          if (id === "status") {
            return (
              <TurnBlock key={id} kind="process">
                <div data-turn-slot="status">
                  <TurnStatusLine
                    key={`${frame.phase}-${view}`}
                    state={frame.status.state}
                    copy={frame.status.copy}
                    status={statusFor(frame)}
                    time={frame.status.time}
                    foldable={foldable && showStepFold}
                    defaultOpen={frame.status.defaultOpen}
                    rail={
                      slots.includes("expert-rail") && frame.experts ? (
                        <div data-turn-slot="expert-rail">
                          <ExpertFeed experts={frame.experts} liveId={view === "live" ? liveId : undefined} instant={instant} />
                        </div>
                      ) : undefined
                    }
                  >
                    {showStepFold && frame.steps ? (
                      <div data-turn-slot="step-log">
                        {frame.steps.map((step, i) => (
                          <OpRow
                            key={`${step.op}-${i}`}
                            op={step.op}
                            text={step.text}
                            live={step.live}
                            status={step.status}
                            elapsed={step.elapsed}
                          />
                        ))}
                      </div>
                    ) : null}
                  </TurnStatusLine>
                </div>
                {slots.includes("approval") && frame.approval ? (
                  <div data-turn-slot="approval">
                    <ProposalCard
                      blocking={frame.approval.blocking}
                      title={frame.approval.title}
                      reason={frame.approval.reason}
                      options={frame.approval.options}
                      specimen={frame.approval.specimen as ApproveSpecimen | undefined}
                      onResolved={onGateResolved}
                    />
                  </div>
                ) : null}
                {frame.phase === "error" && frame.error ? (
                  <ErrorBand title={frame.error.title} action={frame.error.action} />
                ) : null}
              </TurnBlock>
            );
          }
          if (id === "expert-rail" || id === "approval" || id === "step-log") {
            return null;
          }
          if (id === "prose" || id === "lookback" || id === "widgets" || id === "footprint" || id === "source-list") {
            return null;
          }
          return null;
        })}
        <AnswerBody
          phase={frame.phase}
          paragraphs={frame.prose?.paragraphs}
          streaming={Boolean(frame.prose?.streaming) && view !== "persisted"}
          sources={frame.sources ?? []}
          sourcesOpen={Boolean(frame.footprint?.sourcesOpen)}
          extra={
            frame.phase === "settled" && frame.lookback ? (
              <div className="sk-lookback" data-turn-slot="lookback" data-ticket="SIK-1070">
                <span className="sk-lookback-kicker">{LOOKBACK_KICKER}</span>
                <ContextCard item={frame.lookback} numbered={false} invalid={frame.lookback.invalid} />
              </div>
            ) : null
          }
          widgets={frame.phase === "settled" && frame.widgets ? <WidgetStack widgets={frame.widgets} /> : null}
        />
        </div>
      </div>
    </TurnStream>
  );
}

function WidgetStack({ widgets }: { readonly widgets: readonly WidgetSpec[] }) {
  return (
    <>
      {widgets.map((w, i) => {
        if (w.type === "method") {
          return <MethodCard key={i} title={w.title} reason={w.reason} folded={w.folded !== false} />;
        }
        if (w.type === "youtry") {
          return <YouTryGate key={i} title={w.title} items={w.items} folded={w.folded !== false} />;
        }
        if (w.type === "action-chips") {
          return (
            <div key={i} className="sk-achip-stack">
              {w.items.map((label) => (
                <ActionChip key={label} label={label} />
              ))}
            </div>
          );
        }
        if (w.type === "recommend") {
          return <RecommendCard key={i} question={w.question} choices={w.choices} specimen={w.specimen} />;
        }
        if (w.type === "insight") {
          return <InsightCards key={i} items={w.items} empty={w.empty} />;
        }
        if (w.type === "filter") {
          return <FilterTable key={i} rows={w.rows} empty={w.empty} />;
        }
        if (w.type === "prompt-list") {
          return <FollowupFold key={i} items={w.items} />;
        }
        if (w.type === "nav-cta") {
          return (
            <div key={i} className="sk-nav-cta">
              <FillBtn>{w.label}</FillBtn>
            </div>
          );
        }
        if (w.type === "product") {
          if (w.kind === "unknown") return null;
          return <ProductWidget key={i} kind={w.kind} folded={w.folded !== false} />;
        }
        return null;
      })}
    </>
  );
}

function statusFor(frame: TurnFrame) {
  const phase = frame.phase;
  if (phase === "streaming") return "stream" as const;
  if (phase === "settled") return "done" as const;
  if (phase === "stop") return "stop" as const;
  if (phase === "error") return "error" as const;
  if (phase === "recover") return "recover" as const;
  if (phase === "halt") return "halt" as const;
  return null;
}

const PLAY_PHASES = ["waiting", "live", "streaming", "settled"] as const;

export function DensityStream({
  density,
  phase = "settled",
  question,
  sourcesOpen = false,
  onGateResolved,
  playable = false,
}: {
  readonly density: TurnFrame["density"];
  readonly phase?: TurnFrame["phase"];
  readonly question?: string;
  readonly sourcesOpen?: boolean;
  readonly onGateResolved?: (kind: "ok" | "skip") => void;
  readonly playable?: boolean;
}) {
  const scenario = getScenario(density);
  const playFrames = useMemo(
    () => scenario.frames.filter((f) => (PLAY_PHASES as readonly string[]).includes(f.phase)),
    [scenario],
  );
  const settledAt = Math.max(0, playFrames.findIndex((f) => f.phase === "settled"));
  const startAt = useMemo(() => {
    if (playable && density === "gate") {
      const live = playFrames.findIndex((f) => f.phase === "live");
      return live >= 0 ? live : 0;
    }
    if (playable) return settledAt;
    const resolvedPhase = density === "short" && phase === "live" ? "waiting" : phase;
    const at = playFrames.findIndex((f) => f.phase === resolvedPhase);
    return at >= 0 ? at : settledAt;
  }, [density, phase, playable, playFrames, settledAt]);
  const [index, setIndex] = useState(startAt);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setIndex(startAt);
    setPlaying(false);
  }, [startAt]);

  useEffect(() => {
    if (!playing || !playable) return;
    if (index >= playFrames.length - 1) {
      setPlaying(false);
      return;
    }
    const ms = playFrames[index]?.phase === "streaming" ? 900 : 650;
    const t = window.setTimeout(() => setIndex((i) => Math.min(playFrames.length - 1, i + 1)), ms);
    return () => window.clearTimeout(t);
  }, [playing, playable, index, playFrames]);

  const current = playFrames[Math.min(index, playFrames.length - 1)] ?? getFrame(scenario, phase);
  const frame = overlayFrame(current, {
    user: question ?? current.user,
    footprint: current.footprint
      ? { ...current.footprint, sourcesOpen: sourcesOpen || current.footprint.sourcesOpen }
      : current.footprint,
  });

  return (
    <div className="spec-turn" data-playable={playable ? "true" : "false"}>
      <TurnRenderer frame={frame} view="live" onGateResolved={onGateResolved} />
      {playable ? (
        <div className="spec-turn-play" role="group" aria-label="夹具播放">
          <span className="spec-turn-play-kicker">夹具</span>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "暂停" : "播放"}>
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? "暂停" : "播放"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setIndex((i) => Math.min(playFrames.length - 1, i + 1));
            }}
            aria-label="下一帧"
          >
            <StepForward size={14} />
            下一帧
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setIndex(0);
              setPlaying(true);
            }}
            aria-label="重放"
          >
            <RotateCcw size={14} />
            重放
          </button>
          <span className="spec-meta">
            {frame.phase} · {index + 1}/{playFrames.length}
          </span>
        </div>
      ) : null}
    </div>
  );
}
