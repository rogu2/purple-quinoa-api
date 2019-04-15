#!/bin/bash

API="http://localhost:4741"
URL_PATH="/recipes"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --data '{
      "recipe": {
        "name": "'"${NAME}"'",
        "food_group": "'"${GROUP}"'",
        "food_type": "'"${TYPE}"'",
        "column": "'"${COL}"'",
        "row": "'"${ROW}"'"
    }
  }'

echo
