import { AiMark } from "@/components/stream/primitives";
import { TurnRenderer } from "@/renderer/TurnRenderer";
import { PATH_A } from "@/contract/scenes";
import { getFrame, getScenario } from "@/player/fixtures";

export function ReviewPathADesktop() {
  const frame = getFrame(getScenario("review-path-a"), "waiting");
  return (
    <div className="sk-host-path-a" data-testid="review-path-a-desktop">
      <section className="sk-host-path-a-modal" aria-label="Path A 题面">
        <span className="sk-stem-kicker">Path A · 解析</span>
        <p className="sk-host-kicker-line">正在看 · 资料题同比 · 解析</p>
        <p className="spec-meta">{PATH_A.desktop}</p>
      </section>
      <aside className="sk-host-path-a-dock" aria-label="复盘教师 AIdock">
        <header className="sk-host-dock-head">
          <AiMark size={18} detail="min" />
          <span>行测复盘教师</span>
        </header>
        <TurnRenderer frame={frame} view="live" />
      </aside>
    </div>
  );
}

export function ReviewPathAMobileGate() {
  return (
    <div className="sk-host-gate" data-testid="review-path-a-mobile">
      <AiMark size={36} detail="full" />
      <h2 className="spec-h3">复盘教师 Agent 请在桌面端使用</h2>
      <p className="spec-meta">移动端完整适配后续提供</p>
    </div>
  );
}

export function GuidedThreeTrack() {
  const frame = getFrame(getScenario("guided"), "settled");
  return (
    <div className="sk-host-guided" data-testid="guided-three-track">
      <section className="sk-host-guided-pane" data-pane="material">
        <span className="sk-stem-kicker">材料</span>
        <p className="spec-meta">给定资料 1–3。不是 Turn。</p>
      </section>
      <section className="sk-host-guided-pane" data-pane="direction">
        <span className="sk-stem-kicker">方向</span>
        <p className="spec-meta">审题 / 要点清单。不是 Turn。</p>
      </section>
      <section className="sk-host-guided-pane" data-pane="turn">
        <span className="sk-stem-kicker">对话</span>
        <TurnRenderer frame={frame} view="persisted" />
      </section>
    </div>
  );
}
