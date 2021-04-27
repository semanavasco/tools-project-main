const Discord = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Envoie le message avec le bot !',
    usage: '<texte>',
    guildOnly: true,
    cooldown: 30,
    args: true,
    aliases: ["dit"],
    execute(client, message, args) {
        message.delete();

        let texte = args.slice(0).join(' ');

        message.channel.send(texte);
    },
};