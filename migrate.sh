#!/bin/bash

echo What is the name of the migration?
read MIGRATION_NAME

rm -r dist/
npm run build
npm run typeorm migration:generate -- -n $MIGRATION_NAME

# find the latest modified file in the directory, it should be the new migration
# https://stackoverflow.com/questions/4561895/how-to-recursively-find-the-latest-modified-file-in-a-directory
# find . -type f -print0 | xargs -0 stat -f "%m %N" | sort -rn | head -1 | cut -f2- -d" "

MIGRATION_FILE_NAME=$(find . -type f -print0 \
         | xargs -0 stat -f "%m %N" \
         | sort -rn | head -1 | cut -f2- -d" ")

echo "Moving ${MIGRATION_FILE_NAME} to migrations folder"

mv ${MIGRATION_FILE_NAME} ./src/migrations/

rm -r dist/
npm run build



