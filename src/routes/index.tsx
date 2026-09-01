import { createFileRoute } from "@tanstack/react-router";
import { SpecApp } from "@/components/spec-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <SpecApp />;
}
