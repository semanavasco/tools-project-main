const Discord = require('discord.js');
const nekoclient = require('nekos.life');
const neko = new nekoclient();

module.exports = {
    name: 'smug',
    description: 'Montre aux personnes que tu souris !',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        const GIF = await neko.sfw.smug();

        const embed = new Discord.MessageEmbed()
            .setColor(roleColor)
            .setTitle(`Clique ici si l'imagine ne charge pas !`)
            .setURL(GIF.url)
            .setImage(GIF.url)
            .setTimestamp()
            .setFooter(`Smug | Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        message.channel.send(embed);
    }
}