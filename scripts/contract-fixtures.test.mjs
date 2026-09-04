import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const turn = readFileSync(new URL("../src/contract/turn.ts", import.meta.url), "utf8");
const widgets = readFileSync(new URL("../src/contract/widgets.ts", import.meta.url), "utf8");
const shell = readFileSync(new URL("../src/contract/shell.ts", import.meta.url), "utf8");
const scenes = readFileSync(new URL("../src/contract/scenes.ts", import.meta.url), "utf8");
const manifest = readFileSync(new URL("../src/contract/manifest.ts", import.meta.url), "utf8");
const fixtures = readFileSync(new URL("../src/player/fixtures/scenarios.ts", import.meta.url), "utf8");
const slotOrder = readFileSync(new URL("../src/player/slot-order.ts", import.meta.url), "utf8");
const player = readFileSync(new URL("../src/player/ScenarioPlayer.tsx", import.meta.url), "utf8");
const renderer = readFileSync(new URL("../src/renderer/TurnRenderer.tsx", import.meta.url), "utf8");
const gallery = readFileSync(new URL("../src/components/gallery.tsx", import.meta.url), "utf8");
const specApp = readFileSync(new URL("../src/components/spec-app.tsx", import.meta.url), "utf8");
const specRuntime = readFileSync(new URL("../src/components/spec-runtime.tsx", import.meta.url), "utf8");
const labs = readFileSync(new URL("../src/labs/live-model-demo/AiDock.tsx", import.meta.url), "utf8");
const lifecycle = readFileSync(new URL("../src/contract/lifecycle.ts", import.meta.url), "utf8");
const frames = readFileSync(new URL("../src/contract/frames.ts", import.meta.url), "utf8");
const permissions = readFileSync(new URL("../src/contract/permissions.ts", import.meta.url), "utf8");
const failures = readFileSync(new URL("../src/contract/failures.ts", import.meta.url), "utf8");

const REQUIRED = [
  "short",
  "tool",
  "teach",
  "gate",
  "stop_pending",
  "cancelled",
  "provider_unknown",
  "replay_gap",
  "hitl",
  "review-teacher",
  "review-path-a",
  "tutor",
  "guided",
  "teach-aid",
  "cause-act1",
  "essay",
  "offline",
  "duplicate_seq",
  "partial_fail",
  "stop_failed",
  "quota",
  "auth_expired",
  "unknown_widget",
];

test("cite contract locks 1070 float and after-footprint list", () => {
  const cite = readFileSync(new URL("../src/contract/cite.ts", import.meta.url), "utf8");
  assert.match(cite, /export const CITE_STATES/);
  assert.match(cite, /id: "streaming"/);
  assert.match(cite, /id: "open"/);
  assert.match(cite, /id: "invalid"/);
  assert.match(cite, /id: "list"/);
  assert.match(cite, /这条已经没了/);
  assert.match(cite, /仅 after-footprint/);
  assert.match(cite, /不顶脚印/);
  assert.match(cite, /展开推进 footer/);
});

