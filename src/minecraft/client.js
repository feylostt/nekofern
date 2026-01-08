const mineflayer = require('mineflayer'); // bot api
const {pathfinder, Movements, goals: {
        GoalNear
    }} = require('mineflayer-pathfinder') // pathfinder module

const logger = require("../logger");

const Queue = require("../util/queue");

const { guildId, channelId } = require("../config/discord.json");
const { client } = require("../discord/bot");

const Task = {
    IDLE: 0,
    FOLLOW: 1,
    AFK_FARM: 2,
    GUARD: 3,
    PATROL: 4,
    QUIT: 5
}

const RANGE_GOAL = 1; // for pathfinding, our distance to our target to be satisfied

var task = Task.IDLE; // idle by default
var target = null; // current target for whatever action

var defaultMove = null; // movement

var commands = ["stay", "come", "afk"];

var chatQueue = new Queue();

async function login(ip, port, state) {
    task = state || Task.IDLE;
    // connect to my lil server :3c
    const bot = mineflayer.createBot({host: ip, port: port, auth: "microsoft", version: "1.21.8"});

    bot.loadPlugin(pathfinder);

    bot.once('spawn', () => {
        console.log(`logged in to minecraft as ${bot.username}`);

        defaultMove = new Movements(bot);
        // setInterval(act, 50);

        bot.on('whisper', (username, message) => {
            if (username === bot.username) {
                return;
            }
            
            if (!commands.includes(message)) {
                return;
            }
            
            task = commands.indexOf(message);
            target = bot.players[username]?.entity
        });

        setInterval(() => {
            if (bot.pathfinder.isMoving()) 
                return;
            

            // send queued chat messages regardless of current task:
            while(!chatQueue.isEmpty()) {
                bot.chat(chatQueue.dequeue());
            }

            switch (task) {
                case Task.IDLE:
                    const entity = bot.nearestEntity();
                    if (entity !== null) {
                        if (entity.type === 'player') {
                            bot.lookAt(entity.position.offset(0, entity.height - 0.2, 0));
                        } else if (entity.type === 'mob') {
                            bot.lookAt(entity.position);
                        }
                    }
                    break;
                case Task.FOLLOW:
                    if (! target) {
                        logger.info("target not found :(");
                        return;
                    }
                    const {x: playerX, y: playerY, z: playerZ} = target.position;
                    bot.pathfinder.setMovements(defaultMove);
                    bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, RANGE_GOAL));
                    break;
                case Task.AFK_FARM:
                    // sleep at a nearby bed, warn player of danger. in the future add multiple types (kill mobs in a farm etc)
                    // eepy
                    if (! bot.time.isDay()) {
                        // find bed
                        // let bed = bot.findBlock();
                        // sleep
                        // bot.sleep(bed);
                    }
                    break;
                case Task.QUIT: bot.quit();
                    break;
                default:
                    // task not implemented or out of bounds, reset to idle
                    task = Task.IDLE;
                    break;
            }
        }, 50);
    });

    bot.on('message', (message) => {
        logger.info(message.toAnsi());
        client.channels.fetch(channelId).then(channel => channel.send(message.toString()));
    });

    // error handling
    bot.on('kicked', error => {
        logger.warn(error);
    });
    bot.on('error', error => {
        logger.error(error);
    });
}

async function getLookingAt() {}
async function getInventory() {}

// current task (idle, farm, mine, etc?)
async function getTask() {}
async function setTask(task) {}

async function queueChat(message) {
    chatQueue.enqueue(message);
}

module.exports = {
    Task,
    login,
    queueChat
}
