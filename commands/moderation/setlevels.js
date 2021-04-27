const Discord = require('discord.js');
const LevelingMessage = require('../../models/LevelingMessage.js');

module.exports = {
    name: 'setlevels',
    description: 'Vous permet d\'activer ou désactiver le système d\'XP.',
    usage: '',
    guildOnly: true,
    aliases: ['setlevel', 'levelssetup', 'levels-setup', 'setup-levels'],
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
                .setTitle("Système de Levels Config \n\n")
                .setDescription("\n\n")
                .setColor(roleColor)
                .setDescription(`Appuyez sur les réactions pour valider votre choix.`)
                .addFields(
                    { name: "\u200b", value: "<a:animated_check:826378817680703508> - Activer le Système de Levels.", inline: true },
                    { name: "\u200b", value: "<a:animated_notcheck:826378869077573642> - Desactiver le Système de Levels.", inline: true },
                )
                .setFooter('Tools Système de Levels', client.user.displayAvatarURL({ format: "png", dynamic: true }))
                .setTimestamp()

            const reactionMessage = await message.channel.send(embed);

            await reactionMessage.react('826378817680703508');
            await reactionMessage.react('826378869077573642');

            const reactionFilter = (reaction, user) => ['826378817680703508', '826378869077573642'].includes(reaction.emoji.id) && (message.author.id === user.id);
            const collector = reactionMessage.createReactionCollector(reactionFilter);

            collector.on('collect', async (reaction, user) => {
                if (reaction.emoji.id === '826378817680703508') {
                    if (data.onoff === true) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, le Système de Levels est déjà activé sur ce serveur.`)
                            .setColor('d10000')
                        );
                    }
                    else {
                        data.onoff = true;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, le Système de Levels est désormais activé sur ce serveur.`)
                            .setColor('14b321')
                        );
                    }
                } else if (reaction.emoji.id === '826378869077573642') {
                    if (data.onoff === false) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, le Système de Levels est déjà désactivé sur ce serveur.`)
                            .setColor('d10000')
                        );
                    }
                    else {
                        data.onoff = false;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, le Système de Levels est désormais désactivé sur ce serveur !`)
                            .setColor('14b321')
                        );
                    }
                }
            });
        });
    },
}