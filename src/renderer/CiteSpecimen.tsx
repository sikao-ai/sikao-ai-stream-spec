import { AnswerBody } from "@/components/stream/primitives";
import { CITE_STATES } from "@/contract/cite";
import { SAP_SOURCES, TOOL_PROSE_SETTLED } from "@/player/fixtures/content";

export type CiteMode = (typeof CITE_STATES)[number]["id"];

export function CiteSpecimen({ mode }: { readonly mode: CiteMode }) {
  const streaming = mode === "streaming";
  const sources =
    mode === "none"
      ? []
      : mode === "invalid"
        ? [{ ...SAP_SOURCES[0], invalid: true as const }, SAP_SOURCES[1]]
        : SAP_SOURCES.slice(0, 2);
  const paragraphs =
    mode === "none"
      ? [{ segments: [{ text: "空里要的是还没成形的苗头，用「抑制」更贴搭配。" }] }]
      : [...TOOL_PROSE_SETTLED];
  return (
    <div className="spec-cite" data-mode={mode}>
      <AnswerBody
        phase={streaming ? "streaming" : "settled"}
        streaming={streaming}
        paragraphs={paragraphs}
        sources={sources}
        sourcesOpen={mode === "list"}
        defaultCite={mode === "open" || mode === "invalid" ? 1 : undefined}
      />
    </div>
  );
}
