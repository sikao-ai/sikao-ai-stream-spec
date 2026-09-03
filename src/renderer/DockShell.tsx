import { useEffect, useState, type ReactNode } from "react";
import { Columns2, PictureInPicture2, X } from "lucide-react";
import type { DockPlace } from "@/contract/shell";
import { SESSION_FIXTURES } from "@/contract/shell";
import { AiMark } from "@/components/stream/primitives";
import { SessionPopover, SessionTrigger } from "@/renderer/SessionManagerSpecimen";

export function DockShell({
  place,
  title,
  open,
  onClose,
  onPlace,
  children,
  composer,
}: {
  readonly place: DockPlace;
  readonly title: string;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onPlace?: (place: DockPlace) => void;
  readonly children: ReactNode;
  readonly composer?: ReactNode;
}) {
  const [mgrOpen, setMgrOpen] = useState(false);
  const [sessions, setSessions] = useState(() => [...SESSION_FIXTURES]);
  const [activeId, setActiveId] = useState(SESSION_FIXTURES[0]?.id ?? "");
  const active = sessions.find((s) => s.id === activeId);
  const heading = active?.title ?? title;

  useEffect(() => {
    document.documentElement.dataset.dockPlace = open ? place : "";
    return () => {
      document.documentElement.dataset.dockPlace = "";
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) setMgrOpen(false);
  }, [open]);

  return (
    <>
      <section
        className="sk-dock"
        data-place={place}
        data-mgr={mgrOpen}
        hidden={!open}
        data-testid="ai-dock-shell"
      >
        {place === "ios" ? <span className="sk-dock-handle" aria-hidden="true" /> : null}
        <header className="sk-dock-head">
          <span className="sk-dock-bot" aria-hidden="true">
            <AiMark size={18} detail="min" />
          </span>
          <SessionTrigger title={heading} open={mgrOpen} onToggle={() => setMgrOpen((v) => !v)} />
          {place !== "ios" && onPlace ? (
            <button
              type="button"
              className="sk-dock-ico"
              aria-label={place === "rail" ? "改回浮层" : "钉到右栏"}
              onClick={() => onPlace(place === "rail" ? "float" : "rail")}
            >
              {place === "rail" ? <PictureInPicture2 size={15} /> : <Columns2 size={15} />}
            </button>
          ) : null}
          <button type="button" className="sk-dock-ico" aria-label="收起" onClick={onClose}>
            <X size={15} />
          </button>
        </header>
        {mgrOpen ? (
          <SessionPopover
            sessions={sessions}
            activeId={activeId}
            place={place}
            onPick={(id) => {
              setActiveId(id);
              setMgrOpen(false);
            }}
            onNew={() => {
              const id = `n-${sessions.length + 1}`;
              setSessions((rows) => [
                { id, title: "新对话", when: "刚刚", group: "今天", preview: "" },
                ...rows,
              ]);
              setActiveId(id);
              setMgrOpen(false);
            }}
            onDel={(id) => {
              setSessions((rows) => {
                const next = rows.filter((s) => s.id !== id);
                if (id === activeId) setActiveId(next[0]?.id ?? "");
                return next;
              });
            }}
            onDismiss={() => setMgrOpen(false)}
          />
        ) : null}
        <div className="sk-dock-thread">{children}</div>
        {composer ? <div className="sk-dock-composer">{composer}</div> : null}
      </section>
      {open && place === "ios" ? (
        <button type="button" className="sk-dock-scrim" aria-label="关闭" onClick={onClose} />
      ) : null}
    </>
  );
}
