// created for fun for my private minecraft server :3
const { startup } = require("./minecraft/client");
const { init } = require("./discord/bot")

const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 8000;

const app = express();
app.use(cors());

startup(); // run the mineflayer bot :3
init(); // run the discord bot :3

app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<p>hi :3</p>");
    res.end();
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});