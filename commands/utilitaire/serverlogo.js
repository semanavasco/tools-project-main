const Discord = require('discord.js');

module.exports = {
    name: 'serverlogo',
    description: 'Envoie le logo du serveur !',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    aliases: ["serverpp", "servericon", "serverpic"],
    execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        const embed = new Discord.MessageEmbed()
            .setColor(roleColor)
            .setTitle(`Voici le logo du serveur ${message.guild.name} :`)
            .setURL(message.guild.iconURL({ format: "png", dynamic: true, size: 1024 }))
            .setImage(message.guild.iconURL({ format: "png", dynamic: true, size: 1024 }))
            .setTimestamp()
            .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }));

        message.channel.send(embed);
    },
};