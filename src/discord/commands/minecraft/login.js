const {SlashCommandBuilder} = require("discord.js");
const {Task, login} = require("../../../minecraft/client");

module.exports = {
    data: new SlashCommandBuilder().setName("login").setDescription("log in to a minecraft server").addStringOption((option) => option.setName('ip').setDescription('the minecraft server\'s ip').setRequired(false)).addStringOption((option) => option.setName('port').setDescription('the minecraft server\'s port').setRequired(false)).addIntegerOption((option) => option.setName('task').setDescription('what she should do when she spawns').setRequired(false).addChoices({
        name: 'idle',
        value: Task.IDLE
    }, {
        name: 'follow',
        value: Task.FOLLOW
    }, {
        name: 'afk',
        value: Task.AFK_FARM
    },)),
    async execute(interaction) {
        let addr = interaction.options.getString('ip') || process.env.SERVER_IP;
        let port = interaction.options.getString('port') || "25565";
        let state = interaction.options.getInteger('task') || Task.IDLE;


        login(addr, port, state).then(() => {
            interaction.reply(`connecting to ${addr}:${port}`);
        });
    }
};
