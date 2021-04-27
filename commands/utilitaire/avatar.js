const Discord = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Envoie l\'avatar de la personne mentionnée ou le tien !',
    usage: '{mention}',
    guildOnly: false,
    cooldown: 5,
    aliases: ["pp", "icon", "logo"],
    execute(client, message, args) {
        const user = message.mentions.users.first() || message.guild.members.cache.find(user => user.id === args[0]) || message.author;
        const target = message.guild.members.cache.get(user.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setTitle(`Voici ta photo de profil ${user.username} :`)
                .setURL(user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setImage(user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTimestamp()
                .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }));

            message.channel.send(embed);
        }

        else {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setTitle(`Voici la photo de profil de ${user.username} :`)
                .setURL(user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setImage(user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTimestamp()
                .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }));

            message.channel.send(embed);
        }
    },
};