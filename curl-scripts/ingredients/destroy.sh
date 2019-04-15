#!/bin/bash

API="http://localhost:4741"
URL_PATH="/ingredients"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE

echo
