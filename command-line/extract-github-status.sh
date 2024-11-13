#!/bin/bash

# install midscene cli:
# npm i -g @midscene/cli

midscene --url https://www.githubstatus.com/ \
  --query-output status.json \
  --query '{name: string, status: string}[], service status of github page'

echo 'Github service status has been dumped into ./status.json'