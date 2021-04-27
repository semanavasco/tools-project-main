const Discord = require('discord.js');

module.exports = {
    name: 'sondage',
    description: 'Crée un nouveau sondage à répondre par oui ou non.',
    usage: '<sondage>',
    guildOnly: true,
    cooldown: 5,
    permissions: 'MANAGE_MESSAGES',
    async execute(client, message, args) {
        const sondage = args.slice(0).join(' ');

        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        message.channel.send(new Discord.MessageEmbed()
            .setColor(roleColor)
            .setTitle(`:bar_chart: | Sondage`)
            .setDescription(`\u200b\n**${sondage}**`)
            .addField(`\u200b`, `<a:animated_check:826378817680703508> - Pour voter oui !\n<a:animated_notcheck:826378869077573642> - Pour voter non !`)
        ).then(envoyé => {
            envoyé.react('826378817680703508');
            envoyé.react('826378869077573642');
        });
    },
}