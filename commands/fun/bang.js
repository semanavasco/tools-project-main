const Discord = require('discord.js');

module.exports = {
    name: 'bang',
    description: 'Tire sur la personne mentionnée !',
    usage: '{mention}',
    guildOnly: false,
    cooldown: 5,
    aliases: ["shoot"],
    execute(client, message, args) {
        var mentionnedUser = message.mentions.users.first();

        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        let bang = ["https://media.discordapp.net/attachments/715949616540942366/715954781654351882/1.gif?width=450&height=254", "https://media.discordapp.net/attachments/715949616540942366/715954784175259728/2.gif?width=450&height=255", "https://media.discordapp.net/attachments/715949616540942366/715954785332887602/3.gif?width=450&height=337", "https://media.discordapp.net/attachments/715949616540942366/715954793108996166/5.gif?width=324&height=180", "https://media.discordapp.net/attachments/715949616540942366/715954794556162149/6.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/715954796909297704/4.gif?width=387&height=218", "https://media.discordapp.net/attachments/715949616540942366/715954797261357126/7.gif?width=720&height=405", "https://media.discordapp.net/attachments/715949616540942366/715954799350382662/8.gif?width=450&height=253"];

        let result = Math.floor((Math.random() * bang.length));

        if (!mentionnedUser) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`**🔫 | ${message.author.username}** tire sur **${client.user.username}** !`)
                .setImage(bang[result])
                .setTimestamp()
                .setFooter(`Bang !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`**🔫 | ${message.author.username}** tire sur **${mentionnedUser.username}** !`)
                .setImage(bang[result])
                .setTimestamp()
                .setFooter(`Bang !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        }
    },
};