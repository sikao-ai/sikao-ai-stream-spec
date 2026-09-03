import { createServerFn } from "@tanstack/react-start";
import type { DockHostId } from "@/contract/shell";

/** @demo-only Live model demo. Not part of the contract laboratory. */
export type DockHost = DockHostId;
export type ReplyKind = "text" | "teach" | "plan" | "review" | "note";

export type AskFile = {
  readonly name: string;
  readonly type: string;
  readonly dataUrl?: string;
};

export type ChatTurn = {
  readonly role: "user" | "assistant";
  readonly content: string;
};

export type AskInput = {
  readonly host: DockHost;
  readonly text: string;
  readonly sources: readonly string[];
  readonly files: readonly AskFile[];
  readonly history: readonly ChatTurn[];
};

export type AskOk = {
  readonly ok: true;
  readonly kind: ReplyKind;
  readonly text: string;
  readonly card: { kicker: string; title: string; meta: string } | null;
};

export type AskFail = { readonly ok: false; readonly error: string };
export type AskResult = AskOk | AskFail;

const HOST_LINE: Record<DockHost, string> = {
  overview: "宿主=总览，这轮看本周订正。",
  teach: "宿主=讲题，只拆这一空，方法卡另出。",
  notes: "宿主=笔记，对上你记过。",
};

function clip(s: string, n: number) {
  return s.trim().slice(0, n);
}

function asInput(raw: unknown): AskInput {
  const d = (raw ?? {}) as AskInput;
  const host: DockHost =
    d.host === "teach" || d.host === "notes" || d.host === "overview" ? d.host : "overview";
  const files = Array.isArray(d.files)
    ? d.files.slice(0, 3).map((f) => ({
        name: clip(String(f?.name ?? "file"), 80),
        type: clip(String(f?.type ?? ""), 80),
        dataUrl:
          typeof f?.dataUrl === "string" && f.dataUrl.startsWith("data:image/") && f.dataUrl.length < 1_200_000
            ? f.dataUrl
            : undefined,
      }))
    : [];
  const history = Array.isArray(d.history)
    ? d.history.slice(-8).map((t) => ({
        role: t.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: clip(String(t.content ?? ""), 800),
      }))
    : [];
  return {
    host,
    text: clip(String(d.text ?? ""), 2000),
    sources: Array.isArray(d.sources) ? d.sources.map((s) => clip(String(s), 20)).slice(0, 4) : [],
    files,
    history,
  };
}

function parseReply(raw: string, fallbackKind: ReplyKind): AskOk {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      const parsed = JSON.parse(raw.slice(start, end + 1)) as {
        kind?: string;
        text?: string;
        card?: { kicker?: string; title?: string; meta?: string } | null;
      };
      const kind: ReplyKind =
        parsed.kind === "teach" ||
        parsed.kind === "plan" ||
        parsed.kind === "review" ||
        parsed.kind === "note" ||
        parsed.kind === "text"
          ? parsed.kind
          : fallbackKind;
      const text = clip(String(parsed.text ?? raw), 600) || "按当前页接着看。";
      const card =
        parsed.card && typeof parsed.card === "object"
          ? {
              kicker: clip(String(parsed.card.kicker ?? ""), 20),
              title: clip(String(parsed.card.title ?? ""), 80),
              meta: clip(String(parsed.card.meta ?? ""), 120),
            }
          : null;
      return { ok: true, kind, text, card: card?.title ? card : null };
    } catch {
      /* fall through */
    }
  }
  return { ok: true, kind: fallbackKind, text: clip(raw, 600) || "按当前页接着看。", card: null };
}

function guessKind(text: string): ReplyKind {
  if (text.includes("/讲题")) return "teach";
  if (text.includes("/计划")) return "plan";
  if (text.includes("/复盘")) return "review";
  if (text.includes("/近义") || text.includes("你记过")) return "note";
  return "text";
}

export const askSikao = createServerFn({ method: "POST" })
  .validator(asInput)
  .handler(async ({ data }): Promise<AskResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "这轮连不上模型。稍后再问。" };
    }

    const kindHint = guessKind(data.text);
    const fileLine = data.files.length
      ? `附件：${data.files.map((f) => f.name).join("、")}`
      : "无附件";
    const sourceLine = data.sources.length ? `钉住的来源：${data.sources.join("、")}` : "无钉住来源";

    const system = [
      "你是司考 AI，只帮公考言语/申论/行测。不闲聊，不编法条编号。",
      HOST_LINE[data.host],
      "只输出一个 JSON 对象，不要 Markdown。形状：",
      '{"kind":"text|teach|plan|review|note","text":"中文短答","card":{"kicker":"","title":"","meta":""}|null}',
      "kind 规则：/讲题→teach；/计划→plan；/复盘→review；/近义或笔记→note；其余 text。",
      "text ≤ 120 字。card 只在 teach/plan/review/note 给一句标题。",
    ].join("\n");

    const userText = [data.text || "（只发了附件）", sourceLine, fileLine].join("\n");
    const image = data.files.find((f) => f.dataUrl);

    const userContent = image?.dataUrl
      ? [
          { type: "text" as const, text: userText },
          { type: "image_url" as const, image_url: { url: image.dataUrl } },
        ]
      : userText;

    const messages = [
      { role: "system", content: system },
      ...data.history.map((t) => ({ role: t.role, content: t.content })),
      { role: "user", content: userContent },
    ];

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: 400,
        messages,
      }),
    });

    if (!res.ok) {
      return { ok: false, error: "这一轮没有写完。再试一次。" };
    }

    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = body.choices?.[0]?.message?.content ?? "";
    return parseReply(raw, kindHint);
  });
