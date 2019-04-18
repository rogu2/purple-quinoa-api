#!/usr/bin/env bash

# bulk load data
#CSV Import
mongoimport --db=purple-quinoa-api-development --collection=ingredients --type=csv --headerline --file=lib/ingredients.csv

#JSON Import
mongoimport --db=purple-quinoa-api-development --collection=ingredients --jsonArray --file=lib/ingredients.json
