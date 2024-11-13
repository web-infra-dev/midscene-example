#!/bin/bash

# install midscene cli:
# npm i -g @midscene/cli

# --headed means start a browser window
midscene --headed --url https://www.ebay.com --viewport-width 1280 --viewport-height 800 \
  --sleep 2000 \
  --action "type 'Headphones' in search box, hit Enter" \
  --wait-for "there is at least one headphone item on page" \
  --query-output headphones.json \
  --query "{itemTitle: string, price: Number}[], find item in list and corresponding price" \
  --assert "There is a category filter on the left"