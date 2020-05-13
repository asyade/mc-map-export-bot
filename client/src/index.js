import mineflayer from 'mineflayer';
import { setChunk } from './database.js'; 
import Fly from './plugins/fly.js'
import Fill from './plugins/fill.js'
import Dump from './plugins/dump.js'
import sendPacket from './services/dumpToMap.js'

if (process.argv.length < 9 || process.argv.length > 11) {
    console.log(process.argv);
    console.log('Usage : <host> <port> [<name>] [<password>] [<X>] [<Y>] [<Z>] [<WIDTH>] [<HEIGHT>]')
    process.exit(1)
}

const CHUNK_SIZE = 16;
const CONFIG = {
    zone: {
        position: [
            Math.round(parseFloat(process.argv[6]) / CHUNK_SIZE),
            Math.round(parseFloat(process.argv[7])),
            Math.round(parseFloat(process.argv[8]) / CHUNK_SIZE),
        ],
        size: [
            Math.round(parseFloat(process.argv[9]) / CHUNK_SIZE),
            Math.round(parseFloat(process.argv[10])  / CHUNK_SIZE),
        ]
    }
}
console.log(process.argv);

const BOT = mineflayer.createBot({
  plugins: {
    Fly,
    Fill,
    Dump,
  },
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'echo',
  password: process.argv[5],
  version: "1.15.2"
})

BOT.once('spawn', async () => {
    BOT.dump.on("chunk", (chunk) => {
        sendPacket(chunk)
        // setChunk(chunk)
        
    })
    BOT.fly.startFlying()
    await BOT.fill.fill_zone(CONFIG)
    process.exit(0)
})
