const {
    EmbedBuilder
} = require("discord.js");

function daysAgo(date) {

    const diffMs = Date.now() - date.getTime();

    return Math.floor(diffMs / (1000 * 60 * 60 * 24));

}

function calculateRiskScore(target, accountAgeDays, joinGapHours) {

    let score = 0;
    const reasons = [];

    // Account age
    if (accountAgeDays < 1) {
        score += 40;
        reasons.push("Account created less than 1 day ago");
    } else if (accountAgeDays < 3) {
        score += 25;
        reasons.push("Account created less than 3 days ago");
    } else if (accountAgeDays < 7) {
        score += 15;
        reasons.push("Account created less than 7 days ago");
    } else if (accountAgeDays < 30) {
        score += 5;
        reasons.push("Account created less than 30 days ago");
    }

    // Default avatar (never set a custom profile picture)
    if (!target.user.avatar) {
        score += 20;
        reasons.push("No custom avatar set");
    }

    // No roles beyond @everyone
    if (target.roles.cache.size <= 1) {
        score += 10;
        reasons.push("No roles assigned");
    }

    // Joined the server almost immediately after creating the account
    if (joinGapHours !== null && joinGapHours < 24) {
        score += 15;
        reasons.push("Joined this server within 24 hours of account creation");
    }

    return {
        score: Math.min(score, 100),
        reasons
    };

}

function riskLabel(score) {

    if (score <= 20) return { emoji: "🟢", label: "Low Risk", color: "Green" };
    if (score <= 50) return { emoji: "🟡", label: "Medium Risk", color: "Yellow" };
    if (score <= 75) return { emoji: "🟠", label: "High Risk", color: "Orange" };
    return { emoji: "🔴", label: "Critical Risk", color: "Red" };

}

module.exports = {

    name: "verify",

    description: "Check a user's public account info and estimated alt/raid risk.",

    async execute(message) {

        const target = message.mentions.members.first() || message.member;

        // Fetches full user data to get banner/accent color, which aren't always cached
        const fullUser = await target.user.fetch().catch(() => target.user);

        const accountCreated = fullUser.createdAt;
        const accountAgeDays = daysAgo(accountCreated);
        const accountCreatedUnix = Math.floor(accountCreated.getTime() / 1000);

        const joinedAt = target.joinedAt;
        const serverAgeDays = joinedAt ? daysAgo(joinedAt) : null;
        const joinedUnix = joinedAt ? Math.floor(joinedAt.getTime() / 1000) : null;

        const joinGapHours = joinedAt
            ? Math.floor((joinedAt.getTime() - accountCreated.getTime()) / (1000 * 60 * 60))
            : null;

        const badges = fullUser.flags?.toArray().join(", ") || "None";

        const roles = target.roles.cache
            .filter(r => r.name !== "@everyone")
            .map(r => r.toString())
            .join(", ") || "None";

        const boosting = target.premiumSinceTimestamp
            ? `Since <t:${Math.floor(target.premiumSinceTimestamp / 1000)}:D>`
            : "Not boosting";

        const { score, reasons } = calculateRiskScore(target, accountAgeDays, joinGapHours);
        const risk = riskLabel(score);

        const embed = new EmbedBuilder()

            .setColor(risk.color)

            .setTitle(`${fullUser.username}'s Account Info`)

            .setThumbnail(fullUser.displayAvatarURL())

            .addFields(

                {
                    name: "Account Created",
                    value: `<t:${accountCreatedUnix}:F>\n(${accountAgeDays} days ago)`,
                    inline: false
                },

                {
                    name: "Joined This Server",
                    value: joinedUnix
                        ? `<t:${joinedUnix}:F>\n(${serverAgeDays} days ago)`
                        : "Unknown",
                    inline: false
                },

                {
                    name: "Nickname",
                    value: target.nickname || "None set",
                    inline: true
                },

                {
                    name: "Bot Account",
                    value: fullUser.bot ? "Yes" : "No",
                    inline: true
                },

                {
                    name: "Server Boosting",
                    value: boosting,
                    inline: true
                },

                {
                    name: "Badges",
                    value: badges,
                    inline: false
                },

                {
                    name: "Roles",
                    value: roles,
                    inline: false
                },

                {
                    name: `${risk.emoji} Estimated Risk: ${score}% (${risk.label})`,
                    value: reasons.length > 0
                        ? reasons.map(r => `• ${r}`).join("\n")
                        : "No risk indicators detected.",
                    inline: false
                }

            )

            .setFooter({
                text: `Checked by ${message.author.tag} • This is a heuristic estimate, not a definitive judgment`
            })

            .setTimestamp();

        if (fullUser.banner) {

            embed.setImage(fullUser.bannerURL({ size: 512 }));

        }

        return message.channel.send({
            embeds: [embed]
        });

    }

};
  
