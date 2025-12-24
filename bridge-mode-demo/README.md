# Bridge mode demo

This is a demo to show how to use bridge mode to control the page on your desktop Chrome.

## Steps

### Preparation

create `.env` file

```shell
MIDSCENE_MODEL_BASE_URL="https://.../compatible-mode/v1"
MIDSCENE_MODEL_API_KEY="sk-abcdefghijklmnopqrstuvwxyz"
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
MIDSCENE_MODEL_FAMILY="qwen3-vl"
```

Refer to this document if your want to use other models like Qwen: https://midscenejs.com/model-strategy.html

### Install

Install Midscene extension from chrome web store: [Midscene](https://chromewebstore.google.com/detail/midscene/gbldofcpkknbggpkmbdaefngejllnief)

install deps

```bash
npm install 
```

### Run

Remember to click the "Allow connection" button from Chrome extension while running.

```bash
npm run demo-new-tab
```

Run demo to connect to the active tab.

```bash
npm run demo-current-tab
```

# Reference 

https://midscenejs.com/bridge-mode-by-chrome-extension
https://midscenejs.com/api