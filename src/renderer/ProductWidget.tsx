import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { KindTag } from "@/components/stream/primitives";
import { PRODUCT_WIDGETS, type ProductWidgetId } from "@/contract/widgets";

export function ProductWidget({
  kind,
  folded = true,
}: {
  readonly kind: ProductWidgetId | "unknown";
  readonly folded?: boolean;
}) {
  const spec = kind === "unknown" ? null : PRODUCT_WIDGETS.find((w) => w.id === kind);
  const [open, setOpen] = useState(!folded);
  if (!spec) {
    return (
      <p className="spec-meta" data-widget="unknown">
        未知 kind · fail-soft 不渲染
      </p>
    );
  }
  const peak = Math.max(1, ...spec.rows.map((r) => r.value));
  return (
    <div className="sk-insight" data-testid="ai-widget-card" data-widget={spec.id} data-viz={spec.viz}>
      <button
        type="button"
        className="sk-insight-top sk-widget-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <KindTag kind="data" label="数据" />
        <span className="sk-gate-title">{spec.title}</span>
        <span className="spec-meta">{spec.scope}</span>
        <span className="sk-widget-chev" aria-hidden="true">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>
      <div className="sk-widget-fold" data-open={open ? "true" : "false"}>
        <div className="sk-widget-fold-inner">
          <div className="sk-insight-body">
            {spec.hero ? (
              <p className="sk-insight-hero">
                <strong>{spec.hero.n}</strong>
                <span>{spec.hero.unit}</span>
              </p>
            ) : null}
            {spec.viz === "progress" && spec.progress != null ? (
              <div className="sk-insight-progress" role="progressbar">
                <span style={{ width: `${Math.round(spec.progress * 100)}%` }} />
              </div>
            ) : null}
            {spec.viz === "curve" && spec.series ? <WidgetCurve series={spec.series} /> : null}
            <ul className="sk-insight-rows" data-viz={spec.viz === "list" ? "bars" : spec.viz}>
              {spec.rows.map((row) => (
                <li key={row.name}>
                  <span className="sk-insight-name">{row.name}</span>
                  {row.label ? <span className="sk-insight-val">{row.label}</span> : null}
                  {spec.viz === "list" ? null : (
                    <span
                      className="sk-insight-bar"
                      aria-hidden="true"
                      style={{ width: `${Math.max(8, (row.value / peak) * 100)}%` }}
                    />
                  )}
                </li>
              ))}
            </ul>
            {spec.ask ? (
              <button type="button" className="sk-insight-cta">
                {spec.ask}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function WidgetCurve({ series }: { readonly series: readonly number[] }) {
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
