const Discord = require('discord.js');
const GiveawaysBlacklist = require('../../models/GiveawaysBlacklist.js');

module.exports = {
    name: 'gblacklistremove',
    description: 'Retire quelqu\'un de la blacklist des giveaways !',
    usage: '<utilisateur>',
    guildOnly: true,
    cooldown: 5,
    aliases: ['gblr', 'giveawayblacklistremove'],
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
                    blacklisted: false
                });
                newData.save().catch(err => console.log(err));

                return message.channel.send(new Discord.MessageEmbed()
                    .setDescription("<:icone_indisponible:824290381222117396> | Cet utilisateur n'est pas encore dans la blacklist.")
                    .setColor('d10000')
                );
            }
            else {
                blacklisted = data.blacklisted;
            }

            if (blacklisted === false) {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription("<:icone_indisponible:824290381222117396> | Cet utilisateur n'est pas encore dans la blacklist.")
                    .setColor('d10000')
                );
            } else {
                data.blacklisted = false;
                data.save();

                message.channel.send(new Discord.MessageEmbed()
                    .setDescription("<:icone_verified:824290381435895818> | Cet utilisateur n'est désormais plus dans la blacklist.")
                    .setColor('14b321')
                );
            }
        });
    },
};