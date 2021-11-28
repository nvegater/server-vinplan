#!/bin/bash

echo What is the name of the migration?
read MIGRATION_NAME

rm -r dist/
npm run build
npm run typeorm migration:generate -- -n $MIGRATION_NAME
rm -r dist/




