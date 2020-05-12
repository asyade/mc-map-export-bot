import mineflayer from 'mineflayer';
import v from 'vec3';
import {ChunkZone, set_chunk} from './database.js'; 
import fs from 'fs'


import FlyPlugin from './fly_plugin.js'

const CSIZE = 16;

if (process.argv.length < 5 || process.argv.length > 7) {
    console.log('Usage : node echo.js <host> <port> [<name>] [<password>] [<config path>]')
    process.exit(1)
}

var config = JSON.parse(fs.readFileSync(process.argv[6], "UTF8"))
const WALK_HEIGHT = config.zone.position[1];

config.zone.position[0] = Math.round(config.zone.position[0]  / CSIZE)
config.zone.position[2] = Math.round(config.zone.position[2]  / CSIZE)
config.zone.size[0] = Math.round(config.zone.size[0]  / CSIZE)
config.zone.size[1] = Math.round(config.zone.size[1]  / CSIZE)

var zone = new ChunkZone(config.zone.position, config.zone.size);

const bot = mineflayer.createBot({
  plugins: {
    FlyPlugin
  },
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'echo',
  password: process.argv[5],
  version: "1.15.2"
})

bot.on('message', (msg) => {
    // console.log(`${msg}`)
})

bot.once('spawn', () => {
    bot._client.on('map_chunk_bulk', (packet) => {
        let offset = 0
        let meta
        let i
        let size
        for (i = 0; i < packet.meta.length; ++i) {
          meta = packet.meta[i]
          size = (8192 + (packet.skyLightSent ? 2048 : 0)) *
            onesInShort(meta.bitMap) + // block ids
            2048 * onesInShort(meta.bitMap) + // (two bytes per block id)
            256 // biomes
          set_chunk({
            x: meta.x,
            z: meta.z,
            bitMap: meta.bitMap,
            heightmaps: packet.heightmaps,
            skyLightSent: packet.skyLightSent,
            groundUp: true,
            data: packet.data.slice(offset, offset + size)
          })
          offset += size
        }
        assert.strictEqual(offset, packet.data.length)
    })
    bot._client.on('map_chunk', (data) => {
        if (!data.bitMap) {
            return;
        }
        console.log(`dump ${data.x} ${data.z}`)
        set_chunk(data)
    });
    bot.fly.startFlying()
    setInterval(() => {
        bot.chat("A map download plan is underway, tools and results are publicly available and anyone interested can participate. We are in early stage but things are moving fast. This is an automatic message. FUCK THE EMPIRE https://github.com/asyade/cort2bot-minetexas-dump");
    }, 1000 * 60 * 30);
    routine()
})

async function move_to(position) {
    console.log(`MOVE FROM ${bot.entity.position} TO ${position}`)
    var startTime = new Date().getTime();
    return new Promise((res, rej) => {
        bot.fly.flyTo(position, () => {
            if (bot.entity.position.equals(position)) {
                var endTime = new Date().getTime();           
                console.log(`MOVE OK - ${endTime-startTime} ms`);
                res()
            } else {
                console.error("MOVE FAILED");
                rej()
            }
        })
    })
}

function resume() {
    try {
        const json = JSON.parse(fs.readFileSync("/tmp/stash.json", "UTF8"));
        if (json !== null && json.left !== null && json.new_z != null) {
            return json
        } else {
            return null
        }
    } catch (e) {
        return null
    }
}

async function routine() {
    console.log("Set Y pos ...")
    await move_to(v(bot.entity.position.x, WALK_HEIGHT, bot.entity.position.z));
    var resumed_state;
    if ((resumed_state = resume()) !== null) {
        console.log("Resuming previous fill (remove /tmp/stash.json to reset)");
        return await fill(resumed_state)
    }
    console.log("Set X,Z pos ...");
    await move_to(v(config.zone.position[0] * CSIZE, WALK_HEIGHT, config.zone.position[2] * CSIZE));
    console.log("Placement done !");
    await fill({
        left: true,
        new_z: config.zone.position[2]
    });
}

async function fill(state) {
    while (state.new_z < config.zone.position[2] + config.zone.size[1]) {
        var new_x = state.left ? config.zone.position[0] + config.zone.size[0] : config.zone.position[0];
        state.new_z += 12;
        state.left = !state.left;
        fs.writeFileSync("/tmp/stash.json", JSON.stringify(state), "UTF8");
        await move_to(v(new_x * CSIZE, WALK_HEIGHT, bot.entity.position.z))
        await move_to(v(bot.entity.position.x, WALK_HEIGHT, state.new_z * CSIZE))
    }
    fs.unlinkSync("/tmp/stash.json");
    console.log("DUMP DONE !");
}

bot.on('chunkColumnLoad', (e) => {
})

process.on('exit', (code) => {
    fs.writeFileSync("/tmp/zone.json", zone.dump(), "UTF8");
});
