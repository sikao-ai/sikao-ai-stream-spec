import { createFileRoute } from "@tanstack/react-router";
import { DemoBanner } from "@/labs/live-model-demo/DemoBanner";
import { AiDock } from "@/labs/live-model-demo/AiDock";
import { useAppStore } from "@/lib/app-store";
import { useEffect } from "react";

export const Route = createFileRoute("/labs/live-model-demo")({
  component: LiveModelDemoPage,
});

function LiveModelDemoPage() {
  const setOpen = useAppStore((s) => s.setDockOpen);
  useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <div className="spec-labs" data-demo-only="true">
      <DemoBanner />
      <main className="spec-labs-canvas">
        <h1>现场模型演示</h1>
        <p>这一页会打 xAI、把会话写进 localStorage，听写会塞假字。用来摸壳，不验收契约。</p>
      </main>
      <AiDock />
    </div>
  );
}
