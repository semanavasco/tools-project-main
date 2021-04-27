const Discord = require('discord.js');
const GuildLogs = require('../../models/GuildLogs.js');

module.exports = {
    name: 'logs',
    description: 'Permets d\'activer ou désactiver les logs.',
    usage: '<guild/user> <on/off>',
    guildOnly: true,
    cooldown: 5,
    aliases: ["log"],
    permissions: 'MANAGE_GUILD',
    execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        GuildLogs.findOne({
            guildID: message.guild.id
        }, async (err, data) => {
            if (err) console.log(err);
            if (!data) {
                const newData = new GuildLogs({
                    name: message.guild.name,
                    guildID: message.guild.id,
                    logsChannel: '',
                    guildLogs: false,
                    userLogs: false
                });
                newData.save().catch(err => console.log(err));
            }

            const embed = new Discord.MessageEmbed()
                .setTitle("Logs Config \n\n")
                .setDescription("\n\n")
                .setColor(roleColor)
                .setDescription(`Appuyez sur les réactions pour valider votre choix.`)
                .addFields(
                    { name: "\u200b", value: "<:icone_textchannel:824290380924452914> - Choisir un Salon pour les Logs", inline: true },
                    { name: "\u200b", value: "<:icone_rpc:824290384153673760> - Activer/Désactiver les Logs du Serveur", inline: true },
                    { name: "\u200b", value: "<:icone_role:824290384204660806> - Activer/Désactiver les Logs d'Utilisateur", inline: true },
                )
                .setFooter('Tools Logs', client.user.avatarURL())
                .setTimestamp()

            const reactionMessage = await message.channel.send(embed);

            await reactionMessage.react('824290380924452914');
            await reactionMessage.react('824290384153673760');
            await reactionMessage.react('824290384204660806');

            const messageFilter = m => m.author.id === message.author.id;
            const reactionFilter = (reaction, user) => ['824290380924452914', '824290384153673760', '824290384204660806'].includes(reaction.emoji.id) && (message.author.id === user.id);
            const collector = reactionMessage.createReactionCollector(reactionFilter);

            collector.on('collect', async (reaction, user) => {
                if (reaction.emoji.id === '824290380924452914') {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`<:icone_verified:824290381435895818> | ${user}, envoyez ci-dessous l'ID du Salon que vous désirez utiliser pour les Logs. Vous avez 15 secondes.`)
                        .setColor('14b321')
                    );
                    await message.channel.awaitMessages(messageFilter, { max: 1, time: 15000 }).then(async collected => {
                        let salon = message.guild.channels.cache.find(channel => channel.id === collected.first().content) || message.guild.channels.cache.find(channel => channel.name === collected.first().content);
                        data.logsChannel = salon.id;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, le Salon pour les Logs sera désormais : ${salon}`)
                            .setColor(`14b321`)
                        );
                    });
                } else if (reaction.emoji.id === '824290384153673760') {
                    if (data.guildLogs === false) {
                        data.guildLogs = true;
                        data.save();
                        return message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, les logs du serveur ont correctement été activés !`)
                            .setColor('14b321')
                        );
                    }
                    else {
                        data.guildLogs = false;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, les logs du serveur ont correctement été désactivés !`)
                            .setColor('14b321')
                        );
                    }
                } else if (reaction.emoji.id === '824290384204660806') {
                    if (data.userLogs === false) {
                        data.userLogs = true;
                        data.save();
                        return message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, les logs des utilisateurs ont correctement été activés !`)
                            .setColor('14b321')
                        );
                    }
                    else {
                        data.userLogs = false;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, les logs des utilisateurs ont correctement été désactivés !`)
                            .setColor('14b321')
                        );
                    }
                }
            });
        });
    },
}