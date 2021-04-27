const Discord = require('discord.js');
const nekoclient = require('nekos.life');
const neko = new nekoclient();

module.exports = {
    name: 'poke',
    description: 'Embête la personne de ton choix !',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        const GIF = await neko.sfw.poke();

        var mentionnedUser = message.mentions.users.first();

        if (!mentionnedUser) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`**:stuck_out_tongue_closed_eyes: | ${message.author.username}** embête **${client.user.username}** !`)
                .setImage(GIF.url)
                .setTimestamp()
                .setFooter(`Poke !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`**:stuck_out_tongue_closed_eyes: | ${message.author.username}** embête **${mentionnedUser.username}** !`)
                .setImage(GIF.url)
                .setTimestamp()
                .setFooter(`Poke !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        }
    }
}