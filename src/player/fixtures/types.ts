import type { ProductWidgetId } from "@/contract/widgets";
import type { DensityId, DotsState, ProseParagraph, StreamPhase, TurnView } from "@/contract/turn";

export type OpKind = "thought" | "search" | "read" | "write" | "code" | "tool";

export type SourceCard = {
  readonly n: number;
  readonly title: string;
  readonly kind: string;
  readonly snippet: string;
  readonly body: string;
  readonly invalid?: boolean;
};

export type Expert = {
  readonly id: string;
  readonly name: string;
  readonly op: OpKind;
  readonly text: string;
};

export type StepRow = {
  readonly op: OpKind;
  readonly text: string;
  readonly elapsed?: string;
  readonly live?: boolean;
  readonly status?: "running" | "done" | "rejected";
};

export type FilterRow = {
  readonly name: string;
  readonly topic: string;
  readonly status: string;
  readonly cause: string;
};

export type InsightSpec = {
  readonly viz: "bars" | "progress" | "curve" | "compare";
  readonly kicker: string;
  readonly title: string;
  readonly hero: { readonly n: string; readonly unit: string };
  readonly tone: "risk" | "ai" | "warn";
  readonly rows: ReadonlyArray<{ readonly name: string; readonly label: string; readonly value: number }>;
  readonly ask: string;
  readonly progress?: number;
  readonly series?: readonly number[];
};

export type RecChoice = {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly score: number;
};

export type StemAid = {
  readonly caption: string;
  readonly columns: readonly string[];
  readonly rows: readonly (readonly string[])[];
};

export type WidgetSpec =
  | { readonly type: "method"; readonly title: string; readonly reason: string; readonly folded?: boolean }
  | { readonly type: "youtry"; readonly title: string; readonly items: readonly string[]; readonly folded?: boolean }
  | { readonly type: "action-chips"; readonly items: readonly string[] }
  | {
      readonly type: "recommend";
      readonly question: string;
      readonly choices: readonly RecChoice[];
      readonly specimen?: "fold" | "open" | "accepting" | "written" | "skipped" | "fail";
    }
  | { readonly type: "insight"; readonly items: readonly InsightSpec[]; readonly empty?: boolean }
  | { readonly type: "filter"; readonly rows: readonly FilterRow[]; readonly empty?: boolean }
  | { readonly type: "prompt-list"; readonly items: readonly string[] }
  | { readonly type: "nav-cta"; readonly label: string }
  | { readonly type: "product"; readonly kind: ProductWidgetId | "unknown"; readonly folded?: boolean };

export type TurnFrame = {
  readonly id: string;
  readonly phase: StreamPhase;
  readonly density: DensityId;
  readonly seq?: number;
  readonly user: string;
  readonly stem?: string;
  readonly stemAid?: StemAid;
  readonly status: {
    readonly state: DotsState;
    readonly copy: string;
    readonly time?: string;
    readonly foldable?: boolean;
    readonly defaultOpen?: boolean;
  };
  readonly experts?: readonly Expert[];
  readonly approval?: {
    readonly title: string;
    readonly reason: string;
    readonly blocking: boolean;
    readonly options: readonly string[];
    readonly specimen?: string;
  };
  readonly prose?: {
    readonly paragraphs: readonly ProseParagraph[];
    readonly streaming?: boolean;
  };
  readonly steps?: readonly StepRow[];
  readonly lookback?: SourceCard;
  readonly widgets?: readonly WidgetSpec[];
  readonly footprint?: {
    readonly sourceCount: number;
    readonly sourcesOpen?: boolean;
  };
  readonly sources?: readonly SourceCard[];
  readonly error?: { readonly title: string; readonly action?: string };
};

export type Scenario = {
  readonly id: string;
  readonly title: string;
  readonly density: DensityId;
  readonly host: string;
  readonly runtime: string;
  readonly views: readonly TurnView[];
  readonly frames: readonly TurnFrame[];
};
