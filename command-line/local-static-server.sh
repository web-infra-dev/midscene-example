#!/bin/bash

# Visit the SauceDemo website and login as a standard user

echo 'In this demo, we will serve the `server_root` folder as a static server and test the `index.html` file.'

npx @midscene/cli --serve ./public --url index.html \
  --assert "The button text is 'Start'"