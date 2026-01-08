// created for fun for my private minecraft server :3
// const { startup } = require("./minecraft/client");
const { init } = require("./discord/bot")
const { connect } = require("./minecraft/rcon")

const express = require('express');
const cors = require('cors');

const logger = require('./logger');

const port = process.env.PORT || 8000;

const app = express();
app.use(cors());

// startup(); // run the mineflayer bot :3
init(); // run the discord bot :3
connect(); // connect to rcon :3

app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<p>hi :3</p>");
    res.end();
});

app.listen(port, () => {
    logger.info(`listening on port ${port}`);
});
