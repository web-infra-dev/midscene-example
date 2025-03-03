# Connectivity Test

Use this folder to test the connectivity of the LLM Service.

# Steps

1. create `.env` file

```shell
# replace by your own
OPENAI_API_KEY="YOUR_TOKEN"
OPENAI_BASE_URL="https://..."
MIDSCENE_MODEL_NAME="..."

# more config
# ....
```

2. run testing

```bash
npm install 
npm run test
```

# FAQ 

* How to resolve `"OPENAI_BASE_URL" is already defined and was NOT overwritten` ?

Remove the `OPENAI_BASE_URL` from your system environment variables so that the `.env` file can take effect.

# Reference 

https://midscenejs.com/model-provider.html