#!/bin/bash

# Visit the SauceDemo website and login as a standard user

echo 'In this demo, we will extract the items info into ./items.json. Then you should see the assertion fails with a detailed reason.'
echo 'By viewing the report file, you can see the entire process.'

npx @midscene/cli --url https://www.saucedemo.com/ \
  --action "type 'standard_user' in user name input, type 'secret_sauce' in password, click 'Login'" \
  --query-output items.json \
  --query '"{name: string, price: number, actionBtnName: string}[], return item name, price and the action button name on the lower right corner of each item (like 'Remove')"' \
  --assert "The price of 'Sauce Labs Fleece Jacket' is 49.99"