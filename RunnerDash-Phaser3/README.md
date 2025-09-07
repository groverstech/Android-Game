# Runner Dash · Phaser 3 + Vite (Codespaces-Ready)

A lightweight endless runner you can develop entirely in **GitHub Codespaces**. No external art required — textures are generated procedurally at runtime. Built for quick iteration and Play Store-ready WebView or PWA packaging.

## Features
- ⚡ Endless runner core with jump + double jump
- 🛡️ Power‑ups: **Shield**, **Magnet**, **Speed Boost**
- 💰 Coins, distance, score, and persistent best score
- 🌌 Parallax sky + tile ground
- 🖱️ Tap/Click or SPACE/UP to jump, **P** to pause
- 🔊 Minimal beeps via WebAudio (no files)
- 🧪 Zero asset pipeline: all textures are generated in code
- 📦 Vite dev server, easy deploy to GitHub Pages

## Quickstart (Codespaces)
1. Create a new **GitHub repo** and upload this folder (or upload the zip).
2. Click **Code ▸ Create codespace on main**.
3. In the Codespace terminal, run:
   ```bash
   npm i
   npm run dev
   ```
4. Open the forwarded port **5173** in the Codespace UI. The game should appear.

## Local (optional)
```bash
npm i
npm run dev
# or build
npm run build && npm run preview
```

## Deploy to GitHub Pages
Add this workflow at `.github/workflows/deploy.yml` (or use the one provided below) and enable Pages (from `gh-pages` output).

```yaml
name: Deploy Runner Dash to GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then push to `main` and check **Settings ▸ Pages** for the live URL.

## Customize Art & Effects
All textures come from `BootScene.createProceduralTextures()` — tweak colors, sizes, or replace with your own PNG/SVG by putting files under `public/assets` and loading with `this.load.image(...)` in `BootScene.preload()`.

## Packaging as Android App
- Wrap the `dist/` build inside a minimal Android WebView (Flutter WebView, React Native, or native Android).
- Or publish as a **PWA** and use Trusted Web Activity for Play Store.

---
© Grovers Technologies · MIT License
