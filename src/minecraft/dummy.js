// does literally nothing but log on and log chat

const mineflayer = require('mineflayer'); // bot api

const logger = require('../logger');

// connect to my lil server :3c
const bot = mineflayer.createBot({
    host: process.env.SERVER_IP,
    auth: "microsoft",
    version: "1.21.8"
});

bot.once('spawn', () => {
    logger.info(`logged in to minecraft as ${bot.username}`);
});

bot.on('message', (message) => {
    logger.info(message.toAnsi());
});

function startup() {}

// error handling
bot.on('kicked', error => {
    logger.warn(error);
});
bot.on('error', error => {
    logger.error(error);
});