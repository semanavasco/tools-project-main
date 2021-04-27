const Discord = require("discord.js");
const GiveawaysBlacklist = require('../../models/GiveawaysBlacklist.js');

module.exports = async (client, messageReaction, user) => {
    const message = messageReaction.message;
    const member = message.guild.members.cache.get(user.id);
    const emoji = messageReaction.emoji.name;

    GiveawaysBlacklist.findOne({
        guildID: message.guild.id,
        userID: user.id
    }, async (err, data) => {
        if (err) console.log(err);

        let blacklisted = false;

        if (!data) {
            const newData = new GiveawaysBlacklist({
                guildNAME: message.guild.name,
                guildID: message.guild.id,
                userNAME: user.username,
                userID: user.id,
                blacklisted: false
            });
            newData.save().catch(err => console.log(err));
        }
        else {
            blacklisted = data.blacklisted;
        }

        if (["🎉"].includes(emoji) && blacklisted === true && message.content.includes('GIVEAWAY')) {
            switch (emoji) {
                case "🎉":
                    const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

                    try {
                        for (const reaction of userReactions.values()) {
                            await reaction.users.remove(user.id);
                        }
                    } catch (error) {
                        return;
                    }

                    member.send(new Discord.MessageEmbed()
                        .setDescription("<:icone_indisponible:824290381222117396> | Vous ne pouvez pas rejoindre ce giveaway, car vous êtes dans la blacklist.")
                        .setColor('d10000')
                    );
                break;
            };
        };
    });
};