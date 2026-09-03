import { BarChart2, Mic, Plus, ArrowUp } from "lucide-react";
import { BAR_STATUS, type BarChip, type BarStatusId } from "@/contract/shell";

export type PromptBarLayout = "empty" | "pinned" | "invalid" | "locator" | "both" | "dirty" | "listening";

function chipsFromLayout(layout: PromptBarLayout, locator?: string | null): readonly BarChip[] {
  if (locator) {
    const extra = layout === "dirty" ? "未保存" : undefined;
    const chips: BarChip[] = [{ type: "status", status: "looking", path: locator, extra }];
    if (layout === "both" || layout === "pinned") chips.push({ type: "source", label: "@错题库" });
    return chips;
  }
  switch (layout) {
    case "empty":
      return [];
    case "pinned":
      return [{ type: "source", label: "@错题库" }];
    case "invalid":
      return [{ type: "source", label: "@错题库", invalid: true }];
    case "locator":
      return [{ type: "status", status: "looking", path: "总览" }];
    case "both":
      return [
        { type: "status", status: "looking", path: "总览" },
        { type: "source", label: "@错题库" },
      ];
    case "dirty":
      return [
        { type: "status", status: "looking", path: "资料题同比 · 笔记", extra: "未保存" },
        { type: "source", label: "@笔记本" },
      ];
    case "listening":
      return [{ type: "status", status: "listening" }];
    default:
      return [];
  }
}

export function BarStatusChip({
  status,
  path,
  extra,
}: {
  readonly status: BarStatusId;
  readonly path?: string;
  readonly extra?: string;
}) {
  const spec = BAR_STATUS[status];
  return (
    <span className="sk-pbar-status" data-tone={spec.tone} data-motion={spec.motion}>
      {spec.mark === "dots" ? (
        <span className="sk-pbar-live" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      ) : null}
      <em>{spec.kicker}</em>
      {path ? (
        <>
          <span aria-hidden="true">·</span>
          <b>{path}</b>
        </>
      ) : null}
      {extra ? <small>{extra}</small> : null}
    </span>
  );
}

export function BarChipRow({ chips }: { readonly chips: readonly BarChip[] }) {
  if (!chips.length) return null;
  return (
    <div className="sk-pbar-chips">
      {chips.map((chip, i) =>
        chip.type === "status" ? (
          <BarStatusChip key={`${chip.status}-${chip.path ?? i}`} status={chip.status} path={chip.path} extra={chip.extra} />
        ) : (
          <span key={`${chip.label}-${i}`} className="sk-pbar-chip" data-layout={chip.invalid ? "invalid" : "pinned"}>
            <BarChart2 size={12} strokeWidth={2.2} />
            {chip.label}
            {chip.invalid ? <span className="sk-pbar-invalid">已失效</span> : null}
          </span>
        ),
      )}
    </div>
  );
}

export function PromptBarSpecimen({
  layout = "pinned",
  placeholder = "问这一页…",
  locator,
  chips,
}: {
  readonly layout?: PromptBarLayout;
  readonly placeholder?: string;
  readonly locator?: string | null;
  readonly chips?: readonly BarChip[];
}) {
  const row = chips ?? chipsFromLayout(layout, locator);
  return (
    <div className="sk-pbar" data-specimen="prompt-bar" data-layout={layout}>
      <BarChipRow chips={row} />
      <div className="sk-pbar-grid">
        <button type="button" className="sk-pbar-icon" aria-label="添加来源或文件" disabled>
          <Plus size={16} strokeWidth={2} />
        </button>
        <textarea className="sk-pbar-field" rows={1} value="" placeholder={placeholder} readOnly />
        <button type="button" className="sk-pbar-icon" aria-label="听写" disabled>
          <Mic size={15} strokeWidth={2} />
        </button>
        <button type="button" className="sk-pbar-send" disabled aria-label="发送">
          <ArrowUp size={16} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
