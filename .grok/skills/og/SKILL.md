---
name: og
description: Create and validate the app's share card, X feed banner, and site identity when a Grok App needs custom brand assets.
---

# OG brand assets

Use this skill for games, creative tools, brand-forward pages, or any app whose
identity should not use the generic `og.grok.me` placeholder. Plain utilities
may retain the placeholder when the parent task explicitly classifies them that
way.

## Brand-asset pass:

Work independently from the parent app build. Never `wait_tasks` and never
`get_task_output`; completion is reported asynchronously so the parent can keep
building and publish again if the assets arrive later.

While generating, keep `/workspace/.grok/og-pending` fresh. The marker is stale
after 10 minutes and must be removed when the pass finishes or fails. Stage
generated files under `/workspace/.grok/`, never inside `public/`, then hand
them over atomically using the commands in
[references/asset-contract.md](references/asset-contract.md).

Required outputs for a custom card:

- `public/og.jpg`: 1200×630 JPEG, under 600 KB.
- `src/lib/og/site.json`: stable title, description, and `"card": "custom"`.
- Games additionally need `"type": "x:game"` and
  `public/x-banner.jpg`: 1200×264 JPEG, under 600 KB.

Do not fabricate generated art when no approved image-generation capability is
available. Report the missing capability and leave the existing placeholder or
assets unchanged.

Before reporting success, run the applicable self-check:

```bash
node scripts/brand-check.mjs --root /workspace
node scripts/brand-check.mjs --game --root /workspace
```

Use `--placeholder-ok` only for a parent-approved plain utility whose expected
result is the platform placeholder.
