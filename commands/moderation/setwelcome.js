const Discord = require('discord.js');
const GuildWelcome = require('../../models/GuildWelcome.js');

module.exports = {
    name: 'setwelcome',
    description: 'Vous permet d\'activer et configurer le système de bienvenue.',
    usage: '<salon/off>',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_MESSAGES',
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        GuildWelcome.findOne({
            guildID: message.guild.id
        }, async (err, data) => {
            if (err) console.log(err);

            if (!data) {
                const newData = new GuildWelcome({
                    name: message.guild.name,
                    guildID: message.guild.id,
                    onoff: false,
                    channel: '',
                    embed: {
                        activate: false,
                        title: '',
                        thumbnail: '',
                        description: '',
                        color: '',
                        date: false,
                        image: '',
                        footer: ''
                    },
                    image: {
                        activate: false,
                        image: ''
                    },
                    texte: ''
                });

                newData.save().catch(err => console.log(err));
            }

            if (args[0].toLowerCase() === 'off' || args[0].toLowerCase() === 'remove') {
                if (data.onoff === false) {
                    return message.channel.send(new Discord.MessageEmbed()
                        .setDescription("<:icone_indisponible:824290381222117396> | Le système de bienvenue est déjà désactivé sur ce serveur.")
                        .setColor('d10000')
                    );
                } else {
                    data.onoff = false;
                    data.save();

                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`<:icone_verified:824290381435895818> | ${message.author}, le Système de Bienvenue est désormais désactivé sur ce serveur.`)
                        .setColor('14b321')
                    );
                }
            } else {
                const salon = message.mentions.channels.first() || message.guild.channels.cache.find(channel => channel.id === args[0]);

                if (!salon) {
                    return message.channel.send(new Discord.MessageEmbed()
                        .setDescription("<:icone_indisponible:824290381222117396> | Je n'ai pas pu trouver le salon mentionné.")
                        .setColor('d10000')
                    );
                }

                const embed = new Discord.MessageEmbed()
                    .setTitle("Système de Bienvenue Config \n\n")
                    .setDescription("\n\n")
                    .setColor(roleColor)
                    .setDescription(`Le salon de bienvenue sera désormais celui-ci : <#${salon.id}>, êtes vous d'accord ? Appuyez sur les réactions pour valider votre choix.`)
                    .addFields(
                        { name: "\u200b", value: "<a:animated_check:826378817680703508> - Valider la commande.", inline: true },
                        { name: "\u200b", value: "<a:animated_notcheck:826378869077573642> - Recommencer la commande.", inline: true },
                    )
                    .setFooter('Tools Système de Bienvenue', client.user.displayAvatarURL({ format: "png", dynamic: true }))
                    .setTimestamp()

                const reactionMessage = await message.channel.send(embed);

                await reactionMessage.react('826378817680703508');
                await reactionMessage.react('826378869077573642');

                const reactionFilter = (reaction, user) => ['826378817680703508', '826378869077573642'].includes(reaction.emoji.id) && (message.author.id === user.id);
                const collector = reactionMessage.createReactionCollector(reactionFilter);

                collector.on('collect', async (reaction, user) => {
                    if (reaction.emoji.id === '826378817680703508') {
                        collector.stop();

                        data.onoff = true;
                        data.channel = salon.id;
                        data.save();

                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, le Système de Bienvenue est désormais activé sur ce serveur, dans le salon <#${salon.id}>.`)
                            .setColor('14b321')
                        );
                    } else if (reaction.emoji.id === '826378869077573642') {
                        collector.stop();

                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, la commande a correctement été annulée.`)
                            .setColor('14b321')
                        );
                    }
                });
            }
        });
    },
}