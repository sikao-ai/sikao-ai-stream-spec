# 司考 AI 流规范

契约实验室：验证 **同一输入状态应画成什么**。sikao 主仓负责状态如何产生、是否有权限、是否计费、能否恢复。

```text
真实产品状态夹具
→ 场景播放器
→ Turn / Shell 渲染器
→ 截图、DOM、a11y 回归
```

```bash
npm ci
npm run dev
npm test
```

Canonical 入口：`/`。左轨「回合」是 `ScenarioPlayer`（逐帧 / 暂停 / 终态）。直连 xAI、`localStorage` 会话、假听写在 `/labs/live-model-demo`，标 `demo-only`。

钉住：`src/contract/manifest.ts`（sikao `origin/main` SHA、Turn / Shell 契约版本）。主仓 SHA 或锁定文案漂移时 `npm run check:pin` 失败。
