# mc-map-export-bot

`mc-map-export-bot` emulates a Minecraft client to systematically traverse a predefined area, capturing and saving all encountered chunks. These chunks are then integrated into an existing Minecraft world save file.

> **Note**: The target server must allow flying capabilities, which is common in anarchy servers.

## Prerequisites

- Minecraft account
- Linux operating system
- Docker
- babel-node

## Architecture

### 1. Emulated Client
- Connects to the game server as a standard Minecraft client
- Navigates through the specified zone systematically
- Streams encountered chunk sections to the Patch Engine
- **Technology Stack**: Node.js with Mineflayer

### 2. Patch Engine
- Originally developed as `dump-map`
- Processes incoming chunk sections
- Integrates chunks into existing Minecraft save files
- Similar to "Minecraft World Saver" but without sniffing capabilities
- **Technology Stack**: Rust

### 3. Supervisor
- Manages synchronization between the Emulated Client and Patch Engine
- Handles process orchestration and communication
- **Technology Stack**: Docker and Bash scripts

## Installation

### Building the Patch Engine
```bash
$> cd dump-map
$> make docker-build
$> cd ..
```

### Setting up the Client
```bash
$> cd client
$> npm install .
$> cd ..
```

## Usage

1. Build both components following the installation instructions above
2. Execute the supervisor script with required parameters:

```bash
DUMP_MAP=./dump-map/target/release/dump-to-map ./supervisor.sh \
    [X] [Y] [Z] \
    [WIDTH] [HEIGHT] \
    [SERVER_ADDRESS] [PORT] \
    [MINECRAFT_USERNAME] [MINECRAFT_PASSWORD] \
    [REGION_DIRECTORY]
```

### Parameters:
- `X`, `Y`, `Z`: Starting coordinates
- `WIDTH`, `HEIGHT`: Dimensions of the area to capture
- `SERVER_ADDRESS`: Target Minecraft server address
- `PORT`: Server port (default: 25565)
- `MINECRAFT_USERNAME`: Your Minecraft account username
- `MINECRAFT_PASSWORD`: Your Minecraft account password
- `REGION_DIRECTORY`: Directory for saving captured region files

## Example
```bash
DUMP_MAP=./dump-map/target/release/dump-to-map ./supervisor.sh \
    0 64 0 \
    1000 1000 \
    anarchy.minetexas.com 25565 \
    player123 password123 \
    ./world/region
```
