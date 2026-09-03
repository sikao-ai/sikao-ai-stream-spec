import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

export function SpecimenRow({
  n,
  title,
  lede,
  px,
  xy,
  forbid,
  checks,
  standard,
  code,
  tabs,
  tab,
  onTab,
  children,
}: {
  readonly n: string;
  readonly title: string;
  readonly lede: string;
  readonly px?: string;
  readonly xy?: { readonly x: string; readonly y: string };
  readonly forbid?: string;
  readonly checks?: readonly string[];
  readonly standard: ReadonlyArray<{ readonly k: string; readonly v: string }>;
  readonly code: string;
  readonly tabs?: ReadonlyArray<{ readonly id: string; readonly label: string }>;
  readonly tab?: string;
  readonly onTab?: (id: string) => void;
  readonly children: ReactNode;
}) {
  return (
    <section className="spec-bui-row" id={`bui-${n}`}>
      <header className="spec-bui-head">
        <span className="spec-bui-num">{n}</span>
        <div className="spec-bui-heading">
          <h2 className="spec-bui-title">{title}</h2>
          <p className="spec-bui-lede">{lede}</p>
        </div>
        {tabs && tabs.length > 0 ? (
          <div className="spec-bui-tabs" role="tablist" aria-label={`${title} 变体`}>
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                data-active={tab === t.id}
                onClick={() => onTab?.(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : null}
      </header>
      <div className="spec-bui-split">
        <div className="spec-bui-demo">{children}</div>
        <aside className="spec-bui-aside">
          {px ? <p className="spec-bui-px">{px}</p> : null}
          {xy ? (
            <p className="spec-bui-xy">
              <span>
                <b>X</b> {xy.x}
              </span>
              <span>
                <b>Y</b> {xy.y}
              </span>
            </p>
          ) : null}
          {forbid ? <p className="spec-bui-forbid">禁止 {forbid}</p> : null}
          <dl className="spec-bui-std">
            {standard.map((row) => (
              <div key={row.k} className="spec-bui-std-row">
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>
          {checks && checks.length > 0 ? (
            <ul className="spec-bui-checks">
              {checks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          <CodePanel code={code} />
        </aside>
      </div>
    </section>
  );
}

function CodePanel({ code }: { readonly code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="spec-bui-code">
      <button
        type="button"
        className="spec-bui-copy-btn"
        aria-label="复制代码"
        onClick={() => {
          void navigator.clipboard?.writeText(code);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        }}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
