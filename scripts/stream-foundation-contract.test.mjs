import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const matrix = readFileSync(new URL("../src/lib/spec-matrix.ts", import.meta.url), "utf8");
const scenes = readFileSync(new URL("../src/contract/scenes.ts", import.meta.url), "utf8");
const app = readFileSync(new URL("../src/components/spec-app.tsx", import.meta.url), "utf8");
const source = `${matrix}\n${scenes}\n${app}`;

test("SIK-1067 presents stream chrome as flagless infrastructure", () => {
  assert.doesNotMatch(source, /FEATURE_FLAG/);
  assert.doesNotMatch(source, /matrix-flag/);
  assert.doesNotMatch(source, /defaultOff/);
  assert.match(source, /AI 基础设施单路径/);
  assert.match(source, /随正常 Web 部署直接上线/);
  assert.match(source, /回滚只走代码 revert \/ roll-forward/);
  assert.match(source, /业务 capability flag 不控制 chrome 版本/);
});
