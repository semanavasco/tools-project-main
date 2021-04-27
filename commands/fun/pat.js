const Discord = require('discord.js');

module.exports = {
    name: 'pat',
    description: 'Fais un pat pat à la personne de ton choix !',
    usage: '{mention}',
    guildOnly: false,
    cooldown: 5,
    aliases: ["caresse"],
    execute(client, message, args) {
        var mentionnedUser = message.mentions.users.first();

        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        let réponses = ["https://media.discordapp.net/attachments/715949616540942366/716059311494791268/1.gif?width=461&height=259", "https://media.discordapp.net/attachments/715949616540942366/716059328183926794/2.gif?width=432&height=263", "https://media.discordapp.net/attachments/715949616540942366/716059348928954448/3.gif?width=329&height=322", "https://media.discordapp.net/attachments/715949616540942366/716059360626868284/4.gif?width=198&height=148", "https://media.discordapp.net/attachments/715949616540942366/716059372182175816/5.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/716059383154475168/6.gif?width=428&height=180", "https://media.discordapp.net/attachments/715949616540942366/716059397427560499/7.gif?width=432&height=243", "https://media.discordapp.net/attachments/715949616540942366/716059422920802314/8.gif?width=414&height=310", "https://media.discordapp.net/attachments/715949616540942366/716059426510995566/9.gif?width=486&height=274", "https://media.discordapp.net/attachments/715949616540942366/716059437701398548/10.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/716059452096380958/11.gif?width=360&height=180", "https://media.discordapp.net/attachments/715949616540942366/716059468881985536/12.gif?width=450&height=252", "https://media.discordapp.net/attachments/715949616540942366/716059482777583626/13.gif?width=400&height=225", "https://media.discordapp.net/attachments/715949616540942366/716059504273391707/14.gif?width=486&height=274", "https://media.discordapp.net/attachments/715949616540942366/716059512108351509/15.gif?width=540&height=229"];

        let résultat = Math.floor((Math.random() * réponses.length));

        if (!mentionnedUser) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`😊 | Awn ! **${message.author.username}** fait un pat pat à **${client.user.username}** !`)
                .setImage(réponses[résultat])
                .setTimestamp()
                .setFooter(`Pat !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });

        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`😊 | Awn ! **${message.author.username}** fait un pat pat à **${mentionnedUser.username}** !`)
                .setImage(réponses[résultat])
                .setTimestamp()
                .setFooter(`Pat !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        }
    },
};