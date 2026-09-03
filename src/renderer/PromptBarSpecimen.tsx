import { BarChart2, Calendar, Layers, Mic, Paperclip, Plus, ArrowUp } from "lucide-react";
import { PROMPT_BAR, SOURCE_SLOT_LAYOUT, SHELL_COMMANDS, SHELL_SOURCE_KEYS } from "@/contract/shell";

const ICONS = {
  bank: BarChart2,
  note: Layers,
  cal: Calendar,
} as const;

export function PromptBarSpecimen({
  layout = "pinned",
  placeholder = "布局标本 · 不发送模型",
}: {
  readonly layout?: (typeof SOURCE_SLOT_LAYOUT)[number]["id"];
  readonly placeholder?: string;
}) {
  const slot = SOURCE_SLOT_LAYOUT.find((s) => s.id === layout) ?? SOURCE_SLOT_LAYOUT[1];
  return (
    <div className="sk-pbar" data-specimen="prompt-bar" data-layout={layout}>
      <p className="spec-meta spec-source-honest">{PROMPT_BAR.not}</p>
      {layout !== "empty" ? (
        <div className="sk-pbar-chips">
          <span className="sk-pbar-chip" data-layout={layout}>
            <BarChart2 size={12} strokeWidth={2.2} />
            @错题库
            {layout === "invalid" ? <span className="sk-pbar-invalid">已失效</span> : null}
          </span>
        </div>
      ) : null}
      <div className="sk-pbar-grid">
        <button type="button" className="sk-pbar-icon" aria-label="添加来源或文件" disabled>
          <Plus size={16} strokeWidth={2} />
        </button>
        <textarea className="sk-pbar-field" rows={1} value="" placeholder={placeholder} readOnly />
        <button type="button" className="sk-pbar-icon" aria-label="听写壳位" disabled>
          <Mic size={15} strokeWidth={2} />
        </button>
        <button type="button" className="sk-pbar-send" disabled aria-label="发送（标本不发送）">
          <ArrowUp size={16} strokeWidth={2.4} />
        </button>
      </div>
      <p className="spec-meta">{slot.rule}</p>
      <div className="sk-pbar-legend">
        {SHELL_SOURCE_KEYS.filter((s) => s.key !== "attach").map((s) => {
          const Icon = ICONS[s.key as keyof typeof ICONS];
          return (
            <span key={s.key} className="spec-meta">
              {Icon ? <Icon size={11} /> : <Paperclip size={11} />} {s.name} · {s.desc}
            </span>
          );
        })}
        {SHELL_COMMANDS.map((c) => (
          <span key={c.key} className="spec-meta">
            {c.name} {c.desc}
          </span>
        ))}
      </div>
    </div>
  );
}
