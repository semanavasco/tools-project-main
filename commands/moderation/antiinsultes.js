const Discord = require('discord.js');
const GuildOptions = require('../../models/GuildOptions.js');

module.exports = {
    name: 'antiinsults',
    description: 'Active ou désactive l\'Anti-Insultes !',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    aliases: ['anti-insults', 'antiinsultes', 'anti-insultes'],
    permissions: 'MANAGE_GUILD',
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        GuildOptions.findOne({
            guildID: message.guild.id
        }, async (err, data) => {
            if (err) console.log(err);
            const embed = new Discord.MessageEmbed()
                .setTitle("Anti-Insultes Config \n\n")
                .setDescription("\n\n")
                .setColor(roleColor)
                .setDescription(`Appuyez sur les réactions pour valider votre choix.`)
                .addFields(
                    { name: "\u200b", value: "<a:animated_check:826378817680703508> - Activer l'Anti-Insultes.", inline: true },
                    { name: "\u200b", value: "<a:animated_notcheck:826378869077573642> - Desactiver l'Anti-Insultes.", inline: true },
                )
                .setFooter('Tools Anti-Insultes', client.user.avatarURL())
                .setTimestamp()

            const reactionMessage = await message.channel.send(embed);

            await reactionMessage.react('826378817680703508');
            await reactionMessage.react('826378869077573642');

            const reactionFilter = (reaction, user) => ['826378817680703508', '826378869077573642'].includes(reaction.emoji.id) && (message.author.id === user.id);
            const collector = reactionMessage.createReactionCollector(reactionFilter);

            collector.on('collect', (reaction, user) => {
                if (reaction.emoji.id === '826378817680703508') {
                    if (data.AntiInsults === true) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, l'Anti-Insultes est déjà activé sur ce serveur.`)
                            .setColor('d10000')
                        );
                    }
                    else {
                        data.AntiInsults = true;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, l'Anti-Insultes est désormais activé sur ce serveur !`)
                            .setColor('14b321')
                        );
                    }
                } else if (reaction.emoji.id === '826378869077573642') {
                    if (data.AntiInsults === false) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, l'Anti-Insultes est déjà désactivé sur ce serveur.`)
                            .setColor('d10000')
                        );
                    }
                    else {
                        data.AntiInsults = false;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, l'Anti-Insultes est désormais désactivé sur ce serveur !`)
                            .setColor('14b321')
                        );
                    }
                }
            });
        });
    },
};