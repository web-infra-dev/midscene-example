# Connectivity Test

Use this folder to test the connectivity of the LLM Service.


## Steps

### Preparation

create `.env` file

```shell
# replace by your gpt-4o api key
MIDSCENE_MODEL_API_KEY="YOUR_TOKEN"
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