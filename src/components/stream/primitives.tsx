import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ComponentType, type ReactNode, type SVGProps } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUp,
  Ban,
  BarChart2,
  Brain,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Columns2,
  Copy,
  FileText,
  GripHorizontal,
  History,
  ListPlus,
  MessageSquare,
  PenLine,
  Quote,
  RotateCcw,
  Search,
  Shield,
  Sparkles,
  Sprout,
  Square,
  SquareTerminal,
  ThumbsDown,
  ThumbsUp,
  Wrench,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import type { ProseParagraph } from "@/contract/turn";
import { FILTER_ROWS, INSIGHTS, LOOKBACK_SOURCE, REC_CHOICES as FIXTURE_REC, APPROVE_OPTIONS as FIXTURE_APPROVE } from "@/player/fixtures/content";
import type { FilterRow, InsightSpec, RecChoice, SourceCard as FixtureSource } from "@/player/fixtures/types";

export type TurnKind = "user" | "process" | "answer" | "effect" | "error";
export type KindTagKind = "action" | "suggest" | "input" | "data";
export type StatusTagTone = "ok" | "ai" | "neutral" | "risk";
export type StreamPhase =
  | "waiting"
  | "live"
  | "streaming"
  | "settled"
  | "stop"
  | "error"
  | "recover"
  | "halt";
export type DotsState = "wait" | "tool" | "stream" | "recover" | "halt" | "done" | "stop" | "error";
export type OpKind = "thought" | "search" | "read" | "write" | "code" | "tool";
export type RoundStatus = "done" | "stream" | "stop" | "halt" | "error" | "recover" | null;
export type LucideIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>;

export type Expert = {
  readonly id: string;
  readonly name: string;
  readonly op: OpKind;
  readonly text: string;
};

export type SourceCard = FixtureSource;

export function TurnStream({ children }: { readonly children: ReactNode }) {
  return (
    <div className="sk-stream" data-testid="ai-message-list" data-shell="turn">
      {children}
    </div>
  );
}

export function TurnBlock({
  kind,
  children,
}: {
  readonly kind: TurnKind;
  readonly children: ReactNode;
}) {
  return (
    <div className="sk-block" data-testid="turn-block" data-turn-kind={kind}>
      {children}
    </div>
  );
}

export function UserBubble({
  content,
  enter = false,
}: {
  readonly content: string;
  readonly enter?: boolean;
}) {
  return (
    <div className="sk-user-row" data-enter={enter ? "true" : "false"}>
      <div className="sk-user-bubble">{content}</div>
    </div>
  );
}

export function KindTag({
  kind,
  label,
}: {
  readonly kind: KindTagKind;
  readonly label?: string;
}) {
  const fallback: Record<KindTagKind, string> = {
    action: "操作",
    suggest: "建议",
    input: "输入",
    data: "数据",
  };
  return (
    <span className="sk-ktag" data-kind={kind}>
      {kind === "action" ? <Check strokeWidth={2.4} /> : null}
      {kind === "suggest" ? <Sparkles strokeWidth={2.2} /> : null}
      {kind === "input" ? <PenLine strokeWidth={2.2} /> : null}
      {kind === "data" ? <BarChart2 strokeWidth={2.2} /> : null}
      {label ?? fallback[kind]}
    </span>
  );
}

const BADGE_COPY: Record<Exclude<RoundStatus, null>, string> = {
  stream: "生成中",
  done: "已完成",
  stop: "已停止",
  halt: "正在停止",
  error: "生成未确认",
  recover: "恢复中",
};

export function StatusBadge({ kind }: { readonly kind: Exclude<RoundStatus, null> }) {
  return (
    <span className="sk-badge" data-kind={kind}>
      {BADGE_COPY[kind]}
    </span>
  );
}

function elapsedVisible(elapsed?: string): boolean {
  if (!elapsed) return false;
  const n = Number(elapsed.replace(/[^0-9]/g, ""));
  return Number.isFinite(n) && n > 0;
}

export function Dots({ state = "wait" }: { readonly state?: DotsState }) {
  return (
    <span className="sk-pixel-grid" data-state={state} aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className="sk-pixel" />
      ))}
    </span>
  );
}

