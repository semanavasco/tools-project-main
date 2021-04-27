const Discord = require('discord.js');
const nekoclient = require('nekos.life');
const neko = new nekoclient();

module.exports = {
    name: 'feed',
    description: 'Alimente la personne de ton choix',
    usage: '{mention}',
    guildOnly: false,
    cooldown: 5,
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        var mentionnedUser = message.mentions.users.first();

        const GIF = await neko.sfw.feed();

        if (!mentionnedUser) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`**:cookie: | ${message.author.username}** donne à manger à **${client.user.username}** !`)
                .setImage(GIF.url)
                .setTimestamp()
                .setFooter(`Feed !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`**:cookie: | ${message.author.username}** donne à manger à **${mentionnedUser.username}** !`)
                .setImage(GIF.url)
                .setTimestamp()
                .setFooter(`Feed !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        }
    }
}