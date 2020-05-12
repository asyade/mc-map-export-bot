Cort2Bot is a MINECRAFT bot that dump the game world.

# Operation
The bot emulate a minecraft client and move around a predefined zone, saving all chunks on the road.
> Server must accept flying, as most anarchy server do

# Prerequisites
- A minecraft account
- `node` and `npm` installed

# Usage
## Build
```shell
npm build
```

## Test
```shell
babel-node src/index.js
```

## Arguments
[SERVER HOST] [SERVER PORT, DEFAULT 25565] [MC USERNAME] [MC_PASSWORD] [CONFIG PATH]

## Config
The configuration format is pretty simple we're just defining a zone and the bot will do the rest.
```json
{
    "zone": {
        "position" : [ 10, 10  ],
        "size" : [ 40, 40 ]
    }
}
```

# Dump format
The chunk are stored in `$HOME/.mcdump` (as json representation of chunk session packet)
Theses chunks can be converted to a playable minecraft world using https://github.com/asyade/dump-map

# Deployment
## AWS
## HEROKU
> COMMING SOON
