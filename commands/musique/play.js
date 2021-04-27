const Discord = require('discord.js');

module.exports = {
    name: 'play',
    description: 'Fais le bot chanter.',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    aliases: ['p'],
    args: true,
    execute(client, message, args) {
        if (!message.member.voice.channel) {
            message.channel.send(new Discord.MessageEmbed()
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
            const music = args.join(' ');

            client.distube.play(message, music);
        }
    },
};