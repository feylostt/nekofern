const mineflayer = require('mineflayer'); // bot api
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder') // pathfinder module

const Task = {
    IDLE: 0,
    FOLLOW: 1,
    AFK_FARM: 2
}

const RANGE_GOAL = 1; // for pathfinding, our distance to our target to be satisfied

let task = Task.IDLE; // idle by default
let target = null; // current target for whatever action

let defaultMove = null; // movement

let commands = ["stay", "come", "afk"];

// connect to my lil server :3c
const bot = mineflayer.createBot({
    host: process.env.SERVER_IP,
    auth: "microsoft",
    version: "1.21.8"
});

bot.loadPlugin(pathfinder);

bot.once('spawn', () => {
    console.log(`logged in to minecraft as ${bot.username}`);

    defaultMove = new Movements(bot);
    // setInterval(act, 50);

    bot.on('whisper', (username, message) => {
        if (username === bot.username) return;
        if (!commands.includes(message)) return;

        task = commands.indexOf(message);

        if(task == Task.IDLE) {
            // idle 
        } else if(task == Task.FOLLOW) {
            target = bot.players[username]?.entity
            if (!target) {
                bot.whisper(username, "i can't see u :(");
                console.log("target not found :(");
                return;
            }
            const { x: playerX, y: playerY, z: playerZ } = target.position;
        }

        // bot.pathfinder.setMovements(defaultMove);
        // bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, RANGE_GOAL));
    });

    setInterval(() => {
        if(bot.pathfinder.isMoving()) return;

        if(task == Task.IDLE) {
            const entity = bot.nearestEntity();
            if (entity !== null) {
                if (entity.type === 'player') {
                    bot.lookAt(entity.position.offset(0, entity.height - 0.2, 0));
                } else if (entity.type === 'mob') {
                    bot.lookAt(entity.position);
                }
            }
        } else if(task == Task.AFK_FARM) {
            // sleep at a nearby bed, warn player of danger. in the future add multiple types (kill mobs in a farm etc)
            // eepy
            if(!bot.time.isDay()) {
                // find bed
                // let bed = bot.findBlock();
                // sleep
                // bot.sleep(bed);
            }
        }
    }, 50);
});

bot.on('message', (message) => {
    console.log(message.toAnsi());
});

function startup() {}

// error handling
bot.on('kicked', error => {
    console.log(error);
});
bot.on('error', error => {
    console.log(error);
});

async function getLookingAt() {}
async function getInventory() {}

// current task (idle, farm, mine, etc?)
async function getTask() {}
async function setTask(task) {}

module.exports = {
    startup,
    bot,
    Task
}