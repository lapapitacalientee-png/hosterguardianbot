module.exports = {

    name: "help",

    description: "Shows this message",

    async execute(message, client) {

        const commands = [...client.commands.values()]
            .sort((a, b) => a.name.localeCompare(b.name));

        const longestName = Math.max(
            ...commands.map(cmd => cmd.name.length)
        );

        const lines = commands.map(cmd => {

            const padding = " ".repeat(longestName - cmd.name.length + 2);

            return `  ${cmd.name}${padding}${cmd.description || ""}`;

        });

        const content =
            "```\nNo Category:\n" +
            lines.join("\n") +
            "\n```";

        return message.channel.send(content);

    }

};
