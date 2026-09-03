import type { TurnView } from "@/contract/turn";
import { LOOKBACK_KICKER } from "@/lib/spec-catalog";
import { getFrame, getScenario, overlayFrame } from "@/player/fixtures";
import { visibleSlotIds } from "@/player/slot-order";
import type { TurnFrame, WidgetSpec } from "@/player/fixtures/types";
import {
  AnswerBody,
  ContextCard,
  ExpertFeed,
  ActionChip,
  FillBtn,
  FilterTable,
  InsightCards,
  MethodCard,
  PromptList,
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

  return (
    <TurnStream>
      <div data-turn-view={view} data-scenario-density={frame.density} data-testid="turn-renderer">
        {slots.map((id) => {
          if (id === "user") {
            return (
              <TurnBlock key={id} kind="user">
                <div data-turn-slot="user">
                  <UserBubble content={frame.user} />
                </div>
              </TurnBlock>
            );
          }
          if (id === "stem" && frame.stem) {
            return (
              <TurnBlock key={id} kind="process">
                <div data-turn-slot="stem">
                  <StemMark text={frame.stem} aid={frame.stemAid} />
                </div>
              </TurnBlock>
            );
          }
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
                {frame.phase === "error" && frame.error ? <ErrorBand title={frame.error.title} /> : null}
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
                <span className="sk-stem-kicker">{LOOKBACK_KICKER}</span>
                <ContextCard item={frame.lookback} numbered={false} invalid={frame.lookback.invalid} />
              </div>
            ) : null
          }
          widgets={frame.phase === "settled" && frame.widgets ? <WidgetStack widgets={frame.widgets} /> : null}
        />
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
          return <PromptList key={i} items={w.items} />;
        }
        if (w.type === "nav-cta") {
          return (
            <div key={i} className="sk-nav-cta">
              <FillBtn>{w.label}</FillBtn>
              <span className="spec-meta">导航 CTA · 炭黑，不是柔黄</span>
            </div>
          );
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

export function DensityStream({
  density,
  phase = "settled",
  question,
  sourcesOpen = false,
  onGateResolved,
}: {
  readonly density: TurnFrame["density"];
  readonly phase?: TurnFrame["phase"];
  readonly question?: string;
  readonly sourcesOpen?: boolean;
  readonly onGateResolved?: (kind: "ok" | "skip") => void;
}) {
  const scenario = getScenario(density);
  const resolvedPhase = density === "short" && phase === "live" ? "waiting" : phase;
  const base = getFrame(scenario, resolvedPhase);
  const frame = overlayFrame(base, {
    user: question ?? base.user,
    footprint: base.footprint
      ? { ...base.footprint, sourcesOpen: sourcesOpen || base.footprint.sourcesOpen }
      : base.footprint,
  });
  return <TurnRenderer frame={frame} view="live" onGateResolved={onGateResolved} />;
}
