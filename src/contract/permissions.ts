/**
 * Host × context × write × approval. Prototype draws the gate chrome;
 * sikao ACL decides whether a source actually enters the model.
 */

export const PERMISSION_CONTRACT_VERSION = "1036.acl.v1" as const;

export const HOST_PERMISSIONS: ReadonlyArray<{
  id: string;
  host: string;
  capability: string;
  context: string;
  read: string;
  write: string;
  approval: "无" | "活时门" | "用户已确认" | "禁止";
  when: string;
}> = [
  {
    id: "home-dock",
    host: "Home dock",
    capability: "consult.turn",
    context: "snapshot_v1",
    read: "本人总览 / 统计 / 弱项 / 计划事件 / 本场结果 / 已有笔记。工具不收 user_id。",
    write: "不直接写库。render_stats_widget 只出 ephemeral 数据卡，零计费。",
    approval: "活时门",
    when: "propose_plan_changes / propose_extend_plan_horizon / add_to_note / organize_notes / adjust_exam_target",
  },
  {
    id: "review-cockpit",
    host: "复盘 Cockpit",
    capability: "consult.turn + review.cause.*",
    context: "snapshot + 复盘快照",
    read: "本轮错因 / 你记过 / 题目。B 类 get_recent_wrong 不得进 teach_data。",
    write: "无对话写库。发现卡只读。",
    approval: "无",
    when: "写笔记仍回 Home/Notes 门卡，不在 Cockpit 偷写。",
  },
  {
    id: "answer-session",
    host: "Answer Session",
    capability: "consult.turn",
    context: "answer_session 当前题",
    read: "本场题面与作答。lock_session_question 只定位。",
    write: "无。",
    approval: "无",
    when: "未提交作答前禁止教学向工具（tutor_mode_forbidden）。",
  },
  {
    id: "notes",
    host: "笔记",
    capability: "notes.summary/polish/title + consult gate",
    context: "owned_note_*",
    read: "本人笔记版本 / 选区 / 候选池。",
    write: "整理、润色、写入笔记。",
    approval: "活时门",
    when: "任何写库。长任务 summary/polish 走 1037，不进四密流。",
  },
  {
    id: "teach",
    host: "Teach / Tutor",
    capability: "teach.xingce.turn",
    context: "question_grounded",
    read: "本题题面 / 解析 / canonical。teach_data 范围，不含 B 类漏答工具。",
    write: "卷面 Effect 五 kind；finish_teaching。",
    approval: "无",
    when: "卷面标注不问门。save-note 才走门卡。",
  },
  {
    id: "guided",
    host: "Guided 申论",
    capability: "teach.essay.guided_turn",
    context: "draft_plus_question",
    read: "本题 + 当前草稿 + 材料。材料/方向栏不是 Turn。",
    write: "exactly_one_tool 指导。禁止代写正文。",
    approval: "用户已确认",
    when: "answer_continue 必须 user_confirmed_action。next_question 只读建议。",
  },
  {
    id: "review-path-a",
    host: "复盘教师 Path A",
    capability: "teach.review.turn",
    context: "review_live_plus_server_snapshot_v1",
    read: "桌面：题面教具 + 复盘快照。",
    write: "同 teach。",
    approval: "无",
    when: "390 只留桌面门：不挂 Host / 会话 / composer，不发 /runs。",
  },
  {
    id: "essay-drill",
    host: "Essay drill",
    capability: "essay_drill.turn",
    context: "drill_session_question",
    read: "本 drill 题与单元。",
    write: "action 帧（W5）。批改不走对话写。",
    approval: "无",
    when: "批改走 grading.* + ProgressAtom。",
  },
  {
    id: "plan",
    host: "计划",
    capability: "plan.generate/adjust/extend",
    context: "user_confirmed_action",
    read: "本人计划事件。",
    write: "写入/续写计划。",
    approval: "活时门",
    when: "Agent 停住等点。落定用推荐卡，不把审批再挂答案下。",
  },
  {
    id: "grading",
    host: "申论批改",
    capability: "grading.shenlun.v3/v4",
    context: "answer_materials_rubric",
    read: "答卷 + 材料 + 量表。",
    write: "Artifact 批改结果。",
    approval: "禁止",
    when: "不进对话流。ProgressAtom 闭集 phase。",
  },
  {
    id: "exclude",
    host: "embedding / eval / worker",
    capability: "embedding.* / eval.*",
    context: "—",
    read: "无 UI。",
    write: "无 UI。",
    approval: "禁止",
    when: "禁止套本规范。",
  },
];

export type HostPermissionId = (typeof HOST_PERMISSIONS)[number]["id"];

export const CONSULT_TOOL_ACL: ReadonlyArray<{
  name: string;
  kind: "data_read" | "widget_render" | "proposal_write";
  approval: boolean;
  note: string;
}> = [
  { name: "get_overview", kind: "data_read", approval: false, note: "总览。user_id 由 bound user 注入。" },
  { name: "get_stats_by_type / get_stats_cross / get_trend / get_weakness", kind: "data_read", approval: false, note: "统计只读。" },
  { name: "list_plan_events / get_session_result / lock_session_question", kind: "data_read", approval: false, note: "计划与本场。定位不是写。" },
  { name: "render_stats_widget", kind: "widget_render", approval: false, note: "ephemeral · 零计费 · 服务端组 payload。" },
  { name: "propose_plan_changes", kind: "proposal_write", approval: true, note: "活时门。幂等 proposal_confirm。" },
  { name: "propose_extend_plan_horizon", kind: "proposal_write", approval: true, note: "续写计划。同门卡。" },
  { name: "add_to_note", kind: "proposal_write", approval: true, note: "写入笔记。未点选挡住正文。" },
  { name: "organize_notes", kind: "proposal_write", approval: true, note: "整理提案。" },
  { name: "adjust_exam_target", kind: "proposal_write", approval: true, note: "改目标日。" },
];

export const EFFECT_ACL: ReadonlyArray<{
  name: string;
  kind: string;
  approval: boolean;
  host: string;
}> = [
  { name: "mark_emphasis", kind: "emphasis", approval: false, host: "Teach / Tutor / Path A" },
  { name: "mark_logic", kind: "logic", approval: false, host: "Teach / Tutor / Path A" },
  { name: "mark_underline", kind: "underline", approval: false, host: "Teach / Tutor / Path A" },
  { name: "mark_strike", kind: "strike", approval: false, host: "Teach / Tutor / Path A · 只锚 option span" },
  { name: "add_note", kind: "note", approval: false, host: "Teach / Tutor · 卷面便笺，不是 add_to_note" },
  { name: "finish_teaching", kind: "control", approval: false, host: "Teach" },
];

export const PERMISSION_RULES: ReadonlyArray<{ do: string; dont: string }> = [
  { do: "读：模型上下文由主仓 DTO/ACL 裁。原型只画已验证来源。", dont: "把角标 [n] 当成「已经进模型」。" },
  { do: "写：consult 提案五件套必须活时门。", dont: "落定后再挂一张审批；或跳过门直接写计划。" },
  { do: "卷面 5 Effect 不问门；save-note / 计划才问。", dont: "每一步 mark 都弹确认（确认疲劳）。" },
  { do: "工具 schema 禁止 user / user_id / conversation_id。", dont: "让模型自带身份。" },
  { do: "Path A 390 零 I/O。", dont: "移动端发 /runs 或挂 composer。" },
];
