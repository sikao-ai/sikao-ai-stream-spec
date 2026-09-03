/**
 * Pins this laboratory against sikao origin/main and the three contract versions.
 * CI fails when the sibling sikao checkout's origin/main SHA or locked copy diverges.
 */

import { COPY_LOCK, TURN_CONTRACT_VERSION, TURN_SLOT_IDS } from "./turn";
import { SHELL_CONTRACT_VERSION } from "./shell";
import { SCENE_CONTRACT_VERSION } from "./scenes";

export const CONTRACT_VERSION = "1067.w0.4" as const;
export const WORD_VERSION = "1066.v4" as const;
export const CONTRACT_PATH = "docs/plan/sik-1067-ai-stream-density-visual-contract.md" as const;

export const MANIFEST = {
  lab: "sikao-ai-stream-spec",
  role: "deterministic contract laboratory",
  draws: "同一输入状态应画成什么",
  doesNot: "状态如何产生、是否有权限、是否计费、能否恢复",
  sikaoOriginMainSha: "385221e5598380001d39b43b8ea3c4841675a35f",
  sikaoOriginMainSubject: "docs(review): SIK-1040 slot release 90s H5 r1 PASS",
  turnContractVersion: TURN_CONTRACT_VERSION,
  shellContractVersion: SHELL_CONTRACT_VERSION,
  sceneContractVersion: SCENE_CONTRACT_VERSION,
  streamContractVersion: CONTRACT_VERSION,
  wordVersion: WORD_VERSION,
  streamContractPath: CONTRACT_PATH,
  turnSlotIds: TURN_SLOT_IDS,
  copyLockSlots: COPY_LOCK.map((row) => row.slot),
  copyLockCopies: COPY_LOCK.map((row) => row.copy),
} as const;

export const SIKAO_PIN_STRINGS = [
  CONTRACT_VERSION,
  WORD_VERSION,
  "到你了",
  "你记过",
  "查看笔记",
  "正在想",
  "已完成",
  "已停止生成",
  "Feature Flag: not required",
] as const;
