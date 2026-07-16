module.exports = {

    name: "help",

    description: "Shows this message",

    async execute(message, client) {

        const commands = [...client.commands.values()]
            .sort((a, b) => a.name.localeCompare(b.name));

        const lines = commands.map(cmd => `  ${cmd.name}`);

        const content =
            "```\nNo Category:\n" +
            lines.join("\n") +
            "\n```";

        return message.channel.send(content);

    }

};
