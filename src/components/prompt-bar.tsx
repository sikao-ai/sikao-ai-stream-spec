import { useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { BarChart2, Calendar, Layers, Mic, Paperclip, Plus, Square, ArrowUp } from "lucide-react";
import {
  DOCK_COMMANDS,
  DOCK_SOURCES,
  sourceName,
  type SourceChip,
  type SourceKey,
} from "@/lib/dock-catalog";

export type PromptFile = { id: string; name: string; type: string; dataUrl?: string };

const ICONS = {
  bank: BarChart2,
  note: Layers,
  cal: Calendar,
  attach: Paperclip,
} as const;

function parseToken(draft: string) {
  const m = /(^|\s)([@/])([\w\u4e00-\u9fff-]*)$/.exec(draft);
  if (!m) return null;
  return { kind: m[2] === "@" ? ("at" as const) : ("slash" as const), q: m[3], start: m.index + m[1].length };
}

export function PromptBar({
  value,
  onChange,
  onSend,
  busy,
  placeholder,
  sources,
  onSourcesChange,
  files,
  onFilesChange,
}: {
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly onSend: () => void;
  readonly busy: boolean;
  readonly placeholder: string;
  readonly sources: readonly SourceChip[];
  readonly onSourcesChange: (next: SourceChip[]) => void;
  readonly files: readonly PromptFile[];
  readonly onFilesChange: (next: PromptFile[]) => void;
}) {
  const [plus, setPlus] = useState(false);
  const [active, setActive] = useState(0);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const token = useMemo(
    () => (plus ? { kind: "at" as const, q: "", start: value.length } : parseToken(value)),
    [plus, value],
  );
  const rows = useMemo(() => {
    if (!token) return [];
    const q = token.q;
    if (token.kind === "at") {
      return DOCK_SOURCES.filter((s) => s.name.includes(q) || s.key.includes(q));
    }
    return DOCK_COMMANDS.filter((c) => c.name.includes(q) || c.desc.includes(q));
  }, [token]);

  const canSend = !busy && (value.trim().length > 0 || files.length > 0);

  function pick(row: (typeof DOCK_SOURCES)[number] | (typeof DOCK_COMMANDS)[number]) {
    const t = parseToken(value);
    if ("attach" in row && row.attach) {
      fileRef.current?.click();
      if (t) onChange(value.slice(0, t.start));
    } else if (token?.kind === "at" && "key" in row && row.key !== "attach") {
      if (!sources.some((s) => s.key === row.key)) {
        onSourcesChange([...sources, { key: row.key as SourceKey, st: row.key === "cal" ? "sync" : "ready" }]);
      }
      if (t) onChange(value.slice(0, t.start));
    } else if ("name" in row) {
      onChange(`${t ? value.slice(0, t.start) : value}${row.name} `);
    }
    setPlus(false);
    fieldRef.current?.focus();
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (rows.length && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setActive((i) => (i + (e.key === "ArrowDown" ? 1 : rows.length - 1)) % rows.length);
      return;
    }
    if (rows.length && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      pick(rows[active] ?? rows[0]);
      return;
    }
    if (e.key === "Escape") {
      setPlus(false);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend || busy) onSend();
    }
  }

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []).slice(0, 3);
    const next: PromptFile[] = [];
    for (const file of list) {
      const item: PromptFile = { id: crypto.randomUUID(), name: file.name, type: file.type };
      if (file.type.startsWith("image/") && file.size < 900_000) {
        item.dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result ?? ""));
          reader.readAsDataURL(file);
        });
      }
      next.push(item);
    }
    onFilesChange([...files, ...next].slice(0, 4));
    e.target.value = "";
  }

  return (
    <div className="sk-pbar">
      {rows.length > 0 ? (
        <div className="sk-pbar-menu" role="listbox">
          {rows.map((row, i) => (
            <button
              key={row.name}
              type="button"
              className="sk-pbar-row"
              data-on={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(row)}
            >
              <b>{row.name}</b>
              <small>{row.desc}</small>
            </button>
          ))}
        </div>
      ) : null}

      {sources.length > 0 ? (
        <div className="sk-pbar-chips">
          {sources.map((s) => {
            const Icon = ICONS[s.key];
            return (
              <span key={s.key} className="sk-pbar-chip" data-st={s.st}>
                <Icon size={12} strokeWidth={2.2} />
                @{sourceName(s.key)}
                <i className="sk-pbar-st" />
                <button
                  type="button"
                  className="sk-pbar-x"
                  aria-label={`去掉 ${sourceName(s.key)}`}
                  onClick={() => onSourcesChange(sources.filter((x) => x.key !== s.key))}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      ) : null}

      {files.length > 0 ? (
        <div className="sk-pbar-chips">
          {files.map((f) => (
            <span key={f.id} className="sk-pbar-chip">
              <Paperclip size={12} strokeWidth={2.2} />
              {f.name}
              <button
                type="button"
                className="sk-pbar-x"
                aria-label={`去掉 ${f.name}`}
                onClick={() => onFilesChange(files.filter((x) => x.id !== f.id))}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="sk-pbar-grid">
        <button
          type="button"
          className="sk-pbar-icon"
          data-on={plus}
          aria-label="添加来源或文件"
          onClick={() => {
            setPlus((v) => !v);
            setActive(0);
            fieldRef.current?.focus();
          }}
        >
          <Plus size={16} strokeWidth={2} />
        </button>
        <textarea
          ref={fieldRef}
          className="sk-pbar-field"
          rows={1}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            setPlus(false);
            e.target.style.height = "0px";
            e.target.style.height = `${Math.min(Math.max(e.target.scrollHeight, 32), 88)}px`;
          }}
          onKeyDown={onKey}
        />
        <button
          type="button"
          className="sk-pbar-icon"
          aria-label="听写"
          onClick={() => onChange((value + " 对比近义空").trim())}
        >
          <Mic size={15} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="sk-pbar-send"
          data-on={canSend}
          data-stop={busy}
          disabled={!busy && !canSend}
          aria-label={busy ? "停止" : "发送"}
          onClick={onSend}
        >
          {busy ? <Square size={11} fill="currentColor" /> : <ArrowUp size={16} strokeWidth={2.4} />}
        </button>
      </div>
      <input ref={fileRef} type="file" hidden accept="image/*,.pdf,.txt,.md" multiple onChange={onFile} />
    </div>
  );
}
