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

client.once("ready", () => {
    console.log(`✅ ${client.user.tag} está en línea.`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Ping command
    if (message.content === prefix + "ping") {
        const msg = await message.reply("🏓 Calculating...");
        await msg.edit(`🏓 Pong! Ping: ${client.ws.ping}ms`);
    }

    // Setup logs command
    if (message.content.startsWith(prefix + "setuplog")) {
        const channel = message.mentions.channels.first();

        if (!channel) {
            return message.reply("❌ Mention a channel. Example: `;setuplog #logs`");
        }

        const config = JSON.parse(fs.readFileSync("./config.json"));

        config.logChannel = channel.id;

        fs.writeFileSync(
            "./config.json",
            JSON.stringify(config, null, 2)
        );

        message.reply(`✅ Log channel set: ${channel}`);
    }
});

// Deleted messages logs
client.on("messageDelete", async (message) => {
    if (!message.guild) return;

    const config = JSON.parse(fs.readFileSync("./config.json"));

    if (!config.logChannel) return;

    const logChannel = client.channels.cache.get(config.logChannel);

    if (!logChannel) return;

    logChannel.send(
        `🗑️ **Message Deleted**\n` +
        `👤 User: ${message.author}\n` +
        `📍 Channel: ${message.channel}\n` +
        `💬 Content:\n${message.content || "No content"}`
    );
});

// Edited messages logs
client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (!oldMessage.guild) return;
    if (oldMessage.content === newMessage.content) return;

    const config = JSON.parse(fs.readFileSync("./config.json"));

    if (!config.logChannel) return;

    const logChannel = client.channels.cache.get(config.logChannel);

    if (!logChannel) return;

    logChannel.send(
        `✏️ **Message Edited**\n` +
        `👤 User: ${oldMessage.author}\n` +
        `📍 Channel: ${oldMessage.channel}\n\n` +
        `**Before:**\n${oldMessage.content}\n\n` +
        `**After:**\n${newMessage.content}`
    );
});


client.login("process.env.TOKEN");
