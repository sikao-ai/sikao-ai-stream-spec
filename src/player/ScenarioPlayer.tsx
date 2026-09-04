import { useEffect, useMemo, useState } from "react";
import { Pause, Play, SkipForward, StepForward } from "lucide-react";
import { TURN_VIEWS, type TurnView } from "@/contract/turn";
import { TurnRenderer } from "@/renderer/TurnRenderer";
import { SCENARIOS, getScenario } from "./fixtures";
import { viewSlotOrders, visibleSlotIds } from "./slot-order";

const PLAY_MS = 400;

export function ScenarioPlayer({
  initialId = "tool",
  compact = false,
  ids,
}: {
  readonly initialId?: string;
  readonly compact?: boolean;
  readonly ids?: readonly string[];
}) {
  const catalog = useMemo(
    () => (ids?.length ? SCENARIOS.filter((s) => ids.includes(s.id)) : SCENARIOS),
    [ids],
  );
  const [id, setId] = useState(initialId);
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<TurnView>("live");
  const [playing, setPlaying] = useState(false);
  const scenario = useMemo(() => getScenario(id), [id]);

  useEffect(() => {
    setId(initialId);
  }, [initialId]);

  useEffect(() => {
    if (ids?.length && !ids.includes(id)) setId(ids[0]);
  }, [ids, id]);

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [id]);

  useEffect(() => {
    if (!playing) return;
    if (index >= scenario.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setIndex((i) => Math.min(scenario.frames.length - 1, i + 1)), PLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, index, scenario.frames.length]);

  const frame = scenario.frames[Math.min(index, scenario.frames.length - 1)];
  const orders = viewSlotOrders(frame);
  const slots = visibleSlotIds(frame, view);
  const same =
    orders.live.join() === orders.persisted.join() && orders.persisted.join() === orders.replay.join();

  return (
    <div className="spec-player" data-testid="scenario-player" data-scenario={scenario.id} data-view={view}>
      {compact ? null : (
        <div className="spec-player-toolbar">
          {ids?.length ? null : (
            <label className="spec-player-field">
              <span>场景</span>
              <select value={id} onChange={(e) => setId(e.target.value)} aria-label="场景">
                {catalog.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="spec-seg spec-seg-quiet" role="tablist" aria-label="投影">
            {TURN_VIEWS.map((v) => (
              <button key={v} type="button" role="tab" aria-selected={view === v} data-active={view === v} onClick={() => setView(v)}>
                {v}
              </button>
            ))}
          </div>
          <div className="spec-player-transport">
            <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "暂停" : "播放"}>
              {playing ? <Pause size={14} /> : <Play size={14} />}
              {playing ? "暂停" : "播放"}
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(scenario.frames.length - 1, i + 1))}
              aria-label="下一帧"
            >
              <StepForward size={14} />
              下一帧
            </button>
            <button type="button" onClick={() => setIndex(scenario.frames.length - 1)} aria-label="跳到终态">
              <SkipForward size={14} />
              终态
            </button>
          </div>
        </div>
      )}
      <p className="spec-meta">
        {scenario.host} · {scenario.runtime} · 帧 {index + 1}/{scenario.frames.length} · {frame.phase}
        {frame.seq != null ? ` · seq ${frame.seq}` : ""} · 槽 {slots.join(" → ") || "—"}
        {same ? " · live/persisted/replay 顺序一致" : " · 顺序不一致"}
      </p>
      <TurnRenderer frame={frame} view={view} />
    </div>
  );
}
