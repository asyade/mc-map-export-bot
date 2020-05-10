import fs from 'fs';

const SESSION_DIR=`${process.env.HOME}/.mcdump`

try {
    fs.mkdirSync(SESSION_DIR)
} catch (e) {}

function chunk_fname(x, z) {
    return `${SESSION_DIR}/${x}_${z}.json`
}

function set_chunk(data) {
    fs.writeFile(chunk_fname(data.x, data.z), JSON.stringify(data), "utf8", () => {});
}

class ChunkZone {
    constructor(position, size) {
        this.position = position;
        this.size = size;
        this.line = [];
        for (var x = 0; x < size[0]; x++) {
            var column = [];
            for (var z = 0; z < size[1]; z++) {
                const fname = chunk_fname(position[0] + x, position[1] + z);
                column.push(fs.existsSync(fname));
            }
            this.line.push(column);
        }
    }

    dump() {
        let str = "";
        for (let z = this.position[1]; z < this.position[1] + this.size[1]; z++) {
            for (let x = this.position[0]; x < this.position[0] + this.size[0]; x++) {
                const exist = fs.existsSync(chunk_fname(x, z));
                str += exist ? '#' : '.'
            }
            str += '\n'
        }
        return str;
    }
}

export { ChunkZone, SESSION_DIR, chunk_fname, set_chunk }