test("turn contract exports the copyable tree", () => {
  for (const id of [
    "user",
    "stem",
    "status",
    "expert-rail",
    "approval",
    "prose",
    "step-log",
    "lookback",
    "widgets",
    "footprint",
    "source-list",
    "composer",
  ]) {
    assert.match(turn, new RegExp(`id: "${id}"`));
  }
  assert.match(turn, /export const TIMING_MATRIX/);
  assert.match(turn, /export const COPY_LOCK/);
  assert.match(turn, /export const ALIGN_RULES/);
  assert.match(turn, /export const TURN_RHYTHM/);
  assert.match(turn, /section: 16/);
  assert.match(turn, /cluster: 2/);
  assert.match(turn, /禁止负 margin 贴上/);
  assert.match(turn, /发现\/推荐是模块卡/);
  assert.match(turn, /拼装不换皮/);
  assert.match(turn, /同样 hug 沉底/);
  assert.match(turn, /禁止流内改透明通栏/);
  assert.match(turn, /禁止发丝线，纯色块/);
  assert.match(gallery, /拼装不许换皮/);
  assert.match(gallery, /选项通栏/);
  assert.match(gallery, /夹具在回合下方/);
  assert.doesNotMatch(renderer, /导航 CTA · 炭黑/);
  assert.match(renderer, /spec-turn-play-kicker/);
  assert.match(turn, /正在想/);
  assert.match(turn, /等你选/);
  assert.match(turn, /export const BELOW_ANSWER/);
  assert.match(turn, /脚印下方只允许来源列表/);
  assert.match(turn, /default-collapsed/);
  assert.match(turn, /export const RENDERER_PACK/);
  assert.match(turn, /确认门/);
  assert.match(turn, /发现卡/);
  assert.match(turn, /Context Card/);
  assert.match(turn, /export const ENTER_MOTION/);
  assert.match(turn, /scale \.98/);
  assert.match(turn, /480ms/);
  assert.match(turn, /state: "stop_failed"/);
  assert.match(turn, /条「未能停止」/);
  assert.doesNotMatch(turn, /provider_unknown \/ failed \/ stop_failed/);
});

test("product widget frames and misalign playbook", () => {
  for (const id of [
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
  ]) {
    assert.match(widgets, new RegExp(`id: "${id}"`));
  }
  assert.match(widgets, /fail-soft/);
  assert.match(widgets, /先修 X，再修 Y/);
  assert.match(widgets, /vp1440/);
  assert.match(widgets, /vp390/);
});

test("shell contract locks Prompt Bar and float/rail/sheet", () => {
  assert.match(shell, /export const PROMPT_BAR/);
  assert.match(shell, /id: "float"/);
  assert.match(shell, /id: "rail"/);
  assert.match(shell, /id: "ios"/);
  assert.match(shell, /不是 ACL 接通/);
  assert.match(shell, /export const MOBILE_CHROME/);
  assert.match(shell, /iconVisual: 32/);
  assert.match(shell, /hit: 44/);
  assert.match(shell, /禁止 44×44 方块按钮/);
  assert.match(shell, /export const MOBILE_TYPE/);
  assert.match(shell, /composerWeb: "14 \/ 18 \/ 400"/);
  assert.match(shell, /chromeMeta: "13 \/ 18 \/ 400"/);
  assert.match(shell, /禁止把占位撑到 16/);
  assert.match(shell, /export const SESSION_MANAGER/);
  assert.match(shell, /下拉 popover 贴标题/);
  assert.match(shell, /export const PAGE_LOCATOR/);
  assert.match(shell, /export const BAR_STATUS/);
  assert.match(shell, /kicker: "正在看"/);
  assert.match(shell, /id: "listening"/);
  assert.match(shell, /不进 dock 顶栏/);
  assert.match(shell, /为新状态另造皮/);
  assert.match(shell, /id: "closed"/);
  assert.match(shell, /id: "empty"/);
  assert.match(shell, /390 Path A 不挂/);
  assert.match(shell, /export const SHELL_PACK/);
  assert.match(shell, /export const SHELL_SCENES/);
  assert.match(shell, /从这一页接着问/);
  assert.match(shell, /问这道题/);
  assert.match(shell, /N−1 条 inset 短线/);
  assert.match(turn, /id: "session-mgr"/);
  assert.match(turn, /id: "path-a-390"/);
});

test("scene fixtures name hosts and exception states", () => {
  assert.match(scenes, /id: "stop_pending"/);
  assert.match(scenes, /id: "cancelled"/);
  assert.match(scenes, /id: "provider_unknown"/);
  assert.match(scenes, /id: "stop_failed"/);
  assert.match(scenes, /id: "replay_gap"/);
  assert.match(scenes, /host: "Review Path A"/);
  assert.match(scenes, /请在桌面端使用/);
  assert.match(scenes, /材料 \| 方向 \| 对话/);
  assert.match(scenes, /幕1/);
});

test("required player fixtures exist", () => {
  for (const id of REQUIRED) {
    assert.match(fixtures, new RegExp(`id: "${id}"`), `missing scenario ${id}`);
  }
});

