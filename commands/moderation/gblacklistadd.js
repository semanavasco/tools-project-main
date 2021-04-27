const Discord = require('discord.js');
const GiveawaysBlacklist = require('../../models/GiveawaysBlacklist.js');

module.exports = {
    name: 'gblacklistadd',
    description: 'Ajoute quelqu\'un à la blacklist des giveaways !',
    usage: '<utilisateur>',
    guildOnly: true,
    cooldown: 5,
    aliases: ['gbla', 'giveawayblacklistadd'],
    permissions: 'MANAGE_GUILD',
    args: true,
    async execute(client, message, args) {
        const user = message.mentions.users.first() || message.guild.members.cache.find(user => user.id === args[0]);

        if (!user) return;

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
                    blacklisted: true
                });
                newData.save().catch(err => console.log(err));

                return message.channel.send(new Discord.MessageEmbed()
                    .setDescription("<:icone_verified:824290381435895818> | Cet utilisateur est désormais dans la blacklist.")
                    .setColor('14b321')
                );
            }
            else {
                blacklisted = data.blacklisted;
            }

            if (blacklisted === true) {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription("<:icone_indisponible:824290381222117396> | Cet utilisateur est déjà dans la blacklist.")
                    .setColor('d10000')
                );
            } else {
                data.blacklisted = true;
                data.save();

                message.channel.send(new Discord.MessageEmbed()
                    .setDescription("<:icone_verified:824290381435895818> | Cet utilisateur est désormais dans la blacklist.")
                    .setColor('14b321')
                );
            }
        });
    },
};