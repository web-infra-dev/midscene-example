# Electron Demo — Testing Obsidian with @midscene/computer

This demo shows how to use `@midscene/computer` to test an Electron application (Obsidian) in a headless Linux CI environment using Xvfb.

## How it works

1. Finds or extracts the Obsidian AppImage (`--appimage-extract` to avoid FUSE)
2. Pre-seeds the vault config to skip the vault picker dialog
3. Launches Obsidian with Electron-friendly flags (`--no-sandbox`, etc.)
4. Uses `agentFromComputer()` to interact with the running app via screenshots

## Local usage

```bash
# 1. Download Obsidian AppImage into this directory
# 2. Create .env with your AI model credentials:
#    OPENAI_API_KEY=sk-xxx
#    MIDSCENE_MODEL_NAME=qwen3-vl-plus
# 3. Run
npm install
npm run test
```

## CI usage

The workflow `.github/workflows/computer-electron-demo.yaml` runs this demo on `ubuntu-22.04` with Xvfb. Trigger it manually via `workflow_dispatch`.
