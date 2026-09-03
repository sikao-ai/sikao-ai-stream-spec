import { SOURCE_STATES } from "@/contract/scenes";
import { ContextCard, PplxSources } from "@/components/stream/primitives";
import type { SourceCard } from "@/player/fixtures/types";

export function ContextCardSpecimen({
  item,
  invalid = false,
  numbered = true,
  defaultOpen = false,
}: {
  readonly item: SourceCard;
  readonly invalid?: boolean;
  readonly numbered?: boolean;
  readonly defaultOpen?: boolean;
}) {
  return (
    <div data-specimen="context-card">
      <ContextCard item={item} numbered={numbered} invalid={invalid} defaultOpen={defaultOpen} />
    </div>
  );
}

export function SourceStateTable() {
  return (
    <div className="spec-table-wrap">
      <table className="spec-table">
        <thead>
          <tr>
            <th>表面</th>
            <th>N</th>
            <th>已验证规则</th>
          </tr>
        </thead>
        <tbody>
          {SOURCE_STATES.map((row) => (
            <tr key={`${row.surface}-${row.n}`}>
              <td>{row.surface}</td>
              <td>{row.n}</td>
              <td>{row.rule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SourceListSpecimen({ items }: { readonly items: readonly SourceCard[] }) {
  return <PplxSources items={items} />;
}
