const Discord = require('discord.js');

module.exports = {
    name: 'emojis',
    description: 'Envoie les emojis sur le serveur !',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    aliases: ["emoji-list"],
    execute(client, message, args) {
        const roleColor = message.guild.members.cache.get(message.author.id).displayHexColor === "#000000" ? "#ffffff" : message.guild.members.cache.get(message.author.id).displayHexColor;
        const emojis = message.guild.emojis.cache;

        let Emojis = "";
        let AnimatedEmojis = "";
        let EmojiCount = 0;
        let Animated = 0;

        emojis.forEach(emoji => {
            if (emoji.animated) {
                Animated++;
                AnimatedEmojis += `<a:${emoji.name.toLowerCase()}:${emoji.id}>`;
            } else {
                EmojiCount++;
                Emojis += `<:${emoji.name.toLowerCase()}:${emoji.id}>`;
            }
        });

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Total d'Emojis [${emojis.size}]`)
            .setColor(roleColor)
            .setDescription(`**Emojis [${EmojiCount}] :**\n${Emojis}\n\n**Emojis Animés [${Animated}] :**\n${AnimatedEmojis}`)
            .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
            .setTimestamp()

        message.channel.send(embed);
    },
};