// rcon client, used to run commands like whitelist through discord
const Rcon = require("rcon");
const conn = new Rcon(process.env.RCON_IP, process.env.RCON_PORT, process.env.RCON_PASSWORD, { tcp: true, challenge: false });

const logger = require("../logger");
let auth = false;

const { guildId, channelId } = require("../config/discord.json");
const { client } = require("../discord/bot");

conn.on('auth', function() {
  // You must wait until this event is fired before sending any commands,
  // otherwise those commands will fail.
  logger.info("RCON Authenticated");
  auth = true;
}).on('response', function(str) {
  logger.info("Response: " + str);
  client.channels.fetch(channelId).then(channel => channel.send(str));
}).on('error', function(err) {
  logger.info("Error: " + err);
}).on('end', function() {
  logger.info("Connection closed");
  auth = false;
});

function connect() {
    conn.connect();
}

async function command(command) {
    if(!auth) {
        conn.connect();
        return "need to authenticate, try again soon !!"
    }
    // send command
    conn.send(command);
}

module.exports = {
    connect,
    command
}