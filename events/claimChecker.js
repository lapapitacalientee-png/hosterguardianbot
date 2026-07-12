const { EmbedBuilder } = require("discord.js");
const { getClaims, saveClaims } = require("../utils/claims");


module.exports = (client) => {


    setInterval(async () => {


        const claims = getClaims();


        if (!claims.length) return;



        const expiredClaims = claims.filter(
            claim => claim.expires <= Date.now()
        );



        if (!expiredClaims.length) return;



        for (const claim of expiredClaims) {


            try {

                const channel = await client.channels.fetch(
                    claim.channelId
                );


                if (channel) {

                    const message = await channel.messages.fetch(
                        claim.messageId
                    ).catch(() => null);


                    if (message) {

                        await message.delete()
                            .catch(() => {});

                    }

                }



                const user = await client.users.fetch(
                    claim.userId
                ).catch(() => null);



                if (user) {


                    const embed = new EmbedBuilder()

                    .setTitle("🗑️ Claim Removed")

                    .setColor("Orange")

                    .setDescription(
                        "Your hosting claim has expired and was removed automatically."
                    )

                    .addFields(
                        {
                            name: "🎮 Hosting",
                            value: claim.reason || "Unknown"
                        },
                        {
                            name: "⏳ Status",
                            value: "Expired"
                        }
                    )

                    .setTimestamp()

                    .setFooter({
                        text: "HosterGuardian Claims"
                    });



                    user.send({

                        embeds: [embed]

                    }).catch(() => {});

                }


            } catch (error) {

                console.log(
                    "Claim checker error:",
                    error
                );

            }


        }



        const remainingClaims = claims.filter(
            claim => claim.expires > Date.now()
        );



        saveClaims(
            remainingClaims
        );



    }, 60 * 1000);


};
