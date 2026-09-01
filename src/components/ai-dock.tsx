import { useEffect, useRef, useState } from "react";
import { ChevronDown, Columns2, Copy, PictureInPicture2, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { askSikao, type ReplyKind } from "@/lib/ask-sikao";
import { DOCK_HOSTS, type SourceChip } from "@/lib/dock-catalog";
import { useAppStore, type DockPlace } from "@/lib/app-store";
import {
  ContextCard,
  InsightCards,
  MethodCard,
  PromptList,
  RecommendCard,
  AiMark,
  TurnStatusLine,
  UserBubble,
  YouTryGate,
} from "@/components/stream/primitives";
import { LOOKBACK_SOURCE } from "@/lib/spec-catalog";
import { PromptBar, type PromptFile } from "@/components/prompt-bar";

type Msg = {
  id: string;
  role: "user" | "ai";
  text: string;
  files?: string[];
  kind?: "wait" | ReplyKind | "err" | "stop";
};

type Chat = {
  id: string;
  title: string;
  when: string;
  updatedAt: number;
  thread: Msg[];
};

const STORE_KEY = "sikao-ai-dock-chats";

function formatWhen(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 45_000) return "现在";
  if (diff < 3_600_000) return `${Math.max(1, Math.floor(diff / 60_000))} 分钟前`;
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  const yest = new Date();
  yest.setDate(now.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return "昨天";
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function isToday(ts: number) {
  return new Date(ts).toDateString() === new Date().toDateString();
}

function previewOf(chat: Chat) {
  const user = [...chat.thread].reverse().find((m) => m.role === "user");
  const text = user?.text?.trim();
  return text && text.length ? text : "还没问";
}

function loadChats(): Chat[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Chat[];
    if (!Array.isArray(parsed) || !parsed.length) return [];
    return parsed.slice(0, 40).map((c) => ({
      ...c,
      updatedAt: typeof c.updatedAt === "number" ? c.updatedAt : Date.now(),
      thread: Array.isArray(c.thread) ? c.thread : [],
    }));
  } catch {
    return [];
  }
}

function seed(): Chat[] {
  return [{ id: "c0", title: "新对话", when: "现在", updatedAt: Date.now(), thread: [] }];
}

export function AiDock() {
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  if (!live) return null;
  return <AiDockLive />;
}

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return narrow;
}

