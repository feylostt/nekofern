const { Client, Events, GatewayIntentBits } = require('discord.js');
const { guildId, ownerId } = require('../config/discord.json');

// make our client
const client = new Client({ intents: [GatewayIntentBits.Guilds]})

client.once(Events.ClientReady, (readyClient) => {
    console.log(`logged in to discord as ${readyClient.user.tag}`);
});

function init() {
    client.login(process.env.DISCORD_TOKEN);
}

module.exports = {
    init,
    client
}