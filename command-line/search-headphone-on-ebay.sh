#!/bin/bash

# use --headed if you want to see the browser in action
  # --wait-for "there is at least one headphone item on page" \
midscene --url https://www.ebay.com --viewport-width 1280 --viewport-height 800 --viewport-scale 1 \
  --sleep 2000 \
  --action "type 'Headphones' in search box, hit Enter" \
  --sleep 5000 \
  --query-output headphones.json \
  --query "{itemTitle: string, price: Number}[], find item in list and corresponding price" \
  --assert "There is a category filter on the left"