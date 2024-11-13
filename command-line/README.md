# command line

## Preparation

Ensure that Node.js is installed

```shell
npm i -g @midscene/cli
```

Config the API key

```shell
# replace by your own
export OPENAI_API_KEY="sk-abcdefghijklmnopqrstuvwxyz"
```

## Run

Extract status info from github status page

```shell
./extract-github-status.sh
```

A testing case on sauce demo, expect to throw error

```shell
./sauce-demo-expect-fail.sh
```

Perform a search on ebay.com, headed mode (i.e. you can see the browser window when running)

```shell
./search-headphone-on-ebay.sh
```

Serve the `server_root` folder as a static server and test the `index.html` file

```shell
./local-static-server.sh
```

# Reference

A complete guide: https://midscenejs.com/cli.html
