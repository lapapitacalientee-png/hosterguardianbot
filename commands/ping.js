module.exports = {
    name: "ping",

    async execute(message, client) {

        const msg = await message.reply("🏓 Calculating...");

        await msg.edit(
            `🏓 Pong! Ping: ${client.ws.ping}ms`
        );

    }
};
