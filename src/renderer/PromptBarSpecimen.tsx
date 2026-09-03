import { BarChart2, Mic, Plus, ArrowUp } from "lucide-react";
import { SOURCE_SLOT_LAYOUT } from "@/contract/shell";

export function PromptBarSpecimen({
  layout = "pinned",
  placeholder = "问这一页…",
}: {
  readonly layout?: (typeof SOURCE_SLOT_LAYOUT)[number]["id"];
  readonly placeholder?: string;
}) {
  return (
    <div className="sk-pbar" data-specimen="prompt-bar" data-layout={layout}>
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
