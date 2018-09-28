#!/bin/bash

# Which branch are you comparing to? In most cases it will be master
DEFAULT_BRANCH='master'

# In Teamcity, this is how you get the current commit that triggered the CI
CURRENT_HASH=%system.build.vcs.number% 

# Save all the files changed in this PR
CHANGED_FILES=$(git --no-pager diff --name-only $CURRENT_HASH $(git merge-base $CURRENT_HASH $DEFAULT_BRANCH))

# Run git-diffy
git-diffy run --diffys web mobile --files=$(echo $CHANGED_FILES)