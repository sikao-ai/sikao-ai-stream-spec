import { useEffect, type ReactNode } from "react";
import { Columns2, PictureInPicture2, X } from "lucide-react";
import type { DockPlace } from "@/contract/shell";
import { AiMark } from "@/components/stream/primitives";

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
  useEffect(() => {
    document.documentElement.dataset.dockPlace = open ? place : "";
    return () => {
      document.documentElement.dataset.dockPlace = "";
    };
  }, [open, place]);
  return (
    <>
      <section className="sk-dock" data-place={place} hidden={!open} data-testid="ai-dock-shell">
        {place === "ios" ? <span className="sk-dock-handle" aria-hidden="true" /> : null}
        <header className="sk-dock-head">
          <span className="sk-dock-bot" aria-hidden="true">
            <AiMark size={18} detail="min" />
          </span>
          <div className="sk-dock-mgr-wrap">
            <span className="sk-dock-ttl">
              <b>{title}</b>
            </span>
          </div>
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
        <div className="sk-dock-thread">{children}</div>
        {composer ? <div className="sk-dock-composer">{composer}</div> : null}
      </section>
      {open && place === "ios" ? (
        <button type="button" className="sk-dock-scrim" aria-label="关闭" onClick={onClose} />
      ) : null}
    </>
  );
}
