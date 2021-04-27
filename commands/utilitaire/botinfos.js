const Discord = require('discord.js');

module.exports = {
    name: 'botinfos',
    description: 'Envoie les infos du bot !',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    aliases: ['bot-infos', 'bi'],
    execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        const embed = new Discord.MessageEmbed()
            .setColor(roleColor)
            .setTitle(`Informations - ${client.user.username}`)
            .addField(`<:icone_couronne:824290382614626354> - Owner`, `407994417601970178`, true)
            .addField(`<:icone_discovery:824290381826097222> - Serveurs Sécurisés`, `${client.guilds.cache.size}`, true)
            .addField(`<:icone_role:824290384204660806> - Membres Protégés`, `${client.users.cache.size}`, true)
            .addField(`<:icone_textchannel:824290380924452914> - Salons Surveillés`, `${client.channels.cache.size}`, true)
            .addField(`<:icone_krisp:824290384162717707> - Ping du Bot`, `${Math.round(client.ws.ping)}`, true)
            .addField(`Envie de supporter le bot ?`, `[Cliquez ici afin de faire un don !](https://paypal.com/paypalme/VSemana)`, true)
            .setURL(client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setTimestamp()
            .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }));

        message.channel.send(embed);
    },
};