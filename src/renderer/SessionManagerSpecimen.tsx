import type { ReactNode } from "react";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";
import { AiMark } from "@/components/stream/primitives";
import {
  SESSION_FIXTURES,
  SESSION_LONG_TITLE,
  SESSION_MANAGER_STATES,
  type DockPlace,
} from "@/contract/shell";

export type SessionMgrState = (typeof SESSION_MANAGER_STATES)[number]["id"];

type SessionRow = (typeof SESSION_FIXTURES)[number];

function rowsFor(state: SessionMgrState): readonly SessionRow[] {
  if (state === "empty") return [];
  if (state === "long") {
    return [{ ...SESSION_FIXTURES[0], title: SESSION_LONG_TITLE }, ...SESSION_FIXTURES.slice(1)];
  }
  return SESSION_FIXTURES;
}

export function SessionTrigger({
  title,
  open,
  onToggle,
  children,
}: {
  readonly title: string;
  readonly open: boolean;
  readonly onToggle: () => void;
  readonly children?: ReactNode;
}) {
  return (
    <div className="sk-dock-mgr-wrap">
      <button
        type="button"
        className="sk-dock-mgr"
        data-on={open}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={title}
        onClick={onToggle}
      >
        <span className="sk-dock-ttl">
          <b>{title}</b>
        </span>
        <ChevronDown size={12} strokeWidth={2.2} data-open={open} />
      </button>
      {children}
    </div>
  );
}

export function SessionPopover({
  sessions,
  activeId,
  place,
  onPick,
  onNew,
  onDel,
  onDismiss,
}: {
  readonly sessions: readonly SessionRow[];
  readonly activeId: string;
  readonly place: DockPlace;
  readonly onPick: (id: string) => void;
  readonly onNew: () => void;
  readonly onDel: (id: string) => void;
  readonly onDismiss: () => void;
}) {
  const today = sessions.filter((s) => s.group === "今天");
  const earlier = sessions.filter((s) => s.group === "更早");
  const dense = place !== "ios";
  return (
    <>
      <button type="button" className="sk-dock-pop-dim" aria-label="关闭会话列表" onClick={onDismiss} />
      <div className="sk-dock-pop" role="listbox" aria-label="会话">
        <button type="button" className="sk-dock-sess-new" onClick={onNew}>
          <Plus size={14} strokeWidth={2.2} />
          新对话
        </button>
        <div className="sk-dock-sess-list">
          {today.length ? (
            <section className="sk-dock-sess-group">
              <h3 className="sk-dock-sess-k">今天</h3>
              {today.map((s) => (
                <SessRow
                  key={s.id}
                  session={s}
                  active={s.id === activeId}
                  dense={dense}
                  onPick={() => onPick(s.id)}
                  onDel={() => onDel(s.id)}
                />
              ))}
            </section>
          ) : null}
          {earlier.length ? (
            <section className="sk-dock-sess-group">
              <h3 className="sk-dock-sess-k">更早</h3>
              {earlier.map((s) => (
                <SessRow
                  key={s.id}
                  session={s}
                  active={s.id === activeId}
                  dense={dense}
                  onPick={() => onPick(s.id)}
                  onDel={() => onDel(s.id)}
                />
              ))}
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}

function SessRow({
  session,
  active,
  dense,
  onPick,
  onDel,
}: {
  readonly session: SessionRow;
  readonly active: boolean;
  readonly dense: boolean;
  readonly onPick: () => void;
  readonly onDel: () => void;
}) {
  return (
    <div className="sk-dock-sess-item" data-on={active} data-dense={dense}>
      <button type="button" className="sk-dock-sess-main" title={session.title} onClick={onPick}>
        <span className="sk-dock-sess-copy">
          <b>{session.title}</b>
          {dense ? null : <small>{session.preview}</small>}
        </span>
        <time>{session.when}</time>
      </button>
      <button type="button" className="sk-dock-ico sk-dock-sess-del" aria-label="删除会话" onClick={onDel}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function SessionManagerSpecimen({ state }: { readonly state: SessionMgrState }) {
  const place: DockPlace = state === "ios" ? "ios" : "float";
  const open = state !== "closed";
  const sessions = rowsFor(state);
  const title = sessions[0]?.title ?? "新对话";
  return (
    <div className="spec-sess" data-place={place} data-mgr={open}>
      {place === "ios" ? <span className="sk-dock-handle" aria-hidden="true" /> : null}
      <header className="sk-dock-head">
        <span className="sk-dock-bot" aria-hidden="true">
          <AiMark size={18} detail="min" />
        </span>
        <SessionTrigger title={title} open={open} onToggle={() => undefined}>
          {open ? (
            <SessionPopover
              sessions={sessions}
              activeId={sessions[0]?.id ?? ""}
              place={place}
              onPick={() => undefined}
              onNew={() => undefined}
              onDel={() => undefined}
              onDismiss={() => undefined}
            />
          ) : null}
        </SessionTrigger>
        <button type="button" className="sk-dock-ico" aria-label="收起" disabled>
          <X size={15} />
        </button>
      </header>
      <div className="sk-dock-thread">
        <p className="spec-sess-ghost">从这一页接着问</p>
      </div>
    </div>
  );
}
