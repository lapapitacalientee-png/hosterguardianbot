const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const prefix = ";";

client.commands = new Map();


// Load commands
const commandFiles = fs.readdirSync("./commands");

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);

}


// Load events
const eventFiles = fs.readdirSync("./events");

for (const file of eventFiles) {

    const event = require(`./events/${file}`);

    event(client);

}


// Command handler
client.on("messageCreate", async (message) => {

    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;


    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/);


    const commandName = args.shift().toLowerCase();


    const command = client.commands.get(commandName);


    if (!command) return;


    try {

        await command.execute(
            message,
            client,
            args
        );

    } catch (error) {

        console.log(error);

        message.reply(
            "❌ An error occurred while executing this command."
        );

    }

});



client.once("ready", () => {

    console.log(
        `✅ ${client.user.tag} is online.`
    );

});



client.login(process.env.DISCORD_TOKEN);
