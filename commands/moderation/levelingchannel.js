const Discord = require('discord.js');
const LevelingMessage = require('../../models/LevelingMessage.js');

module.exports = {
    name: 'levelingchannel',
    description: 'Vous permet de configurer votre salon de lvl up.',
    usage: '',
    guildOnly: true,
    aliases: ['levelupchannel', 'leveling-channel', 'level-up-channel', 'levelup-channel'],
    cooldown: 5,
    permissions: 'MANAGE_MESSAGES',
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        LevelingMessage.findOne({
            guildID: message.guild.id
        }, async (err, data) => {
            if (err) console.log(err);
            const embed = new Discord.MessageEmbed()
                .setTitle("Level-UP Salon Custom Config \n\n")
                .setDescription("\n\n")
                .setColor(roleColor)
                .setDescription(`Appuyez sur les réactions pour valider votre choix.`)
                .addFields(
                    { name: "\u200b", value: "<a:animated_check:826378817680703508> - Activer le Salon Custom.", inline: true },
                    { name: "\u200b", value: "<a:animated_notcheck:826378869077573642> - Desactiver le Salon Custom.", inline: true },
                )
                .setFooter('Tools Level-UP Salon Custom', client.user.displayAvatarURL({ format: "png", dynamic: true }))
                .setTimestamp()

            const reactionMessage = await message.channel.send(embed);

            await reactionMessage.react('826378817680703508');
            await reactionMessage.react('826378869077573642');

            const messageFilter = m => m.author.id === message.author.id;
            const reactionFilter = (reaction, user) => ['826378817680703508', '826378869077573642'].includes(reaction.emoji.id) && (message.author.id === user.id);
            const collector = reactionMessage.createReactionCollector(reactionFilter);

            collector.on('collect', async (reaction, user) => {
                if (reaction.emoji.id === '826378817680703508') {
                    if (data.channelActivate === true) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, le Salon Custom est déjà activé sur ce serveur.`)
                            .setColor('d10000')
                        );
                    }
                    else {
                        data.channelActivate = true;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, le Salon Custom est désormais activé sur ce serveur ! Envoyez ci-dessous l'ID du salon que vous voulez utiliser, vous avez 15 secondes.`)
                            .setColor('14b321')
                        );
                        await message.channel.awaitMessages(messageFilter, { max: 1, time: 15000 }).then(async collected => {
                            let salon = message.guild.channels.cache.find(channel => channel.id === collected.first().content) || message.guild.channels.cache.find(channel => channel.name === collected.first().content);
                            data.channel = salon.id;
                            data.save();
                            message.channel.send(new Discord.MessageEmbed()
                                .setDescription(`<:icone_verified:824290381435895818> | ${user}, le Salon Custom sera désormais : ${salon}`)
                                .setColor(`14b321`)
                            );
                        });
                    }
                } else if (reaction.emoji.id === '826378869077573642') {
                    if (data.channelActivate === false) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, le Salon Custom est déjà désactivé sur ce serveur.`)
                            .setColor('d10000')
                        );
                    }
                    else {
                        data.channelActivate = false;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, le Salon Custom est désormais désactivé sur ce serveur !`)
                            .setColor('14b321')
                        );
                    }
                }
            });
        });
    },
}