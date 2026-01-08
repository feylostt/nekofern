const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { guildId, ownerId } = require('../config/discord.json');
const token = process.env.DISCORD_TOKEN;

const fs = require("fs");
const path = require("path");

const logger = require("../logger");

// make our client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel
  ]
});

async function init() {

  // initialize events !
  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  // initialize commands
  client.commands = new Collection();
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        logger.warn(
          `The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  client.once(Events.ClientReady, (readyClient) => {
    logger.info(`logged in to discord as ${readyClient.user.tag}`);
  });

  client.on(Events.Debug, (info) => logger.debug(info));
  client.on(Events.Warn, (info) => logger.warn(info));
  client.on(Events.Error, (error) => logger.error(error));

  client.login(token);
}

module.exports = {
    init,
    client
}