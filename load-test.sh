#!/bin/bash

INTERVAL=.250

load() {
  local function_name=$1
  local request_amount=$2
  for i in $(seq 1 $request_amount); do
    echo -n "."
    aws lambda invoke --function-name $function_name /dev/null &> /dev/null &
    sleep $INTERVAL
  done
  echo " Done!"
}

usage() {
  echo "Usage: $0 <function_name> <request_amount>"
}

if [ $# -ne 2 ]; then
  usage
  exit 1
else
  time load $1 $2
  exit 0
fi
