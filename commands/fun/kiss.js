const Discord = require('discord.js');

module.exports = {
    name: 'kiss',
    description: 'Fais un bisous à la personne de ton choix !',
    usage: '{mention}',
    guildOnly: false,
    cooldown: 5,
    aliases: ["bisous", "bizz"],
    execute(client, message, args) {
        var mentionnedUser = message.mentions.users.first();

        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        let réponses = ["https://media.discordapp.net/attachments/715949616540942366/716054693033541703/10.gif?width=450&height=243", "https://media.discordapp.net/attachments/715949616540942366/716054695814234122/1.gif?width=448&height=250", "https://media.discordapp.net/attachments/715949616540942366/716054696460025989/3.gif?width=450&height=246", "https://media.discordapp.net/attachments/715949616540942366/716054696736981012/2.gif?width=360&height=202", "https://media.discordapp.net/attachments/715949616540942366/716054696976187473/4.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/716054699324997702/5.gif?width=439&height=247", "https://media.discordapp.net/attachments/715949616540942366/716054700730089482/6.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/716054700784484412/7.gif?width=198&height=156", "https://media.discordapp.net/attachments/715949616540942366/716054703166849135/8.gif?width=450&height=252", "https://media.discordapp.net/attachments/715949616540942366/716054705985421312/9.gif?width=448&height=250", "https://media.discordapp.net/attachments/715949616540942366/716055624240332800/image0.gif?width=450&height=247", "https://media.discordapp.net/attachments/715949616540942366/716055625368469515/image2.gif?width=486&height=274", "https://media.discordapp.net/attachments/715949616540942366/716055626463051826/image3.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/716055626811441232/image4.gif?width=319&height=178", "https://media.discordapp.net/attachments/715949616540942366/716055627394318396/image5.gif?width=486&height=274", "https://media.discordapp.net/attachments/715949616540942366/716055627725799474/image6.gif?width=486&height=274", "https://media.discordapp.net/attachments/715949616540942366/716058239627952198/image0.gif?width=406&height=225", "https://media.discordapp.net/attachments/715949616540942366/716058241116799096/image1.gif?width=374&height=202", "https://media.discordapp.net/attachments/715949616540942366/716058241800470598/image2.gif?width=486&height=276"];

        let résultat = Math.floor((Math.random() * réponses.length));

        if (!mentionnedUser) {

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`😘 | Awn ! **${message.author.username}** fait un bisous à **${client.user.username}** !`)
                .setImage(réponses[résultat])
                .setTimestamp()
                .setFooter(`Kiss !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        } else {

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`😘 | Awn ! **${message.author.username}** fait un bisous à **${mentionnedUser.username}** !`)
                .setImage(réponses[résultat])
                .setTimestamp()
                .setFooter(`Kiss !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        }
    },
};