function AiDockLive() {
  const host = useAppStore((s) => s.dockHost);
  const open = useAppStore((s) => s.dockOpen);
  const setOpen = useAppStore((s) => s.setDockOpen);
  const dockPlace = useAppStore((s) => s.dockPlace);
  const setDockPlace = useAppStore((s) => s.setDockPlace);
  const narrow = useNarrow();
  const place: DockPlace = dockPlace === "ios" || narrow ? "ios" : dockPlace;
  const meta = DOCK_HOSTS[host];
  const [histOpen, setHistOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>(() => {
    const loaded = loadChats();
    return loaded.length ? loaded : seed();
  });
  const [chatId, setChatId] = useState(() => loadChats()[0]?.id ?? "c0");
  const [draft, setDraft] = useState("");
  const [sources, setSources] = useState<SourceChip[]>(() => [...meta.sources]);
  const [files, setFiles] = useState<PromptFile[]>([]);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const genRef = useRef(0);
  const threadRef = useRef<HTMLDivElement>(null);

  const chat = chats.find((c) => c.id === chatId) ?? chats[0];
  const thread = chat?.thread ?? [];

  useEffect(() => {
    setSources([...DOCK_HOSTS[host].sources]);
  }, [host]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(chats));
    } catch {
      /* ignore */
    }
  }, [chats]);

  useEffect(() => {
    document.documentElement.dataset.dockPlace = open ? place : "";
    return () => {
      document.documentElement.dataset.dockPlace = "";
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) setHistOpen(false);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") {
        if (histOpen) {
          setHistOpen(false);
          return;
        }
        if (open) setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, histOpen, setOpen]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [thread, open]);

  function patchChat(id: string, fn: (c: Chat) => Chat) {
    setChats((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));
  }

  function newChat() {
    const id = "c" + Date.now();
    const next: Chat = { id, title: "新对话", when: "现在", updatedAt: Date.now(), thread: [] };
    setChats((prev) => [next, ...prev]);
    setChatId(id);
    setHistOpen(false);
    setDraft("");
    setFiles([]);
    setBusy(false);
    abortRef.current?.abort();
  }

  function delChat(id: string) {
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (!next.length) {
        const fresh: Chat = { id: "c" + Date.now(), title: "新对话", when: "现在", updatedAt: Date.now(), thread: [] };
        setChatId(fresh.id);
        return [fresh];
      }
      if (id === chatId) setChatId(next[0].id);
      return next;
    });
  }

  async function sendText(raw: string, attach: PromptFile[] = files) {
    if (busy) {
      abortRef.current?.abort();
      setBusy(false);
      patchChat(chatId, (c) => {
        const last = c.thread.at(-1);
        if (last?.kind === "wait") {
          return {
            ...c,
            thread: [...c.thread.slice(0, -1), { ...last, kind: "stop", text: "已出的字留着。" }],
          };
        }
        return c;
      });
      return;
    }
    const text = raw.trim();
    if (!text && attach.length === 0) return;
    const user: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      files: attach.map((f) => f.name),
    };
    const wait: Msg = {
      id: crypto.randomUUID(),
      role: "ai",
      kind: "wait",
      text: attach.length ? "正在看题面" : "正在想",
    };
    const title =
      chat.title === "新对话" && text ? text.replace(/^[/＠@]\S+\s*/, "").slice(0, 16) : chat.title;
    const history = thread
      .filter((m) => m.kind !== "wait" && m.kind !== "err")
      .slice(-8)
      .map((m) => ({
        role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
        content: m.text,
      }));
    setChats((prev) => {
      const mapped = prev.map((c) =>
        c.id === chatId
          ? { ...c, title, when: "现在", updatedAt: Date.now(), thread: [...c.thread, user, wait] }
          : c,
      );
      const cur = mapped.find((c) => c.id === chatId);
      return cur ? [cur, ...mapped.filter((c) => c.id !== chatId)] : mapped;
    });
    setDraft("");
    setFiles([]);
    setBusy(true);
    const ac = new AbortController();
    abortRef.current = ac;
    const gen = ++genRef.current;
    try {
      const result = await askSikao({
        data: {
          host,
          text,
          sources: sources.map((s) => s.key),
          files: attach.map((f) => ({ name: f.name, type: f.type, dataUrl: f.dataUrl })),
          history,
        },
        signal: ac.signal,
      });
      if (gen !== genRef.current) return;
      patchChat(chatId, (c) => {
        const rest = c.thread.filter((m) => m.id !== wait.id);
        if (!result.ok) {
          return { ...c, thread: [...rest, { id: wait.id, role: "ai", kind: "err", text: result.error }] };
        }
        return {
          ...c,
          thread: [...rest, { id: wait.id, role: "ai", kind: result.kind, text: result.text }],
        };
      });
    } catch {
      if (gen !== genRef.current) return;
      patchChat(chatId, (c) => ({
        ...c,
        thread: [
          ...c.thread.filter((m) => m.id !== wait.id),
          { id: wait.id, role: "ai", kind: "err", text: "这一轮没有写完。再试一次。" },
        ],
      }));
    } finally {
      if (gen === genRef.current) setBusy(false);
    }
  }

  const lastUser = [...thread].reverse().find((m) => m.role === "user");
  const today = chats.filter((c) => isToday(c.updatedAt));
  const earlier = chats.filter((c) => !isToday(c.updatedAt));

  return (
    <>
      <section className="sk-dock" data-place={place} data-mgr={histOpen} hidden={!open} data-testid="ai-dock">
        {place === "ios" ? <span className="sk-dock-handle" aria-hidden="true" /> : null}
        <header className="sk-dock-head">
          <span className="sk-dock-bot" aria-hidden="true">
            <AiMark size={18} detail="min" />
          </span>
          <div className="sk-dock-mgr-wrap">
            <button
              type="button"
              className="sk-dock-mgr"
              data-on={histOpen}
              aria-haspopup="listbox"
              aria-expanded={histOpen}
              aria-label="聊天管理器"
              onClick={() => setHistOpen((v) => !v)}
            >
              <span className="sk-dock-ttl">
                <b>{chat?.title ?? "新对话"}</b>
              </span>
              <ChevronDown size={12} strokeWidth={2.2} data-open={histOpen} />
            </button>
          </div>
          {place !== "ios" ? (
            <button
              type="button"
              className="sk-dock-ico"
              aria-label={place === "rail" ? "改回浮层" : "钉到右栏"}
              onClick={() => setDockPlace(place === "rail" ? "float" : "rail")}
            >
              {place === "rail" ? <PictureInPicture2 size={15} /> : <Columns2 size={15} />}
            </button>
          ) : null}
          <button type="button" className="sk-dock-ico" aria-label="收起" onClick={() => setOpen(false)}>
            <X size={15} />
          </button>
        </header>

        {histOpen ? (
          <>
            <button
              type="button"
              className="sk-dock-pop-dim"
              aria-label="关闭会话列表"
              onClick={() => setHistOpen(false)}
            />
            <div className="sk-dock-pop" role="listbox" aria-label="会话">
              <button type="button" className="sk-dock-sess-new" onClick={newChat}>
                <Plus size={14} strokeWidth={2.2} />
                新对话
              </button>
              <div className="sk-dock-sess-list">
                {today.length ? (
                  <section className="sk-dock-sess-group">
                    <h3 className="sk-dock-sess-k">今天</h3>
                    {today.map((c) => (
                      <SessRow
                        key={c.id}
                        chat={c}
                        active={c.id === chatId}
                        dense={place !== "ios"}
                        onPick={() => {
                          setChatId(c.id);
                          setHistOpen(false);
                        }}
                        onDel={() => delChat(c.id)}
                      />
                    ))}
                  </section>
                ) : null}
                {earlier.length ? (
                  <section className="sk-dock-sess-group">
                    <h3 className="sk-dock-sess-k">更早</h3>
                    {earlier.map((c) => (
                      <SessRow
                        key={c.id}
                        chat={c}
                        active={c.id === chatId}
                        dense={place !== "ios"}
                        onPick={() => {
                          setChatId(c.id);
                          setHistOpen(false);
                        }}
                        onDel={() => delChat(c.id)}
                      />
                    ))}
                  </section>
                ) : null}
              </div>
            </div>
          </>
        ) : null}

        <div className="sk-dock-thread" ref={threadRef}>
          {thread.length === 0 ? (
            <div className="sk-dock-empty">
              <b>从这一页接着问</b>
              <PromptList items={[...meta.qs]} onPick={(item) => void sendText(item)} />
            </div>
          ) : (
            thread.map((m) => (
              <DockTurn
                key={m.id}
                msg={m}
                onRetry={() => {
                  if (lastUser) void sendText(lastUser.text);
                }}
              />
            ))
          )}
        </div>
        <div className="sk-dock-composer">
          <PromptBar
            value={draft}
            onChange={setDraft}
            onSend={() => void sendText(draft)}
            busy={busy}
            placeholder={meta.place}
            sources={sources}
            onSourcesChange={setSources}
            files={files}
            onFilesChange={setFiles}
          />
        </div>
      </section>
      {open && place === "ios" ? (
        <button type="button" className="sk-dock-scrim" aria-label="关闭" onClick={() => setOpen(false)} />
      ) : null}
    </>
  );
}

