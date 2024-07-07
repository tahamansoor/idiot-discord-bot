const { Client, GatewayIntentBits } = require('discord.js');
const { generate } = require('./ai-service.js');
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// give permission to send reply
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.guilds.cache.forEach(guild => {
        guild.commands.create({
            name: 'ask',
            description: 'Replies with answer to your question',
            options: [
                {
                    name: 'q',
                    description: 'The question you want to ask',
                    type: 3,
                    required: true,
                },
            ],
        });
    });
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'ask') {
        const question = options.getString('q');

        await interaction.deferReply();

        try {
            const res = await generate(question);

            // Send the actual response
            await interaction.followUp(res.response);
        } catch (error) {
            console.error('Error generating response:', error);
            await interaction.followUp('There was an error processing your request.');
        }
    }
});

client.on('messageCreate', async message => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Ignore messages that don't mention the bot
    if (!message.mentions.has(client.user)) return;

    console.log('metioned')

    // come up with good line when someone metions you in chat
    const res = await generate(`someone mentioned you in chat. a short witty reply. don't use quotes. be more like human altough you are not`)
    try {
        message.reply(res.response);
    } catch {
        message.reply('There was an error processing your request.');

    }

})

client.login(process.env.BOT_TOKEN);