test("slot order is view-invariant by construction", () => {
  assert.match(slotOrder, /function visibleSlotIds\(frame: TurnFrame, _view\?: TurnView\)/);
  assert.match(slotOrder, /live: visibleSlotIds\(frame, "live"\)/);
  assert.match(slotOrder, /persisted: visibleSlotIds\(frame, "persisted"\)/);
  assert.match(slotOrder, /replay: visibleSlotIds\(frame, "replay"\)/);
  assert.match(renderer, /visibleSlotIds\(frame, view\)/);
  assert.match(player, /ScenarioPlayer/);
});

test("canonical pages do not mount live model demo", () => {
  assert.doesNotMatch(specApp, /from "@\/labs\/live-model-demo/);
  assert.doesNotMatch(specApp, /askSikao/);
  assert.doesNotMatch(specApp, /sikao-ai-dock-chats/);
  assert.doesNotMatch(specRuntime, /from "@\/labs\/live-model-demo/);
  assert.match(labs, /data-demo-only="true"/);
  assert.match(labs, /askSikao/);
});

test("runtime chapters project Conversation/Turn/Run/Effect/Artifact", () => {
  for (const noun of ["conversation", "turn", "run", "effect", "artifact"]) {
    assert.match(lifecycle, new RegExp(`id: "${noun}"`));
  }
  assert.match(lifecycle, /禁止开第二 run/);
  assert.match(specApp, /LifecyclePage/);
  assert.match(specRuntime, /Agent 生命周期/);
});

test("frame map pins engine tags and widget fail-soft", () => {
  for (const tag of [
    "action",
    "delta",
    "discard",
    "done",
    "error",
    "hitl_interrupt",
    "op",
    "phase",
    "proposal",
    "reasoning",
    "surface",
    "suspended",
    "terminal",
    "tool",
    "widget",
  ]) {
    assert.match(frames, new RegExp(`"${tag}"`));
    assert.match(frames, new RegExp(`id: "${tag}"`));
  }
  assert.match(frames, /未知 kind fail-soft/);
  assert.match(specRuntime, /真实 Frame 对照/);
});

test("permission matrix names hosts and HITL writes", () => {
  for (const host of ["Home dock", "Teach / Tutor", "Guided 申论", "复盘教师 Path A", "计划"]) {
    assert.match(permissions, new RegExp(host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(permissions, /propose_plan_changes/);
  assert.match(permissions, /add_to_note/);
  assert.match(permissions, /活时门/);
  assert.match(permissions, /390 只留桌面门/);
  assert.match(specRuntime, /Permission Matrix/);
});

test("failure lab covers the eight cases", () => {
  for (const id of [
    "offline",
    "duplicate_seq",
    "replay_gap",
    "partial_fail",
    "stop_failed",
    "quota",
    "auth_expired",
    "unknown_widget",
  ]) {
    assert.match(failures, new RegExp(`id: "${id}"`));
  }
  assert.match(failures, /重开第二 run/);
  assert.match(specRuntime, /Failure & Recovery Lab/);
  assert.match(specRuntime, /key=\{current\.scenario\}/);
  assert.match(player, /ids\?: readonly string\[]/);
  assert.match(player, /ids\?\.length \? null/);
  assert.match(fixtures, /id: "auth_expired"/);
  assert.doesNotMatch(
    fixtures.slice(fixtures.indexOf('id: "auth_expired"'), fixtures.indexOf('id: "unknown_widget"')),
    /error: \{/,
  );
});

test("manifest pins SHA and versions", () => {
  assert.match(manifest, /sikaoOriginMainSha: "385221e5598380001d39b43b8ea3c4841675a35f"/);
  assert.match(manifest, /turnContractVersion: TURN_CONTRACT_VERSION/);
  assert.match(manifest, /shellContractVersion: SHELL_CONTRACT_VERSION/);
  assert.match(manifest, /1067\.w0\.4/);
  assert.match(manifest, /1066\.v4/);
});
