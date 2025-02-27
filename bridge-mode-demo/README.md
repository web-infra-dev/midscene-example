# Bridge mode demo

This is a demo to show how to use bridge mode to control the page on your desktop Chrome.

## Steps

Install Midscene extension from chrome web store: [Midscene](https://chromewebstore.google.com/detail/midscene/gbldofcpkknbggpkmbdaefngejllnief)

create `.env` file

```shell
# replace by your own
OPENAI_API_KEY="YOUR_TOKEN"
```

install deps

```bash
npm install 
```

Run demo to create new tabs. 
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