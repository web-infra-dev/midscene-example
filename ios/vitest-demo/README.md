> Midscene x iOS is still under development. You may use this demo if you want to have an early access.

# iOS demo

This is a demo to show how to use iOS device to do some automation tasks.

## Steps

### Preparation

create `.env` file

```shell
# replace by your gpt-4o api key
OPENAI_API_KEY="YOUR_TOKEN"
```

connect an iOS device

Refer to this document if your want to use other models like Qwen: https://midscenejs.com/choose-a-model

### Install

install deps

```bash
npm install 
```

### Run

case1:

```bash
npm run test -- setting.test.ts
```

or case2:

```
npm run test -- todo.test.ts
```

# Reference 

https://midscenejs.com/api