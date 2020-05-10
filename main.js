const mineflayer = require('mineflayer')
const v = require('vec3');

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node echo.js <host> <port> [<name>] [<password>]')
  process.exit(1)
}

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

bot.on('message', (packet) => {
    console.log(`Recv: ${packet}`)
})

bot.once('spawn', () => {
    // keep your eyes on the target, so creepy!
    bot.creative.startFlying()
    const from = bot.entity.position;
    const to = v(from.x, 200, from.z);
    console.log(`move from : ${from} to ${to}`);
    bot.creative.flyTo(to, () => {
        console.log(`Done : ${bot.entity.position}`);
    })
})

bot.on('chunkColumnLoad', (e) => {
    console.log(bot._columns);
})

function relative_move(x, y, z) {
}