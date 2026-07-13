const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const {
    checkExpiredClaims
} = require("./utils/claims");

const {
    getLogChannel
} = require("./utils/logsConfig");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const prefix = "!";

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


// Envía un log del comando ejecutado al canal configurado
async function logCommandUsage(message, commandName, args) {

    if (!message.guild) return;

    const logChannelID = getLogChannel(message.guild.id);

    if (!logChannelID) return;

    try {

        const logChannel = await message.guild.channels.fetch(logChannelID);

        if (!logChannel) return;

        const embed = new EmbedBuilder()

            .setColor("Grey")

            .setTitle("📝 Command Used")

            .addFields(

                {
                    name: "👤 User",
                    value: `${message.author} (${message.author.tag})`,
                    inline: false
                },

                {
                    name: "⚙️ Command",
                    value: `\`${prefix}${commandName}\``,
                    inline: true
                },

                {
                    name: "📍 Channel",
                    value: `${message.channel}`,
                    inline: true
                }

            )

            .setTimestamp();

        if (args.length > 0) {

            embed.addFields({
                name: "📄 Arguments",
                value: `\`${args.join(" ").slice(0, 1000)}\``,
                inline: false
            });

        }

        await logChannel.send({ embeds: [embed] }).catch(() => {});

    } catch (err) {
        console.log("Could not send command log:", err.message);
    }

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


    if (!command) {
        return message.reply("```\nError: try with !help\n```");
    }


    try {

        await command.execute(
            message,
            client,
            args
        );

        // Registra el uso del comando (no bloquea si falla)
        logCommandUsage(message, commandName, args);

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

    setInterval(() => {
        checkExpiredClaims(client);
    }, 60 * 1000); // revisa cada 1 minuto

});



client.login(process.env.DISCORD_TOKEN);
