const Discord = require('discord.js');

module.exports = {
    name: 'join',
    description: 'Fais le bot rejoindre ton salon vocal.',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    aliases: ['j'],
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

            channel.join().then(connection => {
                connection.voice.setSelfDeaf(true);
            });

            message.channel.send(new Discord.MessageEmbed()
                .setDescription(`<:icone_rejoint:824290384250667079> | ${message.author} salon vocal rejoint avec succés.`)
                .setColor('14b321')
            );
        }
    },
};