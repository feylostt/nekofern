const {Events} = require("discord.js");
const logger = require("../../logger");

const { guildId, channelId, microblogId, ownerId } = require("../../config/discord.json");
const { command } = require("../../minecraft/rcon")

const { queueChat } = require("../../minecraft/client");


async function formatPost(post, time) {
    
}

module.exports = {
    name: Events.MessageCreate,
    execute: async function (message) {
        if (message.author.bot) {
            return;
        }

        // check for permissions
        if (message.author.id === ownerId) { // make sure its me :3
            // check channel
            if(message.channelId == channelId) {
                if (message.content.startsWith("rcon ")) {
                    let cmd = message.content.slice(5);
                    command(cmd);
                } else {
                    queueChat(message.content);
                }
            } else if(message.channelId == microblogId) {
                await formatPost(message.content, message.createdAt);
            }
        }
    }
}
