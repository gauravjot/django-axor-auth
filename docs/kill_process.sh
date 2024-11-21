#!/bin/bash

pid=`sudo lsof -i :3000 | grep "node" |  awk '{print $2}'`
if [ -z "$pid" ]; then
  echo "No process found"
  exit 1
fi
sudo kill $pid
echo "Process $pid killed"
