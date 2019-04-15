#!/usr/bin/env bash

# bulk load data

mongoimport --db=purple-quinoa-api-development --collection=ingredients --type=csv --headerline --file=lib/ingredients.csv
