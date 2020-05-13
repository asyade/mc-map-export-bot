#!/bin/sh

XFROM=$1
YFROM=$2
ZFROM=$3
XSIZE=$4
ZSIZE=$5
SERVER=$6
PORT=$7
USERNAME=$8
PASSWORD=$9
REGION=${10}

PALETTE=./dump-map/res/blocks-1.15.0.json
export PALETTE

if [ -z $8 ]; then
    echo "Usage: [x from] [y from] [z from] [zone widt] [zone height] [server address] [server port] [mc username] [mc password] [mc region directory]"
fi

$DUMP_MAP -o $REGION listen&
DUMP_MAP_PID=$!

echo XFROM $XFROM

cd client
while [ 1 ]; do
    npm run dev -- $SERVER $PORT $USERNAME $PASSWORD $XFROM $YFROM $ZFROM $XSIZE $ZSIZE || continue
    break
done
cd ..

kill -s KILL $DUMP_MAP_PID
