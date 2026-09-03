import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestSrc = readFileSync(path.join(root, "src/contract/manifest.ts"), "utf8");
const turnSrc = readFileSync(path.join(root, "src/contract/turn.ts"), "utf8");

function pinned(name) {
  const m = new RegExp(`${name}:\\s*"([^"]+)"`).exec(manifestSrc);
  assert.ok(m, `missing ${name} in manifest`);
  return m[1];
}

test("prototype fixtures pin sikao origin/main SHA and contract versions", () => {
  const sha = pinned("sikaoOriginMainSha");
  assert.match(sha, /^[0-9a-f]{40}$/);
  assert.match(manifestSrc, /1067\.w0\.4/);
  assert.match(manifestSrc, /1066\.v4/);
  assert.match(turnSrc, /TURN_SLOTS/);
  assert.match(turnSrc, /TIMING_MATRIX/);
  assert.match(turnSrc, /COPY_LOCK/);
  assert.match(turnSrc, /ALIGN_RULES/);
});

test("sibling sikao origin/main matches the pin when present", () => {
  const sha = pinned("sikaoOriginMainSha");
  const envRepo = process.env.SIKAO_REPO;
  const sibling = path.resolve(root, "../sikao");
  const repo = envRepo && existsSync(envRepo) ? envRepo : existsSync(sibling) ? sibling : null;
  if (!repo) {
    console.log("sikao checkout not present; SHA pin format already checked");
    return;
  }
  const head = execFileSync("git", ["-C", repo, "rev-parse", "origin/main"], {
    encoding: "utf8",
  }).trim();
  assert.equal(
    head,
    sha,
    `sikao origin/main is ${head}, prototype pin is ${sha}. Update src/contract/manifest.ts when syncing.`,
  );
  const contractPath = path.join(repo, "docs/plan/sik-1067-ai-stream-density-visual-contract.md");
  if (!existsSync(contractPath)) {
    throw new Error(`missing ${contractPath}`);
  }
  const doc = readFileSync(contractPath, "utf8");
  for (const needle of ["1067.w0.4", "1066.v4", "到你了", "你记过", "查看笔记", "正在想", "已完成", "已停止生成"]) {
    assert.ok(doc.includes(needle), `sikao contract missing locked string: ${needle}`);
  }
});
