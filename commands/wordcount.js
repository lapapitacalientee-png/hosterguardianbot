const {
    EmbedBuilder,
    ChannelType
} = require("discord.js");

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const CONCURRENCY = 5;
const CACHE_TTL_MS = 5 * 60 * 1000;

// Caches recent results so repeating the same search doesn't rescan everything
const resultCache = new Map();

async function scanChannel(channel, regex, perChannelLimit) {

    let lastId = null;
    let count = 0;
    let messagesScanned = 0;

    while (messagesScanned < perChannelLimit) {

        const fetchOptions = { limit: Math.min(100, perChannelLimit - messagesScanned) };

        if (lastId) fetchOptions.before = lastId;

        const batch = await channel.messages.fetch(fetchOptions).catch(() => null);

        if (!batch || batch.size === 0) break;

        for (const msg of batch.values()) {

            const matches = msg.content.match(regex);

            if (matches) count += matches.length;

        }

        messagesScanned += batch.size;
        lastId = batch.last().id;

        if (batch.size < 100) break;

    }

    return { count, messagesScanned };

}

// Runs channel scans in parallel batches instead of one at a time
async function scanChannelsInParallel(channels, regex, perChannelLimit, onProgress) {

    let totalCount = 0;
    let totalMessagesScanned = 0;
    let channelsScanned = 0;

    const queue = [...channels];

    async function worker() {

        while (queue.length > 0) {

            const channel = queue.shift();

            if (!channel) break;

            const { count, messagesScanned } = await scanChannel(channel, regex, perChannelLimit);

            totalCount += count;
            totalMessagesScanned += messagesScanned;
            channelsScanned++;

            onProgress(channelsScanned, totalMessagesScanned);

        }

    }

    const workers = Array.from({ length: CONCURRENCY }, () => worker());

    await Promise.all(workers);

    return { totalCount, totalMessagesScanned, channelsScanned };

}

module.exports = {

    name: "wordcount",

    description: "Count how many times a word was used across the whole server.",

    async execute(message, client, args) {

        if (!args[0]) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage: `!wordcount <word> [messages per channel]`\n\n" +
                            "Default: 200 messages per channel. Max: 1000 per channel.\n\n" +
                            "Example:\n`!wordcount claim 500`"
                        )
                ]
            });

        }

        const word = args[0].toLowerCase();
        const perChannelLimit = Math.min(parseInt(args[1], 10) || 200, 1000);

        const cacheKey = `${message.guild.id}_${word}_${perChannelLimit}`;
        const cached = resultCache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {

            const cachedEmbed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("🔎 Word Count Result (cached)")
                .setDescription(
                    `The word **"${word}"** was used **${cached.totalCount}** time(s)\n` +
                    `across **${cached.channelsScanned}** channels (${cached.totalMessagesScanned} messages scanned).`
                )
                .setFooter({
                    text: `Searched by ${message.author.tag} • Cached result, run again in a few minutes for a fresh scan`
                })
                .setTimestamp();

            return message.channel.send({ embeds: [cachedEmbed] });

        }

        const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, "gi");

        const textChannels = [...message.guild.channels.cache.filter(c =>
            c.type === ChannelType.GuildText &&
            c.permissionsFor(message.guild.members.me).has(["ViewChannel", "ReadMessageHistory"])
        ).values()];

        const loadingEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("🔎 Searching...")
            .setDescription(`Scanning **${textChannels.length}** channels for **"${word}"** (${CONCURRENCY} at a time)...`);

        const statusMessage = await message.channel.send({ embeds: [loadingEmbed] });

        let result;

        try {

            let lastEdit = 0;

            result = await scanChannelsInParallel(textChannels, regex, perChannelLimit, (channelsScanned, messagesScanned) => {

                // Throttles progress edits so we don't hit Discord's rate limit
                const now = Date.now();

                if (now - lastEdit > 2000) {

                    lastEdit = now;

                    const progressEmbed = new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle("🔎 Searching...")
                        .setDescription(
                            `Scanned **${channelsScanned}/${textChannels.length}** channels ` +
                            `(${messagesScanned} messages so far) for **"${word}"**...`
                        );

                    statusMessage.edit({ embeds: [progressEmbed] }).catch(() => {});

                }

            });

        } catch (error) {

            console.log("Wordcount error:", error);

            return statusMessage.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Search Error")
                        .setDescription("Something went wrong while scanning the server.")
                ]
            });

        }

        resultCache.set(cacheKey, { ...result, timestamp: Date.now() });

        const resultEmbed = new EmbedBuilder()

            .setColor("Green")

            .setTitle("🔎 Word Count Result")

            .setDescription(
                `The word **"${word}"** was used **${result.totalCount}** time(s)\n` +
                `across **${result.channelsScanned}** channels (${result.totalMessagesScanned} messages scanned).`
            )

            .setFooter({
                text: `Searched by ${message.author.tag}`
            })

            .setTimestamp();

        return statusMessage.edit({ embeds: [resultEmbed] });

    }

};

