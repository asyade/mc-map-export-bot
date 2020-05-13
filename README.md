Cort2Bot is a MINECRAFT bot that dump the game world.

# Operation
The bot emulate a minecraft client and move around a predefined zone, saving all chunks on the road.
The saved chunk are "patched" into an existing minecraft world.
> Server must accept flying, as most anarchy server do

# Prerequisites
- A minecraft account
- A linux host
- Docker
- babel-node

# Arcitecture
## Emulated client
An emulated client will connect to the game server and start moving around the defined zone.
All chunk section loaded on the road are sent to the "Patch engine"
### Technos
`node-js`/`mineflayer`

## Patch engine
Originaly called `dump-map` the patch engine accept chunk section and insert theme into an existing minecraft save.
> The patch engine is very similar to `minecraft world saver` but without the `sniffer` part
### Technos
`RUST`

## Supervisor
Both `supervisor` and `patch engine` should be synchronized, that what the supervisor do.
### Technos
`docker` and bash scripts

# Build
The build process is quite simple (on a linux host), for the client you just need to install required npm package and for `dump-map` a dockerfile file is provided.

## dump-map
```bash
$> cd dump-map
$> make docker-build
$> cd ..
```

## client
```bash
$> cd client
$> npm install .
$> cd ..
```
# Usage
- *1* Build both `client` and `dump-map` from instructions bellow 
- *2* Run supervisor.sh, ex:
```bash
DUMP_MAP=./dump-map/target/release/dump-to-map ./supervisor.sh [X] [Y] [Z] [WIDTH] [HEIGHT] anarchy.minetexas.com 25565 [MC USERNAME] [MC PASSWORD] [REGION DIR] 
```
