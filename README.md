Cort2Bot is a MINECRAFT server world dumper specially made for anarchy server.

# Operation
The bot emulate the minecraft client and move around a predefined zone, saving all chunks on the road.

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
> Coordonates are exprimated in chunk, divid normale coordonate by 16 
```json
{
    "zone": {
        "position" : [ 10, 10  ],
        "size" : [ 40, 40 ]
    }
}
```