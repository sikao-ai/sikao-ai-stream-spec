/**
 * Failure & recovery projections. Fixtures only — no reconnect, no second run.
 */

export const FAILURE_CONTRACT_VERSION = "1040.fail.v1" as const;

export const FAILURE_CASES: ReadonlyArray<{
  id: string;
  title: string;
  scenario: string;
  from: string;
  phase: string;
  draw: string;
  recover: string;
  forbid: string;
}> = [
  {
    id: "offline",
    title: "断网",
    scenario: "offline",
    from: "1031 detached / 传输失败",
    phase: "settled（上一回合）",
    draw: "保留已落定回合。无进行中 Dots。输入条不发 /runs。",
    recover: "连通后 attach 同一 Run；有 gap 走 replay_gap。",
    forbid: "本地伪造进度、心跳百分比、假专家栈。",
  },
  {
    id: "duplicate_seq",
    title: "重复 seq",
    scenario: "duplicate_seq",
    from: "SSE 重放同一 seq",
    phase: "与首次相同",
    draw: "第二帧像素不变。不重播进场动画。",
    recover: "忽略。游标不后退。",
    forbid: "闪一下、重复追加正文、重复 widget。",
  },
  {
    id: "replay_gap",
    title: "replay gap",
    scenario: "replay_gap",
    from: "1040 recovering / exhausted / replay_gap",
    phase: "recover",
    draw: "回合态 recover。已出字保留。按 seq 重放。",
    recover: "挂回同一 runId 补洞。",
    forbid: "重开第二 run；丢字；画成新的「正在想」。",
  },
  {
    id: "partial_fail",
    title: "partial-fail",
    scenario: "partial_fail",
    from: "多工具中一个失败",
    phase: "settled",
    draw: "成功块照常。失败工具 OpRow rejected 退灰 + 一句失败。发现卡仍可出。",
    recover: "整轮不是 error。可在下一问重试该写。",
    forbid: "对已成功步打叉；升成生成未确认。",
  },
  {
    id: "stop_failed",
    title: "停止失败",
    scenario: "stop_failed",
    from: "1040 stop_failed",
    phase: "error",
    draw: "回合态 error +「未能停止」。已出字只读。可重试停止。",
    recover: "retry-stop 同一 Run。成功才进 cancelled。",
    forbid: "画成已停止生成；把停止钮当成已生效。",
  },
  {
    id: "quota",
    title: "额度不足",
    scenario: "quota",
    from: "billing / daily quota / 403 ai_access",
    phase: "error",
    draw: "ErrorBand「额度不够」。无正文、无脚印、不进 Run。",
    recover: "查看额度。免费额次日重置。禁止当生成失败点重试。",
    forbid: "「生成未确认」；重试再打一次 429。",
  },
  {
    id: "auth_expired",
    title: "权限过期",
    scenario: "auth_expired",
    from: "1031 auth_required / 会话过期",
    phase: "recover",
    draw: "Dots recover +「需要登录后继续」。已出字只读。",
    recover: "去登录。回来 attach 同一 Turn。",
    forbid: "当失败重试；清成 idle；丢已出字。",
  },
  {
    id: "unknown_widget",
    title: "未知 widget",
    scenario: "unknown_widget",
    from: "type:widget 且 kind 不在 13 闭集",
    phase: "settled",
    draw: "该卡 fail-soft 不渲染。下一问等其余块照常。",
    recover: "无需恢复。日志记下 kind。",
    forbid: "空白卡；invent 新 kind 皮肤；堆多张。",
  },
];

export const FAILURE_SCENARIO_IDS = FAILURE_CASES.map((row) => row.scenario);

export type FailureCaseId = (typeof FAILURE_CASES)[number]["id"];
