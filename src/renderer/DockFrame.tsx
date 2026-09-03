import { useState } from "react";
import { Columns2, PictureInPicture2, X } from "lucide-react";
import { AiMark, PromptList, SceneAiChip } from "@/components/stream/primitives";
import { PromptBarSpecimen } from "@/renderer/PromptBarSpecimen";
import { SessionPopover, SessionTrigger } from "@/renderer/SessionManagerSpecimen";
import { ReviewPathAMobileGate } from "@/renderer/HostSpecimen";
import {
  SESSION_FIXTURES,
  SHELL_SCENES,
  type DockPlace,
} from "@/contract/shell";

export type ShellSurface = "welcome" | "thread" | "mgr" | "gate";
export type ShellSceneId = (typeof SHELL_SCENES)[number]["id"];
export type ShellEntry = "scene" | "seed" | "rail" | "top";

export function sceneOf(id: ShellSceneId) {
  return SHELL_SCENES.find((s) => s.id === id) ?? SHELL_SCENES[0];
}

export function DockFrame({
  place = "float",
  scene = "overview",
  surface = "welcome",
  interactive = false,
}: {
  readonly place?: DockPlace;
  readonly scene?: ShellSceneId;
  readonly surface?: ShellSurface;
  readonly interactive?: boolean;
}) {
  const meta = sceneOf(scene);
  const [mgrOpen, setMgrOpen] = useState(surface === "mgr");
  const openMgr = interactive ? mgrOpen : surface === "mgr";
  const title = surface === "welcome" ? "新对话" : meta.sessionTitle;
  const showComposer = surface !== "gate";
  const showHead = surface !== "gate";

  if (surface === "gate") {
    return (
      <div className="spec-dock" data-place="ios" data-surface="gate">
        <span className="sk-dock-handle" aria-hidden="true" />
        <div className="spec-dock-gate">
          <ReviewPathAMobileGate />
        </div>
      </div>
    );
  }

  return (
    <div className="spec-dock" data-place={place} data-surface={surface} data-mgr={openMgr}>
      {place === "ios" ? <span className="sk-dock-handle" aria-hidden="true" /> : null}
      {showHead ? (
        <header className="sk-dock-head">
          <span className="sk-dock-bot" aria-hidden="true">
            <AiMark size={18} detail="min" />
          </span>
          <SessionTrigger
            title={title}
            open={openMgr}
            onToggle={() => {
              if (interactive) setMgrOpen((v) => !v);
            }}
          >
            {openMgr ? (
              <SessionPopover
                sessions={SESSION_FIXTURES}
                activeId={SESSION_FIXTURES[0]?.id ?? ""}
                place={place}
                onPick={() => interactive && setMgrOpen(false)}
                onNew={() => undefined}
                onDel={() => undefined}
                onDismiss={() => interactive && setMgrOpen(false)}
              />
            ) : null}
          </SessionTrigger>
          {place !== "ios" ? (
            <button type="button" className="sk-dock-ico" aria-label={place === "rail" ? "改回浮层" : "钉到右栏"} disabled>
              {place === "rail" ? <PictureInPicture2 size={15} /> : <Columns2 size={15} />}
            </button>
          ) : null}
          <button type="button" className="sk-dock-ico" aria-label="收起" disabled>
            <X size={15} />
          </button>
        </header>
      ) : null}
      <div className="sk-dock-thread">
        {surface === "thread" ? (
          <div className="spec-dock-thread-ghost">
            <p className="spec-sess-ghost">「遏制」管已起的势头，语气偏硬。</p>
            <span className="sk-stem-kicker">下一问</span>
            <PromptList items={meta.presets.slice(0, 3)} />
          </div>
        ) : (
          <div className="sk-dock-empty">
            <div className="sk-dock-hello">
              <AiMark size={36} detail="full" />
              <b>{meta.hello}</b>
            </div>
            <PromptList items={meta.presets} />
          </div>
        )}
      </div>
      {showComposer ? (
        <div className="sk-dock-composer">
          <PromptBarSpecimen layout="locator" locator={meta.locator} placeholder={meta.placeholder} />
        </div>
      ) : null}
    </div>
  );
}

export function ShellPlaceSpecimen({ place }: { readonly place: DockPlace }) {
  if (place === "ios") {
    return <DockFrame place="ios" scene="overview" surface="welcome" />;
  }
  return (
    <div className="spec-shell-open" data-place={place}>
      <div className="spec-shell-open-page">
        <header className="spec-shell-open-bar">
          {place === "rail" ? <SceneAiChip size={32} expanded label="Rail" interactive={false} /> : null}
          <span>{place === "rail" ? "主列仍可读" : "场景页"}</span>
          {place === "float" ? <SceneAiChip size={32} expanded label="Scene" interactive={false} /> : null}
        </header>
        <p className="spec-shell-open-ghost">题面 / 笔记留在主列。壳不复制题面。</p>
      </div>
      <DockFrame place={place} scene={place === "rail" ? "guided" : "overview"} surface="welcome" />
    </div>
  );
}

export function ShellOpenSpecimen({ entry }: { readonly entry: ShellEntry }) {
  if (entry === "seed") {
    return <DockFrame place="float" scene="overview" surface="welcome" />;
  }
  if (entry === "scene") return <ShellPlaceSpecimen place="float" />;
  if (entry === "rail") return <ShellPlaceSpecimen place="rail" />;
  return (
    <div className="spec-shell-open" data-place="ios">
      <div className="spec-shell-open-page" data-phone="true">
        <header className="spec-shell-open-bar" data-size="44">
          <span>窄屏顶栏</span>
          <SceneAiChip size={44} expanded label="TopBar" interactive={false} />
        </header>
        <p className="spec-shell-open-ghost">点 44 标，sheet 从底上来。</p>
      </div>
      <DockFrame place="ios" scene="overview" surface="welcome" />
    </div>
  );
}
