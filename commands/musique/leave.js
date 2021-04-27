const Discord = require('discord.js');

module.exports = {
    name: 'leave',
    description: 'Fais le bot quitter ton salon vocal.',
    usage: '',
    guildOnly: false,
    aliases: ['quit', 'disconect'],
    cooldown: 5,
    execute(client, message, args) {
        if (!message.member.voice.channel) {
            return message.channel.send(new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Vous devez être dans un \`salon vocal\` pour effectuer cette commande.`)
                .setColor('d10000')
            );
        }
        else if (message.member.voice.channel.id !== client.member.voice.channel.id) {
            return message.channel.send(new MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Vous devez être dans le \`même salon vocal que le bot\` pour effectuer cette commande.`)
                .setColor('d10000')
            );
        }
        else {
            const channel = message.member.voice.channel;

            channel.leave();

            message.channel.send(new Discord.MessageEmbed()
                .setDescription(`<:icone_verified:824290381435895818> | ${message.author} salon vocal quitté avec succés.`)
                .setColor('14b321')
            );
        }
    },
};