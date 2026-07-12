const fs = require("fs");
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const prefix = ";";

function getConfig() {
    return JSON.parse(fs.readFileSync("./config.json", "utf8"));
}

function saveConfig(config) {
    fs.writeFileSync(
        "./config.json",
        JSON.stringify(config, null, 2)
    );
}

client.once("ready", () => {
    console.log(`✅ ${client.user.tag} está en línea.`);
});


client.on("messageCreate", async (message) => {
    if (message.author.bot) return;


    // Ping command
    if (message.content === prefix + "ping") {
        const msg = await message.reply("🏓 Calculating...");

        await msg.edit(
            `🏓 Pong! Ping: ${client.ws.ping}ms`
        );
    }


    // Setup log command
    if (message.content.startsWith(prefix + "setuplog")) {

        const channel = message.mentions.channels.first();

        if (!channel) {
            return message.reply(
                "❌ Mention a channel. Example: `;setuplog #logs`"
            );
        }


        const config = getConfig();

        config.logChannel = channel.id;

        saveConfig(config);


        message.reply(
            `✅ Log channel set: ${channel}`
        );
    }
});



// Deleted messages log
client.on("messageDelete", async (message) => {

    if (!message.guild) return;

    const config = getConfig();

    if (!config.logChannel) return;


    const logChannel = client.channels.cache.get(
        config.logChannel
    );

    if (!logChannel) return;


    logChannel.send(
        `🗑️ **Message Deleted**\n\n` +
        `👤 User: ${message.author || "Unknown"}\n` +
        `📍 Channel: ${message.channel}\n` +
        `💬 Content:\n${message.content || "No content"}`
    );
});




// Edited messages log
client.on("messageUpdate", async (oldMessage, newMessage) => {

    if (!oldMessage.guild) return;

    if (oldMessage.content === newMessage.content) return;


    const config = getConfig();

    if (!config.logChannel) return;


    const logChannel = client.channels.cache.get(
        config.logChannel
    );

    if (!logChannel) return;


    logChannel.send(
        `✏️ **Message Edited**\n\n` +
        `👤 User: ${oldMessage.author || "Unknown"}\n` +
        `📍 Channel: ${oldMessage.channel}\n\n` +
        `**Before:**\n${oldMessage.content || "No content"}\n\n` +
        `**After:**\n${newMessage.content || "No content"}`
    );
});



// Login
client.login(process.env.TOKEN);
