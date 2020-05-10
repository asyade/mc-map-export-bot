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
fs.writeFileSync("/tmp/zone.json", zone.dump(), "UTF8");

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'echo',
  password: process.argv[5],
  version: "1.15.2"
})

bot.on('chat', (username, message) => {
    console.log(`${username}:  ${message}`)
})

bot.once('spawn', () => {
    bot._client.on('map_chunk', (data) => {
        set_chunk(data)
    });    // keep your eyes on the target, so creepy!
    bot.creative.startFlying()
    bot.chat("A map download plan is underway, tools and results are publicly available and anyone interested can participate. We are in early stage but things are moving fast. This is an automatic message https://github.com/asyade/cort2bot-minetexas-dump ");
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

async function routine() {
    console.log("Set Y pos ...")
    await move_to(v(bot.entity.position, WALK_HEIGHT, bot.entity.position));
    console.log("Set X,Z pos ...");
    await move_to(v(config.zone.position[0] * CSIZE, WALK_HEIGHT, config.zone.position[1] * CSIZE));
    console.log("Placement done !");
    await fill()
}

async function fill() {
    var points = [];
    var left = true;
    var new_z = config.zone.position[1]
    while (true) {
        var new_x = left ? config.zone.position[0] + config.zone.size[0] : config.zone.position[0];
        new_z += 12;
        top = !left;
        await move_to(v(new_x * CSIZE, WALK_HEIGHT, new_z * CSIZE))
    }
}

bot.on('chunkColumnLoad', (e) => {
})
