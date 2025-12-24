# Connectivity Test

Use this folder to test the connectivity of the LLM Service.


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

### Run

```bash
npm install 
npm run test
```

# FAQ 

* How to resolve `"MIDSCENE_MODEL_BASE_URL" is already defined and was NOT overwritten` ?

Remove the `MIDSCENE_MODEL_BASE_URL` from your system environment variables so that the `.env` file can take effect.

# Reference 

https://midscenejs.com/model-common-config.html