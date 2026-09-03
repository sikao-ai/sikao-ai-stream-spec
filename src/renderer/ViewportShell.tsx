import { ArrowUp } from "lucide-react";
import { PromptBarSpecimen } from "@/renderer/PromptBarSpecimen";
import { AnswerFootprint } from "@/components/stream/primitives";
import { MOBILE_CHROME } from "@/contract/shell";

const SCALE = {
  "1440": {
    caption: "桌面主列",
    bar: { size: "40", type: "14" },
    send: { size: "32", type: "12" },
    foot: { size: "28", type: "11" },
  },
  "390": {
    caption: "底 sheet · 视觉≠命中",
    bar: { size: String(MOBILE_CHROME.barRow), type: "14" },
    send: { size: `${MOBILE_CHROME.sendVisual}/${MOBILE_CHROME.hit}`, type: "13" },
    foot: { size: `${MOBILE_CHROME.footVisual}/${MOBILE_CHROME.hit}`, type: "11" },
  },
} as const;

function Tick({ size, type }: { readonly size: string; readonly type: string }) {
  return (
    <span className="spec-vp-h">
      <b>{size}</b>
      <i>{type}</i>
    </span>
  );
}

function ShellCol({ vp }: { readonly vp: "1440" | "390" }) {
  const s = SCALE[vp];
  return (
    <article className="spec-vp" data-vp={vp}>
      {vp === "390" ? <span className="spec-vp-handle" aria-hidden="true" /> : null}
      <header className="spec-vp-head">
        <b>{vp}</b>
        <span>{s.caption}</span>
      </header>
      <div className="spec-vp-row">
        <PromptBarSpecimen layout="empty" />
        <Tick size={s.bar.size} type={s.bar.type} />
      </div>
      <div className="spec-vp-row">
        <div className="spec-vp-send">
          <span>点一项即继续</span>
          <button type="button" className="sk-approve-send" aria-disabled="true" aria-label="提交">
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        </div>
        <Tick size={s.send.size} type={s.send.type} />
      </div>
      <div className="spec-vp-row">
        <AnswerFootprint sourceCount={2} onSources={() => undefined} />
        <Tick size={s.foot.size} type={s.foot.type} />
      </div>
    </article>
  );
}

export function ViewportShell() {
  return (
    <div className="spec-vp-board">
      <ShellCol vp="1440" />
      <ShellCol vp="390" />
    </div>
  );
}
