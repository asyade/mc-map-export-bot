/*
    Intercept chunk section and broadcast it via `.dump.on("chunk", [..])`
*/
const assert = require('assert')
const events = require('events');

module.exports = inject

function inject (bot, { version }) {
    bot.dump = new events.EventEmitter();

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
              bot.dump.emit("chunk", {
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
            if (!data.bitMap) return;
            console.log(`dump ${data.x} ${data.z}`)
            bot.dump.emit("chunk", data)
        });
    })
}