function SessRow({
  chat,
  active,
  dense,
  onPick,
  onDel,
}: {
  readonly chat: Chat;
  readonly active: boolean;
  readonly dense: boolean;
  readonly onPick: () => void;
  readonly onDel: () => void;
}) {
  return (
    <div className="sk-dock-sess-item" data-on={active} data-dense={dense}>
      <button type="button" className="sk-dock-sess-main" onClick={onPick}>
        <span className="sk-dock-sess-copy">
          <b>{chat.title}</b>
          {dense ? null : <small>{previewOf(chat)}</small>}
        </span>
        <time dateTime={new Date(chat.updatedAt).toISOString()}>{formatWhen(chat.updatedAt)}</time>
      </button>
      <button type="button" className="sk-dock-ico sk-dock-sess-del" aria-label="删除会话" onClick={onDel}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function DockTurn({ msg, onRetry }: { readonly msg: Msg; readonly onRetry: () => void }) {
  if (msg.role === "user") {
    return (
      <div className="sk-dock-turn">
        <UserBubble content={msg.text || "（附件）"} />
        {msg.files?.length ? <p className="sk-dock-files">{msg.files.join(" · ")}</p> : null}
      </div>
    );
  }
  if (msg.kind === "wait") {
    return (
      <div className="sk-dock-turn">
        <TurnStatusLine state="wait" copy={msg.text} />
      </div>
    );
  }
  if (msg.kind === "err") {
    return (
      <div className="sk-dock-turn">
        <div className="sk-error-box">
          <span className="sk-error-text">{msg.text}</span>
          <button type="button" className="sk-retry" onClick={onRetry}>
            重试
          </button>
        </div>
      </div>
    );
  }
  if (msg.kind === "stop") {
    return (
      <div className="sk-dock-turn">
        <TurnStatusLine state="stop" copy="已停止生成" />
      </div>
    );
  }

  return (
    <div className="sk-dock-turn">
      <TurnStatusLine state="done" copy="已完成" />
      <p className="sk-dock-prose">{msg.text}</p>
      {msg.kind === "teach" ? (
        <>
          <MethodCard />
          <YouTryGate />
        </>
      ) : null}
      {msg.kind === "plan" ? <RecommendCard /> : null}
      {msg.kind === "review" ? <InsightCards /> : null}
      {msg.kind === "note" ? (
        <div className="sk-lookback">
          <span className="sk-lookback-kicker">你记过</span>
          <ContextCard item={LOOKBACK_SOURCE} numbered={false} defaultOpen />
        </div>
      ) : null}
      <div className="sk-dock-foot">
        <button
          type="button"
          className="sk-dock-ico"
          aria-label="复制"
          onClick={() => navigator.clipboard?.writeText(msg.text)}
        >
          <Copy size={13} />
        </button>
        <button type="button" className="sk-dock-ico" aria-label="重试" onClick={onRetry}>
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}