export function TurnStatusLine({
  state,
  copy,
  elapsed,
  status = null,
  time,
  foldable = false,
  defaultOpen = false,
  rail,
  children,
}: {
  readonly state: DotsState;
  readonly copy: string;
  readonly elapsed?: string;
  readonly status?: RoundStatus;
  readonly time?: string;
  readonly foldable?: boolean;
  readonly defaultOpen?: boolean;
  readonly rail?: ReactNode;
  readonly children?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const showElapsed = elapsedVisible(elapsed);
  const canFold = Boolean(foldable && children);
  const showBody = Boolean(children) && (!canFold || open);
  const showRail = Boolean(rail) && !showBody;
  const right = time ?? (showElapsed ? elapsed : undefined);

  const line = (
    <>
      <span className="sk-status-lead">
        <Dots state={state} />
        {status ? <StatusBadge kind={status} /> : copy ? <span className="sk-status-phrase">{copy}</span> : null}
        {canFold ? (
          <span className="sk-status-chev" aria-hidden="true">
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        ) : null}
      </span>
      {right ? <span className="sk-status-time">{right}</span> : null}
    </>
  );

  return (
    <div className="sk-status-unit">
      {canFold ? (
        <button
          type="button"
          className="sk-status-line"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {line}
        </button>
      ) : (
        <div className="sk-status-line">{line}</div>
      )}
      {showRail ? (
        <div className="sk-status-rail" data-testid="ai-tool-rail">
          {rail}
        </div>
      ) : null}
      {showBody ? <div className="sk-status-steps">{children}</div> : null}
    </div>
  );
}

export function WaitingNode({
  label = "正在检索考点",
  elapsed,
}: {
  readonly label?: string;
  readonly elapsed?: string;
}) {
  return <TurnStatusLine state="wait" copy={label} elapsed={elapsed} />;
}

const OP_ICON: Record<OpKind, LucideIcon> = {
  thought: Brain,
  search: Search,
  read: FileText,
  write: PenLine,
  code: SquareTerminal,
  tool: Wrench,
};

export function OpRow({
  op,
  text,
  live = false,
  status = "done",
  elapsed,
}: {
  readonly op: OpKind;
  readonly text: string;
  readonly live?: boolean;
  readonly status?: "running" | "done" | "rejected";
  readonly elapsed?: string;
}) {
  const Icon = OP_ICON[op];
  const resolved = live ? "running" : status;
  return (
    <div className="sk-op-row" data-op={op} data-status={resolved}>
      <span className="sk-op-icon" aria-hidden="true">
        {resolved === "rejected" ? <X size={14} strokeWidth={2.2} /> : <Icon size={14} strokeWidth={2.2} />}
      </span>
      <span className="sk-op-text">{text}</span>
      {elapsedVisible(elapsed) ? <span className="sk-op-elapsed">{elapsed}</span> : null}
    </div>
  );
}

export function ProcessStepRow({
  kind,
  text,
  live = false,
}: {
  readonly kind: "thought" | "tool";
  readonly text: string;
  readonly live?: boolean;
}) {
  return <OpRow op={kind === "thought" ? "thought" : "search"} text={text} live={live} />;
}

export function ToolRow({
  label,
  status,
  elapsed,
}: {
  readonly label: string;
  readonly status: "running" | "done" | "rejected";
  readonly elapsed?: string;
}) {
  return <OpRow op="search" text={label} status={status} live={status === "running"} elapsed={elapsed} />;
}

export function ExpertBubble({
  expert,
  live = false,
}: {
  readonly expert: Expert;
  readonly live?: boolean;
}) {
  const Icon = OP_ICON[expert.op];
  return (
    <div
      className="sk-tool-chip"
      data-live={live ? "true" : "false"}
      title={expert.text}
      role="img"
      aria-label={`${expert.name}：${expert.text}`}
    >
      <span className="sk-tool-chip-icon" aria-hidden="true">
        <Icon size={14} strokeWidth={2.2} />
      </span>
    </div>
  );
}

export function ExpertFeed({
  experts,
  liveId,
  instant = false,
}: {
  readonly experts: readonly Expert[];
  readonly liveId?: string;
  readonly instant?: boolean;
}) {
  if (experts.length === 0) return null;
  const visible = Math.min(experts.length, 3);
  const shift = Math.max(0, experts.length - 3);
  const width = visible * 28 + Math.max(0, visible - 1) * 4;
  return (
    <div
      className="sk-chip-stack"
      data-testid="ai-expert-feed"
      data-instant={instant ? "true" : "false"}
      aria-live="polite"
      style={{ width, "--chip-index": String(shift) } as CSSProperties}
    >
      <div className="sk-chip-track">
        {experts.map((expert) => (
          <ExpertBubble key={expert.id} expert={expert} live={liveId === expert.id} />
        ))}
      </div>
    </div>
  );
}

export function LiveExpertPlayback({ experts }: { readonly experts: readonly Expert[] }) {
  return <ExpertFeed experts={experts} liveId={experts.at(-1)?.id} instant />;
}

export function AssistantProse({
  children,
  streaming = false,
}: {
  readonly children: ReactNode;
  readonly streaming?: boolean;
}) {
  return (
    <div className="sk-prose">
      {children}
      {streaming ? <span className="sk-caret" aria-hidden="true" /> : null}
    </div>
  );
}

export function AnswerFootprint({
  sourceCount = 0,
  sourcesOn = false,
  onSources,
}: {
  readonly sourceCount?: number;
  readonly sourcesOn?: boolean;
  readonly onSources?: () => void;
}) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  return (
    <div className="sk-foot">
      <div className="sk-foot-actions">
        <button
          type="button"
          className="sk-icon-btn"
          data-on={vote === "up"}
          aria-label="有帮助"
          onClick={() => setVote((v) => (v === "up" ? null : "up"))}
        >
          <ThumbsUp size={14} fill={vote === "up" ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          className="sk-icon-btn"
          data-on={vote === "down"}
          aria-label="没帮助"
          onClick={() => setVote((v) => (v === "down" ? null : "down"))}
        >
          <ThumbsDown size={14} fill={vote === "down" ? "currentColor" : "none"} />
        </button>
        <button type="button" className="sk-icon-btn" aria-label="复制">
          <Copy size={14} />
        </button>
        <button type="button" className="sk-icon-btn" aria-label="重新生成">
          <RotateCcw size={14} />
        </button>
        {onSources && sourceCount > 0 ? (
          <button
            type="button"
            className="sk-icon-btn"
            data-on={sourcesOn}
            aria-label={`来源 ${sourceCount}`}
            aria-haspopup="dialog"
            aria-expanded={sourcesOn}
            onClick={onSources}
          >
            <Quote size={14} />
            <span className="sk-foot-src">{sourceCount}</span>
          </button>
        ) : null}
        <button type="button" className="sk-icon-btn" aria-label="回放">
          <History size={14} />
        </button>
      </div>
    </div>
  );
}

export function FoldRow({
  label,
  children,
  defaultOpen = false,
}: {
  readonly label: string;
  readonly children: ReactNode;
  readonly defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button type="button" className="sk-fold" onClick={() => setOpen((v) => !v)}>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {label}
      </button>
      {open ? <div className="sk-fold-body">{children}</div> : null}
    </div>
  );
}

export function LiveStepFeed({ children }: { readonly children: ReactNode }) {
  return (
    <div className="sk-live-feed" data-testid="ai-live-step-feed">
      {children}
    </div>
  );
}

export function Cite({
  n,
  active = false,
  invalid = false,
  onOpen,
  citeRef,
}: {
  readonly n: number;
  readonly active?: boolean;
  readonly invalid?: boolean;
  readonly onOpen?: (n: number, el: HTMLButtonElement) => void;
  readonly citeRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={citeRef}
      type="button"
      className="sk-cite"
      data-on={active ? "true" : "false"}
      data-invalid={invalid ? "true" : "false"}
      aria-label={invalid ? `来源 ${n}，已失效` : `来源 ${n}`}
      aria-expanded={active}
      onClick={(e) => onOpen?.(n, e.currentTarget)}
    >
      {n}
    </button>
  );
}

function SourceFloat({
  item,
  anchor,
  onClose,
  numbered = true,
}: {
  readonly item: SourceCard;
  readonly anchor: HTMLElement;
  readonly onClose: () => void;
  readonly numbered?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 320 });
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const place = () => {
      const r = anchor.getBoundingClientRect();
      const width = Math.min(360, Math.max(260, window.innerWidth - 24));
      const margin = 12;
      let left = r.left;
      if (left + width > window.innerWidth - margin) {
        left = Math.max(margin, r.right - width);
      }
      if (left < margin) left = margin;
      setPos({ top: r.bottom + 6, left, width });
      setReady(true);
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [anchor, item.n]);

  useEffect(() => {
    let armed = false;
    const arm = window.setTimeout(() => {
      armed = true;
    }, 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onPtr = (e: PointerEvent) => {
      if (!armed) return;
      const t = e.target as Node;
      if (ref.current?.contains(t) || anchor.contains(t)) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPtr);
    return () => {
      window.clearTimeout(arm);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPtr);
    };
  }, [anchor, onClose]);

  return createPortal(
    <div
      ref={ref}
      className="sk-cite-float"
      data-ready={ready ? "true" : "false"}
      data-testid="ai-cite-float"
      role="dialog"
      aria-label={`${item.title}，来源 ${item.n}`}
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      <ContextCard
        item={item}
        variant="float"
        numbered={numbered}
        invalid={item.invalid}
        id={`float-src-${item.n}`}
      />
    </div>,
    document.body,
  );
}

