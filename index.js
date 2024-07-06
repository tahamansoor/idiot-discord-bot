const { Client, Events, GatewayIntentBits } = require('discord.js');
const {generate, init} = require('./ai-service.js')
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// give permission to send reply
client.on('ready', () => {
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

init()
client.on('interactionCreate', async (interaction) => {
    console.log(interaction)
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'ask') {
        console.log(options)
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

client.login(process.env.BOT_TOKEN);
