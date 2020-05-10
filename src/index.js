import mineflayer from 'mineflayer';
import v from 'vec3';
import {ChunkZone, set_chunk} from './database.js'; 
import fs from 'fs'


const CSIZE = 16;
const WALK_HEIGHT = 200;

if (process.argv.length < 5 || process.argv.length > 7) {
    console.log('Usage : node echo.js <host> <port> [<name>] [<password>] [<config path>]')
    process.exit(1)
}

const config = JSON.parse(fs.readFileSync(process.argv[6], "UTF8"))
var zone = new ChunkZone(config.zone.position, config.zone.size);

const bot = mineflayer.createBot({
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
    bot._client.on('map_chunk', (data) => {
        if (!data.bitMap) {
            return;
        }
        set_chunk(data)
    });    // keep your eyes on the target, so creepy!
    bot.creative.startFlying()
    setInterval(() => {
        bot.chat("A map download plan is underway, tools and results are publicly available and anyone interested can participate. We are in early stage but things are moving fast. This is an automatic message. FUCK THE EMPIRE https://github.com/asyade/cort2bot-minetexas-dump");
    }, 1000 * 60 * 30);
    routine()
})

async function move_to(position) {
    console.log(`MOVE FROM ${bot.entity.position} TO ${position}`)
    return new Promise((res, rej) => {
        bot.creative.flyTo(position, () => {
            if (bot.entity.position.equals(position)) {
                console.log("MOVE OK");
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
    await move_to(v(bot.entity.position, WALK_HEIGHT, bot.entity.position));
    var resumed_state;
    if ((resumed_state = resume()) !== null) {
        console.log("Resuming previous fill (remove /tmp/stash.json to reset)");
        return await fill(resumed_state)
    }
    console.log("Set X,Z pos ...");
    await move_to(v(config.zone.position[0] * CSIZE, WALK_HEIGHT, config.zone.position[1] * CSIZE));
    console.log("Placement done !");
    await fill({
        left: true,
        new_z: config.zone.position[1]
    });
}

async function fill(state) {
    while (state.new_z < config.zone.position[0] + config.zone.size[1]) {
        var new_x = state.left ? config.zone.position[0] + config.zone.size[0] : config.zone.position[0];
        state.new_z += 6;
        state.left = !state.left;
        fs.writeFileSync("/tmp/stash.json", JSON.stringify(state), "UTF8");
        await move_to(v(new_x * CSIZE, WALK_HEIGHT, bot.entity.position.z))
        await move_to(v(new_x * CSIZE, WALK_HEIGHT, state.new_z))
    }
    fs.unlinkSync("/tmp/stash.json");
    console.log("DUMP DONE !");
}

bot.on('chunkColumnLoad', (e) => {
})

process.on('exit', (code) => {
    fs.writeFileSync("/tmp/zone.json", zone.dump(), "UTF8");
});
