#!/bin/bash
set -eu

ACTION_FILES=$(find src/*/main.ts)

for ACTION_FILE in $ACTION_FILES
do
    # Get the full path of the directory of the file = $(dirname $PWD)
    # Get just the name of the last directory = basename 
    ACTION=$(basename $(dirname $ACTION_FILE))
    # Pass -q to scrip for quiet mode
	npm run package -q --action=$ACTION -- -q
done