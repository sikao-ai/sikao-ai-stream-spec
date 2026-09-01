# Asset hand-over contract

Generate complete files under `/workspace/.grok/`. Move them into their final
locations only after validation so Vite never reads a partial JPEG or JSON
document.

```bash
node scripts/write-atomic.mjs /workspace/.grok/og.jpg.tmp /workspace/public/og.jpg
node scripts/write-atomic.mjs /workspace/.grok/x-banner.jpg.tmp /workspace/public/x-banner.jpg
node scripts/write-atomic.mjs /workspace/.grok/site.json.tmp /workspace/src/lib/og/site.json
```

The staged file and target must be on the `/workspace` filesystem. Never stage
inside `public/`; Vite copies that directory verbatim and could publish a
partial artifact.
