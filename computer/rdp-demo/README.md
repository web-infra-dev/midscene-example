# Computer RDP Demo

This demo shows how to use `@midscene/computer` to control a remote Windows desktop directly over the RDP protocol.

## Steps

### Preparation

Create `.env` file with the same Midscene model variables used by other examples:

```shell
MIDSCENE_MODEL_BASE_URL="https://.../compatible-mode/v1"
MIDSCENE_MODEL_API_KEY="sk-abcdefghijklmnopqrstuvwxyz"
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
MIDSCENE_MODEL_FAMILY="qwen3-vl"
```

Then open [demo.ts](./demo.ts) and update the placeholder values in the `rdpTarget` object:

```ts
const rdpTarget = {
  host: 'REPLACE_WITH_YOUR_RDP_HOST',
  port: 3389,
  username: 'Admin',
  password: 'REPLACE_WITH_YOUR_RDP_PASSWORD',
  ignoreCertificate: true,
  adminSession: false,
  domain: undefined,
  securityProtocol: 'auto',
};
```

The demo validates the RDP target values before creating the agent. If you leave a placeholder unchanged, it will throw immediately.

If you want to use another model, refer to:
https://midscenejs.com/model-common-config.html

### Run demo

```bash
npm install

npm run test
```

The demo will connect to the remote Windows desktop, wait for the remote framebuffer to become visible if the first frame is blank, open the Settings app, continue into the Windows Update page, read the visible page title and status summary back into structured JSON, and print the generated report path.

## Notes

- This demo uses protocol-level RDP control. Midscene sees the remote Windows framebuffer directly instead of controlling a local RDP client window.

## Reference

- https://midscenejs.com/computer-introduction.html
- https://midscenejs.com/computer-api-reference.html
