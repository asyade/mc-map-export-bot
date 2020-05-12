import fs from 'fs';

const SESSION_DIR=`${process.env.HOME}/.mcdump`

try {
    fs.mkdirSync(SESSION_DIR)
} catch (e) {}

function chunk_fname(x, z) {
    return `${SESSION_DIR}/${x}_${z}.json`
}

function setChunk(data) {
    console.log(`DUMP CX: ${data.x}, CZ: ${data.z}, - X: ${data.x * 16}, Z: ${data.z * 16}`)
    fs.writeFile(chunk_fname(data.x, data.z), JSON.stringify(data), "utf8", () => {});
}

export { SESSION_DIR, chunk_fname, setChunk }