#!/bin/bash

# Which branch are you comparing to? In most cases it will be master
DEFAULT_BRANCH='master'
TOKEN_WEB='web'
TOKEN_MOBILE='mobile'
TOKEN_DOCS='docs' # This will help us if we don't want to run any tests when only docs were changed
TOKEN_READMES='readme' # This will help us if we don't want to run any tests when only readmes were changed

# In Teamcity, this is how you get the current commit that triggered the CI
CURRENT_HASH=%system.build.vcs.number% 

# Save all the files changed in this PR
CHANGED_FILES=$(git --no-pager diff --name-only $CURRENT_HASH $(git merge-base $CURRENT_HASH $DEFAULT_BRANCH))

# Run file-diffy
DIFFYS=$(file-diffy run --tokens $TOKEN_READMES $TOKEN_DOCS $TOKEN_WEB $TOKEN_MOBILE --files=$(echo "$CHANGED_FILES"))

# CI Logic

if [[ $DIFFYS = *$TOKEN_WEB* ]]; then
  echo "Run web!!"
fi

if [[ $DIFFYS = *$TOKEN_MOBILE* ]]; then
  echo "Run mobile!!"
fi

if [[ $DIFFYS = *$"other"* ]]; then
  echo "Run web && mobile!!"
fi


