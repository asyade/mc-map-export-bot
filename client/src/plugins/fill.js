import fs from 'fs'
const CHUNK_SIZE = 16;

module.exports = inject

    function inject (bot, { version }) {
        var config = null;

        bot.fill.fill_zone = fill_zone
        
        function resume() {
            try {
                const json = JSON.parse(fs.readFileSync("/tmp/stash.json", "UTF8"));
                if (json !== null && json.left !== null && json.new_z != null) {
                    return json
                }
            } catch (e) {}
            return null
        }

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

        async function fill(state) {
            while (state.new_z < config.zone.position[2] + config.zone.size[1]) {
                var new_x = state.left ? config.zone.position[0] + config.zone.size[0] : config.zone.position[0];
                state.new_z += 10;
                state.left = !state.left;
                fs.writeFileSync("/tmp/stash.json", JSON.stringify(state), "UTF8");
                await move_to(v(new_x * CSIZE, config.zone.position[1], bot.entity.position.z))
                await move_to(v(bot.entity.position.x, config.zone.position[1], state.new_z * CSIZE))
            }
            fs.unlinkSync("/tmp/stash.json");
            console.log("DUMP DONE !");
        }

        async function fill_zone(config_patch) {
            config = config_patch;
            console.log("Set Y pos ...")
            await move_to(v(bot.entity.position.x, config.zone.position[1], bot.entity.position.z));
            var resumed_state;
            if ((resumed_state = resume()) !== null) {
                console.log("Resuming previous fill (remove /tmp/stash.json to reset)");
                return await fill(resumed_state)
            }
            console.log("Set X,Z pos ...");
            await move_to(v(config.zone.position[0] * CHUNK_SIZE, config.zone.position[1], config.zone.position[2] * CHUNK_SIZE));
            console.log("Placement done !");
            await fill({
                left: true,
                new_z: config.zone.position[2]
            });
        }
}
