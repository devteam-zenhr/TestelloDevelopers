#!/bin/bash

set -e # Exit on errors

if [ -n "$TMUX" ]; then
  export NESTED_TMUX=1
  export TMUX=''
fi

if [ ! $DEV_TESTELLO_DIR ]; then export DEV_TESTELLO_DIR=$HOME/workspace/dev.testello; fi

cd $DEV_TESTELLO_DIR

tmux new-session  -d -s Testello
tmux set-environment -t Testello -g DEV_TESTELLO_DIR $DEV_TESTELLO_DIR

# Use `thin start --ssl` for HTTPS (doesn't work on Mac for some reason)
tmux new-window     -t Testello -n 'Guard'
tmux send-key       -t Testello 'cd $DEV_TESTELLO_DIR'                  Enter 'guard'                       Enter

tmux new-window     -t Testello -n 'Jekyll'
tmux send-key       -t Testello 'cd $DEV_TESTELLO_DIR'                  Enter 'bundle exec jekyll serve'    Enter

tmux new-window     -t Testello -n 'DEV_TESTELLO'
tmux send-key       -t Testello 'cd $DEV_TESTELLO_DIR'                  Enter 'vim .'                       Enter

if [ -z "$NESTED_TMUX" ]; then
  tmux attach-session -t Testello
else
  tmux switch-client -t Testello
fi
