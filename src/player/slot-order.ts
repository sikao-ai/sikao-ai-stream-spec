import {
  TURN_SLOT_IDS,
  markDrawn,
  timingMark,
  type DensityId,
  type StreamPhase,
  type TurnSlotId,
  type TurnView,
} from "@/contract/turn";
import type { TurnFrame } from "./fixtures/types";

/**
 * Slot presence is a function of the frame, not of live/persisted/replay.
 * Views only change animation (caret / instant chips), never order.
 */
export function visibleSlotIds(frame: TurnFrame, _view?: TurnView): TurnSlotId[] {
  return TURN_SLOT_IDS.filter((id) => slotPresent(frame, id));
}

export function slotPresent(frame: TurnFrame, id: TurnSlotId): boolean {
  const { phase, density } = frame;
  if (id === "composer") return false;
  if (id === "user") return Boolean(frame.user);
  if (id === "stem") return Boolean(frame.stem);
  if (id === "lookback") return phase === "settled" && Boolean(frame.lookback);

  const mark = timingMark(id, phase);
  if (id === "status") return markDrawn(mark);

  if (id === "expert-rail") {
    return markDrawn(mark) && density !== "short" && density !== "gate" && Boolean(frame.experts?.length);
  }
  if (id === "approval") {
    return markDrawn(mark) && density === "gate" && Boolean(frame.approval);
  }
  if (id === "prose") {
    if (frame.error && !frame.prose) return false;
    return markDrawn(mark) && Boolean(frame.prose);
  }
  if (id === "step-log") {
    if (density === "short") return false;
    return (mark === "fold" || markDrawn(mark)) && Boolean(frame.steps?.length);
  }
  if (id === "widgets") {
    return markDrawn(mark) && Boolean(frame.widgets?.length);
  }
  if (id === "footprint") {
    return markDrawn(mark) && Boolean(frame.prose);
  }
  if (id === "source-list") {
    return (
      mark === "点开" &&
      Boolean(frame.footprint?.sourcesOpen) &&
      Boolean(frame.sources?.length)
    );
  }
  return false;
}

export function isSubsequenceOfTurnSlots(ids: readonly string[]): boolean {
  let i = 0;
  for (const slot of TURN_SLOT_IDS) {
    if (ids[i] === slot) i += 1;
  }
  return i === ids.length;
}

export function viewSlotOrders(frame: TurnFrame): Record<TurnView, TurnSlotId[]> {
  return {
    live: visibleSlotIds(frame, "live"),
    persisted: visibleSlotIds(frame, "persisted"),
    replay: visibleSlotIds(frame, "replay"),
  };
}

export function densityAllowsLive(density: DensityId): boolean {
  return density !== "short";
}

export function collectRenderedSlots(root: ParentNode): string[] {
  return [...root.querySelectorAll("[data-turn-slot]")].map((el) => el.getAttribute("data-turn-slot") ?? "");
}

export function expectedMark(slot: TurnSlotId, phase: StreamPhase): string {
  return timingMark(slot, phase);
}