export function ContextCard({
  item,
  defaultOpen = false,
  focused = false,
  id,
  numbered = true,
  invalid = false,
  variant = "list",
  compact = false,
}: {
  readonly item: SourceCard;
  readonly defaultOpen?: boolean;
  readonly focused?: boolean;
  readonly id?: string;
  readonly numbered?: boolean;
  readonly invalid?: boolean;
  readonly variant?: "list" | "float";
  readonly compact?: boolean;
}) {
  const floating = variant === "float";
  const [open, setOpen] = useState(defaultOpen || focused || floating);
  useEffect(() => {
    if (focused || floating) setOpen(true);
  }, [focused, floating]);
  return (
    <article
      className="sk-ctx"
      data-open={open ? "true" : "false"}
      data-invalid={invalid ? "true" : "false"}
      data-float={floating ? "true" : "false"}
      data-compact={compact ? "true" : "false"}
      id={id ?? `src-${item.n}`}
    >
      <button
        type="button"
        className="sk-ctx-hit"
        aria-expanded={open}
        aria-label={`${item.title}，${invalid ? "已失效" : item.kind}${floating ? "" : `，${item.body.length} 字`}`}
        onClick={() => {
          if (!floating) setOpen((v) => !v);
        }}
      >
        <span className="sk-ctx-lead" aria-hidden="true">
          {numbered ? <span className="sk-ctx-n">{item.n}</span> : <FileText size={11} strokeWidth={2.5} />}
        </span>
        <span className="sk-ctx-main">
          <span className="sk-ctx-title">{item.title}</span>
          <span className="sk-ctx-badge" data-kind={invalid ? "失效" : item.kind}>
            {invalid ? "已失效" : item.kind}
          </span>
        </span>
        {floating ? null : <span className="sk-ctx-chars">{item.body.length} 字</span>}
        {floating ? null : (
          <span className="sk-ctx-chev" aria-hidden="true">
            <ChevronDown size={14} />
          </span>
        )}
      </button>
      {compact && !open && !floating ? null : (
        <p className="sk-ctx-body">{invalid ? "这条已经没了" : open || floating ? item.body : item.snippet}</p>
      )}
    </article>
  );
}

export function PplxSources({
  items,
  defaultOpen,
  focus,
}: {
  readonly items: readonly SourceCard[];
  readonly defaultOpen?: number;
  readonly focus?: number;
}) {
  if (items.length === 0) return null;
  return (
    <div className="sk-ctx-list" data-testid="ai-pplx-sources">
      {items.map((item) => (
        <ContextCard
          key={item.n}
          item={item}
          defaultOpen={defaultOpen === item.n}
          focused={focus === item.n}
        />
      ))}
    </div>
  );
}

export function PplxResult({
  sources,
  paragraphs,
  related,
  onPick,
}: {
  readonly sources: readonly SourceCard[];
  readonly paragraphs: readonly ProseParagraph[];
  readonly related?: readonly string[];
  readonly onPick?: (item: string) => void;
}) {
  const [focus, setFocus] = useState<number | undefined>();
  return (
    <div className="sk-pplx-page" data-testid="ai-pplx-result">
      <p className="sk-surface-kicker">结果页 · Perplexity 扫描 · 不是对话气泡</p>
      <section className="sk-result-band" aria-label="本轮来源">
        <span className="sk-stem-kicker">本轮工具 / 笔记</span>
        <PplxSources items={sources} focus={focus} />
      </section>
      <section className="sk-result-band" aria-label="合成">
        <span className="sk-stem-kicker">合成</span>
        <AssistantProse>
          {paragraphs.map((p, i) => (
            <p key={i}>
              {p.segments.map((seg, j) =>
                "cite" in seg ? (
                  <Cite key={j} n={seg.cite} active={focus === seg.cite} onOpen={(n) => setFocus(n)} />
                ) : (
                  <span key={j}>{seg.text}</span>
                ),
              )}
            </p>
          ))}
        </AssistantProse>
      </section>
      {related && related.length > 0 ? (
        <div className="sk-pplx-related">
          <span className="sk-stem-kicker">相关下一问</span>
          <PromptList items={related} onPick={onPick} />
        </div>
      ) : null}
    </div>
  );
}

const PROMPT_ICONS: Record<string, LucideIcon> = {
  为什么不能选遏制: CircleHelp,
  为什么错: CircleHelp,
  对比近义: Columns2,
  做成今日计划: ListPlus,
  做成计划: ListPlus,
  抑制萌芽: Sprout,
  遏制势头: Shield,
  遏止蔓延: Ban,
  干扰项怎么设计: CircleHelp,
  这道题的干扰项是怎么设计的: CircleHelp,
  本周先订哪几道: ListPlus,
  "/计划 写入这 3 道": ListPlus,
  "/复盘 看错因": BarChart2,
  "/讲题 这一空怎么拆": CircleHelp,
  "/近义 对比选项": Columns2,
  对上本周错题: FileText,
  "/复盘 筛一筛": BarChart2,
  先看宾语再看语气: CircleHelp,
  下一空自己选: Sprout,
  标关键句: FileText,
  对照要点: Columns2,
  整理成段: ListPlus,
  讲这题: CircleHelp,
  标关键条件: FileText,
  找同类错题: BarChart2,
};

export function PromptList({
  items,
  onPick,
}: {
  readonly items: readonly string[];
  readonly onPick?: (item: string) => void;
}) {
  return (
    <div className="sk-plist" role="group" aria-label="提问提示">
      {items.map((item) => {
        const Icon = PROMPT_ICONS[item] ?? MessageSquare;
        return (
          <button key={item} type="button" className="sk-plist-item" onClick={() => onPick?.(item)}>
            <span className="sk-plist-icon" aria-hidden="true">
              <Icon size={14} strokeWidth={2.2} />
            </span>
            <span className="sk-plist-text">{item}</span>
          </button>
        );
      })}
    </div>
  );
}

export function FollowupFold({
  items,
  folded = true,
}: {
  readonly items: readonly string[];
  readonly folded?: boolean;
}) {
  const [open, setOpen] = useState(!folded);
  return (
    <div className="sk-follow" data-folded={open ? "false" : "true"}>
      <button
        type="button"
        className="sk-gate-head sk-widget-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sk-turn-ico" aria-hidden="true">
          <ListPlus size={14} strokeWidth={2.2} />
        </span>
        <span className="sk-turn-copy">
          <span className="sk-gate-title">下一问</span>
          <span className="sk-follow-n">{items.length}</span>
        </span>
        <span className="sk-widget-chev" aria-hidden="true">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>
      <div className="sk-widget-fold" data-open={open ? "true" : "false"}>
        <div className="sk-widget-fold-inner">
          <PromptList items={items} />
        </div>
      </div>
    </div>
  );
}

