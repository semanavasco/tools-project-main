const Discord = require('discord.js');

module.exports = {
    name: 'resume',
    description: 'Fais le bot reprendre sa chanson.',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    aliases: ['r'],
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
            const queue = client.distube.getQueue(message)
            if (!queue) {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas trouvé de musique \`en cours de lecture\`.`)
                    .setColor('d10000')
                );
            }

            client.distube.resume(message);
            message.channel.send(new Discord.MessageEmbed()
                .setDescription(`<:icone_verified:824290381435895818> | ${message.author} musique reprise avec succés.`)
                .setColor('14b321')
            );
        }
    },
};