export function StatusTag({
  tone,
  children,
}: {
  readonly tone: StatusTagTone;
  readonly children: ReactNode;
}) {
  return (
    <span className="sk-stag" data-tone={tone}>
      {children}
    </span>
  );
}

export function ActionChip({
  label,
  onClick,
}: {
  readonly label: string;
  readonly onClick?: () => void;
}) {
  return (
    <button type="button" className="sk-achip" onClick={onClick}>
      <FileText size={13} strokeWidth={2.2} />
      {label}
    </button>
  );
}

export function EntityChip({
  title,
  item = LOOKBACK_SOURCE,
}: {
  readonly title: string;
  readonly item?: SourceCard;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const card: SourceCard = { ...item, title };
  return (
    <>
      <button
        type="button"
        className="sk-entity"
        data-testid="ai-entity-chip"
        aria-expanded={Boolean(anchor)}
        aria-haspopup="dialog"
        onClick={(e) => {
          const el = e.currentTarget;
          setAnchor((cur) => (cur ? null : el));
        }}
      >
        <span className="sk-entity-icon" aria-hidden="true">
          <FileText />
        </span>
        {title}
      </button>
      {anchor ? (
        <SourceFloat item={card} anchor={anchor} numbered={false} onClose={() => setAnchor(null)} />
      ) : null}
    </>
  );
}

export function AiMark({
  size = 18,
  detail = "min",
}: {
  readonly size?: number;
  readonly detail?: "min" | "full";
}) {
  const showSpark = detail === "full" || size >= 20;
  const pencilStroke = 2 * 1.15;
  return (
    <svg className="sk-aimark" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g transform="translate(-1.45 0.37)">
        <g data-aimark-part="pencil">
          <g className="sk-aimark-pencil" transform="translate(2.97 0.39) scale(0.86)">
            <path
              strokeWidth={pencilStroke}
              d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
            />
            <path strokeWidth={pencilStroke} d="m15 5 4 4" />
          </g>
        </g>
        <path
          className="sk-aimark-wave"
          data-aimark-part="wave"
          strokeWidth={2}
          pathLength={1}
          d="M7.2 20.8c2.1-1.2 4.2 1.2 6.4 0s4.2-1.2 6.4 0"
        />
        {showSpark ? (
          <g className="sk-aimark-spark" data-aimark-part="spark" strokeWidth={2}>
            <path d="M20.2 14v4" />
            <path d="M18.2 16h4" />
          </g>
        ) : null}
      </g>
    </svg>
  );
}

export function SceneAiChip({
  size = 32,
  expanded = false,
  label = "打开 AI",
  interactive = true,
  onClick,
}: {
  readonly size?: 32 | 36 | 44;
  readonly expanded?: boolean;
  readonly label?: string;
  readonly interactive?: boolean;
  readonly onClick?: () => void;
}) {
  const mark = size >= 36 ? 20 : 18;
  const inner = <AiMark size={mark} detail={size >= 36 ? "full" : "min"} />;
  if (!interactive && !onClick) {
    return (
      <span className="sk-entry" data-size={size} data-expanded={expanded} aria-hidden="true">
        {inner}
      </span>
    );
  }
  return (
    <button
      type="button"
      className="sk-entry"
      data-size={size}
      data-expanded={expanded}
      aria-label={label}
      aria-expanded={expanded}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}

export type ApproveSpecimen =
  | "idle"
  | "picked"
  | "submit"
  | "ok"
  | "skip"
  | "fail"
  | "invalid"
  | "reopen";

export type RecSpecimen = "fold" | "open" | "accepting" | "written" | "skipped" | "fail";

export function ProposalCard({
  title,
  reason,
  blocking = false,
  onResolved,
  specimen,
  options = FIXTURE_APPROVE,
}: {
  readonly title: string;
  readonly reason: string;
  readonly blocking?: boolean;
  readonly onResolved?: (kind: "ok" | "skip") => void;
  readonly specimen?: ApproveSpecimen;
  readonly options?: readonly string[];
}) {
  const questions = [
    {
      q: title,
      hint: reason,
      type: "radio" as const,
      options: [...options],
    },
  ];
  const skipAt = 2;
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [custom, setCustom] = useState("");
  const [sent, setSent] = useState<"ok" | "skip" | null>(null);
  const [open, setOpen] = useState(true);
  const advanceRef = useRef<number | null>(null);
  const question = questions[qi];
  const last = qi === questions.length - 1;
  const selected = answers[qi] ?? [];
  const hasAnswer = selected.length > 0 || custom.trim().length > 0;

  useEffect(() => {
    return () => {
      if (advanceRef.current != null) window.clearTimeout(advanceRef.current);
    };
  }, []);

  if (specimen) {
    return <ProposalSpecimen title={title} reason={reason} blocking={blocking} specimen={specimen} />;
  }

  const finish = (kind: "ok" | "skip") => {
    setSent(kind);
    onResolved?.(kind);
  };

  const toggle = (index: number) => {
    setAnswers((current) => {
      const picked = current[qi] ?? [];
      const next =
        question.type === "radio"
          ? [index]
          : picked.includes(index)
            ? picked.filter((item) => item !== index)
            : [...picked, index];
      return { ...current, [qi]: next };
    });
    if (question.type !== "radio") return;
    setCustom("");
    if (advanceRef.current != null) window.clearTimeout(advanceRef.current);
    advanceRef.current = window.setTimeout(() => {
      if (qi === 0 && index === skipAt) finish("skip");
      else if (last) finish("ok");
      else setQi((c) => Math.min(questions.length - 1, c + 1));
    }, 480);
  };

  const reset = () => {
    if (advanceRef.current != null) window.clearTimeout(advanceRef.current);
    setQi(0);
    setAnswers({});
    setCustom("");
    setSent(null);
    setOpen(true);
  };

  if (!open) {
    return (
      <button type="button" className="sk-approve-reopen" onClick={() => setOpen(true)}>
        再问一次
      </button>
    );
  }

  return (
    <div className="sk-approve" data-testid="ai-approval-card" data-blocking={blocking ? "true" : "false"}>
      {blocking && sent == null ? (
        <p className="sk-approve-live">先选一下，选完才往下写</p>
      ) : null}
      {sent ? (
        <div className="sk-approve-done">
          <span className="sk-approve-ok" aria-hidden="true">
            <Check size={12} strokeWidth={3} />
          </span>
          <span>{sent === "ok" ? "已写入计划" : "已忽略"}</span>
          <button type="button" className="sk-approve-again" onClick={reset}>
            再填一次
          </button>
        </div>
      ) : (
        <div className="sk-approve-pad" key={qi}>
          <div className="sk-approve-top">
            <div className="sk-approve-copy">
              <div className="sk-approve-head">
                <KindTag kind="action" label="确认" />
                <span className="sk-approve-q">{question.q}</span>
              </div>
              {question.hint ? <span className="sk-approve-hint">{question.hint}</span> : null}
            </div>
            <button
              type="button"
              className="sk-approve-x"
              aria-label="收起"
              onClick={() => setOpen(false)}
            >
              <X size={14} strokeWidth={2.2} />
            </button>
          </div>
          <div className="sk-approve-opts">
            {question.options.map((option, i) => {
              const on = selected.includes(i);
              return (
                <button
                  key={option}
                  type="button"
                  className="sk-approve-opt"
                  aria-pressed={on}
                  onClick={() => toggle(i)}
                >
                  <span className="sk-approve-mark" data-type={question.type} data-on={on}>
                    {question.type === "radio" ? <span className="sk-approve-dot" /> : <Check size={10} strokeWidth={3} />}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
            <label className="sk-approve-opt sk-approve-custom">
              <span className="sk-approve-mark-spacer" aria-hidden="true" />
              <input
                value={custom}
                placeholder="补充一句…"
                aria-label="自定义答复"
                onChange={(e) => {
                  setCustom(e.target.value);
                  if (question.type === "radio") {
                    setAnswers((current) => ({ ...current, [qi]: [] }));
                  }
                }}
              />
            </label>
          </div>
        </div>
      )}
      <div className="sk-approve-foot">
        {questions.length > 1 ? (
          <span className="sk-approve-pager">
            <button
              type="button"
              className="sk-approve-nav"
              aria-label="上一问"
              disabled={qi === 0 || sent != null}
              onClick={() => setQi((c) => Math.max(0, c - 1))}
            >
              <ChevronLeft size={14} strokeWidth={2.2} />
            </button>
            <span className="sk-approve-dots">
              {questions.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`第 ${i + 1} 问`}
                  aria-current={i === qi && sent == null ? "step" : undefined}
                  disabled={sent != null}
                  className="sk-approve-step"
                  data-state={sent != null || i < qi ? "done" : i === qi ? "now" : "todo"}
                  onClick={() => setQi(i)}
                />
              ))}
            </span>
            <button
              type="button"
              className="sk-approve-nav"
              aria-label="下一问"
              disabled={last || sent != null}
              onClick={() => setQi((c) => Math.min(questions.length - 1, c + 1))}
            >
              <ChevronRight size={14} strokeWidth={2.2} />
            </button>
          </span>
        ) : (
          <span className="sk-approve-wait">{blocking ? "点一项即继续" : "选一项"}</span>
        )}
        {sent == null ? (
          <button
            type="button"
            className="sk-approve-send"
            aria-label={last ? "提交" : "下一问"}
            disabled={!hasAnswer}
            onClick={() => {
              if (qi === 0 && selected.includes(skipAt)) finish("skip");
              else if (last) finish("ok");
              else setQi((c) => c + 1);
            }}
          >
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ProposalSpecimen({
  title,
  reason,
  blocking,
  specimen,
}: {
  readonly title: string;
  readonly reason: string;
  readonly blocking: boolean;
  readonly specimen: ApproveSpecimen;
}) {
  if (specimen === "reopen") {
    return (
      <button type="button" className="sk-approve-reopen">
        再问一次
      </button>
    );
  }
  if (specimen === "ok" || specimen === "skip") {
    return (
      <div className="sk-approve" data-testid="ai-approval-card" data-specimen={specimen} data-blocking="false">
        <div className="sk-approve-done">
          <span className="sk-approve-ok" aria-hidden="true">
            <Check size={12} strokeWidth={3} />
          </span>
          <span>{specimen === "ok" ? "已写入计划" : "已忽略"}</span>
          <button type="button" className="sk-approve-again">
            再填一次
          </button>
        </div>
      </div>
    );
  }
  const picked = specimen === "picked" || specimen === "submit" || specimen === "fail";
  const submitting = specimen === "submit";
  const invalid = specimen === "invalid";
  const fail = specimen === "fail";
  return (
    <div
      className="sk-approve"
      data-testid="ai-approval-card"
      data-specimen={specimen}
      data-blocking={blocking ? "true" : "false"}
    >
      {blocking ? <p className="sk-approve-live">先选一下，选完才往下写</p> : null}
      <div className="sk-approve-pad">
        <div className="sk-approve-top">
          <div className="sk-approve-copy">
            <div className="sk-approve-head">
              <KindTag kind="action" label="确认" />
              <span className="sk-approve-q">{title}</span>
            </div>
            <span className="sk-approve-hint">{reason}</span>
          </div>
        </div>
        <div className="sk-approve-opts">
          {FIXTURE_APPROVE.map((option, i) => (
            <button
              key={option}
              type="button"
              className="sk-approve-opt"
              aria-pressed={picked && i === 0}
              disabled={submitting || fail}
            >
              <span className="sk-approve-mark" data-type="radio" data-on={picked && i === 0}>
                <span className="sk-approve-dot" />
              </span>
              <span>{option}</span>
            </button>
          ))}
          <label className="sk-approve-opt sk-approve-custom">
            <span className="sk-approve-mark-spacer" aria-hidden="true" />
            <input
              value={invalid ? "" : ""}
              placeholder="补充一句…"
              aria-label="自定义答复"
              aria-invalid={invalid}
              readOnly
            />
          </label>
        </div>
        {invalid ? <p className="sk-approve-invalid">写一句再提交</p> : null}
        {fail ? <ErrorBand title="没写上" action="重试" /> : null}
      </div>
      <div className="sk-approve-foot">
        <span className="sk-approve-wait">{submitting ? "提交中" : blocking ? "点一项即继续" : "选一项"}</span>
        <button
          type="button"
          className="sk-approve-send"
          aria-label="提交"
          disabled={!picked || submitting || invalid || fail}
        >
          <ArrowUp size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export function MethodCard({
  title,
  reason,
  folded = true,
}: {
  readonly title: string;
  readonly reason: string;
  readonly folded?: boolean;
}) {
  const [open, setOpen] = useState(!folded);
  return (
    <div className="sk-method" data-folded={open ? "false" : "true"}>
      <button
        type="button"
        className="sk-gate-head sk-widget-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sk-turn-ico" aria-hidden="true">
          <Sparkles size={14} strokeWidth={2.2} />
        </span>
        <span className="sk-turn-copy">
          <KindTag kind="suggest" label="方法" />
          <span className="sk-gate-title">{title}</span>
        </span>
        <span className="sk-widget-chev" aria-hidden="true">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>
      <div className="sk-widget-fold" data-open={open ? "true" : "false"}>
        <div className="sk-widget-fold-inner">
          <p className="sk-gate-reason">{reason}</p>
        </div>
      </div>
    </div>
  );
}

export function YouTryGate({
  title,
  items,
  folded = true,
}: {
  readonly title: string;
  readonly items: readonly string[];
  readonly folded?: boolean;
}) {
  const [open, setOpen] = useState(!folded);
  return (
    <div className="sk-youtry" data-folded={open ? "false" : "true"}>
      <button
        type="button"
        className="sk-gate-head sk-widget-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sk-turn-ico" aria-hidden="true">
          <PenLine size={14} strokeWidth={2.2} />
        </span>
        <span className="sk-turn-copy">
          <KindTag kind="input" label="到你了" />
          <span className="sk-gate-title">{title}</span>
        </span>
        <span className="sk-widget-chev" aria-hidden="true">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>
      <div className="sk-widget-fold" data-open={open ? "true" : "false"}>
        <div className="sk-widget-fold-inner">
          <PromptList items={items} />
        </div>
      </div>
    </div>
  );
}

type RecId = string;

function RecMeter({
  level,
  size = "md",
}: {
  readonly level: number;
  readonly size?: "sm" | "md";
}) {
  const clamped = Math.min(5, Math.max(1, Math.round(level)));
  return (
    <span className="sk-rec-meter" data-level={clamped} data-size={size} role="img" aria-label={`推荐度 ${clamped}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  );
}

export function RecommendCard({
  specimen,
  question = "要我把这组近义写进今日计划吗？",
  choices = FIXTURE_REC,
}: {
  readonly specimen?: RecSpecimen;
  readonly question?: string;
  readonly choices?: readonly RecChoice[];
} = {}) {
  const [picked, setPicked] = useState<RecId>(choices[0]?.id ?? "plan");
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const current = choices.find((c) => c.id === picked) ?? choices[0];
  const skipped = current.id === "skip";
  const alts = choices.filter((c) => c.id !== choices[0]?.id);

  if (specimen) {
    return <RecommendSpecimen specimen={specimen} question={question} choices={choices} />;
  }

  if (done) {
    return (
      <div className="sk-rec" data-testid="ai-recommend-card">
        <div className="sk-rec-done">
          <span className="sk-approve-ok" aria-hidden="true">
            <Check size={12} strokeWidth={3} />
          </span>
          <span>{skipped ? "已忽略" : current.id === "table" ? "已记近义表" : "已写入计划"}</span>
          <button
            type="button"
            className="sk-approve-again"
            onClick={() => {
              setDone(false);
              setPicked("plan");
              setOpen(false);
            }}
          >
            再看一次
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sk-rec" data-testid="ai-recommend-card">
      <div className="sk-rec-top">
        <KindTag kind="suggest" label="建议" />
        <span className="sk-rec-q">{question}</span>
      </div>
      <div className="sk-rec-primary">
        <span className="sk-rec-primary-copy">
          <span className="sk-rec-primary-title">{current.title}</span>
          <span className="sk-rec-primary-detail">{current.detail}</span>
        </span>
        <span className="sk-rec-score">
          <span className="sk-rec-score-label">推荐度</span>
          <RecMeter level={current.score} />
          <span className="sk-rec-score-n">{current.score}</span>
        </span>
      </div>
      <div className="sk-rec-alts">
        <button
          type="button"
          className="sk-rec-fold"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span>其他方案</span>
          <span className="sk-rec-fold-n">{alts.length}</span>
          <span className="sk-rec-fold-chev" aria-hidden="true">
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        </button>
        <div
          className="sk-rec-chips"
          data-hide={open ? "true" : "false"}
          hidden={open}
          role="group"
          aria-label="其他方案"
        >
            {alts.map((item) => (
              <button
                key={item.id}
                type="button"
                className="sk-rec-chip"
                aria-pressed={picked === item.id}
                onClick={() => setPicked(item.id)}
              >
                <RecMeter level={item.score} size="sm" />
                {item.title}
              </button>
            ))}
          </div>
        <div className="sk-rec-grid-wrap" data-open={open ? "true" : "false"} hidden={!open} inert={!open}>
          <div className="sk-rec-grid" role="group" aria-label="方案推荐度">
            {choices.map((item) => (
              <button
                key={item.id}
                type="button"
                className="sk-rec-cell"
                aria-pressed={picked === item.id}
                onClick={() => setPicked(item.id)}
              >
                <span className="sk-rec-cell-title">{item.title}</span>
                <span className="sk-rec-cell-detail">{item.detail}</span>
                <span className="sk-rec-score">
                  <RecMeter level={item.score} />
                  <span className="sk-rec-score-n">{item.score}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="sk-rec-foot">
        <div className="sk-rec-actions">
          <button
            type="button"
            className="sk-rec-ghost"
            onClick={() => {
              setPicked("skip");
              setDone(true);
            }}
          >
            先不写
          </button>
          <button type="button" className="sk-fill-btn" onClick={() => setDone(true)}>
            {skipped ? "跳过" : "接受"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecommendSpecimen({
  specimen,
  question = "要我把这组近义写进今日计划吗？",
  choices = FIXTURE_REC,
}: {
  readonly specimen: RecSpecimen;
  readonly question?: string;
  readonly choices?: readonly RecChoice[];
}) {
  if (specimen === "written" || specimen === "skipped") {
    return (
      <div className="sk-rec" data-testid="ai-recommend-card" data-specimen={specimen}>
        <div className="sk-rec-done">
          <span className="sk-approve-ok" aria-hidden="true">
            <Check size={12} strokeWidth={3} />
          </span>
          <span>{specimen === "skipped" ? "已忽略" : "已写入计划"}</span>
          <button type="button" className="sk-approve-again">
            再看一次
          </button>
        </div>
      </div>
    );
  }
  const open = specimen === "open";
  const accepting = specimen === "accepting";
  const fail = specimen === "fail";
  const current = choices[0];
  const alts = choices.filter((c) => c.id !== choices[0]?.id);
  return (
    <div className="sk-rec" data-testid="ai-recommend-card" data-specimen={specimen}>
      <div className="sk-rec-top">
        <KindTag kind="suggest" label="建议" />
        <span className="sk-rec-q">{question}</span>
      </div>
      <div className="sk-rec-primary">
        <span className="sk-rec-primary-copy">
          <span className="sk-rec-primary-title">{current.title}</span>
          <span className="sk-rec-primary-detail">{current.detail}</span>
        </span>
        <span className="sk-rec-score">
          <span className="sk-rec-score-label">推荐度</span>
          <RecMeter level={current.score} />
          <span className="sk-rec-score-n">{current.score}</span>
        </span>
      </div>
      <div className="sk-rec-alts">
        <button type="button" className="sk-rec-fold" aria-expanded={open} disabled={accepting}>
          <span>其他方案</span>
          <span className="sk-rec-fold-n">{alts.length}</span>
          <span className="sk-rec-fold-chev" aria-hidden="true">
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        </button>
        <div className="sk-rec-chips" data-hide={open ? "true" : "false"} hidden={open} role="group" aria-label="其他方案">
          {alts.map((item) => (
            <button key={item.id} type="button" className="sk-rec-chip" disabled={accepting}>
              <RecMeter level={item.score} size="sm" />
              {item.title}
            </button>
          ))}
        </div>
        <div className="sk-rec-grid-wrap" data-open={open ? "true" : "false"} hidden={!open} inert={!open}>
          <div className="sk-rec-grid" role="group" aria-label="方案推荐度">
            {choices.map((item) => (
              <button
                key={item.id}
                type="button"
                className="sk-rec-cell"
                aria-pressed={item.id === "plan"}
                disabled={accepting}
              >
                <span className="sk-rec-cell-title">{item.title}</span>
                <span className="sk-rec-cell-detail">{item.detail}</span>
                <span className="sk-rec-score">
                  <RecMeter level={item.score} />
                  <span className="sk-rec-score-n">{item.score}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {fail ? <ErrorBand title="没写上" action="重试" /> : null}
      <div className="sk-rec-foot">
        <div className="sk-rec-actions">
          <button type="button" className="sk-rec-ghost" disabled={accepting || fail}>
            先不写
          </button>
          <button type="button" className="sk-fill-btn" disabled={accepting || fail}>
            {accepting ? "写入中" : "接受"}
          </button>
        </div>
      </div>
    </div>
  );
}

type FilterKey = "all" | "搭配" | "订正中" | "未做";

function filterTone(status: string): StatusTagTone {
  if (status === "已订正") return "ok";
  if (status === "订正中") return "ai";
  return "neutral";
}

export function FilterTable({
  empty = false,
  rows: allRows = FILTER_ROWS,
}: {
  readonly empty?: boolean;
  readonly rows?: readonly FilterRow[];
} = {}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const counts = {
    all: allRows.length,
    搭配: allRows.filter((r) => r.cause === "搭配").length,
    订正中: allRows.filter((r) => r.status === "订正中").length,
    未做: allRows.filter((r) => r.status === "未做").length,
  };
  const rows = allRows.filter((r) => {
    if (filter === "all") return true;
    if (filter === "搭配") return r.cause === "搭配";
    return r.status === filter;
  });
  const chips: ReadonlyArray<{ id: FilterKey; label: string; n: number }> = [
    { id: "all", label: "全部", n: counts.all },
    { id: "搭配", label: "搭配", n: counts.搭配 },
    { id: "订正中", label: "订正中", n: counts.订正中 },
    { id: "未做", label: "未做", n: counts.未做 },
  ];

  return (
    <div className="sk-ftable" data-testid="ai-filter-table">
      <div className="sk-ftable-head">
        <KindTag kind="data" label="错题" />
        <span className="sk-ftable-title">近义错题表</span>
      </div>
      <div className="sk-ftable-chips" role="tablist" aria-label="筛选">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={filter === c.id}
            className="sk-ftable-chip"
            onClick={() => setFilter(c.id)}
          >
            {c.label}
            <span>{empty && c.id !== "all" ? 0 : c.n}</span>
          </button>
        ))}
      </div>
      {empty ? (
        <p className="sk-ftable-empty">没有这类错题</p>
      ) : (
        <div className="sk-ftable-scroll" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th>题干</th>
                <th>考点</th>
                <th>状态</th>
                <th>错因</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td>{r.topic}</td>
                  <td>
                    <StatusTag tone={filterTone(r.status)}>{r.status}</StatusTag>
                  </td>
                  <td>{r.cause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InsightCurve({ series }: { readonly series: readonly number[] }) {
  const w = 280;
  const h = 64;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = Math.max(1, max - min);
  const pts = series.map((v, i) => {
    const x = (i / Math.max(1, series.length - 1)) * w;
    const y = h - 6 - ((v - min) / span) * (h - 12);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = pts.join(" ");
  return (
    <svg className="sk-insight-curve" viewBox={`0 0 ${w} ${h}`} role="img" aria-hidden="true">
      <polyline className="sk-insight-curve-fill" points={`0,${h} ${line} ${w},${h}`} />
      <polyline className="sk-insight-curve-line" points={line} fill="none" />
    </svg>
  );
}

function InsightViz({ card }: { readonly card: InsightSpec }) {
  if (card.viz === "curve" && "series" in card && card.series) {
    return <InsightCurve series={card.series} />;
  }
  if (card.viz === "progress" && "progress" in card) {
    const pct = Math.round((card.progress ?? 0) * 100);
    return (
      <div
        className="sk-insight-progress"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${pct}%` }} />
      </div>
    );
  }
  const peak = Math.max(1, ...card.rows.map((row) => row.value));
  return (
    <ul className="sk-insight-rows" data-viz={card.viz}>
      {card.rows.map((row) => (
        <li key={row.name}>
          <span className="sk-insight-name">{row.name}</span>
          <span className="sk-insight-val">{row.label}</span>
          <span
            className="sk-insight-bar"
            aria-hidden="true"
            style={{ width: `${Math.max(8, (row.value / peak) * 100)}%` }}
          />
        </li>
      ))}
    </ul>
  );
}

export function InsightCards({
  empty = false,
  items = INSIGHTS,
}: {
  readonly empty?: boolean;
  readonly items?: readonly InsightSpec[];
} = {}) {
  const [i, setI] = useState(0);
  if (empty) {
    return (
      <div className="sk-insight" data-testid="ai-insight-cards" data-empty="true">
        <div className="sk-insight-top">
          <KindTag kind="data" label="发现" />
        </div>
        <p className="sk-insight-empty">这一轮没有新的错因</p>
      </div>
    );
  }
  const card = items[i];
  return (
    <div className="sk-insight" data-testid="ai-insight-cards" data-tone={card.tone} data-viz={card.viz}>
      <div className="sk-insight-top">
        <KindTag kind={card.tone === "ai" ? "data" : card.tone === "risk" ? "action" : "suggest"} label="发现" />
        <span className="sk-insight-pager" hidden={items.length <= 1}>
          <button
            type="button"
            className="sk-approve-nav"
            aria-label="上一则"
            disabled={i === 0}
            onClick={() => setI((n) => Math.max(0, n - 1))}
          >
            <ChevronLeft size={14} strokeWidth={2.2} />
          </button>
          <span>
            {i + 1} / {items.length}
          </span>
          <button
            type="button"
            className="sk-approve-nav"
            aria-label="下一则"
            disabled={i === items.length - 1}
            onClick={() => setI((n) => Math.min(items.length - 1, n + 1))}
          >
            <ChevronRight size={14} strokeWidth={2.2} />
          </button>
        </span>
      </div>
      <div className="sk-insight-body" key={card.title}>
        <p className="sk-insight-title">{card.title}</p>
        <p className="sk-insight-hero">
          <strong>{card.hero.n}</strong>
          <span>{card.hero.unit}</span>
        </p>
        <InsightViz card={card} />
        <button type="button" className="sk-insight-cta">
          {card.ask}
        </button>
      </div>
    </div>
  );
}

export type StemAid = {
  readonly caption: string;
  readonly columns: readonly string[];
  readonly rows: readonly (readonly string[])[];
};

export function StemMark({
  text,
  aid,
}: {
  readonly text: string;
  readonly aid?: StemAid;
}) {
  return (
    <div className="sk-stem">
      <span className="sk-stem-kicker">题面</span>
      <span className="sk-stem-text">{text}</span>
      {aid ? (
        <div className="sk-stem-aid" data-turn-aid="table">
          <span className="sk-stem-kicker">{aid.caption}</span>
          <table className="sk-stem-table">
            <thead>
              <tr>
                {aid.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aid.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export function ErrorBand({
  title = "这一轮没有写完",
  action = "重试",
}: {
  readonly title?: string;
  readonly action?: string;
}) {
  return (
    <div className="sk-error-box">
      <span className="sk-error-text">{title}</span>
      <button type="button" className="sk-retry">
        {action}
      </button>
    </div>
  );
}

export function FillBtn({ children }: { readonly children: ReactNode }) {
  return (
    <button type="button" className="sk-fill-btn">
      {children}
    </button>
  );
}

export function AnswerBody({
  phase,
  paragraphs = [],
  extra,
  sources = [],
  sourcesOpen = false,
  widgets,
  streaming = false,
  defaultCite,
}: {
  readonly phase: StreamPhase;
  readonly paragraphs?: readonly ProseParagraph[];
  readonly extra?: ReactNode;
  readonly sources?: readonly SourceCard[];
  readonly sourcesOpen?: boolean;
  readonly widgets?: ReactNode;
  readonly streaming?: boolean;
  readonly defaultCite?: number;
}) {
  const [citeFocus, setCiteFocus] = useState<number | undefined>(defaultCite);
  const [citeAnchor, setCiteAnchor] = useState<HTMLElement | null>(null);
  const [listOpen, setListOpen] = useState(sourcesOpen);
  const citeEls = useRef(new Map<number, HTMLButtonElement>());


  useEffect(() => {
    if (sourcesOpen) setListOpen(true);
  }, [sourcesOpen]);

  const closeFloat = useCallback(() => {
    setCiteFocus(undefined);
    setCiteAnchor(null);
  }, []);

  useEffect(() => {
    if (defaultCite == null || listOpen || phase !== "settled") return;
    const t = window.setTimeout(() => {
      const el = citeEls.current.get(defaultCite);
      if (!el) return;
      setCiteFocus(defaultCite);
      setCiteAnchor(el);
    }, 0);
    return () => window.clearTimeout(t);
  }, [defaultCite, listOpen, phase, sources]);

  useEffect(() => {
    if (citeFocus == null) return;
    const ns = sources.map((s) => s.n);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const i = ns.indexOf(citeFocus);
      if (i < 0) return;
      const next = ns[(i + (e.key === "ArrowRight" ? 1 : ns.length - 1)) % ns.length];
      const el = citeEls.current.get(next);
      if (!el) return;
      setCiteFocus(next);
      setCiteAnchor(el);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [citeFocus, sources]);

  if (phase === "waiting" || phase === "live") {
    return null;
  }

  if (phase === "error" && paragraphs.length === 0) {
    return null;
  }

  const showCited = phase === "settled";
  const showProse = paragraphs.length > 0;
  const showFoot = phase === "settled" || phase === "stop";
  const openCite = (n: number, el: HTMLButtonElement) => {
    if (citeFocus === n) {
      closeFloat();
      return;
    }
    setCiteFocus(n);
    setCiteAnchor(el);
  };
  const floatItem = citeFocus != null ? sources.find((s) => s.n === citeFocus) : undefined;

  if (!showProse && !showFoot) return null;

  return (
    <TurnBlock kind="answer">
      <div className="sk-answer-shell sk-answer-stack">
        {showProse ? (
          <div data-turn-slot="prose">
            <AssistantProse streaming={streaming || phase === "streaming"}>
              {paragraphs.map((p, i) => (
                <p key={i}>
                  {p.segments.map((seg, j) =>
                    "cite" in seg ? (
                      showCited ? (
                        <Cite
                          key={j}
                          n={seg.cite}
                          active={citeFocus === seg.cite}
                          invalid={sources.some((s) => s.n === seg.cite && s.invalid)}
                          onOpen={openCite}
                          citeRef={(el) => {
                            if (el) citeEls.current.set(seg.cite, el);
                            else citeEls.current.delete(seg.cite);
                          }}
                        />
                      ) : null
                    ) : (
                      <span key={j}>{seg.text}</span>
                    ),
                  )}
                </p>
              ))}
            </AssistantProse>
          </div>
        ) : null}
        {phase === "settled" && extra}
        {phase === "settled" && widgets ? (
          <div className="sk-turn-widgets" data-turn-slot="widgets">
            {widgets}
          </div>
        ) : null}
        {showFoot && showProse ? (
          <div data-turn-slot="footprint">
            <AnswerFootprint
              sourceCount={sources.length}
              sourcesOn={listOpen}
              onSources={
                sources.length > 0
                  ? () => {
                      closeFloat();
                      setListOpen((v) => !v);
                    }
                  : undefined
              }
            />
          </div>
        ) : null}
        {listOpen && phase === "settled" && sources.length > 0 ? (
          <div className="sk-src-after" data-turn-slot="source-list" data-ticket="SIK-1070">
            <span className="sk-stem-kicker">来源</span>
            <PplxSources items={sources} />
          </div>
        ) : null}
      </div>
      {floatItem && citeAnchor && phase === "settled" ? (
        <SourceFloat item={floatItem} anchor={citeAnchor} onClose={closeFloat} />
      ) : null}
    </TurnBlock>
  );
}

export function BanLoader({ name }: { readonly name: string }) {
  return (
    <div className="sk-ban">
      <span className="sk-ban-mark" aria-hidden="true">
        <Square size={14} />
      </span>
      <span>{name}</span>
      <span className="sk-ban-tag">不进流</span>
    </div>
  );
}

export function ComposerBar({
  value,
  onChange,
  onSend,
  onStop,
  busy,
}: {
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly onSend: () => void;
  readonly onStop?: () => void;
  readonly busy: boolean;
}) {
  const dockOpen = useAppStore((s) => s.dockOpen);
  const setDockOpen = useAppStore((s) => s.setDockOpen);
  return (
    <form
      className="spec-composer"
      onSubmit={(e) => {
        e.preventDefault();
        if (!busy) onSend();
      }}
    >
      <SceneAiChip size={32} expanded={dockOpen} onClick={() => setDockOpen(!dockOpen)} />
      <textarea
        value={value}
        rows={1}
        placeholder="按当前密度发一句…"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (busy) onStop?.();
            else onSend();
          }
        }}
      />
      {busy && onStop ? (
        <button type="button" className="spec-send" onClick={onStop}>
          停止
        </button>
      ) : (
        <button type="submit" className="spec-send" disabled={value.trim().length === 0}>
          发送
        </button>
      )}
    </form>
  );
}

export function Grip() {
  return (
    <div className="sk-grip" aria-hidden="true">
      <GripHorizontal />
    </div>
  );
}
